import { detectProvider } from '@/lib/media/detect';
import { getCloudinarySize } from '@/lib/media/providers/cloudinary';
import { getImageKitSize } from '@/lib/media/providers/imagekit';
import { imageSize } from 'image-size';

export async function getMediaSize(url: string) {
  try {
    const provider = detectProvider(url);

    switch (provider) {
      case 'cloudinary':
        return await getCloudinarySize(url);

      case 'imagekit':
        return await getImageKitSize(url);

      default:
        // El tamaño está en la cabecera del archivo: primero se piden sus primeros 128 KB
        return (await readSize(url, 'bytes=0-131071')) ?? (await readSize(url));
    }
  } catch {
    return null;
  }
}

async function readSize(url: string, range?: string) {
  try {
    const response = await fetch(url, range ? { headers: { Range: range } } : undefined);
    if (!response.ok) return null;
    const dimensions = imageSize(Buffer.from(await response.arrayBuffer()));
    if (!dimensions.width || !dimensions.height) return null;

    // Las fotos del teléfono guardan la rotación aparte: 5 a 8 van giradas 90°
    const rotated = (dimensions.orientation ?? 1) >= 5;
    return rotated
      ? { width: dimensions.height, height: dimensions.width }
      : { width: dimensions.width, height: dimensions.height };
  } catch {
    return null;
  }
}
