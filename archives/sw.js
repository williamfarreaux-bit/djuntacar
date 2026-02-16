/**
 * SERVICE WORKER - DJUNTACAR
 * Rôle : Cache & Mode Hors-Ligne (PWA)
 */

const CACHE_NAME = 'djunta-cache-v4';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/style.css',
    '/djunta-core.js',  // <--- Le nouveau cerveau
    '/manifest.json',
    '/logo.png',
    // Ajoutez ici vos autres pages si nécessaire
    '/login.html',
    '/signup.html',
    '/profile.html',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/lucide@latest',
    'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2'
];

// 1. Installation : On met en cache les fichiers vitaux
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// 2. Activation : On nettoie les vieux caches (v1, v2...) pour éviter les bugs
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// 3. Interception : On sert le cache si hors-ligne
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Si trouvé dans le cache, on le rend (Ultra rapide / Hors ligne)
            if (cachedResponse) {
                return cachedResponse;
            }
            // Sinon, on va chercher sur Internet
            return fetch(event.request);
        })
    );
});
