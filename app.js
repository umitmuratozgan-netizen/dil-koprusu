/* Dil Köprüsü — ekranlar ve etkileşim */
"use strict";
const C = {
  LEVELS: window.LEVELS || [], CATS: window.CATS || [], GRAMMAR: window.GRAMMAR || [],
  LIFELINES: window.LIFELINES || [["Een momentje, alstublieft.", "Bir saniye lütfen.", "een moomentyı, alstüblift"], ["Kunt u dat herhalen?", "Tekrarlar mısınız?", "künt ü dat herhaalın"], ["Sorry, ik leer nog Nederlands.", "Pardon, Felemenkçe öğreniyorum.", "sori, ik leer noh needırlants"]],
  CHECKLIST: window.CHECKLIST || { note: "", items: [] }, MISSIONS: window.MISSIONS || [], CANDO: window.CANDO || {},
  ROADMAP: window.ROADMAP || "", OKUNUS_KEY: window.OKUNUS_KEY || [], TOPIC_IDEAS: window.TOPIC_IDEAS || []
};
const LV_ORDER = ["A1", "A2", "B1", "B2"];
/* Temel kelime listesi (WORDS) → seviye + tür bazında kelime konuları; dersler gibi günlük plana girer */
(function wordCats() {
  const W = window.WORDS || []; if (!W.length) return;
  const TAG = { werk: ["🧰", "iş"], thuis: ["🏠", "ev"], stad: ["🏙️", "şehir"], algemeen: ["🔤", "genel"] };
  const groups = {};
  W.forEach(w => { if (!Array.isArray(w) || w.length < 3) return; const lvl = LV_ORDER.includes(w[3]) ? w[3] : "A1"; const tag = TAG[w[4]] ? w[4] : "algemeen"; (groups[lvl + "|" + tag] = groups[lvl + "|" + tag] || []).push([w[0], w[1], w[2]]); });
  const extra = Object.entries(groups).map(([k, items]) => { const [lvl, tag] = k.split("|"); return { id: "w_" + lvl + "_" + tag, lvl, e: TAG[tag][0], n: `Kelimeler: ${TAG[tag][1]} (${items.length})`, items, words: true }; });
  C.CATS = [...C.CATS, ...extra];
})();
/* Ek modüllerin (listen.js, career.js …) bağlandığı noktalar */
const EXT = { helpTiles: [], helpModes: {}, studyTypes: {}, learnCards: [], benCards: [], catModes: [] };
window.EXT = EXT;

/* ---------------- Ortak parçalar ---------------- */
const aiCats = () => store.get("lessons", []);
const allCats = () => [...C.CATS, ...aiCats()];
function itemIndex() {
  const m = new Map();
  const put = (nl, tr, ok, src) => { if (nl && !m.has(nl)) m.set(nl, { nl, tr, ok: ok || "", src }); };
  allCats().forEach(c => c.items.forEach(i => put(P(i[0]), P(i[1]), P(i[2]), c.id)));
  C.GRAMMAR.forEach(g => (g.ex || []).forEach(i => put(P(i[0]), P(i[1]), P(i[2]), g.id)));
  store.get("saved", []).forEach(s => put(s.nl, s.tr, s.ok, "defter"));
  return m;
}
/** {NAAM} → profildeki ad (yoksa Oğuz). core.js'te personalize varsa onu kullan. */
const P = x => (typeof personalize === "function" ? personalize(String(x ?? "")) : String(x ?? "").replace(/\{NAAM\}/g, (profile().name || "Oğuz")));
const catItems = c => c.items.map(i => ({ nl: P(i[0]), tr: P(i[1]), ok: P(i[2] || ""), src: c.id }));
function learnedPct(items) { if (!items.length) return 0; return Math.round(100 * items.filter(i => SRS.box(i.nl) >= 2).length / items.length); }
/** Bir cümle için ses / yavaş / göster / kartlara ekle düğmeleri */
function acts(nl, tr, ok, src, { show = true, add = true } = {}) {
  const a = `data-nl="${esc(nl)}" data-tr="${esc(tr)}" data-ok="${esc(ok)}" data-src="${esc(src || "")}"`;
  return `<div class="acts">
    <button class="ibtn" data-act="say" data-say="${esc(nl)}" aria-label="Sesli oku">🔊</button>
    <button class="ibtn" data-act="slow" data-say="${esc(nl)}" aria-label="Yavaş oku">🐢</button>
    ${show ? `<button class="ibtn" data-act="show" ${a} aria-label="Büyük göster">📢</button>` : ""}
    ${add ? `<button class="ibtn" data-act="add" ${a} aria-label="Kartlarıma ekle">➕</button>` : ""}</div>`;
}
const spinner = (t) => `<div class="card flat"><span class="spinner"></span> ${esc(t || "Hazırlanıyor…")}<div class="skel" style="width:80%"></div><div class="skel" style="width:60%"></div></div>`;
const errBox = (e) => `<div class="errbox" role="alert">⚠️ ${esc(e.message || e)}${e.code === "nokey" ? ` <button class="btn sm" data-act="goKey">Anahtarı gir</button>` : ""}${(e.code === "setup" || e.code === "nokey" || e.detail) ? ` <button class="btn sm" data-act="copy" data-text="${esc("Dil Köprüsü hatası: " + (e.message || "") + (e.detail ? " | " + e.detail : ""))}">📋 Hatayı kopyala (ağabeyine gönder)</button>` : ""}</div>`;
function saveItem({ nl, tr, ok, src }) {
  if (!nl) return;
  const list = store.get("saved", []);
  if (!list.some(x => x.nl === nl)) { list.unshift({ nl, tr, ok, src, at: Date.now() }); store.set("saved", list.slice(0, 800)); }
  if (!SRS.get(nl)) { const s = SRS.all(); s[nl] = { b: 0, lapses: 0, due: todayStr() }; store.set("srs", s); }
  toast("Kartlarına eklendi ➕"); haptic(10);
}
function persistStorage() { try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch { } }

/* ---------------- Uygulama durumu ---------------- */
const App = {
  view: null, learn: { mode: "home" }, help: { mode: "home" }, practice: { mode: "home" }, interp: { ctx: store.get("ctx", "is") },
  renderStats() {
    const st = Progress.streak(), t = Progress.today();
    const p = $("#streakPill"); p.textContent = `🔥 ${st}`; p.classList.toggle("hot", t.cards >= 5);
    p.title = t.cards >= 5 ? "Bugün seri korundu" : "Bugün henüz 5 kart çalışmadın";
    $("#xpPill").textContent = `⭐ ${store.get("xp", 0)}`;
  },
  onVoices() { if (App.view === "ben") renderBen(); }
};
window.App = App;

/* ---------------- Android geri tuşu: alt ekranlar geçmişe yazılır ---------------- */
const Back = {
  stack: [], ignore: 0,
  push(fn) { this.stack.push(fn); try { history.pushState({ dk: this.stack.length }, ""); } catch { } },
  /** Ekran kendi düğmesiyle kapandıysa geçmişten de düşür */
  drop() { if (!this.stack.length) return; this.stack.pop(); this.ignore++; try { history.back(); } catch { this.ignore--; } },
  reset() { const n = this.stack.length; if (!n) return; this.stack = []; this.ignore++; try { history.go(-n); } catch { this.ignore--; } }
};
addEventListener("popstate", () => {
  if (Back.ignore > 0) { Back.ignore--; return; }
  const fn = Back.stack.pop(); if (fn) { try { fn(); } catch { } }
});

/* ---------------- Gezinme ---------------- */
function tab(v) {
  if (!["ogren", "pratik", "ceviri", "yardim", "ben"].includes(v)) v = "ogren";
  if (App.view === v) { // aynı sekmeye tekrar dokunma: dinlemeyi ÖLDÜRME; alt ekrandan ana ekrana dön
    if (v === "ceviri") return;
    if (v === "pratik" && App.practice.mode === "rp") { ACT.rpBack(); return; }
    if (v === "ogren" && App.learn.mode === "study") { ACT.studyExit(); return; }
    if (v === "ogren") App.learn = { mode: "home" }; if (v === "yardim") App.help = { mode: "home" }; if (v === "pratik") App.practice = { mode: "home" };
    Back.reset();
    ({ ogren: renderLearn, pratik: renderPractice, yardim: renderHelp, ben: renderBen })[v]();
    window.scrollTo(0, 0); return;
  }
  // canlı altyazı açıkken sekme değiştirmek dinlemeyi durdurur — sor
  if (window.LiveUI && LiveUI.isActive && LiveUI.isActive() && !(typeof LIVE !== "undefined" && LIVE.status === "paused")) {
    if (!confirm("🎧 Canlı altyazı dinliyor. Başka sekmeye geçersen dinleme durur. Geçilsin mi?")) return;
    LiveUI.stop && LiveUI.stop("tab");
  }
  Back.reset();
  Speech.stopAll();
  document.body.classList.remove("study");
  App.view = v; store.set("tab", v);
  $$("nav.tabs button").forEach(b => b.dataset.v === v ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current"));
  $$("section.view").forEach(s => s.classList.toggle("on", s.id === "v-" + v));
  document.body.classList.toggle("interp", v === "ceviri");
  if (v === "ceviri") Wake.on(); else Wake.off();
  ({ ogren: renderLearn, pratik: renderPractice, ceviri: renderInterp, yardim: renderHelp, ben: renderBen })[v]();
  window.scrollTo(0, 0);
}

/* ---------------- Tek tıklama yöneticisi ---------------- */
const ACT = {};
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const fn = ACT[el.dataset.act]; if (fn) { e.preventDefault(); fn(el, e); }
});
ACT.tab = el => tab(el.dataset.v);
ACT.say = el => TTS.speak(el.dataset.say);
ACT.slow = el => TTS.speak(el.dataset.say, { slow: true });
ACT.add = el => { saveItem(el.dataset); el.textContent = "✅"; };
ACT.show = el => openShow(el.dataset.nl, el.dataset.tr);
ACT.goKey = () => { App.benFocusKey = true; App.benOpenSetup = true; tab("ben"); };
ACT.cancelReq = el => { abortFeature(el.dataset.f); };

/* ---------------- Karşıdakine göster (büyük ekran) ---------------- */
function openShow(nl, tr) {
  const o = $("#showOverlay"); const n = $("#showNL");
  n.textContent = String(nl || "").replace(/[\[\]]/g, "");
  $("#showTR").textContent = tr || ""; $("#showTR").classList.add("hidden");
  o.classList.add("on");
  let size = 64; n.style.fontSize = size + "px";
  while (size > 22 && (n.scrollHeight > window.innerHeight * 0.55 || n.scrollWidth > n.clientWidth + 2)) { size -= 3; n.style.fontSize = size + "px"; }
  Wake.on(); TTS.speak(n.textContent);
  $("[data-act=showClose]", o).focus();
  if (!o.dataset.back) { o.dataset.back = "1"; Back.push(() => closeShow(true)); }
}
function closeShow(fromBack) {
  const o = $("#showOverlay"); if (!o.classList.contains("on")) return;
  o.classList.remove("on"); TTS.stop(); if (App.view !== "ceviri") Wake.off();
  if (o.dataset.back) { delete o.dataset.back; if (!fromBack) Back.drop(); }
}
ACT.showSpeak = () => TTS.speak($("#showNL").textContent);
ACT.showTr = () => $("#showTR").classList.toggle("hidden");
ACT.showClose = () => closeShow();
$("#showOverlay").addEventListener("click", e => { if (!e.target.closest("button")) closeShow(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && $("#showOverlay").classList.contains("on")) closeShow(); });

/* =================================================================
   ÖĞREN
   ================================================================= */
