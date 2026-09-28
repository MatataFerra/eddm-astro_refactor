import { detectProvider } from '@/lib/media/detect';
import { getCloudinaryPoster } from '@/lib/media/providers/cloudinary';
import { getImageKitPoster } from '@/lib/media/providers/imagekit';

export function getVideoPoster(url: string) {
  const provider = detectProvider(url);

  switch (provider) {
    case 'cloudinary':
      return getCloudinaryPoster(url);

    case 'imagekit':
      return getImageKitPoster(url);

    case 'cloudflare':
      return `${url}#t=0.5`;

    default:
      return undefined;
  }
}
