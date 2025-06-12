import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
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