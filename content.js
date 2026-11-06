/* Dil Köprüsü — ders içeriği
   Her cümle: [Felemenkçe, Türkçe, okunuş (Türkçe harflerle, yaklaşık)]
   Okunuşta asla "w" yok (w → v); Flaman ağzında v ötümlü kalır (ver- → vır-, asla fır-).
   Seviye grupları: A1 başlangıç → A2 günlük hayat → B1 iş & kariyer, artı şu anki iş (süpermarket). */
"use strict";
window.LEVELS = [
  { id: "A1", n: "Seviye A1 — Başlangıç", d: "Kendini tanıt, sayılar, saat, temel ihtiyaçlar" },
  { id: "A2", n: "Seviye A2 — Günlük hayat", d: "Ulaşım, ev, doktor, resmî işler, sohbet, Flaman ağzı" },
  { id: "B1", n: "Seviye B1 — İş & kariyer", d: "İş arama, iş görüşmesi, iş yerinde konuşma" },
  { id: "AH", n: "Şu anki iş — süpermarket", d: "Kasa, müşteri, raf, vardiya" }
];

window.CATS = [
  /* ---------------- A1 ---------------- */
  { id: "temel", lvl: "A1", e: "👋", n: "Selamlaşma & kibarlık", items: [
    ["Goedemorgen!", "Günaydın!", "hudımorhın"],
    ["Goeiedag!", "İyi günler! / Merhaba (Flaman, çok yaygın; girerken ve çıkarken)", "huyıdah"],
    ["Goedenavond!", "İyi akşamlar!", "hudınaavont"],
    ["Hoe gaat het?", "Nasılsınız? / Nasılsın?", "hu haat ıt"],
    ["Goed, merci. En met u?", "İyiyim, teşekkürler. Ya siz?", "hut, mersi. en met ü"],
    ["Dank u wel.", "Çok teşekkür ederim (kibar).", "dank ü vel"],
    ["Merci!", "Teşekkürler! (Belçika'da çok kullanılır)", "mersi"],
    ["Graag gedaan.", "Rica ederim.", "hraah hıdaan"],
    ["Alstublieft.", "Buyurun / Lütfen. Belçika'da 'merci'ye cevap olarak 'rica ederim' anlamında da söylenir.", "alstüblift"],
    ["Sorry, ik spreek nog niet zo goed Nederlands.", "Pardon, henüz çok iyi Felemenkçe konuşamıyorum.", "sori, ik spreek noh nit zoo hut needırlants"],
    ["Kunt u wat trager spreken, alstublieft?", "Biraz daha yavaş konuşabilir misiniz lütfen?", "künt ü vat traahır spreekın, alstüblift"],
    ["Kunt u dat herhalen?", "Bunu tekrarlar mısınız?", "künt ü dat herhaalın"],
    ["Ik begrijp het niet.", "Anlamıyorum.", "ik bıhreyp ıt nit"],
    ["Wat betekent dat?", "Bu ne demek?", "vat bıteekınt dat"],
    ["Hoe zeg je dat in het Nederlands?", "Bu Felemenkçede nasıl denir?", "hu zeh yı dat in ıt needırlants"],
    ["Nog een fijne dag!", "İyi günler dilerim!", "noh een feynı dah"],
    ["Tot ziens!", "Hoşça kalın! / Görüşmek üzere!", "tot zins"]
  ]},
  { id: "tanisma", lvl: "A1", e: "🙋", n: "Kendini tanıt", items: [
    ["Ik heet Elif.", "Benim adım Elif.", "ik heet elif"],
    ["Hoe heet je?", "Adın ne? (samimi)", "hu heet yı"],
    ["Wat is uw naam?", "Adınız ne? (kibar)", "vat is üv naam"],
    ["Aangenaam!", "Memnun oldum!", "aanhınaam"],
    ["Ik kom uit Turkije.", "Türkiye'denim.", "ik kom öyt türkeyı"],
    ["Waar kom je vandaan?", "Nerelisin?", "vaar kom yı vandaan"],
    ["Ik woon in Antwerpen.", "Anvers'te oturuyorum.", "ik voon in antverpın"],
    ["Ik woon sinds drie maanden in België.", "Üç aydır Belçika'da yaşıyorum.", "ik voon sints dri maandın in belhiyı"],
    ["Ik ben drieëntwintig jaar.", "23 yaşındayım.", "ik ben dri-ın-tvintıh yaar"],
    ["Ik leer Nederlands.", "Felemenkçe öğreniyorum.", "ik leer needırlants"],
    ["Ik spreek Turks en een beetje Engels.", "Türkçe ve biraz İngilizce konuşuyorum.", "ik spreek türks en een beetyı engıls"],
    ["Ik werk in een supermarkt.", "Bir süpermarkette çalışıyorum.", "ik verk in een süpırmarkt"],
    ["Ik ben getrouwd.", "Evliyim. (formlarda: gehuwd)", "ik ben hıtraut"],
    ["Ik ben single.", "Bekârım. (formlarda: ongehuwd)", "ik ben singıl"]
  ]},
  { id: "aile", lvl: "A1", e: "👨‍👩‍👧", n: "Aile & insanlar", items: [
    ["Dit is mijn broer.", "Bu benim erkek kardeşim / ağabeyim.", "dit is meyn brur"],
    ["Mijn zus woont in Turkije.", "Kız kardeşim Türkiye'de yaşıyor.", "meyn züs voont in türkeyı"],
    ["Mijn ouders wonen in Ankara.", "Annemle babam Ankara'da oturuyor.", "meyn audırs voonın in ankara"],
    ["Mijn moeder is lerares.", "Annem öğretmen.", "meyn mudır is leeraares"],
    ["Mijn vader werkt in Istanbul.", "Babam İstanbul'da çalışıyor.", "meyn vaadır verkt in istanbul"],
    ["Dit is mijn vrouw.", "Bu benim karım.", "dit is meyn vrau"],
    ["Dit is mijn man.", "Bu benim kocam.", "dit is meyn man"],
    ["Heb je kinderen?", "Çocuğun var mı?", "hep yı kindırın"],
    ["Ik heb twee kinderen.", "İki çocuğum var.", "ik hep tvee kindırın"],
    ["Hij is een goede vriend.", "O iyi bir arkadaş.", "hey is een hudı vrint"],
    ["Zij is mijn vriendin.", "O benim kız arkadaşım / sevgilim.", "zey is meyn vrindin"],
    ["Onze buren zijn heel sympathiek.", "Komşularımız çok sempatik.", "onzı bürın zeyn heel simpatik"],
    ["Hij is heel vriendelijk.", "O çok nazik.", "hey is heel vrindılık"],
    ["Zij is mijn collega.", "O benim iş arkadaşım.", "zey is meyn koleeha"]
  ]},
  { id: "sayi", lvl: "A1", e: "🔢", n: "Sayılar & para", items: [
    ["één, twee, drie, vier, vijf", "1, 2, 3, 4, 5", "een, tvee, dri, vir, veyf"],
    ["zes, zeven, acht, negen, tien", "6, 7, 8, 9, 10", "zes, zeevın, aht, neehın, tin"],
    ["elf, twaalf, dertien, veertien", "11, 12, 13, 14", "elf, tvaalf, dertin, veertin"],
    ["twintig, dertig, veertig, vijftig", "20, 30, 40, 50", "tvintıh, dertıh, veertıh, veyftıh"],
    ["vijfentwintig", "25 (ters söylenir: beş-ve-yirmi)", "veyf-ın-tvintıh"],
    ["honderd, duizend", "100, 1000", "hondırt, döyzınt"],
    ["Twee euro vijftig.", "2,50 €", "tvee öro veyftıh"],
    ["Dat kost negen euro negenennegentig.", "Bu 9,99 € tutuyor.", "dat kost neehın öro neehın-ın-neehıntıh"],
    ["Hoeveel kost dit?", "Bu ne kadar?", "huveel kost dit"],
    ["Dat is te duur.", "Bu fazla pahalı.", "dat is tı düür"],
    ["Wat is uw gsm-nummer?", "Cep numaranız ne? (Belçika'da cep telefonu = gsm)", "vat is üv hee-es-em-nümır"],
    ["Ik geef u mijn gsm-nummer.", "Size cep numaramı vereyim.", "ik heef ü meyn hee-es-em-nümır"]
  ]},
  { id: "zaman", lvl: "A1", e: "🕒", n: "Gün, saat, takvim", items: [
    ["maandag, dinsdag, woensdag", "pazartesi, salı, çarşamba", "maandah, dinsdah, vunsdah"],
    ["donderdag, vrijdag, zaterdag, zondag", "perşembe, cuma, cumartesi, pazar", "dondırdah, vreydah, zaatırdah, zondah"],
    ["vandaag, morgen, gisteren", "bugün, yarın, dün", "vandaah, morhın, histırın"],
    ["Hoe laat is het?", "Saat kaç?", "hu laat is ıt"],
    ["Het is drie uur.", "Saat üç.", "ıt is dri üür"],
    ["Het is half vier.", "Saat üç buçuk. (Dikkat: 'dördün yarısı' der!)", "ıt is half vir"],
    ["Het is kwart over twee.", "İkiyi çeyrek geçiyor. (konuşmada 'kwart na twee' de çok duyulur)", "ıt is kvart oovır tvee"],
    ["Het is kwart voor drie.", "Üçe çeyrek var.", "ıt is kvart voor dri"],
    ["Ik werk 's morgens.", "Sabahları çalışıyorum.", "ik verk smorhıns"],
    ["We eten 's middags om twaalf uur.", "Öğlen saat on ikide yemek yiyoruz. ('s middags = öğlen, 12–14)", "vı eetın smidahs om tvaalf üür"],
    ["Ik heb 's namiddags een afspraak.", "Öğleden sonra randevum var. (Belçika: 's namiddags = öğleden sonra)", "ik hep snaamidahs een afspraak"],
    ["Ik ben 's avonds thuis.", "Akşamları evdeyim.", "ik ben saavonts töys"],
    ["Ik werk deze week elke dag.", "Bu hafta her gün çalışıyorum.", "ik verk deezı veek elkı dah"],
    ["Volgende week heb ik verlof.", "Gelecek hafta iznim var.", "volhındı veek hep ik vırlof"],
    ["januari, februari, maart, april", "ocak, şubat, mart, nisan", "yanüari, febrüari, maart, april"],
    ["Ik heb een afspraak om tien uur.", "Saat onda randevum var.", "ik hep een afspraak om tin üür"]
  ]},
  { id: "gunluk", lvl: "A1", e: "☕", n: "Temel ihtiyaçlar", items: [
    ["Ik wil graag een koffie.", "Bir kahve istiyorum (kibar).", "ik vil hraah een kofi"],
    ["Mag ik een glas water?", "Bir bardak su alabilir miyim?", "mah ik een hlas vaatır"],
    ["Ik heb honger.", "Acıktım.", "ik hep hongır"],
    ["Ik heb dorst.", "Susadım.", "ik hep dorst"],
    ["Ik ben moe.", "Yorgunum.", "ik ben mu"],
    ["Waar is het toilet?", "Tuvalet nerede?", "vaar is ıt tvalet"],
    ["Ja, graag.", "Evet, lütfen.", "ya, hraah"],
    ["Nee, dank u.", "Hayır, teşekkürler.", "nee, dank ü"],
    ["Misschien morgen.", "Belki yarın.", "mis-hin morhın"],
    ["Ik weet het niet.", "Bilmiyorum.", "ik veet ıt nit"],
    ["Geen probleem.", "Sorun değil.", "heen probleem"],
    ["Het regent weer.", "Yine yağmur yağıyor. (Belçika klasiği)", "ıt reehınt veer"],
    ["Het is koud vandaag.", "Bugün hava soğuk.", "ıt is kaut vandaah"],
    ["Kunt u mij helpen?", "Bana yardım edebilir misiniz?", "künt ü mey helpın"]
  ]},

  /* ---------------- A2 ---------------- */
  { id: "ulasim", lvl: "A2", e: "🚆", n: "Ulaşım (tren, De Lijn)", items: [
    ["Waar is de bushalte?", "Otobüs durağı nerede?", "vaar is dı büshaltı"],
    ["Een ticket naar Brussel, alstublieft.", "Brüksel'e bir bilet lütfen.", "een tiket naar brüsıl, alstüblift"],
    ["Heen en terug.", "Gidiş-dönüş.", "heen en tırüh"],
    ["Hoe laat vertrekt de trein?", "Tren saat kaçta kalkıyor?", "hu laat vırtrekt dı treyn"],
    ["Van welk perron?", "Hangi perondan?", "van velk peron"],
    ["De trein heeft vertraging.", "Trenin rötarı var.", "dı treyn heeft vırtraahing"],
    ["Ik moet overstappen in Gent.", "Gent'te aktarma yapmam lazım.", "ik mut oovırstapın in hent"],
    ["Is deze plaats nog vrij?", "Bu yer boş mu?", "is deezı plaats noh vrey"],
    ["Ik kom met de fiets.", "Bisikletle geliyorum.", "ik kom met dı fits"],
    ["Waar kan ik een ticket voor De Lijn kopen?", "De Lijn (otobüs/tramvay) biletini nereden alabilirim? (genelde uygulama ya da otomat — kontrol et)", "vaar kan ik een tiket voor dı leyn koopın"],
    ["Stopt deze bus aan het station?", "Bu otobüs istasyonda duruyor mu?", "stopt deezı büs aan ıt staşon"],
    ["Sorry dat ik te laat ben. De bus had vertraging.", "Kusura bakmayın, geç kaldım. Otobüs gecikti.", "sori dat ik tı laat ben. dı büs hat vırtraahing"]
  ]},
  { id: "ev", lvl: "A2", e: "🏠", n: "Ev & kira", items: [
    ["Ik zoek een appartement.", "Daire arıyorum.", "ik zuk een apartıment"],
    ["Hoeveel is de huur per maand?", "Aylık kira ne kadar?", "huveel is dı hüür per maant"],
    ["Zijn de kosten inbegrepen?", "Masraflar/aidat (kosten, lasten) dahil mi? (Su, elektrik, gaz genelde ayrıdır.)", "zeyn dı kostın inbıhreepın"],
    ["Wanneer kan ik het appartement bezoeken?", "Daireyi ne zaman görmeye gelebilirim?", "vaneer kan ik ıt apartıment bızukın"],
    ["Hoeveel is de huurwaarborg?", "Kira depozitosu ne kadar? (Flanders'ta en fazla 3 aylık kira, kiracı adına bloke hesapta)", "huveel is dı hüürvaarborh"],
    ["Ik wil het huurcontract eerst lezen.", "Önce kira sözleşmesini okumak istiyorum.", "ik vil ıt hüürkontrakt eerst leezın"],
    ["Ik bel de huisbaas.", "Ev sahibini arıyorum. (Belçika'da 'de eigenaar' da denir)", "ik bel dı höysbaas"],
    ["De keuken is klein.", "Mutfak küçük.", "dı kökın is kleyn"],
    ["Het appartement heeft twee slaapkamers.", "Dairenin iki yatak odası var.", "ıt apartıment heeft tvee slaapkaamırs"],
    ["De verwarming werkt niet.", "Kalorifer çalışmıyor.", "dı vırvarming verkt nit"],
    ["Er is een lek in de badkamer.", "Banyoda su kaçağı var.", "ır is een lek in dı batkaamır"],
    ["Wanneer wordt het afval opgehaald?", "Çöpler ne zaman toplanıyor?", "vaneer vort ıt afal ophıhaalt"]
  ]},
  { id: "resmi", lvl: "A2", e: "🏛️", n: "Resmî işler & banka", items: [
    ["Ik heb een afspraak bij de gemeente.", "Belediyede randevum var.", "ik hep een afspraak bey dı hımeentı"],
    ["Welke documenten moet ik meebrengen?", "Hangi belgeleri getirmem gerekiyor?", "velkı dokümentın mut ik meebrengın"],
    ["Kunt u dit formulier uitleggen?", "Bu formu açıklar mısınız?", "künt ü dit formülir öytlehın"],
    ["Ik begrijp deze brief niet.", "Bu mektubu anlamıyorum.", "ik bıhreyp deezı brif nit"],
    ["Hier is mijn verblijfskaart.", "Buyurun, oturma kartım.", "hir is meyn vırbleyfskaart"],
    ["Wat is uw rijksregisternummer?", "Ulusal sicil numaranız ne? (kimlik kartının arkasında)", "vat is üv reyksreehistırnümır"],
    ["Ik wil een bankrekening openen.", "Banka hesabı açmak istiyorum.", "ik vil een bankreekıning oopın"],
    ["Bij welke mutualiteit bent u?", "Hangi sağlık sigortası kurumuna (mutualiteit / ziekenfonds) kayıtlısınız?", "bey velkı mütüvaliteyt bent ü"],
    ["Mag ik een kopie?", "Bir kopyasını alabilir miyim?", "mah ik een kopi"],
    ["Moet ik iets betalen?", "Bir şey ödemem gerekiyor mu?", "mut ik its bıtaalın"]
  ]},
  { id: "saglik", lvl: "A2", e: "🩺", n: "Doktor & eczane", items: [
    ["Ik wil een afspraak maken bij de huisarts.", "Aile hekiminden randevu almak istiyorum.", "ik vil een afspraak maakın bey dı höysarts"],
    ["Ik heb hier pijn.", "Burası ağrıyor.", "ik hep hir peyn"],
    ["Ik heb hoofdpijn.", "Başım ağrıyor.", "ik hep hooftpeyn"],
    ["Ik heb buikpijn.", "Karnım ağrıyor.", "ik hep böykpeyn"],
    ["Ik heb koorts.", "Ateşim var.", "ik hep koorts"],
    ["Ik ben al drie dagen ziek.", "Üç gündür hastayım.", "ik ben al dri daahın zik"],
    ["Heb ik een doktersbriefje nodig voor mijn werk?", "İş için doktor raporu gerekir mi? (Belçika: ziektebriefje / medisch attest)", "hep ik een doktırsbrifyı noodıh voor meyn verk"],
    ["Ik ben allergisch voor penicilline.", "Penisiline alerjim var.", "ik ben alerhis voor penisilinı"],
    ["Hoe vaak moet ik dit innemen?", "Bunu ne sıklıkla almalıyım?", "hu vaak mut ik dit inneemın"],
    ["Ik heb een voorschrift van de dokter.", "Doktordan reçetem var. (Belçika: voorschrift = reçete)", "ik hep een voors-hrift van dı doktır"],
    ["Ik voel me al beter.", "Kendimi daha iyi hissediyorum.", "ik vul mı al beetır"]
  ]},
  { id: "duygu", lvl: "A2", e: "💬", n: "Sohbet & fikir", items: [
    ["Wat doe je in je vrije tijd?", "Boş zamanında ne yapıyorsun?", "vat du yı in yı vreyı teyt"],
    ["Ik hou van voetbal.", "Futbolu severim.", "ik hau van vudbal"],
    ["Dat vind ik leuk.", "Bu hoşuma gidiyor.", "dat vint ik lök"],
    ["Dat vind ik tof!", "Bu çok güzel! (Flaman günlük dil: tof, plezant)", "dat vint ik tof"],
    ["Wat vind jij ervan?", "Sen ne düşünüyorsun?", "vat vint yey ırvan"],
    ["Ik ben het ermee eens.", "Katılıyorum.", "ik ben ıt ırmee eens"],
    ["Ik ben het er niet mee eens.", "Katılmıyorum.", "ik ben ıt ır nit mee eens"],
    ["Ik ben blij.", "Mutluyum.", "ik ben bley"],
    ["Ik ben een beetje zenuwachtig.", "Biraz gerginim.", "ik ben een beetyı zeenüvahtıh"],
    ["Proficiat!", "Tebrikler! (Flaman'da en yaygın)", "proofisiaat"],
    ["Gefeliciteerd!", "Tebrikler!", "hıfeelisiteert"],
    ["Veel succes!", "Bol şans!", "veel sükses"],
    ["Beterschap!", "Geçmiş olsun!", "beetırs-hap"],
    ["Prettig weekend!", "İyi hafta sonları!", "pretıh vikent"]
  ]},
  { id: "vlaams", lvl: "A2", e: "🇧🇪", n: "Flaman ağzı", items: [
    ["Allee!", "Hadi! / Haydi ya! (her yere uyan ünlem)", "alee"],
    ["Amai!", "Vay be! (şaşırma)", "amay"],
    ["Ik heb goesting in koffie.", "Canım kahve çekiyor.", "ik hep husting in kofi"],
    ["Hoe is 't?", "Nasılsın? (samimi)", "hu ist"],
    ["'t Is in orde.", "Tamamdır / Sorun yok.", "tis in ordı"],
    ["Wacht efkes.", "Bir saniye bekle. (efkes = standart dildeki 'even')", "vaht efkıs"],
    ["Kunt ge mij efkes helpen?", "Bana bir yardım edebilir misin? (ge = sen/siz, Flaman)", "künt hı mey efkıs helpın"],
    ["Wablieft?", "Efendim? (duyamayınca)", "vablift"],
    ["Da's plezant!", "Bu çok hoş / keyifli!", "das plızant"],
    ["Ik ben content.", "Memnunum.", "ik ben kontent"],
    ["Nog ne schone dag!", "İyi günler! (samimi Flaman)", "noh nı s-hoonı dah"],
    ["Salukes!", "Hoşça kal! (samimi)", "salükıs"]
  ]},
  { id: "acil", lvl: "A2", e: "🚑", n: "Acil durum", items: [
    ["Help!", "Yardım edin!", "help"],
    ["Bel een ziekenwagen! Bel 112!", "Ambulans çağırın! 112'yi arayın! (ambulans ve itfaiye)", "bel een zikınvaahın! bel een-een-tvee"],
    ["Bel de politie! Bel 101!", "Polisi arayın! 101'i arayın!", "bel dı politsi! bel een-nül-een"],
    ["Er is een ongeval gebeurd.", "Bir kaza oldu.", "ır is een onhıval hıbört"],
    ["Ik voel me niet goed.", "Kendimi iyi hissetmiyorum.", "ik vul mı nit hut"],
    ["Waar is de apotheek?", "Eczane nerede?", "vaar is dı apoteek"],
    ["Mijn portefeuille is gestolen.", "Cüzdanım çalındı.", "meyn portıföy is hıstoolın"],
    ["Ik wil aangifte doen bij de politie.", "Polise şikâyette bulunmak (tutanak) istiyorum.", "ik vil aanhiftı dun bey dı politsi"]
  ]},
  { id: "inburgering", lvl: "A2", e: "🧭", n: "İlk resmî adımlar & uyum", items: [
    ["Ik wil me inschrijven in de gemeente.", "Belediyeye (nüfusa) kaydolmak istiyorum.", "ik vil mı ins-hreyvın in dı hımeentı"],
    ["Ik heb mijn nieuwe adres doorgegeven.", "Yeni adresimi bildirdim.", "ik hep meyn niuvı adres doorhıheevın"],
    ["Wanneer komt de wijkagent langs?", "Mahalle polisi (adres kontrolü için) ne zaman gelir?", "vaneer komt dı veykaahent langs"],
    ["Ik heb mijn pincode en pukcode nodig.", "PIN ve PUK kodlarıma ihtiyacım var. (kimlik kartı)", "ik hep meyn pinkoodı en pükkoodı noodıh"],
    ["Mijn verblijfskaart vervalt binnenkort.", "Oturma kartımın süresi yakında doluyor.", "meyn vırbleyfskaart vırvalt binınkort"],
    ["Moet ik een inburgeringstraject volgen?", "Uyum programına katılmam gerekiyor mu?", "mut ik een inbürhıringstraayekt volhın"],
    ["Ik volg de cursus maatschappelijke oriëntatie.", "Toplumsal oryantasyon (MO) kursuna gidiyorum.", "ik volh dı kürsüs maats-hapılıkı ooriyentaatsi"],
    ["Ik heb mijn inburgeringsattest gehaald.", "Uyum belgemi aldım.", "ik hep meyn inbürhıringsatest hıhaalt"],
    ["Ik wil een afspraak bij het Huis van het Nederlands.", "Huis van het Nederlands'tan randevu istiyorum.", "ik vil een afspraak bey ıt höys van ıt needırlants"],
    ["Ik meld me aan met itsme.", "itsme ile giriş yapıyorum.", "ik melt mı aan met itsmi"],
    ["Ik heb een brief gekregen in mijn eBox.", "eBox'ıma bir mektup geldi.", "ik hep een brif hıkreehın in meyn iboks"],
    ["Wat moet ik met deze brief doen?", "Bu mektupla ne yapmalıyım?", "vat mut ik met deezı brif dun"],
    ["Ik heb een tolk nodig.", "Tercümana ihtiyacım var.", "ik hep een tolk noodıh"]
  ]},
  { id: "zorg", lvl: "A2", e: "🏥", n: "Sağlık sistemi (pratik)", items: [
    ["Wat is het nummer van de huisartsenwachtpost?", "Nöbetçi aile hekimi merkezinin numarası ne?", "vat is ıt nümır van dı höysartsınvahtpost"],
    ["'s Nachts en in het weekend bel ik 1733.", "Gece ve hafta sonu (acil değilse) 1733'ü ararım.", "snahts en in ıt vikent bel ik zeevıntin dri-ın-dertıh"],
    ["Waar is de wachtapotheek?", "Nöbetçi eczane nerede?", "vaar is dı vahtapoteek"],
    ["Ik heb een ziektebriefje nodig voor mijn werk.", "İşim için hastalık raporu lazım.", "ik hep een ziktıbrifyı noodıh voor meyn verk"],
    ["Hoeveel moet ik zelf betalen?", "Kendim ne kadar ödemeliyim? (remgeld = katkı payı)", "huveel mut ik zelf bıtaalın"],
    ["Past u de derdebetalersregeling toe?", "Doğrudan sigortaya fatura ediyor musunuz? (daha az ödersin)", "past ü dı derdıbıtaalırsreehıling tu"],
    ["Ik wil een globaal medisch dossier openen.", "Global tıbbi dosya (GMD) açtırmak istiyorum.", "ik vil een hloobaal meedis dosyee oopın"],
    ["Ik ben aangesloten bij de mutualiteit.", "Mutualiteit'e (sağlık sigortası) kayıtlıyım.", "ik ben aanhıslootın bey dı mütüvaliteyt"],
    ["Ik heb een voorschrift voor de kinesist.", "Fizyoterapist (kiné) için reçetem var.", "ik hep een voors-hrift voor dı kinızist"],
    ["Hoe lang moet ik thuisblijven?", "Ne kadar evde kalmalıyım?", "hu lang mut ik töysbleyvın"],
    ["Ik moet mijn werkgever verwittigen.", "İşverenime haber vermeliyim.", "ik mut meyn verkheevır vırvitıhın"],
    ["Ik bel voor het begin van mijn shift.", "Vardiyam başlamadan önce ararım.", "ik bel voor ıt bıhin van meyn şift"]
  ]},
  { id: "buurt", lvl: "A2", e: "♻️", n: "Ev, çöp & mahalle", items: [
    ["Wanneer is de plaatsbeschrijving?", "Ev tespit tutanağı (plaatsbeschrijving) ne zaman yapılacak?", "vaneer is dı plaatsbıs-hreyving"],
    ["De huurwaarborg staat op een geblokkeerde rekening.", "Kira depozitosu bloke bir hesapta duruyor.", "dı hüürvaarborh staat op een hıblokeerdı reekıning"],
    ["Is het huurcontract geregistreerd?", "Kira sözleşmesi kayıt ettirildi mi?", "is ıt hüürkontrakt hıreehistreert"],
    ["Wie is de syndicus van het gebouw?", "Binanın yöneticisi kim?", "vi is dı sindiküs van ıt hıbau"],
    ["Ik moet een energiecontract afsluiten.", "Elektrik-gaz sözleşmesi yapmam lazım.", "ik mut een eenerjikontrakt afslöytın"],
    ["Wat mag er in de blauwe pmd-zak?", "Mavi PMD poşetine ne girer? (plastik ambalaj, metal kutu, içecek kartonu)", "vat mah ır in dı blauvı pee-em-dee-zak"],
    ["Groenten- en fruitafval gaat in de gft-container.", "Sebze-meyve atığı GFT (organik) kutusuna gider.", "hruntın en fröytafal haat in dı hee-ef-tee-konteenır"],
    ["Dit is restafval.", "Bu karışık evsel çöp (restafval).", "dit is restafal"],
    ["Wanneer is het recyclagepark open?", "Geri dönüşüm merkezi ne zaman açık?", "vaneer is ıt risiklaajıpark oopın"],
    ["Waar vind ik de ophaalkalender?", "Çöp toplama takvimini nereden bulurum?", "vaar vint ik dı ophaalkaalendır"],
    ["Er is een pakje voor u bij mij afgegeven.", "Sizin bir paketiniz bana bırakıldı.", "ır is een pakyı voor ü bey mey afhıheevın"],
    ["Sorry voor het lawaai gisteren.", "Dünkü gürültü için özür dilerim.", "sori voor ıt lavaay histırın"]
  ]},
  { id: "tussentaal", lvl: "A2", e: "👂", n: "Flamanca dinleme (anlamak için)", items: [
    ["Zijt ge moe?", "Yorgun musun? (ge zijt = jij bent)", "zeyt hı mu"],
    ["Hebt ge dat gezien?", "Bunu gördün mü? (ge hebt = jij hebt)", "hept hı dat hızin"],
    ["Kunde gij dat efkes doen?", "Bunu bir saniye yapabilir misin? (kunde = kunt ge)", "kündı hey dat efkıs dun"],
    ["Gade mee?", "Geliyor musun? (gade = gaat ge)", "haadı mee"],
    ["'k Weet het nie.", "Bilmiyorum. ('k = ik, nie = niet)", "kveet ıt ni"],
    ["Da's nie waar!", "Olamaz! / Bu doğru değil!", "das ni vaar"],
    ["Ik kom seffens.", "Birazdan geliyorum. (seffens = hemen, birazdan)", "ik kom sefıns"],
    ["Ik doe dat direct.", "Hemen yapıyorum. (direct = şimdi, hemen)", "ik du dat direkt"],
    ["Dat is ambetant.", "Bu can sıkıcı. (ambetant = vervelend)", "dat is ambıtant"],
    ["Zever niet!", "Saçmalama! (zeveren = boş konuşmak)", "zeevır nit"],
    ["Hebt ge ne zak nodig?", "Poşete ihtiyacınız var mı? (ne = een)", "hept hı nı zak noodıh"],
    ["Een pintje, alstublieft.", "Bir bira lütfen. (pintje = bardak fıçı bira)", "een pintyı, alstüblift"],
    ["Hoeveel is 't?", "Ne kadar? (müşteri sorar)", "huveel ist"],
    ["Mag ik efkes passeren?", "Geçebilir miyim? (dar koridorda)", "mah ik efkıs paseerın"]
  ]},

  /* ---------------- B1 ---------------- */
  { id: "isara", lvl: "B1", e: "🔍", n: "İş arama (VDAB)", items: [
    ["Ik zoek werk.", "İş arıyorum.", "ik zuk verk"],
    ["Ik ben ingeschreven bij de VDAB.", "VDAB'ye (Flaman iş bulma kurumu) kayıtlıyım.", "ik ben inhıs-hreevın bey dı vee-dee-aa-bee"],
    ["Ik wil solliciteren voor deze job.", "Bu işe başvurmak istiyorum. (Flaman'da 'job' çok yaygın)", "ik vil solisiteerın voor deezı cop"],
    ["Ik heb de vacature op de website gezien.", "İlanı internet sitesinde gördüm.", "ik hep dı vakatüürı op dı vebsayt hızin"],
    ["Hier is mijn cv.", "İşte özgeçmişim.", "hir is meyn see-vee"],
    ["Ik heb ervaring in de verkoop.", "Satış alanında deneyimim var.", "ik hep ırvaaring in dı vırkoop"],
    ["Ik ben flexibel en kan in het weekend werken.", "Esneğim, hafta sonu da çalışabilirim.", "ik ben fleksibıl en kan in ıt vikent verkın"],
    ["Is het een vast contract of tijdelijk?", "Süresiz (kadrolu) mu, geçici mi?", "is ıt een vast kontrakt of teydılık"],
    ["Hoeveel uren per week?", "Haftada kaç saat?", "huveel üürın per veek"],
    ["Wat is het brutoloon?", "Brüt maaş ne kadar?", "vat is ıt brütoloon"],
    ["Ik volg een cursus Nederlands.", "Felemenkçe kursuna gidiyorum.", "ik volh een kürsüs needırlants"],
    ["Ik ben ingeschreven bij een interimkantoor.", "Bir geçici iş ajansına (interim) kayıtlıyım.", "ik ben inhıs-hreevın bey een intırimkantoor"],
    ["Ik wil een opleiding volgen.", "Bir meslek eğitimi almak istiyorum.", "ik vil een opleyding volhın"]
  ]},
  { id: "mulakat", lvl: "B1", e: "🤝", n: "İş görüşmesi", items: [
    ["Vertel eens iets over jezelf.", "Biraz kendinden bahset. (görüşmeci sorar)", "vırtel eens its oovır yızelf"],
    ["Ik ben gemotiveerd en ik leer snel.", "Motiveyim ve çabuk öğrenirim.", "ik ben hımotiveert en ik leer snel"],
    ["In Turkije werkte ik als verkoper.", "Türkiye'de satış elemanı olarak çalışıyordum.", "in türkeyı verktı ik als vırkoopır"],
    ["Ik heb een diploma in boekhouding.", "Muhasebe diplomam var. (yabancı diploma için NARIC-Vlaanderen denklik başvurusu)", "ik hep een diploma in bukhauding"],
    ["Ik werk graag in een team.", "Ekip içinde çalışmayı severim.", "ik verk hraah in een tim"],
    ["Waarom wil je hier werken?", "Neden burada çalışmak istiyorsun?", "vaarom vil yı hir verkın"],
    ["Omdat ik mij hier verder wil ontwikkelen.", "Çünkü burada kendimi geliştirmek istiyorum.", "omdat ik mey hir verdır vil ontvikılın"],
    ["Mijn Nederlands wordt elke dag beter.", "Felemenkçem her gün daha iyi oluyor.", "meyn needırlants vort elkı dah beetır"],
    ["Wanneer kan ik beginnen?", "Ne zaman başlayabilirim?", "vaneer kan ik bıhinın"],
    ["Bedankt voor het gesprek.", "Görüşme için teşekkür ederim.", "bıdankt voor ıt hısprek"],
    ["Ik kijk uit naar uw antwoord.", "Cevabınızı bekliyorum.", "ik keyk öyt naar üv antvoort"]
  ]},
  { id: "isyeri", lvl: "B1", e: "🏢", n: "İş yerinde (genel)", items: [
    ["Wat zijn mijn taken?", "Görevlerim neler?", "vat zeyn meyn taakın"],
    ["Kunt u mij tonen hoe dat werkt?", "Nasıl yapıldığını bana gösterebilir misiniz?", "künt ü mey toonın hu dat verkt"],
    ["Ik ben klaar. Wat kan ik nog doen?", "Bitirdim. Başka ne yapabilirim?", "ik ben klaar. vat kan ik noh dun"],
    ["Ik heb een vraag over mijn loonbrief.", "Maaş bordromla ilgili bir sorum var.", "ik hep een vraah oovır meyn loonbrif"],
    ["Ik wil graag verlof aanvragen.", "İzin talep etmek istiyorum.", "ik vil hraah vırlof aanvraahın"],
    ["Ik kan overuren doen.", "Fazla mesai yapabilirim.", "ik kan oovırüürın dun"],
    ["Ik heb een fout gemaakt, sorry.", "Bir hata yaptım, özür dilerim.", "ik hep een faut hımaakt, sori"],
    ["Goeiedag, u spreekt met Elif.", "(Telefonda) İyi günler, Elif konuşuyor.", "huyıdah, ü spreekt met elif"],
    ["Ik stuur u straks een e-mail.", "Size birazdan bir e-posta göndereceğim. (Flaman konuşmada 'straks' bazen 'az önce' demektir)", "ik stüür ü straks een imeyl"],
    ["De vergadering begint om negen uur.", "Toplantı saat dokuzda başlıyor.", "dı vırhaadıring bıhint om neehın üür"],
    ["Veiligheid eerst!", "Önce güvenlik!", "veylıhheyt eerst"]
  ]},
  { id: "werkrecht", lvl: "B1", e: "💶", n: "Maaş bordrosu & çalışma hakları", items: [
    ["Wanneer krijg ik mijn loon?", "Maaşımı ne zaman alırım?", "vaneer kreyh ik meyn loon"],
    ["Mijn loonbrief klopt niet.", "Maaş bordrom doğru değil.", "meyn loonbrif klopt nit"],
    ["Krijg ik maaltijdcheques?", "Yemek çeki (maaltijdcheques) alıyor muyum?", "kreyh ik maalteytşeks"],
    ["Wanneer wordt het vakantiegeld betaald?", "Tatil parası (vakantiegeld) ne zaman ödenir?", "vaneer vort ıt vaakansihelt bıtaalt"],
    ["Heb ik recht op een eindejaarspremie?", "Yıl sonu primine (13. maaş) hakkım var mı?", "hep ik reht op een eyndıyaarspreemi"],
    ["Wat staat er in het arbeidsreglement?", "İş yönetmeliğinde ne yazıyor?", "vat staat ır in ıt arbeytsreehlıment"],
    ["Onder welk paritair comité val ik?", "Hangi sektör komitesine bağlıyım? (paritair comité — maaş ölçeğini belirler)", "ondır velk paariteer komitee val ik"],
    ["Hoeveel vakantiedagen heb ik?", "Kaç gün yıllık iznim var?", "huveel vaakansidaahın hep ik"],
    ["Is dit een contract van onbepaalde duur?", "Bu süresiz (belirsiz süreli) bir sözleşme mi?", "is dit een kontrakt van onbıpaaldı düür"],
    ["Ik wil lid worden van een vakbond.", "Bir sendikaya üye olmak istiyorum.", "ik vil lit vordın van een vakbont"],
    ["Ik heb een arbeidsongeval gehad.", "İş kazası geçirdim.", "ik hep een arbeytsonhıval hıhat"],
    ["Ik heb mijn C4 nodig.", "C4 belgeme (işten ayrılış belgesi) ihtiyacım var.", "ik hep meyn see-vir noodıh"],
    ["Ik wil mijn diploma laten erkennen bij NARIC.", "Diplomama NARIC'ten denklik almak istiyorum.", "ik vil meyn diploma laatın ırkenın bey naarik"]
  ]},
  { id: "formtel", lvl: "B1", e: "📝", n: "Form, telefon & e-posta", items: [
    ["Wat is uw voornaam?", "Adınız ne? (formda: voornaam)", "vat is üv voornaam"],
    ["Wat is uw achternaam?", "Soyadınız ne?", "vat is üv ahtırnaam"],
    ["Wat is uw geboortedatum?", "Doğum tarihiniz ne?", "vat is üv hıboortıdaatüm"],
    ["Wat is uw burgerlijke staat?", "Medeni haliniz ne?", "vat is üv bürhırlıkı staat"],
    ["Ik ben wettelijk samenwonend.", "Yasal olarak birlikte yaşıyorum (resmî kayıtlı).", "ik ben vetılık saamınvoonınt"],
    ["Ik bel voor een afspraak.", "Randevu için arıyorum.", "ik bel voor een afspraak"],
    ["Kunt u mij terugbellen?", "Beni geri arayabilir misiniz?", "künt ü mey tırühbelın"],
    ["Hallo Jan, met Elif. Bel je mij even terug?", "Merhaba Jan, ben Elif. Beni geri arar mısın? (sesli mesaj)", "halo yan, met elif. bel yı mey eevın tırüh"],
    ["Ik stuur je een berichtje.", "Sana mesaj atıyorum. (WhatsApp / SMS)", "ik stüür yı een bırihtyı"],
    ["Ik ben vandaag tien minuten te laat.", "Bugün on dakika geç kalacağım.", "ik ben vandaah tin minütın tı laat"],
    ["Beste mevrouw Peeters,", "Sayın Peeters Hanım, (e-posta başı)", "bestı mıvrau peetırs"],
    ["Beste meneer Janssens,", "Sayın Janssens Bey, (e-posta başı)", "bestı mıneer yansıns"],
    ["In bijlage vindt u mijn cv.", "Ekte özgeçmişimi bulabilirsiniz. (Belçika e-postası)", "in beylaajı vint ü meyn see-vee"],
    ["Met vriendelijke groeten,", "Saygılarımla, (e-posta sonu)", "met vrindılıkı hrutın"]
  ]},

  /* ---------------- Şu anki iş: süpermarket ---------------- */
  { id: "kasa", lvl: "AH", e: "🛒", n: "Kasada", items: [
    ["Goeiedag, hebt u een Bonuskaart?", "İyi günler, Bonus kartınız var mı?", "huyıdah, hept ü een boonüskaart"],
    ["Hebt u een zak nodig?", "Poşete ihtiyacınız var mı? (poşet ücretli)", "hept ü een zak noodıh"],
    ["Is dat alles?", "Hepsi bu mu?", "is dat alıs"],
    ["Dat is dan elf euro vijftig.", "Toplam 11 euro 50 ediyor.", "dat is dan elf öro veyftıh"],
    ["Betaalt u met de kaart of cash?", "Kartla mı, nakit mi ödüyorsunuz?", "bıtaalt ü met dı kaart of keş"],
    ["Betaalt u met Bancontact?", "Bancontact (Belçika banka kartı) ile mi ödüyorsunuz?", "bıtaalt ü met bankontakt"],
    ["U mag uw kaart insteken.", "Kartınızı takabilirsiniz.", "ü mah üv kaart insteekın"],
    ["U mag contactloos betalen.", "Temassız ödeyebilirsiniz.", "ü mah kontaktloos bıtaalın"],
    ["Uw pincode, alstublieft.", "Şifreniz lütfen.", "üv pinkoodı, alstüblift"],
    ["De betaling is niet gelukt. Probeert u het nog eens?", "Ödeme olmadı. Bir daha dener misiniz?", "dı bıtaaling is nit hılükt. probeert ü ıt noh eens"],
    ["Wilt u uw kasticket?", "Fişinizi ister misiniz? (Belçika'da fişe 'kasticket' denir)", "vilt ü üv kastiket"],
    ["Hier is uw wisselgeld.", "Buyurun, para üstünüz.", "hir is üv visılhelt"],
    ["Mag ik uw identiteitskaart zien?", "Kimliğinizi görebilir miyim? (bira/şarap 16+, sert içki ve sigara 18+ — mağaza kuralına bak)", "mah ik üv identiteytskaart zin"],
    ["Sorry, deze kassa is gesloten.", "Pardon, bu kasa kapalı.", "sori, deezı kasa is hıslootın"],
    ["Dit product heeft geen prijs. Ik ga het even navragen.", "Bu ürünün fiyatı çıkmıyor. Hemen sorayım.", "dit prodükt heeft heen preys. ik ha ıt eevın naavraahın"]
  ]},
  { id: "kasa2", lvl: "AH", e: "💳", n: "Kasada: ödeme & özel durumlar", items: [
    ["U kunt ook met uw gsm betalen.", "Telefonunuzla da ödeyebilirsiniz.", "ü künt ook met üv hee-es-em bıtaalın"],
    ["Uw Bonuskaart is gescand.", "Bonus kartınız okutuldu.", "üv boonüskaart is hıskent"],
    ["Hebt u het niet kleiner?", "Daha bozuk paranız yok mu?", "hept ü ıt nit kleynır"],
    ["Ik kan dat briefje niet wisselen.", "Bu banknotu bozamıyorum.", "ik kan dat brifyı nit visılın"],
    ["Hebt u leeggoed?", "İade edilecek boş şişe/kasa (leeggoed) var mı? (mağazaya göre)", "hept ü leehut"],
    ["Hoe oud bent u?", "Kaç yaşındasınız?", "hu aut bent ü"],
    ["Sterke drank verkopen we pas vanaf achttien jaar.", "Sert içkiyi ancak 18 yaşından itibaren satıyoruz.", "sterkı drank vırkoopın vı pas vanaf ahtin yaar"],
    ["Sorry, zonder identiteitskaart mag ik dit niet verkopen.", "Üzgünüm, kimlik olmadan bunu satamam.", "sori, zondır identiteytskaart mah ik dit nit vırkoopın"],
    ["De kassa is even geblokkeerd.", "Kasa bir anlığına kilitlendi.", "dı kasa is eevın hıblokeert"],
    ["Mijn collega komt u direct helpen.", "İş arkadaşım hemen size yardıma geliyor.", "meyn koleeha komt ü direkt helpın"]
  ]},
  { id: "urun", lvl: "AH", e: "🔎", n: "Ürün soran müşteri", items: [
    ["Waar vind ik de melk?", "Süt nerede? (müşteri böyle sorar)", "vaar vint ik dı melk"],
    ["Dat ligt in gang vijf.", "O 5. koridorda.", "dat liht in hang veyf"],
    ["Helemaal achteraan, links.", "En arkada, solda.", "heelımaal ahtıraan, links"],
    ["Rechts, naast het brood.", "Sağda, ekmeğin yanında.", "rehts, naast ıt broot"],
    ["Kom, ik loop even mee.", "Gelin, sizinle birlikte geleyim.", "kom, ik loop eevın mee"],
    ["Het is uitverkocht.", "Tükendi.", "ıt is öytfırkoht"],
    ["Morgen komt er een nieuwe levering.", "Yarın yeni sevkiyat geliyor.", "morhın komt ır een niuvı leevıring"],
    ["Dat hebben wij niet in ons assortiment.", "Onu ürünlerimiz arasında bulundurmuyoruz.", "dat hebın vey nit in ons asortiment"],
    ["Ik ga het even vragen aan mijn collega.", "Hemen iş arkadaşıma sorayım.", "ik ha ıt eevın vraahın aan meyn koleeha"],
    ["Dit is in promo: twee plus één gratis.", "Bu indirimde: iki alana bir bedava.", "dit is in promo: tvee plüs een hratis"],
    ["De tweede aan halve prijs.", "İkincisi yarı fiyatına.", "dı tveedı aan halvı preys"],
    ["Hier staat de houdbaarheidsdatum.", "Son kullanma tarihi burada yazıyor. (Belçika'da çok: de vervaldatum)", "hir staat dı haudbaarheytsdaatüm"]
  ]},
  { id: "raf", lvl: "AH", e: "📦", n: "Raf & depo", items: [
    ["Ik ga de rekken aanvullen.", "Rafları dolduracağım.", "ik ha dı rekın aanvülın"],
    ["Waar moet dit staan?", "Bu nereye konacak?", "vaar mut dit staan"],
    ["De rolcontainer staat in het magazijn.", "Tekerlekli kafes arabası depoda duruyor.", "dı rolkonteenır staat in ıt mahazeyn"],
    ["Deze producten zijn vervallen.", "Bu ürünlerin tarihi geçmiş.", "deezı prodüktın zeyn vırvalın"],
    ["Zet de oudste producten vooraan.", "Tarihi eski olanları öne koy.", "zet dı audstı prodüktın vooraan"],
    ["De koeling is kapot.", "Soğutucu bozuk.", "dı kuling is kapot"],
    ["Er is iets gevallen in gang drie.", "3. koridorda bir şey düştü.", "ır is its hıvalın in hang dri"],
    ["Kan je mij even helpen?", "Bana biraz yardım edebilir misin?", "kan yı mey eevın helpın"],
    ["Ik ben klaar met dit pallet.", "Bu paletle işim bitti.", "ik ben klaar met dit palet"]
  ]},
  { id: "is", lvl: "AH", e: "🧑‍🤝‍🧑", n: "Vardiya & iş arkadaşları", items: [
    ["Hoe laat begint mijn shift?", "Vardiyam saat kaçta başlıyor?", "hu laat bıhint meyn şift"],
    ["Mag ik even pauze nemen?", "Kısa bir mola verebilir miyim?", "mah ik eevın pauzı neemın"],
    ["Ik ben ziek, ik kan vandaag niet komen.", "Hastayım, bugün gelemiyorum.", "ik ben zik, ik kan vandaah nit koomın"],
    ["Kan ik mijn shift ruilen met Sarah?", "Vardiyamı Sarah'la değiştirebilir miyim?", "kan ik meyn şift röylın met saara"],
    ["Wat moet ik nu doen?", "Şimdi ne yapmam gerekiyor?", "vat mut ik nü dun"],
    ["Kan je dat nog eens uitleggen?", "Bunu bir daha açıklar mısın?", "kan yı dat noh eens öytlehın"],
    ["Ik heb het begrepen.", "Anladım.", "ik hep ıt bıhreepın"],
    ["Wie is vandaag de verantwoordelijke?", "Bugün sorumlu kim?", "vi is vandaah dı vırantvoordılıkı"],
    ["Smakelijk!", "Afiyet olsun!", "smaakılık"],
    ["Tot morgen!", "Yarın görüşürüz!", "tot morhın"]
  ]},
  { id: "sorun", lvl: "AH", e: "🙏", n: "Sorun & şikâyet", items: [
    ["Het spijt me, dat is mijn fout.", "Özür dilerim, benim hatam.", "ıt speyt mı, dat is meyn faut"],
    ["Ik begrijp het. Ik ga het voor u oplossen.", "Anlıyorum. Sizin için çözeceğim.", "ik bıhreyp ıt. ik ha ıt voor ü oplosın"],
    ["Even geduld, alstublieft.", "Biraz sabır lütfen.", "eevın hıdült, alstüblift"],
    ["Ik roep even de verantwoordelijke.", "Hemen sorumluyu çağırıyorum.", "ik rup eevın dı vırantvoordılıkı"],
    ["Hebt u het kasticket nog?", "Fişiniz hâlâ duruyor mu?", "hept ü ıt kastiket noh"],
    ["U kunt het product terugbrengen met uw kasticket.", "Ürünü fişinizle iade edebilirsiniz.", "ü künt ıt prodükt tırühbrengın met üv kastiket"],
    ["Er is iets misgelopen.", "Bir şeyler ters gitti.", "ır is its mishıloopın"]
  ]}
];

