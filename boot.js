/* Dil Köprüsü — başlangıç (tüm modüller yüklendikten sonra çalışır) */
"use strict";
const APP_VERSION = "9.0";

/* ---------------- Kurulum linki: anahtarı başka telefona tek dokunuşla aktar ----------------
   Anahtar adresin # kısmında taşınır: bu kısım sunucuya (GitHub) gönderilmez. Açılınca kaydedilir ve adres çubuğundan silinir.
   (Tarayıcı geçmişinde, WhatsApp'ta ve panoda kalabilir — bu yüzden mesajı sil ve anahtara harcama limiti koy.) */
const KEY_RE = /^sk-ant-[A-Za-z0-9_\-]{20,}$/;
ACT.pasteKey = async el => {
  const inp = document.getElementById(el.dataset.into); if (!inp) return;
  try {
    let t = (await navigator.clipboard.readText() || "").trim();
    const m = t.match(/sk-ant-[A-Za-z0-9_\-]{20,}/); // mesajın tamamı ya da kurulum linki yapıştırılsa da anahtarı bul
    if (m) t = m[0];
    if (!KEY_RE.test(t)) { toast("Panoda anahtar yok — önce anahtarı kopyala"); return; }
    inp.value = t; toast("Yapıştırıldı — şimdi 'Kaydet ve dene'");
    try { await navigator.clipboard.writeText(""); } catch { } // panoda anahtar kalmasın
  } catch { toast("Yapıştırılamadı — kutuya uzun basıp Yapıştır'ı seç"); inp.focus(); }
};
ACT.makeSetupLink = async () => {
  const k = ($("#apiKey").value || store.get("apiKey", "")).trim();
  const out = $("#setupLinkOut");
  if (!KEY_RE.test(k)) { out.textContent = "Önce geçerli bir anahtar (sk-ant-…) yapıştır."; return; }
  const link = location.origin + location.pathname + "#k=" + encodeURIComponent(k);
  try { await navigator.clipboard.writeText(link); out.textContent = "✅ Link kopyalandı. WhatsApp'ta kardeşine yapıştır; o linke dokunup Chrome/Safari'de açsın. Kurduktan sonra mesajı silsin."; }
  catch { out.textContent = "Kopyalanamadı. Anahtarı ekranda göstermiyorum — bu telefonda tarayıcıya pano izni ver ya da anahtarı kendin gönder."; }
};
(function importKeyFromLink() {
  const m = location.hash.match(/(?:^#|&)k=([^&]+)/); if (!m) return;
  history.replaceState(null, "", location.pathname + location.search); // anahtarı adres çubuğundan sil
  let k = ""; try { k = decodeURIComponent(m[1]).trim(); } catch { }
  if (!KEY_RE.test(k)) { setTimeout(() => toast("Kurulum linki bozuk görünüyor"), 300); return; }
  const old = store.get("apiKey", "");
  if (old && old !== k && !confirm(`Bu telefonda zaten bir anahtar var (…${old.slice(-4)}). Linkteki anahtar (…${k.slice(-4)}) ile değiştirilsin mi?\n\nSadece bu linki ${L.belgium ? "ağabeyin" : "güvendiğin kişi"} gönderdiyse "Tamam" de.`)) return;
  store.set("apiKey", k);
  setTimeout(() => toast(IS_IOS && !matchMedia("(display-mode: standalone)").matches
    ? "✅ Anahtar eklendi. iPhone'da ana ekran uygulaması ayrı saklar: orada Ben → 🔧 → 📋 Yapıştır kullan."
    : "✅ Anahtar eklendi — çeviri hazır. Bu linkin olduğu mesajı silebilirsin."), 400);
})();

/* ---------------- Telefona yükle ---------------- */
// Android/Chrome: tarayıcının yükleme penceresini düğmeyle aç. iPhone: Safari'de elle "Ana Ekrana Ekle" gerekir.
let installEvt = null;
// IS_STANDALONE core.js'te tanımlı
const refreshInstall = () => { const s = $("#installSlot"); if (s) s.innerHTML = installCardInner(); }; // sadece kartı güncelle: yazılanlar silinmesin
addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; refreshInstall(); });
addEventListener("appinstalled", () => { installEvt = null; store.set("installed", true); toast("Yüklendi 🎉 Artık ana ekrandan açabilirsin"); refreshInstall(); });
function installCardInner() {
  if (IS_STANDALONE || store.get("installed", false) || store.get("hideInstall", false)) return "";
  if (!installEvt && !IS_IOS) return "";
  return `<div class="card" style="border-color:var(--brand)"><div class="row"><div class="grow"><b>📲 Uygulamayı telefona yükle</b>
    <div class="small muted">${IS_IOS ? "Safari'de alttaki Paylaş □↑ düğmesine bas → <b>Ana Ekrana Ekle</b>." : "Ana ekranda simgesiyle açılır, internetsiz de çalışır."}</div></div>
    ${installEvt ? `<button class="btn primary" data-act="install">Yükle</button>` : ""}</div>
    <button class="btn sm ghost" data-act="hideInstall" style="margin-top:4px">Gösterme</button></div>`;
}
function installCard() { return `<div id="installSlot">${installCardInner()}</div>`; }
ACT.install = async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch { } installEvt = null; refreshInstall(); };
ACT.hideInstall = () => { store.set("hideInstall", true); refreshInstall(); };

