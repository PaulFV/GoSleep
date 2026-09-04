const CACHE_NAME = 'gosleep-v2';
const APP_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './icons/favicon-32.png',
    './icons/apple-touch-icon.png',
    './icons/icon-192.png',
    './icons/icon-512.png',
    './icons/icon-1024.png'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_ASSETS)));
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => Promise.all(
            keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    if(event.request.method !== 'GET') return;
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
            if(response.ok && new URL(event.request.url).origin === self.location.origin){
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
            }
            return response;
        }).catch(() => {
            if(event.request.mode === 'navigate') return caches.match('./index.html');
            throw new Error('Offline resource unavailable');
        }))
    );
});
