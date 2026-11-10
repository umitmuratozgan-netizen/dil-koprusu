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
    ttsPref: ["en-US", "en-GB", "en"], ttsBase: "en", // okunuşlar Amerikan: ses de önce en-US
    ai: "English", aiVariety: "clear international English (neutral, easy for non-native partners)", aiStd: "standard English",
    ulke: "", hello: "Good morning", helloTr: "Günaydın",
    defaultName: "Ümit",
    belgium: false,
    ctxs: [["is", "💼 İş"], ["toplanti", "🖥️ Toplantı"], ["genel", "💬 Günlük"], ["seyahat", "✈️ Seyahat"], ["doktor", "🩺 Doktor"], ["resmi", "🏛️ Resmî"]],
    serious: ["doktor", "resmi"]
  }
};
/* ?lang=xx: cihaz tamamen yeniyse kalıcı yazılır. Cihazda zaten kullanım varsa (ör. kardeş linke
   yanlışlıkla dokundu) yalnız bu sekme için geçerli olur; arayüz "kalıcı yap / geri dön" şeridi gösterir. */
let LANG_TEMP = false;
const LANG = (() => {
  let v = null;
  try {
    const q = new URLSearchParams(location.search).get("lang");
    // v8.3: bozuk dk_lang JSON'u tüm bloğu atlatmasın (?lang yine işlesin). Bozuk değer = "kullanılmış cihaz", eskisi gibi nl.
    let saved = null;
    try { saved = JSON.parse(localStorage.getItem("dk_lang") || "null"); } catch { saved = "nl"; }
    const used = saved !== null || localStorage.getItem("dk_onb") !== null || localStorage.getItem("dk_en_onb") !== null;
    if (q === "en" || q === "nl") {
      if (!used) { localStorage.setItem("dk_lang", JSON.stringify(q)); saved = q; sessionStorage.removeItem("dk_lang_tmp"); }
      else if (q === (saved || "nl")) sessionStorage.removeItem("dk_lang_tmp");
      else sessionStorage.setItem("dk_lang_tmp", q);
    }
    const tmp = sessionStorage.getItem("dk_lang_tmp");
    if (tmp === "en" || tmp === "nl") { v = tmp; LANG_TEMP = true; }
    else v = saved;
  } catch { }
  return v === "en" ? "en" : "nl";
})();
/** Geçici dili (ya da başka bir dili) kalıcı yapar ve uygulamayı o dilde yeniden açar.
    extraQS (v8.3, isteğe bağlı): korunacak diğer adres parametreleri (ör. "mode=live") — lang/tab yine buradan yazılır. */
function setLangPermanent(code, tab = "ben", extraQS = "") {
  const c = code === "en" ? "en" : "nl";
  try { localStorage.setItem("dk_lang", JSON.stringify(c)); sessionStorage.removeItem("dk_lang_tmp"); } catch { }
  let extra = "";
  try { const q = new URLSearchParams(extraQS || ""); q.delete("lang"); q.delete("tab"); extra = q.toString(); } catch { }
  location.replace(location.pathname + "?tab=" + encodeURIComponent(tab) + (extra ? "&" + extra : ""));
}
window.LANG_TEMP = LANG_TEMP; window.setLangPermanent = setLangPermanent;
const L = LANGS[LANG];
window.LANG = LANG; window.L = L; window.LANGS = LANGS;
if (LANG === "en" && window.EN) Object.assign(window, window.EN);
document.documentElement.dataset.lang = LANG;
