import { APP_ROUTER } from '@/lib/constants';
import { adaptArticlesToMeses } from '@/lib/adapters/viaje-adapter';
import type { ContentNavigate } from '@/lib/interfaces/share';
import type { Location } from '@/lib/interfaces/location';
import type { TripStop } from '@/lib/interfaces/recorrido';

export type LetterKind = 'relato' | 'poema' | 'historia';

export type Letter = {
  kind: LetterKind;
  slug: string;
  href: string;
  title: string;
  /** ISO; ordena las cartas y arma su fecha */
  createdAt: string;
  /** Lugar desde donde se escribió, si se sabe (hoy sólo los poemas lo traen) */
  place: string | null;
};

export const LETTER_KIND_LABEL: Record<LetterKind, string> = {
  relato: 'Relato',
  poema: 'Poema',
  historia: 'Más acá en el tiempo',
};

/** "Te mando lo último que escribí, un poema:" */
export const LETTER_KIND_PHRASE: Record<LetterKind, string> = {
  relato: 'un relato',
  poema: 'un poema',
  historia: 'una historia de Más acá en el tiempo',
};

const toLetters = (
  entries: ContentNavigate[],
  kind: LetterKind,
  href: (slug: string) => string
): Letter[] =>
  entries.flatMap((entry) =>
    entry.createdAt
      ? [
          {
            kind,
            slug: entry.slug,
            href: href(entry.slug),
            title: entry.title,
            createdAt: new Date(entry.createdAt).toISOString(),
            place: kind === 'poema' ? entry.description?.trim() || null : null,
          },
        ]
      : []
  );

/** Todos los escritos (no el viaje), de lo más nuevo a lo más viejo */
export function adaptLetters(sections: {
  tales: ContentNavigate[];
  poems: ContentNavigate[];
  further: ContentNavigate[];
}): Letter[] {
  return [
    ...toLetters(sections.tales, 'relato', APP_ROUTER.TALE),
    ...toLetters(sections.poems, 'poema', APP_ROUTER.POEM),
    ...toLetters(sections.further, 'historia', APP_ROUTER.FURTHER_TIME_ARTICLE),
  ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export type TripWeek = { slug: string; title: string; href: string };

export type TripBundle = {
  place: string;
  /** Inicio de la primera y de la última semana del grupo (ISO, sólo fecha) */
  from: string | null;
  to: string | null;
  cover: string | null;
  weeks: TripWeek[];
};

/** "Desde el 15/05/2024 al 21/05/2024" → "2024-05-15". Acepta años de dos cifras. */
export function parseWeekStart(summary: string | null | undefined): string | null {
  const match = summary?.match(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/);
  if (!match) return null;
  const [, day, month, year] = match;
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

const isoDay = (date: string | Date | null): string | null =>
  date ? new Date(date).toISOString().slice(0, 10) : null;

/** La última parada a la que había llegado en esa fecha */
function stopAt(date: string, stops: TripStop[]): TripStop | null {
  let current: TripStop | null = null;
  for (const stop of stops) {
    const arrival = isoDay(stop.arrivalDate);
    if (arrival && arrival <= date) current = stop;
  }
  return current;
}

const PROLOGUE_PLACE = 'Antes de salir';

/**
 * Las semanas del viaje en orden, agrupadas por el lugar desde donde las escribí. El lugar sale de
 * la fecha de cada semana cruzada con la llegada a cada parada: es aproximado cuando una semana
 * pasa por dos lugares.
 */
export function adaptTripBundles(articles: ContentNavigate[], stops: TripStop[]): TripBundle[] {
  const ordered = [...stops].sort((a, b) => a.order - b.order);
  const bundles: TripBundle[] = [];

  for (const mes of adaptArticlesToMeses(articles)) {
    for (const semana of mes.semanas) {
      const article = articles.find((a) => a.slug === semana.slug);
      const start = parseWeekStart(article?.summary);
      const place = start ? (stopAt(start, ordered)?.city ?? PROLOGUE_PLACE) : PROLOGUE_PLACE;
      const week = {
        slug: semana.slug,
        title: semana.titulo,
        href: APP_ROUTER.ARTICLE(semana.slug),
      };
      const last = bundles.at(-1);

      if (last && last.place === place) {
        last.weeks.push(week);
        last.to = start ?? last.to;
      } else {
        bundles.push({ place, from: start, to: start, cover: semana.cover || null, weeks: [week] });
      }
    }
  }

  return bundles;
}

/** La foto del hero: la del lugar, si no la de la parada con el mismo nombre, si no ninguna */
export function placePhoto(location: Location | null, stops: TripStop[]): string | null {
  if (!location) return null;
  if (location.metadata?.image) return location.metadata.image;
  const name = location.name.trim().toLowerCase();
  return stops.find((stop) => stop.city.trim().toLowerCase() === name)?.stopImage ?? null;
}
