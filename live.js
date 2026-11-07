/* Dil Köprüsü — 🎧 Canlı altyazı (yanında konuşulanı anlamak)
   Bağımlılıklar: core.js (Speech.live, callClaude, SCHEMA.live/livesum, sysLive/sysLiveSum, store, esc, toast, haptic, Wake)
   ve app.js (App, ACT, acts, spinner, errBox, saveItem, openShow, modeChips, CTXS). */
"use strict";

/* ---------------- Durum ---------------- */
const LIVE = {
  caps: [], queue: [], busy: false, h: null, sum: null, sumData: null, seq: 0,
  sid: 0,            // dinleme oturumu kimliği (kayıtlar bu kimlikle güncellenir, çoğaltılmaz)
  want: false,       // kullanıcı dinlemenin açık olmasını istiyor mu
  userStop: false,   // son bitiş kullanıcının kendi durdurması mı
  status: "idle",    // idle | listening | reconnecting | paused | silence | stopped
  paused: null,      // { why } → "⏸ Dinleme durdu — devam et" şeridi
  err: null,         // kalıcı hata kutusu
  offer: false,      // durdurunca "Özetle?" önerisi
  restored: 0,       // taslaktan geri yüklenen satır sayısı
  startAt: 0, askAt: 0, prompt: false, promptTimer: null, tick: null,
  hold: null,        // { text, timer } — kısa/yarım parçaları 2 sn bekletip birleştir
  interim: "", unseen: 0, follow: true, hotIdx: -1, saveT: null,
  draftOff: false    // bu oturumun taslağı silindi (iş bitti) — yeniden yazma
};
const LIVE_SRC = "İşte duyduklarım";
const LIVE_MAX_WORDS = 25;
const LIVE_DOM_MAX = 150;
const LIVE_PROMPT_MS = 15 * 60000;
const LIVE_DRAFT_MS = 4 * 3600e3;

/* ---------------- Altyazı ekranına özel stil (index.html'e dokunmadan) ---------------- */
(function injectLiveCss() {
  if (document.getElementById("live-css")) return;
  const s = document.createElement("style"); s.id = "live-css";
  s.textContent = `
:root{--lv-hot:var(--hot,#fef08a);--lv-hot-ink:var(--hot-ink,#422006)}
#caps{--capk:1}
#caps .cap{position:relative;border-bottom:1px solid var(--line);padding:10px 6px;cursor:pointer;transition:opacity .3s;opacity:1}
#caps .cap .tr{font-size:calc(1.12rem*var(--capk));font-weight:650;line-height:1.3}
#caps .cap .nl{font-size:calc(.86rem*var(--capk));color:var(--muted);margin-top:2px;line-height:1.35}
#caps .cap .raw{font-size:.78rem;color:var(--muted);font-style:italic;margin-top:2px}
#caps .cap:not(:nth-last-child(-n+3)){opacity:.62}
#caps .cap:last-child .tr{font-size:calc(1.5rem*var(--capk));font-weight:750}
#caps .cap:last-child .nl{font-size:calc(.95rem*var(--capk))}
#caps .cap.learn .nl{font-size:calc(1.12rem*var(--capk));color:var(--ink);font-weight:650}
#caps .cap.learn:last-child .nl{font-size:calc(1.4rem*var(--capk))}
#caps .cap.learn .tr{font-size:calc(1rem*var(--capk));font-weight:600;margin-top:4px}
#caps .cap .blur{filter:blur(7px);-webkit-user-select:none;user-select:none;cursor:pointer}
#caps .cap.hot{opacity:1;background:var(--lv-hot);color:var(--lv-hot-ink);border:0;border-left:6px solid var(--lv-hot-ink);border-radius:14px;margin:6px 0;padding:10px 12px}
#caps .cap.hot .nl,#caps .cap.hot .raw{color:inherit;opacity:.8}
#caps .cap .why{font-weight:800;margin-top:6px;font-size:calc(1rem*var(--capk));color:inherit}
#caps .cap .kanit{font-size:.88rem;margin-top:2px;opacity:.85;font-style:italic}
#caps .cap.flash{animation:lvflash 1.4s}
@keyframes lvflash{0%,40%{box-shadow:0 0 0 4px var(--lv-hot-ink)}100%{box-shadow:0 0 0 0 transparent}}
#caps .cap.low .tr{color:var(--muted);font-style:italic;font-weight:500}
#caps .cap.noise{padding:4px 6px;opacity:.5}
#caps .cap.err .tr{color:var(--bad);font-size:.98rem;font-weight:650}
#caps .cap .tools{display:none;margin-top:4px}
#caps .cap.open .tools,#caps .cap.hot .tools{display:block}
#caps .cap .rep{display:flex;gap:6px;flex-wrap:wrap;margin-top:8px}
#caps .cap .rep .chip{flex:1 1 auto;max-width:100%;min-width:0;min-height:44px;background:var(--card);color:var(--ink);white-space:normal;text-align:left;border-color:var(--lv-hot-ink)}
#caps .cap .rep .chip small{display:block;font-weight:500;color:var(--muted)}
#capsInterim{font-style:italic;color:var(--muted);font-size:calc(1.05rem*var(--capk,1));padding:8px 6px;min-height:1.4em}
#capsInterim:empty{display:none}
.lv-status{display:flex;align-items:center;gap:6px;flex-wrap:wrap;padding:4px 0 8px;font-weight:650;font-size:.95rem}
.lv-status .grow{flex:1;min-width:0}
.lv-status .chip{min-height:38px;padding:6px 12px}
.lv-dot{display:inline-block;width:11px;height:11px;border-radius:50%;background:var(--danger);margin-right:4px;vertical-align:0;animation:lvdot 1.2s infinite}
@keyframes lvdot{50%{opacity:.25}}
.lv-banner{display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:var(--card2);border:2px solid var(--line);border-radius:14px;padding:10px 12px;margin:0 0 10px;font-weight:650}
.lv-banner .grow{flex:1;min-width:150px}
.lv-newpill{position:fixed;left:50%;transform:translateX(-50%);z-index:27;bottom:calc(var(--navh,72px) + 200px);border:0;border-radius:999px;background:var(--brand);color:var(--brand-ink);font-weight:750;padding:10px 16px;min-height:44px;box-shadow:0 4px 14px rgba(0,0,0,.25)}
#liveBtn.live{background:var(--card)!important;color:var(--danger)!important;border-color:var(--danger)!important;animation:none!important;min-height:64px}
#liveBtn.live .big{display:none}
.lv-sheet{position:fixed;inset:0;z-index:65;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center}
.lv-sheet .in{background:var(--bg);color:var(--ink);border-radius:20px 20px 0 0;max-height:90vh;overflow:auto;width:100%;max-width:640px;padding:18px 16px calc(18px + env(safe-area-inset-bottom))}
.lv-sheet ul{padding-left:20px;margin:8px 0}
.lv-sheet li{margin:6px 0}
.lv-tog{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)}
.lv-tog:last-child{border-bottom:0}
`;
  document.head.appendChild(s);
})();

