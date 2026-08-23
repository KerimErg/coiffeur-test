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
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(openSequence).catch(openSequence);
    window.setTimeout(openSequence, 1200); // filet de sécurité
  } else {
    window.addEventListener('load', openSequence);
  }

  /* ---------- 2. Le raccord : la coupe se rouvre au scroll ---------- */
  var hero = document.querySelector('.hero');
  var ticking = false;

  function updateCut() {
    ticking = false;
    if (!hero || isReduced()) return;
    // la coupe se rejoue vite : tout se passe sur la première moitié du hero,
    // tant que le titre est encore lisible à l'écran
    var h = (hero.offsetHeight || 1) * 0.55;
    var p = Math.min(1, Math.max(0, window.scrollY / h));
    hero.style.setProperty('--cut', p.toFixed(4));
  }
  function requestCut() {
    if (!ticking) { ticking = true; window.requestAnimationFrame(updateCut); }
  }

  /* ---------- 3. Header ---------- */
  var header = document.querySelector('.site-header');
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-lit', window.scrollY > 40);
  }

  window.addEventListener('scroll', function () {
    requestCut();
    updateHeader();
  }, { passive: true });
  window.addEventListener('resize', requestCut, { passive: true });
  updateCut();
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
  var bands = Array.prototype.slice.call(document.querySelectorAll('.band'));

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
        var day = d.getDay();
        if (day === 0 || day === 1) return 'Le studio est fermé le dimanche et le lundi.';
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
          ' » est enregistrée : nous vous rappelons au 03 88 62 41 07 sous 24 h ouvrées pour confirmer le créneau.';
        ok.hidden = false;
      }
      form.reset();
    });
  }

  /* ---------- 7. Année du footer ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
