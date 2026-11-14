// @ts-check
import { defineConfig, logHandlers } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// El bucket público de R2 (eddm-bucket). Vercel Image sólo acepta este host: con un comodín
// cualquiera podría pasar fotos de su propio bucket por el optimizador y gastar nuestra cuota.
const R2_HOST = 'pub-9dc7984a54eb44a383dc44cec5215bce.r2.dev';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  vite: {
    plugins: [tailwindcss()],
  },
  logger: logHandlers.console({ level: 'debug' }),
  // Las fotos de R2 pasan por Vercel Image; Cloudinary e ImageKit se achican con sus propios
  // parámetros (src/lib/media/resize.ts) para no gastar cuota de Vercel en lo que ya hacen gratis.
  image: {
    remotePatterns: [{ protocol: 'https', hostname: R2_HOST }],
  },
  adapter: vercel({
    imageService: true,
    // Pocos anchos y caché larga: cada ancho distinto es una transformación que cuenta en la cuota.
    // Tienen que coincidir con los de Photo.astro.
    imagesConfig: {
      sizes: [480, 720, 1080, 1440, 1920],
      remotePatterns: [{ protocol: 'https', hostname: R2_HOST }],
      formats: ['image/avif', 'image/webp'],
      minimumCacheTTL: 60 * 60 * 24 * 31,
    },
    webAnalytics: {
      enabled: true,
    },
  }),
});