/* ---------------- Yardımcılar ---------------- */
const lvWords = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const lvMMSS = ms => { const s = Math.max(0, Math.floor(ms / 1000)); return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`; };
const lvActive = () => !!(LIVE.h && LIVE.h.active);
const lvOnScreen = () => App.view === "ceviri" && !!App.interp.live;
const lvLearn = () => !!store.get("liveLearn", false);
const lvNorm = s => String(s || "").toLowerCase().replace(/[.,!?…;:"“”']/g, " ").replace(/\s+/g, " ").trim();
// Dolgu sözcükleri: API'ye gitmeden yerelde çevrilir ("" = gürültü, satır hiç gösterilmez)
const LV_FILLER = {
  "ja": "Evet.", "jaja": "Evet evet.", "ja ja": "Evet evet.", "ja hoor": "Evet tabii.", "jawel": "Evet, öyle.", "nee": "Hayır.", "neen": "Hayır.", "nee nee": "Hayır hayır.",
  "oké": "Tamam.", "oke": "Tamam.", "ok": "Tamam.", "okay": "Tamam.", "goed": "İyi / tamam.", "prima": "Tamam, güzel.", "top": "Süper.", "zeker": "Kesinlikle.",
  "merci": "Teşekkürler.", "dank je": "Teşekkürler.", "dank u": "Teşekkürler.", "dankjewel": "Teşekkürler.", "dank je wel": "Teşekkürler.", "dank u wel": "Teşekkürler.", "bedankt": "Teşekkürler.", "merci hé": "Teşekkürler.",
  "allee": "Hadi / peki.", "allez": "Hadi / peki.", "amai": "Vay be!", "sorry": "Pardon.", "pardon": "Pardon.", "hallo": "Merhaba.", "hoi": "Selam.", "dag": "Merhaba / hoşça kal.", "salut": "Selam / hoşça kal.",
  "goeiedag": "İyi günler.", "goeiemorgen": "Günaydın.", "goedemorgen": "Günaydın.", "goeienavond": "İyi akşamlar.", "tot straks": "Sonra görüşürüz.", "tot morgen": "Yarın görüşürüz.", "tot ziens": "Hoşça kal.", "daag": "Hoşça kal.",
  "euh": "", "eh": "", "ehm": "", "uhm": "", "hm": "", "hmm": "", "mm": ""
};
// Cümle bu sözcüklerle bitiyorsa devamı geliyor demektir → kısa süre bekle
const LV_OPEN_END = /\b(en|maar|want|dus|of|omdat|als|dat|die|de|het|een|van|voor|met|naar|om|op|in|aan|te|bij|tot|uit|zodat|wanneer|terwijl|tegen|over|zonder)$/i;
function lvFiller(text) {
  const n = lvNorm(text); if (!n) return "";
  if (n in LV_FILLER) return LV_FILLER[n];
  const toks = n.split(" "); // "ja ja oké" gibi karışık dolgular
  if (toks.length <= 4 && toks.every(t => t in LV_FILLER)) { const u = [...new Set(toks.map(t => LV_FILLER[t]).filter(Boolean))]; return u.join(" "); }
  return null;
}

/* ---------------- Satır görünümü ---------------- */
const capHtml = c => {
  const learn = lvLearn(), low = c.guven === "dusuk";
  const cls = ["cap", c.hot ? "hot" : "", low && c.state === "ok" ? "low" : "", c.state === "err" ? "err" : "", c.state === "noise" ? "noise" : "", learn ? "learn" : "", c.open ? "open" : ""].filter(Boolean).join(" ");
  let tr = "";
  if (c.state === "wait") tr = `<div class="skel" style="width:70%;height:18px"></div>`;
  else if (c.state === "err") tr = `<div class="tr">⚠️ Çevrilemedi — dokun, tekrar dene ↻</div>`;
  else if (c.tr) {
    const t = (low ? "belki: " : "") + c.tr;
    tr = learn && !c.shown ? `<div class="tr blur" data-act="liveReveal" data-id="${c.id}" title="Türkçesini göster">${esc(t)}</div>` : `<div class="tr">${esc(t)}</div>`;
  }
  const nl = `<div class="nl">${learn ? "" : "🇧🇪 "}${esc(c.nl || c.raw)}</div>`;
  const raw = c.raw && c.nl && lvNorm(c.raw) !== lvNorm(c.nl) ? `<div class="raw">duyulan: “${esc(c.raw)}”</div>` : "";
  const hot = c.hot ? `<div class="why">🔔 ${esc(c.why || "Seninle ilgili olabilir")}</div>${c.kanit ? `<div class="kanit">“${esc(c.kanit)}”</div>` : ""}
    <div class="rep">${c.cevap && c.cevap.nl ? `<button class="chip" data-act="show" data-nl="${esc(c.cevap.nl)}" data-tr="${esc(c.cevap.tr)}">💬 ${esc(c.cevap.nl)}<small>${esc(c.cevap.tr)}</small></button>` : ""}
      <button class="chip" data-act="show" data-nl="Kun je dat herhalen?" data-tr="Tekrar eder misin?">🔁 Kun je dat herhalen?<small>Tekrar eder misin?</small></button></div>` : "";
  const tools = c.state === "ok" && c.tr ? `<div class="tools">${acts(c.nl || c.raw, c.tr, c.ok || "", LIVE_SRC)}</div>` : "";
  return `<div class="${cls}" id="${c.id}" data-act="liveLine" data-id="${c.id}">${learn ? nl + tr : tr + nl}${raw}${hot}${tools}</div>`;
};
function updateCap(c) { const el = document.getElementById(c.id); if (el) el.outerHTML = capHtml(c); }

function statusHtml() {
  const on = lvActive(); const hot = LIVE.caps.filter(c => c.hot).length;
  const wait = LIVE.queue.length + (LIVE.busy ? 1 : 0);
  const st = on ? ({ reconnecting: "⏳ Yeniden bağlanıyor…", paused: "⏸ Durakladı", silence: "🤫 Sessizlik…" }[LIVE.status] || `<span class="lv-dot" aria-hidden="true"></span>Dinliyor · <span id="liveTimer">${lvMMSS(Date.now() - LIVE.startAt)}</span>`)
    : LIVE.caps.length ? "⏹ Dinleme kapalı" : "Hazır — alttaki düğmeye bas";
  return `<div class="grow">${st}${wait ? ` <span class="small muted" title="çeviri bekliyor">· ⏳${wait}</span>` : ""}</div>
    ${hot ? `<button class="chip" data-act="liveHotJump" aria-label="Seninle ilgili satırlara git" style="background:var(--lv-hot);color:var(--lv-hot-ink);border-color:var(--lv-hot-ink)">🔔 ${hot}</button>` : ""}
    <button class="chip" data-act="liveSize" data-d="-1" aria-label="Yazıyı küçült">A−</button><button class="chip" data-act="liveSize" data-d="1" aria-label="Yazıyı büyüt">A+</button>`;
}
function setStatus() { const el = $("#liveStatus"); if (el) el.innerHTML = statusHtml(); }

function bannerHtml() {
  let h = "";
  if (LIVE.err) h += `<div class="errbox" role="alert" style="margin:0 0 10px">⚠️ ${esc(LIVE.err.message || LIVE.err)}
    <div class="row" style="margin-top:8px">${LIVE.err.restart !== false ? `<button class="btn sm primary" data-act="liveRestart">↻ Yeniden başlat</button>` : ""}${LIVE.err.code === "nokey" || LIVE.err.code === "setup" ? `<button class="btn sm" data-act="goKey">🔑 Anahtar</button>` : ""}<button class="btn sm ghost" data-act="liveErrClose">Kapat</button></div></div>`;
  if (LIVE.prompt) h += `<div class="lv-banner" role="alert"><div class="grow">⏱ ${Math.round((Date.now() - LIVE.startAt) / 60000)} dakikadır dinliyorum. Devam edeyim mi?</div>
    <button class="btn sm primary" data-act="liveMore">Devam et</button><button class="btn sm" data-act="liveToggle">⏹ Durdur</button></div>`;
  if (LIVE.paused && (!lvActive() || LIVE.status === "paused")) h += `<div class="lv-banner" role="status"><div class="grow">⏸ Dinleme durdu${LIVE.paused.why ? ` — <span class="small">${esc(LIVE.paused.why)}</span>` : ""}</div>
    <button class="btn sm primary" data-act="liveResume">▶ Devam et</button><button class="btn sm ghost" data-act="livePauseClose" aria-label="Kapat">✕</button></div>`;
  else if (LIVE.restored && LIVE.caps.length && !lvActive()) h += `<div class="lv-banner" role="status"><div class="grow">↩︎ Önceki dinleme geri geldi (${LIVE.restored} satır)</div>
    <button class="btn sm primary" data-act="liveResume">▶ Devam et</button><button class="btn sm" data-act="liveClear">🧹 Temizle</button></div>`;
  return h;
}
function setBanners() { const el = $("#liveBanners"); if (el) el.innerHTML = bannerHtml(); }

function settingsHtml() {
  const lm = store.get("liveModel", "fast"), learn = lvLearn(), keep = !!store.get("liveKeep", false);
  const tog = (act, on, label, sub) => `<div class="lv-tog"><div><b>${label}</b><div class="small muted">${sub}</div></div><button class="chip" data-act="${act}" aria-pressed="${on}">${on ? "Açık" : "Kapalı"}</button></div>`;
  return `<details class="card" id="liveSet"><summary>⚙️ Altyazı ayarları</summary>
    <div class="lv-tog"><div><b>Model</b><div class="small muted">Hızlı: ~1–2 sn, 10 dk birkaç sent. En iyi: ~5–8 sn, 10 dk ~1 $.</div></div>
      <div class="chips" role="group" aria-label="Altyazı modeli" style="flex-wrap:wrap;justify-content:flex-end"><button class="chip" data-act="liveModel" data-m="fast" aria-pressed="${lm !== "best"}">⚡ Hızlı</button><button class="chip" data-act="liveModel" data-m="best" aria-pressed="${lm === "best"}">🧠 En iyi</button></div></div>
    ${tog("liveLearn", learn, "📖 Öğrenme modu", "Önce Felemenkçe gelir; Türkçesi bulanık, dokununca açılır.")}
    ${tog("liveKeep", keep, "🗂 Dökümü sakla", "Kapalıyken yalnız özet ve kelimeler saklanır, cümleler saklanmaz.")}
    <div class="lv-tog"><div><b>ℹ️ Kurallar ve izin cümlesi</b></div><button class="chip" data-act="liveConsentShow">Göster</button></div>
  </details>`;
}

function sumHtml() {
  const r = LIVE.sumData; if (!r) return "";
  const kel = r.kelimeler || [], cum = r.cumleler || [];
  const row = w => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(w.nl)}" aria-label="Sesli oku">🔊</button><div class="t"><b>${esc(w.nl)}</b><div class="okn small">${esc(w.okunus)}</div><div class="small">🇹🇷 ${esc(w.tr)}</div></div><button class="ibtn" data-act="add" data-nl="${esc(w.nl)}" data-tr="${esc(w.tr)}" data-ok="${esc(w.okunus)}" data-src="${LIVE_SRC}" aria-label="Kartlarıma ekle">➕</button></div>`;
  return `<div class="card" style="margin-top:12px"><h3>📝 Özet</h3><p style="margin:0">${esc(r.ozet_tr)}</p>
    ${r.benimle_ilgili_tr ? `<div class="warnbox" style="margin-top:10px">🔔 <b>Seninle ilgili:</b> ${esc(r.benimle_ilgili_tr)}</div>` : ""}
    ${r.sorulacak_nl ? `<div class="reply"><span class="tag br">Emin olmak için sor</span><div class="mid-nl" style="margin-top:4px">${esc(r.sorulacak_nl)}</div><div class="okn small">${esc(r.sorulacak_okunus)}</div><div class="small">🇹🇷 ${esc(r.sorulacak_tr)}</div>${acts(r.sorulacak_nl, r.sorulacak_tr, r.sorulacak_okunus, LIVE_SRC)}</div>` : ""}
    ${cum.length ? `<h3 style="margin-top:12px">🗣 Duyduğun işe yarar cümleler</h3>${cum.map(row).join("")}` : ""}
    ${kel.length ? `<h3 style="margin-top:12px">📚 Bu konuşmadan kelimeler</h3>${kel.map(row).join("")}` : ""}
    ${kel.length + cum.length ? `<button class="btn primary block" style="margin-top:10px" data-act="liveAddAll">➕ Hepsini ekle (${kel.length + cum.length}) → “${LIVE_SRC}”</button>` : ""}</div>`;
}

