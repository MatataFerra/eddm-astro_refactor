// Los cortes del día en horas locales. Son los mismos que usa el script del <head> de
// Layout.astro para elegir la luz de la página: si cambian, cambian en los dos lados.
export const DAWN_START = 6;
export const DAY_START = 9;
export const DUSK_START = 18;
export const NIGHT_START = 21;

/** Lo disparan el panel del cielo de desarrollo (SkyControls.astro) y el selector de luz cuando cambian la hora o la luz */
export const SKY_EVENT = 'eddm:sky';

export const PHASES = ['dawn', 'day', 'dusk', 'night'] as const;
export type Phase = (typeof PHASES)[number];

/** La luz que eligió el lector (LightPicker.astro). El script del <head> repite la clave. */
export const LIGHT_KEY = 'eddm_light';

export function isPhase(value: unknown): value is Phase {
  return PHASES.includes(value as Phase);
}

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
