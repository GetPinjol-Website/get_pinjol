import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, NetworkOnly } from 'workbox-strategies';
import { precacheAndRoute } from 'workbox-precaching';
import { Queue } from 'workbox-background-sync';

precacheAndRoute(self.__WB_MANIFEST);

const reportQueue = new Queue('reportQueue', {
  onSync: async ({ queue }) => {
    let entry;
    while ((entry = await queue.shiftRequest())) {
      try {
        await fetch(entry.request);
      } catch (error) {
        await queue.unshiftRequest(entry);
        throw new Error('Queue sync failed');
      }
    }
  },
});

// Cache untuk laporan (web dan app)
registerRoute(
  ({ url }) => url.origin === 'http://localhost:9000' && url.pathname.match(/^\/report\/(web|app)/),
  new NetworkFirst({
    cacheName: 'api-report-cache',
    plugins: [
      {
        cacheableResponse: { statuses: [0, 200] },
      },
      {
        fetchDidFail: async ({ request }) => {
          await reportQueue.pushRequest({ request });
        },
      },
    ],
  })
);

// Cache untuk daftar laporan
registerRoute(
  ({ url }) => url.origin === 'http://localhost:9000' && url.pathname === '/reports',
  new NetworkFirst({
    cacheName: 'api-reports-cache',
    plugins: [
      {
        cacheableResponse: { statuses: [0, 200] },
      },
    ],
  })
);

// Cache untuk gambar
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

// Cache untuk edukasi
registerRoute(
  ({ url }) => url.origin === 'http://localhost:9000' && url.pathname.match(/^\/education/),
  new NetworkFirst({
    cacheName: 'api-education-cache',
    plugins: [
      {
        cacheableResponse: { statuses: [0, 200] },
      },
    ],
  })
);

// Tidak cache untuk login, register, dan check-role
registerRoute(
  ({ url }) => url.pathname.match(/^\/(login|register|check-role)/),
  new NetworkOnly({
    plugins: [
      {
        fetchDidFail: () => {
          return new Response(
            JSON.stringify({
              status: 'error',
              message: 'Anda sedang offline. Silakan sambungkan ke internet.',
            }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        },
      },
    ],
  })
);

// Penanganan offline untuk laporan
self.addEventListener('fetch', (event) => {
  if (!navigator.onLine && event.request.url.includes('/report')) {
    event.respondWith(
      new Response(
        JSON.stringify({
          status: 'error',
          message: 'Anda sedang offline. Permintaan akan disinkronkan saat online.',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    );
  }
});