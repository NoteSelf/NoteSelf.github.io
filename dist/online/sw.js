var cdn = {
  max: 'https://maxcdn.bootstrapcdn.com'
}

var vendor = {
  fontAwesome: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3'
};

var currentDomain = 'https://noteself.github.io';

var URLS = {
  app: [
    'icons/launcher-icon-0-75x.png',
    'icons/launcher-icon-1-5x.png',
    'icons/launcher-icon-1x.png',
    'icons/launcher-icon-2x.png',
    'icons/launcher-icon-3x.png',
    'icons/launcher-icon-4x.png',
    'icons/icon-32.png',
    'index.html',
    'manifest.json'
  ],
  vendor: [
    `${vendor.fontAwesome}/css/font-awesome.min.css`,
    `${vendor.fontAwesome}/fonts/fontawesome-webfont.woff2`, // browsers that support sw support woff2
  ]
}

var CACHE_NAMES = {
  app: 'noteself-cache-v8',
  vendor: 'vendor-cache-v8'
};

function isVendor(url) {
  return url.startsWith(cdn.max);
}

function isCurrentDomain(url) {
  return url.startsWith(currentDomain);
}

function cacheAll(cacheName, urls) {
  return caches.open(cacheName).then((cache) => cache.addAll(urls));
}

function addToCache(cacheName, request, response) {
  if (response.ok) {
    var clone = response.clone()
    caches.open(cacheName).then((cache) => cache.put(request, clone));
  }
  return response;
}

function lookupCache(request) {
  return caches.match(request).then(function(cachedResponse) {
    if (!cachedResponse) {
      throw Error(`${request.url} not found in cache`);
    }
    return cachedResponse;
  });
}

function fetchThenCache(request, cacheName) {
  var fetchRequest = fetch(request);
  // add to cache, but don't block resolve of this promise on caching
  fetchRequest.then((response) => addToCache(cacheName, request, response));
  return fetchRequest;
}

function raceRequest(request, cacheName) {
  var attempts = [
    fetchThenCache(request, cacheName),
    lookupCache(request)
  ];
  return new Promise(function(resolve, reject) {
    // resolve this promise once one resolves
    attempts.forEach((attempt) => attempt.then(resolve));
    // reject if all promises reject
    attempts.reduce((verdict, attempt) => verdict.catch(() => attempt))
      .catch(() => reject(Error('Unable to resolve request from network or cache.')));
  })
}

function cleanupCache() {
  var validKeys = Object.keys(CACHE_NAMES).map((key) => CACHE_NAMES[key]);
  return caches.keys().then((localKeys) => Promise.all(
    localKeys.map((key) => {
      if (validKeys.indexOf(key) === -1) { // key no longer in our list
        return caches.delete(key);
      }
    })
  ));
}

self.addEventListener('install', function(evt) {
  var cachingCompleted = Promise.all([
    cacheAll(CACHE_NAMES.app, URLS.app),
    //cacheAll(CACHE_NAMES.vendor, URLS.vendor)
  ]).then(() => self.skipWaiting())

  evt.waitUntil(cachingCompleted);
});

self.addEventListener('activate', function(evt) {
  evt.waitUntil(Promise.all([
    cleanupCache(),
    self.clients.claim() // claim immediately so the page can be controlled by the sw immediately
  ]));
});

self.addEventListener('fetch', function(evt) {
  var request = evt.request;
  var response;

  // only handle GET requests
  if (request.method !== 'GET' || !isCurrentDomain(request.url)) return;

  if (isVendor(request.url)) {
    // vendor requests: check cache first, fallback to fetch
    response = lookupCache(request)
      .catch(() => fetchThenCache(request, CACHE_NAMES.vendor));
  } else {
    // app request: race cache/fetch (bonus: update in background)
    response = raceRequest(request, CACHE_NAMES.app);
  }
  evt.respondWith(response);
});
