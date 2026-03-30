/* ===== SCRIPT.JS – VARUN VERMA PORTFOLIO (Mobile Optimized) ===== */

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(hover: none)').matches;

// ============================================================
// LOADER
// ============================================================
(function initLoader() {
  const loader = document.getElementById('loader');
  const particles = document.getElementById('loader-particles');
  if (!loader) return;

  // Add expanding rings
  const content = loader.querySelector('.loader-content');
  if (content) {
  // Create floating particles
  if (particles) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'loader-particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDelay = Math.random() * 6 + 's';
      p.style.animationDuration = (Math.random() * 3 + 4) + 's';
      const colors = ['#7c5cfc', '#c084fc', '#e040fb', '#00e5ff'];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      p.style.boxShadow = `0 0 6px ${colors[Math.floor(Math.random() * colors.length)]}`;
      particles.appendChild(p);
    }
  }

  // Hide loader after content loads
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.style.overflow = '';
    }, 2800);
  });
})();
document.body.style.overflow = 'hidden';

// ============================================================
// GLOWING CURSOR (Desktop only)
// ============================================================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;
let isHovering = false;

if (isTouchDevice) {
  if (cursor) cursor.style.display = 'none';
  if (follower) follower.style.display = 'none';
  document.body.style.cursor = 'auto';
  document.querySelectorAll('.btn, .hamburger, .dock-toggle, a, button').forEach(el => el.style.cursor = 'pointer');
} else {
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
    const spotlight = document.getElementById('mouse-spotlight');
    if (spotlight) {
      spotlight.style.setProperty('--mx', mouseX + 'px');
      spotlight.style.setProperty('--my', mouseY + 'px');
    }
  });

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .skill-card, .project-card, .timeline-card, .edu-card, .contact-item, .interest-tag')) {
      isHovering = true;
      cursor.classList.add('cursor-hover');
      follower.classList.add('cursor-hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a, button, .skill-card, .project-card, .timeline-card, .edu-card, .contact-item, .interest-tag')) {
      isHovering = false;
      cursor.classList.remove('cursor-hover');
      follower.classList.remove('cursor-hover');
    }
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * (isHovering ? 0.07 : 0.11);
    followerY += (mouseY - followerY) * (isHovering ? 0.07 : 0.11);
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; follower.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; follower.style.opacity = '1'; });
}

// Touch spotlight support
document.addEventListener('touchstart', (e) => {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
}, { passive: true });

document.addEventListener('touchmove', (e) => {
  mouseX = e.touches[0].clientX;
  mouseY = e.touches[0].clientY;
  const spotlight = document.getElementById('mouse-spotlight');
  if (spotlight) {
    spotlight.style.setProperty('--mx', mouseX + 'px');
    spotlight.style.setProperty('--my', mouseY + 'px');
  }
}, { passive: true });

document.addEventListener('touchend', () => { mouseX = 0; mouseY = 0; }, { passive: true });

