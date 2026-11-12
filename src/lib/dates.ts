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
