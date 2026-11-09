/* Dil Köprüsü — dinleme merdiveni (kulak misafiri diyaloglar, minimal çiftler, hız basamakları) */
"use strict";
(function () {
  // İngilizcede yalnız content-en.js (window.EN) — eksik alan Felemenkçe içerikten sızmasın
  const SRC = () => LANG === "en" ? (window.EN || {}) : window;
  const DIALOGS = () => Array.isArray(SRC().DIALOGS) ? SRC().DIALOGS : [];
  const PAIRS = () => Array.isArray(SRC().PAIRS) ? SRC().PAIRS : [];
  const HEARD_SRC = ["İşte duyduklarım", "Canlı altyazı"];
  const SPEEDS = [[0.8, "🐢 0.8"], [1, "1.0"], [1.15, "🐇 1.15"]];
  const LV = ["A1", "A2", "B1", "B2"];
  const pz = s => typeof personalize === "function" ? personalize(String(s ?? "")) : String(s ?? "").replace(/\{NAAM\}/g, profile().name || L.defaultName);

  /* ---------------- Ses: konuşmacıya göre farklı ses/perde, sıralı çalma ---------------- */
  const LS = {
    tok: 0,
    speed() { const v = +store.get("lsSpeed", 1); return SPEEDS.some(s => s[0] === v) ? v : 1; },
    voiceFor(who) {
      // yalnız öğrenilen dilin sesleri (core'daki liste başka dilde kalırsa İngilizce metni Felemenkçe ses okumasın)
      const all = TTS.nlVoices().filter(v => String(v.lang || "").toLowerCase().startsWith(L.ttsBase));
      const main = LANG === "nl" ? TTS.pick("nl") : (all.find(v => v.voiceURI === store.get("voice", "")) || all[0] || null);
      if (who !== "B") return { voice: main, pitch: 1, k: 1 };
      const other = all.find(v => main && v.voiceURI !== main.voiceURI);
      return other ? { voice: other, pitch: 1, k: 0.97 } : { voice: main, pitch: 1.3, k: 0.95 };
    },
    busy() { return !!(window.LiveUI && typeof LiveUI.isActive === "function" && LiveUI.isActive()); },
    /** Tek satırı okur; bitince (ya da güvenlik süresi dolunca) çözülür */
    say(text, who = "A", rate) {
      return new Promise(res => {
        if (!TTS.ok()) { toast("Bu tarayıcıda sesli okuma yok"); return res(false); }
        if (this.busy()) { toast("Önce canlı altyazıyı durdur"); return res(false); }
        const clean = String(text || "").replace(/[\[\]{}]/g, "").trim(); if (!clean) return res(true);
        const { voice, pitch, k } = this.voiceFor(who);
        const u = new SpeechSynthesisUtterance(clean);
        if (voice) { u.voice = voice; u.lang = voice.lang; } else u.lang = L.sr;
        u.rate = Math.max(0.5, Math.min(1.6, (rate || this.speed()) * k)); u.pitch = pitch;
        let done = false; const fin = ok => { if (done) return; done = true; clearTimeout(t); res(ok); };
        u.onend = () => fin(true); u.onerror = () => fin(false);
        const t = setTimeout(() => fin(true), 1800 + clean.length * 95 / u.rate);
        this.cur = u; // Android: referans tutulmazsa ses yarıda kesilebilir
        try { speechSynthesis.speak(u); } catch { fin(false); }
      });
    },
    async play(lines, onLine, still = () => true) {
      const my = ++this.tok; TTS.stop();
      await new Promise(r => setTimeout(r, 80));
      for (let i = 0; i < lines.length; i++) {
        if (my !== this.tok || !still()) return false;
        onLine && onLine(i);
        const ok = await this.say(lines[i].nl, lines[i].who);
        if (!ok && this.busy()) return false;
        if (my !== this.tok || !still()) return false;
        await new Promise(r => setTimeout(r, 380));
      }
      onLine && onLine(-1);
      return my === this.tok;
    },
    stop() { this.tok++; TTS.stop(); }
  };
  window.ListenTTS = LS;

  const speedChips = () => `<div class="chips" role="group" aria-label="Konuşma hızı">${SPEEDS.map(([v, l]) => `<button class="chip" data-act="lsSpeed" data-v="${v}" aria-pressed="${LS.speed() === v}">${l}</button>`).join("")}</div>`;
  ACT.lsSpeed = el => { store.set("lsSpeed", +el.dataset.v); $$("[data-act=lsSpeed]").forEach(b => b.setAttribute("aria-pressed", String(+b.dataset.v === LS.speed()))); haptic(8); };

  /** Doğru/yanlış sonucu: kart kutusu (SRS) açmadan say, sonra sıradakine geç */
  function lsGrade(g) {
    const s = App.learn.s; if (!s) return;
    if (g === 2) s.right++;
    Progress.addXP(g === 2 ? 3 : 1); Progress.didCard();
    nextTask(null);
  }
  ACT.lsNext = el => { LS.stop(); lsGrade(+el.dataset.g); };

  /* ---------------- (a) Kulak misafiri diyaloglar ---------------- */
  function stDialog(t) {
    const d = t.d; const q = d.q || {};
    App.learn.s.dl = { picked: false, playing: -1 };
    $("#v-ogren").innerHTML = studyShell(`<div class="card">
        <span class="tag br">🎧 Kulak misafiri · ${esc(d.lvl || "")}</span>
        <h2 style="margin:8px 0 4px">${esc(pz(d.t))}</h2>
        <div class="note" style="margin-top:6px">❓ <b>Önce soruyu oku, sonra dinle:</b><br>${esc(pz(q.tr || "Ne konuşuyorlar?"))}</div>
        <div style="margin-top:10px">${speedChips()}</div>
        <div class="row" style="margin-top:6px"><button class="btn primary grow" data-act="lsDlgPlay">▶ Dinle</button><button class="btn" data-act="lsDlgStop" aria-label="Durdur">⏹</button></div>
        <div class="chips" id="dlgDots" style="margin-top:8px" role="group" aria-label="Tek satırı tekrar dinle">${d.lines.map((l, i) => `<button class="chip" data-act="lsDlgLine" data-i="${i}" aria-label="${i + 1}. satırı dinle">${l.who === "B" ? "🟠" : "🔵"} ${i + 1}</button>`).join("")}</div>
        <div class="small muted">Metin cevaptan sonra açılır. Tek satırı tekrar dinlemek için numaraya dokun.</div>
      </div>
      <div class="opts" id="dlgOpts">${(q.options || []).map((o, k) => `<button class="opt" data-act="lsDlgPick" data-k="${k}">${esc(pz(o))}</button>`).join("")}</div>
      ${(q.options || []).length ? "" : `<button class="btn primary block" style="margin-top:10px" data-act="lsDlgPick" data-k="-1">Metni göster</button>`}
      <div id="dlgOut" aria-live="polite" style="margin-top:10px"></div>`);
  }
  const curTask = () => App.learn.s && App.learn.s.tasks[App.learn.s.i];
  function markDot(i) { $$("#dlgDots .chip").forEach((b, k) => b.setAttribute("aria-pressed", String(k === i))); }
  ACT.lsDlgPlay = () => { const t = curTask(); if (!t || !t.d) return; LS.play(t.d.lines.map(l => ({ nl: pz(l.nl), who: l.who })), markDot, () => App.view === "ogren" && curTask() === t); };
  ACT.lsDlgStop = () => { LS.stop(); markDot(-1); };
  ACT.lsDlgLine = el => { const t = curTask(); if (!t || !t.d) return; const i = +el.dataset.i; const l = t.d.lines[i]; if (!l) return; LS.stop(); markDot(i); LS.say(pz(l.nl), l.who).then(() => markDot(-1)); };
  ACT.lsDlgPick = el => {
    const s = App.learn.s; const t = curTask(); if (!t || !t.d || s.dl.picked) return; s.dl.picked = true; LS.stop();
    const d = t.d; const k = +el.dataset.k; const ans = d.q ? +d.q.answer : -1;
    const ok = k === -1 ? null : k === ans;
    $$("#dlgOpts .opt").forEach((b, i) => { b.disabled = true; if (i === ans) b.classList.add("right"); });
    if (ok === false) { el.classList.add("wrong", "shake"); haptic([20, 40, 20]); } else if (ok) { el.classList.add("pop"); haptic(15); }
    if (ok) { const done = store.get("dlgDone", {}); done[d.id] = Date.now(); store.set("dlgDone", done); }
    $("#dlgOut").innerHTML = `${ok === true ? `<div class="tag ok">✓ Doğru anladın!</div>` : ok === false ? `<div class="tag bad">✗ Bir daha dinle — doğru cevap yeşil</div>` : ""}
      <div class="card" style="margin-top:8px"><h3 style="margin-top:0">📜 Konuşmanın metni</h3>
      ${d.lines.map((l, i) => `<div class="phrase"><button class="ibtn" data-act="lsDlgLine" data-i="${i}" aria-label="Sesli oku">🔊</button><div class="t"><span class="small muted">${l.who === "B" ? "🟠 B" : "🔵 A"}</span><b>${esc(pz(l.nl))}</b><div class="small">🇹🇷 ${esc(pz(l.tr))}</div></div><button class="ibtn" data-act="add" data-nl="${esc(pz(l.nl))}" data-tr="${esc(pz(l.tr))}" data-ok="" data-src="Kulak eğitimi" aria-label="Kartlarıma ekle">➕</button></div>`).join("")}
      ${(d.words || []).length ? `<h3>📚 Anahtar kelimeler</h3>${d.words.map(w => `<div class="phrase"><div class="t"><b>${esc(pz(w[0]))}</b>${w[2] ? `<div class="okn small">${esc(pz(w[2]))}</div>` : ""}<div class="small">🇹🇷 ${esc(w[1])}</div></div>${acts(pz(w[0]), w[1], pz(w[2] || ""), "Kulak eğitimi", { show: false })}</div>`).join("")}` : ""}
      </div>
      <button class="btn primary block" data-act="lsNext" data-g="${ok === false ? 0 : 2}">Devam →</button>`;
  }

  /* ---------------- (b) Ses çiftleri (minimal çiftler) ---------------- */
  function stPair(t) {
    const [a, b, ta, tb] = t.p; const target = t.target ? b : a;
    App.learn.s.pr = { done: false };
    $("#v-ogren").innerHTML = studyShell(`<div class="card" style="text-align:center;display:flex;flex-direction:column;gap:8px;align-items:center">
        <span class="tag br">👂 Ses çifti · ${esc(t.g.sound || "")}</span>
        <div class="muted">Hangisini duydun?</div>
        <div class="row" style="justify-content:center"><button class="btn primary" data-act="lsPairPlay">🔊 Dinle</button><button class="btn" data-act="lsPairPlay" data-slow="1">🐢 Yavaş</button></div></div>
      <div class="grid2" id="pairOpts" style="margin-top:10px">${[[a, ta], [b, tb]].map(([w, tr], k) => `<button class="opt" style="text-align:center" data-act="lsPairPick" data-k="${k}"><div class="big-nl" style="font-size:1.5rem">${esc(w)}</div><div class="small muted">${esc(tr || "")}</div></button>`).join("")}</div>
      <div id="pairOut" aria-live="polite" style="margin-top:10px"></div>`);
    setTimeout(() => { if (curTask() === t) LS.say(target, "A"); }, 150);
  }
  ACT.lsPairPlay = el => { const t = curTask(); if (!t || !t.p) return; LS.stop(); LS.say(t.target ? t.p[1] : t.p[0], "A", el.dataset.slow ? 0.65 : undefined); };
  ACT.lsPairSay = el => { LS.stop(); LS.say(el.dataset.say, "A", 0.8); };
  ACT.lsPairPick = el => {
    const s = App.learn.s; const t = curTask(); if (!t || !t.p || s.pr.done) return; s.pr.done = true;
    const ok = +el.dataset.k === t.target;
    $$("#pairOpts .opt").forEach((b, k) => { b.disabled = true; if (k === t.target) b.classList.add("right"); });
    if (!ok) { el.classList.add("wrong", "shake"); haptic([20, 40, 20]); } else { el.classList.add("pop"); haptic(15); }
    const st = store.get("pairStats", {}); const g = st[t.g.id] || { n: 0, ok: 0 }; g.n++; if (ok) g.ok++; st[t.g.id] = g; store.set("pairStats", st);
    const [a, b] = t.p;
    $("#pairOut").innerHTML = `<div class="card flat" style="text-align:center"><div class="small muted" style="margin-bottom:6px">Farkı dinle:</div>
      <div class="row" style="justify-content:center"><button class="btn" data-act="lsPairSay" data-say="${esc(a)}">🔊 ${esc(a)}</button><button class="btn" data-act="lsPairSay" data-say="${esc(b)}">🔊 ${esc(b)}</button></div></div>
      <button class="btn primary block" style="margin-top:10px" data-act="lsNext" data-g="${ok ? 2 : 0}">Devam →</button>`;
  }

  EXT.studyTypes.dialog = stDialog;
  EXT.studyTypes.pair = stPair;

  /* ---------------- Oturum başlatıcılar ---------------- */
  const back = () => { LS.stop(); App.learn = { mode: "home" }; };
  function pickDialogs(n = 3) {
    const lvl = LV.indexOf(profile().level || "A1");
    const all = DIALOGS().filter(d => d && Array.isArray(d.lines) && d.lines.length);
    const fit = all.filter(d => LV.indexOf(d.lvl || "A2") <= lvl + 1);
    const pool = fit.length ? fit : all; const done = store.get("dlgDone", {});
    const fresh = shuffle(pool.filter(d => !done[d.id])), old = pool.filter(d => done[d.id]).sort((x, y) => done[x.id] - done[y.id]);
    return [...fresh, ...old].slice(0, n);
  }
  ACT.lsStartDlg = () => {
    const ds = pickDialogs(3); if (!ds.length) { toast("Diyaloglar henüz yüklenmedi"); return; }
    startStudy(ds.map(d => ({ type: "dialog", d, item: { nl: "dlg:" + d.id, tr: d.t || "", ok: "" } })), "Kulak misafiri diyaloglar", back);
  };
  ACT.lsStartPair = el => {
    const groups = PAIRS().filter(g => g && Array.isArray(g.pairs) && g.pairs.length); if (!groups.length) { toast("Ses çiftleri henüz yüklenmedi"); return; }
    let chosen;
    if (el && el.dataset.g) chosen = groups.filter(g => g.id === el.dataset.g);
    else { // en zayıf (ya da hiç çalışılmamış) iki ses grubu
      const st = store.get("pairStats", {}); const acc = g => { const x = st[g.id]; return x && x.n ? x.ok / x.n : -1; };
      chosen = shuffle(groups).sort((x, y) => acc(x) - acc(y)).slice(0, 2);
    }
    const tasks = shuffle(chosen.flatMap(g => g.pairs.map(p => ({ type: "pair", g, p, target: Math.random() < 0.5 ? 0 : 1, item: { nl: `pair:${p[0]}|${p[1]}`, tr: g.sound || "", ok: "" } })))).slice(0, 10);
    startStudy(tasks, "Ses çiftleri", back);
  };
  const heardItems = () => store.get("saved", []).filter(x => x && x.nl && x.tr && HEARD_SRC.includes(x.src));
  ACT.lsStartHeard = () => {
    const items = heardItems().map(x => ({ nl: x.nl, tr: x.tr, ok: x.ok || "" }));
    if (!items.length) { toast("Canlı altyazıda ➕ ile kaydettiğin cümleler burada birikir"); return; }
    const pick = shuffle(items).slice(0, 8);
    const pool = items.length >= 4 ? items : [...items, ...shuffle([...itemIndex().values()]).slice(0, 6)];
    // önce yalnız dinle (anlamını seç), sonra aynı cümleleri dikte
    startStudy([...pick.map(it => ({ type: "listen", item: it, pool })), ...shuffle(pick).map(it => ({ type: "dict", item: it }))], "İşte duyduklarım", back);
  };

  /* ---------------- Öğren ekranı kartı ---------------- */
  EXT.learnCards.push(() => {
    const ds = DIALOGS(), gs = PAIRS(), heard = heardItems();
    if (!ds.length && !gs.length && !heard.length) return "";
    const done = store.get("dlgDone", {}); const nDone = ds.filter(d => done[d.id]).length;
    const st = store.get("pairStats", {});
    const tileBtn = (act, e, n, d, extra = "") => `<button class="tile" data-act="${act}" ${extra}><div class="e">${e}</div><div class="n">${n}</div><div class="small muted">${d}</div></button>`;
    return `<div class="card"><h2 style="margin:0 0 2px">🎧 Kulak eğitimi</h2>
      <div class="small muted">${L.belgium ? "İş yerinde yanında konuşulanı anlamak için" : "Toplantıda ve telefonda konuşulanı anlamak için"}: önce soruyu oku, sonra dinle.</div>
      <div style="margin-top:8px">${speedChips()}</div>
      <div class="grid2" style="margin-top:6px">
        ${ds.length ? tileBtn("lsStartDlg", "🗣️", "Kulak misafiri", `${ds.length} ${L.belgium ? "iş diyaloğu" : "diyalog"} · ${nDone} anlaşıldı`) : ""}
        ${gs.length ? tileBtn("lsStartPair", "👂", "Ses çiftleri", L.belgium ? "ui/eu, a/aa, g/h…" : esc(gs.slice(0, 3).map(g => g.sound || g.id).join(", ")) + "…") : ""}
        ${tileBtn("lsStartHeard", "🏪", "İşte duyduklarım", heard.length ? `${heard.length} cümle · dinle + yaz` : "Canlı altyazıda ➕ ile biriktir")}
      </div>
      ${gs.length ? `<details style="margin-top:8px"><summary class="small">Belirli bir sesi çalış</summary><div class="chips" style="margin-top:6px;flex-wrap:wrap">${gs.map(g => { const x = st[g.id]; return `<button class="chip" data-act="lsStartPair" data-g="${esc(g.id)}">${esc(g.sound || g.id)}${x && x.n ? ` · %${Math.round(100 * x.ok / x.n)}` : ""}</button>`; }).join("")}</div></details>` : ""}
    </div>`;
  });
})();
