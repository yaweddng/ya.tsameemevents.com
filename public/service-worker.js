const CACHE_NAME = 'platform-cache-v3';
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
    event.waitUntil(
      new Promise((resolve, reject) => {
        const request = indexedDB.open('ya-wedding-db', 1);
        request.onsuccess = (e) => {
          const db = e.target.result;
          const transaction = db.transaction('bookings', 'readwrite');
          const store = transaction.objectStore('bookings');
          const getAllRequest = store.getAll();

          getAllRequest.onsuccess = () => {
            const bookings = getAllRequest.result;
            if (bookings.length === 0) {
              resolve();
              return;
            }

            // Send bookings to server
            Promise.all(bookings.map((booking) => 
              fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(booking)
              })
            )).then(() => {
              // Clear store
              store.clear();
              resolve();
            }).catch(reject);
          };
        };
        request.onerror = reject;
      })
    );
  }
});

// Periodic Sync Event
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-content') {
    event.waitUntil(
      fetch('/api/content/update')
        .then(response => response.json())
        .then(data => {
          // Cache new content
          const cache = caches.open(CACHE_NAME);
          cache.then(c => c.put('/content', new Response(JSON.stringify(data))));
        })
    );
  }
});

// Push Event - Handle push notifications
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error('Push data parse error:', e);
    data = { title: 'YA Wedding', body: event.data ? event.data.text() : 'New update!' };
  }

  const title = data.title || 'YA Wedding';
  const options = {
    body: data.body || 'New update from YA Wedding!',
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/inbox'
    },
    actions: [
      { action: 'open', title: 'View Message' },
      { action: 'close', title: 'Close' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click Event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') return;

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // Check if there is already a window open and focus it
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      // If no window is open, open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