/* ---------------- Dilbilgisi (Türkçe anlatım) ---------------- */
window.GRAMMAR = [
  { id: "g-spelling", lvl: "A1", t: "Yazım = okunuş: açık ve kapalı hece",
    body: "Felemenkçe yazım, ünlünün uzun mu kısa mı olduğunu gösterir.<br><b>Kapalı hece</b> (ünsüzle biter): uzun ünlü <b>çift</b> yazılır: maan, boom. Tek yazılırsa kısadır: man, bom.<br><b>Açık hece</b> (ünlüyle biter): tek harf yeter, yine uzun okunur: ma-nen, bo-men.<br>Kısa ünlüyü korumak için ünsüz <b>ikilenir</b>: man → man-nen, bel → bel-len.<br>Kelime sonunda <b>v → f</b>, <b>z → s</b> yazılır: brieven → brief, huizen → huis.<br>Bu yüzden çoğulda ve fiil çekiminde harfler değişir; ses aynı kalır.",
    ex: [["Er staan twee bomen in de tuin.", "Bahçede iki ağaç var. (boom → bo-men)", "ır staan tvee boomın in dı töyn"], ["De mannen werken in het magazijn.", "Adamlar depoda çalışıyor. (man → man-nen)", "dı manın verkın in ıt mahazeyn"], ["Ik lees de brieven van de gemeente.", "Belediyenin mektuplarını okuyorum. (lezen → lees, brief → brieven)", "ik lees dı brivın van dı hımeentı"], ["De huizen in deze straat zijn duur.", "Bu sokaktaki evler pahalı. (huis → huizen)", "dı höyzın in deezı straat zeyn düür"]] },
  { id: "g-dehet", lvl: "A1", t: "de / het — iki çeşit \"the\"",
    body: "Felemenkçede belirli tanımlık iki tanedir: <b>de</b> ve <b>het</b>. Hangisinin geleceği <b>çoğunlukla</b> kurala bağlı değildir; kelimeyi <b>tanımlığıyla birlikte</b> ezberle. Kelimelerin yaklaşık 2/3'ü <b>de</b> alır: emin değilsen de de.<br>Kesin ipuçları: çoğul her zaman <b>de</b>; küçültme ekli (-je, -tje) kelimeler her zaman <b>het</b>; -heid, -ing, -tie ile bitenler <b>de</b>; isim gibi kullanılan mastar <b>het</b> (het eten).<br>Belirsiz tanımlık hep <b>een</b> (bir).",
    ex: [["De man werkt in de winkel.", "Adam dükkanda çalışıyor.", "dı man verkt in dı vinkıl"], ["Het huis is groot.", "Ev büyük.", "ıt höys is hroot"], ["Het meisje heet Elif.", "Kızın adı Elif. (küçültme → het)", "ıt meyşı heet elif"], ["De huizen zijn duur.", "Evler pahalı. (çoğul → de)", "dı höyzın zeyn düür"], ["De rekening is betaald.", "Fatura ödendi. (-ing → de)", "dı reekıning is bıtaalt"], ["Ik eet een appel.", "Bir elma yiyorum.", "ik eet een apıl"]] },
  { id: "g-zijn", lvl: "A1", t: "zijn (olmak) & hebben (sahip olmak)",
    body: "En çok kullanılan iki fiil düzensizdir, ezberlenir.<br><b>zijn:</b> ik ben · jij bent · u bent · hij/zij is · wij zijn · jullie zijn · zij zijn<br><b>hebben:</b> ik heb · jij hebt · u <b>hebt</b> (Belçika'da yaygın) ya da u heeft · hij/zij heeft · wij hebben · jullie hebben · zij hebben<br>Soruda jij'den önce -t düşer: ben jij? · heb jij?",
    ex: [["Ik ben moe vandaag.", "Bugün yorgunum.", "ik ben mu vandaah"], ["Hij is mijn broer.", "O benim kardeşim.", "hey is meyn brur"], ["Ik heb een vraag.", "Bir sorum var.", "ik hep een vraah"], ["Hebt u even tijd?", "Biraz vaktiniz var mı?", "hept ü eevın teyt"], ["Ben jij morgen thuis?", "Yarın evde misin?", "ben yey morhın töys"]] },
  { id: "g-hijzij", lvl: "A1", t: "hij, zij, het — Türkçedeki tek 'o'",
    body: "Türkçede 'o' tektir; Felemenkçede üç tane vardır.<br><b>hij</b> = o (erkek). Eşya de-kelimeyse çoğu kez yine <b>hij</b>: de jas → hij.<br><b>zij / ze</b> = o (kadın). Dikkat: <b>zij</b> aynı zamanda 'onlar' demektir; fiilden anlarsın: zij <b>is</b> (o) · zij <b>zijn</b> (onlar).<br><b>het</b> = het-kelimeler, hava ve saat: het huis → het · <i>Het regent.</i><br>Flaman konuşmasında bazı de-kelimeler için 'ze' de duyulur.",
    ex: [["Hij werkt in het magazijn.", "O (erkek) depoda çalışıyor.", "hey verkt in ıt mahazeyn"], ["Zij is mijn collega.", "O (kadın) benim iş arkadaşım.", "zey is meyn koleeha"], ["Zij zijn mijn collega's.", "Onlar benim iş arkadaşlarım.", "zey zeyn meyn koleehas"], ["Waar is mijn jas? Hij hangt daar.", "Montum nerede? Orada asılı.", "vaar is meyn yas? hey hangt daar"], ["Het huis is mooi en het is groot.", "Ev güzel ve büyük.", "ıt höys is mooy en ıt is hroot"], ["Het regent vandaag.", "Bugün yağmur yağıyor.", "ıt reehınt vandaah"]] },
  { id: "g-cekim", lvl: "A1", t: "Fiil çekimi (şimdiki zaman)",
    body: "Mastardan <b>-en</b> düşer, kök kalır: werken → <b>werk</b>.<br>ik <b>werk</b> · jij/u/hij <b>werkt</b> (kök + t) · wij/jullie/zij <b>werken</b> (mastar).<br>Kökü yazarken dört kural:<br>1. Uzun ünlü çift yazılır: maken → ik <b>maak</b>, wonen → ik <b>woon</b>.<br>2. Çift ünsüz teke iner: zeggen → ik <b>zeg</b>, bellen → ik <b>bel</b>.<br>3. Sonda v → f, z → s: leven → ik <b>leef</b>, reizen → ik <b>reis</b>.<br>4. Kök zaten -t ile bitiyorsa ikinci t gelmez: zitten → hij <b>zit</b>.<br>Felemenkçe şimdiki zaman hem 'çalışırım' hem 'çalışıyorum' demektir.",
    ex: [["Ik werk in een winkel.", "Bir dükkanda çalışıyorum.", "ik verk in een vinkıl"], ["Zij woont in Gent.", "O Gent'te oturuyor. (wonen → woon)", "zey voont in hent"], ["Ik maak koffie voor iedereen.", "Herkese kahve yapıyorum. (maken → maak)", "ik maak kofi voor idereen"], ["Ik zeg het nog eens.", "Bir daha söylüyorum. (zeggen → zeg)", "ik zeh ıt noh eens"], ["Ik reis met de trein.", "Trenle gidiyorum. (reizen → reis)", "ik reys met dı treyn"], ["Hij zit in de bus.", "O otobüste oturuyor. (zit + t yok)", "hey zit in dı büs"], ["Wij leren Nederlands.", "Felemenkçe öğreniyoruz.", "vey leerın needırlants"]] },
  { id: "g-v2", lvl: "A1", t: "Cümle düzeni: ana cümlede fiil 2. sırada",
    body: "Türkçede fiil sondadır; Felemenkçe <b>ana cümlede çekimli fiil 2. öğedir</b>. Cümleye zamanla ya da yerle başlarsan, özne fiilden <b>sonra</b> gelir.<br><b>en, maar, want, of</b> sıra saymaz: <i>Ik ben moe, maar ik werk.</i><br>İstisnalar: evet/hayır sorusunda fiil başa gelir; omdat/dat'lı yan cümlede fiil sona gider (ilgili derslere bak).",
    ex: [["Ik werk vandaag.", "Bugün çalışıyorum.", "ik verk vandaah"], ["Vandaag werk ik.", "Bugün çalışıyorum. (fiil yine 2. sırada)", "vandaah verk ik"], ["Morgen ga ik naar de dokter.", "Yarın doktora gidiyorum.", "morhın ha ik naar dı doktır"], ["In Gent woont mijn zus.", "Gent'te kız kardeşim oturuyor.", "in hent voont meyn züs"], ["Ik ben moe, maar ik werk.", "Yorgunum ama çalışıyorum. (maar sıra saymaz)", "ik ben mu, maar ik verk"]] },
  { id: "g-soru", lvl: "A1", t: "Soru sormak",
    body: "Evet/hayır sorusunda <b>fiil başa</b> geçer. Soru kelimesiyle: <b>soru kelimesi + fiil + özne</b>.<br>wat = ne · wie = kim · waar = nerede · wanneer = ne zaman · hoe = nasıl · waarom = neden · hoeveel = ne kadar / kaç<br>Dikkat: <b>jij / je</b> fiilden sonra gelince fiil -t'yi kaybeder: 'Jij werkt' → 'Werk jij?'. u ve hij ile -t kalır: 'Werkt u?'",
    ex: [["Werk je morgen?", "Yarın çalışıyor musun?", "verk yı morhın"], ["Werkt u ook op zondag?", "Pazar günü de çalışıyor musunuz?", "verkt ü ook op zondah"], ["Waar woon je?", "Nerede oturuyorsun?", "vaar voon yı"], ["Hoeveel kost dat?", "O ne kadar?", "huveel kost dat"], ["Waarom ben je te laat?", "Neden geç kaldın?", "vaarom ben yı tı laat"]] },
  { id: "g-niet", lvl: "A1", t: "Olumsuzluk: niet & geen",
    body: "<b>geen</b>: 'een' alan ya da tanımlıksız isimleri olumsuz yapar ('hiç … yok').<br><b>niet</b>: geri kalan her şey (fiil, sıfat, belirli isim, zamir).<br>niet'in cümledeki yeri için 'niet nereye gelir?' dersine bak.",
    ex: [["Ik heb geen auto.", "Arabam yok.", "ik hep heen auto"], ["Ik werk vandaag niet.", "Bugün çalışmıyorum.", "ik verk vandaah nit"], ["Dat is niet goed.", "Bu iyi değil.", "dat is nit hut"], ["Ik heb geen tijd.", "Vaktim yok.", "ik hep heen teyt"], ["Er is geen melk meer.", "Süt kalmadı.", "ır is heen melk meer"]] },
  { id: "g-u", lvl: "A1", t: "u, jij, ge — siz mi sen mi?",
    body: "<b>u</b> = siz: müşteri, şef, yaşlılar, resmî yerler. <b>jij / je</b> = sen: arkadaş, iş arkadaşı.<br>Flaman günlük konuşmasında <b>ge / gij</b> hem sen hem siz anlamında çok duyulur. Fiil: ge <b>zijt</b>, ge <b>hebt</b>, ge <b>kunt</b>; iyelik: <b>uw</b>. ge'yi anlaman yeter; kendin u ya da je kullan.<br>Emin değilsen <b>u</b> kullan — kimse kırılmaz.",
    ex: [["Kunt u mij helpen?", "Bana yardım edebilir misiniz?", "künt ü mey helpın"], ["Kan je mij even helpen?", "Bana biraz yardım edebilir misin?", "kan yı mey eevın helpın"], ["Kunt ge mij helpen?", "(Flaman) Yardım edebilir misin?", "künt hı mey helpın"], ["Zijt ge morgen thuis?", "(Flaman) Yarın evde misin?", "zeyt hı morhın töys"]] },
  { id: "g-iyelik", lvl: "A2", t: "İyelik: mijn, jouw, uw…",
    body: "mijn (benim) · jouw / je (senin) · uw (sizin) · zijn (onun, erkek ya da het-kelime) · haar (onun, kadın) · ons / onze (bizim) · jullie (sizin, çoğul) · hun (onların).<br><b>ons</b> tekil het-kelimelerle; <b>onze</b> de-kelimelerle ve tüm çoğullarla: ons huis, onze winkel, onze huizen.",
    ex: [["Dit is mijn jas.", "Bu benim montum.", "dit is meyn yas"], ["Is dat uw tas?", "Bu sizin çantanız mı?", "is dat üv tas"], ["Onze winkel is groot.", "Bizim dükkanımız büyük.", "onzı vinkıl is hroot"], ["Ons huis is klein.", "Bizim evimiz küçük. (het huis → ons)", "ons höys is kleyn"], ["Hun kinderen gaan naar school.", "Onların çocukları okula gidiyor.", "hün kindırın haan naar s-hool"]] },
  { id: "g-modal", lvl: "A2", t: "kunnen, moeten, willen, mogen",
    body: "Bu fiiller 2. sıraya gelir, asıl fiil <b>mastar halinde cümlenin sonuna</b> gider — Türkçeye benzer!<br>kunnen = -ebilmek · moeten = -meli/zorunda · willen = istemek · mogen = izinli olmak<br>ik kan · jij kan/kunt · u kunt/kan · ik moet · ik wil · ik mag (Belçika'da 'jij kan', 'u kan' çok duyulur).<br>Modal fiilden sonra <b>te</b> gelmez. Yön belliyse 'gaan' çoğu kez düşer: <i>Ik moet naar de dokter.</i>",
    ex: [["Ik kan morgen werken.", "Yarın çalışabilirim.", "ik kan morhın verkın"], ["Ik moet naar de dokter.", "Doktora gitmem lazım.", "ik mut naar dı doktır"], ["Mag ik hier parkeren?", "Buraya park edebilir miyim?", "mah ik hir parkeerın"], ["Ik wil Nederlands leren.", "Felemenkçe öğrenmek istiyorum.", "ik vil needırlants leerın"], ["Kan je mij morgen helpen?", "Yarın bana yardım edebilir misin?", "kan yı mey morhın helpın"]] },
  { id: "g-gelecek", lvl: "A2", t: "Gelecek zaman: gaan + mastar",
    body: "Günlük konuşmada gelecek için <b>gaan</b> (gitmek) + mastar kullanılır. Ya da sadece şimdiki zaman + zaman zarfı yeter.<br>Söz verirken ya da resmî dilde <b>zullen</b> + mastar: ik zal · jij zal/zult · wij zullen.",
    ex: [["Ik ga morgen werken.", "Yarın çalışacağım.", "ik ha morhın verkın"], ["We gaan volgende week verhuizen.", "Gelecek hafta taşınacağız.", "vı haan volhındı veek vırhöyzın"], ["Morgen bel ik je.", "Yarın seni ararım.", "morhın bel ik yı"], ["Ik zal het morgen doen.", "Yarın yaparım, söz.", "ik zal ıt morhın dun"]] },
  { id: "g-gecmis", lvl: "A2", t: "Geçmiş zaman (perfectum)",
    body: "Konuşmada geçmiş zaman çoğunlukla <b>hebben/zijn + ortaç</b> ile kurulur. Ortaç cümlenin <b>sonuna</b> gider.<br>Düzenli fiil: <b>ge + kök + t/d</b>. Kök 't kofschip' harflerinden biriyle (t, k, f, s, ch, p) bitiyorsa <b>-t</b>, yoksa <b>-d</b>: werken → gewerkt, maken → gemaakt, wonen → gewoond, bellen → gebeld.<br>Ön eki <b>be-, ge-, ver-, her-, ont-</b> olan fiiller ge- almaz: betalen → betaald, vertellen → verteld, begrijpen → begrepen.<br>Düzensizler ezberlenir: eten → gegeten, gaan → gegaan, komen → gekomen, zien → gezien.<br><b>zijn</b> ile: hedefli hareket ve durum değişimi (ik ben naar huis gegaan, hij is ziek geworden), ayrıca zijn ve blijven (ik ben thuis gebleven). Hedefsiz hareket <b>hebben</b> alır: ik heb veel gelopen.",
    ex: [["Ik heb gisteren gewerkt.", "Dün çalıştım.", "ik hep histırın hıverkt"], ["Ik heb al gegeten.", "Zaten yemek yedim.", "ik hep al hıheetın"], ["Ik ben naar Brussel gegaan.", "Brüksel'e gittim.", "ik ben naar brüsıl hıhaan"], ["Ik heb de rekening betaald.", "Faturayı ödedim. (be- → ge- yok)", "ik hep dı reekıning bıtaalt"], ["Hij heeft mij gisteren gebeld.", "Dün beni aradı. (-d)", "hey heeft mey histırın hıbelt"]] },
  { id: "g-voorz", lvl: "A2", t: "Edatlar = Türkçedeki ekler (-de, -e, -den, ile)",
    body: "Türkçe isme <b>ek</b> takar (dükkan<b>da</b>); Felemenkçe ismin <b>önüne</b> küçük bir kelime koyar (<b>in</b> de winkel).<br><b>-de/-da</b> → in, op, bij: in de winkel (dükkanda) · op het werk (işte) · bij de dokter (doktorda)<br><b>-e/-a</b> → naar: naar huis (eve) · naar de dokter (doktora)<br><b>-den/-dan</b> → uit, van: uit Turkije (Türkiye'den) · van de chef (şeften)<br><b>ile</b> → met: met de bus (otobüsle) · <b>için</b> → voor: voor u (sizin için)<br>Hangi edatın geleceği kelimeye göre değişir (<b>op</b> het werk ama <b>in</b> de winkel). Bazı fiiller de sabit edat ister: wachten <b>op</b> (beklemek), denken <b>aan</b> (düşünmek). Bunları birlikte ezberle.",
    ex: [["Ik ben nu op het werk.", "Şu an işteyim.", "ik ben nü op ıt verk"], ["Na het werk ga ik naar huis.", "İşten sonra eve gidiyorum.", "naa ıt verk ha ik naar höys"], ["Mijn collega komt uit Marokko.", "İş arkadaşım Fas'tan.", "meyn koleeha komt öyt marokoo"], ["Ik kom elke dag met de tram.", "Her gün tramvayla geliyorum.", "ik kom elkı dah met dı trem"], ["Dit is een cadeau voor u.", "Bu sizin için bir hediye.", "dit is een kadoo voor ü"], ["Ik wacht op de bus.", "Otobüsü bekliyorum. (wachten op)", "ik vaht op dı büs"]] },
  { id: "g-er", lvl: "A2", t: "er — küçük ama her yerde",
    body: "<b>er</b> vurgusuz küçük bir kelimedir; dört ana görevi var:<br>1. <b>er is / er zijn</b> = var: <i>Er is een probleem.</i><br>2. Yer ('orada', daar'ın vurgusuz hali): <i>Ik woon er graag.</i><br>3. Sayıyla 'ondan': <i>Ik heb er twee.</i> (ondan iki tane var)<br>4. Edatla birlikte 'onunla, onun hakkında': ermee, erover, ervan: <i>Ik ben het ermee eens.</i><br>Önce 1. ve 3. kullanımı öğren; gerisi kulakla gelir.",
    ex: [["Er is een probleem met de kassa.", "Kasada bir sorun var.", "ır is een probleem met dı kasa"], ["Er zijn geen zakken meer.", "Poşet kalmadı.", "ır zeyn heen zakın meer"], ["Hebt u kinderen? Ik heb er twee.", "Çocuğunuz var mı? İki tane var.", "hept ü kindırın? ik hep ır tvee"], ["Ik woon in Gent en ik werk er ook.", "Gent'te oturuyorum, orada çalışıyorum da.", "ik voon in hent en ik verk ır ook"], ["Wat vind je ervan?", "Bu konuda ne düşünüyorsun?", "vat vint yı ırvan"]] },
  { id: "g-nietpos", lvl: "A2", t: "niet nereye gelir?",
    body: "1. Bütün cümleyi olumsuz yapınca <b>niet</b> genelde sona yakın gelir: <i>Ik werk vandaag niet.</i><br>2. Belirli nesne ve zamirden <b>sonra</b>: <i>Ik zie hem niet.</i> · <i>Ik begrijp het niet.</i><br>3. Sıfattan, edatlı öbekten ve sondaki fiil parçasından (mastar, ortaç, ayrılan ek) <b>önce</b>: niet goed · niet in Gent · <i>Ik kan niet komen.</i> · <i>Ik heb het niet gezien.</i> · <i>Ik bel je niet op.</i><br>Yan cümlede niet fiillerden önce gelir: <i>… omdat ik niet kan komen.</i>",
    ex: [["Ik begrijp het niet.", "Anlamıyorum.", "ik bıhreyp ıt nit"], ["Ik kan morgen niet komen.", "Yarın gelemem.", "ik kan morhın nit koomın"], ["Ik heb het niet gezien.", "Onu görmedim.", "ik hep ıt nit hızin"], ["De kassa werkt niet.", "Kasa çalışmıyor.", "dı kasa verkt nit"], ["Ik woon niet in Gent.", "Gent'te oturmuyorum.", "ik voon nit in hent"], ["Dat is niet duur.", "Bu pahalı değil.", "dat is nit düür"]] },
  { id: "g-want", lvl: "A2", t: "want mı omdat mı? (ikisi de 'çünkü')",
    body: "İkisi de 'çünkü' demektir ama söz dizimi farklıdır:<br><b>want</b> + normal sıra (özne + fiil): <i>…, want ik <b>ben</b> ziek.</i><br><b>omdat</b> + fiil <b>sona</b>: <i>…, omdat ik ziek <b>ben</b>.</i><br>Konuşmada <b>want</b> daha sık ve daha kolaydır. 'Waarom?' sorusuna cevap ve cümle başı <b>omdat</b> ile olur: <i>Omdat ik ziek ben, blijf ik thuis.</i>",
    ex: [["Ik ben moe, want ik heb lang gewerkt.", "Yorgunum, çünkü uzun çalıştım.", "ik ben mu, vant ik hep lang hıverkt"], ["Ik ben moe omdat ik lang heb gewerkt.", "Uzun çalıştığım için yorgunum.", "ik ben mu omdat ik lang hep hıverkt"], ["Ik kom niet, want ik ben ziek.", "Gelmiyorum, çünkü hastayım.", "ik kom nit, vant ik ben zik"], ["Ik kom niet omdat ik ziek ben.", "Hasta olduğum için gelmiyorum.", "ik kom nit omdat ik zik ben"], ["Omdat ik ziek ben, blijf ik thuis.", "Hasta olduğum için evde kalıyorum.", "omdat ik zik ben, bleyf ik töys"]] },
  { id: "g-ayrilan", lvl: "B1", t: "Ayrılabilen fiiller",
    body: "Bazı fiillerin ön eki ana cümlede <b>ayrılıp sona gider</b>: opbellen (aramak), aanvullen (doldurmak), meebrengen (yanında getirmek), afspreken (buluşma ayarlamak).<br>Modal fiille ya da yan cümlede fiil <b>bitişik</b> kalır: <i>Ik moet de rekken aanvullen.</i> · <i>… omdat ik je opbel.</i><br>Ortaçta ge ortaya girer: opbellen → op<b>ge</b>beld, aanvullen → aan<b>ge</b>vuld.",
    ex: [["Ik bel je morgen op.", "Seni yarın ararım. (opbellen)", "ik bel yı morhın op"], ["Ik vul de rekken aan.", "Rafları dolduruyorum. (aanvullen)", "ik vül dı rekın aan"], ["Breng je je cv mee?", "Özgeçmişini getirir misin? (meebrengen)", "breng yı yı see-vee mee"], ["Ik moet de rekken aanvullen.", "Rafları doldurmam lazım. (modal → bitişik)", "ik mut dı rekın aanvülın"], ["Ik heb je gisteren opgebeld.", "Dün seni aradım. (op-ge-beld)", "ik hep yı histırın ophıbelt"]] },
  { id: "g-sifat", lvl: "B1", t: "Sıfatlar ve -e eki",
    body: "İsimden önce gelen sıfat genelde <b>-e</b> alır: de grote winkel, een grote winkel.<br>İstisna: <b>een + tekil het-kelime</b> → ek yok: een groot huis. Tanımlıksız tekil het-kelimede de ek yok: lekker brood.<br>Sıfat fiilden sonra gelirse ek almaz: De winkel is groot.<br>Konuşmada 'goede' çoğu kez <b>goeie</b> diye söylenir.",
    ex: [["Ik zoek een goede job.", "İyi bir iş arıyorum.", "ik zuk een hudı cop"], ["Dat is een goed idee.", "Bu iyi bir fikir. (het idee)", "dat is een hut idee"], ["De job is goed.", "İş iyi.", "dı cop is hut"], ["Ik eet graag lekker brood.", "Lezzetli ekmek yemeyi severim. (het brood, tanımlıksız → ek yok)", "ik eet hraah lekır broot"], ["Het grote huis is duur.", "Büyük ev pahalı.", "ıt hrootı höys is düür"]] },
  { id: "g-omdat", lvl: "B1", t: "omdat, dat, als — fiil sona gider",
    body: "Yan cümlede (omdat = çünkü, dat = -dığını, als = eğer/-ınca, wanneer = -dığı zaman) <b>çekimli fiil yan cümlenin sonuna</b> gider. İş görüşmesinde çok lazım!<br>Cümle yan cümleyle başlarsa, ana cümle <b>fiille</b> devam eder (yan cümle 1. öğe sayılır): <i>Als ik tijd heb, <b>bel</b> ik je.</i><br>'want' da 'çünkü' demektir ama sırayı değiştirmez — 'want mı omdat mı?' dersine bak.",
    ex: [["Ik wil hier werken omdat ik graag met mensen werk.", "Burada çalışmak istiyorum çünkü insanlarla çalışmayı seviyorum.", "ik vil hir verkın omdat ik hraah met mensın verk"], ["Ik denk dat het goed is.", "Bence iyi. (iyi olduğunu düşünüyorum)", "ik denk dat ıt hut is"], ["Als ik tijd heb, bel ik je.", "Vaktim olursa seni ararım.", "als ik teyt hep, bel ik yı"], ["Ik weet niet wanneer de bus komt.", "Otobüsün ne zaman geleceğini bilmiyorum.", "ik veet nit vaneer dı büs komt"]] },
  { id: "g-omte", lvl: "B1", t: "om … te + mastar (-mek için)",
    body: "Amaç anlatırken: <b>om</b> … <b>te</b> + mastar = '-mek için'. 'om' baştadır, 'te + mastar' sona gider: <i>Ik leer Nederlands om een betere job te vinden.</i><br>Bazı fiil ve kalıplardan sonra <b>te</b> + mastar gelir: proberen te (denemek), vergeten te (unutmak), beginnen te, het is moeilijk om … te.<br>Ayrılan fiillerde te ortaya girer: aanvullen → aan <b>te</b> vullen.<br>Modal fiillerden (kunnen, moeten, willen, mogen) sonra te <b>gelmez</b>: <i>Ik wil werken.</i>",
    ex: [["Ik leer Nederlands om een betere job te vinden.", "Daha iyi bir iş bulmak için Felemenkçe öğreniyorum.", "ik leer needırlants om een beetırı cop tı vindın"], ["Ik ga naar de winkel om brood te kopen.", "Ekmek almak için dükkana gidiyorum.", "ik ha naar dı vinkıl om broot tı koopın"], ["Het is moeilijk om dat te zeggen.", "Bunu söylemek zor.", "ıt is muylık om dat tı zehın"], ["Vergeet niet de rekken aan te vullen.", "Rafları doldurmayı unutma.", "vırheet nit dı rekın aan tı vülın"], ["Ik probeer elke dag te oefenen.", "Her gün pratik yapmaya çalışıyorum.", "ik probeer elkı dah tı ufının"]] },
  { id: "g-betrek", lvl: "B1", t: "die / dat — Türkçedeki -en / -dığı",
    body: "Türkçede niteleyen kısım ismin <b>önüne</b> gelir: <i>orada duran adam</i>, <i>aradığınız ürün</i>. Felemenkçede isimden <b>sonra</b> gelir ve <b>die</b> ya da <b>dat</b> ile başlar; çekimli fiil yan cümlenin <b>sonuna</b> gider.<br><b>die</b>: de-kelimeler ve tüm çoğullar · <b>dat</b>: tekil het-kelimeler.<br>Yer için <b>waar</b>: de winkel waar ik werk (çalıştığım dükkan).<br>Yan cümle bitince virgül konur, ana cümle fiille devam eder: <i>De man die daar staat, is mijn chef.</i>",
    ex: [["De man die daar staat, is mijn chef.", "Orada duran adam benim şefim.", "dı man di daar staat, is meyn şef"], ["Het product dat u zoekt, is uitverkocht.", "Aradığınız ürün tükendi.", "ıt prodükt dat ü zukt, is öytfırkoht"], ["De collega's die vandaag werken, zijn moe.", "Bugün çalışan iş arkadaşları yorgun.", "dı koleehas di vandaah verkın, zeyn mu"], ["De winkel waar ik werk, is groot.", "Çalıştığım dükkan büyük.", "dı vinkıl vaar ik verk, is hroot"], ["Ik zoek een job die goed betaalt.", "İyi para veren bir iş arıyorum.", "ik zuk een cop di hut bıtaalt"]] },
  { id: "g-imperf", lvl: "B1", t: "Hikâye geçmişi (imperfectum)",
    body: "Yazıda ve hikâye anlatırken tek kelimelik geçmiş zaman kullanılır. Flaman konuşmasında çoğu zaman perfectum (ik heb gewerkt) tercih edilir, ama <b>was, had, ging, kon, moest</b> gibi biçimleri her gün duyarsın.<br><b>Düzenli:</b> kök + <b>-te(n)</b> ('t kofschip harfleri: t, k, f, s, ch, p) ya da <b>-de(n)</b>: werken → ik werk<b>te</b>, wonen → ik woon<b>de</b>, wij werk<b>ten</b>.<br><b>En sık düzensizler:</b> zijn → was/waren · hebben → had/hadden · gaan → ging · komen → kwam · zien → zag · doen → deed · krijgen → kreeg · nemen → nam · geven → gaf · zeggen → zei · vinden → vond · eten → at · drinken → dronk · blijven → bleef · lopen → liep · weten → wist · kunnen → kon · moeten → moest · mogen → mocht · willen → wilde (konuşmada: wou).",
    ex: [["Gisteren werkte ik tot acht uur.", "Dün sekize kadar çalıştım.", "histırın verktı ik tot aht üür"], ["Ik was gisteren ziek.", "Dün hastaydım.", "ik vas histırın zik"], ["De bus kwam te laat.", "Otobüs geç geldi.", "dı büs kvam tı laat"], ["Vroeger woonde ik in Izmir.", "Eskiden İzmir'de oturuyordum.", "vruhır voondı ik in izmir"], ["Hij zei dat hij moe was.", "Yorgun olduğunu söyledi.", "hey zey dat hey mu vas"], ["Ik kon het niet vinden.", "Onu bulamadım.", "ik kon ıt nit vindın"]] }
];

