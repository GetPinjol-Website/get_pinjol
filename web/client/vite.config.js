import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      strategies: 'injectManifest',
      srcDir: 'public',
      filename: 'sw.mjs', // Sesuaikan dengan output ES module
      includeAssets: ['favicon.ico', 'assets/icons/*.png'],
      manifest: {
        name: 'Aplikasi Laporan Pinjol',
        short_name: 'Pinjol Report',
        theme_color: '#18230F',
        background_color: '#FFFDF6',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/assets/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/assets/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,jpg,svg,ico}'],
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              plugins: [
                {
                  cacheableResponse: { statuses: [0, 200] },
                },
                {
                  expiration: {
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
                  },
                },
              ],
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module', // Pastikan konsisten dengan filename
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
    hmr: { overlay: false },
  },
});