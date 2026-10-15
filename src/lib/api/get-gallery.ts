import type { GalleryPlaceDetail, GalleryPlaceSummary } from '@/lib/interfaces/gallery';
import { fetchData } from '@/lib/fetch';
import { EXTERNAL_API_ENDPOINTS } from '../constants';

export const getGalleryPlaces = () =>
  fetchData<GalleryPlaceSummary[]>(EXTERNAL_API_ENDPOINTS.GALLERY);

export const getGalleryPlace = (slug: string) =>
  fetchData<GalleryPlaceDetail>(
    `${EXTERNAL_API_ENDPOINTS.GALLERY_PLACE(encodeURIComponent(slug))}`
  );

/**
 * Todas las ciudades con sus fotos, para el build.
 * El listado no trae las fotos, así que se pide el detalle de cada ciudad.
 * Una ciudad que falle se descarta en vez de romper toda la página.
 */
export async function getGalleryWithPhotos(): Promise<GalleryPlaceDetail[]> {
  const summary = await getGalleryPlaces();
  const places = summary?.data ?? [];

  const details = await Promise.all(places.map((p) => getGalleryPlace(p.slug)));

  return details.flatMap((d) => (d?.data ? [d.data] : []));
}
