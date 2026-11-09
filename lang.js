/* Dil Köprüsü — öğrenilen dil (Felemenkçe / İngilizce)
   Yükleme sırası: content.js → content-en.js → lang.js → core.js → app.js → …
   - Seçim localStorage "dk_lang" (ortak anahtar). ?lang=en / ?lang=nl adresle de seçilir.
   - İngilizce seçiliyse content-en.js'teki window.EN içeriği window.* içeriğinin yerine geçer.
   - İlerleme, kartlar, profil vb. her dil için ayrı saklanır (core.js store: "dk_" / "dk_en_").
   Türkçe ekler: "Felemenkçe" ve "İngilizce" ikisi de -e ile biter → L.ad + "yi/de/si/siyle" ikisinde de doğru. */
"use strict";
const LANGS = {
  nl: {
    code: "nl", ad: "Felemenkçe", flag: "🇧🇪", flagAlt: "🇳🇱",
    sr: "nl-BE", srAlt: "nl-NL", srOpts: [["nl-BE", "Belçika (nl-BE)"], ["nl-NL", "Hollanda (nl-NL)"]], srAltAd: "Hollanda Felemenkçesi",
    ttsPref: ["nl-BE", "nl-NL", "nl"], ttsBase: "nl",
    ai: "Dutch", aiVariety: "Belgian Dutch (Flemish)", aiStd: "standard (Belgian) Dutch",
    ulke: "Belçika", hello: "Goeiedag", helloTr: "İyi günler",
    defaultName: "Oğuz",
    belgium: true, // Belçika'ya özel bölümler (İlk 12 ay, bordro, iş merdiveni, CV) yalnız burada
    ctxs: [["is", "🛒 İş"], ["genel", "💬 Günlük"], ["doktor", "🩺 Doktor"], ["resmi", "🏛️ Resmî"], ["okul", "🏫 Okul"], ["polis", "👮 Polis/acil"]],
    serious: ["doktor", "resmi", "polis", "okul"]
  },
  en: {
    code: "en", ad: "İngilizce", flag: "🇬🇧", flagAlt: "🇺🇸",
    sr: "en-US", srAlt: "en-GB", srOpts: [["en-US", "Amerikan (en-US)"], ["en-GB", "İngiliz (en-GB)"], ["en-IN", "Hint (en-IN)"]], srAltAd: "İngiliz İngilizcesi",
    ttsPref: ["en-GB", "en-US", "en"], ttsBase: "en",
    ai: "English", aiVariety: "clear international English (neutral, easy for non-native partners)", aiStd: "standard English",
    ulke: "", hello: "Good morning", helloTr: "Günaydın",
    defaultName: "Ümit",
    belgium: false,
    ctxs: [["is", "💼 İş görüşmesi"], ["toplanti", "🖥️ Toplantı"], ["genel", "💬 Günlük"], ["seyahat", "✈️ Seyahat"], ["doktor", "🩺 Doktor"], ["resmi", "🏛️ Resmî"]],
    serious: ["doktor", "resmi"]
  }
};
const LANG = (() => {
  let v = null;
  try {
    const q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "nl") { localStorage.setItem("dk_lang", JSON.stringify(q)); v = q; }
    else v = JSON.parse(localStorage.getItem("dk_lang") || "null");
  } catch { }
  return v === "en" ? "en" : "nl";
})();
const L = LANGS[LANG];
window.LANG = LANG; window.L = L; window.LANGS = LANGS;
if (LANG === "en" && window.EN) Object.assign(window, window.EN);
document.documentElement.dataset.lang = LANG;