// ============================================================
// REACTIVE CONSTELLATION MESH BACKGROUND
// ============================================================
const canvas = document.getElementById('aurora-canvas');
const ctx = canvas.getContext('2d');
let W = 0, H = 0;
let particles = [];
let raindrops = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  initParticles();
  initRaindrops();
}
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.baseRadius = Math.random() * 2 + 1;
    this.colorType = Math.random() > 0.5 ? '124, 92, 252' : '0, 229, 255'; // Purple or Cyan
    this.alpha = Math.random() * 0.5 + 0.3;
    
    // Mouse interaction properties
    this.dx = 0;
    this.dy = 0;
    this.repelForce = 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Mouse repulsion
    if (mouseX > 0 && mouseY > 0) {
      let dx = this.x - mouseX;
      let dy = this.y - mouseY;
      let dist = Math.sqrt(dx * dx + dy * dy);
      let repelRadius = 180;

      if (dist < repelRadius) {
        let force = (repelRadius - dist) / repelRadius;
        this.vx += (dx / dist) * force * 0.05;
        this.vy += (dy / dist) * force * 0.05;
      }
    }

    // Friction to return to sluggish base speed
    let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    if (speed > 0.8) {
      this.vx *= 0.95;
      this.vy *= 0.95;
    }

    // Wrap around screen beautifully
    if (this.x < -20) this.x = W + 20;
    if (this.x > W + 20) this.x = -20;
    if (this.y < -20) this.y = H + 20;
    if (this.y > H + 20) this.y = -20;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.colorType}, ${this.alpha})`;
    ctx.fill();
    // To guarantee 60fps on mobile, we removed expensive shadowBlur and just use alpha layered glowing
  }
}

class RainDrop {
  constructor() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.length = Math.random() * 20 + 10; // Rain streak length
    this.speedY = Math.random() * 8 + 12; // Falling speed
    this.speedX = (Math.random() - 0.5) * 1.5; // Slight wind slant
    this.alpha = Math.random() * 0.2 + 0.05; // Faint, subtle rain
  }

  update() {
    this.y += this.speedY;
    this.x += this.speedX;

    // Wrap around bottom
    if (this.y > H + this.length) {
      this.y = -this.length;
      this.x = Math.random() * W;
    }
    // Wrap around sides
    if (this.x > W) this.x = -this.length;
    if (this.x < -this.length) this.x = W;
  }

  draw() {
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x + this.speedX * 1.5, this.y + this.length);
    ctx.strokeStyle = `rgba(124, 92, 252, ${this.alpha})`; // Purple tinted rain to match theme
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function initParticles() {
  particles = [];
  const isMobile = window.innerWidth <= 768;
  const density = isMobile ? 40000 : 12000;
  const maxParticles = isMobile ? 25 : 120;
  const count = Math.min(Math.floor((W * H) / density), maxParticles);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function initRaindrops() {
  raindrops = [];
  const maxRain = window.innerWidth <= 768 ? 20 : 80;
  for (let i = 0; i < maxRain; i++) {
    raindrops.push(new RainDrop());
  }
}
resizeCanvas();

function drawConstellation() {
  ctx.fillStyle = 'rgba(6, 9, 20, 1)'; // Solid dark BG
  ctx.fillRect(0, 0, W, H);

  // Update particles
  for (let i = 0; i < particles.length; i++) {
    particles[i].update();
    particles[i].draw();
  }

  // Update raindrops
  for (let i = 0; i < raindrops.length; i++) {
    raindrops[i].update();
    raindrops[i].draw();
  }

  // Draw connecting lines between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let dist = dx * dx + dy * dy;

      if (dist < 18000) { // approx 134px
        ctx.beginPath();
        let alpha = 1 - (dist / 18000);
        // Blend colors
        ctx.strokeStyle = `rgba(124, 92, 252, ${alpha * 0.15})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  // Mouse connection spider-web effect
  if (mouseX > 0 && mouseY > 0) {
    for (let i = 0; i < particles.length; i++) {
      let dx = mouseX - particles[i].x;
      let dy = mouseY - particles[i].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160 && !isHovering) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mouseX, mouseY);
        // Stunning cyan glowing spider lines
        ctx.strokeStyle = `rgba(0, 229, 255, ${(1 - dist / 160) * 0.6})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawConstellation);
}
requestAnimationFrame(drawConstellation);

// ============================================================
// NAVBAR
// ============================================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  navbar.classList.toggle('scrolled', scrollY > 60);
  let current = '';
  sections.forEach(s => { if (scrollY >= s.offsetTop - 120) current = s.getAttribute('id'); });
  navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));

  // Background Particle Parallax
  const dy = scrollY - lastScrollY;
  particles.forEach(p => {
    // Move particles vertically based on scroll delta and their size (for 3D depth)
    p.y -= dy * (p.baseRadius * 0.15); 
  });
  
  // Rain Parallax (Rain feels much closer, so it moves more drastically when scrolling)
  raindrops.forEach(r => {
    r.y -= dy * (r.speedY * 0.08);
  });
  
  lastScrollY = scrollY;
});

const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  const open = navLinksEl.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});
navLinks.forEach(l => l.addEventListener('click', () => {
  navLinksEl.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}));

// ============================================================
// TYPING ANIMATION
// ============================================================
const phrases = ['Project Manager', 'Digital Marketer', 'SEO Specialist', 'E-Commerce Builder', 'Content Strategist', 'Team Leader'];
let phraseIndex = 0, charIndex = 0, isDeleting = false;
const typedText = document.getElementById('typed-text');

function typeEffect() {
  const phrase = phrases[phraseIndex];
  typedText.textContent = isDeleting
    ? phrase.substring(0, charIndex - 1)
    : phrase.substring(0, charIndex + 1);
  isDeleting ? charIndex-- : charIndex++;
  if (!isDeleting && charIndex === phrase.length) { isDeleting = true; setTimeout(typeEffect, 1800); return; }
  if (isDeleting && charIndex === 0) { isDeleting = false; phraseIndex = (phraseIndex + 1) % phrases.length; setTimeout(typeEffect, 500); return; }
  setTimeout(typeEffect, isDeleting ? 55 : 85);
}
typeEffect();

// ============================================================
// COUNTER ANIMATION
// ============================================================
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'));
  let current = 0;
  const step = target / 120;
  const t = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current);
    if (current >= target) clearInterval(t);
  }, 16);
}

// ============================================================
// SCROLL REVEAL
// ============================================================
function setupReveal() {
  const groups = [
    { sel: '.timeline-item', delay: 0.1 },
    { sel: '.skill-card',    delay: 0.07 },
    { sel: '.bento-card',    delay: 0.1 },
    { sel: '.edu-card',      delay: 0.09 },
  ];
  groups.forEach(({ sel, delay }) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = (i * delay) + 's';
    });
  });
  document.querySelectorAll('.section-header').forEach(el => el.classList.add('reveal'));
  document.querySelectorAll('.about-visual').forEach(el => el.classList.add('reveal-left'));
  document.querySelectorAll('.about-content').forEach(el => el.classList.add('reveal-right'));
  document.querySelectorAll('.contact-info').forEach(el => el.classList.add('reveal-left'));
  document.querySelectorAll('.contact-form').forEach(el => el.classList.add('reveal-right'));
}

const triggeredBars = new Set();
let statsAnimated = false;

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add('visible');
    if (el.classList.contains('skill-card') && !triggeredBars.has(el)) {
      triggeredBars.add(el);
      const bar = el.querySelector('.skill-bar');
      if (bar) setTimeout(() => { bar.style.width = bar.getAttribute('data-width') + '%'; }, 200);
    }
    observer.unobserve(el);
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !statsAnimated) {
      document.querySelectorAll('.stat-number').forEach(animateCounter);
      statsAnimated = true;
      heroObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

document.addEventListener('DOMContentLoaded', () => {
  setupReveal();
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .skill-card, .timeline-item, .edu-card, .bento-card').forEach(el => observer.observe(el));
  const stats = document.querySelector('.hero-stats');
  if (stats) heroObserver.observe(stats);
});

// ============================================================
// PARALLAX HERO ORBS (Desktop only)
// ============================================================
if (!isTouchDevice) {
  document.addEventListener('mousemove', e => {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const dx = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      const dy = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      const orbs = document.querySelectorAll('.orb');
      if (orbs[0]) orbs[0].style.transform = `translate(${dx * -30}px, ${dy * -30}px)`;
      if (orbs[1]) orbs[1].style.transform = `translate(${dx * 22}px, ${dy * 22}px)`;
      if (orbs[2]) orbs[2].style.transform = `translate(${dx * -14}px, ${dy * 14}px)`;
    }
  });
}

// ============================================================
// SMOOTH 3D TILT CARDS (Desktop only)
// ============================================================
if (!isTouchDevice) {
  const tiltCards = document.querySelectorAll('.skill-card, .timeline-card, .edu-card, .bento-card, .contact-item, .float-card');
  const tiltSettings = { strength: 5, scale: 1.04 };

  tiltCards.forEach(card => {
    card.style.transition = 'transform 0.08s ease-out, box-shadow 0.3s ease, border-color 0.3s ease';
    card.style.willChange = 'transform';

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -tiltSettings.strength;
      const rotateY = ((x - centerX) / centerX) * tiltSettings.strength;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${tiltSettings.scale}, ${tiltSettings.scale}, ${tiltSettings.scale})`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });
}