function logsHtml() {
  const logs = store.get("liveLogs", []);
  if (!logs.length) return "";
  return `<details class="card" style="margin-top:12px" id="liveLogs"><summary>🗂 Önceki dinlemeler (${logs.length})</summary>
    ${logs.map(l => `<div class="phrase"><div class="t"><b style="font-size:.9rem">${esc(new Date(l.at).toLocaleString("tr-TR"))}</b>
      ${l.ozet ? `<div class="small">${esc(l.ozet)}</div>` : `<div class="small muted">Özetlenmedi</div>`}
      ${l.benimle ? `<div class="small">🔔 ${esc(l.benimle)}</div>` : ""}
      ${l.caps && l.caps.length ? `<details class="small"><summary>Döküm (${l.caps.length} cümle)</summary>${l.caps.map(c => `<div style="margin:4px 0">${esc(c.tr)}<br><span class="muted">${esc(c.nl)}</span></div>`).join("")}</details>` : ""}</div>
      <button class="ibtn" data-act="liveLogDel" data-id="${esc(String(l.id || l.at))}" aria-label="Bu kaydı sil">🗑</button></div>`).join("")}
    <button class="btn sm" style="margin-top:8px" data-act="liveLogsClear">🗑 Tümünü sil</button></details>`;
}
function setLogs() { const el = $("#liveLogsBox"); if (el) el.innerHTML = logsHtml(); }