/* ---------------- Yapay zekâ dersi için konu önerileri ---------------- */
window.TOPIC_IDEAS = [
  "Telefonda kendimi tanıtmak ve randevu almak",
  "Çocuğun okulu / öğretmeniyle konuşmak",
  "Depo ve forklift işi kelimeleri",
  "Restoran mutfağında çalışmak",
  "Temizlik işinde kullanılan cümleler",
  "Basit iş e-postası yazmak",
  "Kira sözleşmesi ve ev sahibiyle konuşmak",
  "Ehliyet, araba ve trafik",
  "Komşuyla günlük sohbet",
  "Huis van het Nederlands'ta seviye testine hazırlık"
];

/* ---------------- Kasada can simidi (internetsiz çalışır) ---------------- */
window.LIFELINES = [
  ["Een momentje, alstublieft.", "Bir saniye lütfen.", "een moomentyı, alstüblift"],
  ["Kunt u dat herhalen, alstublieft?", "Tekrarlar mısınız lütfen?", "künt ü dat herhaalın, alstüblift"],
  ["Kunt u wat trager spreken?", "Biraz daha yavaş konuşabilir misiniz?", "künt ü vat traahır spreekın"],
  ["Ik roep even een collega.", "Hemen bir iş arkadaşımı çağırıyorum.", "ik rup eevın een koleeha"],
  ["Sorry, ik leer nog Nederlands.", "Kusura bakmayın, Felemenkçeyi hâlâ öğreniyorum.", "sori, ik leer noh needırlants"],
  ["Kunt u het opschrijven?", "Yazabilir misiniz?", "künt ü ıt ops-hreyvın"],
  ["Ik wil graag een tolk.", "Bir tercüman istiyorum.", "ik vil hraah een tolk"],
  ["Dank u, nog een fijne dag!", "Teşekkürler, iyi günler!", "dank ü, noh een feynı dah"]
];

