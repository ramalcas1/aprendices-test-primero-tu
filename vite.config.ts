import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg'],
      manifest: {
        name: "Diagnóstico Primero Tú",
        short_name: "Diagnóstico Primero Tú",
        description: "Diagnóstico Primero Tú",
        theme_color: '#3a4230',
        background_color: '#3a4230',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' }],
      },
      workbox: { navigateFallback: '/index.html', cleanupOutdatedCaches: true },
    }),
  ],
});
