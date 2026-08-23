// lib/bento.ts

import type { MediaItem } from '@/lib/interfaces/media';

export type BentoSlot = {
  span: string;
  aspect: string;
  featured?: boolean;
};

export type BentoRow =
  | {
      type: 'double';
      items: MediaItem[];
    }
  | {
      type: 'feature';
      items: MediaItem[];
      reversed?: boolean;
    }
  | {
      type: 'footer';
      items: MediaItem[];
    };

export function buildBentoRows(items: MediaItem[]): BentoRow[] {
  const rows: BentoRow[] = [];

  let i = 0;
  let featureIndex = 0;

  while (i < items.length) {
    const remaining = items.length - i;

    if (remaining === 1) {
      rows.push({
        type: 'footer',
        items: [items[i]],
      });

      break;
    }

    // FEATURE BLOCK
    if (remaining >= 3 && i > 0 && i % 4 === 0) {
      rows.push({
        type: 'feature',
        items: [items[i], items[i + 1], items[i + 2]],
        reversed: featureIndex % 2 === 1,
      });

      featureIndex++;
      i += 3;
      continue;
    }

    rows.push({
      type: 'double',
      items: [items[i], items[i + 1]],
    });

    i += 2;
  }

  return rows;
}
