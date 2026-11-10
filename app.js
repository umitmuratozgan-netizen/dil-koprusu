/* Dil Köprüsü — ekranlar ve etkileşim */
"use strict";
/* Öğrenilen dile göre değişen arayüz metinleri ve örnek cümleler (L, LANG: lang.js).
   Cümle biçimi: [hedef dil, Türkçe, okunuş]. Felemenkçe değerler eski sabit metinlerin aynısıdır. */
const AT = LANG === "en" ? {
  lifelines: [["One moment, please.", "Bir saniye lütfen.", "uan MOUmınt, pliiz"], ["Could you repeat that, please?", "Tekrarlar mısınız?", "kud yu riPİİT det, pliiz"], ["Sorry, I'm still learning English.", "Pardon, İngilizce öğreniyorum.", "SOri, aym stil LÖRning İNgliş"]],
  tolk: ["I would like an interpreter, please.", "Tercüman istiyorum, lütfen."], write: "Could you write that down, please?",
  ttsTest: "Good morning, how can I help you?", onbSay: "Good morning! Nice to meet you.",
  phone: [["Could you speak more slowly, please?", "Biraz daha yavaş konuşur musunuz?", "kud yu spiik mor SLOUli, pliiz"], ["Could you repeat that, please?", "Tekrarlar mısınız?", "kud yu riPİİT det, pliiz"], ["Could you spell that, please?", "Harf harf söyler misiniz?", "kud yu spel det, pliiz"], ["Could you send me that by e-mail?", "Bunu bana e-postayla gönderir misiniz?", "kud yu send mi det bay İİmeyl"], ["Can I call you back later?", "Sizi sonra geri arayabilir miyim?", "kın ay kol yu bek LEYtır"]],
  order: "Kelimeler doğru ama sırası farklı. Hatırla: İngilizcede sıra çoğunlukla <b>özne + fiil + nesne</b>:",
  lvlNote: "Resmî seviye belgesi değildir; resmî seviye için IELTS, TOEFL ya da Cambridge gibi bir sınava girilir.",
  askHint: `"a mı the mı?", "bu cümle doğru mu: …", "since ile for farkı?"`, genPh: "ör. Teklif ve ödeme şartları",
  rescue: "yoğun günler olur", jobHead: "💼 Önce iş: ticaret & toplantı", jobSum: "💼 İş cümleleri",
  rpLevels: { "başlangıç": "Başlangıç — kısa, yavaş", orta: "Orta — günlük İngilizce", ileri: "İleri — doğal hız, deyimler" },
  docTypes: { mektup: "📄 İş mektubu / e-posta", teknik: "🧪 Teknik belge (COA, TDS, SDS)", sozlesme: "📑 Sözleşme / sipariş / proforma", lc: "🏦 Akreditif (L/C) taslağı", fatura: "🧾 Fatura", mesaj: "💬 Mesaj", diger: "📎 Diğer" },
  wTo: { sirket: "🏭 Tedarikçi / müşteri firma", sef: "👥 İş arkadaşı / yönetici", resmi: "🏛️ Resmî kurum / banka / konsolosluk", arkadas: "🙂 Arkadaş", evsahibi: "🏨 Otel / ev sahibi" }
} : {
  lifelines: [["Een momentje, alstublieft.", "Bir saniye lütfen.", "een moomentyı, alstüblift"], ["Kunt u dat herhalen?", "Tekrarlar mısınız?", "künt ü dat herhaalın"], ["Sorry, ik leer nog Nederlands.", "Pardon, Felemenkçe öğreniyorum.", "sori, ik leer noh needırlants"]],
  tolk: ["Ik wil graag een tolk, alstublieft.", ""], write: "Kunt u dat opschrijven?",
  ttsTest: "Goeiedag, hebt u een Bonuskaart?", onbSay: "Goeiedag! Welkom in België.",
  phone: [["Kunt u wat trager spreken, alstublieft?", "Biraz daha yavaş konuşur musunuz?", "künt ü vat traahır spreekın, alstüblift"], ["Kunt u dat herhalen?", "Tekrarlar mısınız?", "künt ü dat herhaalın"], ["Kunt u dat spellen?", "Harf harf söyler misiniz?", "künt ü dat spelın"], ["Kunt u mij dat per e-mail sturen?", "Bunu bana e-postayla gönderir misiniz?", "künt ü mey dat per imeyl stüürın"], ["Mag ik u later terugbellen?", "Sizi sonra geri arayabilir miyim?", "mah ik ü laatır tırühbelın"]],
  order: "Kelimeler doğru ama sırası farklı. Hatırla: Felemenkçede çekimli fiil (çoğunlukla) 2. sırada:",
  lvlNote: "Resmî seviye belgesi değildir; resmî seviyeni Huis van het Nederlands belirler.",
  askHint: `"de mi het mi?", "bu cümle doğru mu: …", "want ile omdat farkı?"`, genPh: "ör. Depo ve forklift kelimeleri",
  rescue: "yorgun vardiyalar olur", jobHead: "🛒 Önce iş: kasa & reyon", jobSum: "🛒 Süpermarket cümleleri",
  rpLevels: { "başlangıç": "Başlangıç — kısa, yavaş", orta: "Orta — günlük Belçika Felemenkçesi", ileri: "İleri — doğal hız, Flaman deyimleri" },
  docTypes: { mektup: "Resmî mektup / yazı", bordro: "Maaş bordrosu (loonbrief)", fatura: "Fatura / ödeme isteği", sozlesme: "Sözleşme (kira, iş)", okul: "Okul mesajı (Smartschool)", mesaj: "SMS / WhatsApp / e-posta", diger: "Diğer" },
  wTo: { sef: "Şef / iş yeri", evsahibi: "Ev sahibi", okul: "Okul / öğretmen", resmi: "Resmî kurum / banka", sirket: "İş başvurusu (şirket)", arkadas: "Komşu / arkadaş" }
};
/* İçerik kaynağı: İngilizcede yalnız content-en.js (window.EN) — eksik bir alan Felemenkçe içerikten sızmasın */
const CSRC = LANG === "en" ? (window.EN || {}) : window;
const C = {
  LEVELS: CSRC.LEVELS || [], CATS: CSRC.CATS || [], GRAMMAR: CSRC.GRAMMAR || [],
  LIFELINES: CSRC.LIFELINES || AT.lifelines,
  CHECKLIST: CSRC.CHECKLIST || { note: "", items: [] }, MISSIONS: CSRC.MISSIONS || [], CANDO: CSRC.CANDO || {},
  ROADMAP: CSRC.ROADMAP || "", OKUNUS_KEY: CSRC.OKUNUS_KEY || [], TOPIC_IDEAS: CSRC.TOPIC_IDEAS || []
};
const LV_ORDER = ["A1", "A2", "B1", "B2"];
/* Temel kelime listesi (WORDS) → seviye + tür bazında kelime konuları; dersler gibi günlük plana girer */
(function wordCats() {
  const W = CSRC.WORDS || []; if (!W.length) return;
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
/** {NAAM} → profildeki ad (yoksa dilin varsayılan adı). core.js'te personalize varsa onu kullan. */
const P = x => (typeof personalize === "function" ? personalize(String(x ?? "")) : String(x ?? "").replace(/\{NAAM\}/g, (profile().name || L.defaultName)));
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
const errBox = (e) => `<div class="errbox" role="alert">⚠️ ${esc(e.message || e)}${e.code === "nokey" ? ` <button class="btn sm" data-act="goKey">Anahtarı gir</button>` : ""}${(e.code === "setup" || e.code === "nokey" || e.detail) ? ` <button class="btn sm" data-act="copy" data-text="${esc("Dil Köprüsü hatası: " + (e.message || "") + (e.detail ? " | " + e.detail : ""))}">📋 Hatayı kopyala${L.belgium ? " (ağabeyine gönder)" : ""}</button>` : ""}</div>`;
function saveItem({ nl, tr, ok, src }) {
  if (!nl) return;
  const list = store.get("saved", []);
  if (!list.some(x => x.nl === nl)) { list.unshift({ nl, tr, ok, src, at: Date.now() }); store.set("saved", list.slice(0, 800)); }
  if (!SRS.get(nl)) { const s = SRS.all(); s[nl] = { b: 0, lapses: 0, due: todayStr() }; store.set("srs", s); }
  toast("Kartlarına eklendi ➕"); haptic(10);
}
/* İngilizce dikte/söyleme eşleşmesi (v8.1): duyulanı hedefin yazımına yaklaştır, sonra core'daki wordMatch.
   - sayılarda "and" farkı: "three hundred and twenty" = "three hundred twenty"
   - rakam ↔ sayı kelimesi: "320" = "three hundred (and) twenty"
   - İngiliz/Amerikan yazımı: cancelled/canceled, colour/color, centre/center, organise/organize… */
const EN_NUM1 = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
const EN_NUM10 = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
function enNumWords(n) {
  if (!(n >= 0) || n > 999999999) return null;
  const b100 = x => x < 20 ? EN_NUM1[x] : EN_NUM10[Math.floor(x / 10)] + (x % 10 ? " " + EN_NUM1[x % 10] : "");
  const b1000 = x => (x >= 100 ? EN_NUM1[Math.floor(x / 100)] + " hundred" + (x % 100 ? " " + b100(x % 100) : "") : b100(x));
  if (n < 1000) return b1000(n);
  const parts = []; const m = Math.floor(n / 1e6), th = Math.floor(n / 1000) % 1000, r = n % 1000;
  if (m) parts.push(b1000(m) + " million"); if (th) parts.push(b1000(th) + " thousand"); if (r) parts.push(b1000(r));
  return parts.join(" ");
}
const enCanon = w => String(w).toLowerCase()
  .replace(/ell(ed|ing|er|ers)$/, "el$1")              // cancelled → canceled, travelling → traveling
  .replace(/(\w{2,})our(s|ed|ing|ite|ites)?$/, "$1or$2") // colour → color, favourite → favorite (four/hour/your değil)
  .replace(/is(e|es|ed|ing|ation|ations)$/, "iz$1")    // organise → organize, organisation → organization
  .replace(/ys(e|es|ed|ing)$/, "yz$1")                 // analyse → analyze
  .replace(/([^aeiou])re(s)?$/, "$1er$2")              // centre → center, litre → liter, metre → meter
  .replace(/ogue(s)?$/, "og$1")                        // catalogue → catalog
  .replace(/ence$/, "ense")                            // licence → license, defence → defense
  .replace(/^grey$/, "gray")
  .replace(/^tonne(s)?$/, "ton$1");                    // tonnes → tons (metrik ton; ASR İngiliz yazımı)
function enHeardFix(target, heard) {
  const NUMW = /^(zero|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|hundred|thousand|million)$/;
  const tw = normWords(target);
  const tHasWords = tw.some(w => NUMW.test(w)), tHasDigits = tw.some(w => /^\d+$/.test(w));
  let h = String(heard ?? "");
  // rakam ↔ kelime: hedef kelimeyle yazılmışsa duyulan rakamları kelimeye çevir
  if (tHasWords && !tHasDigits) h = h.replace(/\d[\d,]*/g, m => { const n = +m.replace(/,/g, ""); return enNumWords(n) || m; });
  let hw = normWords(h);
  // hedef rakamla yazılmışsa duyulan sayı kelimelerini rakama çevir
  if (tHasDigits && !tHasWords) {
    const out = []; let i = 0;
    while (i < hw.length) {
      if (!NUMW.test(hw[i])) { out.push(hw[i++]); continue; }
      let total = 0, cur = 0, j = i;
      for (; j < hw.length; j++) {
        const w = hw[j];
        if (w === "and" && j + 1 < hw.length && NUMW.test(hw[j + 1]) && j > i) continue;
        if (!NUMW.test(w)) break;
        const k = EN_NUM1.indexOf(w), d = EN_NUM10.indexOf(w);
        if (k >= 0) cur += k; else if (d >= 2) cur += d * 10;
        else if (w === "hundred") cur = (cur || 1) * 100;
        else { total += (cur || 1) * (w === "thousand" ? 1000 : 1e6); cur = 0; }
      }
      out.push(String(total + cur)); i = j;
    }
    hw = out;
  }
  const tSet = new Set(tw);
  // sayılar arasındaki "and": hedefte yoksa duyulandan at; hedefte varsa duyulana ekle
  const tAnd = tw.some((w, i) => w === "and" && /^(hundred|thousand|million)$/.test(tw[i - 1] || "") && NUMW.test(tw[i + 1] || ""));
  const fixed = [];
  hw.forEach((w, i) => {
    const prevBig = /^(hundred|thousand|million)$/.test(hw[i - 1] || ""), nextNum = NUMW.test(hw[i + 1] || "");
    if (w === "and" && prevBig && nextNum && !tAnd) return;
    fixed.push(w);
    if (tAnd && /^(hundred|thousand|million)$/.test(w) && NUMW.test(hw[i + 1] || "") && hw[i + 1] !== "and") fixed.push("and");
  });
  // İngiliz/Amerikan yazımı: duyulan kelimeyi hedefteki yazıma çevir
  const byCanon = new Map(); tw.forEach(w => byCanon.set(enCanon(w), w));
  return fixed.map(w => tSet.has(w) ? w : (byCanon.get(enCanon(w)) || w)).join(" ");
}
/** Dikte/söyleme eşleşmesi: en'de önce yazım/sayı farklarını tolere et; nl'de core'daki wordMatch aynen */
const wm = (target, heard) => wordMatch(target, LANG === "en" ? enHeardFix(target, heard) : heard);
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
  try { Turn.tok++; Spec.cancel(); if (Face.open) faceClose(true); } catch { } // v9: oto sıra zinciri sekme değişince sürmesin
  document.body.classList.remove("study");
  App.view = v; store.set("tab", v);
  $$("nav.tabs button").forEach(b => b.dataset.v === v ? b.setAttribute("aria-current", "page") : b.removeAttribute("aria-current"));
  $$("section.view").forEach(s => s.classList.toggle("on", s.id === "v-" + v));
  document.body.classList.toggle("interp", v === "ceviri");
  if (v === "ceviri") { Wake.on(); try { warmup(); } catch { } } else Wake.off(); // v9: ilk çeviri beklemesin
  ({ ogren: renderLearn, pratik: renderPractice, ceviri: renderInterp, yardim: renderHelp, ben: renderBen })[v]();
  window.scrollTo(0, 0);
}

/* ---------------- Tek tıklama yöneticisi ---------------- */
const ACT = {};
/** v9: bir düğmenin hatası uygulamayı kilitlemesin — kayda geç, kısa bildirim göster */
function actFail(err, name) { try { if (typeof ErrLog !== "undefined" && ErrLog.add(err, "act:" + name)) toast("Bu işlem tamamlanamadı — tekrar dene"); } catch { } }
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]"); if (!el) return;
  const name = el.dataset.act, fn = ACT[name]; if (!fn) return;
  e.preventDefault();
  try { const r = fn(el, e); if (r && typeof r.catch === "function") r.catch(err => actFail(err, name)); }
  catch (err) { actFail(err, name); }
});
ACT.tab = el => tab(el.dataset.v);
ACT.say = el => TTS.speak(el.dataset.say);
ACT.slow = el => TTS.speak(el.dataset.say, { slow: true });
ACT.add = el => { saveItem(el.dataset); el.textContent = "✅"; };
ACT.show = el => openShow(el.dataset.nl, el.dataset.tr, LANG === "en" ? el.dataset.ok : undefined); // nl: 2 parametre (ekran aynı)
ACT.goKey = () => { App.benFocusKey = true; App.benOpenSetup = true; tab("ben"); };
ACT.cancelReq = el => { abortFeature(el.dataset.f); };

/* ---------------- Karşıdakine göster (büyük ekran) ---------------- */
/** C4: openShow(nl, tr, ok) — ok (okunuş) isteğe bağlı; verilirse büyük gösterilir.
    İngilizcede [köşeli parantezler] silinmez: kullanıcı neyi dolduracağını görsün (sesli okumada atlanır). */