/* ---------------- Seri dondurma: haftada bir kaçırılan gün affedilir ---------------- */
(function streakFreeze() {
  try {
    const days = store.get("days", []); if (!days.length) return;
    const y = addDays(-1), y2 = addDays(-2);
    if (days.includes(y) || !days.includes(y2)) return; // dün çalıştıysa ya da seri zaten bozuksa gerek yok
    const last = store.get("freezeUsed", "");
    if (last && (new Date(todayStr()) - new Date(last)) / 86400000 < 7) return;
    days.push(y); days.sort(); store.set("days", days); store.set("freezeUsed", todayStr());
    setTimeout(() => toast("🧊 Dün kaçırdın ama serin korundu (haftada 1 hak)"), 1200);
  } catch { }
})();

/* ---------------- Saklama süresi: 30 günden eski çeviri geçmişi silinir ---------------- */
(function purgeOld() {
  try {
    const cut = Date.now() - 30 * 86400000;
    const h = store.get("hist", []); const h2 = h.filter(x => x && x.at && x.at > cut); if (h2.length !== h.length) store.set("hist", h2);
    const c = store.get("conv", []); const c2 = c.filter(x => x && x.at && x.at > Date.now() - 20 * 60000); if (c2.length !== c.length) store.set("conv", c2);
  } catch { }
})();

/* ---------------- Mod hatırlama: canlı altyazı / konuşma ---------------- */
(function wrapInterpMode() {
  const orig = ACT.interpMode; if (!orig) return;
  ACT.interpMode = (el, e) => { orig(el, e); store.set("interpLive", !!App.interp.live); };
})();

