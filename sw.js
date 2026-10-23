/* Keeps the app working offline. Visits are stored in the browser, never sent anywhere. */
var CACHE = "visit-checklist-v1"; /* files are always re-checked online first, so a new upload reaches everyone the next time they open the app with internet */
var CORE = ["./", "index.html", "exceljs.min.js", "manifest.webmanifest", "icon-192.png", "icon-512.png", "apple-touch-icon.png"];
self.addEventListener("install", function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); }));
});
self.addEventListener("fetch", function (e) {
  var r = e.request;
  if (r.method !== "GET") return;
  var u = new URL(r.url);
  if (u.origin !== location.origin) return;
  e.respondWith(
    fetch(r, { cache: "no-cache" }).then(function (res) { var copy = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, copy); }); return res; })
      .catch(function () { return caches.match(r).then(function (m) { return m || caches.match("index.html"); }); })
  );
});
