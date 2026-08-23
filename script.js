/* =========================================================
   STUDIO V.O — Bischheim
   Vanilla JS. Aucune dépendance.
   Le gros morceau est « le fil » : une mèche SVG dont les points de
   passage sont les sections réelles de la page. Un seul rAF pour
   tout ce qui suit le scroll ou la souris.
   ========================================================= */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var isReduced = function () { return reduced.matches; };
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var wide = window.matchMedia('(min-width: 900px)');

  function debounce(fn, ms) {
    var id;
    return function () { window.clearTimeout(id); id = window.setTimeout(fn, ms); };
  }

  /* ---------- 1. Séquence d'entrée (une seule) ---------- */
  function openSequence() { root.classList.add('is-loaded'); }
  if (root.classList.contains('is-ouverture')) {
    // déclenchée par la fin de l'ouverture
  } else if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(openSequence).catch(openSequence);
    window.setTimeout(openSequence, 1200); // filet de sécurité
  } else {
    window.addEventListener('load', openSequence);
  }

  /* ---------- 2. Ouverture — le fil se tend ---------- */
  (function () {
    var ouv = document.getElementById('ouverture');
    if (!ouv) return;
    if (!root.classList.contains('is-ouverture')) { ouv.remove(); return; }

    var skip = document.getElementById('ouverture-skip');
    var timer = 0, closed = false;

    function close() {
      if (closed) return;
      closed = true;
      window.clearTimeout(timer);
      try { sessionStorage.setItem('vo-ouverture', '1'); } catch (e) {}
      root.classList.add('ouverture-done', 'after-ouverture');
      root.classList.remove('is-ouverture');
      ouv.remove();
      openSequence();
      layoutFil();
      requestScrollFrame();
    }

    // le rideau se retire à 1,05 s et met 0,7 s : on nettoie juste après
    timer = window.setTimeout(close, 1800);
    ouv.addEventListener('click', close);
    if (skip) skip.addEventListener('click', function (e) { e.stopPropagation(); close(); });
    document.addEventListener('keydown', function (e) {
      if (!closed && (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ')) close();
    });
  })();

  /* ---------- 3. Header ---------- */
  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-lit', window.scrollY > 40);
  }
  updateHeader();

  /* ---------- 3b. Sommaire (mobile) ---------- */
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
      if (isReduced()) hide(); else window.setTimeout(hide, 350);
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
    var onWide = function (e) { if (e.matches && menuBtn.getAttribute('aria-expanded') === 'true') closeMenu(false); };
    if (wide.addEventListener) wide.addEventListener('change', onWide);
    else if (wide.addListener) wide.addListener(onWide);
  }

  /* ---------- 4. Reveals au scroll ---------- */
  var revealables = Array.prototype.slice.call(document.querySelectorAll('[data-reveal], .kicker'));
  var bands = Array.prototype.slice.call(document.querySelectorAll('.band, .site-footer'));

  if (!('IntersectionObserver' in window) || isReduced()) {
    revealables.forEach(function (el) { el.classList.add('is-in'); });
    bands.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var seen = new WeakMap();
    var io = new IntersectionObserver(function (entries) {
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
  var navSections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && navSections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('is-current', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    navSections.forEach(function (s) { spy.observe(s); });
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

  /* ---------- 7. Lignes V.O — la phrase s'écrit lettre à lettre ---------- */
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

      // Les espaces restent de vrais nœuds texte : enfermés dans des <span>,
      // ils supprimaient toute occasion de retour à la ligne.
      var frag = document.createDocumentFragment();
      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') { frag.appendChild(document.createTextNode(' ')); continue; }
        var ch = document.createElement('span');
        ch.className = 'vo__c';
        ch.style.setProperty('--d', (i * 14) + 'ms');
        ch.textContent = text[i];
        frag.appendChild(ch);
      }
      band.appendChild(frag);

      var caret = document.createElement('span');
      caret.className = 'vo__caret';
      band.appendChild(caret);

      el.appendChild(sr);
      el.appendChild(band);
      el._voDur = text.length * 14 + 220;
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

  /* =========================================================
     8. LE FIL — la mèche qui traverse le site
     Les points de passage sont les sections elles-mêmes : la courbe
     épouse la page réelle plutôt qu'un dessin figé. Rendu dans un
     viewBox 0→1000 étiré au viewport (preserveAspectRatio="none"),
     avec vector-effect pour garder une épaisseur constante.
     ========================================================= */
  var filSvg    = document.getElementById('fil');
  var filOmbre  = document.getElementById('fil-ombre');
  var filTrace  = document.getElementById('fil-trace');
  var filNoeuds = document.getElementById('fil-noeuds');
  var filAncres = Array.prototype.slice.call(document.querySelectorAll('[data-fil]'));
  var filCircles = [];
  var swayTarget = 0, swayCur = 0;

  if (filSvg && filOmbre && filTrace && filNoeuds && filAncres.length) {
    filAncres.forEach(function () {
      var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', '0');
      filNoeuds.appendChild(c);
      filCircles.push(c);
    });
  }

  /* Catmull-Rom converti en cubiques : une commande C par segment, donc une
     chaîne courte à reconstruire par image.
     Les tangentes sont NORMALISÉES et la longueur des poignées est bornée à
     une fraction du segment : sans cela, des points très inégalement espacés
     — une section fait dix fois la hauteur d'une autre — font surcorriger la
     courbe, qui part en boucle hors de la page. */
  function courbe(pts) {
    if (pts.length < 2) return '';
    var d = 'M' + pts[0].x.toFixed(1) + ' ' + pts[0].y.toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i - 1] || pts[i];
      var p1 = pts[i], p2 = pts[i + 1];
      var p3 = pts[i + 2] || p2;
      var ax = p2.x - p0.x, ay = p2.y - p0.y;
      var bx = p3.x - p1.x, by = p3.y - p1.y;
      var na = Math.sqrt(ax * ax + ay * ay) || 1;
      var nb = Math.sqrt(bx * bx + by * by) || 1;
      var dx = p2.x - p1.x, dy = p2.y - p1.y;
      var k = Math.sqrt(dx * dx + dy * dy) * 0.34;
      d += 'C' + (p1.x + ax / na * k).toFixed(1) + ' ' + (p1.y + ay / na * k).toFixed(1) +
           ' ' + (p2.x - bx / nb * k).toFixed(1) + ' ' + (p2.y - by / nb * k).toFixed(1) +
           ' ' + p2.x.toFixed(1) + ' ' + p2.y.toFixed(1);
    }
    return d;
  }

  var filPts = [];      // recalculés au layout : positions dans le document
  var filRoom = 0;      // marge disponible, en pixels, pour le méandre et le ballant

  /* La mèche vit dans la marge de reliure, jamais sur le texte. Plutôt que de
     parier sur un pourcentage, on mesure la colonne de texte réelle et on
     garde la mèche à sa gauche : la contrainte tient à toutes les largeurs,
     y compris quand les feuilles de papier prennent leur retrait. */
  function layoutFil() {
    filPts = [];
    filRoom = 0;
    if (!filAncres.length) return;
    var vw = window.innerWidth || 1;

    var textL = 60, textR = vw - 60;
    var ref = document.querySelector('#salon .wrap');
    if (ref) {
      var cs = window.getComputedStyle(ref);
      var rr = ref.getBoundingClientRect();
      textL = rr.left + (parseFloat(cs.paddingLeft) || 0);
      textR = rr.right - (parseFloat(cs.paddingRight) || 0);
    }

    filAncres.forEach(function (el, i) {
      var r = el.getBoundingClientRect();
      var top = r.top + window.scrollY;
      var f = parseFloat(el.getAttribute('data-fil'));
      if (isNaN(f)) f = 0.06;
      var px = f * vw;
      var room;
      if (f < 0.5) { px = Math.max(7, Math.min(px, textL - 12)); room = textL - 12 - px; }
      else         { px = Math.min(vw - 7, Math.max(px, textR + 12)); room = px - textR - 12; }
      var amp = Math.max(0, Math.min(28, room * 0.55));
      if (amp > filRoom) filRoom = amp;
      // un méandre : une mèche ne tombe jamais parfaitement droit
      filPts.push({ px: px + Math.sin(i * 1.9) * amp,       docY: top + r.height * 0.26, i: i });
      filPts.push({ px: px + Math.sin(i * 1.9 + 1.1) * amp, docY: top + r.height * 0.74, i: i });
    });

    // amorce et sortie : la mèche vient de hors-champ et y repart
    var a0 = filPts[0], aN = filPts[filPts.length - 1];
    filPts.unshift({ px: a0.px, docY: a0.docY - 900, i: -1 });
    filPts.push({ px: aN.px, docY: aN.docY + 900, i: -1 });
  }

  function drawFil() {
    if (!filSvg || !filPts.length) return;
    var vh = window.innerHeight || 1;
    var vw = window.innerWidth || 1;
    var sy = window.scrollY;
    // le ballant reste borné par la place disponible dans la marge
    var sway = isReduced() ? 0 : swayCur * Math.min(1, filRoom / 28);

    // conversion document → viewport, puis pixels → viewBox 0..1000
    var all = [];
    for (var i = 0; i < filPts.length; i++) {
      var p = filPts[i];
      all.push({ x: (p.px + sway) / vw * 1000, y: (p.docY - sy) / vh * 1000, i: p.i });
    }
    // on ne dessine que la fenêtre utile, plus un point de part et d'autre
    var first = -1, last = -1;
    for (var j = 0; j < all.length; j++) {
      if (all[j].y > -2200 && all[j].y < 3200) { if (first < 0) first = j; last = j; }
    }
    if (first < 0) { first = 0; last = all.length - 1; }
    var pts = all.slice(Math.max(0, first - 1), Math.min(all.length, last + 2));

    var d = courbe(pts);
    filOmbre.setAttribute('d', d);
    filTrace.setAttribute('d', d);

    // jauge de lecture : la mèche se colore au fur et à mesure
    var max = Math.max(1, document.documentElement.scrollHeight - vh);
    filTrace.style.setProperty('--fil-p', Math.min(1, Math.max(0, sy / max)).toFixed(4));

    // les nœuds : un par section, visibles seulement quand ils passent à l'écran
    for (var k = 0; k < filCircles.length; k++) {
      var a = all[1 + k * 2];             // 1 : on saute le point d'amorce
      var c = filCircles[k];
      if (!a) continue;
      if (a.y < -80 || a.y > 1080) { if (c.getAttribute('r') !== '0') c.setAttribute('r', '0'); continue; }
      c.setAttribute('cx', a.x.toFixed(1));
      c.setAttribute('cy', a.y.toFixed(1));
      c.setAttribute('r', '3');
      c.classList.toggle('is-on', a.y > 180 && a.y < 820);
    }
  }

  /* la mèche s'assombrit quand elle passe sur une feuille de papier */
  var lightBands = Array.prototype.slice.call(document.querySelectorAll('.band--light'));
  function lireFilTone() {
    if (!filSvg || !lightBands.length) return false;
    var mid = window.innerHeight * 0.5;
    for (var i = 0; i < lightBands.length; i++) {
      var r = lightBands[i].getBoundingClientRect();
      if (r.top < mid && r.bottom > mid) return true;
    }
    return false;
  }

  /* ---------- 9. Parallaxe douce (hero) ---------- */
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

  /* ---------- 10. Bande des réalisations ---------- */
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
    if (!reelBand || !reel || !reelTrack) return;
    reelBand.classList.remove('is-pinned');
    reelTrack.style.removeProperty('--reel-x');
    if (!pinnable()) { reelSpan = 0; return; }
    reelBand.classList.add('is-pinned');
    reelSpan = Math.max(0, reelTrack.scrollWidth - window.innerWidth);
    reel.style.setProperty('--reel-h', (window.innerHeight + reelSpan) + 'px');
  }

  function relayout() { layoutReel(); layoutFil(); }

  /* Une image de défilement se lit en deux temps : d'abord TOUTES les mesures,
     ensuite TOUTES les écritures. Mélanger les deux force le navigateur à
     recalculer la mise en page au milieu de l'image, à chaque image. */
  function onScrollFrame() {
    scrollRaf = false;
    var vh = window.innerHeight;
    var i, n;

    /* — mesures — */
    var surPapier = lireFilTone();

    var awake = false;
    if (!isReduced()) {
      for (i = 0; i < paraNodes.length; i++) {
        n = paraNodes[i];
        var r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) continue;   // jamais hors écran
        n._target = window.scrollY * (n._speed || 0);
        awake = true;
      }
    }

    var pinned = reelSpan && reelBand && reelBand.classList.contains('is-pinned');
    var p = 0;
    if (pinned) {
      p = -reel.getBoundingClientRect().top / reelSpan;
      p = p < 0 ? 0 : (p > 1 ? 1 : p);
    }

    /* — écritures — */
    if (filSvg) filSvg.classList.toggle('fil--sur-papier', surPapier);
    drawFil();
    if (awake) wakePara();

    if (pinned) {
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

  window.addEventListener('scroll', function () {
    requestScrollFrame();
    updateHeader();
  }, { passive: true });

  window.addEventListener('resize', debounce(function () { relayout(); requestScrollFrame(); }, 200), { passive: true });
  window.addEventListener('load', function () { relayout(); requestScrollFrame(); });
  // les feuilles bougent quand les polices arrivent : on remesure alors
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { relayout(); requestScrollFrame(); }).catch(function () {});
  }
  relayout();
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

    // progression du ruban quand il défile à la main (mobile, clavier, trackpad)
    reelTrack.addEventListener('scroll', function () {
      if (reelBand.classList.contains('is-pinned')) return;
      var max = reelTrack.scrollWidth - reelTrack.clientWidth;
      var p = max ? reelTrack.scrollLeft / max : 0;
      if (reelBar) reelBar.style.setProperty('--reel-p', p.toFixed(3));
      if (reelCount) reelCount.textContent = '0' + Math.min(8, Math.floor(p * 8) + 1) + ' / 08';
    }, { passive: true });
  }

  /* ---------- 11. Pointeur : lampe, ballant du fil, curseur ---------- */
  (function () {
    if (!fine.matches || isReduced()) {
      var c0 = document.getElementById('cursor');
      if (c0) c0.remove();
      var l0 = document.getElementById('lumiere');
      if (l0) l0.remove();
      return;
    }
    root.classList.add('has-fil-cursor', 'has-lumiere');

    var cur = document.getElementById('cursor');
    var lampe = document.getElementById('lumiere');
    var tx = -100, ty = -100, x = -100, y = -100, raf = 0;

    function loop() {
      x += (tx - x) * 0.2;                  // inertie : le point suit, il ne colle pas
      y += (ty - y) * 0.2;
      swayCur += (swayTarget - swayCur) * 0.06;
      if (cur) {
        cur.style.setProperty('--cx', x.toFixed(1) + 'px');
        cur.style.setProperty('--cy', y.toFixed(1) + 'px');
      }
      if (lampe) {
        lampe.style.setProperty('--lx', tx.toFixed(0) + 'px');
        lampe.style.setProperty('--ly', ty.toFixed(0) + 'px');
      }
      drawFil();
      var vif = Math.abs(tx - x) > 0.15 || Math.abs(ty - y) > 0.15 || Math.abs(swayTarget - swayCur) > 0.15;
      raf = vif ? window.requestAnimationFrame(loop) : 0;
    }
    function wake() { if (!raf) raf = window.requestAnimationFrame(loop); }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      tx = e.clientX; ty = e.clientY;
      // le fil ballotte doucement du côté opposé au curseur
      swayTarget = (0.5 - e.clientX / (window.innerWidth || 1)) * 34;
      if (cur) {
        var el = e.target;
        var link = el.closest && el.closest('a, button, input, select, textarea, [tabindex]');
        var media = el.closest && el.closest('.portrait, .plan__frame, .map-card');
        cur.classList.toggle('is-link', !!link);
        cur.classList.toggle('is-media', !link && !!media);
      }
      wake();
    }, { passive: true });

    if (cur) {
      document.addEventListener('pointerdown', function () { cur.classList.add('is-down'); });
      document.addEventListener('pointerup', function () { cur.classList.remove('is-down'); });
    }
    // le clavier reprend la main : on rend le curseur natif
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Tab') root.classList.remove('has-fil-cursor');
    });
  })();

  /* ---------- 12. Les tarifs se comptent en montant ----------
     Le prix est déjà composé en trois morceaux dans le balisage — « dès », le
     chiffre, le symbole. Ce n'est pas de la coquetterie : dans un Didone les
     barres de l'euro sont des déliés, et à ce corps elles disparaissent, si
     bien que « € » se lisait « C ». Le compteur n'a donc plus qu'un nœud de
     texte à animer, et le découpage tient aussi sans JavaScript. */
  (function () {
    var nums = Array.prototype.slice.call(document.querySelectorAll('.line__price .line__n'));
    if (!nums.length || isReduced() || !('IntersectionObserver' in window)) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target;
        var val = parseInt(el.textContent, 10);
        if (isNaN(val)) return;
        var t0 = 0, DUR = 700;
        (function step(now) {
          if (!t0) t0 = now;
          var k = Math.min(1, (now - t0) / DUR);
          var eased = 1 - Math.pow(1 - k, 3);
          el.textContent = String(Math.round(val * eased));
          if (k < 1) window.requestAnimationFrame(step);
        })(0);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (el) { io.observe(el); });
  })();

  /* ---------- 13. Le générique ne tourne qu'à l'écran ---------- */
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

  /* ---------- 14. Année du footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