function renderLearn() {
  const L = App.learn;
  if (L.mode === "cat") return renderCat();
  if (L.mode === "gram") return renderGram();
  if (L.mode === "study") return renderStudy();
  renderLearnHome();
}
function ring(done, goal) {
  const r = 34, c = 2 * Math.PI * r, f = Math.min(1, goal ? done / goal : 0);
  return `<svg class="ring" width="84" height="84" viewBox="0 0 84 84" role="img" aria-label="Bugün ${done}/${goal} kart">
    <circle class="bg" cx="42" cy="42" r="${r}"/><circle class="fg" cx="42" cy="42" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - f)}" transform="rotate(-90 42 42)"/>
    <text x="42" y="44" text-anchor="middle">${done}</text><text x="42" y="60" text-anchor="middle" style="font-size:11px;font-weight:600;fill:var(--muted)">/ ${goal} kart</text></svg>`;
}
function dailyPlan() {
  const s = SRS.all(), idx = itemIndex(), today = todayStr();
  let flip = 0;
  const due = Object.entries(s).filter(([k, r]) => r.due && r.due <= today && !k.endsWith("|s")).sort((a, b) => a[1].due < b[1].due ? -1 : 1)
    .map(([k, r]) => {
      const p = k.endsWith("|p"); const it = idx.get(p ? k.slice(0, -2) : k); if (!it) return null;
      if (p) return { type: "prod", item: it };
      // iyi bilinen kartlarda çeşitlilik: bir kart görerek, bir kart sadece dinleyerek
      if ((r.b || 0) >= 2 && (flip++ % 2 === 1)) return { type: "listen", item: it };
      return { type: "flash", item: it };
    })
    .filter(Boolean).slice(0, 30);
  const perDay = { 5: 5, 10: 8, 20: 12 }[profile().goal] || 8;
  const nt = store.get("newToday", {}); const already = nt.d === today ? nt.n : 0;
  // çok tekrar birikmişse yeni kart verme: önce eskiler
  const brake = due.length > 25 ? 0 : due.length > 15 ? Math.min(3, perDay) : perDay;
  const want = Math.max(0, brake - already);
  const unseen = list => list.filter(i => !s[i.nl]);
  const job = unseen(C.CATS.filter(c => c.lvl === "AH").flatMap(catItems));
  const track = unseen([...LV_ORDER.flatMap(l => C.CATS.filter(c => c.lvl === l && !c.words).flatMap(catItems)), ...aiCats().flatMap(catItems)]);
  const lvlNow = LV_ORDER.indexOf(profile().level || "A1");
  const wordLane = unseen(C.CATS.filter(c => c.words && LV_ORDER.indexOf(c.lvl) <= lvlNow + 1).flatMap(catItems)); // kelime şeridi: günde en fazla 3
  const fresh = []; let a = 0, b = 0, w = 0;
  const wantWords = Math.min(3, Math.floor(want / 3)); while (w < wantWords && w < wordLane.length) fresh.push(wordLane[w++]);
  while (fresh.length < want && (a < job.length || b < track.length)) {
    if (b < track.length) fresh.push(track[b++]); // temeller
    if (fresh.length < want && a < job.length) fresh.push(job[a++]); // iş cümleleri
  }
  // günde bir dilbilgisi mini alıştırması (seviyendeki dersler sırayla)
  let gram = null;
  const lvl = profile().level || "A1";
  const gl = C.GRAMMAR.filter(g => g.lvl === lvl && (g.ex || []).some(x => x[0].split(/\s+/).length >= 3));
  if (gl.length && store.get("gramDay", "") !== today) {
    const g = gl[(Math.floor(Date.now() / 86400000)) % gl.length];
    const ex = (g.ex || []).filter(x => x[0].split(/\s+/).length >= 3);
    const x = ex[Math.floor(Math.random() * ex.length)];
    gram = { type: "order", item: { nl: P(x[0]), tr: P(x[1]), ok: P(x[2] || ""), src: g.id }, gram: g.t, noSrs: true };
  }
  return { due, fresh, gram };
}
function renderLearnHome() {
  const p = profile(), t = Progress.today();
  const plan = dailyPlan();
  const planned = plan.due.length + plan.fresh.length + (plan.gram ? 1 : 0);
  // hedef halkası dürüst olsun: bugün yapılabilecek kadar (en az 5)
  const goal = Math.max(5, Math.min(Progress.goalCards(), t.cards + planned));
  const days = store.get("days", []); const lastDay = days.length ? days[days.length - 1] : null;
  const missed = lastDay ? Math.round((new Date(todayStr()) - new Date(lastDay)) / 86400000) : 0;
  const rescue = missed >= 2 && t.cards < 5;
  const isShop = /süpermarket|albert|market|kasa|winkel/i.test(p.job || "");
  const levelBlocks = LV_ORDER.filter(l => C.LEVELS.some(x => x.id === l)).map(l => {
    const L = C.LEVELS.find(x => x.id === l); const cats = C.CATS.filter(c => c.lvl === l);
    const pct = learnedPct(cats.flatMap(catItems));
    const cur = l === (p.level || "A1"); const done = pct >= 80;
    const gr = C.GRAMMAR.filter(g => g.lvl === l);
    const cando = (C.CANDO[l] || []).map(x => typeof x === "string" ? { t: x } : x);
    const ticks = store.get("cando", {});
    return `<div class="node ${done ? "done" : cur ? "cur" : ""}"><details class="card" ${cur ? "open" : ""}>
      <summary><span class="tag br">${l}</span> ${esc(L.n)} <span class="small muted">· %${pct}</span></summary>
      <div class="small muted" style="margin:6px 0 10px">${esc(L.d || "")}</div>
      <div class="grid2">${cats.map(tile).join("")}</div>
      ${gr.length ? `<h3 style="margin-top:14px">📐 Dilbilgisi</h3>${gr.map(g => `<div class="phrase" style="align-items:center"><div class="t"><b style="font-size:.98rem">${esc(g.t)}</b></div><button class="btn sm" data-act="openGram" data-id="${esc(g.id)}">Aç</button></div>`).join("")}` : ""}
      ${cando.length ? `<details style="margin-top:10px"><summary class="small">✅ Neler yapabiliyorum? (${cando.filter((x, i) => ticks[l + i]).length}/${cando.length})</summary>
        ${cando.map((x, i) => `<label class="chk"><input type="checkbox" data-cando="${l + i}" ${ticks[l + i] ? "checked" : ""}><span class="small">${esc(x.t)}</span></label>`).join("")}</details>` : ""}
      <button class="btn sm block" style="margin-top:10px" data-act="checkpoint" data-l="${l}">🎯 ${l} pratik kontrolü (10 soru)${store.get("cpBest", {})[l] != null ? ` · en iyi %${store.get("cpBest", {})[l]}` : ""}</button>
      ${l === (p.level || "A1") && cando.length && cando.every((x, i) => ticks[l + i]) && (store.get("cpBest", {})[l] || 0) >= 80 && LV_ORDER[LV_ORDER.indexOf(l) + 1] ? `<button class="btn primary sm block" style="margin-top:8px" data-act="levelUp" data-l="${LV_ORDER[LV_ORDER.indexOf(l) + 1]}">⬆️ ${LV_ORDER[LV_ORDER.indexOf(l) + 1]} seviyesine geç</button>` : ""}
      <div class="small muted" style="margin-top:4px">Resmî seviye belgesi değildir; resmî seviyeni Huis van het Nederlands belirler.</div>
    </details></div>`;
  }).join("");
  const jobCats = C.CATS.filter(c => c.lvl === "AH");
  const mine = aiCats();
  $("#v-ogren").innerHTML = `${installCard()}
    ${rescue ? `<div class="card" style="border-color:var(--brand)"><b>👋 Tekrar hoş geldin!</b><div class="small">${missed} gündür yoktun, sorun değil — yorgun vardiyalar olur. 2 dakikalık dönüş: sadece 5 kart.</div>
      <button class="btn primary sm" style="margin-top:8px" data-act="quick5">▶ 2 dakika, 5 kart</button></div>` : ""}
    <div class="card"><div class="hero">${ring(t.cards, goal)}
      <div class="grow"><h2 style="margin:0">Bugünün dersi</h2>
        <div class="small muted">${planned ? `${plan.due.length} tekrar · ${plan.fresh.length} yeni cümle${plan.gram ? " · 1 dilbilgisi" : ""}` : "Planlanan her şey bitti"}</div>
        <div class="small" style="margin-top:2px">${t.cards >= 5 ? "🔥 Seri bugün korundu" : `Seri için ${5 - t.cards} kart daha`}</div>
        ${planned ? `<button class="btn primary" style="margin-top:8px" data-act="daily">▶ ${t.cards ? "Devam et" : "Başla"}</button>`
          : `<button class="btn" style="margin-top:8px" data-act="extra">➕ Ekstra tur (bildiklerini pekiştir)</button>`}
      </div></div></div>
    ${EXT.learnCards.map(f => { try { return f() || ""; } catch { return ""; } }).join("")}
    ${isShop && jobCats.length ? `<h2>🛒 Önce iş: kasa & reyon</h2><div class="grid2" style="margin-bottom:14px">${jobCats.map(tile).join("")}</div>` : ""}
    <h2>🧭 Seviye yolu</h2>
    <div class="path">${levelBlocks}</div>
    ${!isShop && jobCats.length ? `<details class="card"><summary>🛒 Süpermarket cümleleri</summary><div class="grid2" style="margin-top:10px">${jobCats.map(tile).join("")}</div></details>` : ""}
    <details class="card" ${App.learn.moreOpen ? "open" : ""} id="moreBox"><summary>✨ Öğretmen, istediğin konuda ders, okunuş anahtarı</summary>
    <div style="margin-top:10px">
      <h3 style="margin:0 0 6px">❓ Öğretmene sor</h3>
      <p class="small muted" style="margin:0 0 8px">"de mi het mi?", "bu cümle doğru mu: …", "want ile omdat farkı?"</p>
      <textarea id="askIn" placeholder="Sorunu Türkçe yaz…" style="min-height:56px"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary sm" data-act="ask">Sor</button><button class="btn sm" data-act="askMic">🎤 Söyle</button></div>
      <div id="askOut" aria-live="polite"></div>
    </div>
    <div style="margin-top:16px">
      <h3 style="margin:0 0 6px">✨ İstediğin konuda ders</h3>
      <input type="text" id="genTopic" placeholder="ör. Depo ve forklift kelimeleri">
      <div class="row" style="margin-top:8px">
        <select id="genLevel" style="width:auto;flex:1">${LV_ORDER.map(l => `<option ${l === (p.level || "A2") ? "selected" : ""}>${l}</option>`).join("")}</select>
        <button class="btn primary" data-act="gen">Ders hazırla</button>
      </div>
      <div class="chips" style="margin-top:8px">${shuffle(C.TOPIC_IDEAS).slice(0, 5).map(x => `<button class="chip" data-act="topic" data-t="${esc(x)}">${esc(x)}</button>`).join("")}</div>
      <div id="genOut" aria-live="polite"></div>
      <p class="small muted" style="margin:8px 0 0">Yapay zekâ dersleri ek kaynaktır; ana yol yukarıdaki kontrol edilmiş derslerdir.</p>
    </div>
    ${mine.length ? `<h3 style="margin-top:16px">📒 Hazırlattığım dersler</h3><div class="grid2">${mine.map(tile).join("")}</div>` : ""}
    <details style="margin-top:16px"><summary>🔤 Okunuş anahtarı</summary>
      <table class="key" style="margin-top:8px">${C.OKUNUS_KEY.map(r => `<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}${r[2] ? ` — <i>${esc(r[2])}</i>` : ""}</td></tr>`).join("")}</table>
      <p class="small muted">Okunuşlar yaklaşık yazımdır; asıl doğru ses için 🔊. Bir kartı iyi öğrenince okunuş gizlenir — kendi okumaya alış.</p>
    </details></div></details>`;
  const mb = $("#moreBox"); if (mb) mb.addEventListener("toggle", () => { App.learn.moreOpen = mb.open; });
  $$("[data-cando]").forEach(c => c.onchange = () => { const t2 = store.get("cando", {}); t2[c.dataset.cando] = c.checked; store.set("cando", t2); if (c.checked) haptic(10); });
}
ACT.levelUp = el => { const p = profile(); p.level = el.dataset.l; store.set("profile", p); toast(`⬆️ Seviye: ${el.dataset.l} — tebrikler!`); Progress.addXP(10); renderLearn(); };
ACT.quick5 = () => {
  const { due, fresh } = dailyPlan();
  const tasks = [...due, ...fresh.map(it => ({ type: "flash", item: it, isNew: true }))].slice(0, 5);
  if (!tasks.length) return ACT.extra();
  startStudy(tasks, "2 dakikalık dönüş", () => { App.learn = { mode: "home" }; });
};
ACT.extra = () => {
  const s = SRS.all(); const idx = itemIndex();
  const known = Object.keys(s).filter(k => !k.includes("|") && (s[k].b || 0) >= 1).map(k => idx.get(k)).filter(Boolean);
  if (!known.length) { toast("Önce birkaç yeni kart öğren"); return; }
  const types = ["quiz", "listen", "dict", "order"];
  const tasks = shuffle(known).slice(0, 10).map((it, i) => { let ty = types[i % 4]; if (ty === "order" && it.nl.split(/\s+/).length < 3) ty = "quiz"; return { type: ty, item: it, pool: known }; });
  startStudy(tasks, "Ekstra tur", () => { App.learn = { mode: "home" }; });
};
function tile(c) {
  return `<button class="tile" data-act="openCat" data-id="${esc(c.id)}"><div class="e" aria-hidden="true">${esc(c.e || "📘")}</div><div class="n">${esc(c.n)}</div>
    <div class="small muted">${c.items.length} cümle</div><div class="bar"><i style="width:${learnedPct(catItems(c))}%"></i></div></button>`;
}
ACT.openCat = el => { App.learn = { mode: "cat", id: el.dataset.id }; if (App.view !== "ogren") tab("ogren"); else renderLearn(); window.scrollTo(0, 0); Back.push(() => { App.learn = { mode: "home" }; renderLearn(); }); };
ACT.openGram = el => { App.learn = { mode: "gram", id: el.dataset.id }; renderLearn(); window.scrollTo(0, 0); Back.push(() => { App.learn = { mode: "home" }; renderLearn(); }); };
ACT.learnHome = () => { Back.drop(); App.learn = { mode: "home" }; renderLearn(); window.scrollTo(0, 0); };
ACT.topic = el => { $("#genTopic").value = el.dataset.t; };
ACT.daily = () => {
  const { due, fresh, gram } = dailyPlan();
  const tasks = [...due, ...fresh.map(it => ({ type: "flash", item: it, isNew: true }))];
  if (gram) tasks.splice(Math.min(tasks.length, 4), 0, gram);
  if (!tasks.length) return ACT.extra();
  startStudy(tasks, "Bugünün dersi", () => { App.learn = { mode: "home" }; });
};
ACT.checkpoint = el => {
  const l = el.dataset.l; const items = C.CATS.filter(c => c.lvl === l).flatMap(catItems);
  if (items.length < 4) return;
  const seen = items.filter(i => SRS.get(i.nl)), unseen = items.filter(i => !SRS.get(i.nl));
  const pick = [...shuffle(seen).slice(0, 8), ...shuffle(unseen)].slice(0, 10); // çoğunlukla çalışılmış cümleler
  const types = ["quiz", "listen", "order", "dict"];
  startStudy(pick.map((it, i) => ({ type: types[i % 4] === "order" && it.nl.split(" ").length < 3 ? "quiz" : types[i % 4], item: it, pool: items })), `${l} pratik kontrolü`, () => { App.learn = { mode: "home" }; }, { checkpoint: true, level: l });
};
function renderCat() {
  const c = allCats().find(x => x.id === App.learn.id); if (!c) { App.learn = { mode: "home" }; return renderLearnHome(); }
  $("#v-ogren").innerHTML = `
    <div class="row" style="margin-bottom:10px"><button class="btn sm ghost" data-act="learnHome">← Öğren</button><h2 class="grow" style="margin:0">${esc(c.e || "📘")} ${esc(c.n)}</h2></div>
    <div class="grid2" style="grid-template-columns:1fr 1fr 1fr;margin-bottom:12px">
      <button class="btn primary sm" data-act="mode" data-m="flash">🃏 Kart</button>
      <button class="btn sm" data-act="mode" data-m="quiz">❓ Test</button>
      <button class="btn sm" data-act="mode" data-m="listen">🎧 Dinle</button>
      <button class="btn sm" data-act="mode" data-m="dict">✍️ Dikte</button>
      <button class="btn sm" data-act="mode" data-m="order">🧩 Diziliş</button>
      <button class="btn sm" data-act="mode" data-m="speak">🎤 Söyle</button>
    </div>
    <div class="card">${c.note ? `<div class="note" style="margin:0 0 6px">💡 ${esc(c.note)}</div>` : ""}
      ${catItems(c).map(i => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(i.nl)}" aria-label="Sesli oku">🔊</button>
        <div class="t"><b>${esc(i.nl)}</b><div class="okn small">${esc(i.ok)}</div><div class="small">🇹🇷 ${esc(i.tr)}</div></div></div>`).join("")}
      ${c.ai ? `<button class="btn sm" style="margin-top:10px" data-act="delLesson">🗑 Bu dersi sil</button>` : ""}
    </div>`;
}
ACT.mode = el => {
  const c = allCats().find(x => x.id === App.learn.id); if (!c) return;
  const m = el.dataset.m; let items = catItems(c);
  if (m === "order") items = items.filter(i => i.nl.split(/\s+/).length >= 3 && i.nl.split(/\s+/).length <= 12);
  if (!items.length) { toast("Bu konuda uygun cümle yok"); return; }
  const back = { mode: "cat", id: c.id };
  startStudy(shuffle(items).slice(0, m === "flash" ? 20 : 10).map(it => ({ type: m, item: it, pool: catItems(c) })), c.n, () => { App.learn = back; });
};
ACT.delLesson = () => { if (!confirm("Bu ders silinsin mi?")) return; store.set("lessons", aiCats().filter(c => c.id !== App.learn.id)); App.learn = { mode: "home" }; renderLearn(); };
function renderGram() {
  const g = C.GRAMMAR.find(x => x.id === App.learn.id); if (!g) { App.learn = { mode: "home" }; return renderLearnHome(); }
  const ex = g.ex || [];
  // gövde uygulamanın kendi içerik dosyasından gelir; yine de yalnız <b>, <i>, <br> etiketlerine izin ver
  const safeBody = esc(g.body).replace(/&lt;(\/?)(b|i|br)\s*\/?&gt;/g, "<$1$2>");
  $("#v-ogren").innerHTML = `
    <div class="row" style="margin-bottom:10px"><button class="btn sm ghost" data-act="learnHome">← Öğren</button><span class="tag br">${esc(g.lvl)}</span></div>
    <div class="card"><h2 style="margin-top:0">${esc(g.t)}</h2><div style="line-height:1.6">${safeBody}</div></div>
    <div class="card"><h3>Örnekler</h3>${ex.map(x => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(P(x[0]))}" aria-label="Sesli oku">🔊</button>
      <div class="t"><b>${esc(P(x[0]))}</b><div class="okn small">${esc(P(x[2] || ""))}</div><div class="small">🇹🇷 ${esc(P(x[1]))}</div></div></div>`).join("")}</div>
    <div class="grid2"><button class="btn primary" data-act="gramDrill" data-m="order">🧩 Diziliş alıştırması</button><button class="btn" data-act="gramDrill" data-m="quiz">❓ Test</button></div>`;
}
ACT.gramDrill = el => {
  const g = C.GRAMMAR.find(x => x.id === App.learn.id); if (!g) return;
  let items = (g.ex || []).map(x => ({ nl: P(x[0]), tr: P(x[1]), ok: P(x[2] || ""), src: g.id }));
  if (el.dataset.m === "order") items = items.filter(i => i.nl.split(/\s+/).length >= 3);
  if (!items.length) { toast("Bu derste uygun örnek yok"); return; }
  const back = { mode: "gram", id: g.id };
  startStudy(shuffle(items).map(it => ({ type: el.dataset.m, item: it, pool: items.length >= 4 ? items : [...items, ...shuffle([...itemIndex().values()]).slice(0, 6)] })), g.t, () => { App.learn = back; });
};

