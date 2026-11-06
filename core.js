/* Dil Köprüsü — çekirdek: depolama, profil, tekrar sistemi, ses, dinleme, Claude bağlantısı, talimatlar */
"use strict";

/* ---------------- Küçük yardımcılar ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const DEMO = new URLSearchParams(location.search).has("demo");
const SDK_URL = "https://cdn.jsdelivr.net/npm/@anthropic-ai/sdk@1.1.0/+esm";
const MODEL_BEST = "claude-opus-5-5";
const MODEL_FAST = "claude-haiku-5-5";
const localDate = (d = new Date()) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
const todayStr = () => localDate();
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return localDate(d); };
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const store = {
  get(k, d) { try { const v = localStorage.getItem("dk_" + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem("dk_" + k, JSON.stringify(v)); } catch { /* depolama dolu ya da kapalı */ } },
  del(k) { try { localStorage.removeItem("dk_" + k); } catch { } }
};
let toastTimer;
function toast(msg) { const t = $("#toast"); t.textContent = msg; t.classList.add("on"); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("on"), 2600); }
function haptic(p = 15) { try { navigator.vibrate && navigator.vibrate(p); } catch { } }
function lev(a, b) {
  if (a === b) return 0; if (!a.length) return b.length; if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[b.length];
}
const normWords = t => String(t).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['’]/g, "").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
/** Hedef cümlenin her kelimesi için, duyulan/yazılan metinde yakın eşleşme var mı? */
function wordMatch(target, heard) {
  const tw = normWords(target), hw = normWords(heard);
  const used = new Set();
  const marks = tw.map(w => {
    const tol = w.length <= 3 ? 0 : w.length <= 6 ? 1 : 2;
    let hit = -1;
    for (let i = 0; i < hw.length; i++) if (!used.has(i) && lev(w, hw[i]) <= tol) { hit = i; break; }
    if (hit >= 0) used.add(hit);
    return { w, ok: hit >= 0 };
  });
  const pct = tw.length ? Math.round(100 * marks.filter(m => m.ok).length / tw.length) : 0;
  return { pct, marks };
}

/* ---------------- Profil ("Benim durumum") ---------------- */
const PROFILE_DEFAULT = { name: "", city: "", months: "", job: "Albert Heijn süpermarketi (kasa, raf, müşteri)", contract: "", kids: "", level: "A1", homeJob: "", target: "", goal: 10 };
function profile() { return { ...PROFILE_DEFAULT, ...store.get("profile", {}) }; }
function profileForAI() {
  const p = profile();
  const parts = [
    "Turkish native speaker who recently moved from Turkey to Flanders, Belgium",
    p.city && `lives in ${p.city}`,
    p.months && `has been in Belgium for about ${p.months} months`,
    p.job && `current job: ${p.job}`,
    p.contract && `contract: ${p.contract}`,
    p.kids && `children: ${p.kids}`,
    `Dutch level: about ${p.level || "A1"}`,
    p.homeJob && `profession/education in Turkey: ${p.homeJob}`,
    p.target && `wants to move to: ${p.target}`
  ].filter(Boolean);
  return `About the user: ${parts.join("; ")}. Goal: Dutch for daily life in Flanders and for better jobs. Write every Turkish field in natural, simple Turkish.`;
}

/* ---------------- Tekrar sistemi (aralıklı tekrar) ---------------- */
// Anahtar: Felemenkçe metin (tanıma: NL→TR) ve "metin|p" (üretme: TR→NL). Kutular 0–7.
const INTERVALS = [0, 1, 3, 7, 14, 30, 60, 120];
const SRS = {
  all() { return store.get("srs", {}); },
  get(key) { return this.all()[key] || null; },
  /** grade: 0 bilemedim, 1 zor, 2 bildim. mc: çoktan seçmeli (tanıma) — kutu 2'yi geçiremez */
  mark(key, grade, { mc = false } = {}) {
    const s = this.all(); const r = s[key] || { b: 0, lapses: 0 };
    if (grade === 0) { r.b = 0; r.lapses = (r.lapses || 0) + 1; r.due = todayStr(); }
    else if (grade === 1) { r.b = Math.max(1, r.b); r.due = addDays(Math.max(1, Math.round(INTERVALS[r.b] / 2))); }
    else {
      if (mc && r.b >= 2) { if (!r.due || r.due <= todayStr()) r.due = addDays(INTERVALS[r.b]); } // kutu yükselmez ama bugünden ileri atılır
      else { r.b = Math.min(r.b + 1, INTERVALS.length - 1); r.due = addDays(INTERVALS[r.b]); }
    }
    r.seen = todayStr(); s[key] = r; store.set("srs", s);
    Progress.didCard();
    return r;
  },
  box(key) { return (this.all()[key] || {}).b || 0; },
  isDue(key) { const r = this.all()[key]; return !!r && r.due <= todayStr(); }
};

/* ---------------- İlerleme: günlük hedef, seri, puan ---------------- */
const Progress = {
  today() { const t = store.get("today", {}); return t.d === todayStr() ? t : { d: todayStr(), cards: 0, xp: 0 }; },
  didCard() {
    const t = this.today(); t.cards++; store.set("today", t);
    if (t.cards >= 5) this.markStreakDay(); // en az 5 kart = seri korunur
    if (window.App) App.renderStats();
  },
  addXP(n) {
    if (!n) return;
    store.set("xp", store.get("xp", 0) + n);
    const t = this.today(); t.xp += n; store.set("today", t);
    const f = document.createElement("div"); f.className = "xpfloat"; f.textContent = `+${n} ⭐`; document.body.appendChild(f); setTimeout(() => f.remove(), 1000);
    if (window.App) App.renderStats();
  },
  markStreakDay() { const days = store.get("days", []); const t = todayStr(); if (!days.includes(t)) { days.push(t); store.set("days", days.slice(-500)); } },
  streak() {
    const days = new Set(store.get("days", [])); let n = 0; const d = new Date();
    if (!days.has(localDate(d))) d.setDate(d.getDate() - 1);
    while (days.has(localDate(d))) { n++; d.setDate(d.getDate() - 1); }
    return n;
  },
  goalCards() { return { 5: 10, 10: 20, 20: 40 }[profile().goal] || 20; }
};

/* ---------------- Sesli okuma ---------------- */
const TTS = {
  voices: [], cur: null,
  ok() { return "speechSynthesis" in window; },
  load() { if (!this.ok()) return; this.voices = speechSynthesis.getVoices(); if (window.App) App.onVoices(); },
  nlVoices() { return this.voices.filter(v => v.lang && v.lang.toLowerCase().startsWith("nl")).sort((a, b) => (b.lang === "nl-BE") - (a.lang === "nl-BE")); },
  pick(lang) {
    if (lang === "nl") { const L = this.nlVoices(); const pref = store.get("voice", ""); return L.find(v => v.voiceURI === pref) || L[0] || null; }
    return this.voices.find(v => v.lang && v.lang.toLowerCase().startsWith(lang)) || null;
  },
  speak(text, { slow = false, lang = "nl", rate } = {}) {
    if (!this.ok()) { toast("Bu tarayıcıda sesli okuma yok"); return; }
    const clean = String(text || "").replace(/[\[\]]/g, "").trim(); if (!clean) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(clean);
    const v = this.pick(lang); if (v) u.voice = v;
    u.lang = v ? v.lang : (lang === "nl" ? "nl-BE" : "tr-TR");
    const base = store.get("rate", 0.9);
    u.rate = rate || (slow ? Math.max(0.45, base * 0.65) : base);
    this.cur = u; // referans tut: bazı Android sürümleri yoksa sesi yarıda keser
    clearTimeout(this.t);
    this.t = setTimeout(() => { this.t = null; try { speechSynthesis.speak(u); } catch { } }, 60); // cancel→speak yarışını önler
    if (lang === "nl" && !v && !store.get("warnedVoice", false)) { store.set("warnedVoice", true); toast("Felemenkçe ses paketi yok — Ben → Ayarlar'da nasıl kurulacağı yazıyor"); }
  },
  stop() { clearTimeout(this.t); this.t = null; if (this.ok()) try { speechSynthesis.cancel(); } catch { } },
  unlock() { // iOS: ilk dokunuşta sessiz bir okuma ile sesi aç
    if (!this.ok() || this.unlocked) return; this.unlocked = true;
    try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; speechSynthesis.speak(u); } catch { }
  }
};
if (TTS.ok()) { TTS.load(); speechSynthesis.onvoiceschanged = () => TTS.load(); }
document.addEventListener("pointerdown", () => TTS.unlock(), { once: true, capture: true });