/* ---------------- Ekran ---------------- */
function renderLive() {
  const ctx = App.interp.ctx; const on = lvActive();
  const shown = LIVE.caps.slice(-LIVE_DOM_MAX);
  $("#liveText") && $("#liveText").classList.add("hidden"); // ara metin artık listenin altında
  $("#v-ceviri").innerHTML = `
    <div class="ctxbar"><div class="row" style="gap:6px;flex-wrap:nowrap"><div class="seg grow" role="group" aria-label="Mod">${modeChips()}</div>${typeof ctxSelect === "function" ? ctxSelect(ctx) : ""}</div>
      <div class="lv-status" id="liveStatus" aria-live="polite">${statusHtml()}</div></div>
    <div id="liveBanners">${bannerHtml()}</div>
    ${!LIVE.caps.length && !on ? `<div class="card"><h2 style="margin-top:0">🎧 Canlı altyazı</h2>
      <p style="margin:0 0 8px">Yanında konuşulan Felemenkçeyi dinler, her cümleyi Türkçe altyazı gibi yazar. Sana bir iş söylendiğinde, adın geçtiğinde ya da saat/vardiya değiştiğinde satır <b>🔔 sarı</b> yanar ve telefon titrer.</p>
      <ul class="small" style="margin:0;padding-left:18px"><li>Telefonu konuşanlara yakın tut.</li><li>Bir satıra dokun: 🔊 dinle, ➕ kartlarına ekle.</li><li>Bitince <b>Özetle</b>: kısa özet + yeni kelimeler.</li><li>Ses kaydedilmez.</li></ul></div>` : ""}
    <div id="caps" style="--capk:${store.get("capSize", 1)}">${shown.map(capHtml).join("")}</div>
    <div id="capsInterim" aria-hidden="true">${esc(LIVE.interim)}</div>
    <div id="liveSumOut" aria-live="polite">${sumHtml()}</div>
    <div id="liveOffer">${offerHtml()}</div>
    ${on ? "" : settingsHtml()}
    <div id="liveLogsBox">${on ? "" : logsHtml()}</div>
    <button class="lv-newpill hidden" id="liveNew" data-act="liveNewJump">↓ yeni</button>`;
  setLiveBtn(on);
  placePill();
  if (on || LIVE.offer) liveScroll(true);
}
function offerHtml() {
  if (lvActive() || !LIVE.caps.length) return "";
  return `<div class="card" style="margin-top:12px">${LIVE.offer && !LIVE.sumData ? `<b>Dinleme bitti.</b> <span class="small muted">Kısa özet ve yeni kelimeler ister misin?</span>` : ""}
    <div class="grid2" style="margin-top:8px"><button class="btn primary" data-act="liveSum">📝 ${LIVE.sumData ? "Yeniden özetle" : "Özetle + kelimeler"}</button><button class="btn" data-act="liveClear">🧹 Temizle</button></div></div>`;
}
function setLiveBtn(on) {
  const b = $("#liveBtn"); if (!b) return;
  b.classList.toggle("live", on); b.setAttribute("aria-pressed", String(on));
  const l = b.querySelector(".lbl"), s = b.querySelector(".sub");
  if (l) l.textContent = on ? "⏹ Dinlemeyi durdur" : LIVE.paused || LIVE.restored ? "▶ Dinlemeye devam et" : "Dinlemeye başla";
  if (s) s.innerHTML = on ? `<span class="lv-dot" aria-hidden="true"></span> dinliyor · <span id="liveBtnTime">${lvMMSS(Date.now() - LIVE.startAt)}</span> — telefonu yakın tut` : "Yakındaki Felemenkçe konuşma → canlı Türkçe altyazı";
}

