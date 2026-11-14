import { getGalleryWithPhotos } from '@/lib/api/get-gallery';
import { getTrip } from '@/lib/api/get-trip';
import { arrivalDay } from '@/lib/adapters/route-adapter';
import { placeKey } from '@/lib/adapters/trip-adapter';
import { mapLimited } from '@/lib/async';
import { APP_ROUTER } from '@/lib/constants';
import { getMediaSize } from '@/lib/media/dimensions';
import type { ProcessedSection } from '@/lib/markdown/process';
import type { Trip } from '@/lib/interfaces/recorrido';

export type GalleryPlace = {
  slug: string;
  name: string;
  href: string;
  /** Cuándo llegué, si el lugar es una parada del recorrido (ISO, sólo fecha) */
  date: string | null;
  photos: NonNullable<ProcessedSection['media']>;
};

/**
 * Los lugares con sus fotos listas para la grilla. La API no trae el tamaño de cada foto, así que
 * se lee en el build: sin él, la grilla salta mientras cargan.
 */
async function loadGallery(): Promise<GalleryPlace[]> {
  const [places, trip] = await Promise.all([getGalleryWithPhotos(), getTrip<Trip>()]);
  const stops = trip?.data?.stops ?? [];

  return Promise.all(
    places.map(async (place) => {
      const stop = stops
        .filter((s) => placeKey(s.city) === placeKey(place.name))
        .sort((a, b) => a.order - b.order)
        .at(-1);

      return {
        slug: place.slug,
        name: place.name.trim(),
        href: APP_ROUTER.GALLERY_PLACE(place.slug),
        date: arrivalDay(stop?.arrivalDate ?? null),
        photos: await mapLimited(place.photos, 6, async (photo) => {
          const size =
            photo.width && photo.height
              ? { width: photo.width, height: photo.height }
              : await getMediaSize(photo.url);
          return {
            type: 'image' as const,
            src: photo.url,
            alt: photo.alt?.trim() || photo.caption?.trim() || '',
            width: size?.width,
            height: size?.height,
          };
        }),
      };
    })
  );
}

// El índice y la página de cada lugar lo usan en el mismo build: se pide una sola vez
let cached: Promise<GalleryPlace[]> | null = null;

export function getGallery(): Promise<GalleryPlace[]> {
  cached ??= loadGallery();
  return cached;
}
