/* ============================================================
   VARUN VERMA — PORTFOLIO V3
   ============================================================ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    initLoader();
    var loader = document.getElementById('loader');
    setTimeout(function() { if (loader) loader.classList.add('hidden'); }, 1200);
    initAll();
  });

  // ==================== LOADER PROGRESS ====================
  function initLoader() {
    var fill = document.getElementById('loader-bar-fill');
    var percent = document.getElementById('loader-percent-num');
    if (!fill || !percent) return;
    
    var progress = 0;
    var interval = setInterval(function() {
      progress += Math.random() * 15 + 5;
      if (progress > 100) progress = 100;
      fill.style.width = progress + '%';
      percent.textContent = Math.floor(progress);
      if (progress >= 100) clearInterval(interval);
    }, 80);
  }

  var inited = false;
  function initAll() {
    if (inited) return;
    inited = true;
    initCanvas();
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
    initForm();
  }

  // ==================== VISUALLY STUNNING PARTICLE SYSTEM ====================
  function initCanvas() {
    var canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var W, H, particles = [], mouse = { x: -9999, y: -9999 };
    var isMobile = false;
    var animationId;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      isMobile = W < 768;
      createParticles();
    }

    function createParticles() {
      particles = [];
      var count = isMobile ? 50 : 80;
      
      // Flowing ambient particles (small)
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 1.5 + 0.5,
          a: Math.random() * 0.4 + 0.2,
          type: 'ambient',
          phase: Math.random() * Math.PI * 2
        });
      }
      
      // Constellation nodes (larger, for web effect)
      var nodeCount = isMobile ? 12 : 20;
      for (var i = 0; i < nodeCount; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          r: Math.random() * 2 + 2,
          a: Math.random() * 0.3 + 0.5,
          type: 'node',
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      var time = Date.now() * 0.001;
      var cyan = 'rgba(0, 255, 255, ';
      var white = 'rgba(255, 255, 255, ';

      // Update and draw all particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        
        // Sinusoidal drifting motion
        p.x += p.vx + Math.sin(time * 0.3 + p.phase) * 0.2;
        p.y += p.vy + Math.cos(time * 0.25 + p.phase) * 0.15;
        
        // Mouse attraction
        var dx = mouse.x - p.x;
        var dy = mouse.y - p.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 180 && dist > 0) {
          var force = (180 - dist) / 180;
          p.vx += (dx / dist) * force * 0.05;
          p.vy += (dy / dist) * force * 0.05;
        }
        
        // Damping
        p.vx *= 0.99;
        p.vy *= 0.99;
        
        // Wrap around screen
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
        
        // Draw based on type
        if (p.type === 'node') {
          // Constellation nodes - brighter with glow
          var glowSize = p.r * 4;
          var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          
          // Brighten near mouse
          var brightness = dist < 150 ? 1.3 : 1;
          
          gradient.addColorStop(0, cyan + (p.a * brightness) + ')');
          gradient.addColorStop(0.4, cyan + (p.a * 0.5 * brightness) + ')');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
          
          // Core
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = cyan + (p.a + 0.3) + ')';
          ctx.fill();
        } else {
          // Ambient particles - subtle glow
          var glowSize = p.r * 3;
          var gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowSize);
          gradient.addColorStop(0, white + p.a + ')');
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          
          ctx.beginPath();
          ctx.arc(p.x, p.y, glowSize, 0, Math.PI * 2);
          ctx.fillStyle = gradient;
          ctx.fill();
        }
      }
      
      // Draw constellation web (connect nearby nodes)
      var nodes = particles.filter(function(p) { return p.type === 'node'; });
      var maxDist = isMobile ? 100 : 150;
      
      for (var i = 0; i < nodes.length; i++) {
        for (var j = i + 1; j < nodes.length; j++) {
          var a = nodes[i], b = nodes[j];
          var cdx = b.x - a.x, cdy = b.y - a.y;
          var cd = Math.sqrt(cdx * cdx + cdy * cdy);
          
          if (cd < maxDist) {
            var alpha = Math.pow(1 - cd / maxDist, 2) * 0.25;
            
            // Boost near mouse
            var midX = (a.x + b.x) / 2, midY = (a.y + b.y) / 2;
            var mDist = Math.sqrt((midX - mouse.x) ** 2 + (midY - mouse.y) ** 2);
            if (mDist < 120) {
              alpha = Math.pow(1 - cd / maxDist, 1.5) * 0.5;
            }
            
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = cyan + alpha + ')';
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      
      // Mouse tether effect - connect cursor to nearby nodes
      if (mouse.x > -9000) {
        var cursorRange = isMobile ? 150 : 200;
        
        for (var i = 0; i < nodes.length; i++) {
          var p = nodes[i];
          var cdx = mouse.x - p.x, cdy = mouse.y - p.y;
          var cd = Math.sqrt(cdx * cdx + cdy * cdy);
          
          if (cd < cursorRange) {
            var alpha = Math.pow(1 - cd / cursorRange, 1.5) * 0.6;
            
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = cyan + alpha + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
        
        // Cursor glow
        var cursorGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 100);
        cursorGlow.addColorStop(0, cyan + '0.08)');
        cursorGlow.addColorStop(0.5, cyan + '0.03)');
        cursorGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 100, 0, Math.PI * 2);
        ctx.fillStyle = cursorGlow;
        ctx.fill();
        
        // Cursor core dot
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = cyan + '0.8)';
        ctx.fill();
      }
      
      animationId = requestAnimationFrame(draw);
    }

    // Mouse tracking
    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });
    
    // Handle visibility change - pause when not visible
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animationId = requestAnimationFrame(draw);
      }
    });

    window.addEventListener('resize', resize);
    resize();
    draw();
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
    var cyanGlows = document.querySelectorAll('.cyan-glow');
    var spiderGrid = document.querySelector('.spider-grid');
    var tick = false;

    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;

        // Canvas moves at 0.1x speed (background layer)
        if (bgCanvas) {
          bgCanvas.style.transform = 'translateY(' + (scrollY * 0.08) + 'px)';
        }

        // Cyan glows move slightly for depth
        cyanGlows.forEach(function(glow, i) {
          var speed = 0.05 + (i * 0.03);
          glow.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });

        // Spider grid moves with scroll
        if (spiderGrid) {
          spiderGrid.style.transform = 'translateY(' + (scrollY * 0.03) + 'px)';
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
    if (!bgLayers) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      // Canvas moves slower (background layer)
      if (canvas) {
        canvas.style.transform = 'translateY(' + (scrollY * 0.1) + 'px)';
      }
    }, { passive: true });
  }

  // ==================== CONTACT FORM ====================
  // Formspree handles form submission via @formspree/ajax library
  function initForm() {
    // Formspree AJAX library handles everything automatically
    // Just need to ensure form has data-fs-submit-btn on submit button
  }

})();