/* ---------------- Kaydırma: yalnız en alttaysan takip et ---------------- */
function lvDockTop() { const d = $("#dock"); const r = d && d.getClientRects().length ? d.getBoundingClientRect() : null; return r && r.height ? r.top : innerHeight; } // sabit (fixed) öğede offsetParent hep null
function lvEnd() { return $("#capsInterim") || $("#caps"); }
function lvNearBottom() { const e = lvEnd(); if (!e) return true; return e.getBoundingClientRect().bottom <= lvDockTop() + 160; }
function liveScroll(force, isNew) {
  if (!lvOnScreen()) return;
  requestAnimationFrame(() => {
    const e = lvEnd(); if (!e) return;
    if (force || LIVE.follow) {
      const target = LIVE.offer && !lvActive() ? $("#liveOffer") : e;
      const d = target.getBoundingClientRect().bottom - (lvDockTop() - 12);
      if (d > 0 || force) window.scrollBy(0, d);
      LIVE.follow = true; LIVE.unseen = 0; showPill();
    } else if (isNew) { LIVE.unseen++; showPill(); }
  });
}
function placePill() { const p = $("#liveNew"); if (p) p.style.bottom = Math.round(innerHeight - lvDockTop() + 10) + "px"; }
function showPill() { const p = $("#liveNew"); if (!p) return; p.classList.toggle("hidden", !LIVE.unseen); p.textContent = `↓ yeni (${LIVE.unseen})`; placePill(); }
// Takip durumu yalnız kullanıcı kaydırınca değişir; satır büyüyünce (çeviri geldi) takip bozulmaz
addEventListener("scroll", () => { if (!lvOnScreen()) return; LIVE.follow = lvNearBottom(); if (LIVE.follow && LIVE.unseen) { LIVE.unseen = 0; showPill(); } }, { passive: true });
addEventListener("resize", () => { if (lvOnScreen()) placePill(); });

/* ---------------- Başlat / durdur ---------------- */
function liveStart() {
  LIVE.err = null; LIVE.offer = false; LIVE.paused = null; LIVE.restored = 0; LIVE.prompt = false;
  if (!store.get("apiKey", "") && !DEMO) { LIVE.err = { message: "Altyazı için bir kez kurulum gerekiyor (Ben → 🔧 Kurulum → API anahtarı). Bunu genelde ağabeyin yapar.", code: "nokey", restart: false }; haptic([60, 40, 60]); return renderLive(); }
  if (!LIVE.caps.length || !LIVE.sid) LIVE.sid = Date.now();
  LIVE.want = true; LIVE.userStop = false; LIVE.draftOff = false; LIVE.status = "listening"; LIVE.startAt = Date.now(); LIVE.askAt = LIVE.startAt + LIVE_PROMPT_MS;
  haptic(20); Wake.on();
  const h = Speech.live({ lang: store.get("srLang", "nl-BE"),
    onInterim: t => { LIVE.interim = t || ""; const el = $("#capsInterim"); if (el) { el.textContent = (LIVE.hold ? LIVE.hold.text + " " : "") + LIVE.interim; liveScroll(); } },
    onFinal: seg => { LIVE.interim = ""; const el = $("#capsInterim"); if (el) el.textContent = ""; addSeg(seg); },
    onStatus: st => {
      LIVE.status = st; setStatus();
      if (st === "paused") { LIVE.paused = { why: "ekran kapandı ya da uygulamadan çıkıldı" }; setBanners(); setLiveBtn(lvActive()); saveDraft(true); }
      if (st === "listening" && LIVE.paused) { LIVE.paused = null; setBanners(); }
      if (st === "silence") haptic([30, 50, 30]);
    },
    onEnd: why => liveEnded(why === "max" ? "max" : why),
    onError: c => {
      if (c === "cancelled") return liveEnded(LIVE.want ? "başka bir ekrana geçildi" : "");
      LIVE.err = { message: Speech.errorText(c), code: c }; LIVE.want = false; liveEnded();
      haptic([120, 60, 120, 60, 250]);
    } });
  LIVE.h = h;
  clearInterval(LIVE.tick); LIVE.tick = setInterval(liveTick, 1000);
  if (lvOnScreen()) renderLive();
}
function liveEnded(why) {
  clearInterval(LIVE.tick); LIVE.tick = null; clearTimeout(LIVE.promptTimer); LIVE.prompt = false;
  flushHold();
  LIVE.interim = "";
  const user = LIVE.userStop;
  if (!user && LIVE.want && !LIVE.err) { // kendiliğinden durdu (sessizlik, ağ, sekme): kaybolmasın, devam şeridi göster
    LIVE.paused = { why: why || (LIVE.status === "silence" ? "uzun süre konuşma duyulmadı" : "bağlantı kesildi") };
    haptic([40, 60, 40]);
  } else if (user) LIVE.offer = LIVE.caps.length > 0 && !LIVE.paused;
  LIVE.want = false; LIVE.status = "stopped";
  saveDraft(true); saveSession();
  if (lvOnScreen()) renderLive(); else setLiveBtn(false);
}
function liveStop(reason) {
  if (!lvActive()) { LIVE.want = false; return; } // iki kez çağrılması zararsız
  LIVE.userStop = reason !== "auto";
  if (reason && reason !== "user") LIVE.paused = { why: { tab: "başka sekmeye geçildi", mode: "Konuşma moduna geçildi", timeout: "15 dakika doldu" }[reason] || "" };
  try { LIVE.h.stop(); } catch { liveEnded(); }
}
function liveTick() {
  if (!lvActive()) { clearInterval(LIVE.tick); LIVE.tick = null; return; }
  const t = lvMMSS(Date.now() - LIVE.startAt);
  const a = $("#liveTimer"); if (a) a.textContent = t;
  const b = $("#liveBtnTime"); if (b) b.textContent = t;
  if (!LIVE.prompt && Date.now() >= LIVE.askAt) {
    LIVE.prompt = true; haptic([60, 40, 60]); setBanners();
    LIVE.promptTimer = setTimeout(() => { if (LIVE.prompt && lvActive()) liveStop("timeout"); }, 60000);
  }
}
window.LiveUI = {
  isActive: () => lvActive(),
  stop(reason = "user") { liveStop(reason); },
  clear() { liveClearAll(); }
};

