import type { ContentNavigate } from '@/lib/interfaces/share';

export type Neighbor = { title: string; href: string } | null;

/** Anterior y siguiente de cada escrito, en el orden de su sección */
export function withNeighbors(entries: ContentNavigate[], href: (slug: string) => string) {
  const sorted = [...entries].sort((a, b) => (a.order || 0) - (b.order || 0));
  const toNeighbor = (entry: ContentNavigate | undefined): Neighbor =>
    entry ? { title: entry.title, href: href(entry.slug) } : null;

  return sorted.map((entry, index) => ({
    slug: entry.slug,
    prev: toNeighbor(sorted[index - 1]),
    next: toNeighbor(sorted[index + 1]),
  }));
}