/* ---------------- İlk 12 ay kontrol listesi ---------------- */
window.CHECKLIST = {
  note: "Bu liste genel bir yol göstericidir, hukuki tavsiye değildir. Kurallar, süreler ve ücretler değişebilir ve kişisel durumuna göre farklı olabilir; her adımı belirtilen resmî kaynaktan ya da belediyenden (gemeente) kontrol et.",
  items: [
    { id: "gemeente", t: "Belediyeye kayıt + mahalle polisi (wijkagent)", d: "Taşındıktan sonra adresini genelde birkaç iş günü içinde belediyeye bildirirsin. Ardından mahalle polisi (wijkagent) evde gerçekten oturduğunu kontrol etmeye gelir; zilde ve posta kutusunda adın yazılı olsun.", src: "Kendi gemeente'nin sitesi (dienst Burgerzaken)" },
    { id: "eid", t: "Oturma kartı (verblijfskaart / eID) + PIN/PUK", d: "Kart belediyede hazırlanır. PIN ve PUK kodlarının geldiği mektubu sakla — itsme ve dijital işlemler için gerekir. Kartın bitiş tarihini takip et.", src: "gemeente; Dienst Vreemdelingenzaken: dofi.ibz.be" },
    { id: "itsme", t: "itsme + eBox", d: "itsme uygulaması dijital kimliğindir (banka, devlet siteleri). Resmî mektuplar eBox'a dijital olarak gelebilir; düzenli kontrol et.", src: "itsme.be, mijnburgerprofiel.be, myebox.be" },
    { id: "mutualiteit", t: "Sağlık sigortası: mutualiteit (ziekenfonds) ya da HZIV", d: "Bir mutualiteit'e ya da kamu kurumu Hulpkas (HZIV)'a kaydol; doktor ve ilaç masraflarının bir kısmı geri ödenir. Çalışıyorsan genelde gereklidir.", src: "riziv.fgov.be (RIZIV)" },
    { id: "huisarts", t: "Aile hekimi + GMD; 1733 ve 112", d: "Bir aile hekimi (huisarts) seç ve global tıbbi dosya (GMD) açtır — genelde daha az ödersin. Gece ve hafta sonu acil olmayan durumlar: 1733. Hayati acil: 112, polis: 101.", src: "1733.be; riziv.fgov.be" },
    { id: "bank", t: "Banka hesabı + ödeme güvenliği", d: "Maaş için Belçika'da banka hesabı aç. SMS ya da e-postayla gelen linklere asla kart bilgisi veya kod girme; şüphede bankanı kendi bildiğin numaradan ara.", src: "Kendi bankan; safeonweb.be" },
    { id: "huur", t: "Kira sözleşmesi, plaatsbeschrijving, depozito", d: "Yazılı sözleşme al; girişte ayrıntılı tespit tutanağı (plaatsbeschrijving) yapılsın. Flanders'ta depozito (huurwaarborg) genelde en fazla 3 aylık kiradır ve senin adına bloke hesapta durur — ev sahibine nakit verme.", src: "vlaanderen.be (huren); Huurdersbond" },
    { id: "inburgering", t: "Uyum programı (inburgering)", d: "AB dışından gelenler için çoğu durumda zorunludur (Türk vatandaşları için özel kurallar olabilir): Felemenkçe A2, toplumsal oryantasyon (MO) ve katılım/ağ adımları. Ücretler, muafiyetler ve cezalar kişiye göre değişir — kendi durumunu ve güncel ücretleri uyum ofisine sor.", src: "integratie-inburgering.be; Antwerpen: Atlas; Gent: In-Gent; gemeente" },
    { id: "huisnl", t: "Huis van het Nederlands", d: "Kendisi kurs vermez; seviye tespiti yapıp seni uygun kursa (CVO, Ligo, üniversite dil merkezi) yönlendirir. Uyum programındaysan kayıt genelde uyum ofisiyle birlikte ilerler.", src: "huisvanhetnederlands.be" },
    { id: "vdab", t: "VDAB + diploma denkliği (NARIC)", d: "Çalışırken de VDAB'ye kaydolabilirsin: ücretsiz meslek eğitimleri, iş ilanları, CV desteği. Türkiye'deki diploman için gerekiyorsa NARIC-Vlaanderen'e denklik başvurusu yap — birçok iyi işin kapısı; önce VDAB danışmanına sor.", src: "vdab.be; onderwijs.vlaanderen.be/naric" },
    { id: "kids", t: "(Çocuk varsa) Groeipakket + okul kaydı", d: "Flanders'ta çocuk parası Groeipakket adıyla bir ödeme kurumu üzerinden gelir; başvurunu kontrol et. Birçok şehirde okul kaydı önceden online başvuruyla (aanmelden) yapılır — tarihleri kaçırma.", src: "groeipakket.be; kendi şehrinin okul kayıt sitesi" },
    { id: "praktijk", t: "Pratik ağı: taalcafé, kütüphane, gönüllülük", d: "Kurs dışında konuşma pratiği için kütüphanelerin taalcafé ve sohbet masalarına (gesprekstafel) git. Gönüllü işler hem dili hem uyum programının 'ağ' adımını destekleyebilir.", src: "Kendi kütüphanen (bibliotheek); gemeente" }
  ]
};