/* ---------------- İlk kullanım: kurallar ve izin ---------------- */
const LV_CONSENT_NL = "Mijn telefoon vertaalt wat er gezegd wordt, zodat ik het begrijp. Is dat oké?";
function showConsent(startAfter) {
  closeConsent();
  const d = document.createElement("div"); d.className = "lv-sheet"; d.id = "liveConsent";
  d.setAttribute("role", "dialog"); d.setAttribute("aria-modal", "true"); d.setAttribute("aria-label", "Canlı altyazı kuralları");
  d.innerHTML = `<div class="in"><h2 style="margin-top:0">🎧 Başlamadan önce</h2>
    <ul>
      <li><b>Sana ya da ekibe söylenenler için kullan</b> — brifing, görev, vardiya. Başkalarının özel sohbetini dinleme.</li>
      <li><b>İşyerinde telefon kuralı olabilir.</b> Şefine bir kez sor: <i>“Mag ik mijn telefoon gebruiken om te vertalen?”</i> <button class="btn sm" data-act="say" data-say="Mag ik mijn telefoon gebruiken om te vertalen?">🔊</button></li>
      <li><b>Belçika'da</b> katılmadığın özel konuşmaları gizlice dinlemek ya da kaydetmek yasayla sınırlıdır (Ceza Kanunu — eski md. 314bis; yeni kanunda numara değişmiş olabilir). Bu uygulama <b>ses kaydetmez</b>; ama sesi yazıya telefonun kendi ses tanıması (Android'de Google) çevirir ve ses o sırada onların sunucusunda işlenebilir. Çevrendekilere söylemen en doğrusu. Kesin kural için kontrol et.</li>
      <li>Telefonun ses tanıması sesi yazıya çevirir; yalnız yazı, çeviri için Claude'a gider.</li>
    </ul>
    <div class="reply"><span class="tag br">İş arkadaşlarına söyle</span><div class="mid-nl" style="margin-top:4px">${esc(LV_CONSENT_NL)}</div>
      <div class="okn small">meyn telefoon vertaalt vat er hızeht vort, zoodat ik ıt bıhreyp. is dat ookee?</div><div class="small">🇹🇷 Telefonum söylenenleri çeviriyor, anlayabileyim diye. Sorun olur mu?</div>
      <div class="acts"><button class="ibtn" data-act="say" data-say="${esc(LV_CONSENT_NL)}" aria-label="Sesli oku">🔊</button><button class="ibtn" data-act="show" data-nl="${esc(LV_CONSENT_NL)}" data-tr="Telefonum söylenenleri çeviriyor, anlayabileyim diye. Sorun olur mu?" aria-label="Büyük göster">📢</button></div></div>
    <div class="row" style="margin-top:14px"><button class="btn ghost" data-act="liveConsentNo">Vazgeç</button><button class="btn primary grow" data-act="liveConsentYes" data-start="${startAfter ? 1 : 0}">✅ Anladım${startAfter ? ", başla" : ""}</button></div></div>`;
  document.body.appendChild(d);
  d.addEventListener("click", e => { if (e.target === d) closeConsent(); });
  setTimeout(() => { const b = d.querySelector("[data-act=liveConsentYes]"); b && b.focus({ preventScroll: true }); }, 30);
}
function closeConsent() { const d = $("#liveConsent"); if (d) d.remove(); }
ACT.liveConsentYes = el => { store.set("liveConsent", true); closeConsent(); if (el.dataset.start === "1") liveStart(); };
ACT.liveConsentNo = () => closeConsent();
ACT.liveConsentShow = () => showConsent(false);

/* ---------------- Düğmeler ---------------- */
ACT.interpMode = el => {
  const live = el.dataset.m === "live";
  if (!live && lvActive()) liveStop("mode");
  if (Speech.cur && Speech.cur.owner !== "live") Speech.cur.cancel();
  App.interp.live = live; renderInterp(); window.scrollTo(0, 0);
};
ACT.liveModel = el => { store.set("liveModel", el.dataset.m); renderLive(); const s = $("#liveSet"); if (s) s.open = true; };
ACT.liveLearn = () => { store.set("liveLearn", !lvLearn()); renderLive(); const s = $("#liveSet"); if (s) s.open = true; };
ACT.liveKeep = () => { store.set("liveKeep", !store.get("liveKeep", false)); renderLive(); const s = $("#liveSet"); if (s) s.open = true; };
ACT.liveToggle = () => {
  if (lvActive()) { liveStop("user"); return; }
  if (!store.get("liveConsent", false)) { showConsent(true); return; }
  liveStart();
};
ACT.liveResume = () => {
  if (LIVE.h && LIVE.h.active && typeof LIVE.h.resume === "function") { LIVE.h.resume(); LIVE.paused = null; LIVE.want = true; setBanners(); setStatus(); return; }
  liveStart();
};
ACT.liveRestart = () => { LIVE.err = null; liveStart(); };
ACT.liveErrClose = () => { LIVE.err = null; setBanners(); };
ACT.livePauseClose = () => { LIVE.paused = null; setBanners(); setLiveBtn(lvActive()); };
ACT.liveMore = () => { clearTimeout(LIVE.promptTimer); LIVE.prompt = false; LIVE.askAt = Date.now() + LIVE_PROMPT_MS; setBanners(); };
ACT.liveSize = el => {
  const k = Math.min(1.6, Math.max(0.85, Math.round((+store.get("capSize", 1) + 0.15 * +el.dataset.d) * 100) / 100));
  store.set("capSize", k); const c = $("#caps"); if (c) c.style.setProperty("--capk", k); const i = $("#capsInterim"); if (i) i.style.setProperty("--capk", k);
  toast(`Yazı boyutu: %${Math.round(k * 100)}`);
};
ACT.liveLine = el => {
  const c = LIVE.caps.find(x => x.id === el.dataset.id); if (!c) return;
  if (c.state === "err") { c.state = "wait"; c.retry = true; updateCap(c); LIVE.queue.unshift(c); pumpLive(); return; } // ↻ tekrar dene
  c.open = !c.open; el.classList.toggle("open", c.open);
};
ACT.liveReveal = el => { const c = LIVE.caps.find(x => x.id === el.dataset.id); if (c) c.shown = true; el.classList.remove("blur"); };
ACT.liveHotJump = () => {
  const hots = LIVE.caps.filter(c => c.hot).map(c => document.getElementById(c.id)).filter(Boolean); if (!hots.length) return;
  LIVE.hotIdx = (LIVE.hotIdx + 1) % hots.length; const el = hots[LIVE.hotIdx];
  el.scrollIntoView({ block: "center", behavior: "smooth" }); el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
};
ACT.liveNewJump = () => liveScroll(true);

