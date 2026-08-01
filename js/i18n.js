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
      hero_sub: "Sundus, la soie fine du paradis, tisse des pièces délicates et féminines pour la femme moderne. Douceur, élégance et modestie.",
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
      filter_accessoires: "Accessoires",
      about_title: "L'histoire de Sundus",
      about_p1: "Sundus signifie « soie fine du paradis » en arabe. C'est l'histoire d'une jeune créatrice qui tisse douceur, élégance et modernité pour la femme d'aujourd'hui.",
      about_p2: "Chaque création est pensée pour sublimer celle qui la porte, avec des matières nobles, des couleurs pastel et le respect de la modestie.",
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
      admin_login_sub: "Entrez le mot de passe pour gérer la collection",
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
      price_placeholder: "Prix — ex: 89"
    },
    en: {
      nav_shop: "Collection",
      nav_about: "About",
      nav_contact: "Contact",
      nav_admin: "Creator space",
      hero_badge: "New 2026 collection",
      hero_title1: "The fine silk of",
      hero_title2: "paradise, tailored for you",
      hero_sub: "Sundus, the fine silk of paradise, weaves delicate and feminine pieces for the modern woman. Softness, elegance and modesty.",
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
      filter_accessoires: "Accessories",
      about_title: "The Sundus story",
      about_p1: "Sundus means \"fine silk of paradise\" in Arabic. It is the story of a young designer who weaves softness, elegance and modernity for today's woman.",
      about_p2: "Every creation is designed to enhance the woman who wears it, with noble materials, pastel colours and respect for modesty.",
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
      admin_login_sub: "Enter the password to manage the collection",
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
      price_placeholder: "Price — e.g. 89"
    },
    ar: {
      nav_shop: "التشكيلة",
      nav_about: "قصتنا",
      nav_contact: "اتصال",
      nav_admin: "مساحة المصممة",
      hero_badge: "تشكيلة 2026 الجديدة",
      hero_title1: "حرير",
      hero_title2: "الجنة، مخيط لأجلكِ",
      hero_sub: "سندس، حرير الجنة الناعم، تنسج قطعاً رقيقة وأنثوية للمرأة العصرية. نعومة وأناقة واحتشام.",
      hero_cta: "اكتشفي التشكيلة",
      hero_cta2: "راسلينا",
      stats_pieces: "قطعة فريدة",
      stats_love: "عميلة سعيدة",
      stats_craft: "صنع يدوي بحب",
      collection_title: "التشكيلة",
      collection_sub: "كل قطعة سندس تُصمَّم وتُخاط بحب وعناية.",
      filter_all: "الكل",
      filter_hijabs: "حجابات",
      filter_abayas: "عبايات",
      filter_robes: "فساتين",
      filter_accessoires: "إكسسوارات",
      about_title: "حكاية سندس",
      about_p1: "سندس تعني «حرير الجنة الناعم» بالعربية. إنها حكاية مصممة شابة تنسج النعومة والأناقة والعصرية للمرأة اليوم.",
      about_p2: "كل إبداع صُمم ليُبرز جمال من ترتديه، بأقمشة نبيلة وألوان باستيل واحترام للاحتشام.",
      about_cta: "راسلي المصممة",
      cta_title: "جاهزة للتألق؟",
      cta_sub: "راسلينا لطلب قطعة أو تصميم حسب الطلب.",
      cta_btn: "إرسال بريد",
      contact_title: "اتصال",
      contact_sub: "تابعي قمـرة وراسلينا، نرد بكل الحب.",
      footer_rights: "جميع الحقوق محفوظة.",
      footer_made: "صنع بحب",
      lightbox_close: "إغلاق",
      lightbox_order: "اطلبي هذه القطعة",
      admin_login_title: "مساحة المصممة",
      admin_login_sub: "أدخلي كلمة المرور لإدارة التشكيلة",
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
      price_placeholder: "السعر — مثل: 89"
    }
  };

  const rtl = { ar: true };

  function detect() {
    const saved = localStorage.getItem("qamra_locale");
    if (saved && SUPPORTED.includes(saved)) return saved;
    const nav = (navigator.language || "en").toLowerCase().split("-")[0];
    return SUPPORTED.includes(nav) ? nav : "en";
  }

  let current = detect();

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
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langBtn === current);
    });
    document.dispatchEvent(new CustomEvent("qamra:lang", { detail: current }));
  }

  function set(lang) {
    if (!SUPPORTED.includes(lang)) return;
    current = lang;
    try { localStorage.setItem("qamra_locale", lang); } catch (e) {}
    apply();
  }

  function t(key) {
    return STRINGS[current][key] || key;
  }

  window.SundusI18n = { t, set, get: () => current, apply, detect, locales: SUPPORTED };

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      btn.addEventListener("click", () => set(btn.dataset.langBtn));
    });
    apply();
  });
})();