function openShow(nl, tr, ok) {
  const o = $("#showOverlay"); const n = $("#showNL");
  n.textContent = LANG === "en" ? String(nl || "") : String(nl || "").replace(/[\[\]]/g, "");
  $("#showTR").textContent = tr || ""; $("#showTR").classList.add("hidden");
  const okEl = $("#showOK"); const hasOk = !!(ok && String(ok).trim());
  if (okEl) { okEl.textContent = hasOk ? String(ok) : ""; okEl.classList.toggle("hidden", !hasOk); }
  o.classList.add("on");
  let size = 64; n.style.fontSize = size + "px";
  const room = hasOk ? 0.42 : 0.55;
  while (size > 22 && (n.scrollHeight > window.innerHeight * room || n.scrollWidth > n.clientWidth + 2)) { size -= 3; n.style.fontSize = size + "px"; }
  Wake.on(); TTS.speak(n.textContent.replace(/[\[\]]/g, ""));
  $("[data-act=showClose]", o).focus();
  if (!o.dataset.back) { o.dataset.back = "1"; Back.push(() => closeShow(true)); }
}
function closeShow(fromBack) {
  const o = $("#showOverlay"); if (!o.classList.contains("on")) return;
  o.classList.remove("on"); TTS.stop(); if (App.view !== "ceviri") Wake.off();
  if (o.dataset.back) { delete o.dataset.back; if (!fromBack) Back.drop(); }
}
ACT.showSpeak = () => TTS.speak($("#showNL").textContent.replace(/[\[\]]/g, ""));
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
/** Üretme kartı (Türkçe → hedef dil) bu cümleye uygun mu? en: ≤8 kelime ve liste değil (2+ virgül yok). nl: hep. */
function prodOk(nl) {
  if (LANG !== "en") return true;
  const t = String(nl || "");
  return t.split(/\s+/).filter(Boolean).length <= 8 && (t.match(/,/g) || []).length < 2;
}
function dailyPlan() {
  const s = SRS.all(), idx = itemIndex(), today = todayStr();
  const EN = LANG === "en";
  let flip = 0;
  const due0 = Object.entries(s).filter(([k, r]) => r.due && r.due <= today && !k.endsWith("|s")).sort((a, b) => a[1].due < b[1].due ? -1 : 1)
    .map(([k, r]) => {
      const p = k.endsWith("|p"); const it = idx.get(p ? k.slice(0, -2) : k); if (!it) return null;
      if (p) return prodOk(it.nl) ? { type: "prod", item: it } : null; // en: uzun/liste cümlede üretme kartı yok
      // iyi bilinen kartlarda çeşitlilik: bir kart görerek, bir kart sadece dinleyerek
      if ((r.b || 0) >= 2 && (flip++ % 2 === 1)) return { type: "listen", item: it };
      return { type: "flash", item: it };
    })
    .filter(Boolean);
  const perDay = { 5: 5, 10: 8, 20: 12 }[profile().goal] || 8;
  const nt = store.get("newToday", {}); const already = nt.d === today ? nt.n : 0;
  let due, brake;
  if (EN) {
    // en (v8.3): tekrar tavanı hedefe göre (5 dk → 12, 10 dk → 20, 20 dk → 30), üretme kartı ≤ tavan/3; fren yalnız TANIMA kartlarını sayar
    // (üretme kartları yeni kartı kesmesin — yoksa 30 günde ~60 yeni kartta kalıyordu)
    const cap = { 5: 12, 10: 20, 20: 30 }[profile().goal] || 20, prodCap = Math.floor(cap / 3);
    let np = 0; due = due0.filter(d => d.type !== "prod" || np++ < prodCap).slice(0, cap);
    const recDue = due.filter(d => d.type !== "prod").length;
    brake = recDue > 25 ? 0 : recDue > Math.round(cap * 0.75) ? Math.min(3, perDay) : perDay;
    // ısınma: oturum önce tanıma kartlarıyla başlar, üretme (TR → EN) kartları sonra
    due = [...due.filter(d => d.type !== "prod"), ...due.filter(d => d.type === "prod")];
  } else {
    due = due0.slice(0, 30);
    // çok tekrar birikmişse yeni kart verme: önce eskiler
    brake = due.length > 25 ? 0 : due.length > 15 ? Math.min(3, perDay) : perDay;
  }
  const want = Math.max(0, brake - already);
  const unseen = list => list.filter(i => !s[i.nl]);
  const lvlNow = LV_ORDER.indexOf(profile().level || "A1");
  // en (C5): iş şeridine yalnız seviyene uygun iş konuları (A1'de yalnız ahLvl A1; üstünde ahLvl ≤ seviye+1); A1'de yalnız ≤6 kelimelik iş cümleleri
  const jobCatsPlan = C.CATS.filter(c => c.lvl === "AH" && (!EN || (lvlNow <= 0 ? (c.ahLvl || "B1") === "A1" : LV_ORDER.indexOf(c.ahLvl || "B1") <= lvlNow + 1)));
  let job = unseen(jobCatsPlan.flatMap(catItems));
  if (EN && lvlNow <= 0) {
    job = job.filter(i => i.nl.split(/\s+/).length <= 6);
    // v8.3: A1 iş havuzu (~29 cümle) bitince A2 iş konularının ≤6 kelimelik cümleleri — iş şeridi kurumasın
    if (!job.length) job = unseen(C.CATS.filter(c => c.lvl === "AH" && c.ahLvl === "A2").flatMap(catItems)).filter(i => i.nl.split(/\s+/).length <= 6);
  }
  let track = unseen([...LV_ORDER.flatMap(l => C.CATS.filter(c => c.lvl === l && !c.words).flatMap(catItems)), ...aiCats().flatMap(catItems)]);
  const wordLane = unseen(C.CATS.filter(c => c.words && LV_ORDER.indexOf(c.lvl) <= lvlNow + 1).flatMap(catItems)); // kelime şeridi: günde en fazla 3
  // en (C6): ilk 3 gün yalnız temel A1 sırası; ilk üç konudan (selamlaşma → tanışma → anlamadım) dönüşümlü
  // startDay ilk ÇALIŞILAN kartta yazılır (nextTask); yoksa bugün 0. gündür
  let basicsFirst = false;
  if (EN) {
    const sd = store.get("startDay", "");
    basicsFirst = !sd || Math.round((new Date(today) - new Date(sd)) / 86400000) < 3;
    if (basicsFirst) {
      const first3 = C.CATS.filter(c => c.lvl === "A1" && !c.words).slice(0, 3).map(c => { const all = catItems(c), u = unseen(all); return { u, seen: all.length - u.length }; })
        .sort((x, y) => x.seen - y.seen).map(x => x.u); // en az görülen konu öne: üç konu da her gün ilerlesin
      const rr = []; for (let i = 0; first3.some(l => i < l.length); i++) first3.forEach(l => { if (i < l.length) rr.push(l[i]); });
      const inRR = new Set(rr.map(i => i.nl));
      track = [...rr, ...track.filter(i => !inRR.has(i.nl))];
    }
  }
  const jobEvery = EN && lvlNow <= 0 ? 3 : 2; // A1: 2 temel : 1 iş; üstü: 1 : 1
  const fresh = []; let a = 0, b = 0, w = 0;
  const wantWords = basicsFirst ? 0 : Math.min(EN && lvlNow <= 0 ? 1 : 3, Math.floor(want / 3)); /* en A1: günde 1 kelime — önce A1 cümleleri bitsin */ while (w < wantWords && w < wordLane.length) fresh.push(wordLane[w++]);
  if (EN) {
    let k = 0;
    while (fresh.length < want && (b < track.length || (!basicsFirst && a < job.length))) {
      k++;
      const jobTurn = !basicsFirst && a < job.length && (k % jobEvery === 0 || b >= track.length);
      if (jobTurn) fresh.push(job[a++]); else if (b < track.length) fresh.push(track[b++]);
    }
    // temeller bitince her gün en az 1 iş cümlesi (fren 3'e düşse bile)
    if (!basicsFirst && want > 0 && !a && job.length) { if (fresh.length > w) fresh[fresh.length - 1] = job[a++]; else fresh.push(job[a++]); }
  } else while (fresh.length < want && (a < job.length || b < track.length)) {
    if (b < track.length) fresh.push(track[b++]); // temeller
    if (fresh.length < want && a < job.length) fresh.push(job[a++]); // iş cümleleri
  }
  // günde bir dilbilgisi mini alıştırması (seviyendeki dersler sırayla)
  let gram = null;
  const lvl = profile().level || "A1";
  const hasEx = g => (g.ex || []).some(x => x[0].split(/\s+/).length >= 3);
  let gl = C.GRAMMAR.filter(g => g.lvl === lvl && hasEx(g));
  if (EN) { // en (v8.3): 3 günde bir sıradaki okunmamış ders ("📐 Bugünün dersi"); arada diziliş — yalnız SRS'de görülmüş cümlelerden
    gl = [];
    if (store.get("gramDay", "") !== today) {
      const seenG = store.get("gramSeen", []);
      const nextG = C.GRAMMAR.find(x => x.lvl === lvl && !seenG.includes(x.id));
      const lastRead = store.get("gramReadDay", ""), sd = store.get("startDay", "");
      const since = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
      const readDue = lastRead ? since(lastRead, today) >= 3 : since(sd || today, today) % 3 === 0;
      if (nextG && readDue) gram = { type: "gramRead", item: { nl: nextG.t, tr: "", ok: "", src: nextG.id }, gram: nextG.t, gid: nextG.id, noSrs: true };
      else {
        const inDue = new Set(due.map(d => d.item.nl));
        const pool = [...idx.values()].filter(i => s[i.nl] && !inDue.has(i.nl) && i.nl.split(/\s+/).length >= 3 && i.nl.split(/\s+/).length <= 8 && (i.nl.match(/,/g) || []).length < 2);
        if (pool.length) { const x = pool[Math.floor(Math.random() * pool.length)]; gram = { type: "order", item: x, gram: "diziliş", noSrs: true }; }
      }
    }
  }
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
  const isShop = !L.belgium || /süpermarket|albert|market|kasa|winkel/i.test(p.job || ""); // İngilizcede iş cümleleri hep önde
  const levelNode = (l, openAs) => {
    const L = C.LEVELS.find(x => x.id === l); const cats = C.CATS.filter(c => c.lvl === l);
    const pct = learnedPct(cats.flatMap(catItems));
    const cur = l === (p.level || "A1"); const done = pct >= 80;
    const gr = C.GRAMMAR.filter(g => g.lvl === l);
    const cando = (C.CANDO[l] || []).map(x => typeof x === "string" ? { t: x } : x);
    const ticks = store.get("cando", {});
    return `<div class="node ${done ? "done" : cur ? "cur" : ""}"><details class="card" ${(openAs != null ? openAs : cur) ? "open" : ""}${LANG === "en" ? ` data-lv="${l}"` : ""}>
      <summary><span class="tag br">${l}</span> ${esc(L.n)} <span class="small muted">· %${pct}</span></summary>
      <div class="small muted" style="margin:6px 0 10px">${esc(L.d || "")}</div>
      <div class="grid2">${cats.map(tile).join("")}</div>
      ${gr.length ? `<h3 style="margin-top:14px">📐 Dilbilgisi</h3>${gr.map(g => `<div class="phrase" style="align-items:center"><div class="t"><b style="font-size:.98rem">${esc(g.t)}</b></div><button class="btn sm" data-act="openGram" data-id="${esc(g.id)}">Aç</button></div>`).join("")}` : ""}
      ${cando.length ? `<details style="margin-top:10px"><summary class="small">✅ Neler yapabiliyorum? (${cando.filter((x, i) => ticks[l + i]).length}/${cando.length})</summary>
        ${cando.map((x, i) => `<label class="chk"><input type="checkbox" data-cando="${l + i}" ${ticks[l + i] ? "checked" : ""}><span class="small">${esc(x.t)}</span></label>`).join("")}</details>` : ""}
      <button class="btn sm block" style="margin-top:10px" data-act="checkpoint" data-l="${l}">🎯 ${l} pratik kontrolü (10 soru)${store.get("cpBest", {})[l] != null ? ` · en iyi %${store.get("cpBest", {})[l]}` : ""}</button>
      ${l === (p.level || "A1") && cando.length && cando.every((x, i) => ticks[l + i]) && (store.get("cpBest", {})[l] || 0) >= 80 && LV_ORDER[LV_ORDER.indexOf(l) + 1] ? `<button class="btn primary sm block" style="margin-top:8px" data-act="levelUp" data-l="${LV_ORDER[LV_ORDER.indexOf(l) + 1]}">⬆️ ${LV_ORDER[LV_ORDER.indexOf(l) + 1]} seviyesine geç</button>` : ""}
      <div class="small muted" style="margin-top:4px">${AT.lvlNote}</div>
    </details></div>`;
  };
  const lvIds = LV_ORDER.filter(l => C.LEVELS.some(x => x.id === l));
  const levelBlocks = lvIds.map(l => levelNode(l)).join("");
  const jobCats = C.CATS.filter(c => c.lvl === "AH");
  const mine = aiCats();
  const rescueHtml = `${rescue ? `<div class="card" style="border-color:var(--brand)"><b>👋 Tekrar hoş geldin!</b><div class="small">${missed} gündür yoktun, sorun değil — ${AT.rescue}. 2 dakikalık dönüş: sadece 5 kart.</div>
      <button class="btn primary sm" style="margin-top:8px" data-act="quick5">▶ 2 dakika, 5 kart</button></div>` : ""}`;
  if (LANG === "en") return renderLearnHomeEN({ p, t, plan, planned, goal, rescueHtml, levelNode, lvIds, jobCats, mine });
  $("#v-ogren").innerHTML = `${installCard()}
    ${rescueHtml}
    ${qaGrid()}
    <div class="card"><div class="hero">${ring(t.cards, goal)}
      <div class="grow"><h2 style="margin:0">Bugünün dersi</h2>
        <div class="small muted">${planned ? `${plan.due.length} tekrar · ${plan.fresh.length} yeni cümle${plan.gram ? " · 1 dilbilgisi" : ""}` : "Planlanan her şey bitti"}</div>
        <div class="small" style="margin-top:2px">${t.cards >= 5 ? "🔥 Seri bugün korundu" : `Seri için ${5 - t.cards} kart daha`}</div>
        ${planned ? `<button class="btn primary" style="margin-top:8px" data-act="daily">▶ ${t.cards ? "Devam et" : "Başla"}</button>`
          : `<button class="btn" style="margin-top:8px" data-act="extra">➕ Ekstra tur (bildiklerini pekiştir)</button>`}
      </div></div></div>
    ${EXT.learnCards.map(f => { try { return f() || ""; } catch { return ""; } }).join("")}
    ${isShop && jobCats.length ? `<h2>${AT.jobHead}</h2><div class="grid2" style="margin-bottom:14px">${jobCats.map(tile).join("")}</div>` : ""}
    <h2>🧭 Seviye yolu</h2>
    <div class="path">${levelBlocks}</div>
    ${!isShop && jobCats.length ? `<details class="card"><summary>${AT.jobSum}</summary><div class="grid2" style="margin-top:10px">${jobCats.map(tile).join("")}</div></details>` : ""}
    ${moreBoxHtml(p, mine)}`;
  const mb = $("#moreBox"); if (mb) mb.addEventListener("toggle", () => { App.learn.moreOpen = mb.open; });
  $$("[data-cando]").forEach(c => c.onchange = () => { const t2 = store.get("cando", {}); t2[c.dataset.cando] = c.checked; store.set("cando", t2); if (c.checked) haptic(10); });
}
/** Öğretmene sor + istediğin konuda ders + okunuş anahtarı (katlanır kutu) */
function moreBoxHtml(p, mine) {
  return `<details class="card" ${App.learn.moreOpen ? "open" : ""} id="moreBox"><summary>✨ Öğretmen, istediğin konuda ders, okunuş anahtarı</summary>
    <div style="margin-top:10px">
      <h3 style="margin:0 0 6px">❓ Öğretmene sor</h3>
      <p class="small muted" style="margin:0 0 8px">${AT.askHint}</p>
      <textarea id="askIn" placeholder="Sorunu Türkçe yaz…" style="min-height:56px"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn primary sm" data-act="ask">Sor</button><button class="btn sm" data-act="askMic">🎤 Söyle</button></div>
      <div id="askOut" aria-live="polite"></div>
    </div>
    <div style="margin-top:16px">
      <h3 style="margin:0 0 6px">✨ İstediğin konuda ders</h3>
      <input type="text" id="genTopic" placeholder="${AT.genPh}">
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
}
/** İngilizce Öğren ana ekranı (v8.1): üstte iki büyük düğme, sonra yalnız şu anki seviye; gerisi tek katlanır "Tüm konular" alanında */
function renderLearnHomeEN({ p, t, plan, planned, goal, rescueHtml, levelNode, lvIds, jobCats, mine }) {
  const cur = lvIds.includes(p.level || "A1") ? (p.level || "A1") : lvIds[0];
  const others = lvIds.filter(l => l !== cur);
  const allOpen = !!store.get("allOpen", false);
  const extCards = EXT.learnCards.map(f => { try { return f() || ""; } catch { return ""; } }).join("");
  // v8.3: A1 temel cümlelerin %80'i görülünce bir kez "A2'ye geçmek ister misin?" (cevap verilince bir daha sorulmaz)
  let a2Html = "";
  if ((p.level || "A1") === "A1" && !store.get("a2Asked", false)) {
    const a1 = C.CATS.filter(c => c.lvl === "A1" && !c.words).flatMap(catItems);
    const seenN = a1.filter(i => SRS.get(i.nl)).length;
    if (a1.length && seenN / a1.length >= 0.8) a2Html = `<div class="card" style="border-color:var(--brand)"><b>🎉 A1 temel cümlelerin %${Math.round(100 * seenN / a1.length)}'ini gördün.</b>
      <div class="small" style="margin-top:4px">A2'ye geçmek ister misin? Günlük derste daha uzun iş cümleleri ve seyahat konuları gelir; A1 tekrarların sürer.</div>
      <div class="row" style="gap:8px;margin-top:8px"><button class="btn primary sm grow" data-act="a2Offer" data-v="yes">⬆️ Evet, A2'ye geç</button><button class="btn sm grow" data-act="a2Offer" data-v="no">Şimdilik A1</button></div></div>`;
  }
  $("#v-ogren").innerHTML = `${installCard()}
    ${rescueHtml}
    ${qaGrid()}
    <div class="card"><div class="hero">${ring(t.cards, goal)}
      <div class="grow"><h2 style="margin:0">Bugünün dersi</h2>
        <div class="small muted">${planned ? `${plan.due.length} tekrar · ${plan.fresh.length} yeni cümle${plan.gram ? " · 1 dilbilgisi" : ""}` : "Planlanan her şey bitti"}</div>
        <div class="small" style="margin-top:2px">${t.cards >= 5 ? "🔥 Seri bugün korundu" : `Seri için ${5 - t.cards} kart daha`}</div>
      </div></div>
      ${planned ? `<button class="btn primary bigstart" style="margin-top:10px" data-act="daily">▶ ${t.cards ? "Devam et" : "Bugünün dersi"} (${+p.goal || 10} dk)</button>`
        : `<button class="btn bigstart" style="margin-top:10px" data-act="extra">➕ Ekstra tur (bildiklerini pekiştir)</button>`}
      <button class="btn bigstart" style="margin-top:8px" data-act="goLive">🎧 Canlı altyazı</button>
      <div class="small muted" style="margin-top:4px;text-align:center">Toplantıda konuşulan İngilizceyi Türkçe altyazı gibi oku</div>
    </div>
    ${a2Html}
    ${cur ? `<h2>🧭 Seviye yolu</h2><div class="path">${levelNode(cur, !!App.learn.lvOpen)}</div>` : ""}
    <details class="card" id="allBox" ${allOpen ? "open" : ""}><summary><b>📚 Tüm konular</b> <span class="small muted">— kulak eğitimi, iş cümleleri, diğer seviyeler, öğretmen</span></summary>
      <div style="margin-top:10px">
        ${extCards}
        ${jobCats.length ? `<h2>${AT.jobHead}</h2><div class="grid2" style="margin-bottom:14px">${jobCats.map(tile).join("")}</div>` : ""}
        ${others.length ? `<h2>🧭 Diğer seviyeler</h2><div class="path">${others.map(l => levelNode(l, false)).join("")}</div>` : ""}
        ${moreBoxHtml(p, mine)}
      </div></details>`;
  const lv = $(`#v-ogren details[data-lv="${cur}"]`); if (lv && cur) lv.addEventListener("toggle", () => { App.learn.lvOpen = lv.open; });
  const ab = $("#allBox"); if (ab) ab.addEventListener("toggle", () => store.set("allOpen", ab.open));
  const mb = $("#moreBox"); if (mb) mb.addEventListener("toggle", () => { App.learn.moreOpen = mb.open; });
  $$("[data-cando]").forEach(c => c.onchange = () => { const t2 = store.get("cando", {}); t2[c.dataset.cando] = c.checked; store.set("cando", t2); if (c.checked) haptic(10); });
}
/** "🎧 Canlı altyazı" kısayolu: tercümanı canlı altyazı modunda aç */
ACT.goLive = () => { App.interp.live = true; store.set("interpLive", true); tab("ceviri"); };
ACT.a2Offer = el => { store.set("a2Asked", true); if (el.dataset.v === "yes") ACT.levelUp({ dataset: { l: "A2" } }); else { toast("Tamam — A1'de devam. Ben sekmesinden istediğin zaman değiştirebilirsin."); renderLearn(); } };
ACT.levelUp = el => { const p = profile(); p.level = el.dataset.l; store.set("profile", p); toast(`⬆️ Seviye: ${el.dataset.l} — tebrikler!`); Progress.addXP(10); renderLearn(); };
ACT.quick5 = () => {
  const { due, fresh } = dailyPlan();
  const tasks = (LANG === "en" ? planTasks({ due, fresh, gram: null }) : [...due, ...fresh.map(it => ({ type: "flash", item: it, isNew: true }))]).slice(0, 5);
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
    <div class="small muted">${c.items.length} ${LANG === "en" && c.words ? "kelime" : "cümle"}</div><div class="bar"><i style="width:${learnedPct(catItems(c))}%"></i></div></button>`;
}
ACT.openCat = el => { App.learn = { mode: "cat", id: el.dataset.id }; if (App.view !== "ogren") tab("ogren"); else renderLearn(); window.scrollTo(0, 0); Back.push(() => { App.learn = { mode: "home" }; renderLearn(); }); };
ACT.openGram = el => { App.learn = { mode: "gram", id: el.dataset.id }; renderLearn(); window.scrollTo(0, 0); Back.push(() => { App.learn = { mode: "home" }; renderLearn(); }); };
ACT.learnHome = () => { Back.drop(); App.learn = { mode: "home" }; renderLearn(); window.scrollTo(0, 0); };
ACT.topic = el => { $("#genTopic").value = el.dataset.t; };
/** Günlük planı kart sırasına çevir. nl: önce tekrarlar sonra yeniler (eskisi gibi).
    en (v8.2): yeni kartlar sona yığılmaz, her 3 tekrarda bir serpiştirilir (oturum yarıda kalsa da yeni gelir). */
function planTasks({ due, fresh, gram }) {
  const nw = fresh.map(it => ({ type: "flash", item: it, isNew: true }));
  let tasks;
  if (LANG === "en") { tasks = []; let j = 0; due.forEach((d, i) => { tasks.push(d); if ((i + 1) % 3 === 0 && j < nw.length) tasks.push(nw[j++]); }); tasks.push(...nw.slice(j)); }
  else tasks = [...due, ...nw];
  if (gram) tasks.splice(Math.min(tasks.length, 4), 0, gram);
  return tasks;
}
ACT.daily = () => {
  const tasks = planTasks(dailyPlan());
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
  if (LANG === "en") { const gs = store.get("gramSeen", []); if (!gs.includes(g.id)) store.set("gramSeen", [...gs, g.id].slice(-100)); } // günlük mini alıştırma yalnız okunan derslerden
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
  return `<div class="row" style="margin-bottom:12px"><button class="btn sm ghost" data-act="studyExit" aria-label="Çık"${LANG === "en" ? ' style="min-width:48px"' : ""}>✕</button>
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
    if (LANG === "en" && !store.get("startDay", "")) store.set("startDay", todayStr()); // en: ilk çalışılan kart = 1. gün (C6)
    // tanıma kartı iyi öğrenildiyse üretme kartını (TR→NL) başlat — en: kutu ≥3'te (üretme kartı seli olmasın)
    if (t.type !== "prod" && r.b >= (LANG === "en" ? 3 : 2) && !SRS.get(t.item.nl + "|p") && prodOk(t.item.nl)) { const all = SRS.all(); all[t.item.nl + "|p"] = { b: 0, lapses: 0, due: addDays(1) }; store.set("srs", all); }
    if (grade === 0 && !s.retried.has(key) && !s.checkpoint && (LANG !== "en" || s.tasks.length < 35)) { s.retried.add(key); s.tasks.splice(Math.min(s.i + 4, s.tasks.length), 0, { ...t, isNew: false }); }
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
  const R = { flash: stFlash, prod: stProd, quiz: stQuiz, listen: stQuiz, dict: stDict, order: stOrder, speak: stSpeak, gramRead: stGramRead }[t.type] || EXT.studyTypes[t.type] || stFlash;
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
      <div class="face"><span class="tag nl">${L.flag} ${t.isNew ? "YENİ" : "HATIRLA"}</span><div class="big-nl">${esc(it.nl)}</div>${okLine(it)}<button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button></div>
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
/** en (v8.2): hiç dilbilgisi dersi okunmadıysa günlük plandaki "📐 Bugünün dersi" kartı — dersi oturumun içinde açar */
function stGramRead(t) {
  const g = C.GRAMMAR.find(x => x.id === t.gid); if (!g) return nextTask(null);
  const safeBody = esc(g.body).replace(/&lt;(\/?)(b|i|br)\s*\/?&gt;/g, "<$1$2>");
  $("#v-ogren").innerHTML = studyShell(`<div class="card">
      <span class="tag br">📐 Bugünün dersi · ${esc(g.lvl)}</span>
      <h2 style="margin:8px 0 4px">${esc(g.t)}</h2>
      <details id="grBody"><summary>📖 Oku (1–2 dk)</summary><div style="line-height:1.6;margin-top:8px">${safeBody}</div>
        ${(g.ex || []).slice(0, 4).map(x => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(P(x[0]))}" aria-label="Sesli oku">🔊</button><div class="t"><b>${esc(P(x[0]))}</b><div class="okn small">${esc(P(x[2] || ""))}</div><div class="small">🇹🇷 ${esc(P(x[1]))}</div></div></div>`).join("")}</details>
    </div>
    <div id="fcBtns"><button class="btn primary block" data-act="gramReadDone">Okudum, devam →</button></div>`);
  const d = $("#grBody"); if (d) d.open = true;
}
ACT.gramReadDone = () => {
  const s = App.learn.s, t = s && s.tasks[s.i]; if (!t || t.type !== "gramRead") return;
  const gs = store.get("gramSeen", []); if (!gs.includes(t.gid)) store.set("gramSeen", [...gs, t.gid].slice(-100));
  store.set("gramDay", todayStr()); store.set("gramReadDay", todayStr()); // v8.3: sıradaki ders 3 gün sonra
  nextTask(2);
};
function stProd(t) {
  const it = t.item;
  $("#v-ogren").innerHTML = studyShell(`
    <div class="flash" id="fc"><div class="inner">
      <div class="face"><span class="tag tr">🇹🇷 → ${L.flag} ${L.ad.toLocaleUpperCase("tr-TR")}Sİ?</span><div class="big-tr">${esc(it.tr)}</div>
        <div class="small muted">Önce kendin söyle, sonra çevir.</div><button class="btn sm" data-act="prodMic">🎤 Söyle</button><div id="prodRes" class="small" aria-live="polite"></div></div>
      <div class="face back"><span class="tag nl">${L.flag} DOĞRUSU</span><div class="big-nl">${esc(it.nl)}</div>${okLine(it, true)}<button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button></div>
    </div></div>
    <div id="fcBtns"><button class="btn primary block" data-act="flip">Doğrusunu göster</button></div>`);
}
ACT.prodMic = el => {
  const it = App.learn.s.tasks[App.learn.s.i].item;
  if (Speech.cur && Speech.cur.owner === "prod") { Speech.cur.stop(); return; }
  el.textContent = "⏹ Bitti";
  Speech.listen({ lang: store.get("srLang", L.sr), owner: "prod",
    onText: x => { $("#prodRes").textContent = x; },
    onDone: x => { el.textContent = "🎤 Tekrar"; if (!x) return; const { pct, orderOk } = wm(it.nl, x); $("#prodRes").innerHTML = `Telefon anladı: “${esc(x)}” — <b>${pct}%</b> eşleşti${orderOk === false ? " · 🧩 sıra farklı" : ""}`; },
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
  const q = dir === "tr2nl" ? `<span class="tag tr">🇹🇷</span><div class="big-tr">${esc(it.tr)}</div><div class="muted small">${L.ad}si hangisi?</div>`
    : dir === "listen" ? `<div class="muted">Dinle ve anlamını seç</div><div class="row" style="justify-content:center"><button class="btn primary" data-act="say" data-say="${esc(it.nl)}">🔊 Dinle</button><button class="btn" data-act="slow" data-say="${esc(it.nl)}">🐢 Yavaş</button></div>`
    : `<span class="tag nl">${L.flag}</span><div class="big-nl">${esc(it.nl)}</div><button class="ibtn" data-act="say" data-say="${esc(it.nl)}" aria-label="Sesli oku">🔊</button><div class="muted small">Türkçesi hangisi?</div>`;
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
      <div class="muted">Dinle ve ${L.ad} yaz</div>
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
  const { pct, marks, orderOk } = wm(it.nl, v);
  const g = pct >= 90 ? 2 : pct >= 60 ? 1 : 0;
  haptic(g === 2 ? 15 : [20, 40, 20]);
  $("#dictRes").innerHTML = `<div class="score" style="font-size:1.8rem">${pct}%</div>
    <div>${marks.map(m => `<span class="${m.ok ? "w-ok" : "w-bad"}">${esc(m.w)}</span>`).join(" ")}</div>
    <div class="mid-nl" style="margin-top:6px">${esc(it.nl)}</div><div class="small">🇹🇷 ${esc(it.tr)}</div>
    ${orderOk === false ? `<div class="note">🧩 ${AT.order} <b>${esc(it.nl)}</b></div>` : ""}
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
  Speech.listen({ lang: store.get("srLang", L.sr), owner: "speak",
    onText: x => { $("#spRes").innerHTML = `<span class="muted">${esc(x)}</span>`; },
    onDone: x => {
      el.textContent = "🎤 Tekrar dene";
      if (!x) { $("#spRes").innerHTML = `<span class="muted">Ses duyulmadı.</span>`; return; }
      const { pct, marks, orderOk } = wm(it.nl, x);
      App.learn.s.spGrade = pct >= 85 && orderOk !== false ? 2 : pct >= 50 ? 1 : 0;
      $("#spRes").innerHTML = `<div class="small muted">Telefon seni anladı mı?</div><div class="score" style="font-size:1.8rem">${pct}%</div>
        <div>${marks.map(m => `<span class="${m.ok ? "w-ok" : "w-bad"}">${esc(m.w)}</span>`).join(" ")}</div>
        ${orderOk === false ? `<div class="note">🧩 ${AT.order} <b>${esc(it.nl)}</b></div>` : ""}
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
const CTXS = L.ctxs; // [anahtar, etiket] — dile göre (lang.js)
if (!CTXS.some(c => c[0] === App.interp.ctx)) App.interp.ctx = CTXS[0][0]; // öbür dilin durumu kalmasın
// konuşma bağlamı: yalnız aynı durumda ve son 20 dakikadaki cümleler
let conv = store.get("conv", []).filter(c => c && c.at && Date.now() - c.at < 20 * 60000);
App.interp.live = store.get("interpLive", false);
App.interp.auto = store.get("interpAuto", false); // v9: 🔁 oto sıra (dile göre)
const thread = []; // bu oturumdaki baloncuklar (html) — sekme değişince kaybolmasın
const redoMap = new Map();
let bubSeq = 0;
const modeChips = () => `<button class="chip" data-act="interpMode" data-m="talk" aria-pressed="${!App.interp.live}">💬 Konuşma</button><button class="chip" data-act="interpMode" data-m="live" aria-pressed="${!!App.interp.live}">🎧 Canlı altyazı</button>`;
const ctxSelect = (ctx) => `<label class="ctxsel"><span class="sr-only">Durum</span><select id="ctxSel" aria-label="Durum">${CTXS.map(([k, l]) => `<option value="${k}" ${k === ctx ? "selected" : ""}>📍 ${l}</option>`).join("")}</select></label>`;
function renderInterp() {
  const live = !!App.interp.live;
  $("#micsRow").classList.toggle("hidden", live); $("#liveBtn").classList.toggle("hidden", !live);
  $("#lifelines").classList.toggle("hidden", live); // canlı altyazıda telefonun kendi sesi mikrofona girmesin
  ["in", "out"].forEach(d => { const b = d === "in" ? $("#micNL") : $("#micTR"); if (b && !b.classList.contains("live")) setMicUI(d, false); }); // alt yazılar öğrenilen dile göre
  $("#lifelines").innerHTML = LANG === "en" ? C.LIFELINES.map(l => { const nl = P(l[0]), tr = P(l[1]), ok = P(l[2] || "");
      return `<button class="chip ll" data-act="show" data-nl="${esc(nl)}" data-tr="${esc(tr)}" data-ok="${esc(ok)}" data-src="Hazır"><span>${esc(nl)}</span><span class="llt">${esc(llShort(nl, tr))}</span></button>`; }).join("") // v8.2: çip en fazla 2 satır; okunuş 📢 büyük ekranda
    : C.LIFELINES.map(l => `<button class="chip" data-act="show" data-nl="${esc(P(l[0]))}" data-tr="${esc(P(l[1]))}" data-ok="${esc(P(l[2] || ""))}" data-src="Hazır">${esc(P(l[0]))}</button>`).join("");
  if (live) return renderLive();
  const ctx = App.interp.ctx, serious = SERIOUS.has(ctx);
  const fast = store.get("fastI", true);
  $("#v-ceviri").innerHTML = `
    <div class="ctxbar flat"><div class="seg" role="group" aria-label="Mod">${modeChips()}</div>
      <div class="row" style="margin-top:6px;gap:6px;flex-wrap:nowrap">${ctxSelect(ctx)}
      ${serious ? `<span class="chip" style="color:var(--danger)" title="Ciddi durumda en iyi model kullanılır">🛡️ En iyi</span>` : LANG === "en" ? "" : `<button class="chip" data-act="fastToggle" aria-pressed="${fast}">⚡ ${fast ? "Hızlı: açık" : "Hızlı: kapalı"}</button>`}
      <button class="chip" data-act="newConv" aria-label="Yeni konuşma">🧹</button></div>
      <div class="chips" role="group" aria-label="Konuşma biçimi" style="margin-top:6px"><button class="chip" data-act="autoTurn" aria-pressed="${!!App.interp.auto}" title="Sıra kendiliğinden döner: sen söyle → telefon söylesin → karşındakini dinlesin">🔁 Oto sıra</button><button class="chip" data-act="faceOpen" title="Telefonu aranıza koy: ekranın yarısı karşındakine dönük">🤝 Yüz yüze</button></div>${accentChips()}</div>
    ${serious ? (L.belgium ? `<div class="dangerbox" style="margin-bottom:10px">Önemli konularda (sağlık, hukuk, polis, para) profesyonel tercüman iste — polis ve mahkemede hakkındır; hastane ve kurumlarda genelde sosyal tercüman ayarlanabilir, sor: <b>“Ik wil graag een tolk.”</b> <button class="btn sm" data-act="say" data-say="${AT.tolk[0]}">🔊</button><br><span class="small">Sayı, tarih, doz ve tutarları mutlaka yazılı iste: “${AT.write}”</span></div>`
      : `<div class="dangerbox" style="margin-bottom:10px">Önemli konularda (sağlık, hukuk, para) mümkünse profesyonel tercüman iste: <b>“${AT.tolk[0]}”</b> <span class="small">(${AT.tolk[1]})</span> <button class="btn sm" data-act="say" data-say="${AT.tolk[0]}">🔊</button><br><span class="small">Sayı, tarih, doz ve tutarları mutlaka yazılı iste: “${AT.write}” <button class="btn sm" data-act="say" data-say="${AT.write}">🔊</button></span></div>`) : ""}
    ${!store.get("apiKey", "") && !DEMO ? `<div class="warnbox" style="margin-bottom:10px">Çeviri için bir kez API anahtarı gir. <button class="btn sm" data-act="goKey">Anahtarı gir</button><br><span class="small">Aşağıdaki hazır cümleler internetsiz de çalışır.</span></div>` : ""}
    <div class="thread" id="thread" aria-live="polite">${thread.length ? thread.map(b => b.html).join("") : `<div class="empty"><div class="e" aria-hidden="true">🎙️</div><h3>Konuşmaya hazır</h3>
      <p>👂 <b>O konuşuyor</b> — karşındaki konuşsun, Türkçesi anında gelsin.</p>
      <p>🗣️ <b>Ben söyleyeceğim</b> — Türkçe söyle, ${L.ad}sini büyük göstereyim.</p>
      <p>🤝 <b>Yüz yüze</b> — telefonu aranıza koy, ikiniz de kendi dilinizde konuşun.</p>
      <div class="row" style="justify-content:center;margin-top:12px"><button class="btn sm primary" data-act="faceOpen">🤝 Yüz yüze aç</button><button class="btn sm" data-act="typeOpen">⌨️ Yazarak çevir</button></div>
      <p class="small" style="margin-top:8px">Bitince aynı düğmeye tekrar bas.</p></div>`}</div>
    <details class="card" style="margin-top:12px" id="typeBox"><summary>⌨️ Yazarak çevir</summary>
      <textarea id="typeIn" placeholder="${L.ad} ya da Türkçe yaz… (klavyedeki 🎤 ile de söyleyebilirsin)" style="margin-top:8px"></textarea>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="typeIn" data-dir="in">${L.flag} → 🇹🇷 Anlamı</button><button class="btn sm" data-act="typeIn" data-dir="out">🇹🇷 → ${L.flag} Nasıl derim</button></div>
    </details>`;
  const sel = $("#ctxSel"); if (sel) sel.onchange = () => setCtx(sel.value);
  const last = thread[thread.length - 1]; if (last) scrollToBubble(last.id); else window.scrollTo(0, 0);
}
/** en hazır cümle çipinin altındaki kısa Türkçe anlam */
function llShort(nl, tr) {
  const t = String(nl).toLowerCase();
  if (/repeat/.test(t)) return "🔁 Tekrar eder misiniz?";
  if (/slow/.test(t)) return "🐢 Yavaş konuşur musunuz?";
  if (/write|spell/.test(t)) return "✍️ Yazar mısınız?";
  if (/e-?mail/.test(t)) return "📧 E-postayla gönderir misiniz?";
  if (/moment|minute|second/.test(t)) return "⏳ Bir saniye";
  if (/check|come back/.test(t)) return "🔎 Kontrol edip döneyim";
  if (/english/.test(t)) return "🙏 İngilizcem iyi değil";
  return tr;
}
/** en: dinleme aksanı tek dokunuşla (srLang anahtarı; Ben → Kurulum'daki seçimle aynı) */
const ACC_FLAGS = { "en-US": "🇺🇸 Amerikan", "en-GB": "🇬🇧 İngiliz", "en-IN": "🇮🇳 Hint" };
const accentChips = () => LANG !== "en" ? "" : `<div class="chips acc" role="group" aria-label="Dinlenecek aksan" style="margin-top:6px;flex-wrap:nowrap;overflow-x:auto"><span class="small muted" style="align-self:center">👂 Aksan:</span>${L.srOpts.map(([v]) => `<button class="chip" data-act="srAccent" data-v="${v}" aria-pressed="${store.get("srLang", L.sr) === v}">${ACC_FLAGS[v] || v}</button>`).join("")}</div>`;
ACT.srAccent = el => { store.set("srLang", el.dataset.v); haptic(8); toast(`${ACC_FLAGS[el.dataset.v] || el.dataset.v} İngilizcesiyle dinliyorum`); $$("[data-act=srAccent]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.v === el.dataset.v))); };
/** C9 (en): tercümanda günde 3 başarılı çeviri → seri günü */
function interpStreak() {
  if (LANG !== "en") return;
  const d = todayStr(), c = store.get("interpOk", {}); const n = (c.d === d ? c.n : 0) + 1;
  store.set("interpOk", { d, n });
  if (n === 3 && Progress.markStreakDay) { Progress.markStreakDay(); App.renderStats(); toast("🔥 Bugün 3 çeviri — seri korundu"); }
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
ACT.fastToggle = () => { store.set("fastI", !store.get("fastI", true)); renderInterp(); };
ACT.typeOpen = () => { const d = $("#typeBox"); if (d) { d.open = true; d.scrollIntoView({ block: "center" }); setTimeout(() => $("#typeIn").focus(), 50); } };
ACT.newConv = () => { conv = []; store.set("conv", conv); thread.length = 0; renderInterp(); toast("Yeni konuşma başladı"); };
ACT.typeIn = el => { const v = ($("#typeIn").value || "").trim(); if (!v) return; $("#typeIn").value = ""; interpProcess(el.dataset.dir, v); };
function setMicUI(dir, live) {
  const b = dir === "in" ? $("#micNL") : $("#micTR");
  b.classList.toggle("live", live); b.setAttribute("aria-pressed", String(live));
  b.querySelector(".sub").innerHTML = live ? `<span class="waves" aria-hidden="true"><i></i><i></i><i></i><i></i></span> ⏹ Bitir` : (dir === "in" ? `${L.ad} → Türkçe` : `Türkçe → ${L.ad}`);
}
/* =================================================================
   v9 — ışık hızı (hafıza + konuşurken çeviri), oto sıra, yüz yüze
   ================================================================= */
(function () { // yüz yüze + kendini sınama yerleşimi (yalnız tasarım değişkenleri)
  if (document.getElementById("app9-css")) return;
  const st = document.createElement("style"); st.id = "app9-css";
  st.textContent = `
#faceOv,#stOv{position:fixed;inset:0;z-index:65;background:var(--bg);display:none;flex-direction:column}
#faceOv.on,#stOv.on{display:flex}
#faceOv{padding:0;overflow:hidden}
#stOv{padding:calc(14px + env(safe-area-inset-top)) 16px calc(14px + env(safe-area-inset-bottom));overflow:auto}
.f2f-half{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:8px;padding:14px 16px}
.f2f-them{transform:rotate(180deg);background:var(--nl-soft);padding-bottom:calc(14px + env(safe-area-inset-top))}
.f2f-me{background:var(--tr-soft);padding-bottom:calc(14px + env(safe-area-inset-bottom))}
.f2f-txt{flex:1 1 0;min-height:0;overflow:auto;display:flex;text-align:center;font-weight:800;line-height:1.22;font-size:clamp(1.5rem,6.2vw,2.7rem);overflow-wrap:anywhere;color:var(--ink)}
.f2f-txt>span{margin:auto;max-width:100%}
.f2f-txt.long{font-size:clamp(1.15rem,4.6vw,1.9rem)}
.f2f-txt.wait{color:var(--muted);font-weight:600;font-size:clamp(1.05rem,4.2vw,1.5rem)}
.f2f-sub{min-height:1.3em;text-align:center;color:var(--muted);font-size:.95rem;overflow-wrap:anywhere}
.f2f-warn{background:var(--danger-soft);color:var(--danger);border-radius:var(--r-sm);padding:8px 10px;font-size:.9rem;font-weight:700}
.f2f-rep{display:flex;gap:6px;overflow-x:auto;scrollbar-width:none}
.f2f-rep .chip{max-width:78vw;overflow:hidden;text-overflow:ellipsis}
.f2f-mic{align-self:center;flex:0 0 auto;display:inline-flex;align-items:center;gap:10px;min-height:60px;padding:0 30px;border:0;border-radius:999px;background:var(--grad);color:var(--brand-ink);font:inherit;font-weight:800;font-size:1.15rem;box-shadow:var(--shadow);cursor:pointer}
.f2f-mic.live{background:var(--danger);animation:f2fPulse 1.4s var(--ease) infinite}
@keyframes f2fPulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--danger) 45%,transparent)}50%{box-shadow:0 0 0 14px color-mix(in srgb,var(--danger) 0%,transparent)}}
@media (prefers-reduced-motion:reduce){.f2f-mic.live{animation:none}}
.f2f-bar{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:6px 12px;background:var(--card);border-top:1px solid var(--line);border-bottom:1px solid var(--line)}
.f2f-bar .f2f-stat{flex:1 1 auto;min-width:0;text-align:center;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted)}
.st-row{display:flex;gap:10px;align-items:flex-start;padding:9px 0;border-bottom:1px solid var(--line)}
.st-row b{flex:1 1 auto;min-width:0}
.st-row .small{text-align:right;overflow-wrap:anywhere}`;
  document.head.appendChild(st);
})();
const BIZ_CTX = ["is", "toplanti", "resmi"]; // en: satış/uyum kuralı uyarısı (uyari_tr) bu durumlarda gelebilir
const WAIT_TURN = "⏸ Sıra bekliyor — mikrofona dokun";

/** Dok üstündeki durum şeridi: metin ayrı <span>'da durur; "⏹ Dur" düğmesi yeniden çizilmez (dokunuş kaybolmasın) */
function liveSay(text, withStop) {
  const live = $("#liveText"); if (!live) return;
  clearTimeout(liveSay.t);
  let sp = live.querySelector("span.lt"); const hasStop = !!live.querySelector("[data-act=turnStop]");
  if (!sp || hasStop !== !!withStop) {
    live.innerHTML = `<span class="lt"></span>${withStop ? ` <button class="btn sm" data-act="turnStop" style="float:right;margin:-4px 0 -4px 8px">⏹ Dur</button>` : ""}`;
    sp = live.querySelector("span.lt");
  }
  sp.textContent = text; live.classList.remove("hidden");
}
function liveHide(after) {
  clearTimeout(liveSay.t);
  const f = () => { if (App.interp.live || Speech.cur) return; const live = $("#liveText"); if (live) live.classList.add("hidden"); };
  if (after) liveSay.t = setTimeout(f, after); else { const live = $("#liveText"); if (live && !App.interp.live) live.classList.add("hidden"); }
}

/** Tercüman isteği — normal ve "konuşurken" (spekülatif) çağrı AYNI model / talimat / şemayı kullanır */
function interpRequest({ feature, dir, raw, ctx, model, onPartial, retries }) {
  // her balonun kendi isteği var: yeni cümle, bekleyen önceki çeviriyi iptal etmez
  return callClaude({ feature, kind: dir, ctx, model, retries, timeout: model === MODEL_FAST ? 20000 : 45000, onPartial,
    system: dir === "in" ? sysInterpIn(ctx) : sysInterpOut(ctx), schema: SCHEMA[dir],
    content: LANG === "en" // D2: önceki konuşma <context>, kullanıcının yeni metni <user_text> — ikisi de veri, talimat değil
      ? `<context>\nRecent conversation:\n${tagSafe(ctxText())}\n</context>\n\n${dir === "in" ? `ASR transcript (${store.get("srLang", L.sr)}) of what the other person said` : "What the user wants to say (Turkish)"}:\n<user_text>${tagSafe(raw)}</user_text>`
      : `Recent conversation:\n${ctxText()}\n\n${dir === "in" ? `ASR transcript (${store.get("srLang", L.sr)})` : "What the user wants to say (Turkish)"}: "${raw}"` });
}

/** A1.3 — konuşurken çeviri: ara metin ≥3 kelime ve ~700 ms değişmediyse çeviri arkada başlar.
 *  Son metin aynıysa cevap hazırdır; değilse iptal edilip normal istek atılır. Yalnız hızlı/orta model, aynı anda en çok 1. */
const Spec = {
  s: null, t: null, k: "", n: 0, seq: 0,
  on() { return store.get("specOn", true) !== false; },
  reset() { this.cancel(); this.k = ""; this.n = 0; },
  cancel() { clearTimeout(this.t); this.t = null; const x = this.s; this.s = null; if (x && !x.taken) abortFeature(x.feature); },
  feed(dir, text) {
    if (!this.on()) return;
    const k = Memo.norm(text, dir);
    if (k === this.k) return;
    this.k = k; clearTimeout(this.t); this.t = null;
    if (k.split(" ").length < 3) return;
    this.t = setTimeout(() => { this.t = null; this.start(dir, text, k); }, 700);
  },
  start(dir, raw, k) {
    try {
      if (this.s && this.s.k === k && this.s.dir === dir) return;
      if (this.n >= 3) return; // bir mikrofon oturumunda en çok 3 deneme (maliyet sınırı)
      const ctx = App.interp.ctx, model = modelFor("interp", ctx, dir);
      if (model === MODEL_BEST) return; // ciddi durum / en iyi model: tahminle para ve zaman harcanmaz
      if ((!DEMO && !store.get("apiKey", "")) || navigator.onLine === false) return;
      if (Memo.has(dir, raw, ctx)) return; // zaten hafızada: anında gelecek
      this.cancel(); this.n++;
      const x = { dir, raw, k, ctx, model, feature: "spec:" + dir + ":" + (++this.seq), partial: "", onPartial: null, taken: false };
      x.p = interpRequest({ feature: x.feature, dir, raw, ctx, model, retries: 0, onPartial: txt => { x.partial = txt; if (x.onPartial) x.onPartial(txt); } });
      x.p.then(() => { }, () => { }); // sahiplenilmezse sessizce düşsün
      this.s = x;
    } catch { }
  },
  /** Son metin tahminle aynıysa süren isteği devral */
  take(dir, raw, ctx) {
    clearTimeout(this.t); this.t = null;
    const x = this.s; this.s = null;
    if (!x) return null;
    if (x.dir === dir && x.ctx === ctx && x.k === Memo.norm(raw, dir)) { x.taken = true; return x; }
    abortFeature(x.feature); return null;
  }
};

/** A2.2 — 🔁 oto sıra: sen söyle → telefon söylesin → karşındakini dinlesin → çevirsin → yine sen. */
const Turn = {
  tok: 0, feat: "",
  on() { return !!App.interp.auto; },
  /** "Dur": dinleme, seslendirme, bekleyen çeviri ve zincir — hepsi kesilir */
  halt() {
    this.tok++;
    const c = Speech.cur; if (c && /^(interp|face)-/.test(String(c.owner))) c.cancel();
    TTS.stop(); Spec.cancel(); if (this.feat) { abortFeature(this.feat); this.feat = ""; }
    liveHide(); if (Face.open) Face.stat("");
  },
  /** Sıradaki yönü dinlemeye başla (zincir hâlâ geçerliyse). → başladı mı */
  next(dir, tok) {
    if (tok !== this.tok || !this.on()) return false;
    if (App.view !== "ceviri" || App.interp.live || document.hidden || Speech.cur) return false;
    listenTurn(dir, { auto: true });
    return !!Speech.cur;
  }
};
ACT.autoTurn = () => {
  App.interp.auto = !App.interp.auto; store.set("interpAuto", App.interp.auto); haptic(10);
  if (!App.interp.auto) Turn.halt();
  $$("[data-act=autoTurn]").forEach(b => b.setAttribute("aria-pressed", String(!!App.interp.auto)));
  toast(App.interp.auto ? "🔁 Oto sıra açık — bir mikrofona dokun, sıra kendiliğinden döner" : "Oto sıra kapalı");
};
ACT.turnStop = () => { Turn.halt(); haptic(15); toast("Durduruldu — devam için mikrofona dokun"); };

/** A2.3 — 🤝 yüz yüze: üst yarı karşıdakine dönük (180°), alt yarı sana */
const FACE_T = LANG === "en"
  ? { speak: "Speak", done: "Done", hint: "Tap the microphone and speak English.", wait: "Translating…", listen: "Listening…" }
  : { speak: "Spreek", done: "Klaar", hint: "Tik op de microfoon en spreek Nederlands.", wait: "Vertalen…", listen: "Ik luister…" };
const Face = {
  open: false, last: null,
  build() {
    let o = $("#faceOv"); if (o) return o;
    o = document.createElement("div"); o.id = "faceOv"; o.className = "fs-ov f2f";
    o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Yüz yüze çeviri");
    o.innerHTML = `
      <div class="f2f-half f2f-them" lang="${LANG === "en" ? "en" : "nl"}">
        <div class="f2f-txt wait" id="faceThem" aria-live="polite"><span></span></div>
        <div class="f2f-sub" id="faceThemSub"></div>
        <button class="f2f-mic" id="faceMicIn" data-act="faceMic" data-dir="in" aria-pressed="false"><span aria-hidden="true">🎤</span><span>${FACE_T.speak}</span></button>
      </div>
      <div class="f2f-bar" lang="tr">
        <button class="btn sm" data-act="faceClose" aria-label="Yüz yüze ekranını kapat">✕</button>
        <span class="f2f-stat small" id="faceStat" aria-live="polite"></span>
        <button class="chip" data-act="autoTurn" aria-pressed="false">🔁 Oto sıra</button>
        <button class="btn sm" data-act="faceSay" aria-label="Son cümleyi karşıya göster ve sesli söyle">🔊</button>
      </div>
      <div class="f2f-half f2f-me" lang="tr">
        <div class="f2f-txt wait" id="faceMe" aria-live="polite"><span></span></div>
        <div class="f2f-sub" id="faceMeSub"></div>
        <div class="f2f-warn hidden" id="faceWarn" role="alert"></div>
        <div class="f2f-rep hidden" id="faceReplies" role="group" aria-label="Hazır cevaplar"></div>
        <button class="f2f-mic" id="faceMicOut" data-act="faceMic" data-dir="out" aria-pressed="false"><span aria-hidden="true">🎤</span><span>Konuş</span></button>
      </div>`;
    document.body.appendChild(o);
    return o;
  },
  txt(id, text, wait) { const el = $("#" + id); if (!el) return; el.firstElementChild.textContent = text || ""; el.classList.toggle("wait", !!wait); el.classList.toggle("long", String(text || "").length > 110); el.scrollTop = 0; },
  sub(id, text) { const el = $("#" + id); if (el) el.textContent = text || ""; },
  stat(text) { this.sub("faceStat", text); },
  warn(text) { const el = $("#faceWarn"); if (!el) return; el.textContent = text || ""; el.classList.toggle("hidden", !text); },
  replies(list) {
    const el = $("#faceReplies"); if (!el) return; const l = (list || []).filter(c => c && c.nl).slice(0, 2);
    el.innerHTML = l.map(c => `<button class="chip" data-act="faceReply" data-nl="${esc(c.nl)}" data-tr="${esc(c.tr)}">💬 ${esc(c.tr || c.nl)}</button>`).join("");
    el.classList.toggle("hidden", !l.length);
  },
  mic(dir, live) {
    const b = $(dir === "in" ? "#faceMicIn" : "#faceMicOut"); if (!b) return;
    b.classList.toggle("live", !!live); b.setAttribute("aria-pressed", String(!!live));
    b.lastElementChild.textContent = live ? (dir === "in" ? FACE_T.done : "Bitir") : (dir === "in" ? FACE_T.speak : "Konuş");
  },
  reset() {
    this.last = null; this.txt("faceThem", FACE_T.hint, true); this.txt("faceMe", "Mikrofona dokun ve Türkçe konuş.", true);
    this.sub("faceThemSub", ""); this.sub("faceMeSub", ""); this.warn(""); this.stat(""); this.replies([]); this.mic("in", false); this.mic("out", false);
  },
  listening(dir) { this.stat(""); this.sub(dir === "in" ? "faceThemSub" : "faceMeSub", dir === "in" ? FACE_T.listen : "Dinliyorum… Türkçe söyle"); },
  interim(dir, t) { if (t) this.sub(dir === "in" ? "faceThemSub" : "faceMeSub", t); },
  idle(dir) { const id = dir === "in" ? "faceThemSub" : "faceMeSub", el = $("#" + id); if (el && /…/.test(el.textContent) && el.textContent.length < 30) el.textContent = ""; this.stat(WAIT_TURN); },
  pending(dir, raw) {
    this.replies([]); this.warn(""); this.stat("");
    if (dir === "in") { this.sub("faceThemSub", raw); this.txt("faceMe", "Çeviriyorum…", true); this.sub("faceMeSub", ""); }
    else { this.txt("faceMe", raw, false); this.sub("faceMeSub", ""); this.txt("faceThem", FACE_T.wait, true); this.sub("faceThemSub", ""); }
  },
  partial(dir, v) { this.txt(dir === "in" ? "faceMe" : "faceThem", v, false); },
  showOut(nl) { this.txt("faceThem", nl, false); this.sub("faceThemSub", ""); },
  result(dir, r, raw, warned) {
    this.stat("");
    if (dir === "in") {
      this.sub("faceThemSub", r.duzeltilmis_nl || raw); this.txt("faceMe", r.ceviri_tr, false); this.sub("faceMeSub", r.niyet_tr ? "🎯 " + r.niyet_tr : "");
      let acct = false; try { acct = LANG === "en" && scamSignals(raw + " " + r.duzeltilmis_nl).includes(ACCT_HIT); } catch { }
      this.warn(r.onemli_uyari_tr ? "⚠️ " + r.onemli_uyari_tr : acct ? "⚠️ Hesap / ödeme bilgisi değişikliği gibi görünüyor — bilinen numaradan arayıp doğrulamadan işlem yapma." : "");
      this.replies(r.cevaplar);
    } else {
      this.txt("faceMe", raw, false); this.sub("faceMeSub", r.tr_geri ? "↩︎ " + r.tr_geri : ""); this.replies([]);
      this.last = { nl: r.nl, held: !!warned };
      // satış kuralı uyarısı varsa cümle karşıya KENDİLİĞİNDEN gösterilmez / söylenmez — karar senin
      if (warned) { this.txt("faceThem", "…", true); this.sub("faceThemSub", ""); this.warn("⚠️ " + r.uyari_tr + " — Yine de göstermek ve söylemek için 🔊'a dokun."); }
      else { this.showOut(r.nl); this.warn(""); }
    }
  },
  error(dir, msg) { this.txt(dir === "in" ? "faceMe" : "faceThem", "…", true); this.stat(msg ? "⚠️ " + msg : ""); }
};
function faceClose(fromBack) {
  const o = $("#faceOv"); if (!o) return;
  const c = Speech.cur; if (c && /^face-/.test(String(c.owner))) c.cancel();
  Turn.tok++; TTS.stop(); Spec.cancel();
  Face.open = false; o.classList.remove("on");
  if (o.dataset.back) { delete o.dataset.back; if (!fromBack) Back.drop(); }
}
ACT.faceOpen = () => {
  if (window.LiveUI && LiveUI.isActive && LiveUI.isActive()) { toast("Önce canlı altyazıyı durdur"); return; }
  const wasLive = !!App.interp.live;
  if (wasLive) { App.interp.live = false; store.set("interpLive", false); }
  if (App.view !== "ceviri") tab("ceviri"); else if (wasLive) renderInterp();
  if (App.view !== "ceviri") return;
  if (Speech.cur) Speech.cur.cancel();
  Turn.tok++;
  const o = Face.build(); Face.reset();
  $$("[data-act=autoTurn]").forEach(b => b.setAttribute("aria-pressed", String(!!App.interp.auto)));
  o.classList.add("on"); Face.open = true; haptic(15);
  if (!o.dataset.back) { o.dataset.back = "1"; Back.push(() => faceClose(true)); }
  try { Wake.on(); warmup(); } catch { }
};
ACT.faceClose = () => faceClose();
ACT.faceMic = el => listenTurn(el.dataset.dir);
ACT.faceSay = () => {
  const l = Face.last; if (!l || !l.nl) { toast("Önce bir cümle söyle"); return; }
  if (l.held) { l.held = false; Face.showOut(l.nl); Face.warn(""); }
  TTS.speak(l.nl);
};
/** Yüz yüzede hazır cevap çipi: karşıya büyük göster + söyle (oto sıradaysa sonra onu dinle) */
ACT.faceReply = el => {
  const nl = el.dataset.nl, tr = el.dataset.tr || ""; if (!nl) return;
  if (Speech.cur) Speech.cur.cancel();
  const tk = ++Turn.tok;
  Face.last = { nl, held: false }; Face.showOut(nl); Face.txt("faceMe", tr || nl, false); Face.sub("faceMeSub", ""); Face.replies([]); Face.warn("");
  conv.push({ d: "out", nl, ctx: App.interp.ctx, at: Date.now() }); conv = conv.slice(-8); store.set("conv", conv);
  const cont = () => { Turn.next("in", tk); };
  if (!TTS.speak(nl, { onEnd: cont })) cont();
};
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  const st = $("#stOv");
  if (st && st.classList.contains("on")) selfTestClose(); else if (Face.open) faceClose();
});

/** Tek mikrofon yolu: elle (dok düğmeleri), oto sıra ve yüz yüze aynı akışı kullanır.
 *  Elle modda eskisi gibi: aynı düğmeye tekrar basınca biter. Oto sıra / yüz yüzede konuşma bitince kendiliğinden çevirir. */
function listenTurn(dir, { auto = false } = {}) {
  const face = Face.open, owner = (face ? "face-" : "interp-") + dir;
  const cur = Speech.cur;
  if (cur && cur.owner === owner) { if (!auto) cur.stop(); return; } // aynı düğme: bitir ve çevir
  if (cur) cur.cancel(); // diğer yöndeki dinlemeyi bırak, bu yöne geç
  ++Turn.tok; Spec.reset();
  const hands = face || Turn.on();
  const ui = on => { if (face) Face.mic(dir, on); else { if (on) { setMicUI("in", false); setMicUI("out", false); } setMicUI(dir, on); } };
  const hint = dir === "in" ? "Dinliyorum…" : "Türkçe söyle…";
  ui(true); haptic(20);
  if (face) Face.listening(dir); else liveSay(hint, hands);
  let got = "", endT = null, idleT = null, h = null;
  const clear = () => { clearTimeout(endT); clearTimeout(idleT); };
  const fin = () => { if (h && Speech.cur === h) h.stop(); };
  if (hands) idleT = setTimeout(fin, 10000); // kimse konuşmadı: zincir nazikçe bekler
  h = Speech.listen({ lang: dir === "in" ? store.get("srLang", L.sr) : "tr-TR", owner,
    onText: t => {
      if (face) Face.interim(dir, t); else liveSay(t || hint, hands);
      if (t && t !== got) {
        got = t; Spec.feed(dir, t);
        if (hands) { clear(); endT = setTimeout(fin, 1800); } // konuşma bitti say: 1,8 sn sessizlik
      }
    },
    onDone: t => {
      clear(); ui(false); if (!face) liveHide(); haptic(10);
      if (!t) {
        Spec.cancel();
        if (!hands) toast("Ses duyulmadı, tekrar dene");
        else if (face) Face.idle(dir);
        else { liveSay(WAIT_TURN, false); liveHide(6000); }
        return;
      }
      interpProcess(dir, t, { face, turn: true });
    },
    onError: c => {
      clear(); ui(false); if (!face) liveHide(); Spec.cancel();
      if (c !== "cancelled") { if (face) Face.error(dir, Speech.errorText(c)); pushBubble(`<div class="bub">${errBox(Speech.errorText(c))}</div>`); }
    } });
}
ACT.mic = el => listenTurn(el.dataset.dir);
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
/** Akan JSON'da bir alan TAMAMLANDIYSA değerini ver (A1.4: cümle biter bitmez seslendirme) */
function doneField(txt, field) {
  const m = String(txt).match(new RegExp('"' + field + '"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"\\s*[,}]'));
  if (!m) return "";
  try { return JSON.parse('"' + m[1] + '"'); } catch { return ""; }
}
/**
 * Çeviri hattı. Sıra: ⚡ hafıza (anında) → konuşurken başlamış istek (devral) → normal istek.
 * forceBest: en iyi modelle yeniden · fresh: hafızayı atla · face: yüz yüze ekranı · turn: mikrofondan geldi (oto sıra zinciri sürebilir)
 */
async function interpProcess(dir, raw, { forceBest = false, bubbleId, fresh = false, face = false, turn = false } = {}) {
  const ctx = App.interp.ctx; const serious = SERIOUS.has(ctx);
  const t0 = performance.now(), tk = Turn.tok;
  face = !!face && Face.open; turn = !!turn;
  const strip = turn && Turn.on() && !face; // oto sırada dok üstünde durum şeridi
  const head = dir === "in" ? `<span class="tag nl">${L.flag} DUYULAN</span> <span class="mid-nl">${esc(raw)}</span>` : `<span class="tag tr">🇹🇷 SEN</span> <span>${esc(raw)}</span>`;
  const id = bubbleId || pushBubble("");
  const model = forceBest ? MODEL_BEST : modelFor("interp", ctx, dir); // D1: en iş/toplantı "out" → orta model
  const partialKey = dir === "in" ? "ceviri_tr" : "nl";
  const hold = LANG === "en" && BIZ_CTX.includes(ctx); // satış kuralı uyarısı cümleden SONRA gelir: erken gösterme / söyleme yok
  const speakOut = dir === "out" && (face || (turn && Turn.on()) || store.get("autoSay", false));
  let spoken = false, src = "ai", hit = null, spec = null, feature = "interp:" + id;
  const idleStrip = () => { if (strip && tk === Turn.tok) liveHide(); };
  const sayOut = text => {
    spoken = true; if (strip && tk === Turn.tok) liveSay("🔊 Söylüyorum…", true);
    const cont = () => { if (!(turn && Turn.next("in", tk))) idleStrip(); };
    if (!TTS.speak(text, { onEnd: cont })) cont();
  };
  const pend = () => {
    setBubble(id, `<div class="bub ${dir} prov">${head}<div class="big-tr partial" id="pt_${id}"></div><div class="skel" style="width:85%"></div><div class="skel" style="width:60%"></div>
    <button class="btn sm" data-act="cancelReq" data-f="${feature}">Vazgeç</button></div>`);
    scrollToBubble(id);
  };
  if (!forceBest && !fresh) { try { hit = Memo.get(dir, raw, ctx); } catch { hit = null; } }
  if (turn) { if (hit) Spec.cancel(); else spec = Spec.take(dir, raw, ctx); }
  try {
    let r;
    if (hit) { r = hit.r; src = hit.src; } // ⚡ anında: ağ yok, bekleme yok
    else {
      if (spec) { feature = spec.feature; src = "spec"; }
      pend(); if (face) Face.pending(dir, raw); if (strip) liveSay("⏳ Çeviriyorum…", true);
      if (turn) Turn.feat = feature;
      const onPartial = txt => {
        const v = partialField(txt, partialKey);
        if (v) { const el = document.getElementById("pt_" + id); if (el) el.textContent = v; if (face && Face.open && !(dir === "out" && hold)) Face.partial(dir, v); }
        if (speakOut && !spoken && !hold && tk === Turn.tok) { const full = doneField(txt, "nl"); if (full) sayOut(full); } // A1.4: kalan alanlar gelirken söylemeye başla
      };
      if (spec) {
        spec.onPartial = onPartial; if (spec.partial) onPartial(spec.partial);
        try { r = await spec.p; }
        catch (e) { // tahmin isteği düştü: normal istekle devam (iptal ise iptal)
          if (e && e.code === "abort") throw e;
          src = "ai"; feature = "interp:" + id; if (turn) Turn.feat = feature; pend();
          r = await interpRequest({ feature, dir, raw, ctx, model, onPartial });
        }
      } else r = await interpRequest({ feature, dir, raw, ctx, model, onPartial });
      try { Memo.put(dir, raw, ctx, r); } catch { }
    }
    redoMap.set(id, { dir, raw, ctx });
    const fastTag = hit ? `<span class="tag fast" title="Bu cümle hafızadan geldi">⚡ anında</span>` : "";
    const redo = hit ? `<button class="btn sm ghost" data-act="redo" data-id="${id}" data-fresh="1">🔄 Yeniden çevir</button>`
      : model === MODEL_FAST ? `<button class="btn sm ghost" data-act="redo" data-id="${id}">🔁 Emin değilim — daha iyi çeviri</button>` : "";
    const foot = share => `<div class="row" style="margin-top:8px;gap:6px">${redo}<button class="btn sm ghost" data-act="shareTx" data-text="${esc(share)}">📤 Paylaş</button></div>`;
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
        <div class="row between"><span class="tag tr">🇹🇷 ANLAMI</span><span>${fastTag} <span class="tag ${g[0]}">${g[1]}</span></span></div>
        <div class="big-tr" style="margin-top:6px">${esc(r.ceviri_tr)}</div>
        ${r.niyet_tr ? `<div class="note">🎯 ${esc(r.niyet_tr)}</div>` : ""}
        ${r.onemli_uyari_tr ? `<div class="dangerbox" style="margin-top:8px">⚠️ ${esc(r.onemli_uyari_tr)}</div>` : ""}
        ${LANG === "en" && scamSignals(raw + " " + r.duzeltilmis_nl).includes(ACCT_HIT) ? ACCT_WARN : ""}
        ${top.map(replyCard).join("")}
        <details style="margin-top:8px"><summary class="small">Diğer cevaplar, ${L.ad}si ve notlar</summary>
          ${more.map(replyCard).join("")}
          <div style="margin-top:10px"><span class="tag nl">${L.flag}</span> <span class="mid-nl">${esc(r.duzeltilmis_nl)}</span></div>
          ${r.duzeltilmis_nl.trim().toLowerCase() !== raw.toLowerCase() ? `<div class="small muted">Telefonun duyduğu: “${esc(raw)}”</div>` : ""}
          ${r.notlar_tr ? `<div class="note">💡 ${esc(r.notlar_tr)}</div>` : ""}
          ${acts(r.duzeltilmis_nl, r.ceviri_tr, "", "Hayattan", { show: false, add: addOk })}
        </details>
        ${foot(r.duzeltilmis_nl + "\n🇹🇷 " + r.ceviri_tr)}</div>`);
    } else {
      conv.push({ d: "out", nl: r.nl, ctx, at: Date.now() }); hist({ d: "out", nl: r.nl, tr: raw });
      setBubble(id, `<div class="bub out">
        ${LANG === "en" ? salesWarn(r.uyari_tr) : ""}<span class="tag tr">🇹🇷 SEN</span> <span class="small">“${esc(raw)}”</span>
        <div style="margin-top:8px"><span class="tag nl">${L.flag} ŞÖYLE DE</span> ${fastTag}</div>
        <div class="tapzone" data-act="show" data-nl="${esc(r.nl)}" data-tr="${esc(r.tr_geri)}" data-ok="${esc(r.okunus)}">
          <div class="big-nl" style="margin-top:4px">${esc(r.nl)}</div><div class="okn" style="font-size:1.2rem">${esc(r.okunus)}</div></div>
        <div class="small">↩︎ Anlamı: ${esc(r.tr_geri)}</div>
        ${acts(r.nl, r.tr_geri, r.okunus, "Hayattan", { add: addOk })}
        ${r.ipucu_tr ? `<div class="note">💡 ${esc(r.ipucu_tr)}</div>` : ""}
        ${r.alternatifler.length ? `<details style="margin-top:8px"><summary>🔁 Başka nasıl denir? (${r.alternatifler.length})</summary>${r.alternatifler.map(c => `<div class="reply"><span class="tag br">${esc(c.ton)}</span>
          <div class="mid-nl" style="margin-top:4px">${esc(c.nl)}</div><div class="okn small">${esc(c.okunus)}</div><div class="small">🇹🇷 ${esc(c.tr)}</div>${acts(c.nl, c.tr, c.okunus, "Hayattan", { add: addOk })}</div>`).join("")}</details>` : ""}
        ${foot(r.nl + "\n🇹🇷 " + (r.tr_geri || raw))}</div>`);
    }
    conv = conv.slice(-8); store.set("conv", conv);
    interpStreak();
    scrollToBubble(id);
    try { Perf.add("interp:" + dir, performance.now() - t0, src); } catch { }
    haptic(hit ? 8 : 12);
    // ---- ses + sıra ----
    if (dir === "in") {
      if (face && Face.open) Face.result("in", r, raw);
      const reply = store.get("autoSpeak", false) && r.cevaplar[0] ? r.cevaplar[0].nl : "";
      const cont = () => { if (!(turn && Turn.next("out", tk))) idleStrip(); };
      if (reply) { if (!TTS.speak(reply, { onEnd: cont })) cont(); } else cont();
    } else {
      const warned = !!(LANG === "en" && r.uyari_tr);
      if (face && Face.open) Face.result("out", r, raw, warned);
      if (speakOut && !spoken && !warned && tk === Turn.tok) sayOut(r.nl);
      else if (!spoken && strip && tk === Turn.tok) { // söylenmedi: zincir burada bekler
        if (warned) { liveSay("⚠️ Uyarıyı oku — söylemek için 🔊, devam için mikrofona dokun", false); liveHide(9000); } else liveHide();
      }
    }
  } catch (e) {
    const ab = !!(e && e.code === "abort");
    setBubble(id, ab ? `<div class="bub ${dir}">${head}<div class="small muted">İptal edildi.</div></div>` : `<div class="bub ${dir}">${head}${errBox(e)}<button class="btn sm" data-act="retry" data-id="${id}" data-dir="${dir}" data-raw="${esc(raw)}">↻ Tekrar dene</button></div>`);
    scrollToBubble(id);
    if (face && Face.open) Face.error(dir, ab ? "" : (e && e.message) || "Çeviri yapılamadı");
    idleStrip();
    if (!ab && !(e && e.code === "nokey")) try { ErrLog.add(e, "interp:" + dir); } catch { }
  }
}
ACT.redo = el => {
  const r = redoMap.get(el.dataset.id); if (!r) return;
  if (el.dataset.fresh) { try { Memo.drop(r.dir, r.raw, r.ctx != null ? r.ctx : App.interp.ctx); } catch { } interpProcess(r.dir, r.raw, { fresh: true, bubbleId: el.dataset.id }); } // ⚡ hafızayı atla, yeniden çevir
  else interpProcess(r.dir, r.raw, { forceBest: true, bubbleId: el.dataset.id });
};
ACT.retry = el => interpProcess(el.dataset.dir, el.dataset.raw, { bubbleId: el.dataset.id });
/** A2.5 — 📤 Paylaş: sistem paylaşımı (WhatsApp vb.), yoksa panoya kopyala. Kendiliğinden hiçbir yere gönderilmez. */
ACT.shareTx = async el => {
  const text = el.dataset.text || ""; if (!text) return;
  if (navigator.share) {
    try { await navigator.share({ text }); return; }
    catch (e) { if (e && e.name === "AbortError") return; } // vazgeçti
  }
  try { await navigator.clipboard.writeText(text); toast("Kopyalandı 📋 — istediğin yere yapıştır"); }
  catch { toast("Paylaşılamadı — metni basılı tutup kopyala"); }
};
/** A2.7 — öğrenme ana ekranının en üstündeki üç hızlı eylem */
function qaGrid() {
  return `<div class="qa-grid" role="group" aria-label="Hızlı eylemler">
      <button class="qa" data-act="qaTalk"><span class="e" aria-hidden="true">🎙️</span><b class="n">Çevir</b><span class="d">konuş, anında çevir</span></button>
      <button class="qa" data-act="goLive"><span class="e" aria-hidden="true">🎧</span><b class="n">Altyazı</b><span class="d">ortamı dinle</span></button>
      <button class="qa" data-act="faceOpen"><span class="e" aria-hidden="true">🤝</span><b class="n">Yüz yüze</b><span class="d">ikiniz de konuşun</span></button></div>`;
}
ACT.qaTalk = () => {
  if (!(window.LiveUI && LiveUI.isActive && LiveUI.isActive())) { App.interp.live = false; store.set("interpLive", false); }
  tab("ceviri");
};