/* ---------------- Parça politikası → kuyruk ---------------- */
function flushHold() {
  const h = LIVE.hold; if (!h) return; clearTimeout(h.timer); LIVE.hold = null; pushCap(h.text);
}
function addSeg(seg, { now = false } = {}) {
  let text = String(seg || "").replace(/\s+/g, " ").trim(); if (!text) return;
  if (LIVE.hold) { clearTimeout(LIVE.hold.timer); text = LIVE.hold.text + " " + text; LIVE.hold = null; }
  const fill = lvFiller(text);
  if (fill === "") return; // yalnız "euh/hmm": gösterme
  if (fill == null && !now && lvActive() && (lvWords(text) < 3 || LV_OPEN_END.test(text))) {
    // yarım cümle: 2 sn içinde devamı gelirse birleştir
    LIVE.hold = { text, timer: setTimeout(flushHold, 2000) };
    const el = $("#capsInterim"); if (el) el.textContent = text + " …";
    return;
  }
  pushCap(text, fill);
}
function pushCap(text, fill) {
  if (fill === undefined) fill = lvFiller(text);
  if (fill === "") return;
  const c = { id: "c" + (++LIVE.seq), raw: text, nl: text, state: "wait", at: Date.now() };
  if (fill) { c.tr = fill; c.state = "ok"; c.guven = "yuksek"; c.local = true; }
  LIVE.caps.push(c);
  if (LIVE.caps.length > 300) LIVE.caps.shift();
  const box = $("#caps");
  if (box) {
    box.insertAdjacentHTML("beforeend", capHtml(c));
    while (box.children.length > LIVE_DOM_MAX) box.firstElementChild.remove();
    const intro = box.previousElementSibling; // ilk satırda tanıtım kartı gereksiz
    if (LIVE.caps.length === 1 && intro && intro.classList.contains("card") && lvOnScreen()) intro.remove();
    liveScroll(false, true);
  }
  if (!fill) { LIVE.queue.push(c); pumpLive(); }
  setStatus(); saveDraft();
}
async function pumpLive() {
  if (LIVE.busy || !LIVE.queue.length) return;
  LIVE.busy = true;
  const c = LIVE.queue.shift();
  // geride kaldıysak sıradaki parçaları (en çok ~25 kelime) tek istekte birleştir
  while (!c.retry && LIVE.queue.length && !LIVE.queue[0].retry && lvWords(c.raw) + lvWords(LIVE.queue[0].raw) <= LIVE_MAX_WORDS) {
    const x = LIVE.queue.shift();
    c.raw = c.raw + " " + x.raw; c.nl = c.raw;
    const el = document.getElementById(x.id); if (el) el.remove();
    LIVE.caps = LIVE.caps.filter(y => y !== x);
  }
  updateCap(c); setStatus();
  const ctx = App.interp.ctx;
  const recent = LIVE.caps.filter(x => x.state === "ok" && x !== c && !x.local).slice(-6)
    .map(x => `- ASR: "${x.raw}"${x.nl !== x.raw ? ` → NL: "${x.nl}"` : ""} | TR: "${x.tr}"`).join("\n") || "(start of conversation)";
  try {
    const r = await callClaude({ feature: "live:" + c.id, kind: "live", ctx, system: sysLive(ctx), schema: SCHEMA.live,
      model: store.get("liveModel", "fast") === "best" ? MODEL_BEST : MODEL_FAST, timeout: 30000, maxTokens: 4000, retries: 0, effort: "low",
      content: `Recent captions (oldest first; raw ASR, corrected Dutch, Turkish):\n${recent}\n\nNEWEST raw ASR segment: "${c.raw}"` });
    c.nl = r.duzeltilmis_nl || c.raw; c.tr = r.tr || ""; c.ok = r.okunus || "";
    c.guven = ["yuksek", "orta", "dusuk"].includes(r.guven) ? r.guven : "orta";
    c.hot = !!r.onemli && c.guven !== "dusuk"; // düşük güvende asla 🔔
    c.why = c.hot ? r.not_tr : ""; c.kanit = c.hot ? (r.kanit_nl || "") : "";
    c.cevap = c.hot && r.cevap_nl ? { nl: r.cevap_nl, tr: r.cevap_tr || "", ok: r.cevap_okunus || "" } : null;
    c.state = c.tr ? "ok" : "noise";
    if (c.hot) haptic([80, 60, 80, 60, 80]);
  } catch (e) {
    c.state = "err";
    if (e && (e.code === "nokey" || e.code === "setup")) { // yalnız kurulumla çözülür: dinlemeyi boşa sürdürme
      LIVE.err = { message: e.message, code: e.code, restart: false }; haptic([120, 60, 120, 60, 250]);
      if (lvActive()) liveStop("auto"); setBanners();
    }
  }
  updateCap(c); liveScroll(); saveDraft();
  LIVE.busy = false; setStatus(); pumpLive();
}

