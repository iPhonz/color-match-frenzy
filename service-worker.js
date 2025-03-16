/**
 * Color Match Frenzy Service Worker
 * Enables offline functionality and improves performance.
 */

const CACHE_NAME = 'color-match-frenzy-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/game.js',
    '/js/ui.js',
    '/js/spill-integration.js',
    '/js/main.js',
    '/images/logo.png',
    '/images/logo-small.png',
    '/images/favicon.png',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// Install event - cache assets
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...', event);
    
    // Skip waiting to activate immediately
    self.skipWaiting();
    
    // Cache assets
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching app shell');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker...', event);
    
    // Clean up old caches
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(cacheName => {
                        return cacheName !== CACHE_NAME;
                    })
                    .map(cacheName => {
                        console.log('[Service Worker] Removing old cache', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        })
    );
    
    return self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
    console.log('[Service Worker] Fetching resource: ' + event.request.url);
    
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    // Return cached response
                    console.log('[Service Worker] Returning cached resource: ' + event.request.url);
                    return response;
                }
                
                // Fetch from network
                return fetch(event.request)
                    .then(res => {
                        // Clone the response
                        const resClone = res.clone();
                        
                        // Open cache
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                // Add response to cache
                                cache.put(event.request, resClone);
                            });
                        
                        return res;
                    })
                    .catch(err => {
                        console.error('[Service Worker] Fetch error:', err);
                    });
            })
    );
});