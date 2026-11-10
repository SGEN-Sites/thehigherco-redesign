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
    $$('[data-hours-table] tr[data-day], [data-hours-week] [data-day]').forEach(function (tr) { tr.classList.toggle('is-today', Number(tr.getAttribute('data-day')) === s.day); });
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

  /* ---------- hero life (traffic, bird shadows, birds): pause while the hero is off screen ---------- */
  var life = $('.hero__life');
  if (life && !RM && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { life.classList.toggle('is-paused', !es[es.length - 1].isIntersecting); }).observe(life);
  }

  /* ---------- five pillars: a curved strip that turns as you scroll (desktop, motion OK) ---------- */
  var walk = $('[data-walk]');
  if (walk && !RM) {
    var wCards = $$('.walk__card', walk), wN = wCards.length, wLast = -1;
    var wCap = $('.walk__caption', walk), wCapN = $('[data-walk-n]', walk), wCapName = $('[data-walk-name]', walk), wCapLine = $('[data-walk-line]', walk);
    var wWide = function () { return window.innerWidth > 900 && window.innerHeight >= 760; };   // = the CSS media query
    var wMeasure = function () {
      walk.classList.toggle('is-live', wWide());
      walk.style.height = wWide() ? Math.round(window.innerHeight * (1 + (wN - 1) * 0.5)) + 'px' : '';
      if (!wWide()) wCards.forEach(function (c) { c.style.transform = ''; c.style.opacity = ''; c.style.zIndex = ''; });
    };
    resizeHooks.push(wMeasure); wMeasure();
    scrollHooks.push(function () {
      if (!wWide()) return;
      var r = walk.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      var p = clamp(-r.top / Math.max(1, r.height - vh), 0, 1), pos = p * (wN - 1);
      wCards.forEach(function (c, i) {
        var d = i - pos, ad = Math.abs(d), a = clamp(d, -2.2, 2.2);
        // outer edges come forward (each card turns away from the centre), the centre card sits a touch in front
        c.style.transform = 'translateX(' + (a * 106).toFixed(2) + '%) translateZ(' + (-Math.min(ad, 2.2) * 30).toFixed(1) + 'px) rotateY(' + (-a * 27).toFixed(2) + 'deg)';
        c.style.opacity = (ad <= 1 ? 1 : Math.max(0, 1 - (ad - 1) * 0.75)).toFixed(3);
        c.style.zIndex = String(100 - Math.round(ad * 10));
      });
      var k = Math.round(pos);
      if (k !== wLast) {
        wLast = k;
        var src = wCards[k];
        wCapN.textContent = $('.walk__n', src).textContent;
        wCapName.textContent = $('.walk__name', src).textContent;
        wCapLine.textContent = $('.walk__line', src).textContent;
        wCap.classList.remove('is-in'); void wCap.offsetWidth; wCap.classList.add('is-in');
      }
    });
  }

  /* ---------- founders' hands meet as their banner scrolls into view ---------- */
  var meet = $('[data-meet]');
  if (meet && !RM) {
    scrollHooks.push(function () {
      var r = meet.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom < -200 || r.top > vh + 200) return;
      // 0 while the banner's top is still below the fold; 1 once its middle reaches 45% of the screen height
      var start = vh, end = vh * 0.45 - r.height / 2;
      var p = clamp((start - r.top) / Math.max(1, start - end), 0, 1);
      meet.style.setProperty('--meet', (p * p * (3 - 2 * p)).toFixed(4));
    });
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

  /* ---------- the Flower Bar ball pit (operator, 2026-11-10: "something like [a ball-pit background] ... replaced by
     cannabis buds ... about 90 different kinds of buds and a bit bigger ... keep the magnifying glass"; then "the buds
     could not stop spinning! I should be able to magnify these buds WHILE they are floating. so it should not repel the
     cursor"). The buds float in the whole section, weightless: each drifts on its own slow current, they bump softly
     off the walls and each other and turn slowly; the cursor never pushes them, so the lens can follow a bud as it
     floats by (the lens redraws the buds under it, magnified, from the full-size atlas); a bud can be dragged and
     tossed (mouse and pen). Reduced motion: the buds hold still. Paused off screen. ---------- */
  var pit = $('[data-pit]');
  if (pit && pit.getContext) (function () {
    var sect = pit.closest('section'), zone = pit.closest('[data-lens-zone]') || pit.parentNode;
    var lens = $('[data-lens]', zone), lc = lens && $('canvas', lens);
    var ctx = pit.getContext('2d'), lx = lc && lc.getContext('2d');
    var COLS = +pit.dataset.cols, NMAX = +pit.dataset.n, RS = pit.dataset.r.split(',').map(Number);
    var CELL = +pit.dataset.cell, CELL_LO = +pit.dataset.cellLo;
    var hi = null, lo = null, hiOK = false, loOK = false, bgc = null;
    var n = 0, X, Y, VX, VY, R, RB, A, W, W0, S, PH;
    var cw = 0, ch = 0, dpr = 1, raf = 0, last = 0, clock = 0, live = false, built = false;
    var P = { x: -1e4, y: -1e4, vx: 0, vy: 0, t: 0, lens: false }, held = -1, lensT = 0;
    var Z = 2.2, DRIFT = 16, VMAX = 46, TOSS = 700, WALL = 0.6, HIT = 0.2, SPIN = 0.35;

    var get = function (src, done) { var im = new Image(); im.decoding = 'async'; im.onload = function () { done(im); }; im.src = src; return im; };
    var measure = function () {
      var r = zone.getBoundingClientRect();
      if (r.width < 80 || r.height < 80) return;              // a transient or degenerate size: keep the last state
      var w = Math.round(r.width), h = Math.round(r.height);
      if (built && (w !== cw || h !== ch)) {                 // keep the buds where they were; sizes from the new area
        var kx = w / cw, ky = h / ch, mean = Math.sqrt(0.42 * w * h / (n * Math.PI));
        for (var i = 0; i < n; i++) { X[i] *= kx; Y[i] *= ky; R[i] = mean * RB[i]; }
      }
      cw = w; ch = h; dpr = Math.min(2, window.devicePixelRatio || 1);
      pit.width = Math.round(cw * dpr); pit.height = Math.round(ch * dpr);
      if (lc) { var L = lens.offsetWidth || 170; lc.width = Math.round(L * dpr); lc.height = Math.round(L * dpr); }
      // the band's own lighting (= .fbar__media in signature.css), painted once, for the lens to magnify behind the buds
      bgc = document.createElement('canvas'); bgc.width = cw; bgc.height = ch;
      var g = bgc.getContext('2d');
      g.fillStyle = '#0E0E0E'; g.fillRect(0, 0, cw, ch);
      var glow = function (cx, cy, rx, ry, rgba) {
        g.save(); g.translate(cx, cy); g.scale(1, ry / rx);
        var gr = g.createRadialGradient(0, 0, 0, 0, 0, rx); gr.addColorStop(0, rgba); gr.addColorStop(0.7, 'rgba(14,14,14,0)');
        g.fillStyle = gr; g.fillRect(-rx, -rx, rx * 2, rx * 2); g.restore();
      };
      glow(cw * 0.32, ch * 0.45, cw * 0.6, ch * 0.5, 'rgba(63,191,160,.14)');
      glow(cw * 0.72, ch, cw * 0.55, ch * 0.45, 'rgba(183,155,101,.14)');
      var lg = g.createLinearGradient(0, 0, 0, ch * 0.24); lg.addColorStop(0, '#0E0E0E'); lg.addColorStop(1, 'rgba(14,14,14,0)');
      g.fillStyle = lg; g.fillRect(0, 0, cw, ch * 0.24);
    };
    var collide = function (soft) {
      for (var i = 0; i < n; i++) for (var j = i + 1; j < n; j++) {
        var dx = X[j] - X[i], dy = Y[j] - Y[i], rr = R[i] + R[j], d2 = dx * dx + dy * dy;
        if (d2 >= rr * rr || d2 === 0) continue;
        var d = Math.sqrt(d2), nx = dx / d, ny = dy / d, pen = (rr - d) * soft;
        var mi = R[i] * R[i], mj = R[j] * R[j];
        var wi = i === held ? 0 : j === held ? 1 : mj / (mi + mj), wj = j === held ? 0 : i === held ? 1 : mi / (mi + mj);
        X[i] -= nx * pen * wi; Y[i] -= ny * pen * wi; X[j] += nx * pen * wj; Y[j] += ny * pen * wj;
        var rvx = VX[j] - VX[i], rvy = VY[j] - VY[i], vn = rvx * nx + rvy * ny;
        if (vn < 0) {
          var ii = i === held ? 0 : 1 / mi, jj = j === held ? 0 : 1 / mj, imp = -(1 + HIT) * vn / ((ii + jj) || 1);
          VX[i] -= imp * nx * ii; VY[i] -= imp * ny * ii; VX[j] += imp * nx * jj; VY[j] += imp * ny * jj;
        }
      }
    };
    var walls = function (i) {
      var r = R[i];
      if (X[i] < r) { X[i] = r; if (VX[i] < 0) VX[i] = -VX[i] * WALL; } else if (X[i] > cw - r) { X[i] = cw - r; if (VX[i] > 0) VX[i] = -VX[i] * WALL; }
      var top = r + ch * 0.05, bot = ch - r - ch * 0.03;      // a little inside the top and bottom (the canvas fades there)
      if (Y[i] < top) { Y[i] = top; if (VY[i] < 0) VY[i] = -VY[i] * WALL; } else if (Y[i] > bot) { Y[i] = bot; if (VY[i] > 0) VY[i] = -VY[i] * WALL; }
    };
    var build = function () {
      n = cw < 700 ? 40 : cw < 1100 ? 64 : NMAX;
      X = new Float32Array(n); Y = new Float32Array(n); VX = new Float32Array(n); VY = new Float32Array(n);
      R = new Float32Array(n); RB = new Float32Array(n); A = new Float32Array(n); W = new Float32Array(n); W0 = new Float32Array(n);
      S = new Uint8Array(n); PH = new Float32Array(n);
      var ids = [], i, j, t;
      for (i = 0; i < NMAX; i++) ids.push(i);
      for (i = ids.length - 1; i > 0; i--) { j = (Math.random() * (i + 1)) | 0; t = ids[i]; ids[i] = ids[j]; ids[j] = t; }
      // sizes: together the buds cover about 42% of the (now shorter) section; each 0.8x-1.2x the mean
      var mean = Math.sqrt(0.42 * cw * ch / (n * Math.PI));
      for (i = 0; i < n; i++) {
        S[i] = ids[i]; RB[i] = 0.8 + Math.random() * 0.4; R[i] = mean * RB[i];
        X[i] = R[i] + Math.random() * Math.max(1, cw - 2 * R[i]); Y[i] = R[i] + Math.random() * Math.max(1, ch - 2 * R[i]);
        var a = Math.random() * Math.PI * 2, v = 10 + Math.random() * 22;
        VX[i] = Math.cos(a) * v; VY[i] = Math.sin(a) * v;
        A[i] = Math.random() * Math.PI * 2;
        W0[i] = (Math.random() - 0.5) * 0.24;                 // each turns slowly, at its own pace (radians a second)
        W[i] = W0[i]; PH[i] = Math.random() * 100;
      }
      for (i = 0; i < 80; i++) { collide(0.6); for (j = 0; j < n; j++) walls(j); }   // spread out before the first frame
      built = true;
    };
    var step = function (dt) {
      var i, damp = Math.pow(0.992, dt * 60);
      clock += dt;
      for (i = 0; i < n; i++) {
        if (i === held) {
          var f = 1 - Math.exp(-dt / 0.03);
          VX[i] = (P.x - X[i]) * f / dt; VY[i] = (P.y - Y[i]) * f / dt;
        } else {
          // its own slow current
          VX[i] += Math.sin(clock * 0.31 + PH[i]) * DRIFT * dt;
          VY[i] += Math.cos(clock * 0.27 + PH[i] * 1.7) * DRIFT * dt;
          var sp = Math.sqrt(VX[i] * VX[i] + VY[i] * VY[i]);
          if (sp > VMAX) { var k = Math.pow(0.97, dt * 60); VX[i] *= k; VY[i] *= k; }   // a toss slows back to a drift
          else if (sp < 6) { VX[i] += (Math.random() - 0.5) * 8 * dt; VY[i] += (Math.random() - 0.5) * 8 * dt; }
          VX[i] *= damp > 0.999 ? 1 : 1 - (1 - damp) * 0.2;
        }
        X[i] += VX[i] * dt; Y[i] += VY[i] * dt;
        W[i] += (W0[i] - W[i]) * Math.min(1, dt * 2);          // spin always settles back to its own slow turn
        if (W[i] > SPIN) W[i] = SPIN; else if (W[i] < -SPIN) W[i] = -SPIN;
        A[i] += W[i] * dt;
        walls(i);
      }
      collide(0.5);
    };
    var sprite = function (c, i, Zm, ox, oy, sheet, cell) {
      var s = S[i], D = 2 * R[i] / RS[s] * Zm, co = Math.cos(A[i]) * dpr, si = Math.sin(A[i]) * dpr;
      c.setTransform(co, si, -si, co, ox * dpr, oy * dpr);
      c.drawImage(sheet, (s % COLS) * cell, ((s / COLS) | 0) * cell, cell, cell, -D / 2, -D / 2, D, D);
    };
    var useHi = function () { return hiOK && (dpr > 1.25 || !loOK); };
    var drawLens = function () {
      if (!lx || (!hiOK && !loOK)) return;
      var L = lens.offsetWidth || 170, h = L / 2, sheet = hiOK ? hi : lo, cell = hiOK ? CELL : CELL_LO, reach = h / Z;
      lx.setTransform(1, 0, 0, 1, 0, 0); lx.fillStyle = '#0E0E0E'; lx.fillRect(0, 0, lc.width, lc.height);
      if (bgc) lx.drawImage(bgc, P.x - reach, P.y - reach, reach * 2, reach * 2, 0, 0, lc.width, lc.height);
      for (var i = 0; i < n; i++) {
        var dx = X[i] - P.x, dy = Y[i] - P.y, rr = reach + R[i] * 1.7;
        if (dx * dx + dy * dy <= rr * rr) sprite(lx, i, Z, h + dx * Z, h + dy * Z, sheet, cell);
      }
    };
    var draw = function () {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, pit.width, pit.height);
      if (!hiOK && !loOK) return;
      var sheet = useHi() ? hi : lo, cell = useHi() ? CELL : CELL_LO;
      for (var i = 0; i < n; i++) sprite(ctx, i, 1, X[i], Y[i], sheet, cell);
      if (P.lens) drawLens();
    };
    var frame = function (t) {
      raf = 0;
      var dt = Math.min(0.05, last ? (t - last) / 1000 : 1 / 60), sub = Math.max(1, Math.ceil(dt * 120));
      last = t;
      for (var k = 0; k < sub; k++) step(dt / sub);
      draw();
      if (live) raf = requestAnimationFrame(frame);
    };
    var run = function () { if (!raf && live && built && !RM) { last = 0; raf = requestAnimationFrame(frame); } };
    var start = function () { if (built) return; measure(); build(); draw(); run(); };
    // the sprites: the half-size atlas first (enough at 1x), the full one for 2x screens and for the lens
    var loadLo = function () { if (!lo) lo = get(pit.dataset.atlasLo, function () { loOK = true; if (built) draw(); }); };
    var loadHi = function () { if (!hi) hi = get(pit.dataset.atlas, function () { hiOK = true; if (built) draw(); }); };
    new IntersectionObserver(function (es) {
      if (es[es.length - 1].isIntersecting) { loadLo(); if ((window.devicePixelRatio || 1) > 1.25) loadHi(); }
    }, { rootMargin: '800px 0px' }).observe(sect);
    new IntersectionObserver(function (es) {
      live = es[es.length - 1].isIntersecting;
      if (live) { start(); run(); } else if (raf) { cancelAnimationFrame(raf); raf = 0; }
    }, { threshold: 0.05 }).observe(sect);
    resizeHooks.push(function () { if (built) { measure(); draw(); } });

    // pointer: the lens follows it (it never pushes the buds); mouse and pen can drag a bud and toss it; a tap shows
    // the lens for a moment on touch screens
    var at = function (e) {
      var zr = zone.getBoundingClientRect(), x = e.clientX - zr.left, y = e.clientY - zr.top, now = performance.now();
      var dt = Math.max(8, now - P.t) / 1000;
      P.vx = (x - P.x) / dt; P.vy = (y - P.y) / dt; P.x = x; P.y = y; P.t = now;
      return !(e.target.closest && e.target.closest('.glass, .btn, a, button')) && x >= 0 && y >= 0 && x <= cw && y <= ch;
    };
    var showLens = function (on) {
      if (!lens) return;
      P.lens = on; lens.classList.toggle('is-on', on);
      if (on) { loadHi(); lens.style.left = P.x + 'px'; lens.style.top = P.y + 'px'; if (!raf) drawLens(); }
    };
    sect.addEventListener('pointermove', function (e) {
      if (!built) return;
      var inside = at(e);
      if (e.pointerType !== 'touch') showLens(inside || held >= 0);
    });
    sect.addEventListener('pointerleave', function () { if (held < 0) showLens(false); });
    sect.addEventListener('pointerdown', function (e) {
      if (!built || !at(e)) return;
      if (e.pointerType === 'touch' || RM) {
        showLens(true); clearTimeout(lensT); lensT = setTimeout(function () { showLens(false); }, 2600);
        return;
      }
      for (var i = n - 1; i >= 0; i--) {
        var dx = X[i] - P.x, dy = Y[i] - P.y;
        if (dx * dx + dy * dy < R[i] * R[i]) { held = i; return; }
      }
    });
    window.addEventListener('pointerup', function () {
      if (held < 0) return;
      var sp = Math.sqrt(VX[held] * VX[held] + VY[held] * VY[held]);
      if (sp > TOSS) { VX[held] *= TOSS / sp; VY[held] *= TOSS / sp; }
      held = -1;
    });
  })();

  /* ---------- the promises accordion: hover (fine pointers), focus or tap opens a panel ---------- */
  $$('[data-acc]').forEach(function (acc) {
    var ps = $$('.acc__p', acc);
    var open = function (p) { ps.forEach(function (q) { q.classList.toggle('is-open', q === p); }); };
    ps.forEach(function (p) {
      p.addEventListener('mouseenter', function () { if (FINE) open(p); });
      p.addEventListener('focusin', function () { open(p); });
      p.addEventListener('click', function () { open(p); });
    });
  });

  /* ---------- lifestyle drops: choosing a drop shows it on the plinth ---------- */
  $$('[data-drops]').forEach(function (stage) {
    var sec = stage.closest('section'), items = $$('[data-drop]', stage), btns = $$('[data-drop-btn]', sec);
    var show = function (k) {
      items.forEach(function (it) { it.classList.toggle('is-on', it.getAttribute('data-drop') === k); });
      btns.forEach(function (b) { var on = b.getAttribute('data-drop-btn') === k; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    };
    btns.forEach(function (b) {
      var k = b.getAttribute('data-drop-btn');
      b.addEventListener('click', function () { show(k); });
      b.addEventListener('mouseenter', function () { if (FINE) show(k); });
      b.addEventListener('focus', function () { show(k); });
    });
  });

  /* ---------- the Journal teaser: a feature rotator (J3) ---------- */
  $$('[data-jrot]').forEach(function (jr) {
    var feats = $$('.jrot__feat', jr), rows = $$('.jrot__row', jr), cur = 0, t = 0, seen = false, vis = false, hold = false;
    var show = function (i) {
      cur = i;
      feats.forEach(function (f, k) { f.classList.toggle('is-on', k === i); });
      rows.forEach(function (r, k) { var on = k === i; r.classList.remove('is-on'); void r.offsetWidth; r.classList.toggle('is-on', on); r.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    };
    var tick = function () { clearTimeout(t); if (RM || hold || !vis) return; t = setTimeout(function () { show((cur + 1) % feats.length); tick(); }, 5000); };
    rows.forEach(function (r, k) {
      r.addEventListener('click', function () { show(k); tick(); });
      r.addEventListener('mouseenter', function () { if (FINE) show(k); });
    });
    var pause = function () { hold = true; jr.classList.add('is-paused'); clearTimeout(t); };
    var resume = function () { hold = false; jr.classList.remove('is-paused'); show(cur); tick(); };
    jr.addEventListener('mouseenter', pause);
    jr.addEventListener('mouseleave', resume);
    jr.addEventListener('focusin', pause);
    jr.addEventListener('focusout', function (e) { if (!jr.contains(e.relatedTarget)) resume(); });
    if (RM) return;
    jr.classList.add('is-running');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        vis = es[es.length - 1].isIntersecting;
        if (vis) { show(seen ? cur : 0); seen = true; tick(); } else clearTimeout(t);
      }, { threshold: 0.4 }).observe(jr);
    } else { vis = true; tick(); }
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
