import { getContentNavigate } from '@/lib/api/get-content-navigate';
import { getArticleContentFromNotion } from '@/lib/api/get-notion-content';
import { APP_ROUTER } from '@/lib/constants';
import { mapLimited } from '@/lib/async';
import type { Article } from '@/lib/interfaces/articles';
import type { ContentBySlug, ContentNavigate } from '@/lib/interfaces/share';
import type { ProcessedSection } from '@/lib/markdown/process';

// Las semanas van por mes (la categoría) y dentro de cada mes por `order`
const MONTH_ORDER = [
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
  'enero-25',
  'febrero-25',
];

const MONTHS = [
  'enero',
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
];

const PROLOGUE_PLACE = 'Antes de salir';

export type TripPlace = { name: string; photo: string | null };

export type TripWeek = {
  slug: string;
  title: string;
  href: string;
  /** Primer y último día de la semana (ISO, sólo fecha) */
  from: string | null;
  to: string | null;
  cover: string | null;
  /** Los lugares que cargué para esa semana, en su orden */
  places: TripPlace[];
};

export type TripBundle = {
  place: string;
  from: string | null;
  to: string | null;
  photo: string | null;
  weeks: TripWeek[];
  /** Lugares que visité mientras vivía en `place` */
  outings: string[];
};

export type TripDay = {
  title: string | undefined;
  /** ISO, sólo fecha; null si el título no es una fecha */
  date: string | null;
  place: string | null;
  html: string;
  media: ProcessedSection['media'];
};

const monthRank = (entry: ContentNavigate) => {
  const rank = MONTH_ORDER.indexOf(entry.category?.name.toLowerCase() ?? '');
  return rank === -1 ? MONTH_ORDER.length : rank;
};

/** Las semanas del viaje en el orden en que se leen */
export function sortTripEntries(entries: ContentNavigate[]): ContentNavigate[] {
  return [...entries].sort(
    (a, b) => monthRank(a) - monthRank(b) || (a.order || 0) - (b.order || 0)
  );
}

