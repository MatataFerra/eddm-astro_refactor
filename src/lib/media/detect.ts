export type MediaProvider = 'cloudinary' | 'imagekit' | 'cloudflare' | 'unknown';

// Por el host y no por substring: `https://otro.host/?x=.r2.dev` no es una foto de R2
function hostnameOf(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function detectProvider(url: string): MediaProvider {
  const host = hostnameOf(url);

  if (host === 'res.cloudinary.com') {
    return 'cloudinary';
  }

  if (host === 'imagekit.io' || host.endsWith('.imagekit.io')) {
    return 'imagekit';
  }

  if (host.endsWith('.r2.dev') || host.endsWith('.r2.cloudflarestorage.com')) {
    return 'cloudflare';
  }

  return 'unknown';
}
