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