/* ---------------- Çalışma motoru ---------------- */
function startStudy(tasks, title, onExit, opts = {}) {
  persistStorage();
  const wasStudy = App.learn.mode === "study";
  App.learn = { mode: "study", s: { tasks, i: 0, right: 0, total: tasks.length, title, onExit, retried: new Set(), newCount: tasks.filter(t => t.isNew).length, checkpoint: !!opts.checkpoint, level: opts.level } };
  if (App.view !== "ogren") tab("ogren"); else renderLearn();
  document.body.classList.add("study"); window.scrollTo(0, 0);
  if (!wasStudy) Back.push(() => exitStudy(true));
}
function studyShell(inner) {
  const s = App.learn.s;
  return `<div class="row" style="margin-bottom:12px"><button class="btn sm ghost" data-act="studyExit" aria-label="Çık">✕</button>
      <div class="studybar" role="progressbar" aria-valuemin="0" aria-valuemax="${s.tasks.length}" aria-valuenow="${s.i}"><i style="width:${Math.round(100 * s.i / s.tasks.length)}%"></i></div>
      <span class="small muted">${Math.min(s.i + 1, s.tasks.length)}/${s.tasks.length}</span></div>
    <div id="studyBox">${inner}</div>`;
}
function exitStudy(fromBack) {
  if (App.learn.mode !== "study") return;
  Speech.stopAll(); TTS.stop(); document.body.classList.remove("study");
  const s = App.learn.s; s.onExit(); App.renderStats(); renderLearn();
  if (!fromBack) Back.drop();
}
ACT.studyExit = () => exitStudy(false);
function nextTask(grade, opts) {
  const s = App.learn.s; const t = s.tasks[s.i];
  if (grade != null && (s.checkpoint || t.noSrs || t.type === "speak")) {
    // ölçme (pratik kontrolü), dilbilgisi mini alıştırması ve telaffuz takvimi değiştirmez
    if (grade === 2) s.right++;
    if (t.noSrs && t.type === "order") store.set("gramDay", todayStr());
    Progress.addXP(grade === 2 ? 2 : grade === 1 ? 1 : 0);
    if (!s.checkpoint) Progress.didCard();
  } else if (grade != null) {
    const key = t.type === "prod" ? t.item.nl + "|p" : t.item.nl;
    const r = SRS.mark(key, grade, opts);
    // tanıma kartı iyi öğrenildiyse üretme kartını (TR→NL) başlat
    if (t.type !== "prod" && r.b >= 2 && !SRS.get(t.item.nl + "|p")) { const all = SRS.all(); all[t.item.nl + "|p"] = { b: 0, lapses: 0, due: addDays(1) }; store.set("srs", all); }
    if (grade === 0 && !s.retried.has(key) && !s.checkpoint) { s.retried.add(key); s.tasks.splice(Math.min(s.i + 4, s.tasks.length), 0, { ...t, isNew: false }); }
    if (grade === 2) s.right++;
    if (t.isNew) { const nt = store.get("newToday", {}); store.set("newToday", { d: todayStr(), n: (nt.d === todayStr() ? nt.n : 0) + 1 }); }
    Progress.addXP(grade === 2 ? 2 : grade === 1 ? 1 : 0);
  }
  s.i++; renderStudy();
}
function renderStudy() {
  const s = App.learn.s;
  if (s.i >= s.tasks.length) return finishStudy();
  const t = s.tasks[s.i];
  const R = { flash: stFlash, prod: stProd, quiz: stQuiz, listen: stQuiz, dict: stDict, order: stOrder, speak: stSpeak }[t.type] || EXT.studyTypes[t.type] || stFlash;
  R(t);
}
function finishStudy() {
  const s = App.learn.s; const acc = s.total ? Math.round(100 * s.right / s.tasks.length) : 0;
  if (s.checkpoint && s.level) { // şansa bağlı tek iyi deneme değil: son iki denemenin ortalaması
    const h = store.get("cpHist", {}); const arr = [...(h[s.level] || []), acc].slice(-2); h[s.level] = arr; store.set("cpHist", h);
    const b = store.get("cpBest", {}); b[s.level] = Math.round(arr.reduce((x, y) => x + y, 0) / arr.length); store.set("cpBest", b);
  }
  App.renderStats(); haptic([20, 40, 20]); // seri günü yalnız 5+ kartta (Progress.didCard) sayılır
  $("#v-ogren").innerHTML = `<div class="card" style="text-align:center;padding:24px">
    <div style="font-size:2.6rem" aria-hidden="true">${acc >= 80 ? "🏆" : "💪"}</div>
    <h2>${esc(s.title)} bitti!</h2>
    <div class="score">${acc}%</div><div class="muted">doğru · ${s.tasks.length} alıştırma${s.newCount ? ` · ${s.newCount} yeni cümle` : ""}</div>
    <div class="muted" style="margin-top:6px">🔥 Seri: ${Progress.streak()} gün · bugün ${Progress.today().cards} kart</div>
    ${s.checkpoint ? `<p class="small muted">Pratik kontrolüdür, resmî seviye değildir.</p>` : ""}
    <div class="grid2" style="margin-top:14px"><button class="btn" data-act="studyAgain">Bir tur daha</button><button class="btn primary" data-act="studyExit">Bitir</button></div></div>`;
}
ACT.studyAgain = () => { const s = App.learn.s; startStudy(shuffle(s.tasks.filter((t, i, a) => a.findIndex(x => x.item.nl === t.item.nl && x.type === t.type) === i)).map(t => ({ ...t, isNew: false })), s.title, s.onExit, { checkpoint: s.checkpoint }); };
const okLine = (it, force) => {
  if (!it.ok) return "";
  if (force || SRS.box(it.nl) < 2) return `<div class="okn">${esc(it.ok)}</div>`;
  return `<button class="btn sm ghost" data-act="revealOk" data-ok="${esc(it.ok)}">🗣 okunuşu göster</button>`;
};
ACT.revealOk = el => { const d = document.createElement("div"); d.className = "okn"; d.textContent = el.dataset.ok; el.replaceWith(d); };
function stFlash(t) {
  const it = t.item;
  $("#v-ogren").innerHTML = studyShell(`
    <div class="flash" id="fc"><div class="inner">
      <div class="face"><span class="tag nl">🇧🇪 ${t.isNew ? "YENİ" : "HATIRLA"}</span><div class="big-nl">${esc(it.nl)}</div>${okLine(it)}<button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button></div>
      <div class="face back"><span class="tag tr">🇹🇷 ANLAMI</span><div class="big-tr">${esc(it.tr)}</div><div class="mid-nl">${esc(it.nl)}</div>${okLine(it, true)}<button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button></div>
    </div></div>
    <div id="fcBtns"><button class="btn primary block" data-act="flip">Anlamını göster</button></div>`);
  TTS.speak(it.nl);
}
ACT.flip = () => {
  $("#fc").classList.add("flipped");
  $("#fcBtns").innerHTML = `<div class="grid2" style="grid-template-columns:1fr 1fr 1fr">
    <button class="btn" data-act="grade" data-g="0"><span aria-hidden="true">😕</span>Bilemedim</button><button class="btn" data-act="grade" data-g="1"><span aria-hidden="true">🤔</span>Zor</button><button class="btn primary" data-act="grade" data-g="2"><span aria-hidden="true">😊</span>Bildim</button></div>`;
};
ACT.grade = el => { haptic(10); nextTask(+el.dataset.g); };
function stProd(t) {
  const it = t.item;
  $("#v-ogren").innerHTML = studyShell(`
    <div class="flash" id="fc"><div class="inner">
      <div class="face"><span class="tag tr">🇹🇷 → 🇧🇪 FELEMENKÇESİ?</span><div class="big-tr">${esc(it.tr)}</div>
        <div class="small muted">Önce kendin söyle, sonra çevir.</div><button class="btn sm" data-act="prodMic">🎤 Söyle</button><div id="prodRes" class="small" aria-live="polite"></div></div>
      <div class="face back"><span class="tag nl">🇧🇪 DOĞRUSU</span><div class="big-nl">${esc(it.nl)}</div>${okLine(it, true)}<button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button></div>
    </div></div>
    <div id="fcBtns"><button class="btn primary block" data-act="flip">Doğrusunu göster</button></div>`);
}
ACT.prodMic = el => {
  const it = App.learn.s.tasks[App.learn.s.i].item;
  if (Speech.cur && Speech.cur.owner === "prod") { Speech.cur.stop(); return; }
  el.textContent = "⏹ Bitti";
  Speech.listen({ lang: store.get("srLang", "nl-BE"), owner: "prod",
    onText: x => { $("#prodRes").textContent = x; },
    onDone: x => { el.textContent = "🎤 Tekrar"; if (!x) return; const { pct, orderOk } = wordMatch(it.nl, x); $("#prodRes").innerHTML = `Telefon anladı: “${esc(x)}” — <b>${pct}%</b> eşleşti${orderOk === false ? " · 🧩 sıra farklı" : ""}`; },
    onError: c => { el.textContent = "🎤 Söyle"; if (c !== "cancelled") $("#prodRes").textContent = Speech.errorText(c); } });
};
function stQuiz(t) {
  const it = t.item; const nw = s => String(s).split(/\s+/).length;
  let pool = (t.pool && t.pool.length >= 4 ? t.pool : [...itemIndex().values()]).filter(x => x.nl !== it.nl && x.tr !== it.tr);
  if (!(t.pool && t.pool.length >= 4)) { // şıklar uzunluktan tahmin edilemesin: aynı kaynaktan ya da benzer uzunlukta seç
    const same = pool.filter(x => x.src && x.src === it.src); const near = pool.filter(x => Math.abs(nw(x.nl) - nw(it.nl)) <= 2);
    pool = same.length >= 3 ? same : near.length >= 3 ? near : pool;
  }
  const opts = shuffle([it, ...shuffle(pool).slice(0, 3)]);
  const dir = t.type === "listen" ? "listen" : (Math.random() < 0.5 ? "nl2tr" : "tr2nl");
  App.learn.s.q = { opts, dir, done: false };
  const q = dir === "tr2nl" ? `<span class="tag tr">🇹🇷</span><div class="big-tr">${esc(it.tr)}</div><div class="muted small">Felemenkçesi hangisi?</div>`
    : dir === "listen" ? `<div class="muted">Dinle ve anlamını seç</div><div class="row" style="justify-content:center"><button class="btn primary" data-act="say" data-say="${esc(it.nl)}">🔊 Dinle</button><button class="btn" data-act="slow" data-say="${esc(it.nl)}">🐢 Yavaş</button></div>`
    : `<span class="tag nl">🇧🇪</span><div class="big-nl">${esc(it.nl)}</div><button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button><div class="muted small">Türkçesi hangisi?</div>`;
  $("#v-ogren").innerHTML = studyShell(`<div class="card" style="text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center">${q}</div>
    <div class="opts">${opts.map((o, k) => `<button class="opt" data-act="pick" data-k="${k}">${esc(dir === "tr2nl" ? o.nl : o.tr)}</button>`).join("")}</div><div id="qNext" style="margin-top:10px"></div>`);
  if (dir !== "tr2nl") TTS.speak(it.nl);
}
ACT.pick = el => {
  const s = App.learn.s, q = s.q; if (!q || q.done) return; q.done = true;
  const it = s.tasks[s.i].item; const pick = q.opts[+el.dataset.k]; const ok = pick.nl === it.nl;
  $$("#studyBox .opt").forEach((b, k) => { if (q.opts[k].nl === it.nl) b.classList.add("right"); });
  if (!ok) { el.classList.add("wrong", "shake"); haptic([20, 40, 20]); } else { el.classList.add("pop"); haptic(15); }
  if (q.dir === "tr2nl") TTS.speak(it.nl);
  $("#qNext").innerHTML = `<div class="small muted" style="margin-bottom:8px">${esc(it.nl)} — ${esc(it.tr)}</div><button class="btn primary block" data-act="next" data-mc="${q.dir === "listen" ? "0" : "1"}" data-g="${ok ? 2 : 0}">Devam →</button>`;
  $("#qNext button").focus();
};
ACT.next = el => nextTask(+el.dataset.g, { mc: el.dataset.mc === "1" });
function stDict(t) {
  const it = t.item;
  $("#v-ogren").innerHTML = studyShell(`<div class="card" style="text-align:center">
      <div class="muted">Dinle ve Felemenkçe yaz</div>
      <div class="row" style="justify-content:center;margin:10px 0"><button class="btn primary" data-act="say" data-say="${esc(it.nl)}">🔊 Dinle</button><button class="btn" data-act="slow" data-say="${esc(it.nl)}">🐢 Yavaş</button></div>
      <input type="text" id="dictIn" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Duyduğunu yaz…">
      <button class="btn primary block" style="margin-top:10px" data-act="dictCheck">Kontrol et</button>
      <div id="dictRes" aria-live="polite" style="margin-top:10px"></div></div>`);
  TTS.speak(it.nl);
}
ACT.dictCheck = () => {
  const s = App.learn.s; if (s.dictDone === s.i) return; // ilk kontrolden sonra kilitli
  const it = s.tasks[s.i].item; const v = $("#dictIn").value;
  if (!v.trim()) { toast("Önce duyduğunu yaz"); return; }
  s.dictDone = s.i; $("#dictIn").readOnly = true;
  const { pct, marks, orderOk } = wordMatch(it.nl, v);
  const g = pct >= 90 ? 2 : pct >= 60 ? 1 : 0;
  haptic(g === 2 ? 15 : [20, 40, 20]);
  $("#dictRes").innerHTML = `<div class="score" style="font-size:1.8rem">${pct}%</div>
    <div>${marks.map(m => `<span class="${m.ok ? "w-ok" : "w-bad"}">${esc(m.w)}</span>`).join(" ")}</div>
    <div class="mid-nl" style="margin-top:6px">${esc(it.nl)}</div><div class="small">🇹🇷 ${esc(it.tr)}</div>
    ${orderOk === false ? `<div class="note">🧩 Kelimeler doğru ama sırası farklı. Hatırla: Felemenkçede çekimli fiil (çoğunlukla) 2. sırada: <b>${esc(it.nl)}</b></div>` : ""}
    <button class="btn primary block" style="margin-top:10px" data-act="next" data-g="${g}">Devam →</button>`;
};
function stOrder(t) {
  // büyük harf ve noktalama ipucu vermesin diye taşlar küçük harf, noktalamasız
  const it = t.item; const words = it.nl.split(/\s+/).map(w => w.replace(/^[¿¡"“'(]+|[.,!?;:"”)]+$/g, "").toLowerCase()).filter(Boolean);
  let sh = shuffle(words.map((w, i) => ({ w, i }))); if (sh.every((x, k) => x.i === k) && words.length > 1) sh = sh.reverse();
  App.learn.s.o = { words, sh, picked: [] };
  $("#v-ogren").innerHTML = studyShell(`<div class="card">
      <div class="muted small">🧩 Kelimeleri doğru sıraya diz</div>
      <div class="big-tr" style="font-size:1.25rem;margin:6px 0">🇹🇷 ${esc(it.tr)}</div>
      <div class="tiles" id="ans" aria-label="Senin cümlen"></div>
      <div class="tiles" style="border-style:solid" id="pool">${sh.map((x, k) => `<button class="wtile" data-act="otile" data-k="${k}">${esc(x.w)}</button>`).join("")}</div>
      <div class="row"><button class="btn" data-act="oreset">↺ Sıfırla</button><button class="btn primary grow" data-act="ocheck">Kontrol et</button></div>
      <div id="oRes" aria-live="polite" style="margin-top:10px"></div></div>`);
}
ACT.otile = el => {
  const o = App.learn.s.o; const k = +el.dataset.k; if (o.done || o.picked.includes(k)) return;
  o.picked.push(k); el.classList.add("used");
  $("#ans").insertAdjacentHTML("beforeend", `<button class="wtile" data-act="ountile" data-k="${k}">${esc(o.sh[k].w)}</button>`);
};
ACT.ountile = el => {
  const o = App.learn.s.o; if (o.done) return; const k = +el.dataset.k; o.picked = o.picked.filter(x => x !== k); el.remove();
  const p = $(`#pool [data-k="${k}"]`); if (p) p.classList.remove("used");
};
ACT.oreset = () => { const o = App.learn.s.o; if (o.done) return; o.picked = []; $("#ans").innerHTML = ""; $$("#pool .wtile").forEach(b => b.classList.remove("used")); };
ACT.ocheck = () => {
  const s = App.learn.s, o = s.o; const it = s.tasks[s.i].item;
  if (o.done) return;
  const got = o.picked.map(k => o.sh[k].w).join(" ");
  const ok = normWords(got).join(" ") === normWords(it.nl).join(" ");
  haptic(ok ? 15 : [20, 40, 20]);
  if (!ok && o.picked.length < o.words.length) { $("#oRes").innerHTML = `<div class="small muted">Tüm kelimeleri yerleştir.</div>`; return; }
  o.done = true; $$("#studyBox .wtile").forEach(b => b.disabled = true);
  $("#oRes").innerHTML = `${ok ? `<div class="tag ok">✓ Doğru!</div>` : `<div class="tag bad">✗ Doğrusu:</div>`}
    <div class="mid-nl" style="margin-top:6px">${esc(it.nl)}</div>${it.ok ? `<div class="okn small">${esc(it.ok)}</div>` : ""}
    <button class="btn primary block" style="margin-top:10px" data-act="next" data-g="${ok ? 2 : 0}">Devam →</button>`;
  TTS.speak(it.nl);
};
function stSpeak(t) {
  const it = t.item;
  $("#v-ogren").innerHTML = studyShell(`<div class="card" style="text-align:center;display:flex;flex-direction:column;gap:10px;align-items:center">
      <div class="big-nl">${esc(it.nl)}</div>${okLine(it, true)}<div class="small">🇹🇷 ${esc(it.tr)}</div>
      <div class="row" style="justify-content:center"><button class="btn" data-act="say" data-say="${esc(it.nl)}">🔊 Dinle</button><button class="btn" data-act="slow" data-say="${esc(it.nl)}">🐢 Yavaş</button></div>
      <button class="btn primary" style="min-width:220px" data-act="spMic">🎤 Şimdi sen söyle</button>
      <div id="spRes" aria-live="polite"></div>
      ${window.MediaRecorder && navigator.mediaDevices ? `<button class="btn sm ghost" data-act="shadow">🎙 Kendini kaydet ve dinle</button><div id="shRes"></div>` : ""}
    </div><button class="btn block" data-act="spNext">Sonraki →</button>`);
  App.learn.s.spGrade = null;
}
ACT.spMic = el => {
  const it = App.learn.s.tasks[App.learn.s.i].item;
  if (Speech.cur && Speech.cur.owner === "speak") { Speech.cur.stop(); return; }
  el.textContent = "⏹ Bitti";
  $("#spRes").innerHTML = `<span class="waves" aria-hidden="true"><i></i><i></i><i></i><i></i></span> <span class="muted">Dinliyorum…</span>`;
  Speech.listen({ lang: store.get("srLang", "nl-BE"), owner: "speak",
    onText: x => { $("#spRes").innerHTML = `<span class="muted">${esc(x)}</span>`; },
    onDone: x => {
      el.textContent = "🎤 Tekrar dene";
      if (!x) { $("#spRes").innerHTML = `<span class="muted">Ses duyulmadı.</span>`; return; }
      const { pct, marks, orderOk } = wordMatch(it.nl, x);
      App.learn.s.spGrade = pct >= 85 && orderOk !== false ? 2 : pct >= 50 ? 1 : 0;
      $("#spRes").innerHTML = `<div class="small muted">Telefon seni anladı mı?</div><div class="score" style="font-size:1.8rem">${pct}%</div>
        <div>${marks.map(m => `<span class="${m.ok ? "w-ok" : "w-bad"}">${esc(m.w)}</span>`).join(" ")}</div>
        ${orderOk === false ? `<div class="note">🧩 Kelimeler doğru ama sırası farklı. Hatırla: Felemenkçede çekimli fiil (çoğunlukla) 2. sırada: <b>${esc(it.nl)}</b></div>` : ""}
        <div class="small muted" style="margin-top:4px">Duyulan: “${esc(x)}”. Bu bir telaffuz notu değil; telefonun seni anlayıp anlamadığını gösterir.</div>`;
      haptic(pct >= 85 ? 15 : 30);
    },
    onError: c => { el.textContent = "🎤 Şimdi sen söyle"; if (c !== "cancelled") $("#spRes").innerHTML = errBox(Speech.errorText(c)); } });
};
ACT.spNext = () => { Speech.stopAll(); const g = App.learn.s.spGrade; nextTask(g == null ? null : g); };
ACT.shadow = async el => {
  Speech.stopAll(); TTS.stop();
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const rec = new MediaRecorder(stream); const chunks = [];
    rec.ondataavailable = e => chunks.push(e.data);
    rec.onstop = () => {
      stream.getTracks().forEach(t => t.stop());
      const box = $("#shRes"); const st = App.learn.s;
      if (!box || App.learn.mode !== "study" || !st || !st.tasks[st.i]) return; // kullanıcı başka yere geçti
      if (App.shadowUrl) URL.revokeObjectURL(App.shadowUrl);
      const url = App.shadowUrl = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/mp4" }));
      const it = st.tasks[st.i].item;
      box.innerHTML = `<audio controls src="${url}" style="width:100%;margin-top:6px"></audio><button class="btn sm" data-act="say" data-say="${esc(it.nl)}">🔊 Doğrusu</button><div class="small muted">Kendi sesini doğrusuyla karşılaştır. Kayıt telefonda bile saklanmaz.</div>`;
      if (el.isConnected) { el.textContent = "🎙 Tekrar kaydet"; el.disabled = false; }
    };
    rec.start(); el.textContent = "⏺ Kaydediliyor (5 sn)…"; el.disabled = true; haptic(15);
    setTimeout(() => { try { rec.stop(); } catch { } }, 5000);
  } catch { const b = $("#shRes"); if (b) b.innerHTML = errBox("Mikrofona erişilemedi."); }
};

