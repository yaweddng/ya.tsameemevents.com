const CACHE_NAME = 'platform-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/favicon.svg'
];

// Install Event - Cache initial assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching essential static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
      console.error('Failed to cache assets during install', err);
    })
  );
  self.skipWaiting();
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch Event - Strategy: Network First for API and dynamic content, Cache First for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Do not cache API requests or dynamic data
  if (url.pathname.startsWith('/api/') || event.request.method !== 'GET') {
    return; // Let the browser handle it normally (Network only)
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // For static assets (JS, CSS, images), if we have it in cache, return it immediately
      if (cachedResponse && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css') || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|woff2?)$/))) {
        // We can still fetch in background to update cache, but return cached first
        fetch(event.request).then(networkResponse => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, networkResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      // For HTML and everything else, try network first, then fallback to cache
      return fetch(event.request).then((networkResponse) => {
        // Don't cache if not a valid response
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Only cache static assets (JS, CSS, images, fonts)
        if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|gif|woff2?)$/)) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return networkResponse;
      }).catch(() => {
        // Network failed (offline)
        if (cachedResponse) {
          return cachedResponse; // Return cached HTML if available
        }
        
        // If it's a navigation request (HTML), return offline page
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
      });
    })
  );
});

// Background Sync Event
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookings') {
    console.log('Service Worker: Syncing bookings...');
    // Logic to send queued bookings to server
  }
});

// Periodic Sync Event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    console.log('Service Worker: Periodic content update...');
    // Logic to pre-fetch new content
  }
});

// Push Event - Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'YA Wedding';
  const options = {
    body: data.body || 'New update from YA Wedding!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    data: {
      url: data.url || '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.openWindow(event.notification.data.url)
  );
});
