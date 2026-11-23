/* ==========================================================
   order.js — order.html and build-your-box.html
   Needs products.js and main.js loaded first.
   All prices are calculated here from products.js.
   ========================================================== */
(function () {
  "use strict";
  var page = document.body.getAttribute("data-page");
  var MAX_QTY = 99;

  /* Shared helpers */
  function el(id) { return document.getElementById(id); }
  function clamp(n) { return Math.max(0, Math.min(MAX_QTY, n)); }
  function subtotalOf(lines) { return lines.reduce(function (s, l) { return s + l.qty * getProduct(l.id).price; }, 0); }

  /* Builds the Indonesian WhatsApp message */
  function buildMessage(lines, opts) {
    opts = opts || {};
    var out = ["Halo Mauz Lagi! Saya mau pesan" + (opts.title ? " " + opts.title : "") + ":", ""];
    lines.forEach(function (l) {
      var p = getProduct(l.id);
      out.push("- " + p.name + " x" + l.qty + " = " + formatRupiah(l.qty * p.price));
    });
    out.push("", "Subtotal: " + formatRupiah(subtotalOf(lines)));
    if (opts.name) out.push("Nama: " + opts.name);
    if (opts.address) out.push("Alamat pengiriman: " + opts.address);
    out.push("", "Terima kasih!");
    return out.join("\n");
  }
  window.buildOrderMessage = buildMessage; // exposed for quick checks in the console

  function setError(inputWrap, msgEl, msg) {
    if (msgEl) msgEl.textContent = msg || "";
    if (inputWrap) inputWrap.classList.toggle("is-invalid", !!msg);
  }
  function qtyHTML(id, qty) {
    return '<div class="qty" role="group" aria-label="Jumlah ' + getProduct(id).name + '">' +
      '<button type="button" data-act="dec" data-id="' + id + '" aria-label="Kurangi" ' + (qty <= 0 ? "disabled" : "") + '>−</button>' +
      '<output aria-live="polite">' + qty + '</output>' +
      '<button type="button" data-act="inc" data-id="' + id + '" aria-label="Tambah" ' + (qty >= MAX_QTY ? "disabled" : "") + '>+</button></div>';
  }
  function summaryHTML(lines, withQty) {
    if (!lines.length) return '<p class="empty">Belum ada rasa dipilih.</p>';
    return "<ul>" + lines.map(function (l) {
      var p = getProduct(l.id);
      return "<li><span>" + p.name + " × " + l.qty + "</span><strong>" + formatRupiah(l.qty * p.price) + "</strong></li>";
    }).join("") + "</ul>";
  }
  function validateAddress(wrap, input, errEl) {
    var v = input.value.trim();
    if (v && v.length < 10) { setError(wrap, errEl, "Alamat terlalu singkat. Tulis jalan, RT/RW, dan kecamatan, atau kosongkan."); input.focus(); return false; }
    setError(wrap, errEl, ""); return true;
  }

  /* ---------- order.html ---------- */
  function initOrder() {
    var qty = {}; PRODUCTS.forEach(function (p) { qty[p.id] = 0; });
    var preset = new URLSearchParams(location.search).get("add");
    if (preset && qty.hasOwnProperty(preset)) qty[preset] = 1;

    var list = el("order-list"), sumBox = el("summary-items"), total = el("subtotal"), btn = el("wa-order");
    var addr = el("address"), addrWrap = el("address-field"), addrErr = el("address-error"), orderErr = el("order-error");

    list.innerHTML = PRODUCTS.map(function (p) {
      return '<div class="card order-row" style="--flavor:' + p.color + '"><img data-img="' + p.id + '" alt="' + p.name + '" width="88" height="88">' +
        '<div><h3 class="t-h3">' + p.name + '</h3><p class="small muted">' + formatRupiah(p.price) + ' per rasa</p></div>' +
        '<div data-qty="' + p.id + '"></div></div>';
    }).join("");
    document.dispatchEvent(new Event("mauz:hydrate"));

    function lines() { return PRODUCTS.filter(function (p) { return qty[p.id] > 0; }).map(function (p) { return { id: p.id, qty: qty[p.id] }; }); }
    function render() {
      PRODUCTS.forEach(function (p) { list.querySelector('[data-qty="' + p.id + '"]').innerHTML = qtyHTML(p.id, qty[p.id]); });
      var l = lines(); sumBox.innerHTML = summaryHTML(l); total.textContent = formatRupiah(subtotalOf(l));
      if (l.length) setError(null, orderErr, "");
    }
    list.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      qty[b.dataset.id] = clamp(qty[b.dataset.id] + (b.dataset.act === "inc" ? 1 : -1)); render();
    });
    btn.addEventListener("click", function () {
      var l = lines();
      if (!l.length) { setError(null, orderErr, "Pilih minimal satu rasa sebelum memesan."); return; }
      if (!validateAddress(addrWrap, addr, addrErr)) return;
      window.open(whatsappUrl(buildMessage(l, { name: el("cust-name").value.trim(), address: addr.value.trim() })), "_blank", "noopener");
    });
    render();
  }

  /* ---------- build-your-box.html ---------- */
  function initBox() {
    var size = 2, picked = []; // picked = [{id, qty}] in selection order
    var grid = el("pick-grid"), sizeBar = el("size-picker"), sumBox = el("box-summary"), total = el("subtotal");
    var hint = el("box-hint"), err = el("box-error"), btn = el("wa-box"), addr = el("address"), addrWrap = el("address-field"), addrErr = el("address-error");

    grid.innerHTML = PRODUCTS.map(function (p) {
      return '<button type="button" class="card product-card pick" data-pick="' + p.id + '" aria-pressed="false" style="--flavor:' + p.color + '">' +
        '<div class="media"><span class="chip">' + p.name + '</span><img data-img="' + p.id + '" alt="" width="400" height="400"></div>' +
        '<div class="body"><span class="t-h3">' + p.name + '</span><span class="price">' + formatRupiah(p.price) + "</span></div></button>";
    }).join("");
    document.dispatchEvent(new Event("mauz:hydrate"));

    function find(id) { return picked.filter(function (x) { return x.id === id; })[0]; }
    function render() {
      sizeBar.querySelectorAll("[data-size]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.dataset.size === size)); });
      grid.querySelectorAll("[data-pick]").forEach(function (b) {
        var on = !!find(b.dataset.pick); b.setAttribute("aria-pressed", String(on));
        b.disabled = !on && picked.length >= size;
      });
      hint.textContent = "Dipilih " + picked.length + " dari " + size + " rasa";
      sumBox.innerHTML = picked.length ? "<ul>" + picked.map(function (l) {
        var p = getProduct(l.id);
        return "<li><span>" + p.name + "<br><small class='muted'>" + formatRupiah(l.qty * p.price) + "</small></span>" + qtyHTML(l.id, l.qty) + "</li>";
      }).join("") + "</ul>" : '<p class="empty">Belum ada rasa dipilih.</p>';
      total.textContent = formatRupiah(subtotalOf(picked));
      if (picked.length === size) setError(null, err, "");
    }
    sizeBar.addEventListener("click", function (e) {
      var b = e.target.closest("[data-size]"); if (!b) return;
      size = +b.dataset.size; picked = picked.slice(0, size); render();
    });
    grid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-pick]"); if (!b || b.disabled) return;
      var id = b.dataset.pick, hit = find(id);
      picked = hit ? picked.filter(function (x) { return x.id !== id; }) : picked.concat([{ id: id, qty: 1 }]);
      render();
    });
    sumBox.addEventListener("click", function (e) {
      var b = e.target.closest("[data-act]"); if (!b) return;
      var l = find(b.dataset.id), n = l.qty + (b.dataset.act === "inc" ? 1 : -1);
      l.qty = Math.max(1, Math.min(MAX_QTY, n)); render(); // minimum 1; deselect a flavor to remove it
    });
    btn.addEventListener("click", function () {
      if (picked.length !== size) { setError(null, err, "Pilih tepat " + size + " rasa dulu (baru " + picked.length + ")."); return; }
      if (!validateAddress(addrWrap, addr, addrErr)) return;
      window.open(whatsappUrl(buildMessage(picked, { title: "paket pilihan sendiri (" + size + " rasa)", address: addr.value.trim() })), "_blank", "noopener");
    });
    render();
  }

  if (page === "order") initOrder();
  if (page === "box") initBox();
})();
