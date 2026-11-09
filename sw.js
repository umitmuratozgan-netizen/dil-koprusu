// Dil Köprüsü — çevrimdışı önbellek.
// Uygulama dosyaları önbellekten anında açılır, arkada güncellenir. Yeni sürüm TÜM dosyalarıyla birlikte (CACHE adı değişince) yüklenir
// ve kullanıcı "Yenile"ye basınca devreye girer — yarım güncelleme olmaz. Claude API çağrıları asla önbelleğe girmez.
const CACHE = "dil-koprusu-v11";
const SHELL = ["./", "index.html", "content.js", "content-en.js", "lang.js", "core.js", "app.js", "live.js", "listen.js", "career.js", "boot.js",
  "vendor/anthropic-sdk.mjs", "manifest.webmanifest", "icon.svg", "icon-180.png", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  // cache:"reload" → tarayıcının HTTP önbelleğindeki eski dosyaları değil, sunucudaki yenileri al
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL.map(u => new Request(u, { cache: "reload" })))).then(() => {
    if (!self.registration.active) return self.skipWaiting(); // ilk kurulumda hemen devreye gir
  }));
});
self.addEventListener("message", e => { if (e.data === "skipWaiting") self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
function putIfOk(req, res) {
  if (res && res.ok && res.type === "basic") { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
  return res;
}
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // dış adresler (Claude API) hiç karışma
  // Önbellek önce: dosyalar yalnız yeni sürüm (yeni CACHE) bütün olarak kurulunca değişir → eski/yeni dosya karışmaz.
  // Yeni sürüm yayınlarken CACHE adını artır.
  const key = req.mode === "navigate" ? "index.html" : req;
  e.respondWith(caches.match(key, { ignoreSearch: req.mode === "navigate" }).then(hit => hit || fetch(req).then(res => putIfOk(req, res)).catch(() =>
    req.mode === "navigate" ? new Response("Çevrimdışı — internet gelince tekrar aç.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }) : new Response("", { status: 504 }))));
});
