import { imageSize } from 'image-size';
import { fetchMedia, readLimited } from '@/lib/media/remote';

export async function getImageKitSize(url: string) {
  const response = await fetchMedia(url);
  if (!response.ok) return null;
  const buffer = await readLimited(response);
  if (!buffer) return null;
  const dimensions = imageSize(buffer);

  if (!dimensions.width || !dimensions.height) {
    return null;
  }

  return {
    width: dimensions.width,
    height: dimensions.height,
  };
}

export function getImageKitPoster(url: string): string {
  if (url.includes('?tr=')) {
    return url.replace('?tr=', '?tr=so-1,f-jpg,');
  }

  if (url.includes('?')) {
    return `${url}&tr=so-1,f-jpg`;
  }

  const cleanUrl = url.replace(/\.[^.]+$/, '.jpg');
  return `${cleanUrl}?tr=so-1`;
}
