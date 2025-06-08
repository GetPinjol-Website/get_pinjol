self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('getpinjol-v1').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/style.css',
                '/sw.js',
                '/src/index.jsx',
                '/src/scripts/pages/**/*',
                '/src/utils/**/*',
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'GET' && !event.request.url.includes('/register') && !event.request.url.includes('/login')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((networkResponse) => {
                    if (event.request.url.startsWith('http://localhost:9000') && event.request.method === 'GET') {
                        caches.open('getpinjol-v1').then((cache) => {
                            cache.put(event.request, networkResponse.clone());
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Mode offline: kembalikan cache jika ada
                    return caches.match('/index.html');
                });
            })
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});

self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-reports' || event.tag === 'sync-educations') {
        event.waitUntil(syncOfflineData());
    }
});

async function syncOfflineData() {
    const { default: db } = await import('./src/utils/db.js');
    const reports = await db.getAllData('offlineReports');
    const educations = await db.getAllData('offlineEducations');
    const { default: api } = await import('./src/utils/api.js');
    const token = localStorage.getItem('token');

    for (const report of reports) {
        await api.createReportWeb(report).catch(() => { });
        await db.deleteData('offlineReports', report.id);
    }
    for (const education of educations) {
        await api.createEducation(education).catch(() => { });
        await db.deleteData('offlineEducations', education.id);
    }
}