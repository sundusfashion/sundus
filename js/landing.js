(function () {
  const C = window.SUNDUS_CONFIG;
  let products = [];
  let activeFilter = "all";

  const CATEGORIES = ["hijabs", "abayas", "robes", "accessoires"];

  async function loadProducts() {
    try {
      const res = await fetch("data/products.json", { cache: "no-store" });
      if (res.ok) products = await res.json();
    } catch (e) { products = []; }
  }

  function t(key) { return window.SundusI18n.t(key); }
  const lang = () => window.SundusI18n.get();

  function localField(p, field) {
    return (p[field] && p[field][lang()]) || (p[field] && p[field].en) || "";
  }

  function renderFilters() {
    const f = document.getElementById("filters");
    const cats = [["all", t("filter_all")], ...CATEGORIES.map((c) => [c, t("filter_" + c)])];
    f.innerHTML = cats.map(([k, label]) =>
      `<button data-cat="${k}" class="${k === "all" ? "active" : ""}">${label}</button>`).join("");
    f.querySelectorAll("button").forEach((b) =>
      b.addEventListener("click", () => {
        activeFilter = b.dataset.cat;
        f.querySelectorAll("button").forEach((x) => x.classList.toggle("active", x === b));
        renderGrid(true);
      }));
  }

  function renderGrid(animate = false) {
    const grid = document.getElementById("grid");
    const list = products.filter((p) => activeFilter === "all" || p.category === activeFilter);
    if (!list.length) {
      grid.innerHTML = `<div class="empty-state">✦ ${t("admin_no_media")}</div>`;
      return;
    }
    grid.innerHTML = list.map((p, i) => {
      const price = p.price ? `<span class="price">${C.currency}${p.price}</span>` : "";
      const tags = (p.tags || []).map((tag) => {
        const label = { new: t("admin_new"), exclu: t("admin_exclu"), sale: t("admin_sale") }[tag] || tag;
        return `<span class="tag-${tag}">${label}</span>`;
      }).join("");
      const media = p.video
        ? `<video src="data/media/${p.video}" muted loop preload="metadata"></video>`
        : `<img src="data/media/${p.image}" alt="${localField(p, "title")}" loading="lazy">`;
      return `
      <article class="card" style="transition-delay:${animate ? Math.min(i * 60, 480) : 0}ms">
        <div class="card-media" data-idx="${list.indexOf(p)}">
          <div class="card-tags">${tags}</div>
          ${media}
        </div>
        <div class="card-body">
          <h3>${localField(p, "title")}</h3>
          <p>${localField(p, "desc")}</p>
          <div class="card-foot">
            ${price}
            <span class="card-order" data-idx="${list.indexOf(p)}">✦</span>
          </div>
        </div>
      </article>`;
    }).join("");

    requestAnimationFrame(() => {
      grid.querySelectorAll(".card").forEach((c) => c.classList.add("visible"));
    });

    grid.querySelectorAll(".card-media, .card-order").forEach((el) => {
      el.addEventListener("click", () => openLightbox(list[+el.dataset.idx]));
    });
  }

  function openLightbox(p) {
    const lb = document.getElementById("lightbox");
    document.getElementById("lb-media").innerHTML = p.video
      ? `<video src="data/media/${p.video}" controls autoplay style="width:100%;height:100%;object-fit:cover"></video>`
      : `<img src="data/media/${p.image}" alt="${localField(p, "title")}">`;
    document.getElementById("lb-title").textContent = localField(p, "title");
    document.getElementById("lb-desc").textContent = localField(p, "desc");
    document.getElementById("lb-price").textContent = p.price ? C.currency + p.price : "";
    const order = document.getElementById("lb-order");
    order.href = mailtoHref(`Commande : ${localField(p, "title")}`, p.id);
    order.textContent = t("lightbox_order") + " ✦";

    const share = document.getElementById("lb-share");
    const url = location.href.split("#")[0];
    const text = encodeURIComponent(`${localField(p, "title")} — ${C.brand} ✦`);
    share.innerHTML = `
      <a class="btn btn-ghost" target="_blank" href="https://wa.me/?text=${text}%20${encodeURIComponent(url)}">WhatsApp</a>
      <a class="btn btn-ghost" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}">Facebook</a>
      <button class="btn btn-ghost" id="lb-copy">🔗 ${t("copy_link")}</button>`;
    document.getElementById("lb-copy").addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(url); alert(t("copied")); } catch (e) {}
    });
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    document.getElementById("lightbox").classList.remove("open");
    document.body.style.overflow = "";
  }

  function mailtoHref(subject, ref) {
    const body = `Bonjour ${C.brand},\n\nJe suis intéressée par cette pièce (réf: ${ref}).\n\nMerci !`;
    return `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(C.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function renderSocials() {
    const socials = [
      ["Instagram", C.instagram, "instagram"],
      ["TikTok", C.tiktok, "tiktok"],
      ["Pinterest", C.pinterest, "pinterest"]
    ];
    document.getElementById("socials").innerHTML = socials.map(([name, url, key]) =>
      `<a class="social-btn" href="${url}" target="_blank" rel="noopener" aria-label="${name}" title="${name}">
        <svg viewBox="0 0 24 24">${icons[key]}</svg>
      </a>`).join("");
  }

  const icons = {
    instagram: `<path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.2 2.3.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1.1.4 2.3.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.9-.4 2.3-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1.1.4-2.3.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.2-2.3-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1.1-.4-2.3C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.9.4-2.3.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1.1-.4 2.3-.4C8.4 2.2 8.8 2.2 12 2.2zm0 2c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.2.8-.4.4-.6.7-.8 1.2-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.2.4.4.7.6 1.2.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.2-.8.4-.4.6-.7.8-1.2.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.2-.4-.4-.7-.6-1.2-.8-.4-.2-1-.3-2.1-.4-1.2-.1-1.6-.1-4.7-.1zm0 4.1a5.7 5.7 0 1 1 0 11.4 5.7 5.7 0 0 1 0-11.4zm0 2a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4zm6-3.2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"/>`,
    tiktok: `<path d="M16.6 5.8a4.8 4.8 0 0 1-3.3-3.6h-2.8v12.7a2.8 2.8 0 1 1-2.8-2.8c.3 0 .6 0 .9.1V9.4a5.8 5.8 0 0 0-.9-.1 5.7 5.7 0 1 0 5.7 5.7V9.9a7.7 7.7 0 0 0 4.5 1.4V8.5a4.8 4.8 0 0 1-1.3-2.7z"/>`,
    pinterest: `<path d="M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.3-5.4s-.3-.6-.3-1.6c0-1.5.9-2.6 2-2.6.9 0 1.4.7 1.4 1.5 0 .9-.6 2.3-.9 3.6-.3 1.1.5 2 1.6 2 1.9 0 3.4-2 3.4-5 0-2.6-1.9-4.4-4.6-4.4a4.8 4.8 0 0 0-5 4.8c0 .9.4 1.9.9 2.5a.4.4 0 0 1 .1.3l-.3 1.3c-.1.2-.2.3-.4.2-1.3-.6-2.1-2.5-2.1-4 0-3.2 2.3-6.2 6.7-6.2 3.5 0 6.3 2.5 6.3 5.9 0 3.5-2.2 6.4-5.3 6.4-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.2 2.6A10 10 0 1 0 12 2z"/>`
  };

  function initHeader() {
    const header = document.getElementById("header");
    window.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollY > 40), { passive: true });
  }

  function initReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    document.querySelectorAll(".card").forEach((c) => new IntersectionObserver((en, ob) => {
      en.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); ob.disconnect(); } });
    }, { threshold: 0.1 }).observe(c));
  }

  async function init() {
    renderFilters();
    renderSocials();
    await loadProducts();
    renderGrid();
    document.getElementById("lb-close").addEventListener("click", closeLightbox);
    document.getElementById("lightbox").addEventListener("click", (e) => { if (e.target.id === "lightbox") closeLightbox(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });
    initHeader();
    initReveal();

    window.addEventListener("qamra:lang", () => {
      renderFilters();
      renderGrid();
      const cta = document.getElementById("cta-mail");
      cta.href = mailtoHref(t("cta_sub"), "site");
      const socials = [
        ["Instagram", "instagram"], ["TikTok", "tiktok"], ["Pinterest", "pinterest"]
      ];
      document.getElementById("socials").innerHTML = socials.map(([name, key]) =>
        `<a class="social-btn" href="${C[key]}" target="_blank" rel="noopener" aria-label="${name}" title="${name}">
          <svg viewBox="0 0 24 24">${icons[key]}</svg>
        </a>`).join("");
    });
  }

  document.addEventListener("DOMContentLoaded", init);
})();
