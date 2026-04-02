(function () {
  'use strict';

  // ==================== INIT ON DOM READY ====================
  document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initCursor();
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollSpy();
    initForm();
  });

  // ==================== INTERACTIVE PARTICLES ====================
  function initParticles() {
    var particles = document.querySelectorAll('[data-particle]');
    if (!particles.length) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    var mouse = { x: -1000, y: -1000 };
    var activeParticle = null;

    document.addEventListener('mousemove', function (e) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    particles.forEach(function(particle) {
      particle.addEventListener('mouseenter', function() {
        activeParticle = particle;
        particle.style.transform = 'scale(2)';
        particle.style.opacity = '1';
        particle.style.boxShadow = '0 0 25px var(--accent-glow)';
      });

      particle.addEventListener('mouseleave', function() {
        activeParticle = null;
        particle.style.transform = '';
        particle.style.opacity = '';
        particle.style.boxShadow = '';
      });
    });

    function animateParticles() {
      particles.forEach(function(particle) {
        if (activeParticle === particle) return;
        
        var rect = particle.getBoundingClientRect();
        var px = rect.left + rect.width / 2;
        var py = rect.top + rect.height / 2;

        var dx = mouse.x - px;
        var dy = mouse.y - py;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          var pushX = -(dx / dist) * 20 * (1 - dist / 150);
          var pushY = -(dy / dist) * 20 * (1 - dist / 150);
          particle.style.transform = 'translate(' + pushX + 'px, ' + pushY + 'px) scale(1.3)';
          particle.style.opacity = '0.6';
        } else {
          particle.style.transform = '';
          particle.style.opacity = '';
        }
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
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

  // ==================== NAVBAR ====================
  function initNavbar() {
    var nav = document.getElementById('navbar');
    if (!nav) return;
    var lastScroll = 0;
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      if (scrollY > 100) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      lastScroll = scrollY;
    });
  }

  // ==================== MOBILE MENU ====================
  function initMobileMenu() {
    var hamburger = document.getElementById('hamburger');
    var mobileMenu = document.getElementById('mobile-menu');
    if (!hamburger || !mobileMenu) return;
    hamburger.addEventListener('click', function () {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      var isOpen = hamburger.classList.contains('active');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ==================== SMOOTH SCROLL ====================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ==================== SCROLL SPY ====================
  function initScrollSpy() {
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY;
      sections.forEach(function (section) {
        var sectionHeight = section.offsetHeight;
        var sectionTop = section.offsetTop - 100;
        var sectionId = section.getAttribute('id');
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
              link.classList.add('active');
            }
          });
        }
      });
    });
  }

  // ==================== CONTACT FORM ====================
  function initForm() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      var message = document.getElementById('message').value;
      var mailto = 'mailto:varun.verma21feb@gmail.com?subject=Portfolio Contact from ' + encodeURIComponent(name) + '&body=' + encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message);
      window.location.href = mailto;
      alert('Thanks! Your email client will open.');
      form.reset();
    });
  }
})();
