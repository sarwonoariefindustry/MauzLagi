/* ==========================================================
   main.js — shared behaviour for every page.
   Needs products.js loaded first.
   1 Chrome (header/footer) · 2 Images · 3 WhatsApp · 4 Product cards
   5 Filters · 6 FAQ · 7 Reveal · 8 Smooth scroll
   ========================================================== */
(function () {
  "use strict";
  document.documentElement.classList.add("js");

  var NAV = [
    ["index.html", "Home"], ["flavors.html", "Our Flavors"], ["about.html", "About Us"],
    ["order.html", "Order & Contact"], ["experience.html", "The Experience"], ["build-your-box.html", "Build Your Box"]
  ];
  var current = (location.pathname.split("/").pop() || "index.html");

  /* 3. WhatsApp — shared by every CTA. Without a number, wa.me lets the sender pick a contact. */
  window.whatsappUrl = function (text) {
    var num = String(MAUZ_CONFIG.whatsappNumber || "").replace(/\D/g, "");
    return "https://wa.me/" + num + "?text=" + encodeURIComponent(text || "");
  };

  /* 1. Header + footer, rendered once so all pages stay identical */
  function navLinks(cls) {
    return NAV.map(function (n) {
      var cur = n[0] === current ? ' aria-current="page"' : "";
      return '<a href="' + n[0] + '"' + cur + ">" + n[1].replace("&", "&amp;") + "</a>";
    }).join("");
  }
  function renderChrome() {
    var h = document.getElementById("site-header");
    if (h) {
      h.outerHTML =
        '<header class="site-header"><div class="container">' +
        '<a class="wordmark" href="index.html" aria-label="Mauz Lagi — beranda">Mauz Lagi</a>' +
        '<nav class="nav" aria-label="Menu utama">' + navLinks() + "</nav>" +
        '<div class="header-actions"><a class="btn btn--primary btn--sm" data-wa="Halo Mauz Lagi! Saya mau pesan keripik pisang." href="#" target="_blank" rel="noopener">Order via WhatsApp</a>' +
        '<button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" aria-label="Buka menu"><span></span></button></div>' +
        '</div></header><nav class="mobile-nav" id="mobile-nav" aria-label="Menu seluler">' + navLinks() + "</nav>";
      var btn = document.querySelector(".menu-btn"), menu = document.getElementById("mobile-nav");
      function toggle(open) {
        btn.setAttribute("aria-expanded", open); menu.classList.toggle("is-open", open);
        document.body.classList.toggle("menu-open", open);
        btn.setAttribute("aria-label", open ? "Tutup menu" : "Buka menu");
      }
      btn.addEventListener("click", function () { toggle(btn.getAttribute("aria-expanded") !== "true"); });
      menu.addEventListener("click", function (e) { if (e.target.tagName === "A") toggle(false); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });
      window.addEventListener("resize", function () { if (window.innerWidth >= 1100) toggle(false); });
    }
    var f = document.getElementById("site-footer");
    if (f) {
      var ig = MAUZ_CONFIG.instagramUrl ? '<li><a href="' + MAUZ_CONFIG.instagramUrl + '" target="_blank" rel="noopener">Instagram</a></li>' : "";
      f.outerHTML =
        '<footer class="site-footer"><div class="container"><div class="footer-grid"><div>' +
        '<a class="wordmark" href="index.html">Mauz Lagi</a><p class="footer-tag">“' + MAUZ_CONFIG.tagline + '”</p>' +
        '<p class="small muted" style="margin-top:.75rem;max-width:36ch">Keripik pisang dengan lapisan rasa favoritmu.</p></div>' +
        '<div><h3>Jelajahi</h3><ul>' + NAV.map(function (n) { return '<li><a href="' + n[0] + '">' + n[1].replace("&", "&amp;") + "</a></li>"; }).join("") + "</ul></div>" +
        '<div><h3>Pesan &amp; kontak</h3><ul><li><a data-wa="Halo Mauz Lagi! Saya mau tanya soal pesanan." href="#" target="_blank" rel="noopener">Chat WhatsApp</a></li>' + ig +
        '<li class="small muted">Area pengiriman: ' + MAUZ_CONFIG.deliveryArea + "</li></ul></div></div>" +
        '<p class="footer-bottom">© ' + new Date().getFullYear() + " Mauz Lagi. Semua hak dilindungi.</p></div></footer>";
    }
  }

  /* 2. Centralised images + fallback */
  function setImg(img, src, color) {
    img.addEventListener("error", function onErr() {
      img.removeEventListener("error", onErr); img.src = fallbackImage(color);
    });
    img.src = src;
  }
  function hydrateImages(root) {
    (root || document).querySelectorAll("img[data-img]").forEach(function (img) {
      if (img.getAttribute("src")) return;
      var key = img.getAttribute("data-img");
      var p = getProduct(key);
      setImg(img, IMAGES[key] || (p && p.img) || "", p ? p.color : "");
    });
  }

  /* 3b. Wire every [data-wa] link */
  function hydrateWhatsApp() {
    document.querySelectorAll("[data-wa]").forEach(function (a) { a.href = whatsappUrl(a.getAttribute("data-wa")); });
  }

  /* 4. Product cards */
  window.productCardHTML = function (p) {
    return '<article class="card product-card" data-flavor="' + p.id + '" style="--flavor:' + p.color + '">' +
      '<div class="media"><span class="chip">' + p.name + '</span><img data-img="' + p.id + '" alt="Keripik pisang rasa ' + p.name + '" loading="lazy" width="400" height="400"></div>' +
      '<div class="body"><h3 class="t-h3">' + p.name + '</h3><p class="small muted">' + p.desc + "</p>" +
      '<div class="foot"><span class="price">' + formatRupiah(p.price) + '</span>' +
      '<a class="btn btn--primary btn--sm" href="order.html?add=' + p.id + '">Pesan ' + p.name + "</a></div></div></article>";
  };
  function renderGrids() {
    document.querySelectorAll("[data-flavor-grid]").forEach(function (g) {
      g.innerHTML = PRODUCTS.map(productCardHTML).join("");
      hydrateImages(g);
    });
  }

  /* 5. Flavor filters (flavors.html) */
  function initFilters() {
    var bar = document.querySelector("[data-filters]"); if (!bar) return;
    var count = document.getElementById("filter-count");
    var items = [["all", "Semua"]].concat(PRODUCTS.map(function (p) { return [p.id, p.name]; }));
    bar.innerHTML = items.map(function (i, idx) {
      return '<button class="filter-btn" type="button" data-filter="' + i[0] + '" aria-pressed="' + (idx === 0) + '">' + i[1] + "</button>";
    }).join("");
    bar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-filter]"); if (!b) return;
      var f = b.getAttribute("data-filter"), shown = 0;
      bar.querySelectorAll("[data-filter]").forEach(function (x) { x.setAttribute("aria-pressed", x === b); });
      document.querySelectorAll("[data-flavor-grid] [data-flavor]").forEach(function (c) {
        var ok = f === "all" || c.getAttribute("data-flavor") === f; c.hidden = !ok; if (ok) shown++;
      });
      if (count) count.textContent = "Menampilkan " + shown + " dari " + PRODUCTS.length + " rasa";
    });
  }

  /* 6. FAQ accordion */
  function initFaq() {
    document.querySelectorAll("[data-faq]").forEach(function (faq) {
      faq.addEventListener("click", function (e) {
        var q = e.target.closest(".faq-q"); if (!q) return;
        var open = q.getAttribute("aria-expanded") === "true";
        faq.querySelectorAll(".faq-q").forEach(function (x) { x.setAttribute("aria-expanded", "false"); });
        q.setAttribute("aria-expanded", String(!open));
      });
    });
  }

  /* 7. Reveal on scroll (experience page only uses .reveal) */
  function initReveal() {
    var els = document.querySelectorAll(".reveal"); if (!els.length) return;
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("is-visible"); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* 8. Smooth scroll for in-page anchors (offset handled by scroll-margin-top in CSS) */
  function initAnchors() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest('a[href^="#"]'); if (!a || a.getAttribute("href") === "#") return;
      var t = document.querySelector(a.getAttribute("href")); if (!t) return;
      e.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" });
      history.replaceState(null, "", a.getAttribute("href"));
    });
  }

  document.addEventListener("mauz:hydrate", function () { hydrateImages(); });
  renderChrome(); renderGrids(); hydrateImages(); hydrateWhatsApp();
  initFilters(); initFaq(); initReveal(); initAnchors();
})();
