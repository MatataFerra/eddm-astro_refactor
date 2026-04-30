// src/stores/viaje-store.ts
import { persistentAtom } from '@nanostores/persistent';

export const readWeeks = persistentAtom<string[]>('eddm_read', [], {
  encode: JSON.stringify,
  decode: JSON.parse,
});

export function toggleRead(id: string) {
  const current = readWeeks.get();
  if (current.includes(id)) {
    readWeeks.set(current.filter((i) => i !== id));
  } else {
    readWeeks.set([...current, id]);
  }
}
