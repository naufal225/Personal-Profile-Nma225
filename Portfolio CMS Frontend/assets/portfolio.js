/* Portfolio — theme toggle, nav, reveal, filters, services tabs */
(function () {
  "use strict";

  /* ---- Enable entrance animations only when JS is present ---- */
  document.documentElement.classList.add("anim");

  /* ---- Theme ---- */
  var root = document.documentElement;
  var THEME_KEY = "naufal_portfolio_theme";
  function applyTheme(t) {
    root.setAttribute("data-theme", t);
    document.querySelectorAll("[data-theme-icon]").forEach(function (el) {
      el.dataset.show = t === "dark" ? "sun" : "moon";
      el.querySelector(".ic-sun").style.display = t === "dark" ? "block" : "none";
      el.querySelector(".ic-moon").style.display = t === "dark" ? "none" : "block";
    });
  }
  var stored = null;
  try { stored = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(stored || "dark");
  function toggleTheme() {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  }
  document.querySelectorAll("[data-theme-toggle]").forEach(function (b) {
    b.addEventListener("click", toggleTheme);
  });

  /* ---- Nav scroll state + progress ---- */
  var nav = document.querySelector(".nav");
  var progress = document.querySelector(".scroll-progress");
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (nav) nav.classList.toggle("scrolled", y > 8);
    if (progress) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var menu = document.getElementById("mobileMenu");
  var toggleBtn = document.querySelector(".nav-toggle");
  if (toggleBtn && menu) {
    toggleBtn.addEventListener("click", function () { menu.classList.toggle("open"); });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () { menu.classList.remove("open"); });
    });
  }

  /* ---- Active nav link via IntersectionObserver ---- */
  var sections = document.querySelectorAll("section[id]");
  var navLinks = document.querySelectorAll("[data-nav]");

  /* Sliding active-indicator inside the desktop pill */
  var navLinksWrap = document.querySelector(".nav-pill .nav-links");
  var indicator = null;
  if (navLinksWrap) {
    indicator = document.createElement("span");
    indicator.className = "nav-indicator no-anim";
    navLinksWrap.insertBefore(indicator, navLinksWrap.firstChild);
  }
  function moveIndicator(link, animate) {
    if (!indicator || !link) return;
    var wrapRect = navLinksWrap.getBoundingClientRect();
    var linkRect = link.getBoundingClientRect();
    if (wrapRect.width === 0) { indicator.classList.remove("show"); return; }
    if (!animate) indicator.classList.add("no-anim");
    indicator.style.width = linkRect.width + "px";
    indicator.style.transform = "translateX(" + (linkRect.left - wrapRect.left) + "px)";
    indicator.classList.add("show");
    if (!animate) { void indicator.offsetWidth; indicator.classList.remove("no-anim"); }
  }
  function setActive(id, animate) {
    var current = null;
    navLinks.forEach(function (l) {
      var on = l.getAttribute("data-nav") === id;
      l.classList.toggle("active", on);
      if (on && l.closest(".nav-pill")) current = l;
    });
    if (current) moveIndicator(current, animate);
  }

  var navObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) setActive(e.target.id, true);
    });
  }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
  sections.forEach(function (s) { navObserver.observe(s); });

  // Initial position (no animation) + keep in sync on resize / font-load
  function syncIndicator() {
    var active = document.querySelector(".nav-pill .nav-link.active") || document.querySelector(".nav-pill .nav-link");
    if (active) moveIndicator(active, false);
  }
  window.addEventListener("load", syncIndicator);
  window.addEventListener("resize", syncIndicator);
  document.fonts && document.fonts.ready && document.fonts.ready.then(syncIndicator);
  setTimeout(syncIndicator, 80); /* fallback: after first paint */
  setActive("about", false);

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal");
  var revObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); revObserver.unobserve(e.target); }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  reveals.forEach(function (r) { revObserver.observe(r); });

  /* ---- Certificate filter ---- */
  var certPills = document.querySelectorAll(".cert-pill");
  var certCards = document.querySelectorAll(".cert-card");
  certPills.forEach(function (p) {
    p.addEventListener("click", function () {
      certPills.forEach(function (x) { x.classList.remove("active"); });
      p.classList.add("active");
      var f = p.getAttribute("data-filter");
      certCards.forEach(function (c) {
        var show = f === "all" || c.getAttribute("data-type") === f;
        c.classList.toggle("hidden", !show);
      });
    });
  });

  /* ---- Services tabs ---- */
  var svcTabs = document.querySelectorAll(".svc-tab");
  var svcPanels = document.querySelectorAll(".svc-panel");
  svcTabs.forEach(function (t) {
    t.addEventListener("click", function () {
      svcTabs.forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      var target = t.getAttribute("data-svc");
      svcPanels.forEach(function (panel) {
        panel.style.display = panel.getAttribute("data-svc") === target ? "grid" : "none";
      });
    });
  });
})();

