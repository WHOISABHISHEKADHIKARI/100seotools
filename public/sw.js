// Service Worker for 100 SEO Tools - Enhanced Performance Version
const CACHE_NAME = 'seo-tools-cache-v2.0.0';
const STATIC_CACHE_NAME = 'seo-tools-static-v2.0.0';
const DYNAMIC_CACHE_NAME = 'seo-tools-dynamic-v2.0.0';
const OFFLINE_URL = '/offline';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/favicon.ico',
  '/icon.svg',
  '/apple-touch-icon.png'
];

// Cache size limits
const MAX_CACHE_SIZE = 50; // Maximum number of items in dynamic cache
const CACHE_EXPIRY_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Install event - precache key assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing v2.0.0...');
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating v2.0.0...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and cross-origin requests
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (request.destination === 'document' || request.headers.get('accept')?.includes('text/html')) {
    // HTML pages - Network first with cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Images - Cache first with network fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.url.includes('/_next/static/') || request.url.includes('/static/')) {
    // Static assets - Cache first (they have hashes for cache busting)
    event.respondWith(cacheFirstStrategy(request));
  } else if (request.url.includes('/api/')) {
    // API requests - Network only (don't cache dynamic data)
    event.respondWith(fetch(request));
  } else {
    // Other requests - Stale while revalidate
    event.respondWith(staleWhileRevalidateStrategy(request));
  }
});

// Network first strategy (for HTML pages)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      // Add timestamp for cache expiry using a cloned body to avoid locking
      const responseWithTimestamp = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cache-timestamp': Date.now().toString()
        }
      });
      cache.put(request, responseWithTimestamp.clone());
      await limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache for:', request.url);
    const cachedResponse = await caches.match(request);
    if (cachedResponse && !isCacheExpired(cachedResponse)) {
      return cachedResponse;
    }
    // Return offline page as fallback with 200 and noindex to avoid SEO 5xx
    const offline = await caches.match(OFFLINE_URL);
    if (offline) {
      const headers = new Headers(offline.headers);
      headers.set('X-Robots-Tag', 'noindex, nofollow');
      return new Response(offline.clone().body, {
        status: 200,
        statusText: 'OK',
        headers
      });
    }
    return new Response('Offline', {
      status: 200,
      statusText: 'OK',
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    });
  }
}

// Cache first strategy (for images and static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse && !isCacheExpired(cachedResponse)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      const responseWithTimestamp = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cache-timestamp': Date.now().toString()
        }
      });
      cache.put(request, responseWithTimestamp.clone());
      await limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
      return networkResponse;
    }
    throw new Error('Network response not ok');
  } catch (error) {
    console.log('Service Worker: Failed to fetch:', request.url);
    // Avoid returning 5xx; use 200 with noindex for SEO safety
    if (cachedResponse) return cachedResponse;
    return new Response('Resource not available offline', {
      status: 200,
      statusText: 'OK',
      headers: { 'X-Robots-Tag': 'noindex, nofollow' }
    });
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidateStrategy(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const responseWithTimestamp = new Response(networkResponse.clone().body, {
        status: networkResponse.status,
        statusText: networkResponse.statusText,
        headers: {
          ...Object.fromEntries(networkResponse.headers.entries()),
          'sw-cache-timestamp': Date.now().toString()
        }
      });
      cache.put(request, responseWithTimestamp.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return networkResponse;
  }).catch((error) => {
    console.log('Service Worker: Network failed for:', request.url);
    return cachedResponse;
  });

  return cachedResponse && !isCacheExpired(cachedResponse) ? cachedResponse : fetchPromise;
}

// Helper function to check if cache is expired
function isCacheExpired(response) {
  const timestamp = response.headers.get('sw-cache-timestamp');
  if (!timestamp) return false;
  return Date.now() - parseInt(timestamp) > CACHE_EXPIRY_TIME;
}

// Helper function to limit cache size
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxSize) {
    // Remove oldest entries
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}