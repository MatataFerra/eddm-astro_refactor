import { APP_ROUTER } from '@/lib/constants';
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

/** La foto del hero: la del lugar, si no la de la parada con el mismo nombre, si no ninguna */
export function placePhoto(location: Location | null, stops: TripStop[]): string | null {
  if (!location) return null;
  if (location.metadata?.image) return location.metadata.image;
  const name = location.name.trim().toLowerCase();
  return stops.find((stop) => stop.city.trim().toLowerCase() === name)?.stopImage ?? null;
}