/* ---- Projects carousel ---- */
(function () {
  "use strict";
  var track = document.getElementById("projTrack");
  if (!track) return;
  var viewport = document.getElementById("projViewport");
  var carousel = track.closest(".proj-carousel");
  var prevBtn = document.getElementById("projPrev");
  var nextBtn = document.getElementById("projNext");
  var dotsWrap = document.getElementById("projDots");
  var counter = document.getElementById("projCounter");
  var pages = track.children;
  var total = pages.length;
  var idx = 0;

  function pad(n) { return n < 10 ? "0" + n : "" + n; }

  // Build dots
  for (var i = 0; i < total; i++) {
    (function (n) {
      var b = document.createElement("button");
      b.className = "proj-dot" + (n === 0 ? " active" : "");
      b.setAttribute("aria-label", "Ke halaman " + (n + 1));
      b.addEventListener("click", function () { go(n); });
      dotsWrap.appendChild(b);
    })(i);
  }
  var dots = dotsWrap.children;

  function update() {
    track.style.transform = "translateX(-" + idx * 100 + "%)";
    for (var i = 0; i < dots.length; i++) dots[i].classList.toggle("active", i === idx);
    prevBtn.disabled = idx === 0;
    nextBtn.disabled = idx === total - 1;
    if (counter) counter.innerHTML = "<b>" + pad(idx + 1) + "</b> / " + pad(total);
  }
  function go(n) { idx = Math.max(0, Math.min(total - 1, n)); update(); }

  prevBtn.addEventListener("click", function () { go(idx - 1); });
  nextBtn.addEventListener("click", function () { go(idx + 1); });

  // Keyboard
  carousel.setAttribute("tabindex", "0");
  carousel.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(idx - 1); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(idx + 1); }
  });

  // Drag / swipe
  var dragging = false, startX = 0, delta = 0, moved = false;
  function down(x) { dragging = true; startX = x; delta = 0; moved = false; track.style.transition = "none"; viewport.classList.add("grabbing"); }
  function move(x) {
    if (!dragging) return;
    delta = x - startX;
    if (Math.abs(delta) > 5) moved = true;
    var pct = (delta / viewport.offsetWidth) * 100;
    track.style.transform = "translateX(calc(-" + idx * 100 + "% + " + pct + "%))";
  }
  function up() {
    if (!dragging) return;
    dragging = false;
    track.style.transition = "";
    viewport.classList.remove("grabbing");
    var threshold = viewport.offsetWidth * 0.16;
    if (delta < -threshold) go(idx + 1);
    else if (delta > threshold) go(idx - 1);
    else update();
  }
  viewport.addEventListener("pointerdown", function (e) { down(e.clientX); });
  window.addEventListener("pointermove", function (e) { if (dragging) move(e.clientX); });
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  // Block link clicks that happen right after a drag
  viewport.addEventListener("click", function (e) { if (moved) { e.preventDefault(); e.stopPropagation(); } }, true);
  viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });

  update();
})();