// ============================================================
// PROJECT CARD GLOW FOLLOW
// ============================================================
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const glow = card.querySelector('.project-glow');
    if (glow) glow.style.transform = `translate(${e.clientX - rect.left - 100}px, ${e.clientY - rect.top - 100}px)`;
  });
  card.addEventListener('mouseleave', () => {
    const glow = card.querySelector('.project-glow');
    if (glow) glow.style.transform = '';
  });
});

// ============================================================
// MOBILE SWIPE NAV & DOCK
// ============================================================
let touchStartX = 0;
document.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
document.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  if (dx < -80 && touchStartX > window.innerWidth * 0.6) navLinksEl.classList.add('open');
  if (dx > 80 && navLinksEl.classList.contains('open')) navLinksEl.classList.remove('open');
}, { passive: true });

// Mobile spotlight via touch
document.addEventListener('touchmove', e => {
  const spotlight = document.getElementById('mouse-spotlight');
  if (spotlight) {
    spotlight.style.setProperty('--mx', e.touches[0].clientX + 'px');
    spotlight.style.setProperty('--my', e.touches[0].clientY + 'px');
  }
}, { passive: true });

// Floating Dock Toggle for Mobile
const dockToggle = document.querySelector('.dock-toggle');
const dockMenu = document.querySelector('.dock-menu');
if (dockToggle && dockMenu) {
  dockToggle.addEventListener('click', (e) => {
    e.preventDefault();
    if (dockMenu.style.opacity === '1') {
      dockMenu.style.opacity = '0';
      dockMenu.style.transform = 'translateY(20px)';
      dockMenu.style.pointerEvents = 'none';
      dockToggle.querySelector('.pulse-ring').style.animation = 'pulseDock 2s infinite cubic-bezier(0.66, 0, 0, 1)';
    } else {
      dockMenu.style.opacity = '1';
      dockMenu.style.transform = 'translateY(0)';
      dockMenu.style.pointerEvents = 'all';
      dockToggle.querySelector('.pulse-ring').style.animation = 'none';
    }
  });
}

// ============================================================
// CONTACT FORM
// ============================================================
function handleFormSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  const success = document.getElementById('form-success');
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Sending…';

  const name = document.getElementById('form-name').value;
  const email = document.getElementById('form-email').value;
  const message = document.getElementById('form-message').value;

  fetch("https://formsubmit.co/ajax/VARUN.VERMA21FEB@GMAIL.COM", {
    method: "POST",
    headers: { 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      message: message,
      _subject: "New Portfolio Message!"
    })
  })
  .then(response => response.json())
  .then(data => {
    success.style.display = 'block';
    btn.querySelector('span').textContent = 'Sent!';
    ['form-name', 'form-email', 'form-message'].forEach(id => { document.getElementById(id).value = ''; });
    setTimeout(() => {
      success.style.display = 'none';
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
    }, 5000);
  })
  .catch(err => {
    console.error(err);
    btn.querySelector('span').textContent = 'Error!';
    setTimeout(() => {
      btn.disabled = false;
      btn.querySelector('span').textContent = 'Send Message';
    }, 3000);
  });
}

// ============================================================
// SMOOTH SCROLL
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const id = anchor.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