/* Öğretmene sor ve ders üret */
let askTok = 0;
ACT.ask = async () => {
  const q = ($("#askIn").value || "").trim(); if (!q) return;
  const my = ++askTok;
  $("#askOut").innerHTML = spinner("Düşünüyor…");
  try {
    const r = await callClaude({ feature: "ask", kind: "ask", system: sysAsk(), schema: SCHEMA.ask, content: `Student's question (Turkish): "${q}"` });
    if (my !== askTok || !$("#askOut")) return;
    $("#askOut").innerHTML = `<div class="note" style="white-space:pre-wrap">${esc(r.cevap_tr)}</div>` +
      r.ornekler.map(o => `<div class="reply"><div class="mid-nl">${esc(o.nl)}</div><div class="okn small">${esc(o.okunus)}</div><div class="small">🇹🇷 ${esc(o.tr)}</div>${acts(o.nl, o.tr, o.okunus, "Öğretmen", { show: false })}</div>`).join("");
    Progress.addXP(1);
  } catch (e) { if (my === askTok && $("#askOut")) $("#askOut").innerHTML = e.code === "abort" ? "" : errBox(e); }
};
ACT.askMic = el => {
  if (Speech.cur && Speech.cur.owner === "ask") { Speech.cur.stop(); return; }
  el.textContent = "⏹ Bitti";
  Speech.listen({ lang: "tr-TR", owner: "ask", onText: t => { $("#askIn").value = t; },
    onDone: t => { el.textContent = "🎤 Söyle"; if (t) { $("#askIn").value = t; ACT.ask(); } },
    onError: c => { el.textContent = "🎤 Söyle"; if (c !== "cancelled") $("#askOut").innerHTML = errBox(Speech.errorText(c)); } });
};
ACT.gen = async el => {
  const topic = ($("#genTopic").value || "").trim(); if (!topic) { toast("Önce bir konu yaz"); return; }
  const lvl = $("#genLevel").value; el.disabled = true;
  $("#genOut").innerHTML = spinner("Ders hazırlanıyor (10–30 sn)…");
  try {
    const known = allCats().map(c => c.n).join(", ");
    const r = await callClaude({ feature: "lesson", kind: "lesson", system: sysLesson(), schema: SCHEMA.lesson, timeout: 120000,
      content: `Topic (Turkish): "${topic}"\nCEFR level: ${lvl}\nLessons the student already has (avoid repeating): ${known}` });
    const emoji = Array.from(String(r.emoji || "📘")).slice(0, 2).join("");
    const cat = { id: "ai_" + Date.now(), ai: true, lvl, e: emoji, n: String(r.baslik_tr || topic).slice(0, 60), note: r.aciklama_tr || "",
      items: r.ifadeler.filter(x => x.nl).map(x => [x.nl, x.tr, x.okunus]) };
    if (!cat.items.length) throw new UserError("Ders boş geldi, tekrar dene.");
    store.set("lessons", [cat, ...aiCats()].slice(0, 60));
    Progress.addXP(2); App.learn = { mode: "cat", id: cat.id }; renderLearn(); window.scrollTo(0, 0);
  } catch (e) { $("#genOut").innerHTML = e.code === "abort" ? "" : errBox(e); el.disabled = false; }
};

/* =================================================================
   TERCÜMAN
   ================================================================= */
const CTXS = [["is", "🛒 İş"], ["genel", "💬 Günlük"], ["doktor", "🩺 Doktor"], ["resmi", "🏛️ Resmî"], ["okul", "🏫 Okul"], ["polis", "👮 Polis/acil"]];
// konuşma bağlamı: yalnız aynı durumda ve son 20 dakikadaki cümleler
let conv = store.get("conv", []).filter(c => c && c.at && Date.now() - c.at < 20 * 60000);
App.interp.live = store.get("interpLive", false);
const thread = []; // bu oturumdaki baloncuklar (html) — sekme değişince kaybolmasın
const redoMap = new Map();
let bubSeq = 0;
const modeChips = () => `<button class="chip" data-act="interpMode" data-m="talk" aria-pressed="${!App.interp.live}">💬 Konuşma</button><button class="chip" data-act="interpMode" data-m="live" aria-pressed="${!!App.interp.live}">🎧 Canlı altyazı</button>`;
const ctxSelect = (ctx) => `<label class="ctxsel"><span class="sr-only">Durum</span><select id="ctxSel" aria-label="Durum">${CTXS.map(([k, l]) => `<option value="${k}" ${k === ctx ? "selected" : ""}>📍 ${l}</option>`).join("")}</select></label>`;
function renderInterp() {
  const live = !!App.interp.live;
  $("#micsRow").classList.toggle("hidden", live); $("#liveBtn").classList.toggle("hidden", !live);
  $("#lifelines").classList.toggle("hidden", live); // canlı altyazıda telefonun kendi sesi mikrofona girmesin
  $("#lifelines").innerHTML = C.LIFELINES.map(l => `<button class="chip" data-act="show" data-nl="${esc(P(l[0]))}" data-tr="${esc(P(l[1]))}" data-ok="${esc(P(l[2] || ""))}" data-src="Hazır">${esc(P(l[0]))}</button>`).join("");
  if (live) return renderLive();
  const ctx = App.interp.ctx, serious = SERIOUS.has(ctx);
  const fast = store.get("fastInterp", false);
  $("#v-ceviri").innerHTML = `
    <div class="ctxbar flat"><div class="seg" role="group" aria-label="Mod">${modeChips()}</div>
      <div class="row" style="margin-top:6px;gap:6px;flex-wrap:nowrap">${ctxSelect(ctx)}
      ${serious ? `<span class="chip" style="color:var(--danger)" title="Ciddi durumda en iyi model kullanılır">🛡️ En iyi</span>` : `<button class="chip" data-act="fastToggle" aria-pressed="${fast}">⚡ ${fast ? "Hızlı: açık" : "Hızlı: kapalı"}</button>`}
      <button class="chip" data-act="newConv" aria-label="Yeni konuşma">🧹</button></div></div>
    ${serious ? `<div class="dangerbox" style="margin-bottom:10px">Önemli konularda (sağlık, hukuk, polis, para) profesyonel tercüman iste — polis ve mahkemede hakkındır; hastane ve kurumlarda genelde sosyal tercüman ayarlanabilir, sor: <b>“Ik wil graag een tolk.”</b> <button class="btn sm" data-act="say" data-say="Ik wil graag een tolk, alstublieft.">🔊</button><br><span class="small">Sayı, tarih, doz ve tutarları mutlaka yazılı iste: “Kunt u dat opschrijven?”</span></div>` : ""}
    ${!store.get("apiKey", "") && !DEMO ? `<div class="warnbox" style="margin-bottom:10px">Çeviri için bir kez API anahtarı gir. <button class="btn sm" data-act="goKey">Anahtarı gir</button><br><span class="small">Aşağıdaki hazır cümleler internetsiz de çalışır.</span></div>` : ""}
    <div class="thread" id="thread" aria-live="polite">${thread.length ? thread.map(b => b.html).join("") : `<div class="card flat small muted" style="text-align:center">👇 Biri konuşunca <b>O konuşuyor</b>'a, sen bir şey söyleyeceksen <b>Ben söyleyeceğim</b>'e bas. Bitince aynı düğmeye tekrar bas.</div>`}</div>
    <details class="card" style="margin-top:12px" id="typeBox"><summary>⌨️ Yazarak çevir</summary>
      <textarea id="typeIn" placeholder="Felemenkçe ya da Türkçe yaz… (klavyedeki 🎤 ile de söyleyebilirsin)" style="margin-top:8px"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="typeIn" data-dir="in">🇧🇪 → 🇹🇷 Anlamı</button><button class="btn sm" data-act="typeIn" data-dir="out">🇹🇷 → 🇧🇪 Nasıl derim</button></div>
    </details>`;
  const sel = $("#ctxSel"); if (sel) sel.onchange = () => setCtx(sel.value);
  const last = thread[thread.length - 1]; if (last) scrollToBubble(last.id); else window.scrollTo(0, 0);
}
function setCtx(k) {
  if (k !== App.interp.ctx) { conv = []; store.set("conv", conv); } // başka duruma geçince önceki konuşma bağlam olmasın
  App.interp.ctx = k; store.set("ctx", k); renderInterp();
}
/** Yeni çevirinin BAŞINI ekranın üstüne getir (Türkçe anlam görünsün) */
function scrollToBubble(id) {
  requestAnimationFrame(() => { const el = document.getElementById(id); if (el && App.view === "ceviri") el.scrollIntoView({ block: "start", behavior: "smooth" }); });
}

