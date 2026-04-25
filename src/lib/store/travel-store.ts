import { atom, computed } from 'nanostores';
import type { ContentNavigate } from '@/lib/interfaces/share';

export const MONTHS_ORDERED = [
  'context',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
  'enero',
  'febrero-25',
];

export const allArticles = atom<ContentNavigate[]>([]);
export const selectedMonth = atom<string>('todos');

export const filteredArticles = computed([allArticles, selectedMonth], (articles, month) => {
  const filtered =
    month === 'todos'
      ? articles
      : articles.filter((art) => art.category?.name.toLowerCase() === month.toLowerCase());

  // Lógica de ordenación cronológica profunda
  return [...filtered].sort((a, b) => {
    const monthA = a.category?.name.toLowerCase() || '';
    const monthB = b.category?.name.toLowerCase() || '';

    const indexA = MONTHS_ORDERED.indexOf(monthA);
    const indexB = MONTHS_ORDERED.indexOf(monthB);

    if (indexA === indexB) {
      return (a.order ?? 0) - (b.order ?? 0);
    }

    return indexA - indexB;
  });
});
