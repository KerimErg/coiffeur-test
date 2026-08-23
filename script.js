/* =========================================================
   STUDIO V.O — Bischheim
   Vanilla JS. Aucune dépendance.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isReduced = function () { return reduced.matches; };

  /* ---------- 1. Séquence d'ouverture (une seule) ---------- */
  function openSequence() {
    root.classList.add('is-loaded');
  }
  if (root.classList.contains('is-seance')) {
    // la séquence d'entrée du hero est déclenchée par la fin de l'amorce
  } else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(openSequence).catch(openSequence);
    window.setTimeout(openSequence, 1200); // filet de sécurité
  } else {
    window.addEventListener('load', openSequence);
  }

  /* ---------- 2. Le raccord : la coupe se rouvre au scroll ---------- */
  var hero = document.querySelector('.hero');

  var heroSpan = 0;   // mesuré au chargement et au redimensionnement, jamais par image
  function measureHero() {
    // la coupe se rejoue vite : tout se passe sur la première moitié du hero,
    // tant que le titre est encore lisible à l'écran
    heroSpan = hero ? (hero.offsetHeight || 1) * 0.55 : 1;
  }
  function updateCut() {
    if (!hero || isReduced()) return;
    var p = Math.min(1, Math.max(0, window.scrollY / heroSpan));
    hero.style.setProperty('--cut', p.toFixed(4));
  }
  /* ---------- 3. Header ---------- */
  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-lit', window.scrollY > 40);
  }

  window.addEventListener('scroll', function () {
    requestScrollFrame();
    updateHeader();
  }, { passive: true });
  updateHeader();

  /* ---------- 3b. Menu chapitres (mobile) ---------- */
  var menuBtn = document.getElementById('menu-btn');
  var chapters = document.getElementById('chapitres');

  if (menuBtn && chapters) {
    var chapterLinks = Array.prototype.slice.call(chapters.querySelectorAll('a'));
    chapterLinks.forEach(function (a, i) { a.style.setProperty('--d', (i * 45) + 'ms'); });

    var openMenu = function () {
      chapters.hidden = false;
      document.body.style.overflow = 'hidden';
      menuBtn.setAttribute('aria-expanded', 'true');
      window.requestAnimationFrame(function () { chapters.classList.add('is-open'); });
    };
    var closeMenu = function (refocus) {
      chapters.classList.remove('is-open');
      menuBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      var hide = function () { chapters.hidden = true; };
      if (isReduced()) hide(); else window.setTimeout(hide, 300);
      if (refocus) menuBtn.focus();
    };

    menuBtn.addEventListener('click', function () {
      if (menuBtn.getAttribute('aria-expanded') === 'true') closeMenu(false);
      else { openMenu(); chapterLinks[0].focus(); }
    });
    chapterLinks.forEach(function (a) {
      a.addEventListener('click', function () { closeMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuBtn.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    // le menu n'a plus lieu d'être au-delà du point de bascule
    var wide = window.matchMedia('(min-width: 900px)');
    var onWide = function (e) { if (e.matches && menuBtn.getAttribute('aria-expanded') === 'true') closeMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- 4. Reveals au scroll ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  var bands = Array.prototype.slice.call(document.querySelectorAll('.band, .site-footer'));

  if (!('IntersectionObserver' in window) || isReduced()) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
    bands.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var seen = new WeakMap();
    var io = new IntersectionObserver(function (entries) {
      // stagger léger, calculé par salve et par section
      var batch = entries.filter(function (e) { return e.isIntersecting; });
      batch.forEach(function (entry, i) {
        var el = entry.target;
        if (!seen.has(el)) {
          seen.set(el, true);
          el.style.setProperty('--d', Math.min(i, 5) * 80 + 'ms');
          el.classList.add('is-in');
        }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

    revealables.forEach(function (el) { io.observe(el); });

    var bandIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          bandIo.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
    bands.forEach(function (el) { bandIo.observe(el); });
  }

  /* ---------- 5. Lien de nav actif ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- 6. Validation du formulaire (client) ---------- */
  var form = document.getElementById('booking');
  if (form) {
    var ok = document.getElementById('form-ok');

    // [ouverture, fermeture] en minutes, indexé par getDay() ; null = fermé
    var HOURS = [null, null, [540, 1080], [540, 1080], [600, 1200], [600, 1200], [540, 1080]];
    var DAYS = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    function hhmm(min) {
      return (min / 60 | 0) + 'h' + (min % 60 < 10 ? '0' : '') + (min % 60);
    }

    var rules = {
      name: function (v) {
        if (!v.trim()) return 'Indiquez votre nom.';
        if (v.trim().length < 2) return 'Nom trop court.';
        return '';
      },
      phone: function (v) {
        var cleaned = v.replace(/[\s.\-()]/g, '');
        if (!cleaned) return 'Un numéro nous permet de confirmer.';
        if (!/^(\+?\d{9,15})$/.test(cleaned)) return 'Numéro invalide (ex. 06 12 34 56 78).';
        return '';
      },
      service: function (v) { return v ? '' : 'Choisissez une prestation.'; },
      slot: function (v) {
        if (!v) return 'Indiquez un créneau souhaité.';
        var d = new Date(v);
        if (isNaN(d.getTime())) return 'Date invalide.';
        if (d.getTime() < Date.now()) return 'Choisissez une date à venir.';
        var open = HOURS[d.getDay()];
        if (!open) return 'Le studio est fermé le ' + DAYS[d.getDay()] + '.';
        var minutes = d.getHours() * 60 + d.getMinutes();
        // le dernier rendez-vous démarre au plus tard une demi-heure avant la fermeture
        if (minutes < open[0] || minutes > open[1] - 30) {
          return 'Le ' + DAYS[d.getDay()] + ', le studio ouvre de ' + hhmm(open[0]) + ' à ' + hhmm(open[1]) + '.';
        }
        return '';
      }
    };

    function setError(field, message) {
      var wrap = field.closest('.field');
      var box = document.getElementById('e-' + field.id.replace('f-', ''));
      if (!box || !wrap) return;
      if (message) {
        wrap.classList.add('is-bad');
        field.setAttribute('aria-invalid', 'true');
        box.textContent = message;
        box.hidden = false;
      } else {
        wrap.classList.remove('is-bad');
        field.removeAttribute('aria-invalid');
        box.textContent = '';
        box.hidden = true;
      }
    }

    function validateField(field) {
      var rule = rules[field.name];
      if (!rule) return true;
      var message = rule(field.value);
      setError(field, message);
      return !message;
    }

    Object.keys(rules).forEach(function (key) {
      var field = form.elements[key];
      if (!field) return;
      field.addEventListener('blur', function () { validateField(field); });
      field.addEventListener('input', function () {
        if (field.closest('.field').classList.contains('is-bad')) validateField(field);
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (key) {
        var field = form.elements[key];
        if (field && !validateField(field) && !firstBad) firstBad = field;
      });

      if (firstBad) {
        if (ok) ok.hidden = true;
        firstBad.focus();
        return;
      }

      var name = String(form.elements.name.value).trim().split(' ')[0];
      var service = form.elements.service.value;
      if (ok) {
        ok.textContent = 'Merci ' + name + '. Votre demande pour « ' + service +
          ' » est enregistrée : nous vous rappelons au 03 88 19 99 52 sous 24 h ouvrées pour confirmer le créneau.';
        ok.hidden = false;
      }
      form.reset();
    });
  }

  /* =========================================================
     V2 — CINÉMA
     Un seul rAF pour tout ce qui suit le scroll ou la souris.
     ========================================================= */

  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wide = window.matchMedia('(min-width: 900px)');

  /* ---------- A. Ouverture de séance ---------- */
  (function () {
    var amorce = document.getElementById('amorce');
    if (!amorce) return;
    if (!root.classList.contains('is-seance')) { amorce.remove(); return; }

    var count = document.getElementById('amorce-count');
    var skip = document.getElementById('amorce-skip');
    var timers = [];
    var closed = false;

    function close() {
      if (closed) return;
      closed = true;
      timers.forEach(clearTimeout);
      try { sessionStorage.setItem('vo-seance', '1'); } catch (e) {}
      root.classList.add('seance-done', 'after-amorce');
      root.classList.remove('is-seance');
      amorce.remove();
      openSequence();
    }

    ['3', '2', '1'].forEach(function (n, i) {
      timers.push(window.setTimeout(function () { count.textContent = n; }, i * 700));
    });
    timers.push(window.setTimeout(close, 2250));
    amorce.addEventListener('click', close);
    skip.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    document.addEventListener('keydown', function (e) {
      if (!closed && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) close();
    });
  })();

  /* ---------- B. Grain argentique ---------- */
  (function () {
    var cv = document.getElementById('grain');
    if (!cv || isReduced()) { if (cv && isReduced()) drawStaticGrain(cv); return; }
    var ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    var TILE = 128, tiles = [], t = 0, last = 0, raf = 0;

    function makeTiles() {
      tiles = [];
      for (var k = 0; k < 3; k++) {
        var off = document.createElement('canvas');
        off.width = off.height = TILE;
        var octx = off.getContext('2d');
        var d = octx.createImageData(TILE, TILE);
        for (var i = 0; i < d.data.length; i += 4) {
          var v = (Math.random() * 255) | 0;
          d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
          d.data[i + 3] = 255;
        }
        octx.putImageData(d, 0, 0);
        tiles.push(ctx.createPattern(off, 'repeat'));
      }
    }
    function size() {
      // un seul pixel physique par pixel CSS : le grain n'a pas besoin de retina
      cv.width = Math.ceil(window.innerWidth);
      cv.height = Math.ceil(window.innerHeight);
      makeTiles();
    }
    function frame(now) {
      raf = window.requestAnimationFrame(frame);
      if (now - last < 80) return;          // ~12 images/seconde, comme une pellicule
      last = now;
      t = (t + 1) % tiles.length;
      ctx.setTransform(1, 0, 0, 1, -((Math.random() * TILE) | 0), -((Math.random() * TILE) | 0));
      ctx.fillStyle = tiles[t];
      ctx.fillRect(0, 0, cv.width + TILE, cv.height + TILE);
    }
    function start() { if (!raf) raf = window.requestAnimationFrame(frame); }
    function stop() { if (raf) { window.cancelAnimationFrame(raf); raf = 0; } }

    size();
    start();
    window.addEventListener('resize', debounce(size, 200), { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
  })();

  function drawStaticGrain(cv) {
    var ctx = cv.getContext('2d');
    if (!ctx) return;
    cv.width = 256; cv.height = 256;
    var d = ctx.createImageData(256, 256);
    for (var i = 0; i < d.data.length; i += 4) {
      var v = (Math.random() * 255) | 0;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255;
    }
    ctx.putImageData(d, 0, 0);
    cv.style.backgroundImage = 'url(' + cv.toDataURL() + ')';
  }

  function debounce(fn, ms) {
    var id;
    return function () { window.clearTimeout(id); id = window.setTimeout(fn, ms); };
  }

  /* ---------- C. Sous-titres V.O ---------- */
  (function () {
    var lines = Array.prototype.slice.call(document.querySelectorAll('[data-vo]'));
    if (!lines.length) return;

    lines.forEach(function (el) {
      var text = el.textContent.trim();
      el.textContent = '';

      // le texte réel reste dans le DOM pour les lecteurs d'écran…
      var sr = document.createElement('span');
      sr.className = 'sr-only';
      sr.textContent = text;

      // …la version animée est purement décorative
      var band = document.createElement('span');
      band.className = 'vo__band';
      band.setAttribute('aria-hidden', 'true');

      var dash = document.createElement('span');
      dash.className = 'vo__dash';
      dash.textContent = '—';
      band.appendChild(dash);

      // Les espaces restent de vrais nœuds texte : enfermés dans des <span>
      // (et insécables par-dessus le marché), ils supprimaient toute occasion
      // de retour à la ligne et la plaque débordait en petite largeur.
      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
        var ch = document.createElement('span');
        ch.className = 'vo__c';
        ch.style.setProperty('--d', (i * 16) + 'ms');
        ch.textContent = text[i];
        frag.appendChild(ch);
      }
      band.appendChild(frag);

      var caret = document.createElement('span');
      caret.className = 'vo__caret';
      band.appendChild(caret);

      el.appendChild(sr);
      el.appendChild(band);
      el._voDur = text.length * 16 + 200;
    });

    if (isReduced() || !('IntersectionObserver' in window)) {
      lines.forEach(function (el) { el.classList.add('is-typed'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('is-typing');
        window.setTimeout(function () {
          el.classList.remove('is-typing');
          el.classList.add('is-typed');
        }, el._voDur);
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -15% 0px', threshold: 0.2 });
    lines.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- D. Boucle de scroll : parallaxe + bande de pellicule ---------- */
  /* Inertie : les calques rejoignent leur cible par lissage plutôt que de coller
     au pixel de scroll. Le glissement est porté par les calques, pas par la page
     — un wrapper transformé casserait position:sticky, dont la bande de
     projection a besoin, et confisquerait le défilement natif. */
  var paraNodes = Array.prototype.slice.call(document.querySelectorAll('[data-para]'));
  paraNodes.forEach(function (n) {
    n._speed = parseFloat(n.getAttribute('data-para')) || 0;
    n._target = 0; n._cur = 0;
  });
  var paraRaf = 0;
  function paraStep() {
    var moving = false;
    for (var i = 0; i < paraNodes.length; i++) {
      var n = paraNodes[i];
      var d = n._target - n._cur;
      if (Math.abs(d) < 0.08) { n._cur = n._target; }
      else { n._cur += d * 0.12; moving = true; }
      n.style.transform = 'translate3d(0,' + n._cur.toFixed(2) + 'px,0)';
    }
    paraRaf = moving ? window.requestAnimationFrame(paraStep) : 0;
  }
  function wakePara() { if (!paraRaf) paraRaf = window.requestAnimationFrame(paraStep); }

  var reelBand = document.querySelector('.reelband');
  var reel = document.getElementById('reel');
  var reelTrack = document.getElementById('reel-track');
  var reelBar = document.getElementById('reel-bar');
  var reelCount = document.getElementById('reel-count');
  var reelSpan = 0;
  var scrollRaf = false;

  function pinnable() {
    return wide.matches && !isReduced() && reelTrack && reelTrack.scrollWidth > window.innerWidth + 40;
  }

  function layoutReel() {
    measureHero();
    if (!reelBand || !reel || !reelTrack) return;
    reelBand.classList.remove('is-pinned');
    reelTrack.style.removeProperty('--reel-x');
    if (!pinnable()) { reelSpan = 0; return; }
    reelBand.classList.add('is-pinned');
    // largeur réelle du ruban une fois épinglé, gouttière comprise
    reelSpan = Math.max(0, reelTrack.scrollWidth - window.innerWidth);
    reel.style.setProperty('--reel-h', (window.innerHeight + reelSpan) + 'px');
  }

  function onScrollFrame() {
    scrollRaf = false;
    var vh = window.innerHeight;
    updateCut();

    if (!isReduced()) {
      var awake = false;
      for (var i = 0; i < paraNodes.length; i++) {
        var n = paraNodes[i];
        var r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;   // jamais hors écran
        n._target = window.scrollY * (n._speed || 0);
        awake = true;
      }
      if (awake) wakePara();
    }

    if (reelSpan && reelBand && reelBand.classList.contains('is-pinned')) {
      var p = -reel.getBoundingClientRect().top / reelSpan;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
      reelTrack.style.setProperty('--reel-x', (-p * reelSpan).toFixed(1) + 'px');
      if (reelBar) reelBar.style.setProperty('--reel-p', p.toFixed(3));
      if (reelCount) {
        var n2 = Math.min(8, Math.floor(p * 8) + 1);
        var lbl = (n2 < 10 ? '0' : '') + n2 + ' / 08';
        if (reelCount.textContent !== lbl) reelCount.textContent = lbl;
      }
    }
  }

  function requestScrollFrame() {
    if (!scrollRaf) { scrollRaf = true; window.requestAnimationFrame(onScrollFrame); }
  }

  window.addEventListener('resize', debounce(function () { layoutReel(); requestScrollFrame(); }, 200), { passive: true });
  window.addEventListener('load', function () { layoutReel(); requestScrollFrame(); });
  layoutReel();
  requestScrollFrame();

  // Épinglé, le ruban n'a pas de scroll propre : les flèches pilotent alors le
  // défilement vertical de la page, qui est ce qui fait avancer la bande.
  if (reelTrack) {
    reelTrack.addEventListener('keydown', function (e) {
      if (!reelBand.classList.contains('is-pinned') || !reelSpan) return;
      var step = reelSpan / 8;
      var r = reel.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var d = 0;
      switch (e.key) {
        case 'ArrowRight': case 'ArrowDown': case 'PageDown': d = step; break;
        case 'ArrowLeft': case 'ArrowUp': case 'PageUp': d = -step; break;
        case 'Home': window.scrollTo({ top: top, behavior: 'auto' }); e.preventDefault(); return;
        case 'End': window.scrollTo({ top: top + reelSpan, behavior: 'auto' }); e.preventDefault(); return;
        default: return;
      }
      e.preventDefault();
      window.scrollBy(0, d);
    });
  }

  // progression du ruban quand il défile à la main (mobile, clavier, trackpad)
  if (reelTrack) {
    reelTrack.addEventListener('scroll', function () {
      if (reelBand.classList.contains('is-pinned')) return;
      var max = reelTrack.scrollWidth - reelTrack.clientWidth;
      var p = max ? reelTrack.scrollLeft / max : 0;
      if (reelBar) reelBar.style.setProperty('--reel-p', p.toFixed(3));
      if (reelCount) reelCount.textContent = '0' + Math.min(8, Math.floor(p * 8) + 1) + ' / 08';
    }, { passive: true });
  }

  /* ---------- E. Curseur de coupe ---------- */
  (function () {
    var cur = document.getElementById('cursor');
    if (!cur || !fine.matches || isReduced()) { if (cur) cur.remove(); return; }
    root.classList.add('has-cut-cursor');

    var tx = -100, ty = -100, x = -100, y = -100, raf = 0;

    function loop() {
      x += (tx - x) * 0.22;                 // inertie : le point suit, il ne colle pas
      y += (ty - y) * 0.22;
      cur.style.setProperty('--cx', x.toFixed(1) + 'px');
      cur.style.setProperty('--cy', y.toFixed(1) + 'px');
      raf = (Math.abs(tx - x) > 0.1 || Math.abs(ty - y) > 0.1) ? window.requestAnimationFrame(loop) : 0;
    }
    function wake() { if (!raf) raf = window.requestAnimationFrame(loop); }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      var el = e.target;
      var link = el.closest && el.closest('a, button, input, select, textarea, [tabindex]');
      var media = el.closest && el.closest('.portrait, .plan__frame, .map-card');
      cur.classList.toggle('is-link', !!link);
      cur.classList.toggle('is-lens', !link && !!media);
      wake();
    }, { passive: true });

    document.addEventListener('pointerdown', function () { cur.classList.add('is-cut'); });
    document.addEventListener('pointerup', function () { cur.classList.remove('is-cut'); });
    // le clavier reprend la main : on rend le curseur natif
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') root.classList.remove('has-cut-cursor');
    });
  })();

  /* ---------- F. Boutons magnétiques ---------- */
  (function () {
    if (!fine.matches || isReduced()) return;
    var magnets = Array.prototype.slice.call(document.querySelectorAll('.btn'));
    if (!magnets.length) return;
    var RADIUS = 80, PULL = 0.28, raf = 0, mx = 0, my = 0;

    function apply() {
      raf = 0;
      magnets.forEach(function (b) {
        var r = b.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = mx - cx, dy = my - cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < r.width / 2 + RADIUS) {
          b.classList.add('is-magnet'); b.classList.remove('is-magnet-off');
          b.style.transform = 'translate3d(' + (dx * PULL).toFixed(1) + 'px,' + (dy * PULL).toFixed(1) + 'px,0)';
        } else if (b.style.transform) {
          b.classList.remove('is-magnet'); b.classList.add('is-magnet-off');
          b.style.transform = '';
        }
      });
    }
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      mx = e.clientX; my = e.clientY;
      if (!raf) raf = window.requestAnimationFrame(apply);
    }, { passive: true });
  })();

  /* ---------- G. Tarifs en compteur de timecode ---------- */
  (function () {
    var prices = Array.prototype.slice.call(document.querySelectorAll('.line__price'));
    if (!prices.length) return;
    if (isReduced() || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        var m = el.textContent.match(/^(.*?)(\d+)(.*)$/);
        if (!m) return;
        var pre = m[1], target = parseInt(m[2], 10), post = m[3];
        var t0 = 0, DUR = 620;
        (function step(now) {
          if (!t0) t0 = now;
          var k = Math.min(1, (now - t0) / DUR);
          var eased = 1 - Math.pow(1 - k, 3);
          el.textContent = pre + Math.round(target * eased) + post;
          if (k < 1) window.requestAnimationFrame(step);
        })(0);
      });
    }, { threshold: 0.6 });
    prices.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- H. Changement de bobine ---------- */
  (function () {
    if (isReduced() || !('IntersectionObserver' in window)) return;
    var marks = Array.prototype.slice.call(document.querySelectorAll('#prestations, #reservation'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        io.unobserve(el);
        el.classList.add('is-splicing');
        root.classList.add('is-splice');
        window.setTimeout(function () {
          el.classList.remove('is-splicing');
          root.classList.remove('is-splice');
        }, 180);
      });
    }, { rootMargin: '-25% 0px -60% 0px', threshold: 0 });
    marks.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- H bis. Le générique ne tourne qu'à l'écran ---------- */
  (function () {
    var roll = document.getElementById('credits-roll');
    if (!roll || isReduced() || !('IntersectionObserver' in window)) return;
    roll.style.animationPlayState = 'paused';
    new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        roll.style.animationPlayState = e.isIntersecting ? 'running' : 'paused';
      });
    }, { threshold: 0 }).observe(roll);
  })();

  /* ---------- I. Trait de nav coupé en deux ---------- */
  Array.prototype.slice.call(document.querySelectorAll('.nav a')).forEach(function (a) {
    var r = document.createElement('span');
    r.className = 'nav__r';
    r.setAttribute('aria-hidden', 'true');
    a.appendChild(r);
  });

  /* ---------- 7. Année du footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