/* ---------------- Haftalık görevler (gerçek hayatta) ---------------- */
window.MISSIONS = [
  { id: "m-groet", lvl: "A1", t: "Bu hafta her iş arkadaşına Felemenkçe günaydın de ve adını sor.", why: "Küçük ama her gün tekrar; iş arkadaşların seni Felemenkçe konuşan biri olarak görmeye başlar.", phrases: [["Goeiemorgen! Hoe gaat het?", "Günaydın! Nasılsın?", "huyımorhın! hu haat ıt"], ["Hoe heet jij?", "Senin adın ne?", "hu heet yey"]] },
  { id: "m-bakker", lvl: "A1", t: "Fırında Felemenkçe ekmek sipariş et.", why: "Kısa, tahmin edilebilir bir konuşma; ilk başarı hissi için ideal.", phrases: [["Een wit brood, gesneden, alstublieft.", "Bir beyaz ekmek, dilimlenmiş, lütfen.", "een vit broot, hısneedın, alstüblift"], ["Twee croissants, alstublieft.", "İki kruvasan lütfen.", "tvee kruvasans, alstüblift"], ["Dat is alles, merci.", "Bu kadar, teşekkürler.", "dat is alıs, mersi"]] },
  { id: "m-kasa", lvl: "A1", t: "Kasada 10 müşteriyle bütün konuşmayı baştan sona Felemenkçe yap.", why: "Her gün yaptığın işi dil pratiğine çevirirsin; kalıplar otomatikleşir.", phrases: [["Hebt u een Bonuskaart?", "Bonus kartınız var mı?", "hept ü een boonüskaart"], ["Wilt u uw kasticket?", "Fişinizi ister misiniz?", "vilt ü üv kastiket"]] },
  { id: "m-buren", lvl: "A1", t: "Bir komşuna kendini tanıt.", why: "Komşular paket, çöp günü ve acil durumda ilk yardım edenlerdir.", phrases: [["Goeiedag, ik ben Elif, uw nieuwe buurvrouw.", "İyi günler, ben Elif, yeni komşunuz.", "huyıdah, ik ben elif, üv niuvı bürvrau"], ["Ik woon op nummer twaalf.", "On iki numarada oturuyorum.", "ik voon op nümır tvaalf"]] },
  { id: "m-apotheek", lvl: "A2", t: "Eczaneye git ve bir ilaç hakkında Felemenkçe soru sor.", why: "Sağlık kelimeleri acil anda lazım; sakin bir anda denemek en iyisi.", phrases: [["Ik heb iets nodig tegen hoofdpijn.", "Baş ağrısına karşı bir şey lazım.", "ik hep its noodıh teehın hooftpeyn"], ["Hoe vaak mag ik dit nemen?", "Bunu ne sıklıkla alabilirim?", "hu vaak mah ik dit neemın"]] },
  { id: "m-delijn", lvl: "A2", t: "Durakta ya da istasyonda bir yolculuk hakkında soru sor.", why: "Ulaşım soruları kısa ve günlük; cevabı dinleyip anlamak iyi kulak egzersizi.", phrases: [["Welke bus gaat naar het centrum?", "Hangi otobüs merkeze gidiyor?", "velkı büs haat naar ıt sentrüm"], ["Waar moet ik uitstappen?", "Nerede inmeliyim?", "vaar mut ik öytstapın"]] },
  { id: "m-bib", lvl: "A2", t: "Kütüphaneye üye ol ve kolay Felemenkçe bir kitap al.", why: "Kütüphane ucuz, sıcak ve taalcafé gibi pratik imkânları var.", phrases: [["Ik wil graag lid worden van de bibliotheek.", "Kütüphaneye üye olmak istiyorum.", "ik vil hraah lit vordın van dı bibliyoteek"], ["Hebt u boeken in makkelijk Nederlands?", "Kolay Felemenkçe kitaplarınız var mı?", "hept ü bukın in makılık needırlants"]] },
  { id: "m-afval", lvl: "A2", t: "Çöp toplama takvimini bul ve bir komşuya PMD gününü sor.", why: "Yanlış çöp poşeti Belçika'da ceza ya da toplanmayan çöp demek.", phrases: [["Wanneer wordt de pmd-zak opgehaald?", "PMD poşeti ne zaman toplanıyor?", "vaneer vort dı pee-em-dee-zak ophıhaalt"], ["Waar koop ik de afvalzakken?", "Çöp poşetlerini nereden alırım?", "vaar koop ik dı afalzakın"]] },
  { id: "m-taalcafe", lvl: "A2", t: "Bir taalcafé ya da kütüphane sohbet masasına katıl.", why: "Sınavsız, baskısız konuşma pratiği; yeni tanıdıklar da kazanırsın.", phrases: [["Mag ik meedoen aan de gesprekstafel?", "Sohbet masasına katılabilir miyim?", "mah ik meedun aan dı hıspreekstaafıl"], ["Ik wil mijn Nederlands oefenen.", "Felemenkçemi pratik etmek istiyorum.", "ik vil meyn needırlants ufının"]] },
  { id: "m-dokter", lvl: "B1", t: "Aile hekimini telefonla arayıp randevu al.", why: "Telefonda yüz ifadesi yok; gerçek bir B1 sınavı gibi.", phrases: [["Goeiedag, ik wil graag een afspraak maken.", "İyi günler, randevu almak istiyorum.", "huyıdah, ik vil hraah een afspraak maakın"], ["Kan het vandaag nog?", "Bugün mümkün mü?", "kan ıt vandaah noh"], ["Ik heb al twee dagen koorts.", "İki gündür ateşim var.", "ik hep al tvee daahın koorts"]] },
  { id: "m-opleiding", lvl: "B1", t: "Takım liderine eğitim ve gelişme imkânlarını sor.", why: "Terfi ve daha iyi vardiyalar genelde soran kişiye gelir.", phrases: [["Zijn er opleidingen voor medewerkers?", "Çalışanlar için eğitimler var mı?", "zeyn ır opleydingın voor meedıverkırs"], ["Ik wil graag meer verantwoordelijkheid.", "Daha fazla sorumluluk istiyorum.", "ik vil hraah meer vırantvoordılıkheyt"], ["Kan ik eens met u praten over mijn toekomst hier?", "Buradaki geleceğim hakkında sizinle konuşabilir miyim?", "kan ik eens met ü praatın oovır meyn tukomst hir"]] },
  { id: "m-vdab", lvl: "B1", t: "VDAB danışmanından randevu al ve sana uygun eğitimleri sor.", why: "Ücretsiz meslek eğitimleri daha iyi bir işe en kısa yoldur.", phrases: [["Ik wil een afspraak met een VDAB-consulent.", "VDAB danışmanıyla randevu istiyorum.", "ik vil een afspraak met een vee-dee-aa-bee-konsülent"], ["Welke opleidingen zijn er voor mij?", "Benim için hangi eğitimler var?", "velkı opleydingın zeyn ır voor mey"]] }
];