/* ---------------- Dinleme: tek merkezden yönetilen ses tanıma ---------------- */
const SR_CLASS = window.SpeechRecognition || window.webkitSpeechRecognition;
const IS_ANDROID = /Android/i.test(navigator.userAgent);
const IS_IOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
const IN_APP_BROWSER = /FBAN|FBAV|Instagram|Line\/|WhatsApp|Snapchat|TikTok/i.test(navigator.userAgent);
const Speech = {
  cur: null,
  supported() { return !!SR_CLASS; },
  stopAll() { if (this.cur) this.cur.cancel(); },
  /** Tek seferde tek dinleme. Her oturumda tam olarak bir kez onDone ya da onError çağrılır. */
  listen({ lang, owner, onText = () => { }, onDone = () => { }, onError = () => { }, maxMs = 60000 }) {
    if (!SR_CLASS) { onError("nosupport"); return null; }
    if (this.cur) this.cur.cancel();
    TTS.stop();
    let rec = null, committed = "", session = "", ended = false, wantStop = false, running = false;
    let errorCode = null, idle = 0, gotThisRun = false, restartTimer = null, safety = null;
    const cap = setTimeout(() => h.stop(), maxMs);
    const finish = () => {
      if (ended) return; ended = true; running = false;
      clearTimeout(restartTimer); clearTimeout(safety); clearTimeout(cap);
      if (Speech.cur === h) Speech.cur = null;
      const text = (committed + " " + session).replace(/\s+/g, " ").trim();
      if (errorCode && !text) onError(errorCode); else onDone(text);
    };
    const run = () => {
      rec = new SR_CLASS();
      rec.lang = lang; rec.interimResults = true; rec.maxAlternatives = 1;
      rec.continuous = !IS_ANDROID; // Android'de continuous tekrar üretir; kısa oturumları biz zincirliyoruz
      session = ""; gotThisRun = false;
      rec.onresult = e => {
        let fin = "", interim = "";
        for (let i = 0; i < e.results.length; i++) { const r = e.results[i]; if (r.isFinal) fin += r[0].transcript + " "; else interim += r[0].transcript; }
        session = fin; gotThisRun = true; idle = 0;
        onText((committed + " " + fin + " " + interim).replace(/\s+/g, " ").trim());
      };
      rec.onerror = e => {
        if (e.error === "no-speech" || e.error === "aborted") return;
        errorCode = e.error; wantStop = true;
      };
      rec.onend = () => {
        running = false;
        committed = (committed + " " + session).replace(/\s+/g, " ").trim(); session = "";
        if (!wantStop && IS_ANDROID && !errorCode) {
          if (!gotThisRun) idle++;
          if (idle >= 3) { finish(); return; } // uzun sessizlikte bip döngüsüne girme
          restartTimer = setTimeout(() => { if (!wantStop && !ended) { try { run(); } catch { finish(); } } else finish(); }, 150);
          return;
        }
        finish();
      };
      try { rec.start(); running = true; } catch { errorCode = "start"; finish(); }
    };
    const h = {
      owner,
      get active() { return !ended; },
      stop() { // kullanıcı "bitti" dedi: elimizdekini ver
        if (ended) return; wantStop = true; clearTimeout(restartTimer);
        if (running) { try { rec.stop(); } catch { finish(); } safety = setTimeout(finish, 1500); }
        else finish();
      },
      cancel() { // sessizce iptal (sekme değişti vb.)
        if (ended) return; ended = true; wantStop = true;
        clearTimeout(restartTimer); clearTimeout(safety); clearTimeout(cap);
        try { rec && rec.abort(); } catch { }
        if (Speech.cur === h) Speech.cur = null;
        onError("cancelled");
      }
    };
    this.cur = h;
    run();
    return h;
  },
  errorText(code) {
    return ({
      "not-allowed": "Mikrofon izni verilmedi. Tarayıcı ayarlarından bu siteye mikrofon izni ver.",
      "service-not-allowed": IS_IOS ? "iPhone'da ses tanıma kapalı: Ayarlar → Genel → Klavye → Dikte'yi aç. Olmazsa klavyedeki 🎤 ile yaz." : "Ses tanıma bu cihazda kapalı.",
      "network": "Ses tanıma için internet gerekiyor.",
      "audio-capture": "Mikrofon bulunamadı ya da başka uygulama kullanıyor.",
      "nosupport": IN_APP_BROWSER ? "Bu uygulama içi tarayıcıda mikrofon çalışmaz. Linki Chrome (Android) ya da Safari'de (iPhone) aç." : "Bu tarayıcı sesle dinlemeyi desteklemiyor. Android'de Chrome, iPhone'da Safari kullan. Yazarak da çalışır (klavyedeki 🎤 ile).",
      "language-not-supported": "Bu dil telefonun ses tanımasında yok. Ayarlar'dan nl-NL'yi dene.",
      "start": "Dinleme başlatılamadı, bir daha dene."
    })[code] || ("Dinleme hatası: " + code);
  }
};

