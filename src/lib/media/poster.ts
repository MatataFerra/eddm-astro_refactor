import { detectProvider } from '@/lib/media/detect';

import { getCloudinaryPoster } from '@/lib/media/providers/cloudinary';

export function getVideoPoster(url: string) {
  const provider = detectProvider(url);

  switch (provider) {
    case 'cloudinary':
      return getCloudinaryPoster(url);

    default:
      return undefined;
  }
}