function scrollThread() { const v = App.view; requestAnimationFrame(() => { if (App.view === v && (v === "ceviri" || v === "pratik")) window.scrollTo(0, document.body.scrollHeight); }); }
ACT.ctx = el => setCtx(el.dataset.k);
ACT.fastToggle = () => { store.set("fastInterp", !store.get("fastInterp", false)); renderInterp(); };
ACT.typeOpen = () => { const d = $("#typeBox"); if (d) { d.open = true; d.scrollIntoView({ block: "center" }); setTimeout(() => $("#typeIn").focus(), 50); } };
ACT.newConv = () => { conv = []; store.set("conv", conv); thread.length = 0; renderInterp(); toast("Yeni konuşma başladı"); };
ACT.typeIn = el => { const v = ($("#typeIn").value || "").trim(); if (!v) return; $("#typeIn").value = ""; interpProcess(el.dataset.dir, v); };
function setMicUI(dir, live) {
  const b = dir === "in" ? $("#micNL") : $("#micTR");
  b.classList.toggle("live", live); b.setAttribute("aria-pressed", String(live));
  b.querySelector(".sub").innerHTML = live ? `<span class="waves" aria-hidden="true"><i></i><i></i><i></i><i></i></span> ⏹ Bitir` : (dir === "in" ? "Felemenkçe → Türkçe" : "Türkçe → Felemenkçe");
}
ACT.mic = el => {
  const dir = el.dataset.dir; const cur = Speech.cur;
  if (cur && cur.owner === "interp-" + dir) { cur.stop(); return; } // aynı düğme: bitir ve çevir
  if (cur) cur.cancel(); // diğer yöndeki dinlemeyi bırak, bu yöne geç
  setMicUI("in", false); setMicUI("out", false); setMicUI(dir, true); haptic(20);
  const live = $("#liveText"); live.classList.remove("hidden"); live.textContent = dir === "in" ? "Dinliyorum…" : "Türkçe söyle…";
  Speech.listen({ lang: dir === "in" ? store.get("srLang", "nl-BE") : "tr-TR", owner: "interp-" + dir,
    onText: t => { live.textContent = t; },
    onDone: t => { setMicUI(dir, false); live.classList.add("hidden"); haptic(10); if (!t) { toast("Ses duyulmadı, tekrar dene"); return; } interpProcess(dir, t); },
    onError: c => { setMicUI(dir, false); live.classList.add("hidden"); if (c !== "cancelled") { pushBubble(`<div class="bub">${errBox(Speech.errorText(c))}</div>`); } } });
};
function pushBubble(html) { const id = "b" + (++bubSeq); thread.push({ id, html: `<div id="${id}">${html}</div>` }); if (App.view === "ceviri" && !App.interp.live) { const th = $("#thread"); if (th) { if (thread.length === 1) th.innerHTML = ""; th.insertAdjacentHTML("beforeend", thread[thread.length - 1].html); } scrollToBubble(id); } if (thread.length > 30) thread.shift(); return id; }
function setBubble(id, html) { const b = thread.find(x => x.id === id); if (b) b.html = `<div id="${id}">${html}</div>`; const el = document.getElementById(id); if (el) el.innerHTML = html; }
function ctxText() {
  const ctx = App.interp.ctx, now = Date.now();
  const rel = conv.filter(c => c.at && now - c.at < 20 * 60000 && (!c.ctx || c.ctx === ctx));
  return rel.length ? rel.map(c => (c.d === "in" ? "Other person said: " : "Suggested reply for the user (may not have been said): ") + c.nl).join("\n") : "(no earlier context)";
}
/** Akan (yarım) JSON metninden bir alanı çek: Türkçe anlam yazılırken görünsün */
function partialField(txt, field) {
  const m = String(txt).match(new RegExp('"' + field + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)'));
  if (!m) return "";
  try { return JSON.parse('"' + m[1].replace(/\\$/, "") + '"'); } catch { return m[1]; }
}
async function interpProcess(dir, raw, { forceBest = false, bubbleId } = {}) {
  const ctx = App.interp.ctx; const serious = SERIOUS.has(ctx);
  const head = dir === "in" ? `<span class="tag nl">🇧🇪 DUYULAN</span> <span class="mid-nl">${esc(raw)}</span>` : `<span class="tag tr">🇹🇷 SEN</span> <span>${esc(raw)}</span>`;
  const id = bubbleId || pushBubble("");
  setBubble(id, `<div class="bub ${dir} prov">${head}<div class="big-tr partial" id="pt_${id}"></div><div class="skel" style="width:85%"></div><div class="skel" style="width:60%"></div>
    <button class="btn sm" data-act="cancelReq" data-f="interp:${id}">Vazgeç</button></div>`);
  scrollToBubble(id);
  const model = forceBest ? MODEL_BEST : modelFor("interp", ctx);
  const partialKey = dir === "in" ? "ceviri_tr" : "nl";
  try {
    // her balonun kendi isteği var: yeni cümle, bekleyen önceki çeviriyi iptal etmez
    const r = await callClaude({ feature: "interp:" + id, kind: dir, ctx, model, timeout: model === MODEL_FAST ? 20000 : 45000,
      onPartial: txt => { const el = document.getElementById("pt_" + id); const v = partialField(txt, partialKey); if (el && v) el.textContent = v; },
      system: dir === "in" ? sysInterpIn(ctx) : sysInterpOut(ctx), schema: SCHEMA[dir],
      content: `Recent conversation:\n${ctxText()}\n\n${dir === "in" ? `ASR transcript (${store.get("srLang", "nl-BE")})` : "What the user wants to say (Turkish)"}: "${raw}"` });
    redoMap.set(id, { dir, raw });
    const redo = model === MODEL_FAST ? `<button class="btn sm ghost" data-act="redo" data-id="${id}">🔁 Emin değilim — daha iyi çeviri</button>` : "";
    const addOk = !serious;
    if (dir === "in") {
      conv.push({ d: "in", nl: r.duzeltilmis_nl, ctx, at: Date.now() }); hist({ d: "in", nl: r.duzeltilmis_nl, tr: r.ceviri_tr });
      const g = { yuksek: ["ok", "emin"], orta: ["warn", "kısmen emin"], dusuk: ["bad", "emin değil"] }[r.guven] || ["warn", "?"];
      const replyCard = c => `<div class="reply"><div class="tapzone" data-act="show" data-nl="${esc(c.nl)}" data-tr="${esc(c.tr)}" data-ok="${esc(c.okunus)}">
            <div class="row between"><span class="tag br">${esc(c.ton)}</span><span class="small muted">📢 dokun → büyük göster</span></div>
            <div class="big-nl" style="font-size:1.3rem;margin-top:4px">${esc(c.nl)}</div>
            <div class="okn">${esc(c.okunus)}</div><div class="small">🇹🇷 ${esc(c.tr)}</div></div>
          ${acts(c.nl, c.tr, c.okunus, "Hayattan", { add: addOk, show: false })}</div>`;
      const top = r.cevaplar.slice(0, 2), more = r.cevaplar.slice(2);
      setBubble(id, `<div class="bub in">
        <div class="row between"><span class="tag tr">🇹🇷 ANLAMI</span><span class="tag ${g[0]}">${g[1]}</span></div>
        <div class="big-tr" style="margin-top:6px">${esc(r.ceviri_tr)}</div>
        ${r.niyet_tr ? `<div class="note">🎯 ${esc(r.niyet_tr)}</div>` : ""}
        ${r.onemli_uyari_tr ? `<div class="dangerbox" style="margin-top:8px">⚠️ ${esc(r.onemli_uyari_tr)}</div>` : ""}
        ${top.map(replyCard).join("")}
        <details style="margin-top:8px"><summary class="small">Diğer cevaplar, Felemenkçesi ve notlar</summary>
          ${more.map(replyCard).join("")}
          <div style="margin-top:10px"><span class="tag nl">🇧🇪</span> <span class="mid-nl">${esc(r.duzeltilmis_nl)}</span></div>
          ${r.duzeltilmis_nl.trim().toLowerCase() !== raw.toLowerCase() ? `<div class="small muted">Telefonun duyduğu: “${esc(raw)}”</div>` : ""}
          ${r.notlar_tr ? `<div class="note">💡 ${esc(r.notlar_tr)}</div>` : ""}
          ${acts(r.duzeltilmis_nl, r.ceviri_tr, "", "Hayattan", { show: false, add: addOk })}
        </details>
        ${redo}</div>`);
      if (store.get("autoSpeak", false) && r.cevaplar[0]) TTS.speak(r.cevaplar[0].nl);
    } else {
      conv.push({ d: "out", nl: r.nl, ctx, at: Date.now() }); hist({ d: "out", nl: r.nl, tr: raw });
      setBubble(id, `<div class="bub out">
        <span class="tag tr">🇹🇷 SEN</span> <span class="small">“${esc(raw)}”</span>
        <div style="margin-top:8px"><span class="tag nl">🇧🇪 ŞÖYLE DE</span></div>
        <div class="tapzone" data-act="show" data-nl="${esc(r.nl)}" data-tr="${esc(r.tr_geri)}" data-ok="${esc(r.okunus)}">
          <div class="big-nl" style="margin-top:4px">${esc(r.nl)}</div><div class="okn" style="font-size:1.2rem">${esc(r.okunus)}</div></div>
        <div class="small">↩︎ Anlamı: ${esc(r.tr_geri)}</div>
        ${acts(r.nl, r.tr_geri, r.okunus, "Hayattan", { add: addOk })}
        ${r.ipucu_tr ? `<div class="note">💡 ${esc(r.ipucu_tr)}</div>` : ""}
        ${r.alternatifler.length ? `<details style="margin-top:8px"><summary>🔁 Başka nasıl denir? (${r.alternatifler.length})</summary>${r.alternatifler.map(c => `<div class="reply"><span class="tag br">${esc(c.ton)}</span>
          <div class="mid-nl" style="margin-top:4px">${esc(c.nl)}</div><div class="okn small">${esc(c.okunus)}</div><div class="small">🇹🇷 ${esc(c.tr)}</div>${acts(c.nl, c.tr, c.okunus, "Hayattan", { add: addOk })}</div>`).join("")}</details>` : ""}
        ${redo}</div>`);
    }
    conv = conv.slice(-8); store.set("conv", conv);
    scrollToBubble(id);
  } catch (e) {
    setBubble(id, e.code === "abort" ? `<div class="bub ${dir}">${head}<div class="small muted">İptal edildi.</div></div>` : `<div class="bub ${dir}">${head}${errBox(e)}<button class="btn sm" data-act="retry" data-id="${id}" data-dir="${dir}" data-raw="${esc(raw)}">↻ Tekrar dene</button></div>`);
    scrollToBubble(id);
  }
}
ACT.redo = el => { const r = redoMap.get(el.dataset.id); if (r) interpProcess(r.dir, r.raw, { forceBest: true, bubbleId: el.dataset.id }); };
ACT.retry = el => interpProcess(el.dataset.dir, el.dataset.raw, { bubbleId: el.dataset.id });
function hist(h) { const l = store.get("hist", []); l.unshift({ ...h, at: Date.now() }); store.set("hist", l.slice(0, 40)); }

/* =================================================================
   PRATİK: haftalık görev + rol oyunları
   ================================================================= */
const SCEN = [
  { g: "Süpermarket (şu anki iş)" },
  { id: "kasa", e: "🛒", n: "Kasada müşteri", d: "You are a customer paying at the checkout of an Albert Heijn in Flanders. Topics: greeting, Bonuskaart, bag (zak, paid), paying with Bancontact or cash, receipt (kasticket), small talk." },
  { id: "urun", e: "🔎", n: "Ürün arayan müşteri", d: "You are a customer who cannot find a product (pick something realistic like havermelk, glutenvrij brood, batterijen, verse munt) and asks the employee for help; maybe it is sold out." },
  { id: "sikayet", e: "😠", n: "Şikâyetçi müşteri", d: "You are a slightly annoyed customer: you bought something past its date, or the price at the checkout differed from the shelf price. You want a solution." },
  { id: "sef", e: "🧑‍💼", n: "Takım lideri görev veriyor", d: "You are the store team leader giving the employee tasks for the shift (fill shelves, check dates, help at checkout) and talking about breaks or swapping a shift. Use 'je'." },
  { id: "yasli", e: "👵", n: "Sohbetçi yaşlı Flaman müşteri", d: "You are a friendly, chatty elderly Flemish customer talking about the weather, prices and asking where something is. Use typical Flemish words (allee, amai, efkes, ge/gij) but stay understandable." },
  { id: "telefon", e: "📞", n: "Telefonla hastalık bildirimi", d: "You are the store manager answering the phone. The employee calls before their shift to say they are sick. Ask how long and remind them about a doctor's certificate (medisch attest) per the work rules, in general terms." },
  { g: "Hayat & kariyer" },
  { id: "tanis", e: "🙋", n: "Yeni biriyle tanışma", d: "You are a friendly Flemish person meeting the user for the first time. Ask their name, where they come from, how long they have lived in Belgium, their job, hobbies." },
  { id: "komsu", e: "🏘️", n: "Komşuyla sohbet", d: "You are the user's neighbour in a Flemish town. Small talk about the weather, the waste collection day (PMD, restafval), a package you received for them, the neighbourhood." },
  { id: "doktor", e: "🩺", n: "Aile hekiminde", d: "You are a general practitioner (huisarts) in Flanders. The patient feels ill. Ask about symptoms, how long, fever, allergies; give simple advice and talk about a certificate for work." },
  { id: "evsahibi", e: "🏠", n: "Ev sahibiyle konuşma", d: "You are a landlord (huisbaas) in Flanders. The tenant calls about a problem (heating, a leak) or asks about the rent or the deposit (huurwaarborg). Be realistic and a bit busy." },
  { id: "gemeente", e: "🏛️", n: "Belediyede (gemeente)", d: "You are a clerk at the municipality counter. The user registers an address change; mention that the wijkagent will come to check. Ask for documents; keep procedures general." },
  { id: "school", e: "🏫", n: "Okulda öğretmenle", d: "You are a primary-school teacher in Flanders talking with a parent at a short oudercontact: how the child is doing, homework, Smartschool messages, an upcoming school trip." },
  { id: "vdab", e: "🔍", n: "VDAB iş danışmanı", d: "You are a job counsellor at VDAB. Ask about experience, education, Dutch level, desired work; suggest next steps (Dutch course, vocational training, CV)." },
  { id: "mulakat", e: "🤝", n: "İş görüşmesi (sollicitatie)", d: "You are an HR manager interviewing for a logistics/warehouse or customer-service job. Ask typical questions one by one (introduce yourself, experience, strengths, why this job, availability, questions for us)." }
];
let rp = null, rpToken = 0;
function weekNo() { const d = new Date(); const start = new Date(d.getFullYear(), 0, 1); return Math.floor((d - start) / 604800000); }
function currentMission() {
  const lvl = LV_ORDER.indexOf(profile().level || "A1");
  const pool = C.MISSIONS.filter(m => LV_ORDER.indexOf(m.lvl) <= lvl + 1);
  if (!pool.length) return null;
  const done = store.get("missionsDone", []);
  const open = pool.filter(m => !done.includes(m.id));
  const list = open.length ? open : pool;
  return list[weekNo() % list.length];
}
function renderPractice() {
  if (App.practice.mode === "rp" && rp) return renderRP();
  const m = currentMission();
  $("#v-pratik").innerHTML = `
    ${m ? `<div class="card"><span class="tag br">🎯 Bu haftanın görevi · ${esc(m.lvl)}</span>
      <h2 style="margin:8px 0 4px">${esc(m.t)}</h2><div class="small muted">${esc(m.why || "")}</div>
      ${(m.phrases || []).map(x => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(P(x[0]))}" aria-label="Sesli oku">🔊</button><div class="t"><b>${esc(P(x[0]))}</b><div class="okn small">${esc(P(x[2] || ""))}</div><div class="small">🇹🇷 ${esc(P(x[1]))}</div></div></div>`).join("")}
      <details style="margin-top:8px"><summary>✅ Yaptım! Nasıl geçti?</summary>
        <textarea id="debIn" placeholder="Türkçe anlat: ne oldu, nerede zorlandın?" style="margin-top:8px"></textarea>
        <button class="btn primary block" style="margin-top:8px" data-act="debrief" data-id="${esc(m.id)}">Koçuma anlat</button><div id="debOut" aria-live="polite"></div></details>
      <p class="small muted" style="margin:8px 0 0">Gerçek hayatta konuşmak en büyük puanı getirir: +10 ⭐</p></div>` : ""}
    <div class="card">
      <h2 style="margin-top:0">🎭 Konuşma pratiği</h2>
      <p class="muted small" style="margin-top:0">Yapay zekâ bir rol üstlenir, sen Felemenkçe cevap verirsin. Her cevabına puan ve düzeltme gelir.</p>
      <label class="f" for="rpLevel">Seviye</label>
      <select id="rpLevel">${["başlangıç", "orta", "ileri"].map(l => `<option value="${l}" ${l === store.get("rpLevel", "başlangıç") ? "selected" : ""}>${{ "başlangıç": "Başlangıç — kısa, yavaş", orta: "Orta — günlük Belçika Felemenkçesi", ileri: "İleri — doğal hız, Flaman deyimleri" }[l]}</option>`).join("")}</select>
      <div class="opts">${SCEN.map(s => s.g ? `<h3 style="margin:10px 0 0">${esc(s.g)}</h3>` : `<button class="opt" data-act="rpStart" data-id="${s.id}">${s.e} <b>${esc(s.n)}</b></button>`).join("")}</div>
    </div>`;
  $("#rpLevel").onchange = e => store.set("rpLevel", e.target.value);
}
ACT.debrief = async el => {
  const txt = ($("#debIn").value || "").trim(); if (!txt) { toast("Kısaca anlat"); return; }
  const m = C.MISSIONS.find(x => x.id === el.dataset.id);
  const done = store.get("missionsDone", []); if (!done.includes(m.id)) { done.push(m.id); store.set("missionsDone", done); Progress.addXP(10); Progress.markStreakDay(); App.renderStats(); }
  $("#debOut").innerHTML = spinner("Koçun okuyor…");
  try {
    const r = await callClaude({ feature: "debrief", kind: "debrief", system: sysDebrief(), schema: SCHEMA.debrief, content: `Mission: ${m.t}\nUser's report (Turkish): "${txt}"` });
    $("#debOut").innerHTML = `<div class="note">${esc(r.tesvik_tr)}</div>${r.eksik_ifadeler.map(x => `<div class="reply"><div class="mid-nl">${esc(x.nl)}</div><div class="okn small">${esc(x.okunus)}</div><div class="small">🇹🇷 ${esc(x.tr)}</div>${acts(x.nl, x.tr, x.okunus, "Görev", { show: false })}</div>`).join("")}${r.sonraki_tr ? `<div class="note">➡️ ${esc(r.sonraki_tr)}</div>` : ""}`;
  } catch (e) { $("#debOut").innerHTML = e.code === "nokey" ? `<div class="note">Tebrikler! Görev kaydedildi. (Kişisel geri bildirim için API anahtarı gerekir.)</div>` : (e.code === "abort" ? "" : errBox(e)); }
};
ACT.rpStart = el => {
  const sc = SCEN.find(s => s.id === el.dataset.id);
  rp = { sc, level: $("#rpLevel").value, lines: [], busy: false, total: 0, n: 0, chat: [], ended: false };
  if (!sc) return;
  App.practice = { mode: "rp" }; rpToken++; renderRP(); rpTurn("[BAŞLA]");
  if (App.view !== "pratik") tab("pratik");
  Back.push(() => rpExit(true));
};
function rpExit(fromBack) {
  Speech.stopAll(); abortFeature("practice"); rpToken++; rp = null; App.practice = { mode: "home" };
  if (App.view === "pratik") renderPractice();
  if (!fromBack) Back.drop();
}
ACT.rpBack = () => rpExit(false);
function renderRP() {
  $("#v-pratik").innerHTML = `
    <div class="row" style="margin-bottom:10px"><button class="btn sm ghost" data-act="rpBack">← Senaryolar</button><span class="grow small muted">${rp.sc.e} ${esc(rp.sc.n)} · ${esc(rp.level)}</span></div>
    <div class="thread" id="rpChat" aria-live="polite">${rp.chat.join("")}</div>
    <div id="rpBusy"></div>
    <div class="live-text hidden" id="rpLive" style="margin-top:10px" aria-live="polite"></div>
    ${rp.ended ? `<div class="card" style="text-align:center"><div class="score">${rp.n ? (rp.total / rp.n).toFixed(1) : "–"} / 3</div><div class="muted">ortalama puan · ${rp.n} cevap</div><button class="btn primary" style="margin-top:10px" data-act="rpBack">Başka senaryo</button></div>` :
      `<div class="card" style="margin-top:12px">
        <div class="row"><button class="btn primary grow" id="rpMic" data-act="rpMic">🎤 Felemenkçe cevap ver</button><button class="btn" data-act="rpHelp">🆘 Yardım</button></div>
        <div class="row" style="margin-top:8px"><input type="text" id="rpText" style="flex:1;width:auto" placeholder="ya da buraya yaz…" enterkeyhint="send"><button class="btn" data-act="rpSend">Gönder</button></div></div>`}`;
  const t = $("#rpText"); if (t) t.addEventListener("keydown", e => { if (e.key === "Enter") ACT.rpSend(); });
  scrollThread();
}
function rpPush(html) { rp.chat.push(html); const c = $("#rpChat"); if (c) c.insertAdjacentHTML("beforeend", html); scrollThread(); }
async function rpTurn(line) {
  if (!rp) return;
  if (rp.busy) { toast("Cevap bekleniyor…"); return false; }
  rp.busy = true; const my = rpToken; const cmd = line.startsWith("[");
  const busyEl = () => $("#rpBusy") || { set innerHTML(v) { } };
  if (!cmd) rpPush(`<div class="bub out">${esc(line)}</div>`);
  busyEl().innerHTML = spinner("…");
  const history = rp.lines.length ? rp.lines.map(l => (l.who === "role" ? "Role: " : "User: ") + l.t).join("\n") : "(none yet)";
  try {
    const r = await callClaude({ feature: "practice", kind: "rp", system: sysRP(/^(vdab|mulakat|ladder|cv)/.test(String(rp.sc.id)) ? "career" : ""), schema: SCHEMA.rp, timeout: 60000,
      content: `Scenario: ${rp.sc.d}\nLevel: ${rp.level}\n\nConversation so far:\n${history}\n\nUser's latest line: ${line}` });
    if (my !== rpToken || !rp) return; // kullanıcı senaryodan çıktı: eski cevabı yazma
    busyEl().innerHTML = "";
    if (!cmd) { rp.lines.push({ who: "user", t: line }); rp.total += Math.max(0, Math.min(3, r.puan)); rp.n++; }
    rp.lines.push({ who: "role", t: r.musteri_nl });
    const p = Math.max(0, Math.min(3, r.puan));
    if (r.geri_bildirim_tr || r.dogru_hali_nl) rpPush(`<div class="note">${!cmd ? `<span aria-label="${p}/3">${"★".repeat(p)}${"☆".repeat(3 - p)}</span> ` : ""}${esc(r.geri_bildirim_tr)}
      ${r.dogru_hali_nl ? `<div style="margin-top:6px">✅ <b>${esc(r.dogru_hali_nl)}</b></div>${r.dogru_hali_okunus ? `<div class="okn small">${esc(r.dogru_hali_okunus)}</div>` : ""}${r.dogru_hali_tr ? `<div class="small">🇹🇷 ${esc(r.dogru_hali_tr)}</div>` : ""}${acts(r.dogru_hali_nl, r.dogru_hali_tr || "", r.dogru_hali_okunus || "", "Pratik düzeltme", { show: false })}` : ""}</div>`);
    rpPush(`<div class="bub in"><div class="mid-nl" style="font-size:1.2rem">${esc(r.musteri_nl)}</div><div class="okn small">${esc(r.musteri_okunus)}</div><div class="small muted">🇹🇷 ${esc(r.musteri_tr)}</div>${acts(r.musteri_nl, r.musteri_tr, r.musteri_okunus, "Pratik", { show: false })}</div>`);
    if (!r.bitti && r.ornek_cevap_nl) rpPush(`<details class="small"><summary>💡 Örnek cevap</summary><div class="reply"><div class="mid-nl">${esc(r.ornek_cevap_nl)}</div><div class="okn small">${esc(r.ornek_cevap_okunus)}</div>🇹🇷 ${esc(r.ornek_cevap_tr)}${acts(r.ornek_cevap_nl, r.ornek_cevap_tr, r.ornek_cevap_okunus, "Pratik", { show: false })}</div></details>`);
    TTS.speak(r.musteri_nl);
    if (!cmd) { Progress.addXP(p + 1); Progress.didCard(); }
    if (r.bitti) { rp.ended = true; Progress.markStreakDay(); renderRP(); }
  } catch (e) {
    if (my !== rpToken || !rp) return;
    busyEl().innerHTML = e.code === "abort" ? "" : errBox(e);
  } finally { if (my === rpToken && rp) rp.busy = false; }
}
ACT.rpSend = () => { const t = $("#rpText"); const v = (t && t.value || "").trim(); if (!v) return; if (rp && rp.busy) { toast("Cevap bekleniyor…"); return; } t.value = ""; rpTurn(v); };
ACT.rpHelp = () => rpTurn("[YARDIM]");
ACT.rpMic = el => {
  if (Speech.cur && Speech.cur.owner === "rp") { Speech.cur.stop(); return; }
  const live = $("#rpLive"); live.classList.remove("hidden"); live.textContent = "Dinliyorum… bitince düğmeye bas"; el.textContent = "⏹ Bitti, gönder";
  Speech.listen({ lang: store.get("srLang", "nl-BE"), owner: "rp", onText: t => { live.textContent = t; },
    onDone: t => { el.textContent = "🎤 Felemenkçe cevap ver"; live.classList.add("hidden"); if (!t) { toast("Ses duyulmadı"); return; } if (rp && rp.busy) { const i = $("#rpText"); if (i) i.value = t; toast("Cevap bekleniyor — söylediğin kutuya yazıldı"); return; } rpTurn(t); },
    onError: c => { el.textContent = "🎤 Felemenkçe cevap ver"; live.classList.add("hidden"); const b = $("#rpBusy"); if (c !== "cancelled" && b) b.innerHTML = errBox(Speech.errorText(c)); } });
};

/* =================================================================
   YARDIM: belge oku, mesaj yaz, telefon hazırlığı, ilk 12 ay, yol haritası
   ================================================================= */
let docFiles = [];
function renderHelp() {
  const H = App.help;
  const back = `<div class="row" style="margin-bottom:10px"><button class="btn sm ghost" data-act="helpHome">← Yardım</button></div>`;
  if (EXT.helpModes[H.mode]) return EXT.helpModes[H.mode](back);
  if (H.mode === "doc") {
    $("#v-yardim").innerHTML = back + `<div class="card"><h2 style="margin-top:0">📄 Mektup / belge oku</h2>
      <p class="small muted" style="margin-top:0">Fotoğrafını çek ya da metni yapıştır; Türkçe ne olduğunu, ne yapman gerektiğini ve kime sorman gerektiğini söylesin.</p>
      <label class="f" for="docType">Belge türü</label>
      <select id="docType" data-keep="type">${Object.entries({ mektup: "Resmî mektup / yazı", bordro: "Maaş bordrosu (loonbrief)", fatura: "Fatura / ödeme isteği", sozlesme: "Sözleşme (kira, iş)", okul: "Okul mesajı (Smartschool)", mesaj: "SMS / WhatsApp / e-posta", diger: "Diğer" }).map(([k, v]) => `<option value="${k}" ${k === H.type ? "selected" : ""}>${v}</option>`).join("")}</select>
      <div class="warnbox" style="margin-top:10px">🔒 Fotoğraf telefonda saklanmaz, yalnız okunmak için Claude'a gider. İstersen kimlik numarasını (rijksregisternummer) ve hesap numaranı kapatarak çek.</div>
      <div class="row" style="margin-top:10px">
        <label class="btn primary" style="display:inline-flex;align-items:center">📷 Fotoğraf çek<input type="file" accept="image/*" capture="environment" class="hidden" id="docCam"></label>
        <label class="btn" style="display:inline-flex;align-items:center">🖼 Galeriden<input type="file" accept="image/*" multiple class="hidden" id="docGal"></label>
      </div>
      <div class="small" id="docFilesInfo" style="margin-top:6px"></div>
      <label class="f" for="docText">ya da metni yapıştır</label>
      <textarea id="docText" data-keep="text" placeholder="Mektubun ya da mesajın metni…">${esc(H.text || "")}</textarea>
      <label class="f" for="docNote">Not (isteğe bağlı) — ör. "bu ay 120 saat çalıştım"</label>
      <input type="text" id="docNote" data-keep="note" value="${esc(H.note || "")}">
      <button class="btn primary block" style="margin-top:12px" data-act="docGo">Açıkla</button>
      </div><div id="docOut" aria-live="polite"></div>
      <p class="small muted">Bu bir hukuki danışmanlık değildir. Önemli kararlardan önce yazan kuruma ya da ücretsiz danışma noktalarına (OCMW, sendika, Justitiehuis) sor.</p>`;
    // fotoğraf eklenince sayfayı baştan çizme: yazılanlar ve seçilen tür kaybolmasın
    const add = e => { docFiles = [...docFiles, ...Array.from(e.target.files || [])].slice(0, 4); e.target.value = ""; docFilesInfo(); };
    $("#docCam").onchange = add; $("#docGal").onchange = add;
    keepFields(); docFilesInfo();
    return;
  }
  if (H.mode === "write") {
    $("#v-yardim").innerHTML = back + `<div class="card"><h2 style="margin-top:0">✉️ Mesaj yaz / düzelt</h2>
      <p class="small muted" style="margin-top:0">Uygulama hiçbir şey göndermez: metni kopyalayıp kendin gönderirsin.</p>
      <label class="f" for="wTo">Kime?</label><select id="wTo" data-keep="wto">${Object.entries({ sef: "Şef / iş yeri", evsahibi: "Ev sahibi", okul: "Okul / öğretmen", resmi: "Resmî kurum / banka", sirket: "İş başvurusu (şirket)", arkadas: "Komşu / arkadaş" }).map(([k, v]) => `<option value="${k}" ${k === H.wto ? "selected" : ""}>${v}</option>`).join("")}</select>
      <label class="f" for="wCh">Nereden?</label><select id="wCh" data-keep="wch"><option value="WhatsApp/SMS" ${H.wch !== "e-mail" ? "selected" : ""}>WhatsApp / SMS</option><option value="e-mail" ${H.wch === "e-mail" ? "selected" : ""}>E-posta</option></select>
      <div class="chips" style="margin-top:10px" role="group" aria-label="Mod"><button class="chip" data-act="wMode" data-m="duzelt" aria-pressed="${H.wmode === "duzelt"}">✍️ Ben yazdım, düzelt</button><button class="chip" data-act="wMode" data-m="yaz" aria-pressed="${H.wmode !== "duzelt"}">🇹🇷 Türkçe anlatayım, sen yaz</button></div>
      <textarea id="wIn" data-keep="win" placeholder="${H.wmode === "duzelt" ? "Felemenkçe denemeni yaz — önce kendin dene, sonra düzeltelim" : "Ne demek istediğini Türkçe yaz: ör. 'şefime bugün hasta olduğumu, doktora gideceğimi söyle'"}">${esc(H.win || "")}</textarea>
      <button class="btn primary block" style="margin-top:10px" data-act="wGo">Hazırla</button></div><div id="wOut" aria-live="polite"></div>`;
    keepFields();
    return;
  }
  if (H.mode === "phone") {
    $("#v-yardim").innerHTML = back + `<div class="card"><h2 style="margin-top:0">📞 Telefon görüşmesine hazırlan</h2>
      <p class="small muted" style="margin-top:0">Görüşme sırasında telefon mikrofonu uygulamaya verilmez; o yüzden önceden hazırlanıp cümleleri ekranda açık tut.</p>
      <label class="f" for="pWho">Kimi arıyorsun?</label><input type="text" id="pWho" placeholder="ör. aile hekimi, belediye, interim ajansı">
      <label class="f" for="pGoal">Ne istiyorsun? (Türkçe)</label><textarea id="pGoal" placeholder="ör. yarın için randevu almak istiyorum"></textarea>
      <button class="btn primary block" style="margin-top:10px" data-act="pGo">Hazırla</button></div><div id="pOut" aria-live="polite"></div>
      <div class="card"><h3>🆘 Görüşmede kurtaran cümleler</h3>${[["Kunt u wat trager spreken, alstublieft?", "Biraz daha yavaş konuşur musunuz?", "künt ü vat traahır spreekın, alstüblift"], ["Kunt u dat herhalen?", "Tekrarlar mısınız?", "künt ü dat herhaalın"], ["Kunt u dat spellen?", "Harf harf söyler misiniz?", "künt ü dat spelın"], ["Kunt u mij dat per e-mail sturen?", "Bunu bana e-postayla gönderir misiniz?", "künt ü mey dat per imeyl stüürın"], ["Mag ik u later terugbellen?", "Sizi sonra geri arayabilir miyim?", "mah ik ü laatır tırühbelın"]].map(x => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(x[0])}" aria-label="Sesli oku">🔊</button><div class="t"><b>${esc(x[0])}</b><div class="okn small">${esc(x[2])}</div><div class="small">🇹🇷 ${esc(x[1])}</div></div><button class="ibtn" data-act="show" data-nl="${esc(x[0])}" data-tr="${esc(x[1])}" aria-label="Büyük göster">📢</button></div>`).join("")}</div>`;
    return;
  }
  if (H.mode === "check") {
    const done = store.get("checklist", {});
    const items = C.CHECKLIST.items || [];
    const n = items.filter(i => done[i.id]).length;
    $("#v-yardim").innerHTML = back + `<div class="card"><h2 style="margin-top:0">✅ Belçika'da ilk 12 ay</h2>
      <div class="bar"><i style="width:${items.length ? Math.round(100 * n / items.length) : 0}%"></i></div><div class="small muted" style="margin:6px 0">${n} / ${items.length} tamam</div>
      ${C.CHECKLIST.note ? `<div class="warnbox small">${esc(C.CHECKLIST.note)}</div>` : ""}
      ${items.map(i => `<label class="chk"><input type="checkbox" data-chk="${esc(i.id)}" ${done[i.id] ? "checked" : ""}><span><b>${esc(i.t)}</b><br><span class="small">${esc(i.d)}</span><br><span class="small muted">🔎 ${esc(i.src)}</span></span></label>`).join("")}</div>`;
    $$("[data-chk]").forEach(c => c.onchange = () => { const d = store.get("checklist", {}); d[c.dataset.chk] = c.checked; store.set("checklist", d); if (c.checked) { Progress.addXP(3); haptic(15); } renderHelp(); });
    return;
  }
  if (H.mode === "road") {
    const safe = esc(C.ROADMAP).replace(/&lt;(\/?)(p|b|i|br)\s*\/?&gt;/g, "<$1$2>");
    $("#v-yardim").innerHTML = back + `<div class="card" style="line-height:1.6"><h2 style="margin-top:0">🗺️ Felemenkçe yol haritası</h2>${safe}</div>`;
    return;
  }
  $("#v-yardim").innerHTML = `
    <h2>Bugün neye yardım edeyim?</h2>
    <div class="grid2">
      <button class="tile" data-act="helpGo" data-m="doc"><div class="e">📄</div><div class="n">Mektup / belge oku</div><div class="small muted">fotoğraf → Türkçe açıklama</div></button>
      <button class="tile" data-act="helpGo" data-m="doc" data-t="bordro"><div class="e">💶</div><div class="n">Maaş bordrom</div><div class="small muted">brüt, net, kesintiler</div></button>
      <button class="tile" data-act="helpGo" data-m="write"><div class="e">✉️</div><div class="n">Mesaj yaz / düzelt</div><div class="small muted">şefe, ev sahibine, okula</div></button>
      <button class="tile" data-act="helpGo" data-m="phone"><div class="e">📞</div><div class="n">Telefon hazırlığı</div><div class="small muted">ne diyeceğim, ne sorarlar</div></button>
      <button class="tile" data-act="helpGo" data-m="check"><div class="e">✅</div><div class="n">İlk 12 ay listesi</div><div class="small muted">belediye, sigorta, banka…</div></button>
      <button class="tile" data-act="helpGo" data-m="road"><div class="e">🗺️</div><div class="n">Dil yol haritası</div><div class="small muted">kurs, seviye, VDAB</div></button>
      ${EXT.helpTiles.map(t => `<button class="tile" data-act="helpGo" data-m="${esc(t.mode)}"><div class="e">${esc(t.e)}</div><div class="n">${esc(t.n)}</div><div class="small muted">${esc(t.d || "")}</div></button>`).join("")}
    </div>
    <div class="dangerbox" style="margin-top:12px">🚨 Acil: <b>112</b> (ambulans, itfaiye) · <b>101</b> (polis) · Mesai dışı, acil olmayan doktor: <b>1733</b><br><span class="small">Şiddet: <b>1712</b> · Zehirlenme: <b>070 245 245</b> · Konuşmak için (7/24): <b>106</b> · İntihar düşüncesi: <b>1813</b> — numaraları kontrol et</span></div>`;
}
/** Formdaki alanları App.help içinde tut: yeniden çizimde kaybolmasın */
function keepFields() { $$("#v-yardim [data-keep]").forEach(el => { const f = () => { App.help[el.dataset.keep] = el.value; }; el.addEventListener("input", f); el.addEventListener("change", f); }); }
function docFilesInfo() { const b = $("#docFilesInfo"); if (b) b.innerHTML = docFiles.length ? `📎 ${docFiles.length} sayfa seçildi <button class="btn sm ghost" data-act="docClear">temizle</button>` : ""; }
ACT.helpHome = () => { Back.drop(); App.help = { mode: "home" }; renderHelp(); window.scrollTo(0, 0); };
ACT.helpGo = el => {
  App.help = { mode: el.dataset.m, type: el.dataset.t || "mektup", wmode: "yaz" }; docFiles = [];
  if (App.view !== "yardim") tab("yardim"); else renderHelp();
  window.scrollTo(0, 0);
  Back.push(() => { App.help = { mode: "home" }; if (App.view === "yardim") renderHelp(); });
};
ACT.docClear = () => { docFiles = []; docFilesInfo(); };
/** Yapıştırılan metinde kimlik numarası ve hesap numarasını göndermeden önce gizle (son 4 hane kalır) */
function maskPII(t) {
  return String(t)
    .replace(/\b\d{2}[.\s]?\d{2}[.\s]?\d{2}[-\s]?\d{3}[.\s]?\d{2}\b/g, "[rijksregisternummer gizlendi]")
    .replace(/\b([A-Z]{2}\d{2})[\s]?((?:\d{4}[\s]?){2,6})(\d{4})\b/gi, (m, a, mid, last) => a + " **** **** " + last);
}
/** Model ne derse desin: bağlantı, IBAN ya da tipik dolandırıcılık kelimesi varsa sabit uyarı göster */
function scamSignals(text) {
  const t = String(text || "");
  const hits = [];
  if (/https?:\/\/|www\.|bit\.ly|\.link\b/i.test(t)) hits.push("bağlantı (link)");
  if (/\bBE\d{2}[\s\d]{8,}/i.test(t)) hits.push("hesap numarası (IBAN)");
  if (/itsme|bpost|pakket|colis|douane|betaal (nu|vandaag|onmiddellijk)|uw rekening (is )?geblokkeerd|verifieer|bevestig uw gegevens/i.test(t)) hits.push("dolandırıcılarda sık görülen kelimeler");
  return hits;
}
ACT.docGo = async el => {
  const rawText = ($("#docText").value || "").trim();
  const type = $("#docType").value, text = maskPII(rawText), note = maskPII(($("#docNote").value || "").trim());
  if (!docFiles.length && !text) { toast("Önce fotoğraf seç ya da metin yapıştır"); return; }
  App.help.type = type; el.disabled = true; $("#docOut").innerHTML = spinner("Belge okunuyor (20–60 sn)…");
  try {
    const blocks = [];
    for (const f of docFiles) blocks.push(await imageToBlock(f));
    blocks.push({ type: "text", text: `${text ? `Pasted text:\n"""${text}"""\n` : ""}${note ? `User's note: ${note}\n` : ""}Explain this ${type} document.` });
    const r = await callClaude({ feature: "doc", kind: "doc", system: sysDoc(type), schema: SCHEMA.doc, content: blocks, timeout: 120000, model: MODEL_BEST });
    docFiles = []; docFilesInfo();
    if (type === "mesaj" && r.risk === "yesil") r.risk = "sari"; // mesajlarda temkinli ol
    const sig = scamSignals(rawText + " " + r.tutarlar.map(x => x.alinti_nl).join(" ") + " " + r.tarihler.map(x => x.alinti_nl).join(" ") + " " + r.odeme_uyarisi_tr);
    const riskTxt = { yesil: "🟢 Bilgi amaçlı", sari: "🟡 Bir şey yapman gerekebilir", kirmizi: "🔴 Önemli / acil — yardım al" }[r.risk] || "🟡";
    $("#docOut").innerHTML = `<div class="card risk-${esc(r.risk)}">
      <div class="row between"><b>${esc(r.belge_turu)}</b><span class="tag ${r.risk === "kirmizi" ? "bad" : r.risk === "yesil" ? "ok" : "warn"}">${riskTxt}</span></div>
      ${r.gonderen ? `<div class="small muted">Gönderen: ${esc(r.gonderen)}</div>` : ""}
      <p style="font-size:1.05rem">${esc(r.ozet_tr)}</p>
      ${r.risk_neden_tr ? `<div class="${r.risk === "kirmizi" ? "dangerbox" : "note"}">${esc(r.risk_neden_tr)}</div>` : ""}
      ${r.yapilacaklar.length ? `<h3 style="margin-top:12px">${r.eylem_gerekli ? "Yapman gerekenler" : "Öneriler"}</h3><ol>${r.yapilacaklar.map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}
      ${r.tarihler.length ? `<h3>📅 Belgedeki tarihler</h3>${r.tarihler.map(d => `<div class="phrase"><div class="t"><b>${esc(d.tarih)}</b> — ${esc(d.amac_tr)}<div class="small muted">“${esc(d.alinti_nl)}”</div></div></div>`).join("")}` : ""}
      ${r.tutarlar.length ? `<h3>💶 Belgedeki tutarlar</h3>${r.tutarlar.map(d => `<div class="phrase"><div class="t"><b>${esc(d.tutar)}</b> — ${esc(d.aciklama_tr)}<div class="small muted">“${esc(d.alinti_nl)}”</div></div></div>`).join("")}` : ""}
      ${r.odeme_uyarisi_tr ? `<div class="dangerbox" style="margin-top:8px">💳 ${esc(r.odeme_uyarisi_tr)}</div>` : ""}
      ${sig.length || r.odeme_uyarisi_tr ? `<div class="dangerbox" style="margin-top:8px">🛡️ <b>Dolandırıcılık kontrolü:</b> ${sig.length ? `bu belgede ${esc(sig.join(", "))} var. ` : ""}Mesajdaki linke tıklama, oradan ödeme yapma. Hesap numarasını eski faturan ya da resmî siteden kontrol et; şüphelenirsen bilinen numaradan ara. Şüpheli mesajı <b>suspicious@safeonweb.be</b> adresine iletebilirsin (kontrol et).</div>` : ""}
      ${r.kime_sor_tr ? `<div class="note">❓ Kime sorabilirsin: ${esc(r.kime_sor_tr)}</div>` : ""}
      ${r.cevap_taslagi_nl ? `<h3 style="margin-top:12px">✉️ Cevap taslağı (kendin gönderirsin)</h3><div class="copybox">${esc(r.cevap_taslagi_nl)}</div><div class="small">🇹🇷 ${esc(r.cevap_taslagi_tr)}</div><button class="btn sm" style="margin-top:6px" data-act="copy" data-text="${esc(r.cevap_taslagi_nl)}">📋 Kopyala</button>` : ""}
      ${r.yeni_kelimeler.length ? `<details style="margin-top:10px"><summary>📚 Bu belgedeki yeni kelimeler (${r.yeni_kelimeler.length})</summary>${r.yeni_kelimeler.map(w => `<div class="phrase"><div class="t"><b>${esc(w.nl)}</b><div class="okn small">${esc(w.okunus)}</div><div class="small">🇹🇷 ${esc(w.tr)}</div></div><button class="ibtn" data-act="add" data-nl="${esc(w.nl)}" data-tr="${esc(w.tr)}" data-ok="${esc(w.okunus)}" data-src="Belge" aria-label="Kartlarıma ekle">➕</button></div>`).join("")}</details>` : ""}
      <p class="small muted" style="margin-bottom:0">Tarih ve tutarları belgenin kendisinden bir daha kontrol et. Yapay zekâ yanılabilir.</p></div>`;
    Progress.addXP(3);
  } catch (e) { $("#docOut").innerHTML = e.code === "abort" ? "" : errBox(e); }
  el.disabled = false;
};
ACT.copy = async el => { try { await navigator.clipboard.writeText(el.dataset.text); toast("Kopyalandı 📋"); } catch { toast("Kopyalanamadı — metni basılı tutup kopyala"); } };
ACT.wMode = el => {
  const i = $("#wIn"); if (i) App.help.win = i.value; App.help.wto = $("#wTo").value; App.help.wch = $("#wCh").value;
  App.help.wmode = el.dataset.m; renderHelp();
};
ACT.wGo = async el => {
  const txt = ($("#wIn").value || "").trim(); if (!txt) { toast("Önce yaz"); return; }
  el.disabled = true; $("#wOut").innerHTML = spinner("Hazırlanıyor…");
  try {
    const r = await callClaude({ feature: "write", kind: "write", system: sysWrite($("#wTo").value, $("#wCh").value), schema: SCHEMA.write,
      content: `Recipient: ${RECIPIENTS[$("#wTo").value]}\nChannel: ${$("#wCh").value}\nMode: ${App.help.wmode === "duzelt" ? "duzelt" : "yaz"}\nText: """${txt}"""` });
    const full = (r.konu_nl ? `Onderwerp: ${r.konu_nl}\n\n` : "") + r.mesaj_nl;
    $("#wOut").innerHTML = `<div class="card">${r.uyari_tr ? `<div class="dangerbox" style="margin-bottom:8px">⚠️ ${esc(r.uyari_tr)}</div>` : ""}
      ${r.konu_nl ? `<div class="small muted">Konu: <b>${esc(r.konu_nl)}</b></div>` : ""}<div class="copybox">${esc(r.mesaj_nl)}</div>
      <div class="small" style="margin-top:6px">🇹🇷 ${esc(r.geri_ceviri_tr)}</div>
      ${r.aciklama_tr ? `<div class="note">💡 ${esc(r.aciklama_tr)}</div>` : ""}
      <div class="row" style="margin-top:8px"><button class="btn primary" data-act="copy" data-text="${esc(full)}">📋 Kopyala</button><button class="btn" data-act="say" data-say="${esc(r.mesaj_nl)}">🔊 Dinle</button></div>
      <p class="small muted" style="margin-bottom:0">[Köşeli parantezleri] kendin doldur. Göndermeden önce bir kez oku.</p></div>`;
    Progress.addXP(2);
  } catch (e) { $("#wOut").innerHTML = e.code === "abort" ? "" : errBox(e); }
  el.disabled = false;
};
ACT.pGo = async el => {
  const who = ($("#pWho").value || "").trim(), goal = ($("#pGoal").value || "").trim(); if (!goal) { toast("Ne istediğini yaz"); return; }
  el.disabled = true; $("#pOut").innerHTML = spinner("Hazırlanıyor…");
  try {
    const r = await callClaude({ feature: "phone", kind: "phone", system: sysPhone(), schema: SCHEMA.phone,
      content: `Calling: ${who || "unknown"}\nGoal (Turkish): "${goal}"\nUser's name: ${profile().name || "(not given)"}` });
    const line = (x, t) => `<div class="reply"><span class="tag br">${t}</span><div class="mid-nl" style="font-size:1.25rem;margin-top:4px">${esc(x.nl)}</div><div class="okn">${esc(x.okunus)}</div><div class="small">🇹🇷 ${esc(x.tr)}</div>${acts(x.nl, x.tr, x.okunus, "Telefon")}</div>`;
    $("#pOut").innerHTML = `<div class="card">${line(r.acilis, "1 · Açılış")}
      ${r.isim_harfleme ? `<div class="note">🔤 Adını harf harf: <b>${esc(r.isim_harfleme)}</b></div>` : ""}
      <h3 style="margin-top:12px">2 · Sana sorabilecekleri</h3>
      ${r.sorular.map(q => `<div class="reply"><div class="small"><b>❓ ${esc(q.soru_nl)}</b> — ${esc(q.soru_tr)}</div><div class="mid-nl" style="margin-top:4px">${esc(q.cevap_nl)}</div><div class="okn small">${esc(q.okunus)}</div><div class="small">🇹🇷 ${esc(q.cevap_tr)}</div>${acts(q.cevap_nl, q.cevap_tr, q.okunus, "Telefon")}</div>`).join("")}
      ${line(r.kapanis, "3 · Kapanış")}
      ${r.ipucu_tr ? `<div class="note">💡 ${esc(r.ipucu_tr)}</div>` : ""}</div>`;
    Progress.addXP(2);
  } catch (e) { $("#pOut").innerHTML = e.code === "abort" ? "" : errBox(e); }
  el.disabled = false;
};

/* =================================================================
   BEN: profil, defter, ayarlar
   ================================================================= */
function renderBen() {
  const p = profile(); const saved = store.get("saved", []); const h = store.get("hist", []);
  const learned = Object.entries(SRS.all()).filter(([k, r]) => !k.includes("|") && r.b >= 2).length;
  const voices = TTS.nlVoices(); const pref = store.get("voice", "");
  const theme = store.get("theme", "system");
  const hasKey = !!store.get("apiKey", "");
  const liveLogs = store.get("liveLogs", []);
  let usageHtml = "";
  try {
    if (typeof Usage !== "undefined" && Usage.month) {
      const u = Usage.month();
      const top = Object.entries(u.byFeature || {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([f, v]) => `${esc(f.split(":")[0])}: $${v.toFixed(2)}`).join(" · ");
      usageHtml = `<div class="note">💶 Bu ay yaklaşık <b>$${(u.usd || 0).toFixed(2)}</b> (${u.calls || 0} istek)${top ? `<br><span class="small">${top}</span>` : ""}<br><span class="small muted">Tahmindir; kesin tutar console.anthropic.com → Usage.</span></div>`;
    }
  } catch { }
  const fld = (k, l, ph) => `<label class="f" for="p_${k}">${l}</label><input type="text" id="p_${k}" value="${esc(p[k] || "")}" placeholder="${esc(ph)}">`;
  $("#v-ben").innerHTML = `
    <div class="card"><div class="grid2" style="grid-template-columns:1fr 1fr 1fr;text-align:center">
      <div><div class="score" style="font-size:1.6rem">${Progress.streak()}</div><div class="small muted">🔥 gün seri</div></div>
      <div><div class="score" style="font-size:1.6rem">${learned}</div><div class="small muted">öğrenilen cümle</div></div>
      <div><div class="score" style="font-size:1.6rem">${store.get("xp", 0)}</div><div class="small muted">⭐ puan</div></div></div></div>

    <details class="card" ${!p.name ? "open" : ""}><summary>👤 Benim durumum</summary>
      <p class="small muted">Dersler, pratikler ve çeviriler buna göre kişiselleşir. Sadece bu telefonda kalır. Kimlik numarası yazma.</p>
      ${fld("name", "Adın", "ör. Oğuz")}
      ${fld("aliases", "İş yerinde sana nasıl sesleniyorlar?", "ör. Oz, Oguz — canlı altyazı adını tanısın")}
      ${fld("job", "Şu anki işin", "")}
      <label class="f" for="p_level">Felemenkçe seviyen (tahmini)</label><select id="p_level">${["A1", "A2", "B1", "B2"].map(l => `<option ${p.level === l ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label class="f" for="p_goal">Günlük hedef</label><select id="p_goal">${[[5, "5 dk (10 kart)"], [10, "10 dk (20 kart)"], [20, "20 dk (40 kart)"]].map(([v, l]) => `<option value="${v}" ${+p.goal === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <details style="margin-top:10px"><summary class="small">Daha fazla (isteğe bağlı)</summary>
        ${fld("city", "Şehir", "ör. Gent")}${fld("months", "Kaç aydır Belçika'dasın?", "ör. 3")}${fld("contract", "Sözleşme", "ör. interim, belirsiz süreli")}
        ${fld("homeJob", "Türkiye'deki mesleğin / okulun", "ör. muhasebe mezunu")}${fld("target", "Hangi işe geçmek istiyorsun?", "ör. lojistik, ofis")}
        ${fld("licence", "Ehliyet", "ör. B, C")}${fld("kids", "Çocuklar (yaşları)", "ör. 7 ve 10 yaşında")}</details>
      <button class="btn primary block" style="margin-top:12px" data-act="saveProfile">Kaydet</button></details>

    <details class="card"><summary>⭐ Kartlarım ve defterim (${saved.length})</summary>
      ${saved.length ? `<button class="btn primary sm" style="margin:8px 0" data-act="studySaved">🃏 Kaydettiklerimi çalış</button>` : ""}
      ${saved.length ? saved.slice(0, 100).map((s, i) => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(s.nl)}" aria-label="Sesli oku">🔊</button>
        <div class="t"><b>${esc(s.nl)}</b>${s.ok ? `<div class="okn small">${esc(s.ok)}</div>` : ""}<div class="small">🇹🇷 ${esc(s.tr)}</div><div class="small muted">${esc(s.src || "")}</div></div>
        <button class="ibtn" data-act="delSaved" data-i="${i}" aria-label="Sil">🗑</button></div>`).join("") : `<p class="small muted">Tercümanda, pratikte, canlı altyazıda ya da belgelerde ➕'ya bastıkların burada toplanır ve günlük derse girer.</p>`}</details>

    <details class="card"><summary>🕘 Son çeviriler (${h.length})</summary>
      ${h.length ? h.map(x => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(x.nl)}" aria-label="Sesli oku">🔊</button><div class="t"><span class="tag ${x.d === "in" ? "nl" : "tr"}">${x.d === "in" ? "duyulan" : "söylediğim"}</span><b style="margin-top:3px">${esc(x.nl)}</b><div class="small">🇹🇷 ${esc(x.tr)}</div></div></div>`).join("") : `<p class="small muted">Henüz yok.</p>`}
      ${h.length ? `<button class="btn sm" data-act="clearHist">Son çevirileri sil</button>` : ""}</details>

    <details class="card"><summary>🎨 Görünüm ve ses</summary>
      <label class="f">Yazı boyutu</label>
      <div class="chips" role="group" aria-label="Yazı boyutu">${[[1, "Normal"], [1.15, "Büyük"], [1.3, "Çok büyük"]].map(([v, l]) => `<button class="chip" data-act="fontScale" data-v="${v}" aria-pressed="${+store.get("fontScale", 1) === v}">${l}</button>`).join("")}</div>
      <label class="f" for="s_theme">Görünüm</label>
      <select id="s_theme">${[["system", "Telefona göre"], ["light", "Açık"], ["dark", "Koyu"]].map(([v, l]) => `<option value="${v}" ${theme === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label class="f" for="s_voice">Felemenkçe ses</label>
      <select id="s_voice">${voiceOptions(voices, pref)}</select>
      ${voices.length ? "" : `<div class="warnbox small" style="margin-top:6px">Android: Ayarlar → "Metin okuma çıkışı" → Google → ses verilerini yükle → Nederlands (België). iPhone: Ayarlar → Erişilebilirlik → Seslendirilen İçerik → Sesler → Nederlands.</div>`}
      <label class="f" for="s_rate">Okuma hızı: <span id="rateVal">${(+store.get("rate", 0.9)).toFixed(2)}</span></label>
      <input type="range" id="s_rate" min="0.5" max="1.2" step="0.05" value="${store.get("rate", 0.9)}" style="width:100%">
      <div class="row"><button class="btn sm" data-act="say" data-say="Goeiedag, hebt u een Bonuskaart?">🔊 Sesi dene</button><button class="btn sm" data-act="micTest">🎤 Mikrofon testi</button></div>
      <span class="small" id="micTestOut" aria-live="polite"></span>
      <label class="row small" style="margin-top:10px"><input type="checkbox" id="s_open" ${store.get("openInterp", false) ? "checked" : ""}> Uygulama tercümanla açılsın</label>
    </details>

    <details class="card"><summary>🛡️ Gizlilik ve veriler</summary>
      <p class="small">Uygulama sesi <b>kaydetmez</b>. Ama konuşmayı yazıya çeviren telefonun kendi ses tanımasıdır (Android'de Google, iPhone'da Apple); ses o sırada onların sunucularında işlenebilir. Yazıya dökülen metin ve senin seçtiğin fotoğraflar çeviri için Anthropic'e (Claude) gider; Anthropic'in API şartlarına göre bu veriler sınırlı süre tutulur ve model eğitiminde kullanılmaz (kontrol et). Hiçbir mesaj senin yerine gönderilmez.</p>
      <div class="small"><b>Bu telefonda saklananlar:</b>
        <div class="phrase"><div class="t">Kartlar ve ilerleme: ${Object.keys(SRS.all()).length}</div></div>
        <div class="phrase"><div class="t">Kaydettiğin cümleler: ${saved.length}</div></div>
        <div class="phrase"><div class="t">Son çeviriler: ${h.length}</div><button class="btn sm" data-act="clearHist">Sil</button></div>
        <div class="phrase"><div class="t">Canlı altyazı kayıtları: ${liveLogs.length}</div><button class="btn sm" data-act="clearLive">Sil</button></div>
      </div>
      <button class="btn sm" style="margin-top:10px;color:var(--danger)" data-act="wipeAll">🧨 Bu telefondaki her şeyi sil</button>
    </details>

    <details class="card" id="keyCard" ${App.benOpenSetup || (!hasKey && !DEMO) ? "open" : ""}><summary>🔧 Kurulum (teknik — ağabeyin için) ${hasKey ? "✅" : "❗"}</summary>
      <h3 style="margin-top:10px">🔑 Claude API anahtarı</h3>
      <p class="small muted">Çeviri, pratik, öğretmen, belge okuma için gerekir; hazır dersler ve kartlar anahtarsız çalışır. Anahtar yalnız bu telefonda saklanır ve doğrudan Anthropic'e gider. <b>Bu uygulamaya özel bir anahtar oluştur ve aylık harcama limiti koy</b> (console.anthropic.com → Settings → Limits). Telefon kaybolursa anahtarı konsoldan sil.</p>
      <input type="password" id="apiKey" value="${esc(store.get("apiKey", ""))}" placeholder="sk-ant-…" autocomplete="off" autocapitalize="off" spellcheck="false">
      <div class="row" style="margin-top:8px"><button class="btn" data-act="pasteKey" data-into="apiKey">📋 Yapıştır</button><button class="btn primary" data-act="saveKey">Kaydet ve dene</button>${hasKey ? `<button class="btn sm" data-act="delKey">🗑 Anahtarı sil</button>` : ""}</div>
      <div class="small" id="keyStatus" aria-live="polite"></div>
      <details style="margin-top:12px"><summary class="small">🔗 Başka bir telefona kurulum linki oluştur</summary>
        <p class="small muted">Yukarıdaki anahtarla tek dokunuşluk bir link oluşur. Karşı taraf linke dokununca anahtar telefonuna kaydolur. Link anahtarın kendisi gibidir: yalnız o kişiye gönder, kurduktan sonra mesajı silsin. (iPhone'da ana ekran uygulamasına geçmez — orada 📋 Yapıştır kullan.)</p>
        <button class="btn sm" data-act="makeSetupLink">🔗 Linki oluştur ve kopyala</button><div id="setupLinkOut" class="small" style="margin-top:6px"></div></details>
      ${usageHtml}
      <h3 style="margin-top:14px">🧠 Yapay zekâ modeli</h3>
      <label class="row small"><input type="checkbox" id="s_fast" ${store.get("fastInterp", false) ? "checked" : ""}> ⚡ Tercümanda hızlı mod (Claude Haiku: ~2 sn, çok ucuz). Doktor/resmî/okul/polis durumlarında her zaman en iyi model kullanılır.</label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_fastP" ${store.get("fastPractice", false) ? "checked" : ""}> ⚡ Konuşma pratiğinde hızlı mod</label>
      <label class="f" for="s_live">Canlı altyazı modeli</label>
      <select id="s_live"><option value="fast" ${store.get("liveModel", "fast") !== "best" ? "selected" : ""}>⚡ Hızlı & ucuz (önerilen: ~1–2 sn)</option><option value="best" ${store.get("liveModel", "fast") === "best" ? "selected" : ""}>🧠 En iyi (yavaş: ~5–8 sn, pahalı)</option></select>
      <p class="small muted">Varsayılan tercüman: Claude Opus 5.5 (en iyi kalite).</p>
      <label class="f" for="s_sr">Dinlenecek Felemenkçe</label>
      <select id="s_sr"><option value="nl-BE" ${store.get("srLang", "nl-BE") === "nl-BE" ? "selected" : ""}>Belçika (nl-BE)</option><option value="nl-NL" ${store.get("srLang", "nl-BE") === "nl-NL" ? "selected" : ""}>Hollanda (nl-NL)</option></select>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_auto" ${store.get("autoSpeak", false) ? "checked" : ""}> İlk cevap önerisini otomatik sesli oku (önerilmez)</label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_local" ${store.get("srLocal", false) ? "checked" : ""}> Ses tanımayı mümkünse telefonun içinde yap (destekleyen Android Chrome'da; ses dışarı gitmez) <button class="btn sm" data-act="checkLocal">Kontrol et</button></label>
      <div class="small" id="localOut" aria-live="polite"></div>
      <h3 style="margin-top:14px">💾 Yedek</h3>
      <p class="small muted">iPhone'da uzun süre açılmayan sitelerin verisi silinebilir; ara sıra yedek al. API anahtarı yedeğe girmez.</p>
      <label class="row small"><input type="checkbox" id="exp_logs"> Konuşma dökümlerini (çeviriler, canlı altyazı) de yedeğe ekle</label>
      <div class="row" style="margin-top:6px"><button class="btn sm" data-act="export">⬇️ Yedek indir</button><button class="btn sm" data-act="import">⬆️ Yedekten yükle</button></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="resetProg">İlerlemeyi sıfırla</button><button class="btn sm" data-act="onbAgain">Tanıtımı tekrar göster</button></div>
    </details>
    ${EXT.benCards.map(f => { try { return f() || ""; } catch { return ""; } }).join("")}
    <p class="small muted" style="text-align:center">Dil Köprüsü · v${typeof APP_VERSION !== "undefined" ? APP_VERSION : "7"}</p>`;
  const on = (id, fn) => { const el = $(id); if (el) el.onchange = fn; };
  on("#s_fast", e => store.set("fastInterp", e.target.checked));
  on("#s_fastP", e => store.set("fastPractice", e.target.checked));
  on("#s_live", e => store.set("liveModel", e.target.value));
  on("#s_voice", e => store.set("voice", e.target.value));
  on("#s_sr", e => store.set("srLang", e.target.value));
  on("#s_theme", e => { store.set("theme", e.target.value); applyTheme(); });
  on("#s_open", e => store.set("openInterp", e.target.checked));
  on("#s_auto", e => store.set("autoSpeak", e.target.checked));
  on("#s_local", e => store.set("srLocal", e.target.checked));
  const r = $("#s_rate"); if (r) r.oninput = e => { store.set("rate", +e.target.value); $("#rateVal").textContent = (+e.target.value).toFixed(2); };
  if (App.benFocusKey) { App.benFocusKey = false; setTimeout(() => { const k = $("#keyCard"); if (k) { k.scrollIntoView({ block: "center" }); $("#apiKey").focus(); } }, 50); }
  App.benOpenSetup = false;
}
const voiceOptions = (voices, pref) => voices.length ? voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === pref ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("") : `<option value="">Felemenkçe ses bulunamadı</option>`;
// sesler geç yüklenince yalnız ses listesini güncelle (yazılan profil bilgisi silinmesin)
App.onVoices = () => { const s = $("#s_voice"); if (s) s.innerHTML = voiceOptions(TTS.nlVoices(), store.get("voice", "")); };
ACT.fontScale = el => { store.set("fontScale", +el.dataset.v); applyFontScale(); renderBen(); };
function applyFontScale() { document.documentElement.style.fontSize = (100 * (+store.get("fontScale", 1) || 1)) + "%"; if (typeof fitDock === "function") setTimeout(fitDock, 50); }
ACT.saveProfile = () => {
  const p = profile();
  ["name", "aliases", "city", "months", "job", "contract", "kids", "homeJob", "target", "licence"].forEach(k => { const el = $("#p_" + k); if (el) p[k] = (el.value || "").trim().slice(0, 120); });
  p.level = $("#p_level").value; p.goal = +$("#p_goal").value;
  store.set("profile", p); toast("Kaydedildi ✅"); renderBen();
};
ACT.saveKey = async () => {
  const k = ($("#apiKey").value || "").trim();
  if (k && !/^sk-ant-/.test(k)) { $("#keyStatus").textContent = "❌ Anahtar sk-ant- ile başlamalı."; return; }
  store.set("apiKey", k);
  $("#keyStatus").innerHTML = `<span class="spinner"></span> deneniyor…`;
  try {
    if (typeof testKey === "function") {
      const r = await testKey();
      const lab = v => v === "ok" ? "✅" : "❌";
      $("#keyStatus").innerHTML = `En iyi model (Opus): ${lab(r.opus)} · Hızlı model (Haiku): ${lab(r.haiku)}${r.opus !== "ok" && r.haiku !== "ok" ? `<br>${esc(String(r.error || r.opus || ""))}` : ""}`;
    } else {
      await callClaude({ feature: "ping", kind: "ping", system: "Answer in Dutch.", content: "Say hello in one word.", schema: SCHEMA.ping, timeout: 30000 });
      $("#keyStatus").textContent = "Bağlantı çalışıyor ✅";
    }
  } catch (e) { $("#keyStatus").textContent = "❌ " + e.message; }
};
ACT.checkLocal = async () => {
  const out = $("#localOut"); if (!out) return;
  try {
    if (typeof Speech.checkLocal !== "function") { out.textContent = "Bu sürümde yok."; return; }
    const r = await Speech.checkLocal(store.get("srLang", "nl-BE"));
    out.textContent = r === "available" ? "✅ Telefonda Felemenkçe ses tanıma hazır." : r === "downloadable" ? "⬇️ İndirilebilir — kutuyu işaretle, ilk kullanımda yüklenir." : "❌ Bu telefonda/tarayıcıda yok; Google'ın sunucusu kullanılır.";
    if (r === "downloadable" && Speech.installLocal) { try { await Speech.installLocal(store.get("srLang", "nl-BE")); } catch { } }
  } catch { out.textContent = "❌ Kontrol edilemedi."; }
};
ACT.delKey = () => { if (!confirm("Anahtar bu telefondan silinsin mi? (Çeviri için yeniden girmek gerekir)")) return; store.del("apiKey"); toast("Anahtar silindi"); renderBen(); };
ACT.delSaved = el => { const l = store.get("saved", []); l.splice(+el.dataset.i, 1); store.set("saved", l); renderBen(); };
ACT.studySaved = () => { const items = store.get("saved", []).map(s => ({ nl: s.nl, tr: s.tr, ok: s.ok || "" })); startStudy(shuffle(items).slice(0, 20).map(it => ({ type: "flash", item: it })), "Kaydettiklerim", () => { App.learn = { mode: "home" }; }); };
ACT.clearHist = () => { if (confirm("Son çeviriler ve konuşma bağlamı silinsin mi?")) { store.set("hist", []); store.set("conv", []); conv = []; renderBen(); } };
ACT.clearLive = () => { if (confirm("Canlı altyazı kayıtları silinsin mi?")) { store.del("liveLogs"); store.del("liveDraft"); if (window.LiveUI && LiveUI.clear) LiveUI.clear(); renderBen(); toast("Silindi"); } };
ACT.wipeAll = async () => {
  if (!confirm("Bu telefondaki TÜM Dil Köprüsü verisi silinecek: ilerleme, kartlar, profil, kayıtlar ve API anahtarı. Geri alınamaz. Emin misin?")) return;
  if (!confirm("Son kez soruyorum: her şey silinsin mi?")) return;
  try { Object.keys(localStorage).filter(k => k.startsWith("dk_")).forEach(k => localStorage.removeItem(k)); } catch { }
  try { if (window.caches) for (const k of await caches.keys()) await caches.delete(k); } catch { }
  try { if (navigator.serviceWorker) for (const r of await navigator.serviceWorker.getRegistrations()) await r.unregister(); } catch { }
  location.replace(location.pathname);
};
ACT.resetProg = () => { if (confirm("Ders ilerlemesi, puan ve seri sıfırlansın mı? (Kaydettiklerin ve profilin kalır)")) { ["srs", "xp", "days", "today", "newToday", "cpBest", "gramDay"].forEach(k => store.del(k)); App.renderStats(); renderBen(); toast("Sıfırlandı"); } };
const LOG_KEYS = ["dk_hist", "dk_conv", "dk_liveLogs", "dk_liveDraft"];
ACT.export = () => {
  const withLogs = $("#exp_logs") && $("#exp_logs").checked;
  const data = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("dk_") && k !== "dk_apiKey" && !k.startsWith("dk_bad_") && (withLogs || !LOG_KEYS.includes(k))) data[k] = localStorage.getItem(k); } } catch { }
  const a = document.createElement("a"); const url = URL.createObjectURL(new Blob([JSON.stringify({ app: "dil-koprusu", v: 3, at: new Date().toISOString(), data })], { type: "application/json" }));
  a.href = url; a.download = `dil-koprusu-yedek-${todayStr()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 5000);
  toast(withLogs ? "Yedek indirildi — kişisel konuşmalar içerir, dikkatli sakla" : "Yedek indirildi — profil ve CV bilgilerini içerir, kimseyle paylaşma");
};
ACT.import = () => $("#importFile").click();
$("#importFile").addEventListener("change", async e => {
  const f = e.target.files[0];
  try {
    if (!f) return;
    const j = JSON.parse(await f.text()); if (j.app !== "dil-koprusu" || !j.data || typeof j.data !== "object") throw 0;
    if (!confirm("Bu yedek yüklensin mi? Şu anki ilerleme değişecek.")) return;
    let n = 0;
    Object.entries(j.data).forEach(([k, v]) => {
      if (!k.startsWith("dk_") || k === "dk_apiKey" || typeof v !== "string") return;
      try { JSON.parse(v); localStorage.setItem(k, v); n++; } catch { } // bozuk değeri alma
    });
    conv = store.get("conv", []).filter(c => c && c.at && Date.now() - c.at < 20 * 60000);
    App.interp.ctx = store.get("ctx", "is");
    applyTheme(); applyFontScale(); App.renderStats(); renderBen();
    toast(`Yedek yüklendi ✅ (${n} kayıt)`);
  } catch { toast("Bu dosya geçerli bir yedek değil"); }
  finally { e.target.value = ""; }
});
ACT.micTest = () => {
  const out = $("#micTestOut"); out.textContent = "Felemenkçe 'Goeiedag' de…";
  Speech.listen({ lang: store.get("srLang", "nl-BE"), owner: "test", maxMs: 8000, onText: t => { out.textContent = t; },
    onDone: t => { out.textContent = t ? `✅ Duyulan: “${t}”` : "Ses duyulmadı"; }, onError: c => { if (c !== "cancelled") out.textContent = "❌ " + Speech.errorText(c); } });
};
ACT.onbAgain = () => { store.set("onb", false); showOnboarding(); };
function applyTheme() {
  const t = store.get("theme", "system"); const root = document.documentElement;
  if (t === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);
  const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  $("#themeColor").setAttribute("content", dark ? "#0d1312" : "#0f766e");
}

/* =================================================================
   İLK AÇILIŞ TANITIMI
   ================================================================= */
let onbStep = 0;
function showOnboarding() {
  onbStep = 0; $("#onb").classList.add("on"); renderOnb();
  // Android geri tuşu tanıtımda bir önceki adıma gitsin, uygulamadan çıkmasın
  const backStep = () => { if (!$("#onb").classList.contains("on")) return; if (onbStep > 0) { onbSaveStep(); onbStep--; renderOnb(); } Back.push(backStep); };
  Back.push(backStep);
}
function renderOnb() {
  const p = profile(); const hasKey = !!store.get("apiKey", "");
  const steps = [
    `<div class="em" aria-hidden="true">🇹🇷 🌉 🇧🇪</div><h2 style="font-size:1.5rem;margin:0">Dil Köprüsü'ne hoş geldin</h2>
     <div class="card flat"><b>🎧 Yanında konuşulanı anla</b><br><span class="small">İş arkadaşların konuşurken Türkçe altyazı gibi okursun; sana bir iş söylenince satır 🔔 sarı yanar.</span></div>
     <div class="card flat"><b>🗣️ Karşındakine söyle</b><br><span class="small">Türkçe söyle, Felemenkçesini okunuşuyla al ya da büyük ekranda göster.</span></div>
     <div class="card flat"><b>📚 Günde 10 dakika</b><br><span class="small">İş cümleleri ve temel Felemenkçe, adım adım.</span></div>`,
    `<div class="em" aria-hidden="true">🙋</div><h2 style="margin:0">Biraz seni tanıyayım</h2><p class="small muted" style="margin:0">Sadece bu telefonda kalır.</p>
     <label class="f" for="o_name">Adın</label><input type="text" id="o_name" value="${esc(p.name)}" placeholder="ör. Oğuz">
     <label class="f" for="o_alias">İş yerinde sana nasıl sesleniyorlar?</label><input type="text" id="o_alias" value="${esc(p.aliases || "")}" placeholder="ör. Oz, Oguz">
     <label class="f" for="o_job">İşin</label><input type="text" id="o_job" value="${esc(p.job)}">
     <label class="f" for="o_level">Felemenkçen</label><select id="o_level">${[["A1", "Hiç / çok az biliyorum"], ["A2", "Basit konuşabiliyorum"], ["B1", "Günlük işleri halledebiliyorum"], ["B2", "Rahat konuşuyorum"]].map(([v, l]) => `<option value="${v}" ${p.level === v ? "selected" : ""}>${l}</option>`).join("")}</select>
     <label class="f">Günlük hedef</label><div class="chips" role="group">${[[5, "5 dk"], [10, "10 dk"], [20, "20 dk"]].map(([v, l]) => `<button class="chip" data-act="onbGoal" data-v="${v}" aria-pressed="${+p.goal === v}">${l}</button>`).join("")}</div>`,
    `<div class="em" aria-hidden="true">🎤🔊</div><h2 style="margin:0">Mikrofon ve ses</h2>
     <p class="small">Telefon bir kez mikrofon izni soracak — <b>İzin ver</b>'e bas. Uygulama sesi kaydetmez.</p>
     ${IN_APP_BROWSER ? `<div class="dangerbox">Bu link bir uygulamanın içinde açılmış. Mikrofon için Chrome (Android) ya da Safari'de (iPhone) aç.</div>` : ""}
     ${IS_IOS ? `<div class="warnbox small">iPhone: Ayarlar → Genel → Klavye → <b>Dikte</b> açık olmalı. Safari'de Paylaş → <b>Ana Ekrana Ekle</b> ile uygulama gibi kullan.</div>` : `<div class="warnbox small">Android: Chrome menüsü ⋮ → <b>Ana ekrana ekle / Uygulamayı yükle</b>.</div>`}
     <button class="btn" data-act="say" data-say="Goeiedag! Welkom in België.">🔊 Sesi dene</button>
     <button class="btn" data-act="onbMic">🎤 Mikrofonu dene</button><div id="onbMicOut" class="small" aria-live="polite"></div>`,
    hasKey ? `<div class="em" aria-hidden="true">✅</div><h2 style="margin:0">Her şey hazır</h2><p>Çeviri ve canlı altyazı için gereken kurulumu ağabeyin yapmış. Hiçbir şey yapmana gerek yok.</p>`
      : `<div class="em" aria-hidden="true">🔑</div><h2 style="margin:0">Yapay zekâ kurulumu</h2>
     <p class="small">Çeviri ve canlı altyazı için bir kez kurulum gerekir. Bunu genelde <b>ağabeyin</b> yapar: sana bir kurulum linki ya da kod gönderir.</p>
     <p class="small muted">Kurulum yoksa da olur: dersler, kartlar, hazır cümleler ve İlk 12 ay listesi şimdiden çalışır.</p>
     <input type="password" id="o_key" placeholder="Kod (sk-ant-…) — varsa" autocomplete="off" autocapitalize="off" spellcheck="false">
     <div class="row"><button class="btn" data-act="pasteKey" data-into="o_key">📋 Yapıştır</button><button class="btn" data-act="onbKeyTest">Kaydet ve dene</button></div><div id="onbKeyOut" class="small" aria-live="polite"></div>`,
    `<div class="em" aria-hidden="true">🧭</div><h2 style="margin:0">En çok neye ihtiyacın var?</h2>
     <p class="small muted">Uygulama oradan açılsın. Sonra her şeyi alttaki menüden bulursun.</p>
     <button class="btn primary block" data-act="onbGo" data-to="live">🎧 Yanımda konuşulanı anlamak</button>
     <button class="btn block" data-act="onbGo" data-to="talk">🗣️ Müşteriyle / insanlarla konuşmak</button>
     <button class="btn block" data-act="onbGo" data-to="learn">📚 Felemenkçe öğrenmek</button>`
  ];
  const last = onbStep === steps.length - 1;
  $("#onb").innerHTML = `<div class="step">${steps[onbStep]}</div>
    <div class="dots" aria-hidden="true">${steps.map((_, i) => `<i class="${i === onbStep ? "on" : ""}"></i>`).join("")}</div>
    <div class="row" style="max-width:520px;margin:0 auto;width:100%">
      ${onbStep > 0 ? `<button class="btn ghost" data-act="onbPrev">← Geri</button>` : `<button class="btn ghost" data-act="onbSkip">Atla</button>`}
      ${last ? "" : `<button class="btn primary grow" data-act="onbNext">Devam →</button>`}</div>`;
}
function onbSaveStep() {
  if (onbStep === 1 && $("#o_name")) { const p = profile(); p.name = $("#o_name").value.trim(); p.aliases = $("#o_alias").value.trim(); p.job = $("#o_job").value.trim(); p.level = $("#o_level").value; store.set("profile", p); }
  if (onbStep === 3 && $("#o_key")) { const k = ($("#o_key").value || "").trim(); if (/^sk-ant-/.test(k)) store.set("apiKey", k); }
}
ACT.onbNext = () => { onbSaveStep(); onbStep++; renderOnb(); };
ACT.onbPrev = () => { onbSaveStep(); onbStep = Math.max(0, onbStep - 1); renderOnb(); };
ACT.onbSkip = () => onbFinish("learn");
ACT.onbGo = el => onbFinish(el.dataset.to);
ACT.onbGoal = el => { const p = profile(); p.goal = +el.dataset.v; store.set("profile", p); $$("[data-act=onbGoal]").forEach(b => b.setAttribute("aria-pressed", String(b === el))); };
ACT.onbMic = () => { const out = $("#onbMicOut"); out.textContent = "Felemenkçe 'Goeiedag' de…"; Speech.listen({ lang: store.get("srLang", "nl-BE"), owner: "test", maxMs: 8000, onText: t => out.textContent = t, onDone: t => out.textContent = t ? `✅ Çalışıyor: “${t}”` : "Ses duyulmadı, bir daha dene", onError: c => { if (c !== "cancelled") out.textContent = "❌ " + Speech.errorText(c); } }); };
ACT.onbKeyTest = async () => {
  const k = ($("#o_key").value || "").trim(); if (!k) return;
  if (!/^sk-ant-/.test(k)) { $("#onbKeyOut").textContent = "❌ Kod sk-ant- ile başlamalı."; return; }
  store.set("apiKey", k); const out = $("#onbKeyOut"); out.innerHTML = `<span class="spinner"></span>`;
  try { await callClaude({ feature: "ping", kind: "ping", system: "Answer in Dutch.", content: "Say hello in one word.", schema: SCHEMA.ping, timeout: 30000 }); out.textContent = "✅ Bağlantı çalışıyor"; }
  catch (e) { out.textContent = "❌ " + e.message; }
};
function onbFinish(to) {
  onbSaveStep(); Speech.stopAll(); store.set("onb", true); $("#onb").classList.remove("on"); Back.reset();
  if (to === "live") { App.interp.live = true; store.set("interpLive", true); store.set("openInterp", true); tab("ceviri"); }
  else if (to === "talk") { App.interp.live = false; store.set("interpLive", false); store.set("openInterp", true); tab("ceviri"); }
  else tab("ogren");
}

