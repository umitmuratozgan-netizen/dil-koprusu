// Dil Köprüsü — çevrimdışı önbellek.
// Uygulama dosyaları: önce önbellekten anında aç, arkada güncelle (yeni sürüm bir sonraki açılışta gelir).
// Claude kütüphanesi (sabit sürümlü jsDelivr adresleri): önbellekte varsa oradan.
// Claude API çağrıları hiçbir zaman önbelleğe girmez.
const CACHE = "dil-koprusu-v6";
const SHELL = ["./", "index.html", "content.js", "core.js", "app.js", "manifest.webmanifest", "icon.svg", "icon-180.png", "icon-192.png", "icon-512.png"];
const SDK_PREFIX = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.1.0/";

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function putIfOk(req, res) {
  if (res && res.ok && (res.type === "basic" || res.type === "cors")) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
  return res;
}
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.href.startsWith(SDK_PREFIX) || (url.hostname === "cdn.jsdelivr.net" && url.pathname.includes("/npm/"))) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => putIfOk(req, res))));
    return;
  }
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(req, { ignoreSearch: req.mode === "navigate" }).then(hit => {
    // no-cache: GitHub Pages'in 10 dk HTTP önbelleğini atla. Yayında CACHE sürümünü artır → tüm dosyalar birlikte yenilenir.
    const net = fetch(req, { cache: "no-cache" }).then(res => putIfOk(req, res)).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return net.then(res => res || caches.match("index.html"));
  }));
});
