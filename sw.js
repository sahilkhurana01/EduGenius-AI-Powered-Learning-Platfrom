const CACHE_NAME = 'edugenius-cache-v1';
const BASE_PATH = '/EduGenius-AI-Powered-Learning-Platfrom';
const urlsToCache = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/pwa1.png`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/kid.jpg`,
  `${BASE_PATH}/edugenius logo.png`
  // CSS and JS files are automatically versioned by Vite - don't hardcode them
];

// Install service worker
self.addEventListener('install', (event) => {
  // Skip waiting forces the waiting service worker to become the active service worker
  self.skipWaiting();
  console.log('[ServiceWorker] Install');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[ServiceWorker] Cache error:', error);
      })
  );
});

// Cache and return requests - using a network-first strategy for HTML
// and a cache-first strategy for assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Skip URLs with query parameters
  if (event.request.url.includes('?')) {
    return;
  }

  // Fix for double path issue
  let url = new URL(event.request.url);
  if (url.pathname.includes(`${BASE_PATH}${BASE_PATH}`)) {
    url.pathname = url.pathname.replace(`${BASE_PATH}${BASE_PATH}`, BASE_PATH);
    event.respondWith(fetch(new Request(url, event.request)));
    return;
  }

  console.log('[ServiceWorker] Fetch', event.request.url);

  // For navigate requests (HTML), use network-first strategy
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          // If network fails, fall back to cache
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If navigate request fails and isn't in cache, serve the index page
              return caches.match(`${BASE_PATH}/`);
            });
        })
    );
    return;
  }

  // Handle SPA routes - all routes should serve index.html
  const requestUrl = new URL(event.request.url);
  const pathSegments = requestUrl.pathname.split('/').filter(Boolean);
  
  // Check if it's an SPA route that needs to serve index.html
  if (
    pathSegments.length > 0 && 
    !requestUrl.pathname.includes('.') && // Not a file with extension
    ['teacher-dashboard', 'student-dashboard', 'login', 'role-selection', 'ask-ai', 'dashboard', 'debug'].includes(pathSegments[pathSegments.length - 1])
  ) {
    event.respondWith(
      caches.match(`${BASE_PATH}/`) // Serve the index.html for SPA routes
        .then(response => {
          return response || fetch(`${BASE_PATH}/`);
        })
    );
    return;
  }

  // For non-HTML requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200) {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Cache the fetched response
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch error:', error);
            // For image requests, we might want to return a fallback
            if (event.request.destination === 'image') {
              return new Response(
                '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#4338CA"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="24" fill="#ffffff">EduGenius</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }
          });
      })
  );
});

// Update service worker and clean old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');
  
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Claiming clients');
        // Claim clients so that the very first page load is controlled by the service worker
        return self.clients.claim();
      })
  );
}); 