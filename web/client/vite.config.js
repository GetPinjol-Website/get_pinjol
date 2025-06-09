import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      srcDir: 'public',
      filename: 'sw.js', // Sesuaikan dengan nama file di public
      strategies: 'injectManifest', // Gunakan manifest kustom yang diinjeksikan
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
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.origin === 'http://localhost:9000' && !url.pathname.includes('/auth'),
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-cache',
              cacheableResponse: { statuses: [0, 200] },
              expiration: { maxEntries: 50, maxAgeSeconds: 30 * 24 * 60 * 60 },
            },
          },
        ],
      },
      devOptions: {
        enabled: true, // Aktifkan Service Worker di mode development
        type: 'module', // Gunakan tipe module untuk development
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:9000', changeOrigin: true, rewrite: (path) => path.replace(/^\/api/, '') },
    },
    hmr: { overlay: false },
  },
});