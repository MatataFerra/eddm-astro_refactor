import { map } from 'nanostores';
import type { GalleryPhoto } from '@/lib/interfaces/gallery';

type LightboxState = { photos: GalleryPhoto[]; index: number };

/** `photos` vacío = cerrado */
export const lightbox = map<LightboxState>({ photos: [], index: 0 });

export const openLightbox = (photos: GalleryPhoto[], index: number) =>
  lightbox.set({ photos, index });

export const closeLightbox = () => lightbox.set({ photos: [], index: 0 });

export function stepLightbox(dir: 1 | -1) {
  const { photos, index } = lightbox.get();
  if (photos.length) lightbox.setKey('index', (index + dir + photos.length) % photos.length);
}
