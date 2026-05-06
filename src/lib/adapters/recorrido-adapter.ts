import type { ParadaUI } from '@/components/recorrido/svelte/view.svelte';
import type { Trip } from '@/lib/interfaces/recorrido';

function calcularDistanciaKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}
function obtenerBandera(pais: string): string {
  const banderas: Record<string, string> = {
    Argentina: '🇦🇷',
    Italia: '🇮🇹',
    'Nueva Zelanda': '🇳🇿',
    'New Zealand': '🇳🇿',
    Australia: '🇦🇺',
    Japón: '🇯🇵',
    España: '🇪🇸',
    Francia: '🇫🇷',
    default: '📍',
    Indonesia: '🇮🇩',
    Tailandia: '🇹🇭',
    Filipinas: '🇵🇭',
    Japon: '🇯🇵',
    'Korea del Sur': '🇰🇷',
    'South Korea': '🇰🇷',
    China: '🇨🇳',
  };
  return banderas[pais] || banderas['default'];
}

export function adaptTripToParadas(trip: Trip | undefined): ParadaUI[] {
  if (!trip || !trip.stops || trip.stops.length === 0) return [];

  const stopsOrdenadas = [...trip.stops].sort((a, b) => a.order - b.order);
  const paradas: ParadaUI[] = [];

  let kmAcumulados = 0;
  const origen = stopsOrdenadas[0];

  stopsOrdenadas.forEach((stop, index) => {
    const isOrigen = index === 0;
    let kmEtapa = 0;
    let kmDesdeOrigen = 0;

    if (!isOrigen) {
      const prevStop = stopsOrdenadas[index - 1];
      kmEtapa = calcularDistanciaKm(
        prevStop.latitude,
        prevStop.longitude,
        stop.latitude,
        stop.longitude
      );
      kmAcumulados += kmEtapa;

      kmDesdeOrigen = calcularDistanciaKm(
        origen.latitude,
        origen.longitude,
        stop.latitude,
        stop.longitude
      );
    }

    paradas.push({
      id: stop.id,
      lugar: stop.city,
      pais: stop.country,
      flag: obtenerBandera(stop.country),
      fecha: stop.arrivalDate
        ? new Date(stop.arrivalDate).toLocaleDateString('es-AR', {
            year: 'numeric',
            month: 'short',
          })
        : 'Fecha desconocida',
      year: new Date(stop.arrivalDate ?? new Date()).getFullYear(),
      descripcion: stop.description || '',
      cover: stop.stopImage || null,
      semanas: [],
      kmDesdeOrigen,
      kmEtapa,
      kmAcumulados,
      tipo: isOrigen ? 'origen' : 'destino',
    });
  });

  return paradas;
}
