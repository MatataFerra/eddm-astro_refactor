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
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
  }),
});
