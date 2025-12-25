const CACHE_NAME = "planetarium-cache-v1";
const urlsToCache = [
  "in.html",
  "style.css",
  "script.js",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "planets/mercury.png",
  "planets/venus.png",
  "planets/earth.png",
  "planets/mars.png",
  "planets/jupiter.png",
  "planets/saturn.png",
  "planets/uranus.png",
  "planets/neptune.png",
  "planets/sun.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
