import { imageSize } from 'image-size';

export async function getImageKitSize(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
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
