// Los cortes del día en horas locales. Son los mismos que usa el script del <head> de
// Layout.astro para elegir la luz de la página: si cambian, cambian en los dos lados.
export const DAWN_START = 6;
export const DAY_START = 9;
export const DUSK_START = 18;
export const NIGHT_START = 21;

/** Lo dispara el panel del cielo de desarrollo (SkyControls.astro) cuando fija otra hora o luz */
export const SKY_EVENT = 'eddm:sky';

/** La hora de allá, salvo que el panel de desarrollo haya fijado otra en `data-dev-hour` */
export function hourNow(timeZone: string): number {
  const forced = document.documentElement.dataset.devHour;
  return forced ? Number(forced) : hourIn(timeZone);
}

/** 14.5 → "14:30" */
export function formatHour(hour: number): string {
  const minutes = Math.floor(hour * 60) % (24 * 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}`;
}

/** Hora local con decimales (14:30 → 14.5) en la zona dada */
export function hourIn(timeZone: string, now = new Date()): number {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: 'numeric',
    minute: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(now);
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? 0);
  return get('hour') + get('minute') / 60;
}
