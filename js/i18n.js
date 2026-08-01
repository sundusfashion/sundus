(function () {
  const SUPPORTED = ["fr", "en", "ar"];

  const STRINGS = {
    fr: {
      nav_shop: "Collection",
      nav_about: "À propos",
      nav_contact: "Contact",
      nav_admin: "Espace créatrice",
      hero_badge: "Nouvelle collection 2026",
      hero_title1: "La soie fine du",
      hero_title2: "paradis, cousue pour vous",
      hero_sub: "Sundus, la soie fine du paradis, crée des pièces féminines et délicates en couleurs pastel. Une élégance douce pour chaque femme qui veut briller.",
      hero_cta: "Découvrir la collection",
      hero_cta2: "Nous écrire",
      stats_pieces: "pièces uniques",
      stats_love: "clientes satisfaites",
      stats_craft: "fait main avec amour",
      collection_title: "La Collection",
      collection_sub: "Chaque pièce Sundus est imaginée, dessinée et réalisée avec soin.",
      filter_all: "Tout",
      filter_hijabs: "Hijabs",
      filter_abayas: "Abayas",
      filter_robes: "Robes",
      filter_hauts: "Hauts",
      filter_jupes: "Jupes",
      filter_accessoires: "Accessoires",
      about_title: "L'histoire de Sundus",
      about_p1: "Sundus signifie « soie fine du paradis » en arabe. C'est l'histoire d'une jeune créatrice qui transforme la douceur de la soie en pièces féminines, élégantes et lumineuses.",
      about_p2: "Chaque création est pensée pour révéler la beauté de celle qui la porte : des matières nobles, des couleurs pastel et une féminité qui s'exprime librement.",
      about_cta: "Contacter la créatrice",
      cta_title: "Prête à briller ?",
      cta_sub: "Écrivez-nous pour commander une pièce ou une création sur mesure.",
      cta_btn: "Envoyer un email",
      contact_title: "Contact",
      contact_sub: "Suivez Qamra et écrivez-nous, nous répondons avec le cœur.",
      footer_rights: "Tous droits réservés.",
      footer_made: "Créé avec amour",
      lightbox_close: "Fermer",
      lightbox_order: "Commander cette pièce",
      admin_login_title: "Espace créatrice",
      admin_login_sub: "Entrez votre nom d'utilisateur et votre mot de passe",
      admin_enter: "Entrer",
      admin_logout: "Déconnexion",
      admin_upload: "Glissez vos photos et vidéos ici",
      admin_upload_sub: "ou cliquez pour choisir — optimisation automatique",
      admin_generate: "Générer titres & descriptions",
      admin_publish: "Publier sur la landing",
      admin_lang: "Langue de génération",
      admin_saved: "Collection publiée avec succès",
      admin_generating: "Génération en cours…",
      admin_title: "Titre",
      admin_desc: "Description",
      admin_price: "Prix (€)",
      admin_category: "Catégorie",
      admin_new: "Nouveau",
      admin_exclu: "Exclusif",
      admin_sale: "Promo",
      admin_tag: "Tags (séparés par des virgules)",
      admin_preview: "Aperçu",
      admin_no_media: "Aucune photo pour l'instant. Glissez vos designs !",
      ai_offline: "Mode intelligent hors-ligne (sans clé API)",
      lang_name: "Français",
      copy_link: "Copier le lien",
      copied: "Lien copié !",
      share: "Partager",
      load_more: "Voir plus de pièces",
      soon: "Bientôt disponible",
      price_placeholder: "Prix — ex: 89",
      admin_token_title: "Clé de publication (une seule fois)",
      admin_token_save: "Enregistrer",
      admin_token_hint: "Stockée uniquement dans ce navigateur. Jamais publiée.",
      admin_token_ok: "Clé enregistrée ☁️",
      admin_token_bad: "Clé invalide",
      admin_token_ready: "✓ Déjà intégrée — fonctionne sans rien coller",
      admin_shop_title: "Boutique en ligne (publication web)",
      admin_shop_note: "Ici les photos se publient sur la web avec le bouton Publier ☁️",
      admin_social_badge: "Réseaux sociaux — reels & tiktoks",
      admin_social_title: "Contenus pour les réseaux",
      admin_social_upload: "Glissez une photo ou une vidéo",
      admin_social_upload_sub: "pour générer titre + caption + hashtags — rien n'est publié",
      admin_social_generate: "Générer captions & hashtags",
      admin_social_note: "Copiez et collez dans TikTok / Instagram. Ne modifie jamais la web.",
      admin_social_empty: "Aucun contenu pour l'instant. Glissez votre photo ou vidéo !",
      admin_social_lang: "Langue",
      admin_social_copy: "Copier",
      admin_social_delete: "Supprimer"
    },
    en: {
      nav_shop: "Collection",
      nav_about: "About",
      nav_contact: "Contact",
      nav_admin: "Creator space",
      hero_badge: "New 2026 collection",
      hero_title1: "The fine silk of",
      hero_title2: "paradise, tailored for you",
      hero_sub: "Sundus, the fine silk of paradise, creates feminine and delicate pieces in pastel colours. A soft elegance for every woman who wants to shine.",
      hero_cta: "Discover the collection",
      hero_cta2: "Write to us",
      stats_pieces: "unique pieces",
      stats_love: "happy clients",
      stats_craft: "handmade with love",
      collection_title: "The Collection",
      collection_sub: "Every Sundus piece is imagined, sketched and crafted with care.",
      filter_all: "All",
      filter_hijabs: "Hijabs",
      filter_abayas: "Abayas",
      filter_robes: "Dresses",
      filter_hauts: "Tops",
      filter_jupes: "Skirts",
      filter_accessoires: "Accessories",
      about_title: "The Sundus story",
      about_p1: "Sundus means \"fine silk of paradise\" in Arabic. It is the story of a young designer who turns the softness of silk into feminine, elegant, luminous pieces.",
      about_p2: "Every creation is designed to reveal the beauty of the woman who wears it: noble materials, pastel colours and femininity that expresses itself freely.",
      about_cta: "Contact the designer",
      cta_title: "Ready to shine?",
      cta_sub: "Write to us to order a piece or a custom creation.",
      cta_btn: "Send an email",
      contact_title: "Contact",
      contact_sub: "Follow Qamra and write to us, we answer with heart.",
      footer_rights: "All rights reserved.",
      footer_made: "Made with love",
      lightbox_close: "Close",
      lightbox_order: "Order this piece",
      admin_login_title: "Creator space",
      admin_login_sub: "Enter your username and password",
      admin_enter: "Enter",
      admin_logout: "Log out",
      admin_upload: "Drop your photos and videos here",
      admin_upload_sub: "or click to choose — automatic optimisation",
      admin_generate: "Generate titles & descriptions",
      admin_publish: "Publish to the landing page",
      admin_lang: "Generation language",
      admin_saved: "Collection published successfully",
      admin_generating: "Generating…",
      admin_title: "Title",
      admin_desc: "Description",
      admin_price: "Price (€)",
      admin_category: "Category",
      admin_new: "New",
      admin_exclu: "Exclusive",
      admin_sale: "Sale",
      admin_tag: "Tags (comma separated)",
      admin_preview: "Preview",
      admin_no_media: "No photos yet. Drop your designs!",
      ai_offline: "Smart offline mode (no API key)",
      lang_name: "English",
      copy_link: "Copy link",
      copied: "Link copied!",
      share: "Share",
      load_more: "See more pieces",
      soon: "Coming soon",
      price_placeholder: "Price — e.g. 89",
      admin_token_title: "Publishing key (once)",
      admin_token_save: "Save",
      admin_token_hint: "Stored only in this browser. Never published.",
      admin_token_ok: "Key saved ☁️",
      admin_token_bad: "Invalid key",
      admin_token_ready: "✓ Already integrated — works without pasting",
      admin_shop_title: "Online shop (web publishing)",
      admin_shop_note: "Photos here get published to the web with the Publish button ☁️",
      admin_social_badge: "Social media — reels & tiktoks",
      admin_social_title: "Social media content",
      admin_social_upload: "Drop a photo or a video",
      admin_social_upload_sub: "to generate title + caption + hashtags — nothing gets published",
      admin_social_generate: "Generate captions & hashtags",
      admin_social_note: "Copy and paste into TikTok / Instagram. Never changes the web.",
      admin_social_empty: "No content yet. Drop your photo or video!",
      admin_social_lang: "Language",
      admin_social_copy: "Copy",
      admin_social_delete: "Delete"
    },
    ar: {
      nav_shop: "التشكيلة",
      nav_about: "قصتنا",
      nav_contact: "اتصال",
      nav_admin: "مساحة المصممة",
      hero_badge: "تشكيلة 2026 الجديدة",
      hero_title1: "حرير",
      hero_title2: "الجنة، مخيط لأجلكِ",
      hero_sub: "سُنْدُس، حرير الجنة الناعم، تصنع قطعاً أنثوية رقيقة بألوان الباستيل. أناقة ناعمة لكل امرأة تريد أن تتألق.",
      hero_cta: "اكتشفي التشكيلة",
      hero_cta2: "راسلينا",
      stats_pieces: "قطعة فريدة",
      stats_love: "عميلة سعيدة",
      stats_craft: "صنع يدوي بحب",
      collection_title: "التشكيلة",
      collection_sub: "كل قطعة سُنْدُس تُصمَّم وتُخاط بحب وعناية.",
      filter_all: "الكل",
      filter_hijabs: "حجابات",
      filter_abayas: "عبايات",
      filter_robes: "فساتين",
      filter_hauts: "قِطع علوية",
      filter_jupes: "تنانير",
      filter_accessoires: "إكسسوارات",
      about_title: "حكاية سُنْدُس",
      about_p1: "سُنْدُس تعني «حرير الجنة الناعم» بالعربية. إنها حكاية مصممة شابة تحوّل نعومة الحرير إلى قطع أنثوية، أنيقة ومضيئة.",
      about_p2: "كل إبداع صُمم ليكشف جمال من ترتديه: أقمشة نبيلة، ألوان باستيل، وأنوثة تعبّر عن نفسها بحرية.",
      about_cta: "راسلي المصممة",
      cta_title: "جاهزة للتألق؟",
      cta_sub: "راسلينا لطلب قطعة أو تصميم حسب الطلب.",
      cta_btn: "إرسال بريد",
      contact_title: "اتصال",
      contact_sub: "تابعي سُنْدُس وراسلينا، نرد بكل الحب.",
      footer_rights: "جميع الحقوق محفوظة.",
      footer_made: "صنع بحب",
      lightbox_close: "إغلاق",
      lightbox_order: "اطلبي هذه القطعة",
      admin_login_title: "مساحة المصممة",
      admin_login_sub: "أدخلي اسم المستخدم وكلمة المرور",
      admin_enter: "دخول",
      admin_logout: "تسجيل الخروج",
      admin_upload: "اسحبي صورك وفيديوهاتك هنا",
      admin_upload_sub: "أو اضغطي للاختيار — تحسين تلقائي",
      admin_generate: "توليد العناوين والأوصاف",
      admin_publish: "نشر على الصفحة الرئيسية",
      admin_lang: "لغة التوليد",
      admin_saved: "تم نشر التشكيلة بنجاح",
      admin_generating: "جارٍ التوليد…",
      admin_title: "العنوان",
      admin_desc: "الوصف",
      admin_price: "السعر (€)",
      admin_category: "الفئة",
      admin_new: "جديد",
      admin_exclu: "حصري",
      admin_sale: "تخفيض",
      admin_tag: "وسوم (مفصولة بفواصل)",
      admin_preview: "معاينة",
      admin_no_media: "لا صور بعد. اسحبي تصاميمك!",
      ai_offline: "الوضع الذكي دون اتصال (بدون مفتاح API)",
      lang_name: "العربية",
      copy_link: "نسخ الرابط",
      copied: "تم نسخ الرابط!",
      share: "مشاركة",
      load_more: "شاهدي المزيد",
      soon: "قريباً",
      price_placeholder: "السعر — مثل: 89",
      admin_token_title: "مفتاح النشر (مرة واحدة فقط)",
      admin_token_save: "حفظ",
      admin_token_hint: "يُحفظ في هذا المتصفح فقط. لا يُنشر أبداً.",
      admin_token_ok: "تم حفظ المفتاح ☁️",
      admin_token_bad: "مفتاح غير صالح",
      admin_token_ready: "✓ مدمج مسبقاً — يعمل دون لصق",
      admin_shop_title: "المتجر الإلكتروني (نشر على الويب)",
      admin_shop_note: "هنا تُنشر الصور على الموقع بضغطة زر النشر ☁️",
      admin_social_badge: "شبكات التواصل — ريلز وتيك توك",
      admin_social_title: "محتوى لشبكات التواصل",
      admin_social_upload: "اسحبي صورة أو فيديو",
      admin_social_upload_sub: "لتوليد عنوان + نص + هاشتاغات — لا يُنشر شيء",
      admin_social_generate: "توليد النصوص والهاشتاغات",
      admin_social_note: "انسخي والصقي في تيك توك / انستغرام. لا يغيّر الموقع أبداً.",
      admin_social_empty: "لا محتوى بعد. اسحبي صورتك أو فيديوك!",
      admin_social_lang: "اللغة",
      admin_social_copy: "نسخ",
      admin_social_delete: "حذف"
    }
  };

  const rtl = { ar: true };

  const BRAND_NAME = { fr: "SUNDUS", en: "SUNDUS", ar: "سُنْدُس" };

  function brandName(lang) {
    return BRAND_NAME[lang] || "SUNDUS";
  }

  function detect() {
    const saved = localStorage.getItem("sundus_locale");
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase().split("-")[0];
    return SUPPORTED.includes(nav) ? nav : "en";
  }

  let current = detect();

  function detectTheme() {
    const saved = localStorage.getItem("sundus_theme");
    if (saved === "dark" || saved === "light") return saved;
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  let theme = detectTheme();

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      const isDark = theme === "dark";
      btn.textContent = isDark ? "☀️" : "🌙";
      btn.title = isDark ? "Light" : "Dark";
    });
    document.dispatchEvent(new CustomEvent("sundus:theme", { detail: theme }));
  }

  function setTheme(mode) {
    theme = mode;
    try { localStorage.setItem("sundus_theme", mode); } catch (e) {}
    applyTheme();
  }

  function apply() {
    document.documentElement.lang = current;
    document.documentElement.dir = rtl[current] ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.dataset.i18n;
      if (STRINGS[current][key]) el.textContent = STRINGS[current][key];
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.dataset.i18nPh;
      if (STRINGS[current][key]) el.placeholder = STRINGS[current][key];
    });
    document.querySelectorAll("[data-brand]").forEach((el) => {
      el.textContent = brandName(current);
    });
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langBtn === current);
    });
    document.dispatchEvent(new CustomEvent("sundus:lang", { detail: current }));
  }

  function set(lang) {
    if (!SUPPORTED.includes(lang)) return;
    current = lang;
    try { localStorage.setItem("sundus_locale", lang); } catch (e) {}
    apply();
  }

  function t(key) {
    return STRINGS[current][key] || key;
  }

  window.SundusI18n = { t, set, get: () => current, apply, detect, locales: SUPPORTED, theme, setTheme, getTheme: () => theme, brandName };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => set(btn.dataset.langBtn));
    });
    document.querySelectorAll("[data-theme-btn]").forEach((btn) => {
      btn.addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
    });
    applyTheme();
    apply();
  });
})();
