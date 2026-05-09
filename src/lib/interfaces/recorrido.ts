export interface TripStop {
  id: string;
  tripId: string;
  country: string;
  city: string;
  latitude: number;
  longitude: number;
  googleMapsUrl?: string;
  order: number;
  arrivalDate: string | Date | null;
  description: string | null;
  stopImage: string | null;
}

export interface Trip {
  id: string;
  title: string;
  description: string | null;
  totalDistance: number;
  createdAt: string;
  updatedAt: string;
  stops: TripStop[];
}

export type ParadaUI = {
  id: string | number;
  lugar: string;
  pais: string;
  flag: string;
  fecha: string;
  year: number;
  kmDesdeOrigen: number;
  kmEtapa: number;
  kmAcumulados: number;
  cover: string | null;
  descripcion: string;
  tipo: 'origen' | 'destino' | 'proximo';
  semanas: string[];
  googleMapsUrl?: string;
};