/* ---------------- Yapabilirim hedefleri (pratik hedefi, sertifika değil) ---------------- */
window.CANDO = {
  A1: [
    "Kendimi tanıtabilirim (ad, ülke, iş, şehir).",
    "Sayıları, fiyatları ve saati anlayıp söyleyebilirim.",
    "Kasada müşteriyle temel konuşmayı Felemenkçe yapabilirim.",
    "Anlamadığımda tekrar etmesini ya da yavaş konuşmasını isteyebilirim.",
    "Basit ihtiyaçlarımı (su, tuvalet, yardım) söyleyebilirim.",
    "Bir randevunun gününü ve saatini anlayabilirim."
  ],
  A2: [
    "Doktordan randevu alıp şikâyetimi anlatabilirim.",
    "Ev sahibine bir arızayı anlatabilirim.",
    "Trende ya da otobüste bilet ve aktarma sorabilirim.",
    "Müşteriye bir ürünün yerini tarif edebilirim.",
    "Belediyede hangi belgeleri getirmem gerektiğini sorabilirim.",
    "İş arkadaşımla hava, hafta sonu ve aile hakkında kısa sohbet edebilirim."
  ],
  B1: [
    "İş görüşmesinde deneyimimi ve motivasyonumu anlatabilirim.",
    "want ve omdat ile bir nedeni açıklayabilirim.",
    "Telefonda hastalığımı bildirip ayrıntı verebilirim.",
    "Basit bir iş e-postası yazabilirim.",
    "Maaş bordromla ilgili bir sorunu sorup anlatabilirim.",
    "Şikâyetçi bir müşteriyi sakin bir şekilde çözüme yönlendirebilirim."
  ]
};

