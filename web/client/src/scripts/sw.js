self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('getpinjol-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/scripts/index.js',
                '/styles/tailwind.css',
                '/styles/global.css'
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});