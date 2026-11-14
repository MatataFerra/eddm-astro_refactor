import { getContentNavigate } from '@/lib/api/get-content-navigate';
import { getCurrentLocation } from '@/lib/api/get-current-location';
import { adaptLetters, type Letter, type LetterKind } from '@/lib/adapters/home-adapter';
import type { ContentNavigate } from '@/lib/interfaces/share';
import type { Location } from '@/lib/interfaces/location';

export type LettersIndexData = {
  letters: Letter[];
  tripWeeks: number;
  timeZone?: string;
};

/** Lo que necesita cualquier índice de cartas; `kind` lo filtra a un solo tipo */
export async function loadLettersIndex(kind: LetterKind | null): Promise<LettersIndexData> {
  const [tales, poems, further, articles, location] = await Promise.all([
    getContentNavigate<ContentNavigate[]>('tales'),
    getContentNavigate<ContentNavigate[]>('poems'),
    getContentNavigate<ContentNavigate[]>('further'),
    getContentNavigate<ContentNavigate[]>('articles'),
    getCurrentLocation<Location>(),
  ]);

  const letters = adaptLetters({
    tales: tales?.data ?? [],
    poems: poems?.data ?? [],
    further: further?.data ?? [],
  });

  return {
    letters: kind ? letters.filter((letter) => letter.kind === kind) : letters,
    tripWeeks: articles?.data?.length ?? 0,
    timeZone: location?.data?.metadata?.timeZone,
  };
}
