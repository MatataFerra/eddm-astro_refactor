import { getContentNavigate } from '@/lib/api/get-content-navigate';
import { getArticleContentFromNotion } from '@/lib/api/get-notion-content';
import { getTrip } from '@/lib/api/get-trip';
import { getTripWeeks } from '@/lib/adapters/trip-adapter';
import { mapLimited } from '@/lib/async';
import { adaptLetters, LETTER_KIND_LABEL } from '@/lib/adapters/home-adapter';
import { buildConcordance, type Concordance, type ConcordanceSource } from '@/lib/concordance';
import type { ContentBySlug, ContentNavigate } from '@/lib/interfaces/share';
import type { Article } from '@/lib/interfaces/articles';
import type { Trip } from '@/lib/interfaces/recorrido';

// Pedidos a Notion de a pocos (las semanas del viaje van en paralelo con otros tres)
const CONCURRENCY = 3;

async function loadConcordance(): Promise<Concordance> {
  const [tales, poems, further, trip, tripWeeks] = await Promise.all([
    getContentNavigate<ContentNavigate[]>('tales'),
    getContentNavigate<ContentNavigate[]>('poems'),
    getContentNavigate<ContentNavigate[]>('further'),
    getTrip<Trip>(),
    getTripWeeks(),
  ]);

  const letters = adaptLetters({
    tales: tales?.data ?? [],
    poems: poems?.data ?? [],
    further: further?.data ?? [],
  });

  const writings = await mapLimited(letters, CONCURRENCY, async (letter) => {
    const content = await getArticleContentFromNotion<ContentBySlug<Article>>({
      query: letter.slug,
    });
    return {
      title: letter.title,
      href: letter.href,
      kind: LETTER_KIND_LABEL[letter.kind],
      markdown: content?.data?.md_content ?? '',
    };
  });
  const weeks = tripWeeks.map(({ week, markdown }) => ({
    title: week.title,
    href: week.href,
    kind: 'El viaje',
    markdown,
  }));
  const sources = [...writings, ...weeks];

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
