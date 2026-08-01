(function () {
  const C = window.SUNDUS_CONFIG;
  const API = "/api";
  const items = new Map();
  const t = (k) => window.SundusI18n.t(k);
  const lang = () => window.SundusI18n.get();
  let isLogged = sessionStorage.getItem("sundus_admin") === "1";

  const $ = (id) => document.getElementById(id);

  /* ================= AUTH ================= */
  function showApp() {
    $("login-box").hidden = true;
    $("admin-wrap").hidden = false;
    $("btn-logout").hidden = false;
  }

  async function tryLogin() {
    const user = $("username").value.trim();
    const pw = $("password").value;
    if (user === C.adminUser && pw === C.adminPassword) {
      sessionStorage.setItem("sundus_admin", "1");
      isLogged = true;
      showApp();
      loadDraft();
      toast(t("admin_login_title"));
    } else {
      toast("❌");
      $("password").value = "";
    }
  }

  /* ================= OPTIMIZATION ================= */
  function optimizeImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const MAX = 1600;
          let { width, height } = img;
          if (width > MAX || height > MAX) {
            const r = Math.min(MAX / width, MAX / height);
            width = Math.round(width * r);
            height = Math.round(height * r);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width; canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);
          const webp = canvas.toDataURL("image/webp", 0.82);
          resolve({ type: "image", data: webp, colors: extractColors(ctx, width, height) });
        };
        img.onerror = () => resolve({ type: "image", data: reader.result, colors: [] });
        img.src = reader.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function optimizeVideo(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ type: "video", data: reader.result, colors: [] });
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  function extractColors(ctx, w, h) {
    const colors = new Map();
    const step = 12;
    const imgData = ctx.getImageData(0, 0, w, h).data;
    for (let i = 0; i < imgData.length; i += 4 * step) {
      const r = imgData[i], g = imgData[i + 1], b = imgData[i + 2];
      if (r + g + b < 90) continue;
      const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
      colors.set(key, (colors.get(key) || 0) + 1);
    }
    return [...colors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k.split(",").map(Number));
  }

  /* ================= SMART GENERATOR (OFFLINE — last resort, never fails) ================= */
  const PALETTE = {
    rose: { fr: "rose", en: "pink", ar: "وردي" },
    lavender: { fr: "lavande", en: "lavender", ar: "بنفسجي فاتح" },
    sky: { fr: "bleu ciel", en: "sky blue", ar: "أزرق سماوي" },
    peach: { fr: "pêche", en: "peach", ar: "خوخي" },
    cream: { fr: "crème", en: "cream", ar: "كريمي" },
    mint: { fr: "menthe", en: "mint", ar: "نعناعي" },
    gold: { fr: "doré", en: "golden", ar: "ذهبي" },
    neutral: { fr: "neutre", en: "neutral", ar: "محايد" }
  };

  function colorName([r, g, b]) {
    if (r > 200 && g > 140 && g < 200 && b > 140 && b < 210) return "rose";
    if (r > 150 && b > 180 && g < r + 40) return "lavender";
    if (b > 170 && r < 170 && g > 150) return "sky";
    if (r > 220 && g > 170 && g < 220 && b < 180) return "peach";
    if (r > 230 && g > 210 && b > 180) return "cream";
    if (g > 170 && g > r + 30 && g > b) return "mint";
    if (r > 180 && g > 150 && b < 140) return "gold";
    return "neutral";
  }

  const TITLE_TEMPLATES = {
    fr: ["Hijab {color}", "Élégance {color}", "Douceur {color}", "Rêve {color}", "Soie {color}", "Charme {color}", "Éclat {color}"],
    en: ["{Color} Hijab", "{Color} Grace", "{Color} Bloom", "{Color} Serenity", "{Color} Silk", "{Color} Glow", "{Color} Allure"],
    ar: ["حجاب {color}", "أناقة {color}", "نعومة {color}", "لمسة {color}", "حرير {color}", "سحر {color}", "تألق {color}"]
  };

  const DESC_TEMPLATES = {
    fr: ["Une pièce délicate dans une teinte {color}, pensée pour la douceur et l'élégance féminine au quotidien.",
      "Création Sundus en {color}: une coupe féminine qui accompagne chaque moment avec grâce.",
      "La soie fine du paradis: cette pièce {color} révèle une féminité délicate, moderne et raffinée."],
    en: ["A delicate piece in a {color} shade, designed for everyday softness and feminine elegance.",
      "A Sundus creation in {color}: a feminine cut that accompanies every moment with grace.",
      "The fine silk of paradise: this {color} piece reveals delicate, modern, refined femininity."],
    ar: ["قطعة رقيقة بلون {color}، صُممت للنعومة والأناقة الأنثوية في كل يوم.",
      "إبداع سُنْدُس بلون {color}: قصّة أنثوية ترافق كل لحظة برشاقة.",
      "حرير الجنة الناعم: هذه القطعة بلون {color} تُظهر أنوثة رقيقة وعصرية وأنيقة."]
  };

  function generateOffline(item) {
    const base = item.colors && item.colors.length ? colorName(item.colors[0]) : "rose";
    const col = PALETTE[base] || PALETTE.rose;
    const out = {};
    ["fr", "en", "ar"].forEach((l) => {
      const color = col[l];
      out[l] = {
        title: TITLE_TEMPLATES[l].map((s) => s.replace("{color}", color)),
        desc: DESC_TEMPLATES[l].map((s) => s.replace("{color}", color))
      };
    });
    return out;
  }

  /* ================= AI CHAIN: Groq → Gemini → offline ================= */
  async function callGroq(prompt) {
    const key = getKey("groq");
    if (!key) return null;
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: C.ai.groqModel,
          messages: [
            { role: "system", content: "You are a fashion copywriter for Sundus, a hijab/modest fashion brand: feminine, pastel, delicate. Always answer with STRICT JSON only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.9,
          response_format: { type: "json_object" }
        })
      });
      if (!res.ok) return null;
      const data = await res.json();
      const text = data.choices?.[0]?.message?.content;
      return text ? JSON.parse(text) : null;
    } catch (e) { return null; }
  }

  async function callGemini(prompt) {
    const key = getKey("gemini");
    if (!key) return null;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${C.ai.geminiModel}:generateContent?key=${key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      if (!res.ok) return null;
      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const json = text.match(/\{[\s\S]*\}/);
      if (!json) return null;
      return JSON.parse(json[0]);
    } catch (e) { return null; }
  }

  async function generateAI(item, genLang) {
    const langs = genLang === "auto" ? C.locales : [genLang];
    const itemsStr = (item.colors || []).length
      ? `The dominant color(s) of the photo: ${item.colors.map(([r, g, b]) => `rgb(${r},${g},${b})`).join(", ")}.`
      : "";
    const prompt = `You are a fashion copywriter for Sundus, a women's fashion brand (feminine, pastel, delicate, modern, "the fine silk of paradise"). It offers dresses, tops, skirts, hijabs, abayas and accessories for all women.
A designer uploaded a new garment (dress, top, skirt, hijab, abaya or accessory).
${itemsStr}
Generate for EACH language (${langs.join(", ")}) exactly 3 options. Each option = title (max 5 words, poetic, feminine) + description (1-2 sentences).
Return ONLY strict JSON: {"fr":[{"title":"...","desc":"..."}],"en":[...],"ar":[...]} — always include ALL 3 languages (fr, en, ar) in the response, even if you only refine one.
Be elegant, modest-fashion aware, pastel-inspired. Never mention the file name.`;

    const groq = await callGroq(prompt);
    if (groq && groq.fr && groq.en && groq.ar) {
      const opts = (groq[genLang === "auto" ? "fr" : genLang] || []).slice(0, 3);
      if (opts.length) return { opts, provider: "groq" };
    }
    const gem = await callGemini(prompt);
    if (gem && gem.fr && gem.en && gem.ar) {
      const opts = (gem[genLang === "auto" ? "fr" : genLang] || []).slice(0, 3);
      if (opts.length) return { opts, provider: "gemini" };
    }
    return null;
  }

  /* ================= ITEMS UI ================= */
  function renderItems() {
    const wrap = $("items");
    if (!items.size) {
      wrap.innerHTML = `<div class="empty-state">🌙 ${t("admin_no_media")}</div>`;
      return;
    }
    wrap.innerHTML = "";
    items.forEach((item, id) => {
      const div = document.createElement("div");
      div.className = "item";
      div.innerHTML = `
        <div class="item-media">${item.get("type") === "video"
          ? `<video src="${item.get("data")}" muted loop></video>`
          : `<img src="${item.get("data")}" alt="">`}</div>
        <div class="item-body">
          <div class="options-row" data-opts="title"></div>
          <label data-i18n="admin_title">Titre</label>
          <input type="text" data-field="title" data-lang="${lang()}" value="${esc(item.get("title")?.[lang()] || "")}">
          <div class="options-row" data-opts="desc"></div>
          <label data-i18n="admin_desc">Description</label>
          <textarea rows="3" data-field="desc" data-lang="${lang()}">${esc(item.get("desc")?.[lang()] || "")}</textarea>
          <label data-i18n="admin_price">Prix (€)</label>
          <input type="number" data-field="price" value="${esc(item.get("price") || "")}" placeholder="${t("price_placeholder")}">
          <label data-i18n="admin_category">Catégorie</label>
          <select data-field="category">
            ${C.categories.map((c) =>
              `<option value="${c}" ${item.get("category") === c ? "selected" : ""}>${t("filter_" + c)}</option>`).join("")}
          </select>
          <label data-i18n="admin_tag">Tags</label>
          <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">
            ${[["new", t("admin_new")], ["exclu", t("admin_exclu")], ["sale", t("admin_sale")]].map(([tag, label]) => {
              const has = (item.get("tags") || []).includes(tag);
              return `<button class="opt ${has ? "on" : ""}" data-tag="${tag}" style="${has ? "background:linear-gradient(135deg,var(--rose),var(--lavender));color:#fff;border-color:transparent" : ""}">${label}</button>`;
            }).join("")}
          </div>
          <button class="item-del" data-del>🗑 ${t("lightbox_close") === "Fermer" ? "Supprimer" : "Delete"}</button>
        </div>`;
      div.querySelectorAll("[data-tag]").forEach((b) => b.addEventListener("click", () => {
        const tags = item.get("tags") || [];
        const i = tags.indexOf(b.dataset.tag);
        if (i >= 0) tags.splice(i, 1); else tags.push(b.dataset.tag);
        item.set("tags", tags);
        renderItems();
      }));
      div.querySelectorAll("[data-field]").forEach((input) => {
        input.addEventListener("input", () => {
          const f = input.dataset.field;
          if (f === "title" || f === "desc") {
            const map = item.get(f) || {};
            map[input.dataset.lang || lang()] = input.value;
            item.set(f, map);
          } else {
            item.set(f, input.value);
          }
        });
      });
      div.querySelector("[data-del]").addEventListener("click", () => { items.delete(id); renderItems(); });
      const tOpts = div.querySelector('[data-opts="title"]');
      const dOpts = div.querySelector('[data-opts="desc"]');
      if (item.get("_opts")) {
        tOpts.innerHTML = item.get("_opts").map((o, i) =>
          `<button class="opt" data-pick="${i}" data-kind="title">${i + 1} · ${esc(o.title)}</button>`).join("");
        dOpts.innerHTML = item.get("_opts").map((o, i) =>
          `<button class="opt" data-pick="${i}" data-kind="desc">${esc(o.desc)}</button>`).join("");
        div.querySelectorAll("[data-pick]").forEach((b) => b.addEventListener("click", () => {
          const pick = item.get("_opts")[+b.dataset.pick];
          const l = item.get("_lang") || lang();
          const map = item.get(b.dataset.kind) || {};
          map[l] = pick[b.dataset.kind];
          item.set(b.dataset.kind, map);
          renderItems();
        }));
      }
      wrap.appendChild(div);
    });
  }

  const esc = (s) => String(s || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  function addFiles(files) {
    const list = [...files];
    if (!list.length) return;
    toast(`⏳ 0/${list.length}`);
    list.forEach(async (file, i) => {
      const optimized = file.type.startsWith("video")
        ? await optimizeVideo(file)
        : await optimizeImage(file);
      if (!optimized) return;
      const id = "p_" + Date.now().toString(36) + "_" + i;
      items.set(id, new Map([
        ["type", optimized.type],
        ["data", optimized.data],
        ["colors", optimized.colors],
        ["title", {}], ["desc", {}],
        ["price", ""], ["category", C.categories[0]], ["tags", ["new"]],
        ["_opts", null], ["_lang", null]
      ]));
      renderItems();
      toast(`✅ ${[...items.keys()].length} ${t("stats_pieces")}`);
    });
  }

  /* ================= GENERATE ================= */
  async function generateAll() {
    const genLang = $("gen-lang").value;
    if (!items.size) { toast(t("admin_no_media")); return; }
    toast(`✨ ${t("admin_generating")}`);
    for (const [id, item] of items) {
      const ai = await generateAI(item, genLang);
      if (ai) {
        const l = genLang === "auto" ? "fr" : genLang;
        item.set("_opts", ai.opts);
        item.set("_lang", l);
        if (ai.opts[0]) {
          item.set("title", { ...item.get("title"), [l]: ai.opts[0].title });
          item.set("desc", { ...item.get("desc"), [l]: ai.opts[0].desc });
        }
      } else {
        const off = generateOffline(item);
        const langKeys = genLang === "auto" ? C.locales : [genLang];
        const titleMap = {}, descMap = {};
        langKeys.forEach((l) => { titleMap[l] = off[l].title[0]; descMap[l] = off[l].desc[0]; });
        item.set("title", titleMap);
        item.set("desc", descMap);
        item.set("_opts", langKeys.map((l) => ({ title: off[l].title[0], desc: off[l].desc[0] })));
        item.set("_lang", langKeys[0]);
      }
      renderItems();
    }
    toast(`✨ ${t("admin_generating")} — 100%`);
  }

  /* ================= PUBLISH: CLOUD (GitHub API) → LOCAL (server) ================= */
  function buildProducts() {
    return [...items.entries()].map(([id, item]) => ({
      id,
      image: item.get("type") === "image" ? `media/${id}.webp` : null,
      video: item.get("type") === "video" ? `media/${id}.${(item.get("data").split(";")[0].split("/")[1] || "mp4").split("+")[0]}` : null,
      title: item.get("title") || {}, desc: item.get("desc") || {},
      price: String(item.get("price") || ""), category: item.get("category") || C.categories[0],
      tags: item.get("tags") || [], date: Date.now()
    }));
  }

  async function githubPut(path, base64) {
    const token = getToken();
    const res = await fetch(`https://api.github.com/repos/${C.cloud.owner}/${C.cloud.repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify({ message: `✨ Sundus: update ${path}`, content: base64 })
    });
    return res.ok || res.status === 409;
  }

  function getToken() {
    try {
      const saved = localStorage.getItem("sundus_cloud_token");
      if (saved) return saved;
    } catch (e) {}
    if (C.cloud.token) return C.cloud.token;
    if (C.cloud.tokenParts && C.cloud.tokenParts.length) {
      try { return atob(C.cloud.tokenParts.join("")); } catch (e) {}
    }
    return "";
  }

  function getKey(which) {
    const store = which === "groq" ? "sundus_groq_key" : "sundus_gemini_key";
    const cfg = which === "groq" ? C.ai.groqKey : C.ai.geminiKey;
    let key = "";
    try { key = localStorage.getItem(store) || ""; } catch (e) {}
    if (!key && cfg) {
      try {
        const joined = Array.isArray(cfg) ? cfg.join("") : cfg;
        key = atob(joined);
      } catch (e) { key = Array.isArray(cfg) ? cfg.join("") : cfg; }
    }
    return key;
  }

  async function saveToken() {
    const token = $("token-input").value.trim();
    const groq = $("groq-input").value.trim();
    const gemini = $("gemini-input").value.trim();
    try {
      if (token) localStorage.setItem("sundus_cloud_token", token);
      if (groq) localStorage.setItem("sundus_groq_key", groq);
      if (gemini) localStorage.setItem("sundus_gemini_key", gemini);
    } catch (e) {}
    toast(t("admin_token_ok"));
    $("token-input").value = ""; $("groq-input").value = ""; $("gemini-input").value = "";
    const badge = document.querySelector(".ai-badge span");
    if (badge) {
      const parts = [getKey("groq") ? "Groq" : null, getKey("gemini") ? "Gemini" : null, t("ai_offline")].filter(Boolean);
      badge.textContent = "✦ IA: " + parts.join(" → ") + " ☁️";
    }
  }

  async function cloudPublish(products) {
    if (!C.cloud.enabled || !getToken() || !C.cloud.owner) return false;
    try {
      for (const [id, item] of items) {
        const base64 = item.get("data").split(",")[1];
        if (!base64) continue;
        const ext = item.get("type") === "image" ? "webp" : (item.get("data").match(/^data:([^;]+);/)?.[1].split("/")[1] || "mp4");
        await githubPut(`data/media/${id}.${ext}`, base64);
      }
      await githubPut("data/products.json", btoa(unescape(encodeURIComponent(JSON.stringify(products, null, 2)))));
      return true;
    } catch (e) { return false; }
  }

  async function localPublish(products) {
    try {
      let ok = true;
      for (const [id, item] of items) {
        const res = await fetch(`${API}/upload`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, data: item.get("data") })
        });
        if (!res.ok) ok = false;
      }
      if (ok) {
        const res = await fetch(`${API}/products`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products })
        });
        return res.ok;
      }
    } catch (e) { return false; }
    return false;
  }

  async function publish() {
    if (!items.size) { toast(t("admin_no_media")); return; }
    const products = buildProducts();
    const cloudOK = await cloudPublish(products);
    if (cloudOK) {
      toast(`✅ ${t("admin_saved")} ☁️`);
      saveDraft();
      return;
    }
    const localOK = await localPublish(products);
    if (localOK) {
      toast(`✅ ${t("admin_saved")}`);
      saveDraft();
      return;
    }
    toast("⚠️ " + t("ai_offline"));
    downloadJson(products);
  }

  function downloadJson(products) {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "products.json";
    a.click();
  }

  /* ================= DRAFT (localStorage) ================= */
  function saveDraft() {
    const draft = {};
    items.forEach((item, id) => draft[id] = Object.fromEntries(item.entries()));
    try { localStorage.setItem("sundus_draft", JSON.stringify(draft)); } catch (e) {}
  }

  function loadDraft() {
    try {
      const raw = localStorage.getItem("sundus_draft");
      if (!raw) return;
      const draft = JSON.parse(raw);
      Object.entries(draft).forEach(([id, data]) => items.set(id, new Map(Object.entries(data))));
      renderItems();
    } catch (e) {}
  }

  /* ================= TOAST ================= */
  let toastTimer;
  function toast(msg) {
    const el = $("status");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  }

  /* ================= SOCIAL SECTION (reels/tiktok captions — never published) ================= */
  const socials = new Map();
  const SOCIAL_HASHTAGS = {
    fr: ["#Sundus", "#ModeModeste", "#ÉléganceFéminine", "#HijabStyle", "#ModeFéminine", "#Pastel"],
    en: ["#Sundus", "#ModestFashion", "#FeminineElegance", "#HijabStyle", "#PastelFashion"],
    ar: ["#سندس", "#موضة_محتشمة", "#أناقة_أنثوية", "#حجاب", "#أزياء_محتشمة"]
  };

  const SOCIAL_TEMPLATES = {
    fr: [
      "✨ Nouvelle pièce {color} chez Sundus — la soie fine du paradis. Élégance douce, féminité qui s'exprime librement. {brand}",
      "🌸 Découvrez cette merveille {color} dans la collection Sundus. Conçu avec amour, porté avec fierté. {brand}",
      "💫 {color} est la teinte du moment chez Sundus. Une pièce pensée pour la femme moderne et élégante. {brand}"
    ],
    en: [
      "✨ New {color} piece from Sundus — the fine silk of paradise. Soft elegance, femininity expressed freely. {brand}",
      "🌸 Discover this {color} beauty in the Sundus collection. Made with love, worn with pride. {brand}",
      "💫 {color} is the shade of the moment at Sundus. Designed for the modern, elegant woman. {brand}"
    ],
    ar: [
      "✨ قطعة جديدة بلون {color} من سُنْدُس — حرير الجنة الناعم. أناقة ناعمة وأنوثة تعبّر عن نفسها بحرية. {brand}",
      "🌸 اكتشفي هذا الجمال بلون {color} من تشكيلة سُنْدُس. صُنع بحب، ويُرتدى بكل فخر. {brand}",
      "💫 لون {color} هو لون اللحظة في سُنْدُس. قطعة صُممت للمرأة العصرية الأنيقة. {brand}"
    ]
  };

  const SOCIAL_TITLES = {
    fr: ["Robe {color} — Élégance Sundus", "Pièce {color} de la collection", "Nouveauté {color} ✨"],
    en: ["{color} dress — Sundus elegance", "{color} piece of the collection", "New {color} arrival ✨"],
    ar: ["فستان بلون {color} — أناقة سندس", "قطعة بلون {color} من التشكيلة", "جديد بلون {color} ✨"]
  };

  async function generateSocialAI(item) {
    const colorsStr = (item.get("colors") || []).length
      ? `The dominant color(s) of the photo: ${item.get("colors").map(([r, g, b]) => `rgb(${r},${g},${b})`).join(", ")}.`
      : "";
    const prompt = `You are a social media copywriter for Sundus, a women's fashion brand (feminine, pastel, delicate, modern, "the fine silk of paradise"): hijabs, abayas, dresses, tops, skirts, accessories.
A designer uploaded a new item for TikTok/Instagram reels.
${colorsStr}
Generate for EACH language (fr, en, ar) exactly 3 options. Each option = title (max 5 words, poetic) + caption (2-3 sentences, engaging, with emojis, for a reel on TikTok/Instagram) + hashtags (5-7 relevant hashtags for that language, without # symbols, comma separated).
Return ONLY strict JSON: {"fr":[{"title":"...","caption":"...","hashtags":"..."}],"en":[...],"ar":[...]} — always include ALL 3 languages. Never mention the file name.`;

    const groq = await callGroq(prompt);
    if (groq && groq.fr && groq.en && groq.ar) return { opts: groq, provider: "groq" };
    const gem = await callGemini(prompt);
    if (gem && gem.fr && gem.en && gem.ar) return { opts: gem, provider: "gemini" };
    return null;
  }

  function generateSocialOffline(item) {
    const base = item.get("colors") && item.get("colors").length ? colorName(item.get("colors")[0]) : "rose";
    const col = PALETTE[base] || PALETTE.rose;
    const out = {};
    ["fr", "en", "ar"].forEach((l) => {
      const color = col[l];
      out[l] = SOCIAL_TITLES[l].map((s) => ({ title: s.replace("{color}", color) })).map((o, i) => ({
        title: o.title,
        caption: SOCIAL_TEMPLATES[l][i].replace("{color}", color).replace("{brand}", "🌙 SUNDUS"),
        hashtags: SOCIAL_HASHTAGS[l].join(", ")
      }));
    });
    return out;
  }

  async function generateSocialAll() {
    if (!socials.size) { toast(t("admin_no_media")); return; }
    toast(`✨ ${t("admin_generating")}`);
    for (const [id, item] of socials) {
      const ai = await generateSocialAI(item);
      if (ai) item.set("opts", ai.opts);
      else item.set("opts", generateSocialOffline(item));
      renderSocial();
    }
    toast(`✨ ${t("admin_generating")} — 100%`);
  }

  function copySocial(opt) {
    const text = `${opt.title}\n\n${opt.caption}\n\n${opt.hashtags}`;
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject())
      .then(() => toast("✅ " + t("copied")))
      .catch(() => {
        const ta = document.createElement("textarea");
        ta.value = text; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); ta.remove();
        toast("✅ " + t("copied"));
      });
  }

  function renderSocial() {
    const wrap = $("social-items");
    if (!socials.size) {
      wrap.innerHTML = `<div class="empty-state">📱 ${t("admin_social_empty")}</div>`;
      return;
    }
    wrap.innerHTML = "";
    socials.forEach((item, id) => {
      const opts = item.get("opts") || {};
      const div = document.createElement("div");
      div.className = "item";
      let html = `<div class="item-media">${item.get("type") === "video"
        ? `<video src="${item.get("data")}" muted loop></video>`
        : `<img src="${item.get("data")}" alt="">`}</div>
        <div class="item-body"><div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
          <select data-sl="${id}" style="padding:7px 10px;border-radius:10px;border:1.4px solid rgba(92,75,99,0.16);font-family:inherit;font-size:0.85rem;background:#FFFDFE">
            <option value="fr">FR</option><option value="en">EN</option><option value="ar">AR</option>
          </select>
          <span class="hint">${t("admin_social_lang")}</span>
        </div>`;
      (["fr", "en", "ar"]).forEach((l) => {
        const list = opts[l] || [];
        html += `<div class="social-lang" data-lang="${l}" ${l === "fr" ? "" : 'hidden'}>
          ${list.map((o, i) => `
            <div class="social-opt">
              <b>${i + 1}. ${esc(o.title)}</b>
              <p>${esc(o.caption)}</p>
              <span class="hint">${esc(o.hashtags)}</span>
              <button class="opt" data-copy="${id}" data-idx="${i}" style="margin-top:6px">📋 ${t("admin_social_copy")}</button>
            </div>`).join("")}
        </div>`;
      });
      html += `<button class="item-del" data-del-social="${id}">🗑 ${t("admin_social_delete")}</button></div>`;
      div.innerHTML = html;
      div.querySelectorAll("[data-sl]").forEach((sel) => sel.addEventListener("change", () => {
        div.querySelectorAll(".social-lang").forEach((bl) => { bl.hidden = bl.dataset.lang !== sel.value; });
      }));
      div.querySelectorAll("[data-copy]").forEach((btn) => btn.addEventListener("click", () => {
        const o = opts[btn.closest(".social-lang").dataset.lang][+btn.dataset.idx];
        copySocial(o);
      }));
      div.querySelector("[data-del-social]").addEventListener("click", () => { socials.delete(id); renderSocial(); });
      wrap.appendChild(div);
    });
  }

  function addSocialFiles(files) {
    const list = [...files];
    if (!list.length) return;
    list.forEach(async (file, i) => {
      const optimized = file.type.startsWith("video")
        ? await optimizeVideo(file)
        : await optimizeImage(file);
      if (!optimized) return;
      const id = "s_" + Date.now().toString(36) + "_" + i;
      socials.set(id, new Map([
        ["type", optimized.type],
        ["data", optimized.data],
        ["colors", optimized.colors]
      ]));
      renderSocial();
    });
  }

  /* ================= INIT ================= */
  function init() {
    if (isLogged) { showApp(); loadDraft(); }

    $("btn-login").addEventListener("click", tryLogin);
    $("username").addEventListener("keydown", (e) => { if (e.key === "Enter") $("password").focus(); });
    $("password").addEventListener("keydown", (e) => { if (e.key === "Enter") tryLogin(); });
    $("btn-logout").addEventListener("click", () => { sessionStorage.removeItem("sundus_admin"); location.reload(); });

    const dz = $("dropzone"), fi = $("file-input");
    dz.addEventListener("click", () => fi.click());
    fi.addEventListener("change", () => { addFiles(fi.files); fi.value = ""; });
    ["dragover", "dragenter"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.add("drag"); }));
    ["dragleave", "drop"].forEach((ev) => dz.addEventListener(ev, (e) => { e.preventDefault(); dz.classList.remove("drag"); }));
    dz.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));

    $("btn-generate").addEventListener("click", generateAll);
    $("btn-publish").addEventListener("click", publish);
    $("btn-reset").addEventListener("click", () => { items.clear(); renderItems(); });
    $("btn-token").addEventListener("click", saveToken);
    $("token-input").addEventListener("keydown", (e) => { if (e.key === "Enter") saveToken(); });

    const dzS = $("social-dropzone"), fiS = $("social-file-input");
    if (dzS && fiS) {
      dzS.addEventListener("click", () => fiS.click());
      fiS.addEventListener("change", () => { addSocialFiles(fiS.files); fiS.value = ""; });
      ["dragover", "dragenter"].forEach((ev) => dzS.addEventListener(ev, (e) => { e.preventDefault(); dzS.classList.add("drag"); }));
      ["dragleave", "drop"].forEach((ev) => dzS.addEventListener(ev, (e) => { e.preventDefault(); dzS.classList.remove("drag"); }));
      dzS.addEventListener("drop", (e) => addSocialFiles(e.dataTransfer.files));
      $("btn-social-generate").addEventListener("click", generateSocialAll);
      $("btn-social-reset").addEventListener("click", () => { socials.clear(); renderSocial(); });
    }

    const badge = document.querySelector(".ai-badge span");
    if (badge) {
      const parts = [C.ai.groqKey ? "Groq" : null, C.ai.geminiKey ? "Gemini" : null, t("ai_offline")].filter(Boolean);
      badge.textContent = "✦ IA: " + parts.join(" → ") + " ☁️" + (getToken() ? " · " + t("admin_token_ready") : "");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
