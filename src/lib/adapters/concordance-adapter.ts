import { getContentNavigate } from '@/lib/api/get-content-navigate';
import { getArticleContentFromNotion } from '@/lib/api/get-notion-content';
import { getTrip } from '@/lib/api/get-trip';
import { APP_ROUTER } from '@/lib/constants';
import { adaptLetters, LETTER_KIND_LABEL } from '@/lib/adapters/home-adapter';
import { buildConcordance, type Concordance, type ConcordanceSource } from '@/lib/concordance';
import type { ContentBySlug, ContentNavigate } from '@/lib/interfaces/share';
import type { Article } from '@/lib/interfaces/articles';
import type { Trip } from '@/lib/interfaces/recorrido';

// Pedidos a Notion de a pocos: son unos sesenta textos y corre sólo en el build
const CONCURRENCY = 6;

async function mapLimited<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>) {
  const results: R[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index]);
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function loadConcordance(): Promise<Concordance> {
  const [tales, poems, further, articles, trip] = await Promise.all([
    getContentNavigate<ContentNavigate[]>('tales'),
    getContentNavigate<ContentNavigate[]>('poems'),
    getContentNavigate<ContentNavigate[]>('further'),
    getContentNavigate<ContentNavigate[]>('articles'),
    getTrip<Trip>(),
  ]);

  const letters = adaptLetters({
    tales: tales?.data ?? [],
    poems: poems?.data ?? [],
    further: further?.data ?? [],
  });
  const items = [
    ...letters.map((letter) => ({
      slug: letter.slug,
      title: letter.title,
      href: letter.href,
      kind: LETTER_KIND_LABEL[letter.kind],
    })),
    ...[...(articles?.data ?? [])]
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((article) => ({
        slug: article.slug,
        title: article.title,
        href: APP_ROUTER.ARTICLE(article.slug),
        kind: 'El viaje',
      })),
  ];

  const sources = await mapLimited(items, CONCURRENCY, async (item) => {
    const content = await getArticleContentFromNotion<ContentBySlug<Article>>({ query: item.slug });
    const markdown = content?.data?.md_content ?? '';
    return { title: item.title, href: item.href, kind: item.kind, markdown };
  });

  const places = [...new Set((trip?.data?.stops ?? []).map((stop) => stop.city.trim()))];

  return buildConcordance(
    sources.filter((source): source is ConcordanceSource => Boolean(source.markdown)),
    places
  );
}

// La página y el JSON la usan en el mismo build: se calcula una sola vez
let cached: Promise<Concordance> | null = null;

export function getConcordance(): Promise<Concordance> {
  cached ??= loadConcordance();
  return cached;
}