/* ---------------- Canlı altyazı: sürekli dinleme ----------------
   Kesinleşen her cümle onFinal ile ayrı gelir. Tarayıcı oturumu kendiliğinden kapatırsa durdurulana kadar yeniden başlatır.
   Android'de continuous modda sonuçlar birikerek tekrar gelebiliyor: önceki kesin metinle başlıyorsa yalnız yeni kısmı al. */
Speech.live = function ({ lang, onInterim = () => { }, onFinal = () => { }, onEnd = () => { }, onError = () => { }, maxMs = 30 * 60000 }) {
  if (!SR_CLASS) { onError("nosupport"); return null; }
  if (this.cur) this.cur.cancel();
  TTS.stop();
  let rec = null, ended = false, lastFinal = "", restartTimer = null, netFails = 0;
  const cap = setTimeout(() => h.stop(), maxMs);
  const cleanup = () => { clearTimeout(cap); clearTimeout(restartTimer); if (Speech.cur === h) Speech.cur = null; };
  const run = () => {
    rec = new SR_CLASS();
    rec.lang = lang; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 1;
    lastFinal = "";
    rec.onresult = e => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i]; const t = r[0].transcript.trim();
        if (r.isFinal) {
          let d = t;
          if (lastFinal && t.toLowerCase().startsWith(lastFinal.toLowerCase())) d = t.slice(lastFinal.length).trim();
          lastFinal = t;
          if (d) { netFails = 0; onFinal(d); }
        } else interim += t + " ";
      }
      onInterim(interim.trim());
    };
    rec.onerror = e => {
      if (e.error === "no-speech" || e.error === "aborted") return;
      if (e.error === "network") { netFails++; return; }
      if (!ended) { ended = true; cleanup(); onError(e.error); }
    };
    rec.onend = () => {
      if (ended) return;
      if (netFails > 5) { ended = true; cleanup(); onError("network"); return; }
      restartTimer = setTimeout(() => { if (!ended) { try { run(); } catch { ended = true; cleanup(); onError("start"); } } }, 250);
    };
    try { rec.start(); } catch { ended = true; cleanup(); onError("start"); }
  };
  const h = {
    owner: "live",
    get active() { return !ended; },
    stop() { if (ended) return; ended = true; cleanup(); try { rec && rec.stop(); } catch { } onEnd(); }, // stop: son cümle yine onFinal ile gelebilir
    cancel() { if (ended) return; ended = true; cleanup(); try { rec && rec.abort(); } catch { } onError("cancelled"); }
  };
  this.cur = h;
  run();
  return h;
};

/* ---------------- Ekran açık kalsın (tercüman ve müşteriye göster) ---------------- */
const Wake = {
  lock: null, want: false,
  async on() {
    this.want = true;
    if (!("wakeLock" in navigator) || this.lock || this.pending) return;
    this.pending = true;
    try {
      const l = await navigator.wakeLock.request("screen");
      if (!this.want) { l.release(); return; } // bu arada sekme değişti: kilidi hemen bırak
      this.lock = l; l.addEventListener("release", () => { if (this.lock === l) this.lock = null; });
    } catch { } finally { this.pending = false; }
  },
  off() { this.want = false; try { this.lock && this.lock.release(); } catch { } this.lock = null; }
};
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && Wake.want) Wake.on(); });

/* ---------------- Claude bağlantısı ---------------- */
class UserError extends Error { constructor(m, code) { super(m); this.code = code; } }
let sdkPromise = null;
function loadSDK() {
  if (!sdkPromise) sdkPromise = import(SDK_URL).then(m => m.default || m.Anthropic).catch(e => { sdkPromise = null; throw e; });
  return sdkPromise;
}
const SERIOUS = new Set(["doktor", "resmi", "polis", "okul"]);
/** Hangi özellik hangi modeli kullanır. Varsayılan en iyi kalite; tercümanda kullanıcı ⚡ hızlı modu seçebilir (ciddi durumlarda yine en iyisi). */
function modelFor(feature, ctx) {
  if (feature === "interp" && !SERIOUS.has(ctx) && store.get("fastInterp", false)) return MODEL_FAST;
  if (feature === "practice" && store.get("fastPractice", false)) return MODEL_FAST;
  return MODEL_BEST;
}
const inflight = new Map(); // özellik → AbortController (aynı özellikte yeni istek eskisini iptal eder)
function abortFeature(feature) { const c = inflight.get(feature); if (c) { c.abort(); inflight.delete(feature); } }
function abortAll() { for (const c of inflight.values()) c.abort(); inflight.clear(); }

