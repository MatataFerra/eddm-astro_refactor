// stores/recorrido.ts

import { atom, computed } from 'nanostores';
import type { ParadaUI } from '@/lib/interfaces/recorrido';

export const paradasStore = atom<ParadaUI[]>([]);

export const filterPaisStore = atom('Todos');
export const filterYearStore = atom('Todos');

export const filteredParadasStore = computed(
  [paradasStore, filterPaisStore, filterYearStore],
  (paradas, pais, year) => {
    return paradas.filter((p) => {
      const pasaPais = pais === 'Todos' || p.pais === pais || p.tipo === 'origen';

      const pasaAno = year === 'Todos' || p.year.toString() === year;

      return pasaPais && pasaAno;
    });
  }
);

export const totalKmStore = computed(paradasStore, (paradas) => {
  return paradas[paradas.length - 1]?.kmAcumulados || 0;
});

export const totalPaisesStore = computed(paradasStore, (paradas) => {
  return new Set(paradas.map((p) => p.pais)).size;
});

export const totalCiudadesStore = computed(paradasStore, (paradas) => {
  return paradas.filter((p) => p.tipo === 'destino').length;
});
