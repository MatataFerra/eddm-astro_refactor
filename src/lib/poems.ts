import type { ContentNavigate } from '@/lib/interfaces/share';

export interface Poema {
  slug: string;
  title: string;
  /** Fragmento para el listado (viene de `summary`, con saltos de línea) */
  excerpt: string;
  place?: string;
  date?: string;
  featured?: boolean;
}

export function formatPoemaDate(date: Date | string | null | undefined): string | undefined {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' });
}

export function poemaMeta(p: Pick<Poema, 'place' | 'date'>): string {
  return [p.place, p.date].filter(Boolean).join(' · ');
}

/** Devuelve el destacado (o el primero) y el resto */
export function splitFeatured(poemas: Poema[]): { featured?: Poema; rest: Poema[] } {
  const featured = poemas.find((p) => p.featured) ?? poemas[0];
  return { featured, rest: poemas.filter((p) => p !== featured) };
}

/** ContentNavigate → Poema (no necesita `content`) */
export function toPoema(
  item: Pick<ContentNavigate, 'slug' | 'title' | 'summary' | 'createdAt'>,
  place?: string | null
): Poema {
  return {
    slug: item.slug,
    title: item.title,
    excerpt: item.summary?.trim() ?? '',
    place: place ?? undefined,
    date: formatPoemaDate(item.createdAt),
  };
}
