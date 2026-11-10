/* site.js — The Higher Company. Vanilla, no dependencies. Every effect is progressive: the page is complete
   without it, and prefers-reduced-motion turns the motion off. URLs are read from markup, never hard-coded. */
(function () {
  'use strict';
  var doc = document, root = doc.documentElement, body = doc.body;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { t = clamp(t, 0, 1); return 1 - Math.pow(1 - t, 3); };
  var seg = function (p, a, b) { return clamp((p - a) / (b - a), 0, 1); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* private mode */ } },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* private mode */ } }
  };
  var scrollHooks = [];
  var resizeHooks = [];

  /* ---------- store hours: live status in the store's own time zone ---------- */
  var HOURS = null;
  try { HOURS = JSON.parse(($('#thc-hours') || {}).textContent || 'null'); } catch (e) { HOURS = null; }
  function nyNow() {
    var parts = new Intl.DateTimeFormat('en-US', { timeZone: (HOURS && HOURS.tz) || 'America/New_York', weekday: 'short', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    var day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
    return { day: day, min: (Number(o.hour) % 24) * 60 + Number(o.minute) };
  }
  function toMin(t) { var a = t.split(':'); return Number(a[0]) * 60 + Number(a[1]); }
  function fmt(min) { var h = Math.floor(min / 60) % 24, m = min % 60, ap = h >= 12 ? 'PM' : 'AM', hh = h % 12 || 12; return hh + (m ? ':' + (m < 10 ? '0' : '') + m : '') + ' ' + ap; }
  function hoursStatus() {
    if (!HOURS || !HOURS.days) return null;
    var now = nyNow(), d = HOURS.days[now.day];
    var open = toMin(d.open), close = toMin(d.close);
    var range = fmt(open) + ' – ' + fmt(close);
    if (now.min >= open && now.min < close) return { open: true, label: 'Open now · until ' + fmt(close), today: 'Today ' + range, range: range, day: now.day };
    if (now.min < open) return { open: false, label: 'Closed · opens ' + fmt(open), today: 'Today ' + range, range: range, day: now.day };
    var n = HOURS.days[(now.day + 1) % 7];
    return { open: false, label: 'Closed · opens ' + fmt(toMin(n.open)) + ' tomorrow', today: 'Today ' + range, range: range, day: now.day };
  }
  function paintHours() {
    var s = hoursStatus(); if (!s) return;
    $$('[data-open-label]').forEach(function (el) { el.textContent = s.label; });
    $$('[data-open-dot]').forEach(function (el) { el.classList.toggle('is-open', s.open); el.classList.toggle('is-closed', !s.open); });
    $$('[data-hours-today]').forEach(function (el) { el.textContent = s.today; });
    $$('[data-hours-short]').forEach(function (el) { el.textContent = s.range; });
    $$('[data-hours-table] tr[data-day]').forEach(function (tr) { tr.classList.toggle('is-today', Number(tr.getAttribute('data-day')) === s.day); });
  }
  paintHours();
  setInterval(paintHours, 60000);

  /* ---------- 21+ gate: one screen, two "yes" answers (order ahead / shop in store), remembered ---------- */
  var gate = $('[data-gate]');
  var gateOpen = false;
  var inertTargets = function () { return $$('body > :not([data-gate]):not(script):not(.skip)'); };
  function trap(container, e) {
    if (e.key !== 'Tab') return;
    var f = $$('a[href], button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])', container).filter(function (x) { return x.offsetParent !== null; });
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (gate && root.classList.contains('age-pending')) {
    gate.hidden = false; gateOpen = true;
    inertTargets().forEach(function (el) { el.setAttribute('inert', ''); });
    var firstYes = $('[data-gate-yes]', gate);
    setTimeout(function () { firstYes && firstYes.focus(); }, 60);
    gate.addEventListener('keydown', function (e) { trap(gate, e); if (e.key === 'Escape') e.preventDefault(); });
    $$('[data-gate-yes]', gate).forEach(function (b) {
      b.addEventListener('click', function () {
        var mode = b.getAttribute('data-gate-yes');
        store.set('thc-age', '1'); store.set('thc-mode', mode);
        root.setAttribute('data-mode', mode);
        root.classList.remove('age-pending');
        gate.hidden = true; gateOpen = false;
        inertTargets().forEach(function (el) { el.removeAttribute('inert'); });
        var main = $('#main'); if (main) main.focus({ preventScroll: true });
        doc.dispatchEvent(new CustomEvent('thc:age'));
      });
    });
    var no = $('[data-gate-no]', gate);
    if (no) no.addEventListener('click', function () {
      $('[data-gate-ask]', gate).hidden = true;
      var d = $('[data-gate-denied]', gate); d.hidden = false; d.focus();
    });
  } else if (gate) { gate.hidden = true; }

  /* ---------- header: scrolled state, mega / dropdown toggles ---------- */
  var hdr = $('[data-header]');
  scrollHooks.push(function () { if (hdr) hdr.classList.toggle('is-scrolled', (window.scrollY || 0) > 8); });
  function closeMegas(except) {
    $$('[data-mega-toggle]').forEach(function (t) {
      if (t === except) return;
      t.setAttribute('aria-expanded', 'false');
      t.parentElement.classList.remove('is-open');
    });
    if (hdr) hdr.classList.toggle('is-open', !!except);
  }
  $$('[data-mega-toggle]').forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = t.getAttribute('aria-expanded') !== 'true';
      closeMegas(open ? t : null);
      t.setAttribute('aria-expanded', String(open));
      t.parentElement.classList.toggle('is-open', open);
    });
  });
  doc.addEventListener('click', function (e) { if (!e.target.closest('[data-nav-item]')) closeMegas(null); });
  doc.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openT = $('[data-mega-toggle][aria-expanded="true"]');
    if (openT) { closeMegas(null); openT.focus(); }
  });

  /* ---------- drawer ---------- */
  var drawer = $('[data-drawer]'), opener = $('[data-drawer-open]');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.hidden = !open;
    body.classList.toggle('drawer-open', open);
    if (opener) opener.setAttribute('aria-expanded', String(open));
    if (open) { var x = $('[data-drawer-close]', drawer); x && x.focus(); } else if (opener) opener.focus();
    syncBar();
  }
  if (drawer) {
    opener && opener.addEventListener('click', function () { setDrawer(true); });
    $('[data-drawer-close]', drawer).addEventListener('click', function () { setDrawer(false); });
    drawer.addEventListener('click', function (e) { if (e.target === drawer) setDrawer(false); });
    drawer.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); trap(drawer, e); });
    $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { body.classList.remove('drawer-open'); }); });
  }

  /* ---------- sticky quick-action bar ---------- */
  var bar = $('[data-bar]');
  var syncBar = function () {};
  if (bar) {
    var main = $('#main');
    var hero = (main && ($('[data-hero]', main) || main.firstElementChild));
    var foot = $('[data-footer]');
    var dismissed = store.sget('thc-bar-x') === '1';
    var past = false, footIn = false, typing = false, shown = false, barH = 0, stack = '';
    var readPast = function () {
      if (hero && hero.isConnected) { var r = hero.getBoundingClientRect(); past = r.bottom < window.innerHeight * 0.3; }
      else past = (window.scrollY || 0) > window.innerHeight * 0.8;
    };
    var setStack = function () { var v = shown ? (barH + 16) + 'px' : '0px'; if (v !== stack) { stack = v; root.style.setProperty('--bottom-stack', v); } };
    syncBar = function () {
      readPast();
      var on = !dismissed && past && !footIn && !typing && !body.classList.contains('drawer-open') && !root.classList.contains('age-pending') && !gateOpen;
      if (on !== shown) {
        shown = on; bar.classList.toggle('is-visible', on);
        if (on && !barH) barH = bar.offsetHeight;
        setStack();
      }
    };
    scrollHooks.push(syncBar);
    resizeHooks.push(function () { barH = bar.offsetHeight || barH; setStack(); syncBar(); });
    if (foot && 'IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { footIn = es[es.length - 1].isIntersecting; syncBar(); }, { rootMargin: '0px 0px 60px 0px' }).observe(foot);
    }
    var TYPING = 'input:not([type=checkbox]):not([type=radio]):not([type=button]):not([type=submit]), textarea, select, [contenteditable="true"]';
    doc.addEventListener('focusin', function (e) { if (e.target && e.target.matches && e.target.matches(TYPING)) { typing = true; syncBar(); } });
    doc.addEventListener('focusout', function () { typing = false; setTimeout(syncBar, 80); });
    var x = $('[data-bar-close]', bar);
    x && x.addEventListener('click', function () { dismissed = true; store.sset('thc-bar-x', '1'); syncBar(); });
    doc.addEventListener('thc:age', syncBar);
    barH = bar.offsetHeight;
  }

  /* ---------- reveal ---------- */
  var reveals = $$('[data-reveal]');
  if (!('IntersectionObserver' in window) || RM) { root.classList.add('reveal-all'); }
  else {
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rio.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { rio.observe(el); });
    setTimeout(function () { reveals.forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-in'); }); }, 2500);
    window.addEventListener('beforeprint', function () { root.classList.add('reveal-all'); });
  }

  /* ---------- parallax depth, hero exit, scene scrub (desktop, motion OK) ---------- */
  var depthEls = (!RM && FINE) ? $$('[data-depth]') : [];
  var heroEl = $('[data-hero]');
  var scrubs = $$('[data-night]');
  scrollHooks.push(function () {
    var vh = window.innerHeight;
    if (window.innerWidth > 900) {
      depthEls.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        var d = Number(el.getAttribute('data-depth')) || 0;
        var off = ((r.top + r.height / 2) - vh / 2) * d * -0.35;
        el.style.setProperty('--py', off.toFixed(1) + 'px');
      });
    }
    if (heroEl && !RM) {
      var hp = clamp((window.scrollY || 0) / Math.max(1, heroEl.offsetHeight * 0.9), 0, 1);
      heroEl.style.setProperty('--hp', hp.toFixed(3));
    }
    if (!RM) scrubs.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.setProperty('--sp', clamp((vh - r.top) / vh, 0, 1).toFixed(3));
    });
  });

  /* ---------- pointer light, tilt + glint, magnetic buttons (fine pointers only) ---------- */
  if (FINE && !RM) {
    $$('[data-spot]').forEach(function (sec) {
      var raf = 0, ev = null;
      sec.addEventListener('pointermove', function (e) {
        ev = e; if (raf) return;
        raf = requestAnimationFrame(function () {
          raf = 0; var r = sec.getBoundingClientRect();
          sec.style.setProperty('--mx', (ev.clientX - r.left).toFixed(0) + 'px');
          sec.style.setProperty('--my', (ev.clientY - r.top).toFixed(0) + 'px');
        });
      });
    });
    $$('[data-tilt]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.classList.add('is-tilting');
        el.style.setProperty('--ty', ((px - 0.5) * 10).toFixed(2) + 'deg');
        el.style.setProperty('--tx', ((0.5 - py) * 8).toFixed(2) + 'deg');
        el.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        el.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
      });
      el.addEventListener('pointerleave', function () { el.classList.remove('is-tilting'); el.style.setProperty('--tx', '0deg'); el.style.setProperty('--ty', '0deg'); });
    });
    $$('[data-magnetic]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.translate = (((e.clientX - r.left) / r.width - 0.5) * 8).toFixed(1) + 'px ' + (((e.clientY - r.top) / r.height - 0.5) * 6).toFixed(1) + 'px';
      });
      b.addEventListener('pointerleave', function () { b.style.translate = ''; });
    });
  }

  /* ---------- the monogram builds itself as you scroll ---------- */
  var mb = $('[data-mbuild]');
  if (mb && !RM && 'requestAnimationFrame' in window) {
    mb.classList.add('is-live');
    var outline = $('[data-mb-outline]', mb), parts = {}, leafG = $('[data-mb-leaf]', mb), wordG = $('[data-mb-word]', mb), rail = $('[data-mb-rail]', mb);
    $$('[data-mb-part]', mb).forEach(function (g) { parts[g.getAttribute('data-mb-part')] = g; });
    var items = $$('.pillars__item', mb);
    var len = 0; try { len = outline.getTotalLength(); } catch (e) { len = 6000; }
    outline.style.strokeDasharray = len; outline.style.strokeDashoffset = len;
    var FROM = { t: [-300, 60, -16], h: [0, -300, 10], c: [0, 320, 16] };
    var WIN = { t: [0.10, 0.40], h: [0.22, 0.52], c: [0.34, 0.64] };
    var last = -1;
    var paintMb = function () {
      var r = mb.getBoundingClientRect();
      var p = clamp(-r.top / Math.max(1, r.height - window.innerHeight), 0, 1);
      if (Math.abs(p - last) < 0.0015) return; last = p;
      var o = ease(seg(p, 0, 0.26));
      outline.style.strokeDashoffset = (len * (1 - o)).toFixed(1);
      outline.style.opacity = (p < 0.7 ? Math.min(1, o * 1.4) : 1 - seg(p, 0.7, 0.82)).toFixed(3);
      Object.keys(parts).forEach(function (k) {
        var t = ease(seg(p, WIN[k][0], WIN[k][1])), f = FROM[k];
        parts[k].style.opacity = t.toFixed(3);
        parts[k].style.transform = 'translate(' + (f[0] * (1 - t)).toFixed(1) + 'px,' + (f[1] * (1 - t)).toFixed(1) + 'px) rotate(' + (f[2] * (1 - t)).toFixed(2) + 'deg)';
      });
      var l = ease(seg(p, 0.6, 0.78));
      leafG.style.opacity = l.toFixed(3);
      leafG.style.transform = 'scale(' + (0.2 + 0.8 * l).toFixed(3) + ') rotate(' + (-120 * (1 - l)).toFixed(1) + 'deg)';
      var w = ease(seg(p, 0.7, 0.9));
      wordG.style.clipPath = 'inset(0 ' + ((1 - w) * 100).toFixed(1) + '% 0 0)';
      wordG.style.opacity = Math.min(1, w * 3).toFixed(3);
      mb.classList.toggle('is-done', p > 0.93);
      var idx = Math.min(items.length - 1, Math.floor(p * (items.length + 0.4)));
      items.forEach(function (li, i) { li.classList.toggle('is-on', i <= idx); });
      rail && mb.style.setProperty('--mbp', p.toFixed(3));
    };
    $$('.mbuild__part, .mbuild__leaf, .mbuild__word', mb).forEach(function (g) { g.style.transformBox = 'fill-box'; g.style.transformOrigin = 'center'; });
    scrollHooks.push(paintMb);
  }

  /* ---------- 3D monogram: drag / arrow keys to turn; it sways on its own while on screen ---------- */
  $$('[data-m3d]').forEach(function (m) {
    var rx = 6, ry = -24, vx = 0, vy = 0, drag = false, lx = 0, ly = 0, t0 = performance.now(), visible = false, raf = 0, idleAt = 0;
    var apply = function () { m.style.setProperty('--rx', rx.toFixed(2) + 'deg'); m.style.setProperty('--ry', ry.toFixed(2) + 'deg'); };
    apply();
    var loop = function (now) {
      raf = 0;
      if (!drag) {
        if (Math.abs(vy) > 0.02 || Math.abs(vx) > 0.02) { ry += vy; rx = clamp(rx + vx, -24, 24); vy *= 0.94; vx *= 0.9; idleAt = now; }
        else if (!RM && now - idleAt > 1600) { var k = (now - t0) / 1000; ry += ((-24 + Math.sin(k * 0.6) * 26) - ry) * 0.03; rx += ((6 + Math.sin(k * 0.9) * 5) - rx) * 0.03; }
      }
      apply();
      if (visible && !RM) raf = requestAnimationFrame(loop);
    };
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible && !raf && !RM) raf = requestAnimationFrame(loop); }).observe(m);
    m.addEventListener('pointerdown', function (e) { drag = true; lx = e.clientX; ly = e.clientY; vx = vy = 0; m.setPointerCapture && m.setPointerCapture(e.pointerId); });
    m.addEventListener('pointermove', function (e) {
      if (!drag) return;
      var dx = e.clientX - lx, dy = e.clientY - ly; lx = e.clientX; ly = e.clientY;
      vy = dx * 0.45; vx = -dy * 0.3; ry += vy; rx = clamp(rx + vx, -24, 24); apply();
    });
    var up = function () { if (!drag) return; drag = false; idleAt = performance.now(); if (!raf && visible && !RM) raf = requestAnimationFrame(loop); };
    m.addEventListener('pointerup', up); m.addEventListener('pointercancel', up); m.addEventListener('lostpointercapture', up);
    m.addEventListener('keydown', function (e) {
      var k = e.key; if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].indexOf(k) < 0) return;
      e.preventDefault(); idleAt = performance.now() + 4000;
      if (k === 'ArrowLeft') ry -= 12; if (k === 'ArrowRight') ry += 12;
      if (k === 'ArrowUp') rx = clamp(rx + 6, -24, 24); if (k === 'ArrowDown') rx = clamp(rx - 6, -24, 24);
      apply();
    });
  });

  /* ---------- magnifier lens over macro shots ---------- */
  $$('[data-lens-zone]').forEach(function (zone) {
    var lens = $('[data-lens]', zone), img = $('img', zone); if (!lens || !img) return;
    var Z = 2.6, hideT = 0;
    var place = function (cx, cy) {
      var zr = zone.getBoundingClientRect(), ir = img.getBoundingClientRect();
      var nw = img.naturalWidth || 1, nh = img.naturalHeight || 1;
      var s = Math.max(ir.width / nw, ir.height / nh), dw = nw * s, dh = nh * s;
      var ox = (ir.width - dw) / 2 + (ir.left - zr.left), oy = (ir.height - dh) / 2 + (ir.top - zr.top);
      var x = cx - zr.left, y = cy - zr.top, L = lens.offsetWidth / 2;
      lens.style.left = x + 'px'; lens.style.top = y + 'px';
      lens.style.backgroundSize = (dw * Z).toFixed(0) + 'px ' + (dh * Z).toFixed(0) + 'px';
      lens.style.backgroundPosition = (-((x - ox) * Z - L)).toFixed(0) + 'px ' + (-((y - oy) * Z - L)).toFixed(0) + 'px';
    };
    if (FINE) {
      var target = zone.closest('section') || zone;
      target.addEventListener('pointermove', function (e) {
        var zr = zone.getBoundingClientRect();
        var inside = e.clientX >= zr.left && e.clientX <= zr.right && e.clientY >= zr.top && e.clientY <= zr.bottom && !e.target.closest('.glass, .btn, a');
        lens.classList.toggle('is-on', inside);
        if (inside) place(e.clientX, e.clientY);
      });
      target.addEventListener('pointerleave', function () { lens.classList.remove('is-on'); });
    } else {
      zone.addEventListener('click', function (e) {
        if (e.target.closest('a, button')) return;
        place(e.clientX, e.clientY); lens.classList.add('is-on');
        clearTimeout(hideT); hideT = setTimeout(function () { lens.classList.remove('is-on'); }, 2600);
      });
    }
  });

  /* ---------- background loops: desktop + motion OK + no Save-Data; pause off screen ---------- */
  var saveData = navigator.connection && navigator.connection.saveData;
  $$('video[data-loop]').forEach(function (v) {
    var sec = v.closest('section'); var ctl = sec && $('[data-vid-toggle]', sec);
    if (RM || saveData || window.innerWidth < 701) return;
    var userPaused = false, loaded = false;
    var play = function () { var p = v.play(); if (p && p.catch) p.catch(function () { /* autoplay refused; poster stays */ }); };
    v.addEventListener('playing', function () { v.classList.add('is-playing'); if (ctl) ctl.hidden = false; });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting;
        if (on && !loaded) { v.src = v.getAttribute('data-src'); loaded = true; }
        if (on && !userPaused) play(); else if (!on) v.pause();
      }, { rootMargin: '200px 0px' }).observe(v);
    }
    if (ctl) ctl.addEventListener('click', function () {
      if (v.paused) { userPaused = false; play(); ctl.setAttribute('aria-pressed', 'false'); $('.sr-only', ctl).textContent = 'Pause the background film'; }
      else { userPaused = true; v.pause(); ctl.setAttribute('aria-pressed', 'true'); $('.sr-only', ctl).textContent = 'Play the background film'; }
    });
  });

  /* ---------- click-to-load YouTube and map ---------- */
  $$('[data-yt]').forEach(function (box) {
    var b = $('[data-yt-play]', box); if (!b) return;
    b.addEventListener('click', function () {
      var f = doc.createElement('iframe');
      f.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(box.getAttribute('data-yt')) + '?autoplay=1&rel=0&playsinline=1';
      f.title = box.getAttribute('data-yt-title') || 'Video';
      f.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      f.setAttribute('allowfullscreen', '');
      box.innerHTML = ''; box.appendChild(f); f.focus();
    });
  });
  $$('[data-map]').forEach(function (box) {
    var b = $('[data-map-load]', box); if (!b) return;
    b.addEventListener('click', function () {
      var f = doc.createElement('iframe');
      f.src = box.getAttribute('data-map'); f.title = 'Map: The Higher Company, 123 E Willow St, Syracuse';
      f.loading = 'lazy'; f.referrerPolicy = 'no-referrer-when-downgrade';
      box.appendChild(f); box.classList.add('is-loaded');
    });
  });

  /* ---------- the live menu: drop the loading panel once the embed has rendered ---------- */
  $$('[data-menu]').forEach(function (frame) {
    var done = function () { frame.classList.add('is-loaded'); };
    var watch = function () {
      var f = $('iframe', frame);
      if (f) { f.addEventListener('load', function () { setTimeout(done, 300); }); setTimeout(done, 4000); return true; }
      return false;
    };
    if (!watch() && 'MutationObserver' in window) {
      var mo = new MutationObserver(function () { if (watch()) mo.disconnect(); });
      mo.observe(frame, { childList: true, subtree: true });
    }
    setTimeout(function () {
      if (!$('iframe', frame)) { var l = $('[data-menu-loading]', frame); if (l) l.innerHTML = '<span>The live menu is taking a while. <a href="' + location.href + '">Reload the page</a>, or call <a href="tel:+13158707140">315-870-7140</a>.</span>'; l && (l.style.pointerEvents = 'auto'); }
    }, 15000);
  });

  /* ---------- forms: open the visitor's email app with a pre-filled message to the store ---------- */
  $$('form[data-mailto-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var to = (form.getAttribute('action') || '').replace(/^mailto:/, '').split('?')[0];
      var lines = [];
      $$('input, textarea', form).forEach(function (f) {
        if (!f.name) return;
        var label = (form.querySelector('label[for="' + f.id + '"]') || {}).textContent || f.name;
        lines.push(label.trim() + ': ' + (f.type === 'checkbox' ? (f.checked ? 'yes' : 'no') : f.value.trim()));
      });
      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent(form.getAttribute('data-subject') || 'Website') + '&body=' + encodeURIComponent(lines.join('\n'));
      var st = $('[data-form-status]', form);
      if (st) st.textContent = 'Your email app should open with the message ready to send. If it didn’t, email ' + to + ' directly.';
    });
  });

  /* ---------- count-up numbers ---------- */
  if (!RM && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, n = Number(el.getAttribute('data-count')), t0 = performance.now();
        var step = function (now) { var t = ease((now - t0) / 1600); el.textContent = String(Math.round(n * t)); if (t < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    $$('[data-count]').forEach(function (el) { cio.observe(el); });
  }

  /* ---------- article contents: mark the section in view ---------- */
  var toc = $$('.art__toc a');
  var tocObs = toc.length && 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { toc.forEach(function (a) { a.classList.toggle('is-on', a.getAttribute('href') === '#' + e.target.id); }); } });
  }, { rootMargin: '-30% 0px -60% 0px' }) : null;
  if (tocObs) toc.forEach(function (a) { var s = doc.getElementById(a.getAttribute('href').slice(1)); s && tocObs.observe(s); });

  /* ---------- one rAF-throttled scroll loop for everything above ---------- */
  var ticking = false;
  var onScroll = function () { if (ticking) return; ticking = true; requestAnimationFrame(function () { ticking = false; scrollHooks.forEach(function (f) { f(); }); }); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { resizeHooks.forEach(function (f) { f(); }); onScroll(); }, { passive: true });
  onScroll();
})();