/* ---------------- Açılış ---------------- */
// mikrofon şeridi alt menünün tam üstünde dursun; üst çubuk sabit kalsın (yükseklikler cihaza göre değişir)
const fitDock = () => {
  const n = $("nav.tabs"), h = $("header.top"), d = $("#dock"), root = document.documentElement.style;
  // v9: alt menü yüzen hap — yükseklik değil, ekranın altından ne kadar yer kapladığı ölçülür (ders modunda gizliyken dokunma)
  if (n) { const r = n.getBoundingClientRect(); if (r.height > 0) root.setProperty("--navh", Math.max(56, Math.round(innerHeight - r.top)) + "px"); }
  if (h) root.setProperty("--headh", Math.round(h.getBoundingClientRect().height) + "px");
  if (d) { const r = d.getBoundingClientRect(); if (r.height > 0) root.setProperty("--dockh", Math.round(r.height) + "px"); }
};
function boot() {
  // yenilemeden kalan alt-ekran geçmiş kayıtları geri tuşunu bozmasın
  try { if (history.state && history.state.dk) history.replaceState(null, ""); } catch { }
  applyTheme(); applyFontScale();
  fitDock(); addEventListener("resize", fitDock);
  // mikrofon paneli büyüyüp küçüldükçe (hazır cümleler, canlı yazı) içerik ve bildirim yeri kendini ayarlasın
  try { if (window.ResizeObserver) { const ro = new ResizeObserver(() => fitDock()); const d = $("#dock"), n = $("nav.tabs"); d && ro.observe(d); n && ro.observe(n); } } catch { }
  try { document.fonts && document.fonts.ready && document.fonts.ready.then(fitDock); } catch { }
  matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", applyTheme);
  App.renderStats();
  const qs = new URLSearchParams(location.search);
  const qTab = qs.get("tab");
  if (qs.get("mode") === "live") { App.interp.live = true; store.set("interpLive", true); }
  const okTabs = ["ogren", "pratik", "ceviri", "yardim", "ben"];
  const stored = store.get("tab", "ogren");
  tab(okTabs.includes(qTab) ? qTab : (qs.get("mode") === "live" || store.get("openInterp", false)) ? "ceviri" : okTabs.includes(stored) ? stored : "ogren");
  if (!store.get("onb", false) && !qTab && !window.LANG_TEMP) showOnboarding(); // geçici dil: tanıtım şeridi örtmesin
  // v9 hız: boşta SDK'yı ve bağlantıyı önden hazırla — ilk çeviri beklemesin (hata olursa sessiz geç)
  const idle = window.requestIdleCallback ? f => requestIdleCallback(f, { timeout: 2500 }) : f => setTimeout(f, 900);
  idle(() => { try { if (typeof warmup === "function") warmup(); } catch { } });
  // v9: ?selftest=1 → cihazda kendi kendini sına (mikrofon, ses, depolama, bağlantı)
  if (qs.get("selftest")) setTimeout(() => { try { if (typeof selfTest === "function") selfTest(); } catch (e) { console.error(e); } }, 600);
}
try { boot(); }
catch (err) {
  // beyaz ekran yerine kurtarma
  console.error(err);
  document.querySelector("main").innerHTML = `<div class="card"><h2>😕 Bir şeyler ters gitti</h2>
    <p class="small">Uygulama açılırken hata oluştu. Kartların ve ilerlemen duruyor; önce sadece görünüm ayarlarını sıfırlamayı dene.</p>
    <button class="btn primary block" id="repairBtn">🔧 Onar ve yeniden aç</button>
    <p class="small muted">${String(err && err.message || err).replace(/[<>&]/g, "")}</p></div>`;
  document.getElementById("repairBtn").onclick = () => { ["tab", "ctx", "interpLive", "openInterp", "theme", "fontScale"].forEach(k => store.del(k)); location.replace(location.pathname); };
}

/* ---------------- Güncelleme ---------------- */
if ("serviceWorker" in navigator && location.protocol === "https:") {
  navigator.serviceWorker.register("sw.js").then(reg => {
    // güncelleme çubuğu ayrı bir öğe: kaybolan bildirim tıklamaları yutmasın, başka bildirim onu silmesin
    const ask = w => {
      if ($("#updBar")) return;
      const b = document.createElement("div"); b.id = "updBar"; b.className = "toast on"; b.style.pointerEvents = "auto"; b.style.top = "calc(56px + env(safe-area-inset-top))"; b.style.bottom = "auto";
      b.innerHTML = `Yeni sürüm hazır <button class="btn sm" id="updBtn" style="margin-left:6px">Yenile</button> <button class="btn sm ghost" id="updLater" aria-label="Sonra">✕</button>`;
      document.body.appendChild(b);
      $("#updBtn").onclick = () => { Back.reset(); w.postMessage("skipWaiting"); };
      $("#updLater").onclick = () => b.remove();
    };
    if (reg.waiting && navigator.serviceWorker.controller) ask(reg.waiting);
    reg.addEventListener("updatefound", () => { const w = reg.installing; w && w.addEventListener("statechange", () => { if (w.state === "installed" && navigator.serviceWorker.controller) ask(w); }); });
    // ilk kurulumda (önceden denetleyici yokken) sayfayı yenileme — yalnız güncellemede yenile
    const hadCtl = !!navigator.serviceWorker.controller; let reloaded = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => { if (!hadCtl || reloaded) return; reloaded = true; location.reload(); });
  }).catch(() => { });
}
