/**
 * PAGE: sw.js
 * VERSION: 1.9.2
 * DESCRIPTION: Service Worker pour l'installation PWA et la mise en cache.
 */

const CACHE_NAME = 'djuntacar-cache-v1.9.2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/config.js',
  '/layout.js',
  '/translations.js',
  '/sigle.png',
  '/logo.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
