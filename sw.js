const CACHE = 'voca-' + self.registration.scope + '-v7';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon.svg', './lessons.css', './lessons-data.js', './lessons.js', './vocabulary/lesson-1.js', './vocabulary/lesson-2.js', './vocabulary/lesson-3.js', './vocabulary/lesson-4.js', './vocabulary/lesson-5.js'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys
    .filter(key => key.startsWith('voca-' + self.registration.scope) && key !== CACHE)
    .map(key => caches.delete(key)))));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        event.waitUntil(caches.open(CACHE).then(cache => cache.put('./index.html', copy)));
      }
      return response;
    }).catch(() => caches.match('./index.html')));
  } else {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
  }
});
