import { placeKey, type TripWeek } from '@/lib/adapters/trip-adapter';
import type { Trip, TripStop } from '@/lib/interfaces/recorrido';

// Algunos países se cargaron en inglés o sin tilde
const COUNTRY_NAMES: Record<string, string> = {
  'New Zealand': 'Nueva Zelanda',
  Japon: 'Japón',
  Corea: 'Corea del Sur',
  'Korea del Sur': 'Corea del Sur',
  'South Korea': 'Corea del Sur',
};

export type RouteStop = {
  id: string;
  city: string;
  country: string;
  /** ISO, sólo fecha */
  date: string | null;
  text: string;
  photo: string | null;
  mapsUrl: string | null;
  coordinates: [longitude: number, latitude: number];
  /** Las semanas del viaje que cuentan esta parada */
  weeks: Pick<TripWeek, 'title' | 'href'>[];
};

/** Un tramo: las paradas seguidas en un mismo país */
export type RouteLeg = {
  country: string;
  from: string | null;
  to: string | null;
  stops: RouteStop[];
};

export type Route = {
  legs: RouteLeg[];
  stops: RouteStop[];
  countries: number;
  /** Kilómetros, redondeados */
  distance: number;
  since: string | null;
};

const countryName = (country: string) => COUNTRY_NAMES[country.trim()] ?? country.trim();

/**
 * La fecha de llegada se guarda como la medianoche del lugar donde la cargué (de UTC-3 a UTC+9),
 * así que el día es la medianoche UTC más cercana.
 */
export function arrivalDay(value: TripStop['arrivalDate']): string | null {
  if (!value) return null;
  const time = new Date(value).getTime();
  if (Number.isNaN(time)) return null;
  const DAY = 86_400_000;
  return new Date(Math.round(time / DAY) * DAY).toISOString().slice(0, 10);
}

/**
 * Cada semana va a la parada con su nombre a la que ya había llegado; si llegué más de una vez, a la
 * última antes de la semana.
 */
function weeksByStop(stops: RouteStop[], weeks: TripWeek[]) {
  const found = new Map<string, RouteStop['weeks']>();
  for (const week of weeks) {
    if (!week.to) continue;
    for (const place of new Set(week.places.map((p) => placeKey(p.name)))) {
      const stop = stops
        .filter((s) => placeKey(s.city) === place && s.date && s.date <= week.to!)
        .at(-1);
      if (!stop) continue;
      found.set(stop.id, [...(found.get(stop.id) ?? []), { title: week.title, href: week.href }]);
    }
  }
  return found;
}

export function adaptRoute(trip: Trip | null | undefined, weeks: TripWeek[]): Route {
  const stops: RouteStop[] = [...(trip?.stops ?? [])]
    .sort((a, b) => a.order - b.order)
    .map((stop) => ({
      id: stop.id,
      city: stop.city.trim(),
      country: countryName(stop.country),
      date: arrivalDay(stop.arrivalDate),
      text: stop.description?.trim() ?? '',
      photo: stop.stopImage || null,
      mapsUrl: stop.googleMapsUrl || null,
      coordinates: [stop.longitude, stop.latitude],
      weeks: [],
    }));

  const found = weeksByStop(stops, weeks);
  for (const stop of stops) stop.weeks = found.get(stop.id) ?? [];

  const legs: RouteLeg[] = [];
  for (const stop of stops) {
    const last = legs.at(-1);
    if (last && last.country === stop.country) {
      last.stops.push(stop);
      last.to = stop.date ?? last.to;
    } else {
      legs.push({ country: stop.country, from: stop.date, to: stop.date, stops: [stop] });
    }
  }

  return {
    legs,
    stops,
    countries: new Set(stops.map((stop) => stop.country)).size,
    distance: Math.round(trip?.totalDistance ?? 0),
    since: stops[0]?.date ?? null,
  };
}
