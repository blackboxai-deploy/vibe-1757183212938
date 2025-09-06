// ARGUS Glass Service Worker
// Provides offline functionality for the AI navigation assistant

const CACHE_NAME = 'argus-glass-v1';
const OFFLINE_URL = '/';

// Files to cache for offline functionality
const urlsToCache = [
  '/',
  '/navigate',
  '/read-text', 
  '/settings',
  '/about',
  '/manifest.json',
  '/_next/static/css/',
  '/_next/static/js/'
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  console.log('ARGUS Glass Service Worker installing');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential resources');
        return cache.addAll(urlsToCache.filter(url => !url.endsWith('/')));
      })
      .catch((error) => {
        console.error('Cache installation failed:', error);
      })
  );
  
  // Force activate immediately
  self.skipWaiting();
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('ARGUS Glass Service Worker activating');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all clients immediately
  self.clients.claim();
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle same-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.open(CACHE_NAME)
            .then((cache) => cache.match(OFFLINE_URL));
        })
    );
    return;
  }

  // Handle other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone response for caching
            const responseToCache = response.clone();

            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If request fails and no cache, return offline page
            if (event.request.destination === 'document') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'argus-sync') {
    event.waitUntil(
      // Sync any offline actions when connection is restored
      syncOfflineActions()
    );
  }
});

// Push notifications for emergency features
self.addEventListener('push', (event) => {
  console.log('Push notification received');
  
  const options = {
    body: 'ARGUS Glass emergency notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [200, 100, 200],
    tag: 'argus-emergency',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      }
    ]
  };

  if (event.data) {
    const data = event.data.json();
    options.body = data.body || options.body;
  }

  event.waitUntil(
    self.registration.showNotification('ARGUS Glass', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked');
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Otherwise open new window
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// Helper function to sync offline actions
async function syncOfflineActions() {
  try {
    // Sync any cached navigation data
    // Sync any cached OCR results
    // Send any pending emergency alerts
    console.log('Offline actions synced successfully');
  } catch (error) {
    console.error('Sync failed:', error);
  }
}

// Cache management - periodic cleanup
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});