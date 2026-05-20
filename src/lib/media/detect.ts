export type MediaProvider = 'cloudinary' | 'imagekit' | 'unknown';

export function detectProvider(url: string): MediaProvider {
  if (url.includes('res.cloudinary.com')) {
    return 'cloudinary';
  }

  if (url.includes('imagekit.io')) {
    return 'imagekit';
  }

  return 'unknown';
}