/* ---------------- Belçika'da Felemenkçe yol haritası ---------------- */
window.ROADMAP = "<p><b>1. Huis van het Nederlands:</b> Kendisi kurs vermez. Ücretsiz danışma ve seviye tespiti yapar, seni uygun kursa yönlendirir: <b>CVO</b> (yetişkin eğitim merkezi), <b>Ligo</b> (temel eğitim merkezi, eski adı CBE) ya da üniversite dil merkezi. Gündüz, akşam ve hafta sonu seçenekleri olur.</p>"
  + "<p><b>2. Uyum programı (inburgering):</b> AB dışından gelenler için çoğu durumda <b>zorunludur</b> (Türk vatandaşları için özel kurallar olabilir): Felemenkçe <b>A2</b>, toplumsal oryantasyon (MO) kursu ve sınavı, katılım (iş, gönüllülük ya da staj) ve ağ adımı. Ücretler ve muafiyetler kişiye göre değişir. Durumunu uyum ofisine sor (Antwerpen: Atlas, Gent: In-Gent, diğer yerler: integratie-inburgering.be).</p>"
  + "<p><b>3. Seviyeler:</b> Belçika'da yetişkin kursları NT2 (ikinci dil olarak Felemenkçe) adıyla, Avrupa ölçeği A1 → A2 → B1 → B2 ile anılır. Kasa, raf ve depo işleri genelde A1–A2 ile yapılabilir; müşteri hizmetleri, ofis, sağlık, eğitim ve ekip liderliği çoğunlukla <b>B1–B2</b> ister. Bazı meslekler belirli bir dil belgesi şart koşar.</p>"
  + "<p><b>4. VDAB:</b> Flaman iş bulma ve meslek eğitimi kurumu. Çalışırken de kaydolabilirsin: ücretsiz meslek eğitimleri, iş ilanları, CV desteği. Türkiye'deki diploman için <b>NARIC-Vlaanderen</b> denkliğini danışmana sor.</p>"
  + "<p><b>5. Her gün 20 dakika:</b> burada kart tekrarı + bir konuşma pratiği. Seri (🔥) bozulmasın.</p>"
  + "<p><b>6. Kulak alışkanlığı:</b> <b>VRT MAX</b>'te (ücretsiz, kayıt ister) Felemenkçe altyazıyla dizi izle. <i>Wablieft</i> kolay Felemenkçeyle yazılmış bir gazetedir. Kütüphanelerde (bibliotheek) taalcafé ve sohbet masaları olur.</p>"
  + "<p><i>Kurum adları, ücretler ve kurallar değişebilir; güncel bilgiyi resmî sitelerden ve kendi belediyenden (gemeente) teyit et.</i></p>";

