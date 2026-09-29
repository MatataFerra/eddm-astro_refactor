export type MediaProvider = 'cloudinary' | 'imagekit' | 'cloudflare' | 'unknown';

export function detectProvider(url: string): MediaProvider {
  if (url.includes('res.cloudinary.com')) {
    return 'cloudinary';
  }

  if (url.includes('imagekit.io')) {
    return 'imagekit';
  }

  if (url.includes('.r2.dev') || url.includes('r2.cloudflarestorage.com')) {
    return 'cloudflare';
  }

  return 'unknown';
}
