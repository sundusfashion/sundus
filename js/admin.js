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
    const pw = $("password").value;
    if (pw === C.adminPassword) {
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
    fr: ["Une pièce délicate dans une teinte {color}, pensée pour la douceur, l'élégance et la modestie au quotidien.",
      "Création Sundus en {color}: une coupe féminine qui accompagne chaque moment avec grâce et pudeur.",
      "La soie fine du paradis: cette pièce {color} révèle une féminité délicate, moderne et raffinée."],
    en: ["A delicate piece in a {color} shade, designed for everyday softness, elegance and modesty.",
      "A Sundus creation in {color}: a feminine cut that accompanies every moment with grace and modesty.",
      "The fine silk of paradise: this {color} piece reveals delicate, modern, refined femininity."],
    ar: ["قطعة رقيقة بلون {color}، صُممت للنعومة والأناقة والاحتشام في كل يوم.",
      "إبداع سندس بلون {color}: قصّة أنثوية ترافق كل لحظة برشاقة واحتشام.",
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
    if (!C.ai.groqKey) return null;
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${C.ai.groqKey}` },
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
    if (!C.ai.geminiKey) return null;
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${C.ai.geminiModel}:generateContent?key=${C.ai.geminiKey}`, {
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
    const prompt = `You are a fashion copywriter for Sundus, a hijab/modest fashion brand (feminine, pastel, delicate, modern, "the fine silk of paradise").
A designer uploaded a new garment (photo: hijab, abaya, dress or accessory).
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
    const res = await fetch(`https://api.github.com/repos/${C.cloud.owner}/${C.cloud.repo}/contents/${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${C.cloud.token}`,
        "Content-Type": "application/json",
        "Accept": "application/vnd.github+json"
      },
      body: JSON.stringify({ message: `✨ Sundus: update ${path}`, content: base64 })
    });
    return res.ok || res.status === 409;
  }

  async function cloudPublish(products) {
    if (!C.cloud.enabled || !C.cloud.token || !C.cloud.owner) return false;
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

  /* ================= INIT ================= */
  function init() {
    if (isLogged) { showApp(); loadDraft(); }

    $("btn-login").addEventListener("click", tryLogin);
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

    const badge = document.querySelector(".ai-badge span");
    if (badge) {
      const parts = [C.ai.groqKey ? "Groq" : null, C.ai.geminiKey ? "Gemini" : null, t("ai_offline")].filter(Boolean);
      badge.textContent = "✦ IA: " + parts.join(" → ") + " ☁️";
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