const toIso = ([, day, month, year]: RegExpMatchArray) => {
  const fullYear = year.length === 2 ? `20${year}` : year;
  return `${fullYear}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
};

/** "Desde el 15/05/2024 al 21/05/2024" → { from: "2024-05-15", to: "2024-05-21" } */
export function parseWeekRange(summary: string | null | undefined) {
  const dates = [...(summary ?? '').matchAll(/(\d{1,2})\/(\d{1,2})\/(\d{2,4})/g)].map(toIso);
  return { from: dates[0] ?? null, to: dates[1] ?? dates[0] ?? null };
}

/** Para comparar nombres de lugares: "KatiKati" y "Katikati" son el mismo */
export const placeKey = (name: string) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

/** "gisborne" → "Gisborne"; lo que ya trae mayúsculas queda como está */
const displayPlace = (name: string) => {
  const trimmed = name.trim();
  return trimmed === trimmed.toLowerCase()
    ? trimmed.replace(
        /(^|[\s-])(\p{L})/gu,
        (_, sep: string, letter: string) => sep + letter.toUpperCase()
      )
    : trimmed;
};

export function adaptWeekPlaces(geolocations: Article['geolocations']): TripPlace[] {
  return (geolocations ?? []).map(({ geolocation }) => ({
    name: displayPlace(geolocation.location),
    photo: geolocation.metadata?.imgUrl || null,
  }));
}

export function adaptTripWeek(entry: ContentNavigate, places: TripPlace[]): TripWeek {
  return {
    slug: entry.slug,
    title: entry.title,
    href: APP_ROUTER.ARTICLE(entry.slug),
    ...parseWeekRange(entry.summary),
    cover: entry.header?.url || null,
    places,
  };
}

/**
 * Las semanas agrupadas por el lugar donde vivía. La base de cada semana es, de sus lugares, el que
 * más se repite en todo el viaje: así una escapada a Cathedral Cove no corta los meses en Katikati.
 */
export function adaptTripBundles(weeks: TripWeek[]): TripBundle[] {
  const weeksPerPlace = new Map<string, number>();
  for (const week of weeks) {
    for (const key of new Set(week.places.map((place) => placeKey(place.name)))) {
      weeksPerPlace.set(key, (weeksPerPlace.get(key) ?? 0) + 1);
    }
  }

  const baseOf = (week: TripWeek): TripPlace | null =>
    week.places.reduce<TripPlace | null>((best, place) => {
      const count = weeksPerPlace.get(placeKey(place.name)) ?? 0;
      return !best || count > (weeksPerPlace.get(placeKey(best.name)) ?? 0) ? place : best;
    }, null);

  const bundles: TripBundle[] = [];
  for (const week of weeks) {
    const base = baseOf(week);
    const place = base?.name ?? PROLOGUE_PLACE;
    const last = bundles.at(-1);

    if (last && placeKey(last.place) === placeKey(place)) {
      last.weeks.push(week);
      last.to = week.to ?? last.to;
      last.photo ??= base?.photo ?? null;
    } else {
      bundles.push({
        place,
        from: week.from,
        to: week.to,
        photo: base?.photo ?? week.cover,
        weeks: [week],
        outings: [],
      });
    }
  }

  // Las escapadas: los lugares de cada grupo que no son la base de ningún grupo
  const bases = new Set(bundles.map((bundle) => placeKey(bundle.place)));
  for (const bundle of bundles) {
    const seen = new Set<string>();
    bundle.outings = bundle.weeks
      .flatMap((week) => week.places)
      .filter((place) => {
        const key = placeKey(place.name);
        if (bases.has(key) || seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .map((place) => place.name);
  }

  return bundles;
}

/**
 * "16 de Febrero" → "2024-02-16", con el año de la semana. Si la semana empieza en diciembre y el
 * día es de enero, es del año siguiente.
 */
export function parseDayTitle(title: string | undefined, weekFrom: string | null): string | null {
  const match = title?.trim().match(/^(\d{1,2})\s+de\s+(\p{L}+)(?:\s+(?:de\s+)?(\d{4}))?/iu);
  if (!match || !weekFrom) return null;
  const month = MONTHS.indexOf(match[2].toLowerCase()) + 1;
  if (!month) return null;

  const [weekYear, weekMonth] = weekFrom.split('-').map(Number);
  const year = match[3] ? Number(match[3]) : month < weekMonth ? weekYear + 1 : weekYear;
  return `${year}-${String(month).padStart(2, '0')}-${match[1].padStart(2, '0')}`;
}

/**
 * El lugar de un día: si la semana tiene un solo lugar, ése; si tiene varios, sólo el que el día
 * nombra. Si no lo nombra, el día queda sin lugar antes que con uno equivocado.
 */
export function placeForDay(text: string, places: TripPlace[]): string | null {
  if (places.length === 1) return places[0].name;
  const haystack = placeKey(text);
  return places.find((place) => haystack.includes(placeKey(place.name)))?.name ?? null;
}

/**
 * Cada día de la semana como una carta: su fecha, su lugar y su texto. Si los días traen fecha, el
 * rango de la semana sale de ellos (el resumen a veces arranca un par de días después).
 */
export async function adaptWeekDays(sections: ProcessedSection[], week: TripWeek) {
  const days: TripDay[] = await Promise.all(
    sections.map(async (section) => {
      const html = await section.htmlContent;
      const date = parseDayTitle(section.title, week.from);
      const text = `${section.title ?? ''} ${html.replace(/<[^>]+>/g, ' ')}`;
      return {
        title: section.title,
        date,
        place: date ? placeForDay(text, week.places) : null,
        html,
        media: section.media,
      };
    })
  );

  const dates = days.flatMap((day) => (day.date ? [day.date] : [])).sort();
  const range = dates.length ? { from: dates[0], to: dates[dates.length - 1] } : {};
  return { days, week: { ...week, ...range } };
}

export type TripWeekText = { week: TripWeek; markdown: string };

async function loadTrip(): Promise<TripWeekText[]> {
  const articles = await getContentNavigate<ContentNavigate[]>('articles');

  // Pedidos a Notion de a pocos: son unas cuarenta semanas y corre sólo en el build
  return mapLimited(sortTripEntries(articles?.data ?? []), 3, async (entry) => {
    const content = await getArticleContentFromNotion<ContentBySlug<Article>>({
      query: entry.slug,
    });
    return {
      week: adaptTripWeek(entry, adaptWeekPlaces(content?.data?.geolocations ?? null)),
      markdown: content?.data?.md_content ?? '',
    };
  });
}

// La home, /viaje y la concordancia lo usan en el mismo build: se pide una sola vez
let cached: Promise<TripWeekText[]> | null = null;

export function getTripWeeks(): Promise<TripWeekText[]> {
  cached ??= loadTrip();
  return cached;
}