/* ---------------- A3.3 Teşhis + A3.4 kendini sınama ---------------- */
function diagInfo() {
  const p = Perf.summary(), last = Perf.list().slice(-1)[0];
  let ch = 0; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k && k.startsWith("dk_")) ch += k.length + (localStorage.getItem(k) || "").length; } } catch { }
  const sec = ms => (Math.max(0, ms) / 1000).toFixed(1).replace(".", ",") + " sn";
  let voices = 0; try { voices = TTS.nlVoices().length; } catch { }
  return [
    ["Sürüm", "v" + (typeof APP_VERSION !== "undefined" ? APP_VERSION : "?")],
    ["Dil", LANG === "en" ? "İngilizce" : "Felemenkçe"],
    ["İnternet", navigator.onLine === false ? "çevrimdışı" : "çevrimiçi"],
    ["API anahtarı", DEMO ? "demo (anahtarsız)" : store.get("apiKey", "") ? "var" : "yok"], // değeri ASLA gösterilmez
    ["Konuşma tanıma", SR_CLASS ? "var" : "yok"],
    ["Seslendirme", TTS.ok() ? `${voices} ${L.ad} ses` : "yok"],
    ["Depolama", "≈ " + Math.round(ch * 2 / 1024) + " KB"],
    ["Hız", p.n && last ? `son çeviri: ${sec(last.ms)} · ortalama ${sec(p.medAi || p.medAll)} · ⚡ hafızadan ${p.memo}${p.spec ? ` · 🚀 erken başlayan ${p.spec}` : ""}` : "henüz ölçüm yok"],
    ["Çeviri hafızası", Memo.size() + " cümle"]
  ];
}
function diagCard() {
  let rows = [], errs = [];
  try { rows = diagInfo(); errs = ErrLog.list(); } catch { }
  const when = t => { try { return new Date(t).toLocaleString("tr-TR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }); } catch { return ""; } };
  return `<details class="card" id="diagBox"><summary>🩺 Teşhis <span class="small muted">— bir şey ters giderse buraya bak</span></summary>
      <div style="margin-top:8px">${rows.map(([a, b]) => `<div class="kv"><span>${esc(a)}</span><b>${esc(b)}</b></div>`).join("")}</div>
      <h3 style="margin-top:12px">Son hatalar</h3>
      ${errs.length ? errs.slice(0, 5).map(e => `<div class="small" style="padding:6px 0;border-bottom:1px solid var(--line);overflow-wrap:anywhere"><b>${esc(when(e.t))}</b> · ${esc(e.where || "")}${e.n > 1 ? ` ×${e.n}` : ""}<br><span class="muted">${esc(e.msg || "")}</span></div>`).join("") : `<p class="small muted">Kayıtlı hata yok 🎉</p>`}
      <div class="row" style="margin-top:10px"><button class="btn sm" data-act="diagCopy">📋 Raporu kopyala</button><button class="btn sm" data-act="selfTestRun">🩺 Kendini sına</button></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="diagClearErr">🧹 Hata kaydını temizle</button><button class="btn sm" data-act="diagClearMemo">⚡ Hafızayı temizle</button></div>
      <p class="small muted" style="margin-top:8px">Rapor API anahtarını ve konuşma içeriğini içermez.</p>
    </details>`;
}
function diagReport() {
  const lines = ["Dil Köprüsü — teşhis raporu", new Date().toISOString()];
  try { diagInfo().forEach(([a, b]) => lines.push(a + ": " + b)); } catch { }
  lines.push("Cihaz: " + String(navigator.userAgent || "").slice(0, 160));
  let errs = []; try { errs = ErrLog.list(); } catch { }
  lines.push("Hatalar (" + errs.length + "):");
  errs.slice(0, 15).forEach(e => lines.push("- " + new Date(e.t).toISOString() + " [" + (e.where || "") + "] " + (e.msg || "") + (e.n > 1 ? " ×" + e.n : "") + (e.v ? " (v" + e.v + ")" : "") + (e.stack ? " | " + e.stack : "")));
  return ErrLog.mask(lines.join("\n"));
}
ACT.diagCopy = async () => { try { await navigator.clipboard.writeText(diagReport()); toast("Rapor kopyalandı 📋"); } catch { toast("Kopyalanamadı"); } };
ACT.diagClearErr = () => { ErrLog.clear(); Perf.clear(); toast("Hata kaydı temizlendi"); if (App.view === "ben") { renderBen(); const d = $("#diagBox"); if (d) d.open = true; } };
ACT.diagClearMemo = () => { const n = Memo.size(); Memo.clear(); toast(`⚡ Hafıza temizlendi (${n} cümle)`); if (App.view === "ben") { renderBen(); const d = $("#diagBox"); if (d) d.open = true; } };
function selfTestClose(fromBack) {
  const o = $("#stOv"); if (!o) return;
  o.classList.remove("on");
  if (o.dataset.back) { delete o.dataset.back; if (!fromBack) Back.drop(); }
}
ACT.selfTestClose = () => selfTestClose();
ACT.selfTestRun = () => selfTest();
/** ?selftest=1 — hiçbir ücretli çağrı yapmadan ana parçaları sınar. → { ok, results:[{name, ok, skip, note}] } */
async function selfTest() {
  if (selfTest.run) return selfTest.run;
  let o = $("#stOv");
  if (!o) { o = document.createElement("div"); o.id = "stOv"; o.className = "fs-ov"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Kendini sınama"); document.body.appendChild(o); }
  o.innerHTML = `<div class="row between"><h2 style="margin:0">🩺 Kendini sınama</h2><button class="btn sm" data-act="selfTestClose" aria-label="Kapat">✕</button></div>
    <p class="small muted">Ücretli çağrı yapılmaz; mikrofon açılmaz.</p><div id="stList"></div><p id="stSum" style="margin-top:12px;font-weight:700" aria-live="polite">Çalışıyor…</p>`;
  o.classList.add("on");
  if (!o.dataset.back) { o.dataset.back = "1"; Back.push(() => selfTestClose(true)); }
  const results = [], list = $("#stList");
  const row = (name, state, note) => {
    results.push({ name, ok: state !== false, skip: state === null, note: note || "" });
    if (list) list.insertAdjacentHTML("beforeend", `<div class="st-row"><span aria-hidden="true">${state === null ? "➖" : state ? "✅" : "❌"}</span><b>${esc(name)}</b><span class="small muted">${esc(note || "")}</span></div>`);
  };
  const step = async (name, fn) => {
    try { const v = await fn(); if (v === false) row(name, false, ""); else if (v && v.skip) row(name, null, v.skip); else if (v && v.fail) row(name, false, v.fail); else row(name, true, typeof v === "string" ? v : ""); }
    catch (e) { row(name, false, ErrLog.mask((e && e.message) || e).slice(0, 120)); }
  };
  selfTest.run = (async () => {
    await step("İçerik yüklü", () => { const n = itemIndex().size; return n > 20 ? n + " cümle" : { fail: "içerik boş" }; });
    await step("Depolama (yaz / oku)", () => { const k = "__st", v = { a: Date.now() }; const w = store.set(k, v); const g = store.get(k, null); store.del(k); return (w !== false && g && g.a === v.a) ? true : { fail: "yazılamadı" }; });
    await step("Konuşma tanıma", () => SR_CLASS ? true : { fail: "bu tarayıcıda yok — Chrome kullan" });
    await step("Seslendirme", () => TTS.ok() ? TTS.nlVoices().length + " " + L.ad + " ses" : { fail: "yok" });
    await step("Çevrimdışı önbellek", () => location.protocol !== "https:" ? { skip: "yalnız https'te" } : (navigator.serviceWorker && navigator.serviceWorker.controller) ? true : { fail: "henüz etkin değil — sayfayı bir kez yenile" });
    await step("Claude kitaplığı", async () => (await loadSDK()) ? true : false);
    await step("API anahtarı", () => DEMO ? { skip: "demo" } : store.get("apiKey", "") ? "var" : { fail: "yok — Ben → 🔑" });
    await step("Deneme çevirisi: duyulan → Türkçe", async () => { const r = postFix("in", fillDefaults(await demoAnswer("in"), SCHEMA.in)); return r && r.ceviri_tr && Array.isArray(r.cevaplar) ? true : false; });
    await step("Deneme çevirisi: Türkçe → " + L.ad, async () => { const r = postFix("out", fillDefaults(await demoAnswer("out"), SCHEMA.out)); return r && r.nl && Array.isArray(r.alternatifler) ? true : false; });
    await step("Çeviri hafızası (⚡)", () => {
      const t = "öz sınama " + Math.random().toString(36).replace(/[^a-z]/g, "") + " deneme cümlesi", c = "__st";
      const w = Memo.put("out", t, c, fillDefaults({ nl: "zelftest", tr_geri: "öz sınama" }, SCHEMA.out));
      const h = Memo.has("out", t, c), g = Memo.get("out", "  " + t + " !", c); Memo.drop("out", t, c);
      return (w && h && g && g.r.nl === "zelftest" && !Memo.has("out", t, c)) ? true : false;
    });
    await step("Hata kaydı ve hız ölçümü", () => (typeof ErrLog.add === "function" && typeof Perf.summary === "function") ? true : false);
    const bad = results.filter(x => !x.ok).length, ok = bad === 0;
    const sum = $("#stSum"); if (sum) sum.textContent = ok ? "✅ Hepsi tamam" : `❌ ${bad} sorun var — yukarıdaki kırmızı satırlara bak`;
    selfTest.run = null;
    return { ok, results };
  })();
  return selfTest.run;
}
window.selfTest = selfTest;
function hist(h) { const l = store.get("hist", []); l.unshift({ ...h, at: Date.now() }); store.set("hist", l.slice(0, 40)); }

/* =================================================================
   PRATİK: haftalık görev + rol oyunları
   ================================================================= */
const SCEN_NL = [
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
const SCEN_EN = [
  { g: "İş: kimya ticareti" },
  { id: "en_tanis", e: "🤝", n: "Yeni tedarikçiyle tanışma (telefon)", d: "The user is the BUYER. You are a sales manager at a foreign chemical producer (use a generic company name). The user calls for the first time: introductions, what the user's company does, which products (e.g. soda ash, caustic soda), typical quantities. Friendly, a bit fast." },
  { id: "en_fiyat", e: "💲", n: "Fiyat ve ödeme şartı sorma", d: "The user is the BUYER. You are a supplier's sales manager. The user asks for a price per metric ton and payment terms. You quote with an Incoterm (e.g. CIF), ask about quantity, destination port and payment (advance, 60 or 90 days, letter of credit). Never use real prices of real companies: use clearly fictional, round numbers (e.g. 400 USD per ton)." },
  { id: "en_musteri", e: "🏭", n: "Müşteri numune ve COA istiyor", d: "The user is the SELLER. You are a foreign customer's purchasing manager. You ask the user for a sample, COA, TDS and SDS, packaging (25 kg bags or big bags), lead time and price per ton. Any numbers are clearly fictional, round numbers." },
  { id: "en_pazarlik", e: "🤝", n: "Pazarlık: indirim isteyen müşteri", d: "The user is the SELLER. You are a customer pushing for a lower price and longer payment terms. You are polite but firm. The user should answer with conditional offers (e.g. a better price only for a larger quantity or a firm order this week) and payment options (cash / 60 days / 90 days) rather than plain discounts, and should never reveal costs or margins. Use clearly fictional, round numbers." },
  { id: "en_rakip", e: "🥊", n: "\"Rakibiniz daha ucuz\" itirazı", d: "The user is the SELLER. You are a customer who says a competitor offered a lower price (clearly fictional, round numbers) and asks the user to match it. Push a little. The user should ask questions (same quality? same terms? delivery?), defend value, and offer only conditional concessions — never reveal costs." },
  { id: "en_artis", e: "📈", n: "Fiyat artışı duyurusu", d: "The user is the SELLER and must tell you, a regular customer, that prices go up next month (clearly fictional, round numbers). You are unhappy, ask why, ask for the old price for one more order. The user should explain briefly (raw materials, freight), give a date, and offer conditional options." },
  { id: "en_takip", e: "📞", n: "Cevapsız teklif takibi (telefon)", d: "The user is the SELLER. The user sent you an offer a week ago and you never answered. Now the user calls to follow up. You are busy and vague at first ('we are still checking'). The user should ask a clear question, agree a next step with a date, and not offer a discount just because you were silent." },
  { id: "en_tahsilat", e: "💰", n: "Ödeme gecikmesi / tahsilat", d: "The user is the SELLER. You are a customer whose payment is two weeks overdue (clearly fictional, round amount). You give excuses and ask for more time. The user should stay polite but firm, ask for a concrete payment date and confirmation in writing." },
  { id: "en_lc", e: "🏦", n: "L/C uyuşmazlığı (banka discrepancy)", d: "The user is the SELLER (the beneficiary). You are a bank officer (trade finance) calling about the user's letter of credit documents: you found a discrepancy (e.g. the date on the bill of lading or the product name on the invoice does not match the L/C). Explain step by step, slowly; ask how they want to proceed (correct documents, ask the buyer to accept the discrepancy)." },
  { id: "en_gecikme", e: "🚢", n: "Tedarikçi sevkiyatı geciktiriyor", d: "The user is the BUYER. You are the supplier's export manager: the shipment will be two weeks late (vessel, production problem). The user worries about demurrage at the port and their own customer. Give vague answers first; the user should ask for a new date in writing, the reason, and who pays demurrage." },
  { id: "en_iban", e: "🛡️", n: "Hesap değişikliği e-postası: bilinen numarayı ara", d: "The user is the BUYER. The user received an e-mail, apparently from the supplier, saying the supplier's bank account has changed and asking for payment to a new account. The user did NOT reply to that e-mail; instead the user calls the supplier on the phone number they already know (from earlier invoices / the contract). You play the REAL supplier's accounts department (accounts receivable clerk): friendly, a little busy. You did NOT change your bank details. When the user explains, you are surprised and concerned, confirm clearly that your bank details are unchanged and that nobody from your company sent that e-mail, ask the user not to pay to the new account, ask them to forward the e-mail to you (as an attachment) and to keep paying only to the account on the contract, and you thank the user for calling to check. Help the user practise: explaining the situation, asking a check question (e.g. the last invoice number or amount, which was not in the e-mail), and confirming in writing. Never ask the user for passwords, card numbers or the full account number on the phone." },
  { id: "en_hassas", e: "🧪", n: "Hassas ürün: önce son kullanıcı belgesi", d: "The user is the SELLER of a sensitive chemical (e.g. hexamine). You are a new buyer who wants the price immediately and a quick shipment, and you are vague about the end use. The user should ask for the end-user certificate and company documents BEFORE talking about price, and confirm the exact product name in writing." },
  { id: "en_sikayet", e: "⚠️", n: "Kalite / gecikme şikâyeti", d: "The user is the SELLER. You are a customer complaining that a shipment is late or that a batch does not match the COA. You want an explanation and a solution." },
  { id: "en_fuar", e: "🎪", n: "Fuarda stant sohbeti", d: "The user is the SELLER at their own booth. You are a visitor at a chemical trade fair stopping at the booth: short small talk, what they offer, exchange business cards, agree to follow up by e-mail." },
  { id: "en_toplanti", e: "🖥️", n: "Online toplantı: açılış ve kapanış", d: "The user is a business partner (buyer or seller — let the user choose). You are a foreign partner opening an online video meeting: check everyone can hear, short small talk, agenda, then at the end summarise next steps and ask the user to confirm by e-mail." },
  { g: "Seyahat & günlük" },
  { id: "en_havalimani", e: "✈️", n: "Havalimanı ve pasaport kontrolü", d: "The user is a traveller. You are an airline check-in agent and then a passport control officer: ticket, luggage, purpose and length of the trip, hotel address." },
  { id: "en_otel", e: "🏨", n: "Otelde giriş", d: "The user is a hotel guest. You are a hotel receptionist: reservation, passport, breakfast time, Wi-Fi, a small problem with the room." },
  { id: "en_restoran", e: "🍽️", n: "Restoranda sipariş", d: "The user is a guest. You are a waiter: table, menu, recommendations, allergies, drinks, the bill, card or cash." },
  { id: "en_taksi", e: "🚕", n: "Taksi ve yol sorma", d: "The user is a passenger. You are a taxi driver and later a passer-by: destination, price, how long, simple directions." },
  { id: "en_sohbet", e: "🍷", n: "İş yemeğinde sohbet", d: "The user is the host or guest at a business dinner. You are a foreign business partner: small talk about travel, Turkey, family, food, the weather; nothing about prices." },
  { id: "en_doktor", e: "🩺", n: "Yurt dışında eczane / doktor", d: "The user is a patient abroad. You are a pharmacist: symptoms, how long, allergies, simple advice, how to take the medicine." }
];
const SCEN = LANG === "en" ? SCEN_EN : SCEN_NL;
/** en: "İş" grubundaki senaryo kimlikleri — iş rol oyunu orta modelle (D1) */
const SCEN_BIZ = new Set((() => { const out = []; let biz = false; SCEN_EN.forEach(s => { if (s.g) biz = /^İş/.test(s.g); else if (biz) out.push(s.id); }); return out; })());
let rp = null, rpToken = 0;
function weekNo() { const d = new Date(); const start = new Date(d.getFullYear(), 0, 1); return Math.floor((d - start) / 604800000); }
function currentMission() {
  const lvl = LV_ORDER.indexOf(profile().level || "A1");
  if (LANG === "en") {
    const done = store.get("missionsDone", []), wk = weekNo();
    const pin = store.get("missionPin", null);
    const pinned = pin && pin.w === wk && C.MISSIONS.find(m => m.id === pin.id);
    if (pinned) return pinned;
    const fit = C.MISSIONS.filter(m => LV_ORDER.indexOf(m.lvl) <= lvl + 1);
    if (!fit.length) return null;
    const own = fit.filter(m => m.lvl === (profile().level || "A1") && !done.includes(m.id));
    const open = fit.filter(m => !done.includes(m.id)).sort((x, y) => LV_ORDER.indexOf(x.lvl) - LV_ORDER.indexOf(y.lvl));
    const m = own[0] || open[0] || fit[wk % fit.length];
    store.set("missionPin", { w: wk, id: m.id });
    return m;
  }
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
      ${LANG === "en" ? (store.get("missionsDone", []).includes(m.id) ? `<div class="tag ok" style="margin-top:8px">✅ Bu haftanın görevi yapıldı (+10 ⭐)</div>` : `<button class="btn primary block" style="margin-top:8px" data-act="missionDone" data-id="${esc(m.id)}">✅ Yaptım</button>`) : ""}
      <details style="margin-top:8px"><summary>${LANG === "en" ? "💬 Nasıl geçti? (isteğe bağlı)" : "✅ Yaptım! Nasıl geçti?"}</summary>
        <textarea id="debIn" placeholder="Türkçe anlat: ne oldu, nerede zorlandın?" style="margin-top:8px"></textarea>
        <button class="btn primary block" style="margin-top:8px" data-act="debrief" data-id="${esc(m.id)}">Koçuma anlat</button><div id="debOut" aria-live="polite"></div></details>
      <p class="small muted" style="margin:8px 0 0">Gerçek hayatta konuşmak en büyük puanı getirir: +10 ⭐</p></div>` : ""}
    <div class="card">
      <h2 style="margin-top:0">🎭 Konuşma pratiği</h2>
      <p class="muted small" style="margin-top:0">Yapay zekâ bir rol üstlenir, sen ${L.ad} cevap verirsin. Her cevabına puan ve düzeltme gelir.</p>
      <label class="f" for="rpLevel">Seviye</label>
      <select id="rpLevel">${["başlangıç", "orta", "ileri"].map(l => `<option value="${l}" ${l === store.get("rpLevel", "başlangıç") ? "selected" : ""}>${AT.rpLevels[l]}</option>`).join("")}</select>
      ${LANG === "en" ? scenGroupsEN() : `<div class="opts">${SCEN.map(s => s.g ? `<h3 style="margin:10px 0 0">${esc(s.g)}</h3>` : `<button class="opt" data-act="rpStart" data-id="${s.id}">${s.e} <b>${esc(s.n)}</b></button>`).join("")}</div>`}
    </div>`;
  $("#rpLevel").onchange = e => store.set("rpLevel", e.target.value);
  $$("#v-pratik details.scen-g").forEach(d => d.addEventListener("toggle", e => { if (e.target !== d) return; const o = store.get("scenOpen", {}); o[d.dataset.g] = d.open; store.set("scenOpen", o); }));
  $$("#v-pratik details.scen-more").forEach(d => d.addEventListener("toggle", () => store.set("scenMore", d.open)));
}
/** en (v8.2): 21 senaryo ≈3 ekran → gruplar katlanır; iş grubu açık, diğerleri kapalı (açık/kapalı hatırlanır) */
function scenGroupsEN() {
  const groups = []; SCEN_EN.forEach(s => { if (s.g) groups.push({ g: s.g, items: [] }); else if (groups.length) groups[groups.length - 1].items.push(s); });
  const open = store.get("scenOpen", {});
  const btn = s => `<button class="opt" data-act="rpStart" data-id="${s.id}">${s.e} <b>${esc(s.n)}</b></button>`;
  // v8.3: iş grubunda ilk 6 senaryo görünür, kalanı "Daha fazla ▸" altında (açık/kapalı hatırlanır) — ana ekran kısalsın
  const more = !!store.get("scenMore", false);
  return groups.map((x, i) => `<details class="scen-g" data-g="${i}" ${(open[i] != null ? open[i] : i === 0) ? "open" : ""}><summary><b>${esc(x.g)}</b> <span class="small muted">(${x.items.length})</span></summary>
    ${i === 0 && x.items.length > 7 ? `<div class="opts">${x.items.slice(0, 6).map(btn).join("")}</div>
    <details class="scen-more" ${more ? "open" : ""}><summary class="small"><b>Daha fazla ▸</b> <span class="muted">(${x.items.length - 6} senaryo daha)</span></summary><div class="opts">${x.items.slice(6).map(btn).join("")}</div></details>`
      : `<div class="opts">${x.items.map(btn).join("")}</div>`}</details>`).join("");
}
/** en: görevi tek dokunuşla tamamla (not isteğe bağlı) */
function missionMark(id) {
  const done = store.get("missionsDone", []); if (done.includes(id)) return false;
  done.push(id); store.set("missionsDone", done); Progress.addXP(10); Progress.markStreakDay(); App.renderStats(); return true;
}
ACT.missionDone = el => { if (missionMark(el.dataset.id)) { haptic([20, 40, 20]); toast("🎉 Tebrikler! +10 ⭐"); } renderPractice(); };
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
        <div class="row"><button class="btn primary grow" id="rpMic" data-act="rpMic">🎤 ${L.ad} cevap ver</button><button class="btn" data-act="rpHelp">🆘 Yardım</button></div>
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
    const enBiz = LANG === "en" && SCEN_BIZ.has(rp.sc.id); // D1: iş senaryosu → core practice + ctx "is" → orta model
    const r = await callClaude({ feature: "practice", kind: "rp", system: sysRP(/^(vdab|mulakat|ladder|cv)/.test(String(rp.sc.id)) ? "career" : (LANG === "en" && SCEN_BIZ.has(rp.sc.id)) ? "is" : ""), schema: SCHEMA.rp, timeout: 60000,
      ...(enBiz ? { ctx: "is" } : {}),
      content: LANG === "en" // D2: önceki konuşma <context>, kullanıcının yeni satırı <user_text>
        ? `Scenario: ${rp.sc.d}\nLevel: ${rp.level}\n\n<context>\nConversation so far:\n${tagSafe(history)}\n</context>\n\nUser's latest line:\n<user_text>${tagSafe(line)}</user_text>`
        : `Scenario: ${rp.sc.d}\nLevel: ${rp.level}\n\nConversation so far:\n${history}\n\nUser's latest line: ${line}` });
    if (my !== rpToken || !rp) return; // kullanıcı senaryodan çıktı: eski cevabı yazma
    busyEl().innerHTML = "";
    if (!cmd) { rp.lines.push({ who: "user", t: line }); rp.total += Math.max(0, Math.min(3, r.puan)); rp.n++; }
    rp.lines.push({ who: "role", t: r.musteri_nl });
    const p = Math.max(0, Math.min(3, r.puan));
    if (LANG === "en" && r.kural_tr) rpPush(salesWarn(r.kural_tr));
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
  Speech.listen({ lang: store.get("srLang", L.sr), owner: "rp", onText: t => { live.textContent = t; },
    onDone: t => { el.textContent = `🎤 ${L.ad} cevap ver`; live.classList.add("hidden"); if (!t) { toast("Ses duyulmadı"); return; } if (rp && rp.busy) { const i = $("#rpText"); if (i) i.value = t; toast("Cevap bekleniyor — söylediğin kutuya yazıldı"); return; } rpTurn(t); },
    onError: c => { el.textContent = `🎤 ${L.ad} cevap ver`; live.classList.add("hidden"); const b = $("#rpBusy"); if (c !== "cancelled" && b) b.innerHTML = errBox(Speech.errorText(c)); } });
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
      <select id="docType" data-keep="type">${Object.entries(AT.docTypes).map(([k, v]) => `<option value="${k}" ${k === H.type ? "selected" : ""}>${v}</option>`).join("")}</select>
      <div class="warnbox" style="margin-top:10px">🔒 Fotoğraf telefonda saklanmaz, yalnız okunmak için Claude'a gider. İstersen kimlik numarasını (${L.belgium ? "rijksregisternummer" : "TC kimlik / pasaport no"}) ve hesap numaranı kapatarak çek.</div>
      <div class="row" style="margin-top:10px">
        <label class="btn primary" style="display:inline-flex;align-items:center">📷 Fotoğraf çek<input type="file" accept="image/*" capture="environment" class="hidden" id="docCam"></label>
        <label class="btn" style="display:inline-flex;align-items:center">🖼 Galeriden<input type="file" accept="image/*" multiple class="hidden" id="docGal"></label>
      </div>
      <div class="small" id="docFilesInfo" style="margin-top:6px"></div>
      <label class="f" for="docText">ya da metni yapıştır</label>
      <textarea id="docText" data-keep="text" placeholder="Mektubun ya da mesajın metni…">${esc(H.text || "")}</textarea>
      <label class="f" for="docNote">Not (isteğe bağlı) — ör. ${L.belgium ? `"bu ay 120 saat çalıştım"` : `"bu tedarikçinin ilk teklifi"`}</label>
      <input type="text" id="docNote" data-keep="note" value="${esc(H.note || "")}">
      <button class="btn primary block" style="margin-top:12px" data-act="docGo">Açıkla</button>
      </div><div id="docOut" aria-live="polite"></div>
      <p class="small muted">Bu bir hukuki danışmanlık değildir. ${L.belgium ? "Önemli kararlardan önce yazan kuruma ya da ücretsiz danışma noktalarına (OCMW, sendika, Justitiehuis) sor." : "Önemli kararlardan önce yazan firmaya ya da bir uzmana (avukat, mali müşavir) sor."}</p>`;
    // fotoğraf eklenince sayfayı baştan çizme: yazılanlar ve seçilen tür kaybolmasın
    const add = e => { docFiles = [...docFiles, ...Array.from(e.target.files || [])].slice(0, 4); e.target.value = ""; docFilesInfo(); };
    $("#docCam").onchange = add; $("#docGal").onchange = add;
    keepFields(); docFilesInfo();
    return;
  }
  if (H.mode === "write") {
    $("#v-yardim").innerHTML = back + `<div class="card"><h2 style="margin-top:0">✉️ Mesaj yaz / düzelt</h2>
      <p class="small muted" style="margin-top:0">Uygulama hiçbir şey göndermez: metni kopyalayıp kendin gönderirsin.</p>
      <label class="f" for="wTo">Kime?</label><select id="wTo" data-keep="wto">${Object.entries(AT.wTo).map(([k, v]) => `<option value="${k}" ${k === H.wto ? "selected" : ""}>${v}</option>`).join("")}</select>
      <label class="f" for="wCh">Nereden?</label><select id="wCh" data-keep="wch"><option value="WhatsApp/SMS" ${H.wch !== "e-mail" ? "selected" : ""}>WhatsApp / SMS</option><option value="e-mail" ${H.wch === "e-mail" ? "selected" : ""}>E-posta</option></select>
      <div class="chips" style="margin-top:10px" role="group" aria-label="Mod"><button class="chip" data-act="wMode" data-m="duzelt" aria-pressed="${H.wmode === "duzelt"}">${LANG === "en" ? "✍️ Düzelt" : "✍️ Ben yazdım, düzelt"}</button><button class="chip" data-act="wMode" data-m="yaz" aria-pressed="${H.wmode !== "duzelt"}">${LANG === "en" ? "🇹🇷 Türkçe anlat" : "🇹🇷 Türkçe anlatayım, sen yaz"}</button></div>
      <textarea id="wIn" data-keep="win" placeholder="${H.wmode === "duzelt" ? `${L.ad} denemeni yaz — önce kendin dene, sonra düzeltelim` : L.belgium ? "Ne demek istediğini Türkçe yaz: ör. 'şefime bugün hasta olduğumu, doktora gideceğimi söyle'" : "Ne demek istediğini Türkçe yaz: ör. 'numuneyi kargoladığımızı, takip numarasını yarın göndereceğimi yaz'"}">${esc(H.win || "")}</textarea>
      <button class="btn primary block" style="margin-top:10px" data-act="wGo">Hazırla</button></div><div id="wOut" aria-live="polite"></div>`;
    keepFields();
    return;
  }
  if (H.mode === "phone") {
    $("#v-yardim").innerHTML = back + `<div class="card"><h2 style="margin-top:0">📞 Telefon görüşmesine hazırlan</h2>
      <p class="small muted" style="margin-top:0">Görüşme sırasında telefon mikrofonu uygulamaya verilmez; o yüzden önceden hazırlanıp cümleleri ekranda açık tut.</p>
      <label class="f" for="pWho">Kimi arıyorsun?</label><input type="text" id="pWho" placeholder="${L.belgium ? "ör. aile hekimi, belediye, interim ajansı" : "ör. tedarikçi, müşteri, otel"}">
      <label class="f" for="pGoal">Ne istiyorsun? (Türkçe)</label><textarea id="pGoal" placeholder="ör. yarın için randevu almak istiyorum"></textarea>
      <button class="btn primary block" style="margin-top:10px" data-act="pGo">Hazırla</button></div><div id="pOut" aria-live="polite"></div>
      <div class="card"><h3>🆘 Görüşmede kurtaran cümleler</h3>${AT.phone.map(x => `<div class="phrase"><button class="ibtn" data-act="say" data-say="${esc(x[0])}" aria-label="Sesli oku">🔊</button><div class="t"><b>${esc(x[0])}</b><div class="okn small">${esc(x[2])}</div><div class="small">🇹🇷 ${esc(x[1])}</div></div><button class="ibtn" data-act="show" data-nl="${esc(x[0])}" data-tr="${esc(x[1])}"${LANG === "en" ? ` data-ok="${esc(x[2] || "")}"` : ""} aria-label="Büyük göster">📢</button></div>`).join("")}</div>`;
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
    $("#v-yardim").innerHTML = back + `<div class="card" style="line-height:1.6"><h2 style="margin-top:0">🗺️ ${L.ad} yol haritası</h2>${safe}</div>`;
    return;
  }
  $("#v-yardim").innerHTML = `
    <h2>Bugün neye yardım edeyim?</h2>
    <div class="grid2">
      <button class="tile" data-act="helpGo" data-m="doc"><div class="e">📄</div><div class="n">Mektup / belge oku</div><div class="small muted">fotoğraf → Türkçe açıklama</div></button>
      ${L.belgium ? `<button class="tile" data-act="helpGo" data-m="doc" data-t="bordro"><div class="e">💶</div><div class="n">Maaş bordrom</div><div class="small muted">brüt, net, kesintiler</div></button>` : `<button class="tile" data-act="helpGo" data-m="doc" data-t="teknik"><div class="e">🧪</div><div class="n">Teknik belge oku</div><div class="small muted">COA, TDS, SDS</div></button>`}
      <button class="tile" data-act="helpGo" data-m="write"><div class="e">✉️</div><div class="n">Mesaj yaz / düzelt</div><div class="small muted">${L.belgium ? "şefe, ev sahibine, okula" : "müşteriye, tedarikçiye"}</div></button>
      <button class="tile" data-act="helpGo" data-m="phone"><div class="e">📞</div><div class="n">Telefon hazırlığı</div><div class="small muted">ne diyeceğim, ne sorarlar</div></button>
      ${L.belgium && (C.CHECKLIST.items || []).length ? `<button class="tile" data-act="helpGo" data-m="check"><div class="e">✅</div><div class="n">İlk 12 ay listesi</div><div class="small muted">belediye, sigorta, banka…</div></button>` : ""}
      ${L.belgium || C.ROADMAP ? `<button class="tile" data-act="helpGo" data-m="road"><div class="e">🗺️</div><div class="n">Dil yol haritası</div><div class="small muted">${L.belgium ? "kurs, seviye, VDAB" : "seviye, kaynaklar"}</div></button>` : ""}
      ${EXT.helpTiles.map(t => `<button class="tile" data-act="helpGo" data-m="${esc(t.mode)}"><div class="e">${esc(t.e)}</div><div class="n">${esc(t.n)}</div><div class="small muted">${esc(t.d || "")}</div></button>`).join("")}
    </div>
    ${L.belgium ? `<div class="dangerbox" style="margin-top:12px">🚨 Acil: <b>112</b> (ambulans, itfaiye) · <b>101</b> (polis) · Mesai dışı, acil olmayan doktor: <b>1733</b><br><span class="small">Şiddet: <b>1712</b> · Zehirlenme: <b>070 245 245</b> · Konuşmak için (7/24): <b>106</b> · İntihar düşüncesi: <b>1813</b> — numaraları kontrol et</span></div>`
      : `<p class="small muted" style="margin-top:12px">🚨 Acil: <b>112</b> (Türkiye ve Avrupa'nın çoğu; yurt dışında oranın numarasını kontrol et)</p>`}`;
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
/** TC kimlik no sağlama (11 hane, ilk hane 1-9, 10. ve 11. hane kontrol hanesi) — lot/sipariş numaraları maskelenmesin */
function tcValid(s) {
  if (!/^[1-9]\d{10}$/.test(s)) return false;
  const d = s.split("").map(Number);
  const d10 = ((d[0] + d[2] + d[4] + d[6] + d[8]) * 7 - (d[1] + d[3] + d[5] + d[7])) % 10;
  return (d10 + 10) % 10 === d[9] && d.slice(0, 10).reduce((a, b) => a + b, 0) % 10 === d[10];
}
function maskPII(t) {
  if (LANG === "en") // Belçika rijksregister deseni burada lot numaralarını yiyordu: yerine TC kimlik no + her ülkenin IBAN'ı
    return String(t) // IBAN: küçük harf, tire ve çift boşluk da yakalanır (grup arası [ \t-]); en az 10 rakam şartı düz yazıyı korur
      .replace(/\b[1-9]\d{10}\b/g, m => tcValid(m) ? "[TC kimlik no gizlendi]" : m)
      .replace(/\b[A-Z]{2}\d{2}(?:[ \t-]{0,3}[A-Z0-9]{4}){2,7}(?:[ \t-]{0,3}[A-Z0-9]{1,4})?\b/gi, m => {
        // v8.3: aday arkasındaki kelimeyi de yutabiliyordu ("… 7034 Bank Fortis" → "…RTIS"). Ülkenin IBAN uzunluğuna kırp;
        // bilinmeyen ülkede 15–34 arası mod-97 tutan en uzun parça, o da yoksa sondaki yalnız-harf gruplarını at. Son 4 = gerçek son 4 hane.
        const LEN = { BE: 16, NL: 18, AT: 20, CH: 21, DE: 22, GB: 22, AE: 23, ES: 24, TR: 26, IR: 26, FR: 27, IT: 27, PL: 28 };
        const mod97 = x => { let r = 0; for (const ch of x.slice(4) + x.slice(0, 4)) { const v = parseInt(ch, 36); if (isNaN(v)) return false; r = (r * (v > 9 ? 100 : 10) + v) % 97; } return r === 1; };
        const c = m.replace(/[\s-]/g, "").toUpperCase(), want = LEN[c.slice(0, 2)];
        let n = 0;
        if (want && c.length >= want) n = want;
        else if (!want) for (let k = Math.min(34, c.length); k >= 15 && !n; k--) if (mod97(c.slice(0, k))) n = k;
        if (!n) { const g = m.split(/[ \t-]+/); while (g.length > 3 && /^[A-Z]+$/i.test(g[g.length - 1])) g.pop(); n = g.join("").length; }
        const iban = c.slice(0, n); if ((iban.match(/\d/g) || []).length < 10) return m;
        let cut = 0; for (let seen = 0; cut < m.length && seen < n; cut++) if (/[A-Z0-9]/i.test(m[cut])) seen++;
        const rest = m.slice(cut);
        return iban.slice(0, 4) + " **** **** " + iban.slice(-4) + (/^[A-Z0-9]/i.test(rest) ? " " : "") + rest;
      });
  return String(t)
    .replace(/\b\d{2}[.\s]?\d{2}[.\s]?\d{2}[-\s]?\d{3}[.\s]?\d{2}\b/g, "[rijksregisternummer gizlendi]")
    .replace(/\b([A-Z]{2}\d{2})[\s]?((?:\d{4}[\s]?){2,6})(\d{4})\b/gi, (m, a, mid, last) => a + " **** **** " + last);
}
const ACCT_HIT = "hesap değişikliği";
/** en: banka hesabı değişikliği dili (İngilizce + Türkçe) — BEC (sahte "hesabımız değişti" e-postası) kalkanı; canlı altyazı da kullanır (window) */
const ACCT_CHANGE_RE = (() => { const S = /\b(new|updated?|changed?|change of|change in|different|alternative)\s+(our\s+|the\s+)?(bank(ing)?\s+(account|details|info(rmation)?)|(account|acct|a\/c)\s+(details|number|no\.?)|beneficiary|remittance\s+details|IBAN|SWIFT)\b|\b(bank(ing)?|account|payment)\s+details\s+(have|has)\s+(been\s+)?(changed|updated)|\bSWIFT\s+(code\s+)?(change|update)|\b(revised|updated|new)\s+bank\s+(letter|details|information)\b|\bSWIFT\b[^.]{0,40}\b(updated|changed)\b|\bdisregard\b[^.]{0,60}\bbank\s+(details|account|information)\b|\bno longer\s+(use|using)\s+(\S+\s+){0,3}(bank\s+)?(account|IBAN)\b|\b(have|has)\s+(now\s+)?(switched|changed|moved)\s+(our\s+)?banks?\b|\bhesap\s+değişikli|\byeni\s+(IBAN|banka\s+hesab)|\b(hesap|banka)\s+(numaramız|numarası|bilgilerimiz|bilgileri|hesabımız|hesabı)\s+değiş|IBAN\S*\s*değiş|\bbundan\s+sonra\s+(tüm\s+)?ödemeler\S*[^.]{0,40}(hesab|IBAN)/i, W = /\b(new|other|alternative|following|different)\s+(bank\s+)?(account|acct|a\/c)\b(?!\s+(manager|executive|team|rep|representative|director|management)\b)|\baccount\s+(is|has been|was)\s+(blocked|closed|frozen|suspended|under audit)\b|\bswitched\s+banks?\b|\bchanged?\s+(our\s+)?banks?\b|\b(aşağıdaki|yeni|diğer)\s+hesab|\bbloke\b|\bhesab\S*\s+değil\b|\byeni\s+hesap/i, P = /\b(pay|paying|payment|payments|remit|remittance|transfer|wire|invoice|IBAN|SWIFT|beneficiary)\b|\b[A-Z]{2}\d{2}\s?\d{4}|öde|havale/i; return { test: t => S.test(t) || (W.test(t) && P.test(t)) }; })(); // güçlü desen tek başına; zayıf desen (ör. "new account", "bloke") yalnız ödeme kelimesiyle — yanlış alarm olmasın
/** Model ne derse desin: bağlantı, IBAN ya da tipik dolandırıcılık kelimesi varsa sabit uyarı göster */
function scamSignals(text) {
  const t = String(text || "");
  const hits = [];
  if (/https?:\/\/|www\.|bit\.ly|\.link\b/i.test(t)) hits.push("bağlantı (link)");
  if (LANG === "en") {
    // IBAN: önce boşluk/tire normalize, büyük-küçük harf fark etmez; en az 10 rakam (düz yazı "No25 with your best" IBAN sayılmasın)
    let iban = false; t.replace(/[\s-]+/g, " ").replace(/\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,4})?\b/gi, m => { if ((m.match(/\d/g) || []).length >= 10) iban = true; return m; });
    if (iban || /\bIBAN\b/i.test(t)) hits.push("hesap numarası (IBAN)");
    // ödeme aciliyeti (sert) — IBAN ile birlikteyse hesap değişikliği gibi kırmızı say; "ASAP" tek başına yumuşak sinyal
    const urgHard = /kindly remit|urgent(ly)?\s+(payment|transfer|wire)|wire\s+(it\s+|the\s+(funds|money|payment|amount)\s+)?(immediately|today|urgently)|pay(ment)?\s+(immediately|today|urgently)|remit\b.*\burgent|transfer\s+(immediately|today)|confidential(ly)?\s+(payment|transfer)|\b(keep|treat)\s+(this|it)\s+(as\s+)?(confidential|private|between us)\b|\bin a meeting\b|\bcan'?(not|t) talk\b|\bjust (do|make) the (transfer|payment)\b|acil\s+(ödeme|havale)|hemen\s+(öde|havale)|bugün\s+içinde\s+(öde|havale)/i.test(t);
    const urgSoft = /\bASAP\b|as soon as possible|bugün\s+içinde|\bacil\b/i.test(t);
    if (ACCT_CHANGE_RE.test(t) || (iban && urgHard)) hits.push(ACCT_HIT);
    if (urgHard || urgSoft) hits.push("dolandırıcılarda sık görülen kelimeler");
    return hits;
  }
  if (/\bBE\d{2}[\s\d]{8,}/i.test(t)) hits.push("hesap numarası (IBAN)");
  if (/itsme|bpost|pakket|colis|douane|betaal (nu|vandaag|onmiddellijk)|uw rekening (is )?geblokkeerd|verifieer|bevestig uw gegevens/i.test(t)) hits.push("dolandırıcılarda sık görülen kelimeler");
  return hits;
}
window.ACCT_CHANGE_RE = ACCT_CHANGE_RE; window.scamSignals = scamSignals; window.ACCT_HIT = ACCT_HIT; // D3: canlı altyazı (live.js)
/** en: hesap değişikliği yakalanınca model ne derse desin gösterilen sabit kırmızı uyarı */
const ACCT_WARN = `<div class="dangerbox" role="alert" style="margin-top:8px;border:2px solid var(--danger)">🏦 <b>Hesap değişikliği:</b> mesajdaki numarayı kullanma; firmayı bildiğin numaradan ara ve mesajda geçmeyen bir soruyla doğrula. Yeni hesaba ilk ödemede çift onay.<div class="small" style="margin-top:4px;font-weight:400">Bu uyarı metindeki kelimelerden otomatik çıktı; cümleyi kendin de kontrol et.</div></div>`;
/** en (v8.2): uzun formdan sonra sonuç ekranın altında kalmasın */
function resultIntoView(sel) { requestAnimationFrame(() => { const el = $(sel); if (el && el.firstElementChild) el.scrollIntoView({ block: "start", behavior: "smooth" }); }); }
/** C1: satış kuralı uyarısı (sonucun üstünde sarı kutu) */
const salesWarn = t => t ? `<div class="salesbox" role="alert">⚠️ <b>Satış kuralı:</b> ${esc(t)}</div>` : "";
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
    const EN = LANG === "en";
    if (EN && ["lc", "fatura", "sozlesme"].includes(type) && r.risk === "yesil") r.risk = "sari"; // en: para/evrak belgesinde taban sarı
    const sig = scamSignals(rawText + " " + r.tutarlar.map(x => x.alinti_nl).join(" ") + " " + r.tarihler.map(x => x.alinti_nl).join(" ") + " " + r.odeme_uyarisi_tr);
    // en (D3): hesap değişikliği dili (ya da IBAN + ödeme aciliyeti) → model ne derse desin kırmızı
    const acct = EN && sig.includes(ACCT_HIT); if (acct) r.risk = "kirmizi";
    const IBAN_SIG = "hesap numarası (IBAN)", onlyIban = EN && !acct && sig.length > 0 && sig.every(x => x === IBAN_SIG);
    const otherSig = sig.filter(x => x !== IBAN_SIG && x !== ACCT_HIT);
    // en: B2B dili — tüketici "resmî siteden kontrol et" yerine sözleşme/önceki fatura + bilinen numara
    const shieldEN = acct ? (otherSig.length ? `<div class="dangerbox" style="margin-top:8px">🛡️ <b>Ayrıca:</b> bu belgede ${esc(otherSig.join(", "))} var. Linkten ödeme ya da giriş yapma.</div>` : "")
      : onlyIban ? `<div class="note" style="margin-top:8px">🏦 Belgede hesap numarası (IBAN) var. Ödemeden önce bu firmanın <b>önceki faturası ya da sözleşmesindeki</b> hesapla karşılaştır; farklıysa ödeme yapma, firmayı bildiğin numaradan ara.</div>`
      : (sig.length || r.odeme_uyarisi_tr) ? `<div class="dangerbox" style="margin-top:8px">🛡️ <b>Ödeme kontrolü:</b> ${sig.length ? `bu belgede ${esc(sig.join(", "))} var. ` : ""}Linkten ödeme ya da giriş yapma. Banka bilgisini yalnız sözleşmeden / önceki faturadan al; e-postada bir değişiklik varsa firmayı bildiğin numaradan (e-postadakinden değil) ara.</div>` : "";
    const riskTxt = { yesil: "🟢 Bilgi amaçlı", sari: "🟡 Bir şey yapman gerekebilir", kirmizi: "🔴 Önemli / acil — yardım al" }[r.risk] || "🟡";
    $("#docOut").innerHTML = `<div class="card risk-${esc(r.risk)}">
      <div class="row between"><b>${esc(r.belge_turu)}</b><span class="tag ${r.risk === "kirmizi" ? "bad" : r.risk === "yesil" ? "ok" : "warn"}">${riskTxt}</span></div>
      ${r.gonderen ? `<div class="small muted">Gönderen: ${esc(r.gonderen)}</div>` : ""}
      <p style="font-size:1.05rem">${esc(r.ozet_tr)}</p>
      ${acct ? ACCT_WARN : ""}
      ${r.risk_neden_tr ? `<div class="${r.risk === "kirmizi" ? "dangerbox" : "note"}">${esc(r.risk_neden_tr)}</div>` : ""}
      ${r.yapilacaklar.length ? `<h3 style="margin-top:12px">${r.eylem_gerekli ? "Yapman gerekenler" : "Öneriler"}</h3><ol>${r.yapilacaklar.map(x => `<li>${esc(x)}</li>`).join("")}</ol>` : ""}
      ${r.tarihler.length ? `<h3>📅 Belgedeki tarihler</h3>${r.tarihler.map(d => `<div class="phrase"><div class="t"><b>${esc(d.tarih)}</b> — ${esc(d.amac_tr)}<div class="small muted">“${esc(d.alinti_nl)}”</div></div></div>`).join("")}` : ""}
      ${r.tutarlar.length ? `<h3>💶 Belgedeki tutarlar</h3>${r.tutarlar.map(d => `<div class="phrase"><div class="t"><b>${esc(d.tutar)}</b> — ${esc(d.aciklama_tr)}<div class="small muted">“${esc(d.alinti_nl)}”</div></div></div>`).join("")}` : ""}
      ${r.odeme_uyarisi_tr ? `<div class="dangerbox" style="margin-top:8px">💳 ${esc(r.odeme_uyarisi_tr)}</div>` : ""}
      ${EN ? shieldEN : sig.length || r.odeme_uyarisi_tr ? `<div class="dangerbox" style="margin-top:8px">🛡️ <b>Dolandırıcılık kontrolü:</b> ${sig.length ? `bu belgede ${esc(sig.join(", "))} var. ` : ""}Mesajdaki linke tıklama, oradan ödeme yapma. Hesap numarasını eski faturan ya da resmî siteden kontrol et; şüphelenirsen bilinen numaradan ara. ${L.belgium ? "Şüpheli mesajı <b>suspicious@safeonweb.be</b> adresine iletebilirsin (kontrol et)." : ""}</div>` : ""}
      ${EN && type === "lc" ? `<div class="note" style="margin-top:8px">🏦 Bu bir banka görüşü değildir; evrakı UCP 600'e göre bankan inceler.</div>` : ""}
      ${r.kime_sor_tr ? `<div class="note">❓ Kime sorabilirsin: ${esc(r.kime_sor_tr)}</div>` : ""}
      ${r.cevap_taslagi_nl ? `<h3 style="margin-top:12px">✉️ Cevap taslağı (kendin gönderirsin)</h3><div class="copybox">${esc(r.cevap_taslagi_nl)}</div><div class="small">🇹🇷 ${esc(r.cevap_taslagi_tr)}</div><button class="btn sm" style="margin-top:6px" data-act="copy" data-text="${esc(r.cevap_taslagi_nl)}">📋 Kopyala</button>` : ""}
      ${r.yeni_kelimeler.length ? `<details style="margin-top:10px"><summary>📚 Bu belgedeki yeni kelimeler (${r.yeni_kelimeler.length})</summary>${r.yeni_kelimeler.map(w => `<div class="phrase"><div class="t"><b>${esc(w.nl)}</b><div class="okn small">${esc(w.okunus)}</div><div class="small">🇹🇷 ${esc(w.tr)}</div></div><button class="ibtn" data-act="add" data-nl="${esc(w.nl)}" data-tr="${esc(w.tr)}" data-ok="${esc(w.okunus)}" data-src="Belge" aria-label="Kartlarıma ekle">➕</button></div>`).join("")}</details>` : ""}
      <p class="small muted" style="margin-bottom:0">Tarih ve tutarları belgenin kendisinden bir daha kontrol et. Yapay zekâ yanılabilir.</p></div>`;
    if (EN) resultIntoView("#docOut");
    Progress.addXP(3);
  } catch (e) { $("#docOut").innerHTML = e.code === "abort" ? "" : errBox(e); }
  el.disabled = false;
};
ACT.copy = async el => { try { await navigator.clipboard.writeText(el.dataset.text); toast("Kopyalandı 📋"); } catch { toast("Kopyalanamadı — metni basılı tutup kopyala"); } };
ACT.wMode = el => {
  const i = $("#wIn"); if (i) App.help.win = i.value; App.help.wto = $("#wTo").value; App.help.wch = $("#wCh").value;
  App.help.wmode = el.dataset.m; renderHelp();
};
/** Mesaj yazıcının alıcı tarifleri: en'de RECIPIENTS_EN (core.js), nl'de eski Belçika tarifleri */
const wRecipients = () => (LANG === "en" && typeof RECIPIENTS_EN !== "undefined") ? RECIPIENTS_EN : RECIPIENTS;
ACT.wGo = async el => {
  const txt = ($("#wIn").value || "").trim(); if (!txt) { toast("Önce yaz"); return; }
  el.disabled = true; $("#wOut").innerHTML = spinner("Hazırlanıyor…");
  try {
    const r = await callClaude({ feature: "write", kind: "write", system: sysWrite($("#wTo").value, $("#wCh").value), schema: SCHEMA.write,
      content: `Recipient: ${wRecipients()[$("#wTo").value] || $("#wTo").value}\nChannel: ${$("#wCh").value}\nMode: ${App.help.wmode === "duzelt" ? "duzelt" : "yaz"}\n${LANG === "en" ? `Text:\n<user_text>${tagSafe(maskPII(txt))}</user_text>` : `Text: """${txt}"""`}` });
    const full = (r.konu_nl ? `${LANG === "en" ? "Subject" : "Onderwerp"}: ${r.konu_nl}\n\n` : "") + r.mesaj_nl;
    const wAcct = LANG === "en" && scamSignals(txt).includes(ACCT_HIT); // en (D3): yapıştırılan e-postada hesap değişikliği
    $("#wOut").innerHTML = `<div class="card">${wAcct ? ACCT_WARN : ""}${r.uyari_tr ? (LANG === "en" ? salesWarn(r.uyari_tr) : `<div class="dangerbox" style="margin-bottom:8px">⚠️ ${esc(r.uyari_tr)}</div>`) : ""}
      ${r.konu_nl ? `<div class="small muted">Konu: <b>${esc(r.konu_nl)}</b></div>` : ""}<div class="copybox">${esc(r.mesaj_nl)}</div>
      <div class="small" style="margin-top:6px">🇹🇷 ${esc(r.geri_ceviri_tr)}</div>
      ${r.aciklama_tr ? `<div class="note">💡 ${esc(r.aciklama_tr)}</div>` : ""}
      <div class="row" style="margin-top:8px"><button class="btn primary" data-act="copy" data-text="${esc(full)}">📋 Kopyala</button><button class="btn" data-act="say" data-say="${esc(r.mesaj_nl)}">🔊 Dinle</button></div>
      <p class="small muted" style="margin-bottom:0">[Köşeli parantezleri] kendin doldur. Göndermeden önce bir kez oku.</p></div>`;
    if (LANG === "en") resultIntoView("#wOut");
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
/* ---------------- Öğrenilen dil seçimi (Felemenkçe / İngilizce) ---------------- */
/** Ham localStorage: bu dilde tanıtım hiç açılıp kapandı mı? (store anahtarları dile göre önekli) */
const onbSeen = code => { try { return localStorage.getItem(code === "nl" ? "dk_onb" : "dk_" + code + "_onb") != null; } catch { return true; } };
/** Dili değiştir ve yeniden yükle (içerik açılışta seçilir). tabName yoksa açılış sekmesi/tanıtım normal akar. */
function switchLang(code, tabName) {
  if (!LANGS[code]) return;
  try { if (window.LiveUI && LiveUI.isActive && LiveUI.isActive()) LiveUI.stop("tab"); Speech.stopAll(); } catch { }
  // C8: geçici dil (sessionStorage dk_lang_tmp) kalıcı seçimi ezmesin — lang.js yardımcısı (demo adresinde parametreler korunsun diye elle)
  if (typeof window.setLangPermanent === "function" && !DEMO) {
    // v8.3 (en): İngilizceyi kalıcı yaparken ?mode=live gibi parametreler düşmesin (nl'ye dönüş: eski davranış, yalnız ?tab=)
    let extra = "";
    if (code === "en") { const q = new URLSearchParams(location.search); q.delete("lang"); q.delete("tab"); extra = q.toString(); }
    window.setLangPermanent(code, tabName || "", extra); return;
  }
  try { sessionStorage.removeItem("dk_lang_tmp"); } catch { }
  store.set("lang", code);
  const q = new URLSearchParams(location.search); q.delete("lang"); q.delete("tab"); q.delete("mode");
  if (tabName) q.set("tab", tabName);
  const qs = q.toString();
  location.replace(location.pathname + (qs ? "?" + qs : ""));
}
const langCard = () => `<div class="card" id="langCard"><h3 style="margin:0 0 8px">🌍 Öğrendiğin dil: ${L.flag} ${esc(L.ad)}</h3>
    <div class="grid2">${Object.values(LANGS).map(x => `<button class="btn ${x.code === LANG ? "primary" : ""}" data-act="setLang" data-l="${x.code}" aria-pressed="${x.code === LANG}">${x.flag} ${esc(x.ad)}</button>`).join("")}</div>
    <div class="small muted" style="margin-top:6px">Her dilin ilerlemesi, kartları ve profili ayrı saklanır.</div></div>`;
ACT.setLang = el => {
  const code = el.dataset.l; if (!LANGS[code] || code === LANG) return;
  if (!confirm(`${LANGS[code].ad}ye geçilsin mi? Her dilin ilerlemesi ayrı saklanır; geri dönünce ${L.ad} kaldığın yerden devam eder.`)) return;
  // o dilde tanıtım hiç görülmediyse sekmesiz aç: tanıtım (ad, seviye, mikrofon) çalışsın
  switchLang(code, onbSeen(code) ? "ben" : "");
};

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
    ${langCard()}

    <details class="card" ${!p.name ? "open" : ""}><summary>👤 Benim durumum</summary>
      <p class="small muted">Dersler, pratikler ve çeviriler buna göre kişiselleşir. Sadece bu telefonda kalır. Kimlik numarası yazma.</p>
      ${fld("name", "Adın", `ör. ${L.defaultName}`)}
      ${L.belgium ? fld("aliases", "İş yerinde sana nasıl sesleniyorlar?", "ör. Oz, Oguz — canlı altyazı adını tanısın") : fld("aliases", "Sana nasıl sesleniyorlar?", "ör. Umit, Oomit")}
      ${fld("job", "Şu anki işin", L.belgium ? "" : "ör. kimya satış / iş geliştirme")}
      <label class="f" for="p_level">${L.ad} seviyen (tahmini)</label><select id="p_level">${["A1", "A2", "B1", "B2"].map(l => `<option ${p.level === l ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label class="f" for="p_goal">Günlük hedef</label><select id="p_goal">${[[5, "5 dk (10 kart)"], [10, "10 dk (20 kart)"], [20, "20 dk (40 kart)"]].map(([v, l]) => `<option value="${v}" ${+p.goal === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <details style="margin-top:10px"><summary class="small">Daha fazla (isteğe bağlı)</summary>
        ${L.belgium ? `${fld("city", "Şehir", "ör. Gent")}${fld("months", "Kaç aydır Belçika'dasın?", "ör. 3")}${fld("contract", "Sözleşme", "ör. interim, belirsiz süreli")}
        ${fld("homeJob", "Türkiye'deki mesleğin / okulun", "ör. muhasebe mezunu")}${fld("target", "Hangi işe geçmek istiyorsun?", "ör. lojistik, ofis")}
        ${fld("licence", "Ehliyet", "ör. B, C")}${fld("kids", "Çocuklar (yaşları)", "ör. 7 ve 10 yaşında")}`
        : `${fld("city", "Şehir", "ör. İstanbul")}${fld("homeJob", "Mesleğin / okulun", "ör. kimya mühendisi, işletme mezunu")}${fld("target", `${L.ad}yi en çok ne için kullanacaksın?`, "ör. tedarikçi görüşmeleri, fuar, seyahat")}`}</details>
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
      <label class="f" for="s_voice">${L.ad} ses</label>
      <select id="s_voice">${voiceOptions(voices, pref)}</select>
      ${voices.length ? "" : `<div class="warnbox small" style="margin-top:6px">Android: Ayarlar → "Metin okuma çıkışı" → Google → ses verilerini yükle → ${L.belgium ? "Nederlands (België)" : "English (United Kingdom / United States)"}. iPhone: Ayarlar → Erişilebilirlik → Seslendirilen İçerik → Sesler → ${L.belgium ? "Nederlands" : "English"}.</div>`}
      <label class="f" for="s_rate">Okuma hızı: <span id="rateVal">${(+store.get("rate", 0.9)).toFixed(2)}</span></label>
      <input type="range" id="s_rate" min="0.5" max="1.2" step="0.05" value="${store.get("rate", 0.9)}" style="width:100%">
      <div class="row"><button class="btn sm" data-act="say" data-say="${AT.ttsTest}">🔊 Sesi dene</button><button class="btn sm" data-act="micTest">🎤 Mikrofon testi</button></div>
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

    <details class="card" id="keyCard" ${App.benOpenSetup || (!hasKey && !DEMO) ? "open" : ""}><summary>🔧 Kurulum (teknik${L.belgium ? " — ağabeyin için" : ""}) ${hasKey ? "✅" : "❗"}</summary>
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
      <label class="row small"><input type="checkbox" id="s_fast" ${store.get("fastI", true) ? "checked" : ""}> <span>⚡ Tercümanda hızlı mod (önerilen: ~1–2 sn, çok ucuz). Kapatırsan en iyi model (daha yavaş). ${L.belgium ? "Doktor/resmî/okul/polis" : "Doktor/resmî"} durumlarında her zaman en iyi model kullanılır.</span></label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_fastP" ${store.get("fastP", true) ? "checked" : ""}> <span>⚡ Konuşma pratiğinde hızlı mod (önerilen)</span></label>
      <label class="f" for="s_live">Canlı altyazı modeli</label>
      <select id="s_live"><option value="fast" ${store.get("liveModel", "fast") !== "best" ? "selected" : ""}>⚡ Hızlı & ucuz (önerilen: ~1–2 sn)</option><option value="best" ${store.get("liveModel", "fast") === "best" ? "selected" : ""}>🧠 En iyi (yavaş: ~5–8 sn, pahalı)</option></select>
      <p class="small muted">Varsayılan tercüman: Claude Opus 5.5 (en iyi kalite).</p>
      <label class="f" for="s_sr">Dinlenecek ${L.ad}</label>
      <select id="s_sr">${L.srOpts.map(([v, l]) => `<option value="${v}" ${store.get("srLang", L.sr) === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_auto" ${store.get("autoSpeak", false) ? "checked" : ""}> İlk cevap önerisini otomatik sesli oku (önerilmez)</label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_say" ${store.get("autoSay", false) ? "checked" : ""}> <span>🔊 Çevirdiğim cümleyi otomatik sesli söyle</span></label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_spec" ${store.get("specOn", true) !== false ? "checked" : ""}> <span>⚡ Konuşurken çevirmeye başla (daha hızlı; biraz daha fazla kullanım)</span></label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_haptic" ${store.get("haptic", true) !== false ? "checked" : ""}> <span>📳 Titreşim</span></label>
      <label class="row small" style="margin-top:8px"><input type="checkbox" id="s_local" ${store.get("srLocal", false) ? "checked" : ""}> Ses tanımayı mümkünse telefonun içinde yap (destekleyen Android Chrome'da; ses dışarı gitmez) <button class="btn sm" data-act="checkLocal">Kontrol et</button></label>
      <div class="small" id="localOut" aria-live="polite"></div>
      <h3 style="margin-top:14px">💾 Yedek</h3>
      <p class="small muted">iPhone'da uzun süre açılmayan sitelerin verisi silinebilir; ara sıra yedek al. API anahtarı yedeğe girmez.</p>
      <label class="row small"><input type="checkbox" id="exp_logs"> Konuşma dökümlerini (çeviriler, canlı altyazı) de yedeğe ekle</label>
      <div class="row" style="margin-top:6px"><button class="btn sm" data-act="export">⬇️ Yedek indir</button><button class="btn sm" data-act="import">⬆️ Yedekten yükle</button></div>
      <div class="row" style="margin-top:8px"><button class="btn sm" data-act="resetProg">İlerlemeyi sıfırla</button><button class="btn sm" data-act="onbAgain">Tanıtımı tekrar göster</button></div>
    </details>
    ${EXT.benCards.map(f => { try { return f() || ""; } catch { return ""; } }).join("")}
    ${diagCard()}
    <p class="small muted" style="text-align:center">Dil Köprüsü · v${typeof APP_VERSION !== "undefined" ? APP_VERSION : "7"}</p>`;
  const on = (id, fn) => { const el = $(id); if (el) el.onchange = fn; };
  on("#s_fast", e => store.set("fastI", e.target.checked));
  on("#s_fastP", e => store.set("fastP", e.target.checked));
  on("#s_live", e => store.set("liveModel", e.target.value));
  on("#s_voice", e => store.set("voice", e.target.value));
  on("#s_sr", e => store.set("srLang", e.target.value));
  on("#s_theme", e => { store.set("theme", e.target.value); applyTheme(); });
  on("#s_open", e => store.set("openInterp", e.target.checked));
  on("#s_auto", e => store.set("autoSpeak", e.target.checked));
  on("#s_say", e => store.set("autoSay", e.target.checked));
  on("#s_spec", e => { store.set("specOn", e.target.checked); if (!e.target.checked) Spec.cancel(); });
  on("#s_haptic", e => { store.set("haptic", e.target.checked); if (e.target.checked) haptic(15); });
  on("#s_local", e => store.set("srLocal", e.target.checked));
  const r = $("#s_rate"); if (r) r.oninput = e => { store.set("rate", +e.target.value); $("#rateVal").textContent = (+e.target.value).toFixed(2); };
  if (App.benFocusKey) { App.benFocusKey = false; setTimeout(() => { const k = $("#keyCard"); if (k) { k.scrollIntoView({ block: "center" }); $("#apiKey").focus(); } }, 50); }
  App.benOpenSetup = false;
}
const voiceOptions = (voices, pref) => voices.length ? voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === pref ? "selected" : ""}>${esc(v.name)} (${esc(v.lang)})</option>`).join("") : `<option value="">${L.ad} ses bulunamadı</option>`;
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
      await callClaude({ feature: "ping", kind: "ping", system: `Answer in ${L.ai}.`, content: "Say hello in one word.", schema: SCHEMA.ping, timeout: 30000 });
      $("#keyStatus").textContent = "Bağlantı çalışıyor ✅";
    }
  } catch (e) { $("#keyStatus").textContent = "❌ " + e.message; }
};
ACT.checkLocal = async () => {
  const out = $("#localOut"); if (!out) return;
  try {
    if (typeof Speech.checkLocal !== "function") { out.textContent = "Bu sürümde yok."; return; }
    const r = await Speech.checkLocal(store.get("srLang", L.sr));
    out.textContent = r === "available" ? `✅ Telefonda ${L.ad} ses tanıma hazır.` : r === "downloadable" ? "⬇️ İndirilebilir — kutuyu işaretle, ilk kullanımda yüklenir." : "❌ Bu telefonda/tarayıcıda yok; Google'ın sunucusu kullanılır.";
    if (r === "downloadable" && Speech.installLocal) { try { await Speech.installLocal(store.get("srLang", L.sr)); } catch { } }
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
ACT.resetProg = () => { if (confirm("Ders ilerlemesi, puan ve seri sıfırlansın mı? (Kaydettiklerin ve profilin kalır)")) { ["srs", "xp", "days", "today", "newToday", "cpBest", "gramDay", ...(LANG === "en" ? ["startDay", "gramSeen"] : [])].forEach(k => store.del(k)); App.renderStats(); renderBen(); toast("Sıfırlandı"); } };
const LOG_KEYS = ["dk_hist", "dk_conv", "dk_liveLogs", "dk_liveDraft", "dk_en_hist", "dk_en_conv", "dk_en_liveLogs", "dk_en_liveDraft", "dk_memo", "dk_en_memo", "dk_errlog", "dk_perf"];
ACT.export = () => {
  const withLogs = $("#exp_logs") && $("#exp_logs").checked;
  const data = {}; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("dk_") && k !== "dk_apiKey" && !k.startsWith("dk_bad_") && !k.startsWith("dk_en_bad_") && (withLogs || !LOG_KEYS.includes(k))) data[k] = localStorage.getItem(k); } } catch { }
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
      if (!k.startsWith("dk_") || k === "dk_apiKey" || k === "dk_lang" || typeof v !== "string") return; // dk_lang: şu anki dil korunur
      try { JSON.parse(v); localStorage.setItem(k, v); n++; } catch { } // bozuk değeri alma
    });
    conv = store.get("conv", []).filter(c => c && c.at && Date.now() - c.at < 20 * 60000);
    App.interp.ctx = store.get("ctx", "is");
    applyTheme(); applyFontScale(); App.renderStats(); renderBen();
    // v8.2 (QA): yedekteki dil kalıcı olsun — başka dildeysek (ya da bu sekme geçici dildeyse) o dilde yeniden aç
    let bkLang = null; try { const v = JSON.parse(j.data.dk_lang || "null"); if (LANGS[v]) bkLang = v; } catch { }
    if (bkLang && (bkLang !== LANG || window.LANG_TEMP)) {
      toast(`Yedek yüklendi ✅ (${n} kayıt) — yedekteki dil ${LANGS[bkLang].flag} ${LANGS[bkLang].ad}; uygulama o dilde açılıyor…`);
      setTimeout(() => switchLang(bkLang, "ben"), 1800); return;
    }
    if (bkLang) store.set("lang", bkLang);
    toast(`Yedek yüklendi ✅ (${n} kayıt)`);
  } catch { toast("Bu dosya geçerli bir yedek değil"); }
  finally { e.target.value = ""; }
});
ACT.micTest = () => {
  const out = $("#micTestOut"); out.textContent = `${L.ad} '${L.hello}' de…`;
  Speech.listen({ lang: store.get("srLang", L.sr), owner: "test", maxMs: 8000, onText: t => { out.textContent = t; },
    onDone: t => { out.textContent = t ? `✅ Duyulan: “${t}”` : "Ses duyulmadı"; }, onError: c => { if (c !== "cancelled") out.textContent = "❌ " + Speech.errorText(c); } });
};
ACT.onbAgain = () => { store.set("onb", false); showOnboarding(); };
function applyTheme() {
  const t = store.get("theme", "system"); const root = document.documentElement;
  if (t === "system") root.removeAttribute("data-theme"); else root.setAttribute("data-theme", t);
  const dark = t === "dark" || (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches);
  $("#themeColor").setAttribute("content", dark ? "#090e14" : "#f2f4f7");
}

/* =================================================================
   İLK AÇILIŞ TANITIMI
   ================================================================= */
let onbStep = 0, onbIds = [];
/** Dil seçimi adımı yalnız yepyeni kurulumda: hiçbir dilde tanıtım görülmemiş ve dil hiç seçilmemiş (Felemenkçe kullanan hiç görmez) */
function onbAskLang() { try { return !onbSeen("nl") && !onbSeen("en") && localStorage.getItem("dk_lang") == null; } catch { return false; } }
function showOnboarding() {
  onbStep = 0; $("#onb").classList.add("on"); renderOnb();
  // Android geri tuşu tanıtımda bir önceki adıma gitsin, uygulamadan çıkmasın
  const backStep = () => { if (!$("#onb").classList.contains("on")) return; if (onbStep > 0) { onbSaveStep(); onbStep--; renderOnb(); } Back.push(backStep); };
  Back.push(backStep);
}
function renderOnb() {
  const p = profile(); const hasKey = !!store.get("apiKey", "");
  const nl = L.belgium;
  const steps = [
    onbAskLang() ? ["lang", `<div class="em" aria-hidden="true">🌍</div><h2 style="margin:0">Hangi dili öğrenmek istiyorsun?</h2>
     <p class="small muted" style="margin:0">Sonra Ben sekmesinden değiştirebilirsin; her dilin ilerlemesi ayrı saklanır.</p>
     ${Object.values(LANGS).map(x => `<button class="btn block" style="font-size:1.15rem;min-height:64px" data-act="onbLang" data-l="${x.code}">${x.flag} ${esc(x.ad)}</button>`).join("")}`] : null,
    ["hello", `<div class="em" aria-hidden="true">🇹🇷 🌉 ${L.flag}</div><h2 style="font-size:1.5rem;margin:0">Dil Köprüsü'ne hoş geldin</h2>
     <div class="card flat"><b>🎧 Yanında konuşulanı anla</b><br><span class="small">${nl ? "İş arkadaşların konuşurken Türkçe altyazı gibi okursun; sana bir iş söylenince satır 🔔 sarı yanar." : "Toplantıda ya da yanında konuşulan İngilizceyi Türkçe altyazı gibi okursun; seninle ilgili bir şey söylenince satır 🔔 sarı yanar.<br><b>Görüşmeyi bilgisayarda hoparlörden aç, telefonu yanına koy.</b> Telefon görüşmesi sırasında mikrofon kullanılamaz."}</span></div>
     <div class="card flat"><b>🗣️ Karşındakine söyle</b><br><span class="small">Türkçe söyle, ${L.ad}sini okunuşuyla al ya da büyük ekranda göster.</span></div>
     <div class="card flat"><b>📚 Günde 10 dakika</b><br><span class="small">İş cümleleri ve temel ${L.ad}, adım adım.</span></div>`],
    ["me", `<div class="em" aria-hidden="true">🙋</div><h2 style="margin:0">Biraz seni tanıyayım</h2><p class="small muted" style="margin:0">Sadece bu telefonda kalır.</p>
     <label class="f" for="o_name">Adın</label><input type="text" id="o_name" value="${esc(p.name)}" placeholder="ör. ${esc(L.defaultName)}">
     <label class="f" for="o_alias">${nl ? "İş yerinde sana nasıl sesleniyorlar?" : "Sana nasıl sesleniyorlar?"}</label><input type="text" id="o_alias" value="${esc(p.aliases || "")}" placeholder="${nl ? "ör. Oz, Oguz" : "ör. Umit, Oomit"}">
     ${nl ? `<label class="f" for="o_job">İşin</label><input type="text" id="o_job" value="${esc(p.job)}">` : ""}
     <label class="f" for="o_level">${L.ad}n</label><select id="o_level">${[["A1", "Hiç / çok az biliyorum"], ["A2", "Basit konuşabiliyorum"], ["B1", "Günlük işleri halledebiliyorum"], ["B2", "Rahat konuşuyorum"]].map(([v, l]) => `<option value="${v}" ${p.level === v ? "selected" : ""}>${l}</option>`).join("")}</select>
     ${nl ? `<label class="f">Günlük hedef</label><div class="chips" role="group">${[[5, "5 dk"], [10, "10 dk"], [20, "20 dk"]].map(([v, l]) => `<button class="chip" data-act="onbGoal" data-v="${v}" aria-pressed="${+p.goal === v}">${l}</button>`).join("")}</div>`
       : `<p class="small muted" style="margin:6px 0 0">İşini ve günlük hedefini (şimdilik ${+p.goal || 10} dk) sonra <b>Ben</b> sekmesinden değiştirebilirsin.</p>`}`],
    ["mic", `<div class="em" aria-hidden="true">🎤🔊</div><h2 style="margin:0">Mikrofon ve ses</h2>
     <p class="small">Telefon bir kez mikrofon izni soracak — <b>İzin ver</b>'e bas. Uygulama sesi kaydetmez.</p>
     ${IN_APP_BROWSER ? `<div class="dangerbox">Bu link bir uygulamanın içinde açılmış. Mikrofon için Chrome (Android) ya da Safari'de (iPhone) aç.</div>` : ""}
     ${IS_IOS ? `<div class="warnbox small">iPhone: Ayarlar → Genel → Klavye → <b>Dikte</b> açık olmalı. Safari'de Paylaş → <b>Ana Ekrana Ekle</b> ile uygulama gibi kullan.</div>` : `<div class="warnbox small">Android: Chrome menüsü ⋮ → <b>Ana ekrana ekle / Uygulamayı yükle</b>.</div>`}
     <button class="btn" data-act="say" data-say="${AT.onbSay}">🔊 Sesi dene</button>
     <button class="btn" data-act="onbMic">🎤 Mikrofonu dene</button><div id="onbMicOut" class="small" aria-live="polite"></div>`],
    ["key", hasKey ? `<div class="em" aria-hidden="true">✅</div><h2 style="margin:0">Her şey hazır</h2><p>${nl ? "Çeviri ve canlı altyazı için gereken kurulumu ağabeyin yapmış. Hiçbir şey yapmana gerek yok." : "Çeviri ve canlı altyazı için gereken kurulum yapılmış. Hiçbir şey yapmana gerek yok."}</p>`
      : `<div class="em" aria-hidden="true">🔑</div><h2 style="margin:0">Yapay zekâ kurulumu</h2>
     <p class="small">${nl ? "Çeviri ve canlı altyazı için bir kez kurulum gerekir. Bunu genelde <b>ağabeyin</b> yapar: sana bir kurulum linki ya da kod gönderir." : "Çeviri ve canlı altyazı için bir kez kurulum gerekir: Claude API anahtarını (sk-ant-…) gir ya da kurulum linkini aç."}</p>
     <p class="small muted">Kurulum yoksa da olur: dersler, kartlar${nl ? ", hazır cümleler ve İlk 12 ay listesi" : " ve hazır cümleler"} şimdiden çalışır.</p>
     <input type="password" id="o_key" placeholder="Kod (sk-ant-…) — varsa" autocomplete="off" autocapitalize="off" spellcheck="false">
     <div class="row"><button class="btn" data-act="pasteKey" data-into="o_key">📋 Yapıştır</button><button class="btn" data-act="onbKeyTest">Kaydet ve dene</button></div><div id="onbKeyOut" class="small" aria-live="polite"></div>`],
    ["go", `<div class="em" aria-hidden="true">🧭</div><h2 style="margin:0">En çok neye ihtiyacın var?</h2>
     <p class="small muted">Uygulama oradan açılsın. Sonra her şeyi alttaki menüden bulursun.</p>
     <button class="btn primary block" data-act="onbGo" data-to="live">${nl ? "🎧 Yanımda konuşulanı anlamak" : "🎧 Toplantıda / yanımda konuşulanı anlamak"}</button>
     <button class="btn block" data-act="onbGo" data-to="talk">🗣️ Müşteriyle / insanlarla konuşmak</button>
     <button class="btn block" data-act="onbGo" data-to="learn">📚 ${L.ad} öğrenmek</button>`]
  ].filter(Boolean);
  onbIds = steps.map(x => x[0]);
  onbStep = Math.min(onbStep, steps.length - 1);
  const last = onbStep === steps.length - 1;
  $("#onb").innerHTML = `<div class="step">${steps[onbStep][1]}</div>
    <div class="dots" aria-hidden="true">${steps.map((_, i) => `<i class="${i === onbStep ? "on" : ""}"></i>`).join("")}</div>
    <div class="row" style="max-width:520px;margin:0 auto;width:100%">
      ${onbStep > 0 ? `<button class="btn ghost" data-act="onbPrev">← Geri</button>` : onbIds[0] === "lang" ? "" : `<button class="btn ghost" data-act="onbSkip">Atla</button>`}
      ${last ? "" : onbIds[onbStep] === "lang" ? `<button class="btn primary grow" disabled aria-disabled="true" title="Önce bir dil seç">Devam →</button>` : `<button class="btn primary grow" data-act="onbNext">Devam →</button>`}</div>`;
}
function onbSaveStep() {
  const id = onbIds[onbStep];
  if (id === "me" && $("#o_name")) { const p = profile(); p.name = $("#o_name").value.trim(); p.aliases = $("#o_alias").value.trim(); if ($("#o_job")) p.job = $("#o_job").value.trim(); p.level = $("#o_level").value; store.set("profile", p); }
  if (id === "key" && $("#o_key")) { const k = ($("#o_key").value || "").trim(); if (/^sk-ant-/.test(k)) store.set("apiKey", k); }
}
/** Tanıtımın dil adımı: İngilizce → kaydet ve İngilizce tanıtımla yeniden aç; Felemenkçe → devam */
ACT.onbLang = el => {
  const code = el.dataset.l; if (!LANGS[code]) return;
  if (code !== LANG) { switchLang(code, ""); return; }
  onbStep++; renderOnb();
};
ACT.onbNext = () => { onbSaveStep(); onbStep++; renderOnb(); };
ACT.onbPrev = () => { onbSaveStep(); onbStep = Math.max(0, onbStep - 1); renderOnb(); };
ACT.onbSkip = () => onbFinish("learn");
ACT.onbGo = el => onbFinish(el.dataset.to);
ACT.onbGoal = el => { const p = profile(); p.goal = +el.dataset.v; store.set("profile", p); $$("[data-act=onbGoal]").forEach(b => b.setAttribute("aria-pressed", String(b === el))); };
ACT.onbMic = () => { const out = $("#onbMicOut"); out.textContent = `${L.ad} '${L.hello}' de…`; Speech.listen({ lang: store.get("srLang", L.sr), owner: "test", maxMs: 8000, onText: t => out.textContent = t, onDone: t => out.textContent = t ? `✅ Çalışıyor: “${t}”` : "Ses duyulmadı, bir daha dene", onError: c => { if (c !== "cancelled") out.textContent = "❌ " + Speech.errorText(c); } }); };
ACT.onbKeyTest = async () => {
  const k = ($("#o_key").value || "").trim(); if (!k) return;
  if (!/^sk-ant-/.test(k)) { $("#onbKeyOut").textContent = "❌ Kod sk-ant- ile başlamalı."; return; }
  store.set("apiKey", k); const out = $("#onbKeyOut"); out.innerHTML = `<span class="spinner"></span>`;
  try { await callClaude({ feature: "ping", kind: "ping", system: `Answer in ${L.ai}.`, content: "Say hello in one word.", schema: SCHEMA.ping, timeout: 30000 }); out.textContent = "✅ Bağlantı çalışıyor"; }
  catch (e) { out.textContent = "❌ " + e.message; }
};
function onbFinish(to) {
  onbSaveStep(); Speech.stopAll(); store.set("onb", true); $("#onb").classList.remove("on"); Back.reset();
  if (to === "live") { App.interp.live = true; store.set("interpLive", true); store.set("openInterp", true); tab("ceviri"); }
  else if (to === "talk") { App.interp.live = false; store.set("interpLive", false); store.set("openInterp", true); tab("ceviri"); }
  else tab("ogren");
}


/* ---------------- C8: geçici dil şeridi (?lang=xx başka dili kullanan cihazda açıldıysa) ---------------- */
(function langTempBar() {
  if (!window.LANG_TEMP) return;
  const other = LANG === "en" ? "nl" : "en";
  const bar = document.createElement("div"); bar.className = "langtmp"; bar.setAttribute("role", "status");
  // v8.3 (en): 375 px'te tek satır metin + altta yan yana iki kısa düğme (şerit ≤ ~100 px)
  bar.innerHTML = LANG === "en"
    ? `<span class="grow">Bu sekmede ${L.flag} <b>${esc(L.ad)}</b> açık</span><button class="btn sm primary" data-act="langTmpKeep" title="Hep ${esc(L.ad)} kullan">Kalıcı yap</button><button class="btn sm" data-act="langTmpBack" data-l="${other}" title="${esc(LANGS[other].ad)}ye dön">${LANGS[other].flag} Geri dön</button>`
    : `<span class="grow">Bu sekmede ${L.flag} <b>${esc(L.ad)}</b> açık</span><button class="btn sm primary" data-act="langTmpKeep">Hep ${esc(L.ad)}</button><button class="btn sm" data-act="langTmpBack" data-l="${other}">${LANGS[other].flag} ${esc(LANGS[other].ad)}ye dön</button>`;
  const main = document.querySelector("main"); if (main && main.parentNode) main.parentNode.insertBefore(bar, main);
})();
ACT.langTmpKeep = () => switchLang(LANG, App.view || "ben");
ACT.langTmpBack = el => switchLang(el.dataset.l, App.view || "ben");