/* ---------------- Özet ---------------- */
ACT.liveSum = async el => {
  // emin olunmayan satırları işaretle: özet bunları kesin bilgi gibi sunmasın
  const lines = LIVE.caps.filter(c => c.nl && c.state !== "noise").map(c => `${c.guven && c.guven !== "yuksek" ? "[?] " : ""}NL: ${c.nl}${c.raw && c.raw !== c.nl ? ` (heard: ${c.raw})` : ""}${c.tr ? ` | TR: ${c.tr}` : ""}`);
  if (!lines.length) return;
  el.disabled = true; $("#liveSumOut").innerHTML = spinner("Özetleniyor…");
  try {
    const r = await callClaude({ feature: "livesum", kind: "livesum", system: sysLiveSum(), schema: SCHEMA.livesum, model: MODEL_BEST, timeout: 90000, effort: "medium",
      content: `Captions in order:\n${lines.join("\n")}` });
    r.kelimeler = r.kelimeler || []; r.cumleler = r.cumleler || [];
    LIVE.sumData = r; LIVE.sum = sumHtml(); LIVE.offer = false;
    $("#liveSumOut").innerHTML = LIVE.sum;
    const so = $("#liveSumOut .card"); if (so) so.scrollIntoView({ block: "start", behavior: "smooth" });
    saveSession(); setLogs(); lvDraftDone();
    const o = $("#liveOffer"); if (o) o.innerHTML = offerHtml();
    Progress.addXP(2);
  } catch (e) { $("#liveSumOut").innerHTML = e.code === "abort" ? "" : errBox(e); }
  el.disabled = false;
};
ACT.liveAddAll = el => {
  const r = LIVE.sumData; if (!r) return;
  const items = [...(r.cumleler || []), ...(r.kelimeler || [])].filter(w => w && w.nl);
  items.forEach(w => saveItem({ nl: w.nl, tr: w.tr, ok: w.okunus, src: LIVE_SRC }));
  toast(`✅ ${items.length} kart “${LIVE_SRC}” destesine eklendi`);
  el.textContent = "✅ Hepsi eklendi"; el.disabled = true;
};
// Tam sıfırlama (app.js'teki "verileri temizle" de bunu çağırır: LiveUI.clear())
function liveClearAll() {
  if (lvActive()) { LIVE.want = false; LIVE.userStop = true; try { LIVE.h.stop(); } catch { } }
  if (LIVE.hold) { clearTimeout(LIVE.hold.timer); LIVE.hold = null; }
  clearTimeout(LIVE.saveT); clearTimeout(LIVE.promptTimer); clearInterval(LIVE.tick); LIVE.tick = null;
  LIVE.caps = []; LIVE.queue = []; LIVE.sum = null; LIVE.sumData = null; LIVE.offer = false; LIVE.paused = null; LIVE.err = null; LIVE.prompt = false;
  LIVE.restored = 0; LIVE.sid = 0; LIVE.unseen = 0; LIVE.interim = ""; LIVE.follow = true; LIVE.hotIdx = -1; LIVE.status = "idle";
  store.del("liveDraft");
  if (lvOnScreen()) { renderLive(); window.scrollTo(0, 0); } else setLiveBtn(false);
}
ACT.liveClear = () => {
  if (!confirm("Altyazılar temizlensin mi? (Özetlediysen 'Önceki dinlemeler'de durur)")) return;
  liveClearAll();
};
// "Dökümü sakla" kapalıyken: kullanıcı işini bitirdiyse taslağı hemen sil (yalnız kazara yeniden yüklemeye karşı vardı)
function lvDraftDone() {
  if (store.get("liveKeep", false) || lvActive() || LIVE.paused) return;
  LIVE.draftOff = true; clearTimeout(LIVE.saveT); store.del("liveDraft");
}
// Durdurup bitirdikten sonra ekrandan (sekme ya da Konuşma modu) çıkınca da taslağı sil
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act=tab],[data-act=interpMode]"); if (!el || !lvOnScreen()) return;
  if (el.dataset.act === "interpMode" && el.dataset.m === "live") return;
  if (el.dataset.act === "tab" && el.dataset.v === "ceviri") return;
  if (!lvActive() && (LIVE.offer || LIVE.sumData)) lvDraftDone();
}, true);

/* ---------------- Saklama: taslak + oturum kayıtları ---------------- */
// Taslak: yalnız oturum ortasında kazara yeniden yükleme/kesinti için. 4 saatten (bir vardiya) eskiyse atılır;
// "Dökümü sakla" kapalıyken kullanıcı işini bitirince (durdurup özetledi / temizledi / ekrandan çıktı) hemen silinir.
function saveDraft(now) {
  clearTimeout(LIVE.saveT);
  const go = () => {
    if (!LIVE.caps.length || LIVE.draftOff) { store.del("liveDraft"); return; }
    store.set("liveDraft", { at: Date.now(), sid: LIVE.sid, caps: LIVE.caps.slice(-150).filter(c => c.state === "ok" || c.state === "wait" || c.state === "err")
      .map(c => ({ raw: c.raw, nl: c.nl, tr: c.tr || "", g: c.guven || "", hot: !!c.hot, why: c.why || "", k: c.kanit || "", cv: c.cevap || null, st: c.state === "ok" ? "ok" : "err" })) });
  };
  if (now) go(); else LIVE.saveT = setTimeout(go, 1000);
}
// Oturum kaydı: özet her zaman (kısa); cümle dökümü yalnız "Dökümü sakla" açıksa. Aynı oturum tek kayıt olarak güncellenir.
function saveSession() {
  if (!LIVE.sid || !LIVE.caps.length) return;
  const keep = !!store.get("liveKeep", false), r = LIVE.sumData;
  if (!keep && !r) return;
  const logs = store.get("liveLogs", []).filter(l => (l.id || l.at) !== LIVE.sid);
  const prev = store.get("liveLogs", []).find(l => (l.id || l.at) === LIVE.sid) || {};
  logs.unshift({ id: LIVE.sid, at: LIVE.sid,
    ozet: r ? r.ozet_tr : prev.ozet || "", benimle: r ? r.benimle_ilgili_tr : prev.benimle || "",
    caps: keep ? LIVE.caps.filter(c => c.tr).map(c => ({ nl: c.nl, tr: c.tr })) : [] });
  store.set("liveLogs", logs.slice(0, 10));
  if (!lvActive()) setLogs();
}
ACT.liveLogDel = el => {
  const id = +el.dataset.id || el.dataset.id;
  store.set("liveLogs", store.get("liveLogs", []).filter(l => String(l.id || l.at) !== String(id))); setLogs();
  const d = $("#liveLogs"); if (d) d.open = true; toast("Silindi");
};
ACT.liveLogsClear = () => { if (!confirm("Tüm önceki dinlemeler silinsin mi?")) return; store.del("liveLogs"); setLogs(); toast("Hepsi silindi"); };

(function liveBoot() {
  // 7 günden eski kayıtları sil
  const wk = Date.now() - 7 * 864e5;
  const logs = store.get("liveLogs", []); const fresh = logs.filter(l => (l.at || 0) >= wk);
  if (fresh.length !== logs.length) store.set("liveLogs", fresh);
  // yarım kalan dinlemeyi geri yükle
  const d = store.get("liveDraft", null);
  if (d && d.caps && d.caps.length && Date.now() - d.at < LIVE_DRAFT_MS) {
    LIVE.sid = d.sid || d.at;
    LIVE.caps = d.caps.map(x => ({ id: "c" + (++LIVE.seq), raw: x.raw, nl: x.nl, tr: x.tr, guven: x.g, hot: x.hot, why: x.why, kanit: x.k, cevap: x.cv, state: x.st === "ok" && x.tr ? "ok" : "err" }));
    LIVE.restored = LIVE.caps.length;
  } else if (d) store.del("liveDraft");
  // eski motor ekran kapanınca kendisi durmuyorsa: geri gelince dinleme ölmüşse şeridi göster
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden" && LIVE.caps.length) saveDraft(true);
    if (document.visibilityState === "visible" && LIVE.want && !lvActive()) { LIVE.paused = LIVE.paused || { why: "ekran kapandı" }; LIVE.want = false; if (lvOnScreen()) renderLive(); }
  });
})();
