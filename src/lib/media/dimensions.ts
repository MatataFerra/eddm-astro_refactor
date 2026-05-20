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

      default: {
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
    }
  } catch {
    return null;
  }
}