function friendlyError(e) {
  if (e instanceof UserError) return e;
  const st = e && e.status; const msg = String((e && e.message) || "");
  const name = (e && (e.name || (e.constructor && e.constructor.name))) || "";
  if (/Abort/i.test(name) || /aborted/i.test(msg)) return new UserError("İptal edildi.", "abort");
  if (/Timeout/i.test(name) || /timed? ?out/i.test(msg)) return new UserError("Cevap çok gecikti. İnterneti kontrol et ya da ⚡ hızlı modu dene.", "timeout");
  if (/credit balance/i.test(msg)) return new UserError("Anthropic hesabında kredi bitmiş. console.anthropic.com → Billing'den yükleme yapılmalı.");
  if (st === 401) return new UserError("API anahtarı geçersiz. Ben → Ayarlar'dan kontrol et.");
  if (st === 403) return new UserError("Bu anahtarın bu modele izni yok.");
  if (st === 404) return new UserError("Model bulunamadı. Uygulamayı güncelle.");
  if (st === 413) return new UserError("Gönderilen dosya çok büyük. Daha az sayfa ya da daha küçük fotoğraf dene.");
  if (st === 429) return new UserError("Çok hızlı istek ya da harcama limiti doldu. Biraz bekleyip tekrar dene.");
  if (st === 529 || (st >= 500 && st < 600)) return new UserError("Servis şu an yoğun. Birkaç saniye sonra tekrar dene.");
  if (st === 400) return new UserError("İstek reddedildi: " + msg.slice(0, 160));
  if (!navigator.onLine) return new UserError("İnternet yok. Dersler, kartlar ve hazır cümleler internetsiz çalışır.");
  if (/fetch|network|load|import/i.test(msg)) return new UserError("Bağlantı kurulamadı. İnterneti kontrol edip tekrar dene.");
  return new UserError("Beklenmeyen hata: " + msg.slice(0, 160));
}
function parseJSON(text) {
  try { return JSON.parse(text); } catch { const m = String(text).match(/\{[\s\S]*\}/); if (m) { try { return JSON.parse(m[0]); } catch { } } throw new UserError("Cevap okunamadı, tekrar dene."); }
}
function readResponse(r) {
  if (r.stop_reason === "refusal") throw new UserError("Model bu isteği yanıtlamadı. Biraz farklı söyleyip tekrar dene.");
  const text = (r.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  if (!text) throw new UserError(r.stop_reason === "max_tokens" ? "Cevap çok uzun kesildi, tekrar dene." : "Boş cevap geldi, tekrar dene.");
  return parseJSON(text);
}
/** Şemadaki zorunlu alanları doldur: modelin eksik bıraktığı alan arayüzü çökertmesin */
function fillDefaults(obj, schema) {
  if (!schema || schema.type !== "object" || !obj || typeof obj !== "object") return obj;
  for (const [k, s] of Object.entries(schema.properties || {})) {
    if (obj[k] == null) obj[k] = s.type === "array" ? [] : s.type === "boolean" ? false : s.type === "integer" ? 0 : "";
    else if (s.type === "array" && Array.isArray(obj[k]) && s.items && s.items.type === "object") obj[k] = obj[k].filter(x => x && typeof x === "object").map(x => fillDefaults(x, s.items));
  }
  return obj;
}
/**
 * Claude'a tek bir yapılandırılmış istek.
 * content: metin ya da içerik blokları (görsel için).
 */
async function callClaude({ feature, kind, system, content, schema, ctx, timeout = 60000, maxTokens = 8000, model }) {
  abortFeature(feature);
  const ctrl = new AbortController(); inflight.set(feature, ctrl);
  try {
    if (DEMO) return fillDefaults(await demoAnswer(kind, ctrl.signal), schema);
    const key = store.get("apiKey", "");
    if (!key) throw new UserError("Bunun için Claude API anahtarı gerekiyor: Ben → Ayarlar.", "nokey");
    let Anthropic;
    try { Anthropic = await loadSDK(); } catch (e) { throw friendlyError(e); }
    const client = new Anthropic({ apiKey: key, dangerouslyAllowBrowser: true, maxRetries: 1, timeout });
    const m = model || modelFor(feature, ctx);
    const messages = [{ role: "user", content }];
    const base = { model: m, max_tokens: maxTokens, system, messages, output_config: { effort: "low", format: { type: "json_schema", schema } } };
    const opts = { signal: ctrl.signal, timeout };
    // 1) Opus: reddedilirse sunucu tarafında yedek modele geçiş; 2) düz istek; 3) şemasız, metinle JSON
    const attempts = [];
    if (m.startsWith("claude-opus")) attempts.push(() => client.beta.messages.create({ ...base, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" }, opts));
    attempts.push(() => client.messages.create(base, opts));
    attempts.push(() => client.messages.create({ model: m, max_tokens: maxTokens, messages, output_config: { effort: "low" },
      system: system + "\n\nReturn ONLY one JSON object (no markdown) matching this JSON schema:\n" + JSON.stringify(schema) }, opts));
    let last;
    for (const attempt of attempts) {
      try { return fillDefaults(readResponse(await attempt()), schema); }
      catch (e) {
        last = e;
        if (e instanceof UserError) throw e;
        if (e && e.status === 400 && !/credit balance/i.test(String(e.message))) continue; // bu biçim desteklenmiyorsa sıradakini dene
        throw friendlyError(e);
      }
    }
    throw friendlyError(last);
  } finally {
    if (inflight.get(feature) === ctrl) inflight.delete(feature);
  }
}

/* ---------------- Görsel küçültme (mektup fotoğrafı) ---------------- */
async function imageToBlock(file) {
  let src;
  try { src = await createImageBitmap(file, { imageOrientation: "from-image" }); }
  catch { // eski iOS: seçenek desteklenmiyor → <img> ile çöz (tarayıcı yönü kendisi düzeltir)
    const url = URL.createObjectURL(file); const img = new Image(); img.src = url;
    try { await img.decode(); } finally { setTimeout(() => URL.revokeObjectURL(url), 1000); }
    src = img;
  }
  const sw = src.width || src.naturalWidth, sh = src.height || src.naturalHeight;
  const max = 1568; const scale = Math.min(1, max / Math.max(sw, sh));
  const w = Math.round(sw * scale), h = Math.round(sh * scale);
  const c = document.createElement("canvas"); c.width = w; c.height = h;
  c.getContext("2d").drawImage(src, 0, 0, w, h);
  if (src.close) src.close();
  const data = c.toDataURL("image/jpeg", 0.8).split(",")[1];
  return { type: "image", source: { type: "base64", media_type: "image/jpeg", data } };
}

/* ---------------- Talimatlar ---------------- */
const OKUNUS_RULES = `Pronunciation guide ("okunus") rules: show how a Turkish reader should pronounce the Dutch, using ONLY Turkish letters (never the letter w), lowercase. Mapping: g/ch → h (soft, Flemish); ui → öy; ij/ei → ey; oe → u; eu → ö; u/uu → ü; ie → i; w → v; v → v (voiced in Flemish, never f); sch → s-h; sj → ş; j → y; -isch → is; -ig → ıh; -lijk → lık; unstressed e → ı; -en → ın; -tje → tyı; ou/au → au; long vowels aa/ee/oo stay doubled. Example: "Goeiedag, hebt u een Bonuskaart?" → "huyıdah, hept ü een boonüskaart".`;
const CTX_LABEL = {
  is: "at work in the supermarket (customers, colleagues, team leader)",
  genel: "everyday life (street, shop, neighbours, friends)",
  doktor: "at the doctor, hospital or pharmacy",
  resmi: "at an official office (gemeente, bank, mutualiteit, VDAB, landlord)",
  okul: "at the children's school or childcare",
  polis: "with the police or in an emergency"
};
function sysInterpIn(ctx) {
  const serious = SERIOUS.has(ctx);
  return `You are the live interpreter inside a phone app. ${profileForAI()}
Situation: ${CTX_LABEL[ctx] || CTX_LABEL.genel}.
Input: an automatic speech-recognition (ASR) transcript of what a Dutch speaker just said, plus recent conversation context. The transcript may contain recognition errors, missing words and Flemish forms (ge/gij, efkes, allee, amai, goesting, 'k, da's, nen/ne, wablieft, seffens…). Use the situation and context to reconstruct the most likely intended sentence${serious ? ", but in this serious situation be conservative: do not guess facts; keep every number, date, time, dose, amount and name exactly as heard, and say clearly when something is uncertain" : ""}.
Fields:
- ceviri_tr: natural, fluent Turkish translation (not word-for-word). This is shown first and biggest.
- duzeltilmis_nl: the most likely intended Dutch sentence (fix ASR errors only).
- niyet_tr: one short Turkish line: what this person wants from the user.
- notlar_tr: short Turkish notes only when useful (dialect word, politeness, what was uncertain). Empty string otherwise.
- guven: "yuksek", "orta" or "dusuk" — how sure you are about the meaning.
- onemli_uyari_tr: ${serious ? "if any number, dose, date, deadline, money or legal consequence is involved, a short Turkish warning to ask them to write it down or confirm it; otherwise empty" : "empty string unless something risky was said"}.
- cevaplar: 3 or 4 replies the user can say right away, in simple, polite Belgian Dutch ("u" for customers/officials, "je" for colleagues), each at most ~12 words, different in intent where sensible (yes / no / ask to repeat / ask to write it down / offer help). Prefer Belgian words (kasticket, gsm, Bancontact, job). Never invent prices, aisle numbers, rules or facts: put slots in square brackets, e.g. "Dat ligt in gang [nummer]." If guven is "dusuk", the first reply politely asks to repeat slowly. Each: nl, tr, okunus, ton (one Turkish word: kibar, kısa, samimi, soru, yardım).
${OKUNUS_RULES}`;
}
function sysInterpOut(ctx) {
  return `You are the "what do I say?" helper inside a phone app. ${profileForAI()}
Situation: ${CTX_LABEL[ctx] || CTX_LABEL.genel}.
Input: what the user wants to say, in Turkish (may be an ASR transcript with errors, or a question like "müşteriye kartı takmasını nasıl söylerim?"), plus recent context. Always produce the Dutch sentence they need.
Fields:
- nl: the best way to say it in natural, polite Belgian Dutch, simple enough for the user's level. "u" with customers/officials unless context shows a colleague or friend. Facts the user must fill in go in square brackets.
- okunus: pronunciation of nl.
- tr_geri: Turkish back-translation of nl so the user can check the meaning.
- alternatifler: 2 or 3 alternatives (shorter, more formal, casual Flemish), each with nl, tr, okunus, ton (kibar, kısa, samimi, resmi).
- ipucu_tr: one short Turkish learning tip about a word or grammar point in nl (max 2 sentences).
${OKUNUS_RULES}`;
}
function sysRP() {
  return `You run a spoken role-play practice inside a phone app. ${profileForAI()}
You play the Dutch-speaking role described in the scenario, at the given level: "başlangıç" = very short, simple, slow standard Dutch; "orta" = normal everyday Belgian Dutch; "ileri" = natural speed with Flemish expressions. Each turn you get the scenario, the conversation so far, and the user's latest line: Dutch (possibly an ASR transcript with errors), or "[YARDIM]" when they are stuck, or "[BAŞLA]" to start.
Fields:
- geri_bildirim_tr: friendly, short Turkish feedback on the user's latest line: what was good and the single most important fix (word order, verb form, de/het, politeness). Empty on [BAŞLA]. On [YARDIM], explain in Turkish what they could say now.
- dogru_hali_nl: corrected, natural version of the user's latest line. Empty on [BAŞLA] and [YARDIM].
- puan: 0–3 for the latest line (3 clear and natural, 2 understandable with small errors, 1 hard to understand, 0 not understandable or [BAŞLA]/[YARDIM]).
- musteri_nl: your next line in the role; realistic for the scenario in Flanders. Never break character here.
- musteri_tr: Turkish translation of musteri_nl. musteri_okunus: its pronunciation.
- ornek_cevap_nl, ornek_cevap_tr, ornek_cevap_okunus: one good answer the user could give to your new line.
- bitti: true when the scene reaches a natural end (after about 6–10 exchanges); then musteri_nl is a closing line and geri_bildirim_tr ends with a two-sentence overall summary.
Be warm and encouraging. Do not invent laws or official procedures; keep official details general.
${OKUNUS_RULES}`;
}
function sysAsk() {
  return `You are a patient Dutch (Belgian Dutch / Flemish) teacher inside a phone app. ${profileForAI()}
The student asks in Turkish about Dutch: grammar, word choice, de/het, pronunciation, "is this sentence correct?", Flemish vs Netherlands Dutch, how to say something, or how to study. Answer like a good teacher for their level:
- cevap_tr: clear Turkish explanation, max ~8 sentences, concrete, comparing with Turkish where it helps (word order, case suffixes vs prepositions). If they give a Dutch sentence to check, say whether it is correct and give the corrected version.
- ornekler: 2 to 4 short Dutch example sentences that show the point, each with nl, tr, okunus.
If the question is about a real-life procedure (papers, rights, money), answer briefly in general terms and name the office to ask (gemeente, VDAB, mutualiteit, Huis van het Nederlands); never state legal deadlines or amounts as facts.
${OKUNUS_RULES}`;
}
function sysLesson() {
  return `You write a short Dutch lesson for a phone app. ${profileForAI()}
You get a topic (in Turkish) and a CEFR level. Write a lesson useful in real life in Flanders for exactly that topic and level: A1 very short basic sentences; A2 everyday sentences; B1 work and longer sentences with omdat/dat; B2 natural professional language.
Fields:
- baslik_tr: short Turkish title (max 5 words). emoji: one emoji.
- aciklama_tr: 2–4 Turkish sentences: the key vocabulary or grammar point and one cultural tip for Belgium if relevant.
- ifadeler: 10 to 12 items, each ONE speakable Dutch sentence or word group (with de/het for nouns; no "X / Y" pairs), ordered easy to harder: nl, tr, okunus.
Use Belgian Dutch where it differs from the Netherlands. Do not invent laws, prices or procedures.
${OKUNUS_RULES}`;
}
const DOC_TYPES = { mektup: "an official or business letter", bordro: "a Belgian payslip (loonbrief/loonfiche)", okul: "a message or note from a school (e.g. Smartschool)", sozlesme: "a contract (rental, work or other)", fatura: "an invoice or payment request", mesaj: "a WhatsApp/SMS/e-mail message", diger: "a document" };
function sysDoc(type) {
  return `You help a newcomer understand ${DOC_TYPES[type] || DOC_TYPES.diger} written in Dutch (or French/English) in Belgium. ${profileForAI()}
You get photos of the pages and/or pasted text. Explain it in simple Turkish. STRICT SAFETY RULES:
- Report dates and amounts ONLY if they are literally written in the document, each with a short verbatim quote (alinti_nl). Never calculate or guess legal deadlines; never say the user can ignore a document.
- If the text is unreadable or cut off, say so in ozet_tr and set risk to "sari".
- Red flags → risk "kirmizi" and tell them to get free help quickly (OCMW/CPAS, vakbond, Juridisch Eerstelijnsbijstand / "Justitiehuis", the sender's official phone number): deurwaarder, dagvaarding, gerechtsbrief, uithuiszetting, ingebrekestelling, aanmaning with costs, boete, bevel, beslag, inbreuk, termination of contract (ontslag, opzeg), C4.
- Payment: never tell them to pay; tell them to check the IBAN/structured message (gestructureerde mededeling) against an invoice or account they already know, never one only from an SMS/e-mail. If the message looks like phishing (urgent link, bpost/itsme/bank/"pakket" SMS, unknown IBAN), say so and set risk "kirmizi".
- For a payslip: explain bruto → RSZ (roughly 13.07% for most employees; for manual workers it is calculated on 108% of gross, and reductions such as the werkbonus change it) → belastbaar → bedrijfsvoorheffing → netto in general terms — never conclude that a payslip is wrong from these approximate numbers, meal vouchers, hours, overtime/night bonuses; if the user's own note (e.g. hours worked) does not match what is printed, suggest a polite Dutch question to HR — never accuse the employer.
Fields:
- belge_turu (Turkish), gonderen (as written), ozet_tr (3–6 sentences), eylem_gerekli (true/false), risk ("yesil" informational, "sari" needs action, "kirmizi" urgent/legal/money risk/possible scam), risk_neden_tr (one sentence), yapilacaklar (Turkish steps), tarihler [{tarih, amac_tr, alinti_nl}], tutarlar [{tutar, aciklama_tr, alinti_nl}], odeme_uyarisi_tr (empty if no payment), kime_sor_tr (which office/person to ask), cevap_taslagi_nl (a short polite Dutch reply or question if a reply makes sense, else empty), cevap_taslagi_tr (its Turkish meaning), yeni_kelimeler (up to 8 useful words/phrases from the document: nl, tr, okunus).
${OKUNUS_RULES}`;
}
const RECIPIENTS = { sef: "the user's manager/team leader or colleague at work", evsahibi: "the landlord", okul: "a teacher or the school", resmi: "an official office (gemeente, mutualiteit, VDAB, bank)", sirket: "a company where the user applies for a job", arkadas: "a neighbour or friend" };
function sysWrite() {
  return `You help a newcomer write a short message in Belgian Dutch. ${profileForAI()}
You get: recipient type, channel (WhatsApp/SMS or e-mail), mode ("yaz" = user describes in Turkish what to say; "duzelt" = user wrote their own Dutch attempt to correct), and the text. Write a message the user can copy and send themselves (the app never sends anything).
Fields:
- konu_nl: e-mail subject line (empty for WhatsApp/SMS).
- mesaj_nl: the full message, natural and polite for the recipient and channel (e-mail: "Beste …," / "Met vriendelijke groeten," + [naam]; WhatsApp to a team leader: short, friendly, "je"). Facts the user must fill in go in square brackets. Keep it short and at the user's level so they can defend it in person.
- geri_ceviri_tr: Turkish meaning of mesaj_nl.
- aciklama_tr: in "duzelt" mode, the 2–4 most important corrections and why (Turkish); in "yaz" mode, one tip for writing this kind of message.
- uyari_tr: if the message commits the user to something (resigning, accepting contract changes, admitting fault, agreeing to pay, signing), a short Turkish warning; else empty.
${OKUNUS_RULES}`;
}
function sysPhone() {
  return `You prepare a newcomer for a phone call in Belgian Dutch (preparation only; the app cannot listen during the call). ${profileForAI()}
You get who they call and their goal in Turkish (plus their name if given).
Fields:
- acilis: the opening line (greet, say their name, why they call): nl, tr, okunus.
- isim_harfleme: how to spell their name aloud in Dutch letter names (a=aa, b=bee, c=see, d=dee, e=ee, f=ef, g=gee, h=haa, i=ie, j=jee, k=kaa, l=el, m=em, n=en, o=oo, p=pee, q=kuu, r=er, s=es, t=tee, u=uu, v=vee, w=wee, x=iks, y=i-grec, z=zet; Turkish letters: ş = "s met een haakje"…), e.g. "Elif: ee – el – ie – ef". Empty if no name.
- sorular: 4–6 questions they will probably be asked, each {soru_nl, soru_tr, cevap_nl (an answer with [slots]), cevap_tr, okunus (of cevap_nl)}.
- kapanis: closing line: nl, tr, okunus.
- ipucu_tr: one short Turkish tip for this call (e.g. have your rijksregisternummer ready, ask for an e-mail confirmation).
${OKUNUS_RULES}`;
}
function sysDebrief() {
  return `You are an encouraging Dutch coach. ${profileForAI()} The user did a real-world speaking mission in Flanders and tells you in Turkish how it went.
Fields: tesvik_tr (2–3 warm, specific Turkish sentences), eksik_ifadeler (2–4 Dutch phrases that would have helped in that situation: nl, tr, okunus), sonraki_tr (one small next step in Turkish).
${OKUNUS_RULES}`;
}

function sysLive(ctx) {
  const name = profile().name;
  return `You produce live Turkish captions for Dutch speech the user overhears around them (they are not necessarily being addressed). ${profileForAI()}
Situation: ${CTX_LABEL[ctx] || CTX_LABEL.genel}.
Input: the recent captions for context and the NEWEST automatic speech-recognition segment. Segments can be fragments, contain recognition errors, Flemish forms and workplace jargon.
Fields:
- tr: natural Turkish translation of the NEWEST segment only (short, like a subtitle). If it is only noise or filler ("eh", "ja ja"), return an empty string.
- duzeltilmis_nl: the most likely intended Dutch for the newest segment (fix ASR errors only).
- onemli: true ONLY if the segment is an instruction or task that could be meant for the user, mentions the user${name ? ` (name: ${name})` : ""}, mentions a time, shift, break or schedule change, is a safety warning, or is a question likely directed at the user.
- not_tr: when onemli is true, a very short Turkish explanation (e.g. "Sana kasaya geçmeni söylüyor", "Molanın saati değişti"); otherwise empty.
Never invent content that was not said.`;
}
function sysLiveSum() {
  return `You summarise an overheard Dutch conversation for the user. ${profileForAI()}
Input: the captions (Dutch with Turkish) of the conversation, in order.
Fields:
- ozet_tr: what the conversation was about, 3–6 short Turkish sentences, plain and concrete.
- benimle_ilgili_tr: anything that concerns the user (tasks, their name, times, shift or rule changes, things they should ask about). Empty string if nothing. Mark uncertain points as uncertain; never invent.
- sorulacak_nl: one short polite Dutch question the user could ask a colleague to confirm the most important point (empty if not needed); sorulacak_tr: its Turkish meaning; sorulacak_okunus: pronunciation.
- kelimeler: 5–8 useful words or short phrases that actually occurred (work vocabulary first, with de/het for nouns): nl, tr, okunus.
${OKUNUS_RULES}`;
}

/* ---------------- Şemalar ---------------- */
const S = (props) => ({ type: "object", additionalProperties: false, required: Object.keys(props), properties: props });
const STR = { type: "string" }, BOOL = { type: "boolean" };
const ITEM = S({ nl: STR, tr: STR, okunus: STR });
const REPLY = S({ nl: STR, tr: STR, okunus: STR, ton: STR });
const SCHEMA = {
  in: S({ ceviri_tr: STR, duzeltilmis_nl: STR, niyet_tr: STR, notlar_tr: STR, guven: { type: "string", enum: ["yuksek", "orta", "dusuk"] }, onemli_uyari_tr: STR, cevaplar: { type: "array", items: REPLY } }),
  out: S({ nl: STR, okunus: STR, tr_geri: STR, alternatifler: { type: "array", items: REPLY }, ipucu_tr: STR }),
  rp: S({ geri_bildirim_tr: STR, dogru_hali_nl: STR, puan: { type: "integer" }, musteri_nl: STR, musteri_tr: STR, musteri_okunus: STR, ornek_cevap_nl: STR, ornek_cevap_tr: STR, ornek_cevap_okunus: STR, bitti: BOOL }),
  ask: S({ cevap_tr: STR, ornekler: { type: "array", items: ITEM } }),
  lesson: S({ baslik_tr: STR, emoji: STR, aciklama_tr: STR, ifadeler: { type: "array", items: ITEM } }),
  doc: S({ belge_turu: STR, gonderen: STR, ozet_tr: STR, eylem_gerekli: BOOL, risk: { type: "string", enum: ["yesil", "sari", "kirmizi"] }, risk_neden_tr: STR,
    yapilacaklar: { type: "array", items: STR }, tarihler: { type: "array", items: S({ tarih: STR, amac_tr: STR, alinti_nl: STR }) },
    tutarlar: { type: "array", items: S({ tutar: STR, aciklama_tr: STR, alinti_nl: STR }) }, odeme_uyarisi_tr: STR, kime_sor_tr: STR,
    cevap_taslagi_nl: STR, cevap_taslagi_tr: STR, yeni_kelimeler: { type: "array", items: ITEM } }),
  write: S({ konu_nl: STR, mesaj_nl: STR, geri_ceviri_tr: STR, aciklama_tr: STR, uyari_tr: STR }),
  phone: S({ acilis: ITEM, isim_harfleme: STR, sorular: { type: "array", items: S({ soru_nl: STR, soru_tr: STR, cevap_nl: STR, cevap_tr: STR, okunus: STR }) }, kapanis: ITEM, ipucu_tr: STR }),
  debrief: S({ tesvik_tr: STR, eksik_ifadeler: { type: "array", items: ITEM }, sonraki_tr: STR }),
  ping: S({ cevap: STR }),
  live: S({ tr: STR, duzeltilmis_nl: STR, onemli: BOOL, not_tr: STR }),
  livesum: S({ ozet_tr: STR, benimle_ilgili_tr: STR, sorulacak_nl: STR, sorulacak_tr: STR, sorulacak_okunus: STR, kelimeler: { type: "array", items: ITEM } })
};

/* ---------------- Deneme modu (?demo): anahtarsız arayüz testi ---------------- */
function demoAnswer(kind, signal) {
  const data = {
    in: { ceviri_tr: "İyi günler, yulaf sütünüz de var mı?", duzeltilmis_nl: "Goeiedag, hebt u ook havermelk?", niyet_tr: "Müşteri yulaf sütü arıyor.", notlar_tr: "'havermelk' = yulaf sütü.", guven: "yuksek", onemli_uyari_tr: "",
      cevaplar: [
        { nl: "Ja, dat ligt in gang [nummer].", tr: "Evet, [numara]. koridorda.", okunus: "ya, dat liht in hang [nümır]", ton: "yardım" },
        { nl: "Kom, ik loop even mee.", tr: "Gelin, birlikte gidelim.", okunus: "kom, ik loop eevın mee", ton: "kibar" },
        { nl: "Sorry, het is uitverkocht.", tr: "Üzgünüm, tükendi.", okunus: "sori, ıt is öytfırkoht", ton: "kısa" },
        { nl: "Kunt u dat herhalen, alstublieft?", tr: "Tekrarlar mısınız lütfen?", okunus: "künt ü dat herhaalın, alstüblift", ton: "soru" }] },
    out: { nl: "Wilt u uw kasticket?", okunus: "vilt ü üv kastiket", tr_geri: "Fişinizi ister misiniz?", ipucu_tr: "Belçika'da fişe 'kasticket' denir; Hollanda'da 'bonnetje'.",
      alternatifler: [{ nl: "Kasticket?", tr: "Fiş?", okunus: "kastiket", ton: "kısa" }, { nl: "Mag ik u het kasticket geven?", tr: "Fişi verebilir miyim?", okunus: "mah ik ü ıt kastiket heevın", ton: "resmi" }] },
    rp: { geri_bildirim_tr: "Güzel! 'u' kullanman çok kibar.", dogru_hali_nl: "Goeiedag, hebt u een Bonuskaart?", puan: 3, musteri_nl: "Ja, alstublieft. Hier is mijn kaart.", musteri_tr: "Evet, buyurun. İşte kartım.", musteri_okunus: "ya, alstüblift. hir is meyn kaart",
      ornek_cevap_nl: "Dank u. Hebt u een zak nodig?", ornek_cevap_tr: "Teşekkürler. Poşet lazım mı?", ornek_cevap_okunus: "dank ü. hept ü een zak noodıh", bitti: false },
    ask: { cevap_tr: "'de' mi 'het' mi çoğunlukla kurala bağlı değildir; kelimeyi tanımlığıyla ezberle. Çoğul her zaman 'de', küçültme (-je) her zaman 'het'.", ornekler: [{ nl: "het meisje", tr: "kız", okunus: "ıt meyşı" }, { nl: "de meisjes", tr: "kızlar", okunus: "dı meyşıs" }] },
    lesson: { baslik_tr: "Depo işi kelimeleri", emoji: "🏗️", aciklama_tr: "Depoda güvenlik kelimeleri çok önemlidir. Belçika'da 'heftruck' forklift demektir.",
      ifadeler: [{ nl: "de heftruck", tr: "forklift", okunus: "dı heftrük" }, { nl: "het magazijn", tr: "depo", okunus: "ıt mahazeyn" }, { nl: "Draag je veiligheidsschoenen.", tr: "Güvenlik ayakkabılarını giy.", okunus: "draah yı veylıhheyts-s-hunın" }] },
    doc: { belge_turu: "Hatırlatma mektubu (fatura)", gonderen: "Water-Link", ozet_tr: "Su faturanızın ödenmediğini hatırlatan bir mektup. Ödeme yaptıysanız dikkate almanız gerekmez ama kontrol edin.", eylem_gerekli: true, risk: "sari", risk_neden_tr: "Ödeme isteniyor; ödenmezse ek masraf çıkabilir.",
      yapilacaklar: ["Banka hesabından bu faturanın ödenip ödenmediğine bak.", "Ödenmediyse faturadaki bilgilerle öde.", "Anlamadığın bir şey varsa firmanın kendi sitesindeki numarayı ara."],
      tarihler: [{ tarih: "15/12/2026", amac_tr: "Son ödeme tarihi", alinti_nl: "te betalen vóór 15/12/2026" }], tutarlar: [{ tutar: "€ 48,20", aciklama_tr: "Ödenmemiş tutar", alinti_nl: "openstaand bedrag: € 48,20" }],
      odeme_uyarisi_tr: "IBAN ve yapılandırılmış mesajı (+++…+++) eski faturanla karşılaştır; SMS'teki linkten ödeme yapma.", kime_sor_tr: "Water-Link müşteri hizmetleri (faturadaki numara).",
      cevap_taslagi_nl: "Beste, ik heb de factuur op [datum] betaald. Kunt u dat nakijken? Met vriendelijke groeten, [naam]", cevap_taslagi_tr: "Merhaba, faturayı [tarih]'te ödedim. Kontrol edebilir misiniz? Saygılarımla, [ad]",
      yeni_kelimeler: [{ nl: "de herinnering", tr: "hatırlatma", okunus: "dı herinıring" }, { nl: "het openstaande bedrag", tr: "ödenmemiş tutar", okunus: "ıt oopınstaandı bıdrah" }] },
    write: { konu_nl: "", mesaj_nl: "Hoi [naam], ik ben vandaag ziek en kan helaas niet komen werken. Ik ga naar de dokter en laat je iets weten. Sorry!", geri_ceviri_tr: "Merhaba [ad], bugün hastayım ve maalesef işe gelemiyorum. Doktora gidiyorum, sana haber veririm. Kusura bakma!", aciklama_tr: "Şefe WhatsApp'ta 'je' kullanmak normaldir; doktor raporu kuralını iş yönetmeliğinden kontrol et.", uyari_tr: "" },
    phone: { acilis: { nl: "Goeiedag, u spreekt met Elif. Ik bel voor een afspraak.", tr: "İyi günler, ben Elif. Randevu için arıyorum.", okunus: "huyıdah, ü spreekt met elif. ik bel voor een afspraak" }, isim_harfleme: "Elif: ee – el – ie – ef",
      sorular: [{ soru_nl: "Wat is uw geboortedatum?", soru_tr: "Doğum tarihiniz nedir?", cevap_nl: "[dag] [maand] [jaar].", cevap_tr: "[gün] [ay] [yıl].", okunus: "[dah] [maant] [yaar]" }],
      kapanis: { nl: "Dank u wel, tot ziens.", tr: "Çok teşekkürler, hoşça kalın.", okunus: "dank ü vel, tot zins" }, ipucu_tr: "Kimlik kartın ve takvimin yanında olsun." },
    debrief: { tesvik_tr: "Harika! İlk kez fırında Felemenkçe sipariş vermek büyük adım.", eksik_ifadeler: [{ nl: "Mag ik een half grijs brood, gesneden?", tr: "Yarım kepekli ekmek, dilimlenmiş alabilir miyim?", okunus: "mah ik een half hreys broot, hısneedın" }], sonraki_tr: "Yarın aynı fırında 'Tot morgen!' de." },
    ping: { cevap: "Hallo!" },
    live: { tr: "Elif, sen saat üçte kasa 2'ye geçebilir misin?", duzeltilmis_nl: "Elif, kan jij om drie uur naar kassa twee gaan?", onemli: true, not_tr: "Sana saat 15:00'te 2 numaralı kasaya geçmeni söylüyor." },
    livesum: { ozet_tr: "Takım lideri bugünkü görev dağılımını anlattı. Saat üçte kasada bir kişi eksik olacak. Akşam yeni sevkiyat gelecek ve süt reyonu doldurulacak.", benimle_ilgili_tr: "Saat 15:00'te 2 numaralı kasaya geçmen isteniyor (emin olmak için sor).",
      sorulacak_nl: "Moet ik om drie uur naar kassa twee?", sorulacak_tr: "Saat üçte kasa 2'ye mi geçmeliyim?", sorulacak_okunus: "mut ik om dri üür naar kasa twee",
      kelimeler: [{ nl: "de levering", tr: "sevkiyat", okunus: "dı leevıring" }, { nl: "de zuivelafdeling", tr: "süt ürünleri reyonu", okunus: "dı zöyvılafdeeling" }] }
  };
  return new Promise((res, rej) => {
    const t = setTimeout(() => res(JSON.parse(JSON.stringify(data[kind] || {}))), 700);
    signal && signal.addEventListener("abort", () => { clearTimeout(t); rej(new UserError("İptal edildi.", "abort")); });
  });
}