/* ---------------- Okunuş anahtarı ---------------- */
window.OKUNUS_KEY = [
  ["g, ch", "boğazdan yumuşak h (Flaman ağzında Türkçe 'h'ye yakın)", "goed → hut"],
  ["v", "v — asla f! Flaman ağzı v'yi ötümlü tutar", "verkoop → vırkoop"],
  ["w", "v (dudaklar hafif); okunuşta hiç w yazılmaz", "wat → vat"],
  ["ui", "öy", "huis → höys"],
  ["ij, ei", "ey", "mijn → meyn"],
  ["oe", "u", "boek → buk"],
  ["eu", "ö", "leuk → lök"],
  ["u, uu", "ü", "duur → düür"],
  ["ie", "i", "niet → nit"],
  ["ou, au", "au", "koud → kaut"],
  ["sch", "s-h (ş değil!)", "schoon → s-hoon"],
  ["-isch (sonda)", "is", "allergisch → alerhis"],
  ["sj", "ş", "meisje → meyşı"],
  ["j", "y", "ja → ya"],
  ["-tje", "tyı", "beetje → beetyı"],
  ["-ig", "ıh", "twintig → tvintıh"],
  ["-lijk", "lık", "vriendelijk → vrindılık"],
  ["e, -en (vurgusuz)", "ı, ın", "morgen → morhın"],
  ["aa, ee, oo", "uzun okunur (çift yazılır)", "straat → straat"],
  ["sonda b, d", "p, t", "ik heb → hep · goed → hut"]
];
