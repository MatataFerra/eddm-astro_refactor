import { getGalleryWithPhotos } from '@/lib/api/get-gallery';
import { mapLimited } from '@/lib/async';
import { getMediaSize } from '@/lib/media/dimensions';
import type { ProcessedSection } from '@/lib/markdown/process';

export type GalleryPlace = {
  slug: string;
  name: string;
  photos: NonNullable<ProcessedSection['media']>;
};

/**
 * Los lugares con sus fotos listas para la grilla. La API no trae el tamaño de cada foto, así que
 * se lee en el build: sin él, la grilla salta mientras cargan.
 */
export async function getGallery(): Promise<GalleryPlace[]> {
  const places = await getGalleryWithPhotos();

  return Promise.all(
    places.map(async (place) => ({
      slug: place.slug,
      name: place.name.trim(),
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
    }))
  );
}
