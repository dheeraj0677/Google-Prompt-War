/**
 * ElectBot — Particle System + Custom Cursor + Animations
 * Premium interactive effects engine
 */

// === PARTICLE SYSTEM ===
class ParticleSystem {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = window.innerWidth < 768 ? 40 : 100;
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  init() {
    this.particles = [];
    for (let i = 0; i < this.count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        gold: Math.random() > 0.7
      });
    }
  }
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const w = this.canvas.width, h = this.canvas.height;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.gold ? `rgba(255,215,0,${p.alpha})` : `rgba(255,255,255,${p.alpha})`;
      this.ctx.fill();
      for (let j = i + 1; j < this.particles.length; j++) {
        const q = this.particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.strokeStyle = `rgba(255,215,0,${0.06 * (1 - dist / 100)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }
    requestAnimationFrame(() => this.animate());
  }
}

// === CUSTOM CURSOR ===
class CustomCursor {
  constructor() {
    if ('ontouchstart' in window || window.innerWidth < 768) return;
    this.outer = document.createElement('div');
    this.outer.className = 'cursor-outer';
    this.inner = document.createElement('div');
    this.inner.className = 'cursor-inner';
    document.body.appendChild(this.outer);
    document.body.appendChild(this.inner);
    
    this.mx = 0; this.my = 0; // Mouse coords
    this.ox = 0; this.oy = 0; // Outer cursor coords
    this.ix = 0; this.iy = 0; // Inner cursor coords
    
    this.isVisible = false;

    document.addEventListener('mousemove', e => {
      this.mx = e.clientX;
      this.my = e.clientY;
      if (!this.isVisible) {
        this.isVisible = true;
        this.outer.style.opacity = '1';
        this.inner.style.opacity = '1';
      }
    });

    document.addEventListener('mousedown', () => {
      this.outer.classList.add('cursor-active');
    });

    document.addEventListener('mouseup', () => {
      this.outer.classList.remove('cursor-active');
    });

    document.addEventListener('mouseleave', () => {
      this.isVisible = false;
      this.outer.style.opacity = '0';
      this.inner.style.opacity = '0';
    });

    this.setupHovers();
    this.loop();
  }

  setupHovers() {
    document.addEventListener('mouseover', e => {
      const target = e.target;
      const isButton = target.closest('button, .btn, a, .nav-brand, .theme-toggle, .back-to-top');
      const isCard = target.closest('.card, .card-glass, .chip, .input-field');
      const isText = target.closest('p, h1, h2, h3, h4, span, li') && !isButton && !isCard;

      if (isButton) {
        this.outer.classList.add('cursor-hover');
        this.inner.style.transform = 'translate(-50%, -50%) scale(0)';
      } else if (isCard) {
        document.body.classList.add('cursor-card-hover');
        this.outer.classList.add('cursor-card-hover');
      } else if (isText) {
        document.body.classList.add('cursor-text-hover');
      }
    });

    document.addEventListener('mouseout', e => {
      this.outer.classList.remove('cursor-hover', 'cursor-card-hover');
      this.inner.style.transform = '';
      document.body.classList.remove('cursor-card-hover', 'cursor-text-hover');
    });
  }

  loop() {
    // Velocity-based motion blur
    const easeOuter = 0.12;
    const easeInner = 0.2;

    // Calculate velocity
    const dx = this.mx - this.ix;
    const dy = this.my - this.iy;
    const velocity = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Outer ring follows with lag
    this.ox += (this.mx - this.ox) * easeOuter;
    this.oy += (this.my - this.oy) * easeOuter;
    
    // Inner dot stretches based on velocity
    this.ix += dx * easeInner;
    this.iy += dy * easeInner;

    // Stretch factor: min 1, max 3.5
    const stretch = 1 + Math.min(velocity / 15, 2.5);

    this.outer.style.left = `${this.ox}px`;
    this.outer.style.top = `${this.oy}px`;
    
    this.inner.style.left = `${this.ix}px`;
    this.inner.style.top = `${this.iy}px`;
    this.inner.style.transform = `translate(-50%, -50%) rotate(${angle}deg) scaleX(${stretch})`;

    requestAnimationFrame(() => this.loop());
  }
}

// === SCROLL PROGRESS BAR ===
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = h > 0 ? (window.scrollY / h * 100) + '%' : '0%';
  });
}

// === SCROLL REVEAL ===
function initScrollReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); } });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// === NAVBAR SCROLL ===
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 30));
}

// === RIPPLE EFFECT ON BUTTONS ===
function initRipple() {
  document.addEventListener('click', e => {
    const btn = e.target.closest('.btn, button');
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const rip = document.createElement('span');
    rip.className = 'ripple';
    const size = Math.max(rect.width, rect.height);
    rip.style.width = rip.style.height = size + 'px';
    rip.style.left = (e.clientX - rect.left - size / 2) + 'px';
    rip.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(rip);
    setTimeout(() => rip.remove(), 600);
  });
}

// === COUNTER ANIMATION ===
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (!target || el.dataset.animated) return;
  el.dataset.animated = 'true';
  const dur = 2000, start = performance.now();
  const isDecimal = target % 1 !== 0;
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = isDecimal ? (eased * target).toFixed(1) : Math.floor(eased * target).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) animateCounter(e.target); });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

// === PRELOADER ===
function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(() => pre.classList.add('hidden'), 2200);
  setTimeout(() => pre.remove(), 2700);
}

// === MAGNETIC BUTTONS ===
function initMagnetic() {
  if (window.innerWidth < 768) return;
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// === TYPEWRITER ===
class Typewriter {
  constructor(el, texts, speed = 60, pause = 2000) {
    this.el = el; this.texts = texts; this.speed = speed; this.pause = pause;
    this.idx = 0; this.charIdx = 0; this.deleting = false;
    this.tick();
  }
  tick() {
    const current = this.texts[this.idx];
    if (this.deleting) {
      this.charIdx--;
      this.el.textContent = current.substring(0, this.charIdx);
      if (this.charIdx === 0) { this.deleting = false; this.idx = (this.idx + 1) % this.texts.length; }
      setTimeout(() => this.tick(), this.speed / 2);
    } else {
      this.charIdx++;
      this.el.textContent = current.substring(0, this.charIdx);
      if (this.charIdx === current.length) { this.deleting = true; setTimeout(() => this.tick(), this.pause); }
      else setTimeout(() => this.tick(), this.speed);
    }
  }
}

// === TOAST ===
function showToast(msg, type = 'info') {
  let c = document.getElementById('toastContainer');
  if (!c) { c = document.createElement('div'); c.className = 'toast-container'; c.id = 'toastContainer'; document.body.appendChild(c); }
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  t.innerHTML = `<span class="material-symbols-outlined" style="font-size:18px">${icon}</span>${msg}`;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// === THEME TOGGLE ===
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  // This is a dark-first app — toggle is cosmetic placeholder
  btn.addEventListener('click', () => showToast('Dark mode is the default premium theme ✨', 'info'));
}

// === MOBILE NAV ===
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
}

// === INIT ALL ===
function initElectBot() {
  initPreloader();
  new ParticleSystem('particleCanvas');
  new CustomCursor();
  initScrollProgress();
  initScrollReveal();
  initNavScroll();
  initRipple();
  initCounters();
  initMagnetic();
  initThemeToggle();
  initMobileNav();
}

document.addEventListener('DOMContentLoaded', initElectBot);
