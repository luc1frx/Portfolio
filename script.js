/* ============================================================
   VARUN VERMA — PORTFOLIO V3
   Free-floating bright dots, interactive orbs, parallax
   ============================================================ */
(function () {
  'use strict';

  // ==================== LOADING SCREEN ====================
  var loader = document.getElementById('loader');
  var barFill = document.getElementById('loader-bar-fill');
  var progress = 0;
  var loadTimer;

  function startLoader() {
    // Generate loader particles
    var pCont = document.getElementById('loader-particles');
    if (pCont) {
      for (var i = 0; i < 30; i++) {
        var p = document.createElement('div');
        p.className = 'loader-particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 3 + 's';
        p.style.animationDuration = (2 + Math.random() * 2) + 's';
        pCont.appendChild(p);
      }
    }

    loadTimer = setInterval(function () {
      progress += 1.5;
      if (barFill) barFill.style.width = Math.min(progress, 100) + '%';
      if (progress >= 100) {
        clearInterval(loadTimer);
        setTimeout(function () {
          if (loader) loader.classList.add('hidden');
          initAll();
        }, 300);
      }
    }, 20);
  }

  window.addEventListener('load', function () {
    progress = 100;
    if (barFill) barFill.style.width = '100%';
    clearInterval(loadTimer);
    setTimeout(function () {
      if (loader) loader.classList.add('hidden');
      initAll();
    }, 400);
  });

  document.addEventListener('DOMContentLoaded', function () {
    startLoader();
  });

  var inited = false;
  function initAll() {
    if (inited) return;
    inited = true;
    initCanvas();
    initOrbs();
    initCursor();
    initScrollProgress();
    initHeroEntrance();
    initScrollParallax();
    initReveal();
    initGlowCards();
    initTilt3D();
    initSkillBars();
    initCounters();
    initTypewriter();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initParallax();
    initBgParallax();
    initForm();
  }

  // ==================== CANVAS (DISABLED) ====================
  function initCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (canvas) canvas.style.display = 'none';
  }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      isMobile = W < 768;
      createDots();
    }

    function createDots() {
      dots = [];
      var count = isMobile ? 30 : Math.min(70, Math.floor((W * H) / 18000));
      for (var i = 0; i < count; i++) {
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 0.8,
          a: Math.random() * 0.5 + 0.3,
          hue: Math.random() > 0.5 ? 'cyan' : 'white'
    });
  }
})();

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var time = Date.now() * 0.001;

      // Update positions
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        d.x += d.vx;
        d.y += d.vy;

        // Gentle sine drift
        d.x += Math.sin(time * 0.5 + i * 0.7) * 0.15;
        d.y += Math.cos(time * 0.4 + i * 0.5) * 0.15;

        // Mouse attraction (spider-web: particles pull toward cursor)
        var dx = mouse.x - d.x;
        var dy = mouse.y - d.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          var force = (200 - dist) / 200;
          d.vx += (dx / dist) * force * 0.08;
          d.vy += (dy / dist) * force * 0.08;
        }

        // Damping
        d.vx *= 0.995;
        d.vy *= 0.995;

        // Wrap
        if (d.x < -10) d.x = W + 10;
        if (d.x > W + 10) d.x = -10;
        if (d.y < -10) d.y = H + 10;
        if (d.y > H + 10) d.y = -10;
      }

      // Draw connections BETWEEN nearby particles (web effect)
      var maxDist = isMobile ? 100 : 140;
      for (var i = 0; i < dots.length; i++) {
        for (var j = i + 1; j < dots.length; j++) {
          var a = dots[i], b = dots[j];
          var cdx = b.x - a.x, cdy = b.y - a.y;
          var cd = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cd < maxDist) {
            var alpha = Math.pow(1 - cd / maxDist, 2) * 0.15;
            // Brighten connections near mouse
            var midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
            var mDist = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);
            if (mDist < 150) {
              alpha = Math.pow(1 - cd / maxDist, 2) * 0.4;
            }
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = 'rgba(6, 182, 212, ' + alpha + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw spider-web lines from cursor to nearby particles
      if (mouse.x > -9000) {
        var cursorRange = isMobile ? 180 : 220;
        for (var i = 0; i < dots.length; i++) {
          var d = dots[i];
          var cdx = mouse.x - d.x, cdy = mouse.y - d.y;
          var cd = Math.sqrt(cdx * cdx + cdy * cdy);
          if (cd < cursorRange) {
            var alpha = Math.pow(1 - cd / cursorRange, 1.5) * 0.35;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(d.x, d.y);
            ctx.strokeStyle = 'rgba(6, 182, 212, ' + alpha + ')';
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Cursor glow
        var cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 120);
        cursorGlow.addColorStop(0, 'rgba(6, 182, 212, 0.06)');
        cursorGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 120, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
      }

      // Draw dots
      for (var i = 0; i < dots.length; i++) {
        var d = dots[i];
        var color = d.hue === 'cyan' ? 'rgba(6, 182, 212, ' + d.a + ')' : 'rgba(220, 230, 255, ' + d.a + ')';

        // Glow
        var glow = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 5);
        glow.addColorStop(0, color);
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      }

      requestAnimationFrame(draw);
    }

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
  }

  // ==================== INTERACTIVE ORBS ====================
  function initOrbs() {
    var orbs = document.querySelectorAll('[data-orb]');
    if (!orbs.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    // Orbs react to mouse position - gentle magnetic pull
    function animateOrbs() {
      for (var i = 0; i < orbs.length; i++) {
        var orb = orbs[i];
        var rect = orb.getBoundingClientRect();
        var ox = rect.left + rect.width / 2;
        var oy = rect.top + rect.height / 2;

        var dx = mouse.x - ox;
        var dy = mouse.y - oy;
        var dist = Math.sqrt(dx * dx + dy * dy);

        // Subtle magnetic attraction toward cursor
        if (dist < 500 && dist > 0) {
          var force = (500 - dist) / 500;
          var pullX = (dx / dist) * force * 15;
          var pullY = (dy / dist) * force * 15;
          var current = orb.style.transform || '';
          orb.style.transform = 'translate(' + pullX + 'px, ' + pullY + 'px)';
        } else {
          orb.style.transform = '';
        }
      }
      requestAnimationFrame(animateOrbs);
    }
    animateOrbs();
  }

  // ==================== CUSTOM CURSOR ====================
  function initCursor() {
    var dot = document.getElementById('cursor-dot');
    var ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
    });

    function follow() {
      rx += (mx - rx) * 0.1;
      ry += (my - ry) * 0.1;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(follow);
    }
    follow();

    var targets = document.querySelectorAll('a, button, .glass, .btn, .nav-link, .contact-item, .nav-cta, .mobile-menu a, .hamburger');
    for (var i = 0; i < targets.length; i++) {
      targets[i].addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
      targets[i].addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
    }
  }

  // ==================== SCROLL PROGRESS ====================
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    // Create fill element
    var fill = document.createElement('div');
    fill.className = 'scroll-progress-fill';
    bar.appendChild(fill);

    window.addEventListener('scroll', function () {
      var scrollTop = window.scrollY;
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight > 0) {
        var pct = (scrollTop / docHeight) * 100;
        fill.style.width = pct + '%';
      }
    }, { passive: true });
  }

  // ==================== HERO ENTRANCE ====================
  function initHeroEntrance() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // Show everything immediately
      document.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-desc, .hero-cta, .hero-stats, .hero-img-container, .hero-float-card').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }
    var hero = document.querySelector('.hero');
    if (!hero) return;
    var badge = document.querySelector('.hero-badge');
    var title = document.querySelector('.hero-title');
    var subtitle = document.querySelector('.hero-subtitle');
    var desc = document.querySelector('.hero-desc');
    var cta = document.querySelector('.hero-cta');
    var stats = document.querySelector('.hero-stats');
    var imgWrap = document.querySelector('.hero-img-container');
    var floatCards = document.querySelectorAll('.hero-float-card');

    setTimeout(function () { if (badge) badge.classList.add('visible'); }, 100);
    setTimeout(function () { if (title) title.classList.add('visible'); }, 200);
    setTimeout(function () { if (subtitle) subtitle.classList.add('visible'); }, 500);
    setTimeout(function () { if (desc) desc.classList.add('visible'); }, 600);
    setTimeout(function () { if (cta) cta.classList.add('visible'); }, 700);
    setTimeout(function () { if (imgWrap) imgWrap.classList.add('visible'); }, 400);
    setTimeout(function () { if (stats) stats.classList.add('visible'); }, 800);
    floatCards.forEach(function (fc, i) {
      setTimeout(function () { fc.classList.add('visible'); }, 600 + i * 150);
    });
  }

  // ==================== SCROLL REVEAL ====================
  function initReveal() {
    var els = document.querySelectorAll('.reveal, .reveal-scale');
    if (!els.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
    els.forEach(function (el) { obs.observe(el); });

    // Section head stagger
    var heads = document.querySelectorAll('.section-head');
    var headObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.3 });
    heads.forEach(function (h) { headObs.observe(h); });
  }

  // ==================== SCROLL-DRIVEN PARALLAX LAYERS ====================
  function initScrollParallax() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    var bgCanvas = document.getElementById('bg-canvas');
    var orbs = document.querySelectorAll('[data-orb]');
    var tick = false;

    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;

        // Canvas moves at 0.15x speed (background depth)
        if (bgCanvas) {
          bgCanvas.style.transform = 'translateY(' + (scrollY * 0.12) + 'px) scale(1.05)';
        }

        // Orbs move at different speeds for parallax depth
        for (var i = 0; i < orbs.length; i++) {
          var speed = 0.03 + (i * 0.025);
          orbs[i].style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        }

        tick = false;
      });
    }, { passive: true });
  }

  // ==================== GLOW CARD MOUSE TRACKING ====================
  function initGlowCards() {
    var cards = document.querySelectorAll('.glass');
    cards.forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  // ==================== SKILL BARS ====================
  function initSkillBars() {
    var bars = document.querySelectorAll('.skill-fill');
    if (!bars.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var w = e.target.getAttribute('data-width');
          setTimeout(function () { e.target.style.width = w + '%'; }, 200);
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    bars.forEach(function (b) { obs.observe(b); });
  }

  // ==================== COUNTERS ====================
  function initCounters() {
    var nums = document.querySelectorAll('.stat-num');
    if (!nums.length) return;
    function animate(el) {
      var target = parseInt(el.getAttribute('data-target'));
      var dur = 2000, step = target / (dur / 16), cur = 0;
      function tick() {
        cur += step;
        if (cur < target) { el.textContent = Math.floor(cur); requestAnimationFrame(tick); }
        else el.textContent = target;
      }
      tick();
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animate(e.target); obs.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (n) { obs.observe(n); });
  }

  // ==================== TYPEWRITER ====================
  function initTypewriter() {
    var el = document.getElementById('typed-text');
    if (!el) return;
    var words = ['Project Manager', 'Digital Marketer', 'SEO Specialist', 'Team Leader', 'Growth Strategist'];
    var wi = 0, ci = 0, del = false, timer;
    function type() {
      var w = words[wi];
      if (del) { ci--; if (ci < 0) { ci = 0; del = false; wi = (wi + 1) % words.length; timer = setTimeout(type, 400); return; } }
      else { ci++; if (ci > w.length) { del = true; timer = setTimeout(type, 2200); return; } }
      el.textContent = w.substring(0, ci);
      timer = setTimeout(type, del ? 35 : 65);
    }
    timer = setTimeout(type, 1200);
  }

  // ==================== NAVBAR ====================
  function initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 50);
    }, { passive: true });
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      var active = menu.classList.toggle('active');
      btn.classList.toggle('active');
      btn.setAttribute('aria-expanded', active);
      menu.setAttribute('aria-hidden', !active);
      document.body.style.overflow = active ? 'hidden' : '';
    });
    var links = menu.querySelectorAll('a');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        menu.classList.remove('active');
        btn.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    }
  }

  // ==================== SMOOTH SCROLL ====================
  function initSmoothScroll() {
    var links = document.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
      });
    }
  }

  // ==================== SCROLL SPY ====================
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    var mobileLinks = document.querySelectorAll('.mobile-menu a');
    if (!sections.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var id = e.target.getAttribute('id');
          navLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
          mobileLinks.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + id); });
        }
      });
    }, { threshold: 0.2 });
    sections.forEach(function (s) { obs.observe(s); });
  }

  // ==================== PARALLAX SCROLL ====================
  function initParallax() {
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Disable on mobile for performance
    if (window.innerWidth < 768) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        var speed = parseFloat(el.getAttribute('data-parallax'));
        var rect = el.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          el.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        }
      }
    }, { passive: true });
  }

  // ==================== 3D TILT EFFECT ====================
  function initTilt3D() {
    var cards = document.querySelectorAll('[data-tilt]');
    if (!cards.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if ('ontouchstart' in window) return;

    for (var i = 0; i < cards.length; i++) {
      (function (card) {
        // Disable CSS transition on transform for instant tilt response
        card.style.transition = 'background 0.3s var(--ease), border-color 0.3s var(--ease), box-shadow 0.4s var(--ease)';

        card.addEventListener('mousemove', function (e) {
          var rect = card.getBoundingClientRect();
          var x = e.clientX - rect.left;
          var y = e.clientY - rect.top;
          var centerX = rect.width / 2;
          var centerY = rect.height / 2;

          // Calculate rotation (max 10 degrees)
          var rotateX = ((y - centerY) / centerY) * -8;
          var rotateY = ((x - centerX) / centerX) * 8;

          card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale3d(1.02,1.02,1.02)';
          card.style.setProperty('--mx', x + 'px');
          card.style.setProperty('--my', y + 'px');
        });

        card.addEventListener('mouseleave', function () {
          // Re-enable transition for smooth reset
          card.style.transition = 'transform 0.5s cubic-bezier(0.16,1,0.3,1), background 0.3s var(--ease), border-color 0.3s var(--ease), box-shadow 0.4s var(--ease)';
          card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)';
        });
      })(cards[i]);
    }
  }

  // ==================== 3D BACKGROUND PARALLAX ====================
  function initBgParallax() {
    var bgLayers = document.getElementById('bg-layers');
    var canvas = document.getElementById('bg-canvas');
    var orbs = document.querySelectorAll('[data-orb]');
    if (!bgLayers) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      var vh = window.innerHeight;

      // Canvas moves slower (background layer)
      if (canvas) {
        canvas.style.transform = 'translateY(' + (scrollY * 0.15) + 'px) translateZ(-50px) scale(1.05)';
      }

      // Orbs move at different speeds for depth
      for (var i = 0; i < orbs.length; i++) {
        var speed = 0.05 + (i * 0.03);
        orbs[i].style.marginTop = (scrollY * speed) + 'px';
      }
    }, { passive: true });
  }

  // ==================== CONTACT FORM ====================
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('.btn');
      var orig = btn.innerHTML;
      btn.innerHTML = 'Sending...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
      setTimeout(function () {
        btn.innerHTML = '<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="m4.5 12.75 6 6 9-13.5"/></svg> Sent!';
        btn.style.background = '#22c55e';
        btn.style.opacity = '1';
        setTimeout(function () {
          btn.innerHTML = orig;
          btn.style.background = '';
          btn.disabled = false;
          form.reset();
        }, 2500);
      }, 1200);
    });
  }

})();
