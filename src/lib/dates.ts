const longDate = (timeZone: string) =>
  new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'long', year: 'numeric', timeZone });

// "10 de noviembre de 2026". Una fecha sola ("2024-03-01") se lee en UTC para no correrse un día.
export function formatLongDate(date: Date | string, timeZone?: string): string {
  if (typeof date === 'string') {
    const dateOnly = /^\d{4}-\d{2}-\d{2}$/.test(date);
    return longDate(dateOnly ? 'UTC' : (timeZone ?? 'UTC')).format(
      new Date(dateOnly ? `${date}T00:00:00Z` : date)
    );
  }

  return longDate(timeZone ?? 'UTC').format(date);
}

const utc = (date: string) => new Date(`${date}T00:00:00Z`);
const part = (options: Intl.DateTimeFormatOptions) => (date: string) =>
  new Intl.DateTimeFormat('es-AR', { ...options, timeZone: 'UTC' }).format(utc(date));
const dayOf = part({ day: 'numeric' });
const monthOf = part({ month: 'long' });
const yearOf = part({ year: 'numeric' });

/** "18 al 22 de febrero", "29 de julio al 3 de agosto". Fechas ISO sin hora. */
export function formatDayRange(from: string, to: string | null): string {
  if (!to || to === from) return `${dayOf(from)} de ${monthOf(from)}`;
  return monthOf(from) === monthOf(to)
    ? `${dayOf(from)} al ${dayOf(to)} de ${monthOf(to)}`
    : `${dayOf(from)} de ${monthOf(from)} al ${dayOf(to)} de ${monthOf(to)}`;
}

/** "febrero de 2024", "julio a noviembre de 2024", "noviembre de 2024 a enero de 2025" */
export function formatMonthRange(from: string, to: string | null): string {
  const end = to ?? from;
  if (yearOf(from) !== yearOf(end)) {
    return `${monthOf(from)} de ${yearOf(from)} a ${monthOf(end)} de ${yearOf(end)}`;
  }
  return monthOf(from) === monthOf(end)
    ? `${monthOf(from)} de ${yearOf(from)}`
    : `${monthOf(from)} a ${monthOf(end)} de ${yearOf(end)}`;
}
