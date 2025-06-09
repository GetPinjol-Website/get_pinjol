// Impor Workbox jika digunakan
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';

// Precaching aset (dengan fallback jika __WB_MANIFEST tidak ada)
precacheAndRoute(self.__WB_MANIFEST || []);

// Cache strategi untuk API (NetworkFirst)
registerRoute(
  ({ url }) => url.origin === 'http://localhost:9000',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      {
        cacheableResponse: { statuses: [0, 200] },
      },
    ],
  })
);

// Cache strategi untuk gambar (StaleWhileRevalidate)
registerRoute(
  ({ request }) => request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'image-cache',
    plugins: [
      {
        cacheableResponse: { statuses: [0, 200] },
      },
    ],
  })
);

// Event listener untuk menangani fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).catch((error) => {
        console.error('Fetch gagal:', error);
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Tidak ada koneksi jaringan. Silakan coba lagi.',
          }),
          { status: 503, headers: { 'Content-Type': 'application/json' } }
        );
      });
    })
  );
});

// Event listener untuk aktivasi service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== 'api-cache' && cacheName !== 'image-cache')
          .map((cacheName) => caches.delete(cacheName))
      );
    }).catch((error) => {
      console.error('Gagal membersihkan cache lama:', error);
    })
  );
});

// Event listener untuk instalasi service worker
self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
  console.log('Service worker terinstal');
});