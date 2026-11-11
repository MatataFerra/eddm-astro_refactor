// La concordancia: cada palabra que uso seguido, con las frases donde aparece. Este módulo es
// puro (corre en el build y en el navegador); los textos los junta concordance-adapter.ts.

export type ConcordanceDoc = { title: string; href: string; kind: string };

/** [índice del texto, contexto izquierdo, la palabra tal como está escrita, contexto derecho] */
export type ConcordanceLine = [doc: number, left: string, word: string, right: string];

export type ConcordanceEntry = {
  /** Cómo se muestra: la forma más usada ("Mildura", "silencio") */
  word: string;
  /** Cómo se busca: minúsculas y sin tildes */
  key: string;
  count: number;
  place?: true;
  lines: ConcordanceLine[];
};

export type Concordance = {
  docs: ConcordanceDoc[];
  entries: ConcordanceEntry[];
  totalWords: number;
};

export type ConcordanceSource = ConcordanceDoc & { markdown: string };

const CONTEXT = 60;
const LINES_PER_ENTRY = 6;
const MAX_ENTRIES = 600;
const MIN_LENGTH = 4;
const MIN_COUNT = 3;
const MIN_DOCS = 2;

const STOPWORDS = new Set(
  `a al algo algunas algunos ante antes aquel aquella aquello aqui asi aun bien bueno cada casi
  como con contra cual cuando de del desde donde dos el ella ellas ello ellos en entre era eran eres
  es esa esas ese eso esos esta estaba estaban estamos estan estar estas este esto estos estoy fue
  fueron fui ha habia han has hasta hay haber hice hizo la las le les lo los mas me mi mis mucho
  muchos muy nada ni no nos nosotros o otra otras otro otros para pero poco por porque que quien
  se sea ser si sido siempre sin sobre solo son su sus tambien tan tanto te tenia tener tengo ti
  tiene tienen todo todos toda todas tu tus un una uno unos unas usted vez y ya yo voy vamos van
  iba ibamos hace hacer hacia puede podia pude dijo dice decir creo despues luego entonces
  mientras cosa cosas parte tipo medio mismo misma mejor menos tampoco gente estuvo estuve nadie
  queria tuve todavia ahi alla alli aca bastante tres habiamos hemos sigo seguimos nuestro nuestra
  nuestros nuestras habian estabamos teniamos fuimos hicimos dijimos cuatro cinco seis siete ocho
  nueve diez estaba estabamos cada sobre aunque tenemos tenes estas otra dije paso parece veces
  quizas ahora lado vino dijeron fueron estaban habia`.split(/\s+/)
);

const WORD = /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/g;

/** "Íbamos" → "ibamos": la clave con la que se agrupa y se busca */
export function normalizeWord(word: string): string {
  return word.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/** El texto que se lee, sin fotos, videos, links ni marcas de Markdown */
export function cleanMarkdown(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<(video|iframe|audio)[\s\S]*?<\/\1>/g, '')
    .replace(/<[^>]+>/g, '')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^#+\s*.*$/gm, '')
    .replace(/[*_]{1,3}([^*_\n]+)[*_]{1,3}/g, '$1')
    .split('\n')
    .filter((line) => !/^\s*[\w.-]*\.(webm|mp4|mov|jpe?g|png|webp)\s*$/i.test(line))
    .join('\n');
}

type Hit = { doc: number; paragraph: number; start: number; end: number };

export function buildConcordance(sources: ConcordanceSource[], places: string[]): Concordance {
  const paragraphs = sources.map((source) =>
    cleanMarkdown(source.markdown)
      .split(/\n\s*\n/)
      .map((p) =>
        p
          .replace(/\s*\n\s*/g, ' / ')
          .replace(/^(\s*\/\s*)+|(\s*\/\s*)+$/g, '')
          .trim()
      )
      .filter(Boolean)
  );

  const hits = new Map<string, Hit[]>();
  const forms = new Map<string, Map<string, number>>();
  let totalWords = 0;

  const add = (key: string, form: string, hit: Hit) => {
    hits.set(key, [...(hits.get(key) ?? []), hit]);
    const seen = forms.get(key) ?? new Map<string, number>();
    seen.set(form, (seen.get(form) ?? 0) + 1);
    forms.set(key, seen);
  };

  paragraphs.forEach((list, doc) =>
    list.forEach((text, paragraph) => {
      for (const match of text.matchAll(WORD)) {
        totalWords++;
        const key = normalizeWord(match[0]);
        if (key.length < MIN_LENGTH || STOPWORDS.has(key)) continue;
        const start = match.index ?? 0;
        add(key, match[0], { doc, paragraph, start, end: start + match[0].length });
      }
    })
  );

  // Los lugares del viaje son entradas propias, aunque tengan más de una palabra
  const placeKeys = new Set<string>();
  for (const place of places) {
    const key = normalizeWord(place);
    const pattern = new RegExp(`\\b${place.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const placeHits: Hit[] = [];
    paragraphs.forEach((list, doc) =>
      list.forEach((text, paragraph) => {
        for (const match of text.matchAll(pattern)) {
          const start = match.index ?? 0;
          placeHits.push({ doc, paragraph, start, end: start + match[0].length });
        }
      })
    );
    if (placeHits.length) {
      hits.set(key, placeHits);
      forms.set(key, new Map([[place, placeHits.length]]));
      placeKeys.add(key);
    }
  }

  const docsOf = (key: string) => new Set(hits.get(key)?.map((hit) => hit.doc)).size;
  const words = [...hits.keys()]
    .filter((key) => !placeKeys.has(key))
    .filter((key) => (hits.get(key)?.length ?? 0) >= MIN_COUNT && docsOf(key) >= MIN_DOCS)
    .sort((a, b) => (hits.get(b)?.length ?? 0) - (hits.get(a)?.length ?? 0))
    .slice(0, MAX_ENTRIES);

  const linesOf = (key: string): ConcordanceLine[] => {
    const seen = new Set<string>();
    const lines: ConcordanceLine[] = [];
    for (const { doc, paragraph, start, end } of hits.get(key) ?? []) {
      const id = `${doc}:${paragraph}`;
      if (seen.has(id)) continue;
      seen.add(id);
      const text = paragraphs[doc][paragraph];
      const left = (start > CONTEXT ? '…' : '') + text.slice(Math.max(0, start - CONTEXT), start);
      const right = text.slice(end, end + CONTEXT) + (end + CONTEXT < text.length ? '…' : '');
      lines.push([doc, left, text.slice(start, end), right]);
      if (lines.length >= LINES_PER_ENTRY) break;
    }
    return lines;
  };

  // La forma que más aparece; una mayúscula sólo por empezar oración no cuenta como nombre propio
  const mostUsedForm = (key: string) =>
    [...(forms.get(key) ?? new Map<string, number>()).entries()].sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] ?? key;

  const entries: ConcordanceEntry[] = [...words, ...placeKeys]
    .map((key) => ({
      word: mostUsedForm(key),
      key,
      count: hits.get(key)?.length ?? 0,
      ...(placeKeys.has(key) ? { place: true as const } : {}),
      lines: linesOf(key),
    }))
    .sort((a, b) => a.key.localeCompare(b.key, 'es'));

  return {
    docs: sources.map(({ title, href, kind }) => ({ title, href, kind })),
    entries,
    totalWords,
  };
}
