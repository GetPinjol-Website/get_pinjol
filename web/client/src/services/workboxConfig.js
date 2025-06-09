import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';

// Precaching aset dari manifest Vite
precacheAndRoute(self.__WB_MANIFEST);

// Cache strategi untuk API (NetworkFirst)
registerRoute(
  ({ url }) => url.origin === 'http://localhost:9000',
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      {
        cacheableResponse: {
          statuses: [0, 200], // Cache respons sukses dan opaque
        },
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
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    ],
  })
);

// Event listener untuk menangani error caching
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch((error) => {
        console.error('Fetch gagal:', error);
        // Kembalikan respons offline placeholder jika diperlukan
        return new Response(
          JSON.stringify({
            status: 'error',
            message: 'Tidak ada koneksi jaringan. Silakan coba lagi.',
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      });
    })
  );
});