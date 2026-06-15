/* Admin CMS — router, renderers, interactions */
(function () {
  "use strict";
  var I = window.ICONS, DB = window.DB, R = window.RESOURCES;
  var app = document.getElementById("app");
  var ic = function (n) { return I[n] || ""; };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---- Theme ---- */
  var THEME_KEY = "naufal_admin_theme";
  function applyTheme(t) { document.documentElement.setAttribute("data-theme", t); }
  var storedTheme = null; try { storedTheme = localStorage.getItem(THEME_KEY); } catch (e) {}
  applyTheme(storedTheme || "light");
  function toggleTheme() {
    var n = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(n); try { localStorage.setItem(THEME_KEY, n); } catch (e) {}
    render();
  }

  /* ---- Auth (mock) ---- */
  var AUTH_KEY = "naufal_admin_auth";
  function isAuthed() { try { return localStorage.getItem(AUTH_KEY) === "1"; } catch (e) { return false; } }
  function setAuthed(v) { try { v ? localStorage.setItem(AUTH_KEY, "1") : localStorage.removeItem(AUTH_KEY); } catch (e) {} }

  /* ---- Toast ---- */
  function toast(msg, type) {
    var wrap = document.getElementById("toastWrap");
    if (!wrap) { wrap = document.createElement("div"); wrap.id = "toastWrap"; wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
    var t = document.createElement("div");
    t.className = "toast" + (type === "err" ? " err" : "");
    t.innerHTML = '<span class="ti">' + ic(type === "err" ? "trash" : "check") + "</span><span>" + esc(msg) + "</span>";
    wrap.appendChild(t);
    setTimeout(function () { t.style.opacity = "0"; t.style.transform = "translateY(8px)"; t.style.transition = "all .3s"; setTimeout(function () { t.remove(); }, 320); }, 2600);
  }

  /* ---- Router ---- */
  function parseHash() {
    var h = (location.hash || "#/dashboard").replace(/^#\//, "");
    return h.split("/").filter(Boolean);
  }
  window.addEventListener("hashchange", render);

  function nav(path) { location.hash = path; }
  window.adminNav = nav;

  /* ---- Sidebar nav model ---- */
  var NAV = [
    { group: "Ringkasan", items: [{ slug: "dashboard", label: "Dashboard", icon: "dashboard" }] },
    { group: "Konten", items: [
      { slug: "hero", label: "Hero / Profil", icon: "hero" },
      { slug: "skills", label: "Skills", icon: "skills" },
      { slug: "projects", label: "Projects", icon: "projects" },
      { slug: "experiences", label: "Experience", icon: "experience" },
      { slug: "education", label: "Education", icon: "education" },
      { slug: "certificates", label: "Certificates", icon: "certificates" },
      { slug: "services", label: "Services", icon: "services" },
    ]},
    { group: "Komunikasi", items: [{ slug: "contacts", label: "Contacts", icon: "contacts" }] },
    { group: "Akun", items: [{ slug: "profile", label: "Profil & Pengaturan", icon: "profile" }] },
  ];

  function countFor(slug) {
    if (R[slug]) return DB[R[slug].store].length;
    return null;
  }

  function sidebar(active) {
    var groups = NAV.map(function (g) {
      var links = g.items.map(function (it) {
        var cnt = countFor(it.slug);
        return '<a class="sb-link ' + (active === it.slug ? "active" : "") + '" href="#/' + it.slug + '">' +
          ic(it.icon) + "<span>" + it.label + "</span>" +
          (cnt != null ? '<span class="count">' + cnt + "</span>" : "") + "</a>";
      }).join("");
      return '<div class="sb-group"><div class="sb-group-label">' + g.group + "</div>" + links + "</div>";
    }).join("");
    return '<aside class="sidebar" id="sidebar">' +
      '<div class="sb-brand"><span class="sb-mark">N</span><div><div class="t">Naufal CMS</div><div class="s">portfolio admin</div></div></div>' +
      '<nav class="sb-nav">' + groups + "</nav>" +
      '<div class="sb-foot">' +
        '<a class="sb-link" href="Portfolio.html" target="_blank">' + ic("globe") + "<span>Lihat situs</span>" + ic("external") + "</a>" +
        '<div class="sb-user" onclick="adminNav(\'/profile\')"><span class="sb-ava">N</span><div style="flex:1;min-width:0"><div class="n">Naufal Ma\'ruf</div><div class="e">admin@naufal.dev</div></div>' + ic("logout").replace("currentColor", "currentColor") + "</div>" +
      "</div></aside>" +
      '<div class="sb-scrim" id="sbScrim" onclick="document.getElementById(\'sidebar\').classList.remove(\'open\');this.classList.remove(\'show\')"></div>';
  }

  function topbar(crumbs) {
    var theme = document.documentElement.getAttribute("data-theme");
    var cr = crumbs.map(function (c, i) {
      var last = i === crumbs.length - 1;
      return (i > 0 ? '<span class="sep">/</span>' : "") +
        (last ? '<span class="cur">' + esc(c.label) + "</span>" : '<a href="' + (c.href || "#") + '">' + esc(c.label) + "</a>");
    }).join("");
    return '<header class="topbar">' +
      '<button class="icon-btn sb-toggle" onclick="document.getElementById(\'sidebar\').classList.add(\'open\');document.getElementById(\'sbScrim\').classList.add(\'show\')">' + ic("menu") + "</button>" +
      '<div class="crumb">' + cr + "</div>" +
      '<div class="topbar-spacer"></div>' +
      '<div class="search"><span style="width:16px;height:16px;display:grid">' + ic("search") + '</span><input placeholder="Cari apa saja..." /><kbd>⌘K</kbd></div>' +
      '<button class="icon-btn" title="Notifikasi">' + ic("bell") + '<span class="badge-dot"></span></button>' +
      '<button class="icon-btn" id="themeBtn" title="Ganti tema">' + ic(theme === "dark" ? "sun" : "moon") + "</button>" +
      "</header>";
  }

  function shell(active, crumbs, content) {
    return '<div class="app">' + sidebar(active) +
      '<div class="main">' + topbar(crumbs) + '<div class="content">' + content + "</div></div></div>";
  }

  /* ================= LOGIN ================= */
  function renderLogin() {
    var theme = document.documentElement.getAttribute("data-theme");
    app.innerHTML =
      '<div class="login">' +
      '<div class="login-aside"><span class="glow g1"></span><span class="glow g2"></span>' +
        '<div class="login-brand"><span class="sb-mark" style="width:40px;height:40px;font-size:20px">N</span><div><div class="t" style="font-family:var(--font-display);font-weight:600;color:var(--text)">Naufal CMS</div><div class="s" style="font-family:var(--font-mono);font-size:11px;color:var(--muted)">portfolio admin</div></div></div>' +
        '<div class="login-hero"><h1>Kelola portfolio Anda<br/><span class="accent">tanpa sentuh kode.</span></h1>' +
          "<p>Panel admin untuk memperbarui proyek, skill, sertifikat, layanan, dan konten lain secara langsung.</p>" +
          '<div class="login-feats">' +
            '<div class="login-feat"><span class="fi">' + ic("projects") + "</span>Kelola proyek &amp; studi kasus</div>" +
            '<div class="login-feat"><span class="fi">' + ic("certificates") + "</span>Perbarui prestasi &amp; sertifikat</div>" +
            '<div class="login-feat"><span class="fi">' + ic("shield") + "</span>Aman dengan autentikasi admin</div>" +
          "</div></div>" +
        '<div class="login-foot">© 2026 Naufal Ma\'ruf Ashrori · Laravel + React</div>' +
      "</div>" +
      '<div class="login-main"><form class="login-form" id="loginForm">' +
        '<div class="lf-eyebrow">// admin access</div>' +
        "<h2>Selamat datang kembali</h2>" +
        '<p class="sub">Masuk untuk mengelola konten portfolio Anda.</p>' +
        '<div class="field"><label>Email</label><input class="input" type="email" value="admin@naufal.dev" /></div>' +
        '<div class="field"><label>Kata sandi</label><div class="field-pass"><input class="input" id="loginPass" type="password" value="password" /><button class="eye" type="button" id="loginEye">' + ic("eye") + "</button></div></div>" +
        '<div class="login-row"><label class="checkbox"><input type="checkbox" checked />Ingat saya</label><a href="#/dashboard" onclick="event.preventDefault()">Lupa sandi?</a></div>' +
        '<button class="btn btn-primary" type="submit">' + ic("logout") + "Masuk ke dashboard</button>" +
        '<div class="login-hint">Demo — klik <strong>Masuk</strong> untuk melanjutkan. <button type="button" id="loginTheme" style="border:none;background:transparent;color:var(--accent);font-weight:600;cursor:pointer;font-family:inherit">Ganti tema</button></div>' +
      "</form></div></div>";

    document.getElementById("loginForm").addEventListener("submit", function (e) {
      e.preventDefault(); setAuthed(true); nav("/dashboard");
    });
    document.getElementById("loginEye").addEventListener("click", function () {
      var p = document.getElementById("loginPass");
      var show = p.type === "password"; p.type = show ? "text" : "password";
      this.innerHTML = ic(show ? "eyeoff" : "eye");
    });
    document.getElementById("loginTheme").addEventListener("click", toggleTheme);
  }

  /* ================= DASHBOARD ================= */
  function renderDashboard() {
    var stats = [
      { k: DB.projects.length, l: "Total Proyek", icon: "projects", trend: "+2 bln ini", slug: "projects" },
      { k: DB.skills.length, l: "Skills", icon: "skills", trend: "aktif", slug: "skills" },
      { k: DB.certificates.length, l: "Sertifikat", icon: "certificates", trend: "+5 thn ini", slug: "certificates" },
      { k: DB.services.length, l: "Paket Layanan", icon: "services", trend: "live", slug: "services" },
    ];
    var statCards = stats.map(function (s) {
      return '<div class="card stat-card" onclick="adminNav(\'/' + s.slug + '\')" style="cursor:pointer">' +
        '<div class="stat-top"><span class="stat-ic">' + ic(s.icon) + '</span><span class="stat-trend">' + s.trend + "</span></div>" +
        '<div><div class="stat-k">' + s.k + '</div><div class="stat-l">' + s.l + "</div></div></div>";
    }).join("");

    var activities = [
      { ic: "projects", t: "Proyek <b>KeepItGrow</b> dipublikasikan", m: "Status diubah ke published", time: "2j lalu" },
      { ic: "certificates", t: "Sertifikat baru ditambahkan", m: "Medallion of Excellence Nasional 2025", time: "1h lalu" },
      { ic: "skills", t: "Skill <b>Docker</b> ditambahkan", m: "Kategori DevOps", time: "2h lalu" },
      { ic: "services", t: "Harga paket Klinik diperbarui", m: "Professional → Rp5.750.000", time: "3h lalu" },
      { ic: "hero", t: "Bio profil diperbarui", m: "Bagian hero section", time: "5h lalu" },
    ];
    var actHtml = activities.map(function (a) {
      return '<div class="activity"><span class="activity-ic">' + ic(a.ic) + '</span><div><div class="t">' + a.t + '</div><div class="m">' + a.m + '</div></div><span class="time">' + a.time + "</span></div>";
    }).join("");

    var quick = [
      { slug: "projects/new", label: "Tambah proyek baru", icon: "projects" },
      { slug: "certificates/new", label: "Tambah sertifikat", icon: "certificates" },
      { slug: "skills/new", label: "Tambah skill", icon: "skills" },
      { slug: "hero", label: "Edit hero / profil", icon: "hero" },
    ];
    var quickHtml = quick.map(function (q) {
      return '<div class="quick-link" onclick="adminNav(\'/' + q.slug + '\')">' + ic(q.icon) + '<span class="t">' + q.label + '</span><span class="arrow">' + ic("arrow") + "</span></div>";
    }).join("");

    var content =
      '<div class="page-head"><div><h1 class="page-title">Dashboard</h1><p class="page-sub">Selamat datang kembali, Naufal — berikut ringkasan portfolio Anda.</p></div>' +
      '<div class="page-actions"><a class="btn btn-ghost" href="Portfolio.html" target="_blank">' + ic("globe") + "Lihat situs</a>" +
      '<button class="btn btn-primary" onclick="adminNav(\'/projects/new\')">' + ic("plus") + "Proyek baru</button></div></div>" +
      '<div class="stat-grid">' + statCards + "</div>" +
      '<div class="dash-cols">' +
        '<div class="card"><div class="section-card-head"><h3>Aktivitas terbaru</h3><a href="#/dashboard">Semua</a></div>' + actHtml + "</div>" +
        '<div class="card"><div class="section-card-head"><h3>Aksi cepat</h3></div><div class="quick-links">' + quickHtml + "</div></div>" +
      "</div>";
    app.innerHTML = shell("dashboard", [{ label: "Dashboard" }], content);
    afterShell();
  }

  /* ================= LIST ================= */
  var listState = {};
  function renderList(slug) {
    var cfg = R[slug]; var rows = DB[cfg.store].slice();
    var st = listState[slug] || (listState[slug] = { q: "", filter: "all" });

    var filterBar = "";
    if (cfg.filter) {
      filterBar = '<div class="seg">' + cfg.filter.options.map(function (o) {
        return '<button class="' + (st.filter === o[0] ? "active" : "") + '" data-f="' + o[0] + '">' + o[1] + "</button>";
      }).join("") + "</div>";
    }

    var filtered = rows.filter(function (r) {
      if (cfg.filter && st.filter !== "all" && r[cfg.filter.key] !== st.filter) return false;
      if (st.q) {
        var hay = (r[cfg.titleKey] + " " + (r[cfg.subKey] || "")).toLowerCase();
        if (hay.indexOf(st.q.toLowerCase()) < 0) return false;
      }
      return true;
    });

    var head = cfg.columns.map(function (c) { return "<th>" + c.label + "</th>"; }).join("") + '<th style="text-align:right">Aksi</th>';

    var body = filtered.length ? filtered.map(function (r) {
      var cells = cfg.columns.map(function (c) { return "<td>" + cell(c, r, cfg) + "</td>"; }).join("");
      return '<tr onclick="adminNav(\'/' + slug + "/" + r.id + '\')" style="cursor:pointer">' + cells +
        '<td><div class="row-actions" onclick="event.stopPropagation()">' +
        '<button class="act-btn" title="Edit" onclick="adminNav(\'/' + slug + "/" + r.id + '\')">' + ic("edit") + "</button>" +
        '<button class="act-btn del" title="Hapus" onclick="adminDelete(\'' + slug + "'," + r.id + ')">' + ic("trash") + "</button>" +
        "</div></td></tr>";
    }).join("") : '<tr><td colspan="' + (cfg.columns.length + 1) + '"><div class="empty">' + ic("search") + "<div>Tidak ada data ditemukan.</div></div></td></tr>";

    var content =
      '<div class="page-head"><div><h1 class="page-title">' + cfg.label + '</h1><p class="page-sub">' + DB[cfg.store].length + " " + cfg.singular.toLowerCase() + " · klik baris untuk mengedit</p></div>" +
      '<div class="page-actions"><button class="btn btn-primary" onclick="adminNav(\'/' + slug + "/new')\">" + ic("plus") + "Tambah " + cfg.singular + "</button></div></div>" +
      '<div class="toolbar"><div class="search"><span style="width:16px;height:16px;display:grid">' + ic("search") + '</span><input id="listSearch" placeholder="Cari ' + cfg.singular.toLowerCase() + '..." value="' + esc(st.q) + '" /></div>' + filterBar + "</div>" +
      '<div class="card table-card"><div class="table-wrap"><table class="tbl"><thead><tr>' + head + "</tr></thead><tbody>" + body + "</tbody></table></div></div>";

    app.innerHTML = shell(slug, [{ label: "Dashboard", href: "#/dashboard" }, { label: cfg.label }], content);
    afterShell();

    var search = document.getElementById("listSearch");
    if (search) search.addEventListener("input", function () { st.q = this.value; var pos = this.selectionStart; renderList(slug); var s2 = document.getElementById("listSearch"); s2.focus(); s2.setSelectionRange(pos, pos); });
    document.querySelectorAll(".seg [data-f]").forEach(function (b) {
      b.addEventListener("click", function () { st.filter = this.getAttribute("data-f"); renderList(slug); });
    });
  }

  function cell(c, r, cfg) {
    var v = r[c.key];
    switch (c.type) {
      case "icon-title":
        return '<div class="cell-main"><span class="icon-chip">' + (r.icon ? '<img class="invertable" src="https://cdn.simpleicons.org/' + esc(r.icon) + '" alt="" onerror="this.style.display=\'none\'"/>' : "") + '</span><div><div class="cell-title">' + esc(v) + "</div></div></div>";
      case "thumb-title":
        return '<div class="cell-main"><span class="thumb-xs ph">' + esc(v.charAt(0)) + '</span><div><div class="cell-title">' + esc(v) + '</div><div class="cell-sub">/' + esc(r.slug) + "</div></div></div>";
      case "title-sub":
        return '<div class="cell-title">' + esc(v) + "</div>" + (r[cfg.subKey] ? '<div class="cell-sub">' + esc(r[cfg.subKey]) + "</div>" : "");
      case "tags":
        return '<div class="tags-cell">' + (v || []).slice(0, 4).map(function (t) { return '<span class="tag-mono">' + esc(t) + "</span>"; }).join("") + ((v || []).length > 4 ? '<span class="tag-mono">+' + (v.length - 4) + "</span>" : "") + "</div>";
      case "status":
        return v ? '<span class="badge published"><span class="d"></span>Aktif</span>' : '<span class="badge draft">Nonaktif</span>';
      case "status-badge":
        return v === "published" ? '<span class="badge published"><span class="d"></span>Published</span>' : '<span class="badge draft">Draft</span>';
      case "featured":
        return v ? '<span class="badge featured">★ Unggulan</span>' : '<span style="color:var(--faint)">—</span>';
      case "cert-type":
        return v === "competition" ? '<span class="badge competition">Kompetisi</span>' : '<span class="badge training">Pelatihan</span>';
      case "period":
        return '<span style="font-family:var(--font-mono);font-size:12.5px;color:var(--text-2)">' + esc(r.start) + " – " + esc(r.end) + "</span>";
      case "year":
        return '<span style="font-family:var(--font-mono);color:var(--text-2)">' + esc(v) + "</span>";
      case "price":
        return '<span style="font-family:var(--font-mono);font-weight:600;color:var(--text)">' + esc(v) + "</span>";
      case "order":
        return '<span style="display:inline-flex;align-items:center;gap:8px;color:var(--muted)"><span class="drag-h">' + ic("drag") + "</span>" + esc(v) + "</span>";
      case "mono":
        return '<span style="font-family:var(--font-mono);font-size:12.5px">' + esc(v) + "</span>";
      default:
        return esc(v);
    }
  }

  /* ================= FORM ================= */
  function renderForm(slug, id) {
    var cfg = R[slug];
    var isNew = id === "new";
    var rec = isNew ? {} : DB[cfg.store].filter(function (x) { return String(x.id) === String(id); })[0];
    if (!rec && !isNew) { nav("/" + slug); return; }
    rec = rec || {};
    var title = isNew ? "Tambah " + cfg.singular : esc(rec[cfg.titleKey] || cfg.singular);

    var fieldsHtml = cfg.fields.map(function (f) { return field(f, rec); }).join("");

    var aside =
      '<div class="card aside-card"><div class="aside-h">Publikasi</div>' +
        '<div class="toggle-row"><div><div class="tt">Tampilkan di portfolio</div><div class="ts">Tampil di situs publik</div></div>' + switchEl("pub", rec.active !== false && rec.status !== "draft") + "</div>" +
        '<div style="margin-top:16px"><button class="btn btn-primary" style="width:100%" onclick="adminSave(\'' + slug + "')\">" + ic("save") + (isNew ? "Simpan " + cfg.singular : "Simpan perubahan") + "</button></div>" +
      "</div>" +
      '<div class="card aside-card"><div class="aside-h">Informasi</div>' +
        '<div class="meta-row"><span class="k">ID</span><span class="v">' + (isNew ? "—" : "#" + rec.id) + "</span></div>" +
        '<div class="meta-row"><span class="k">Dibuat</span><span class="v">' + (isNew ? "—" : "12 Mei 2026") + "</span></div>" +
        '<div class="meta-row"><span class="k">Diperbarui</span><span class="v">' + (isNew ? "—" : "2 jam lalu") + "</span></div>" +
      "</div>" +
      (isNew ? "" : '<div class="card aside-card"><div class="aside-h">Zona berbahaya</div><p style="font-size:12.5px;color:var(--muted);margin-bottom:14px">Menghapus bersifat permanen dan tidak dapat dibatalkan.</p><button class="btn btn-danger" style="width:100%" onclick="adminDelete(\'' + slug + "'," + rec.id + ')">' + ic("trash") + "Hapus " + cfg.singular + "</button></div>");

    var content =
      '<div class="page-head"><div><div class="crumb" style="margin-bottom:10px"><a href="#/' + slug + '">' + ic("back") + " Kembali ke " + cfg.label + '</a></div><h1 class="page-title">' + title + "</h1>" +
      '<p class="page-sub">' + (isNew ? "Lengkapi detail di bawah untuk menambahkan " + cfg.singular.toLowerCase() + " baru." : "Edit detail " + cfg.singular.toLowerCase() + ".") + "</p></div></div>" +
      '<form id="adminForm" class="form-layout">' +
        '<div class="card form-card"><div class="form-section"><div class="form-section-title">' + ic(cfg.icon) + "Detail " + cfg.singular + '</div><div class="form-section-sub">Informasi utama yang akan tampil di portfolio.</div>' +
          '<div class="fgrid">' + fieldsHtml + "</div></div></div>" +
        '<div>' + aside + "</div>" +
      "</form>" +
      '<div class="form-foot"><div class="left"><span class="unsaved-dot"></span>Perubahan belum disimpan</div>' +
        '<div class="right"><button class="btn btn-ghost" onclick="adminNav(\'/' + slug + "')\">Batal</button>" +
        '<button class="btn btn-primary" onclick="adminSave(\'' + slug + "')\">" + ic("save") + "Simpan</button></div></div>";

    app.innerHTML = shell(slug, [{ label: "Dashboard", href: "#/dashboard" }, { label: cfg.label, href: "#/" + slug }, { label: isNew ? "Baru" : "Edit" }], content);
    afterShell();
    initTagInputs();
  }

  function field(f, rec) {
    var v = rec[f.key] != null ? rec[f.key] : (f.default != null ? f.default : "");
    var cls = "field" + (f.full ? " full" : "");
    var label = '<label>' + f.label + (f.req ? ' <span class="req">*</span>' : "") + "</label>";
    var hint = f.hint ? '<span class="hint">' + f.hint + "</span>" : "";
    var inputCls = "input" + (f.mono ? " input-mono" : "");
    var inner;
    switch (f.type) {
      case "textarea":
        inner = '<textarea class="textarea' + (f.mono ? " input-mono" : "") + '" placeholder="' + esc(f.placeholder || "") + '">' + esc(v) + "</textarea>"; break;
      case "select":
        var opts = (f.options || []).map(function (o) {
          var val = Array.isArray(o) ? o[0] : o, lab = Array.isArray(o) ? o[1] : o;
          return '<option ' + (String(v) === String(val) ? "selected" : "") + ' value="' + esc(val) + '">' + esc(lab) + "</option>";
        }).join("");
        inner = '<select class="select">' + opts + "</select>"; break;
      case "toggle":
        return '<div class="' + cls + '"><div class="toggle-row" style="border:none;padding:0"><div><div class="tt">' + f.label + "</div>" + (hint ? '<div class="ts">' + f.hint + "</div>" : "") + "</div>" + switchEl(f.key, !!v) + "</div></div>";
      case "tags":
        var tags = (v || []).map(function (t) { return '<span class="tag-pill">' + esc(t) + '<button type="button" onclick="this.parentElement.remove()">' + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg>' + "</button></span>"; }).join("");
        inner = '<div class="tag-input" data-taginput>' + tags + '<input type="text" placeholder="Tambah lalu Enter..." /></div>'; break;
      case "image":
        inner = '<div class="upload">' + ic("upload") + '<div class="u-t">Klik untuk unggah atau seret berkas</div><div class="u-s">PNG, JPG, atau WEBP — maks. 2MB</div></div>'; break;
      case "number":
        inner = '<input class="' + inputCls + '" type="number" value="' + esc(v) + '" placeholder="' + esc(f.placeholder || "") + '" />'; break;
      default:
        if (f.prefix) {
          inner = '<div class="input-group"><span class="prefix">' + esc(f.prefix) + '</span><input class="' + inputCls + '" type="text" value="' + esc(v) + '" placeholder="' + esc(f.placeholder || "") + '" /></div>';
        } else {
          inner = '<input class="' + inputCls + '" type="text" value="' + esc(v) + '" placeholder="' + esc(f.placeholder || "") + '" />';
        }
    }
    return '<div class="' + cls + '">' + label + inner + hint + "</div>";
  }

  function switchEl(key, on) {
    return '<label class="switch"><input type="checkbox" data-switch="' + key + '" ' + (on ? "checked" : "") + " /><span class=\"track\"></span><span class=\"knob\"></span></label>";
  }

  function initTagInputs() {
    document.querySelectorAll("[data-taginput]").forEach(function (box) {
      var input = box.querySelector("input");
      input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
          e.preventDefault();
          var val = input.value.trim(); if (!val) return;
          var pill = document.createElement("span");
          pill.className = "tag-pill";
          pill.innerHTML = esc(val) + '<button type="button"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18M6 6l12 12"/></svg></button>';
          pill.querySelector("button").addEventListener("click", function () { pill.remove(); });
          box.insertBefore(pill, input);
          input.value = "";
        } else if (e.key === "Backspace" && !input.value) {
          var pills = box.querySelectorAll(".tag-pill");
          if (pills.length) pills[pills.length - 1].remove();
        }
      });
    });
  }

  window.adminSave = function (slug) {
    nav("/" + slug);
    setTimeout(function () { toast(R[slug].singular + " berhasil disimpan"); }, 60);
  };

  window.adminDelete = function (slug, id) {
    var cfg = R[slug];
    var ov = document.createElement("div");
    ov.className = "overlay";
    ov.innerHTML = '<div class="modal"><div class="modal-ic">' + ic("trash") + "</div><h3>Hapus " + cfg.singular.toLowerCase() + "?</h3><p>Tindakan ini permanen. Data yang dihapus tidak dapat dikembalikan.</p>" +
      '<div class="modal-actions"><button class="btn btn-ghost" data-cancel>Batal</button><button class="btn btn-danger" data-confirm>' + ic("trash") + "Ya, hapus</button></div></div>";
    document.body.appendChild(ov);
    ov.addEventListener("click", function (e) { if (e.target === ov || e.target.hasAttribute("data-cancel")) ov.remove(); });
    ov.querySelector("[data-confirm]").addEventListener("click", function () {
      var arr = DB[cfg.store]; var i = arr.findIndex(function (x) { return String(x.id) === String(id); });
      if (i >= 0) arr.splice(i, 1);
      ov.remove();
      if (location.hash.indexOf("/" + slug + "/") >= 0) nav("/" + slug); else render();
      setTimeout(function () { toast(cfg.singular + " dihapus", "err"); }, 60);
    });
  };

  /* ================= HERO (singleton) ================= */
  function renderHero() {
    var h = DB.hero;
    var content =
      '<div class="page-head"><div><h1 class="page-title">Hero / Profil</h1><p class="page-sub">Bagian pertama yang dilihat pengunjung di halaman utama.</p></div>' +
      '<div class="page-actions"><button class="btn btn-primary" onclick="adminSave(\'hero\')">' + ic("save") + "Simpan perubahan</button></div></div>" +
      '<form class="form-layout">' +
        '<div class="card form-card">' +
          '<div class="form-section"><div class="form-section-title">' + ic("hero") + 'Identitas</div><div class="form-section-sub">Nama dan peran yang tampil besar di hero.</div>' +
            '<div class="fgrid"><div class="field full"><label>Nama lengkap <span class="req">*</span></label><input class="input" value="' + esc(h.name) + '" /></div>' +
            '<div class="field full"><label>Peran / headline</label><input class="input" value="' + esc(h.role) + '" /></div>' +
            '<div class="field full"><label>Badge ketersediaan</label><input class="input" value="' + esc(h.tagline) + '" /></div></div></div>' +
          '<div class="form-section"><div class="form-section-title">' + ic("profile") + 'Bio</div><div class="form-section-sub">Deskripsi singkat tentang Anda.</div>' +
            '<div class="field full"><label>Bio</label><textarea class="textarea">' + esc(h.bio) + "</textarea></div></div>" +
          '<div class="form-section"><div class="form-section-title">' + ic("link") + 'Tautan</div>' +
            '<div class="fgrid"><div class="field full"><label>URL CV / Resume</label><div class="input-group"><span class="prefix">URL</span><input class="input input-mono" value="' + esc(h.cv_url) + '" /></div></div></div></div>' +
        "</div>" +
        '<div>' +
          '<div class="card aside-card"><div class="aside-h">Foto profil</div><div class="upload-preview"><div class="ph">N</div></div><button class="btn btn-ghost btn-sm" style="width:100%;margin-top:12px">' + ic("upload") + "Ganti foto</button></div>" +
          '<div class="card aside-card"><div class="aside-h">Status</div><div class="toggle-row"><div><div class="tt">Tersedia untuk proyek</div><div class="ts">Tampilkan badge hijau</div></div>' + switchEl("avail", h.available) + "</div></div>" +
        "</div>" +
      "</form>";
    app.innerHTML = shell("hero", [{ label: "Dashboard", href: "#/dashboard" }, { label: "Hero / Profil" }], content);
    afterShell();
  }

  /* ================= PROFILE ================= */
  function renderProfile() {
    var theme = document.documentElement.getAttribute("data-theme");
    var content =
      '<div class="page-head"><div><h1 class="page-title">Profil &amp; Pengaturan</h1><p class="page-sub">Kelola akun admin dan preferensi panel.</p></div></div>' +
      '<form class="form-layout">' +
        '<div class="card form-card">' +
          '<div class="form-section"><div class="form-section-title">' + ic("profile") + 'Akun admin</div><div class="form-section-sub">Informasi login Anda.</div>' +
            '<div class="fgrid"><div class="field"><label>Nama</label><input class="input" value="Naufal Ma\'ruf Ashrori" /></div>' +
            '<div class="field"><label>Email</label><input class="input input-mono" value="admin@naufal.dev" /></div></div></div>' +
          '<div class="form-section"><div class="form-section-title">' + ic("shield") + 'Keamanan</div><div class="form-section-sub">Perbarui kata sandi secara berkala.</div>' +
            '<div class="fgrid"><div class="field"><label>Kata sandi baru</label><input class="input" type="password" value="password123" /></div>' +
            '<div class="field"><label>Konfirmasi sandi</label><input class="input" type="password" value="password123" /></div></div></div>' +
          '<div class="form-section"><div class="form-section-title">' + ic("layers") + 'Preferensi tampilan</div>' +
            '<div class="toggle-row"><div><div class="tt">Mode gelap</div><div class="ts">Tampilan panel admin</div></div><label class="switch"><input type="checkbox" id="profTheme" ' + (theme === "dark" ? "checked" : "") + ' /><span class="track"></span><span class="knob"></span></label></div>' +
            '<div class="toggle-row"><div><div class="tt">Notifikasi email</div><div class="ts">Kirim email saat ada pesan masuk</div></div>' + switchEl("notif", true) + "</div>" +
          "</div>" +
        "</div>" +
        '<div>' +
          '<div class="card aside-card"><div class="aside-h">Akun</div><div style="display:flex;align-items:center;gap:13px;margin-bottom:16px"><span class="sb-ava" style="width:48px;height:48px;font-size:20px">N</span><div><div style="font-weight:600;color:var(--text)">Naufal Ma\'ruf</div><div style="font-size:12px;color:var(--muted)">Super Admin</div></div></div>' +
            '<div class="meta-row"><span class="k">Peran</span><span class="v">Super Admin</span></div><div class="meta-row"><span class="k">Bergabung</span><span class="v">Jan 2026</span></div><div class="meta-row"><span class="k">Login terakhir</span><span class="v">Hari ini</span></div></div>' +
          '<div class="card aside-card"><div class="aside-h">Sesi</div><button class="btn btn-danger" style="width:100%" onclick="adminLogout()">' + ic("logout") + "Keluar dari akun</button></div>" +
        "</div>" +
      "</form>";
    app.innerHTML = shell("profile", [{ label: "Dashboard", href: "#/dashboard" }, { label: "Profil & Pengaturan" }], content);
    afterShell();
    var pt = document.getElementById("profTheme");
    if (pt) pt.addEventListener("change", toggleTheme);
  }

  window.adminLogout = function () { setAuthed(false); nav("/login"); };

  /* ---- post-render wiring ---- */
  function afterShell() {
    var tb = document.getElementById("themeBtn");
    if (tb) tb.addEventListener("click", toggleTheme);
  }

  /* ---- Main render ---- */
  function render() {
    var parts = parseHash();
    var top = parts[0] || "dashboard";

    if (top === "login") { renderLogin(); return; }
    if (!isAuthed()) { renderLogin(); return; }

    if (top === "dashboard") return renderDashboard();
    if (top === "hero") return renderHero();
    if (top === "profile") return renderProfile();

    if (R[top]) {
      if (parts[1]) return renderForm(top, parts[1]);
      return renderList(top);
    }
    renderDashboard();
  }

  if (!location.hash) location.hash = "#/dashboard";
  render();
})();
