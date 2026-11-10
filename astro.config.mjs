// @ts-check
import { defineConfig, logHandlers } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import svelte from '@astrojs/svelte';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  logger: logHandlers.console({ level: 'debug' }),
  integrations: [svelte()],
  // Las fotos de R2 pasan por Vercel Image; Cloudinary e ImageKit se achican con sus propios
  // parámetros (src/lib/media/resize.ts) para no gastar cuota de Vercel en lo que ya hacen gratis.
  image: {
    remotePatterns: [{ protocol: 'https', hostname: '**.r2.dev' }],
  },
  adapter: vercel({
    imageService: true,
    // Pocos anchos y caché larga: cada ancho distinto es una transformación que cuenta en la cuota.
    // Tienen que coincidir con los de Photo.astro.
    imagesConfig: {
      sizes: [480, 720, 1080, 1440, 1920],
      remotePatterns: [{ protocol: 'https', hostname: '**.r2.dev' }],
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60 * 60 * 24 * 31,
    },
    webAnalytics: {
      enabled: true,
    },
  }),
});
