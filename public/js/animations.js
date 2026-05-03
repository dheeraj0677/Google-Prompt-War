/**
 * ElectBot — UI Effects Engine
 *
 * Premium interactive effects including particle system, custom cursor,
 * scroll animations, ripple feedback, counters, and navigation utilities.
 *
 * @module animations
 * @version 2.0.0
 * @license MIT
 */

'use strict';

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════

/** @type {number} Particle count for mobile devices */
const PARTICLE_COUNT_MOBILE = 40;

/** @type {number} Particle count for desktop devices */
const PARTICLE_COUNT_DESKTOP = 100;

/** @type {number} Maximum connection distance between particles (px) */
const PARTICLE_CONNECTION_DISTANCE = 100;

/** @type {number} Counter animation duration (ms) */
const COUNTER_DURATION = 2000;

/** @type {number} Preloader display time (ms) */
const PRELOADER_DISPLAY_MS = 2200;

/** @type {number} Preloader removal time (ms) */
const PRELOADER_REMOVE_MS = 2700;

/** @type {number} Breakpoint for mobile detection (px) */
const MOBILE_BREAKPOINT = 768;

// ═══════════════════════════════════════
// PARTICLE SYSTEM
// ═══════════════════════════════════════

/**
 * Canvas-based particle system for creating ambient background effects.
 * Renders floating particles with optional connection lines between
 * nearby particles, creating a network visualization effect.
 *
 * @class ParticleSystem
 * @param {string} canvasId - The DOM ID of the target canvas element
 *
 * @example
 * new ParticleSystem('particleCanvas');
 */
class ParticleSystem {
  /**
   * Initialize the particle system on a canvas element.
   * @param {string} canvasId - Canvas element ID
   */
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.count = window.innerWidth < MOBILE_BREAKPOINT
      ? PARTICLE_COUNT_MOBILE
      : PARTICLE_COUNT_DESKTOP;

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.init();
    this.animate();
  }

  /**
   * Resize the canvas to match the window dimensions.
   * Called on initialization and window resize events.
   */
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  /**
   * Initialize particles with random positions, velocities, and properties.
   * Gold particles appear with 30% probability for visual accent.
   */
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

  /**
   * Main animation loop. Updates particle positions, draws them,
   * and renders connection lines between nearby particles.
   * Uses requestAnimationFrame for smooth 60fps rendering.
   */
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const w = this.canvas.width;
    const h = this.canvas.height;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position with wrapping
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = w;
      if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h;
      if (p.y > h) p.y = 0;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      this.ctx.fillStyle = p.gold
        ? `rgba(255,215,0,${p.alpha})`
        : `rgba(255,255,255,${p.alpha})`;
      this.ctx.fill();

      // Draw connection lines to nearby particles
      for (let j = i + 1; j < this.particles.length; j++) {
        const q = this.particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < PARTICLE_CONNECTION_DISTANCE) {
          this.ctx.beginPath();
          this.ctx.moveTo(p.x, p.y);
          this.ctx.lineTo(q.x, q.y);
          this.ctx.strokeStyle = `rgba(255,215,0,${0.06 * (1 - dist / PARTICLE_CONNECTION_DISTANCE)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ═══════════════════════════════════════
// CUSTOM CURSOR
// ═══════════════════════════════════════

/**
 * Velocity-sensitive custom cursor with motion blur effect.
 * Creates an outer ring and inner dot that follow the mouse
 * with different easing values. The inner dot stretches based
 * on movement velocity for a premium feel.
 *
 * Automatically disabled on touch devices and small screens.
 *
 * @class CustomCursor
 *
 * @example
 * new CustomCursor();
 */
class CustomCursor {
  /**
   * Initialize the custom cursor. Creates DOM elements and
   * sets up event listeners. Exits early on touch devices.
   */
  constructor() {
    if ('ontouchstart' in window || window.innerWidth < MOBILE_BREAKPOINT) return;

    this.outer = document.createElement('div');
    this.outer.className = 'cursor-outer';
    this.inner = document.createElement('div');
    this.inner.className = 'cursor-inner';
    document.body.appendChild(this.outer);
    document.body.appendChild(this.inner);

    /** @type {number} Mouse X coordinate */
    this.mx = 0;
    /** @type {number} Mouse Y coordinate */
    this.my = 0;
    /** @type {number} Outer cursor X coordinate */
    this.ox = 0;
    /** @type {number} Outer cursor Y coordinate */
    this.oy = 0;
    /** @type {number} Inner cursor X coordinate */
    this.ix = 0;
    /** @type {number} Inner cursor Y coordinate */
    this.iy = 0;

    /** @type {boolean} Whether the cursor is currently visible */
    this.isVisible = false;

    document.addEventListener('mousemove', (e) => {
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

  /**
   * Set up hover detection for interactive elements.
   * Changes cursor style when hovering over buttons, cards, or text.
   */
  setupHovers() {
    document.addEventListener('mouseover', (e) => {
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

    document.addEventListener('mouseout', () => {
      this.outer.classList.remove('cursor-hover', 'cursor-card-hover');
      this.inner.style.transform = '';
      document.body.classList.remove('cursor-card-hover', 'cursor-text-hover');
    });
  }

  /**
   * Main animation loop for the cursor. Calculates velocity-based
   * stretching and rotation for the motion blur effect.
   */
  loop() {
    const easeOuter = 0.12;
    const easeInner = 0.2;

    // Calculate velocity for motion blur
    const dx = this.mx - this.ix;
    const dy = this.my - this.iy;
    const velocity = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * 180 / Math.PI;

    // Outer ring follows with lag
    this.ox += (this.mx - this.ox) * easeOuter;
    this.oy += (this.my - this.oy) * easeOuter;

    // Inner dot follows faster
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

// ═══════════════════════════════════════
// SCROLL EFFECTS
// ═══════════════════════════════════════

/**
 * Initialize the scroll progress indicator bar at the top of the page.
 * Creates a fixed-position bar that fills based on scroll position.
 */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('role', 'progressbar');
  bar.setAttribute('aria-label', 'Page scroll progress');
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = h > 0 ? (window.scrollY / h * 100) : 0;
    bar.style.width = percentage + '%';
    bar.setAttribute('aria-valuenow', Math.round(percentage));
  });
}

/**
 * Initialize scroll reveal animations using IntersectionObserver.
 * Elements with the 'reveal' class will fade in when scrolled into view.
 */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/**
 * Initialize navbar scroll behavior. Adds 'scrolled' class
 * when the page is scrolled past 30px for visual distinction.
 */
function initNavScroll() {
  const nav = document.getElementById('navbar');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 30);
  });
}

// ═══════════════════════════════════════
// INTERACTIVE EFFECTS
// ═══════════════════════════════════════

/**
 * Initialize Material Design-style ripple effect on buttons.
 * Creates an expanding circle animation on click events.
 */
function initRipple() {
  document.addEventListener('click', (e) => {
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

/**
 * Animate a counter element from 0 to its data-target value.
 * Supports both integer and decimal targets with easing.
 *
 * @param {HTMLElement} el - Element with data-target attribute
 */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  if (!target || el.dataset.animated) return;

  el.dataset.animated = 'true';
  const start = performance.now();
  const isDecimal = target % 1 !== 0;

  /**
   * Animation step function using ease-out cubic.
   * @param {number} now - Current timestamp from requestAnimationFrame
   */
  function step(now) {
    const progress = Math.min((now - start) / COUNTER_DURATION, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = isDecimal
      ? (eased * target).toFixed(1)
      : Math.floor(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

/**
 * Initialize counter animations using IntersectionObserver.
 * Triggers animation when elements with data-target scroll into view.
 */
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) animateCounter(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('[data-target]').forEach((el) => observer.observe(el));
}

// ═══════════════════════════════════════
// UI UTILITIES
// ═══════════════════════════════════════

/**
 * Initialize the preloader with timed hide/remove transitions.
 * Shows the loading animation for a minimum duration before hiding.
 */
function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  setTimeout(() => pre.classList.add('hidden'), PRELOADER_DISPLAY_MS);
  setTimeout(() => pre.remove(), PRELOADER_REMOVE_MS);
}

/**
 * Initialize magnetic hover effect on primary/secondary buttons.
 * Buttons subtly follow the cursor within their bounds.
 * Disabled on mobile for performance.
 */
function initMagnetic() {
  if (window.innerWidth < MOBILE_BREAKPOINT) return;

  document.querySelectorAll('.btn-primary, .btn-secondary').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
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

// ═══════════════════════════════════════
// TYPEWRITER
// ═══════════════════════════════════════

/**
 * Typewriter animation that cycles through an array of text strings.
 * Types each string character by character, pauses, then deletes it
 * before moving to the next string.
 *
 * @class Typewriter
 * @param {HTMLElement} el - Target DOM element for text display
 * @param {string[]} texts - Array of strings to cycle through
 * @param {number} [speed=60] - Typing speed in milliseconds per character
 * @param {number} [pause=2000] - Pause duration at end of each string (ms)
 *
 * @example
 * new Typewriter(document.getElementById('hero'), [
 *   'Welcome to ElectBot...',
 *   'Your AI election guide...'
 * ]);
 */
class Typewriter {
  /**
   * Create a new Typewriter instance.
   * @param {HTMLElement} el - Target element
   * @param {string[]} texts - Texts to animate
   * @param {number} [speed=60] - Characters per second
   * @param {number} [pause=2000] - Pause at end of text
   */
  constructor(el, texts, speed = 60, pause = 2000) {
    this.el = el;
    this.texts = texts;
    this.speed = speed;
    this.pause = pause;
    this.idx = 0;
    this.charIdx = 0;
    this.deleting = false;
    this.tick();
  }

  /**
   * Main tick function. Handles both typing and deleting phases.
   * Recursively schedules itself with appropriate timing.
   */
  tick() {
    const current = this.texts[this.idx];

    if (this.deleting) {
      this.charIdx--;
      this.el.textContent = current.substring(0, this.charIdx);
      if (this.charIdx === 0) {
        this.deleting = false;
        this.idx = (this.idx + 1) % this.texts.length;
      }
      setTimeout(() => this.tick(), this.speed / 2);
    } else {
      this.charIdx++;
      this.el.textContent = current.substring(0, this.charIdx);
      if (this.charIdx === current.length) {
        this.deleting = true;
        setTimeout(() => this.tick(), this.pause);
      } else {
        setTimeout(() => this.tick(), this.speed);
      }
    }
  }
}

// ═══════════════════════════════════════
// TOAST NOTIFICATIONS
// ═══════════════════════════════════════

/**
 * Display a toast notification message.
 *
 * @param {string} msg - The message text to display
 * @param {'info'|'success'|'error'} [type='info'] - Toast type for styling
 *
 * @example
 * showToast('Plan saved successfully!', 'success');
 * showToast('Something went wrong', 'error');
 */
function showToast(msg, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'toastContainer';
    container.setAttribute('role', 'status');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  toast.innerHTML = `<span class="material-symbols-outlined" aria-hidden="true" style="font-size:18px">${icon}</span>${msg}`;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ═══════════════════════════════════════
// THEME & NAVIGATION
// ═══════════════════════════════════════

/**
 * Initialize the theme toggle button.
 * Currently displays an informational toast since the app
 * uses a dark-first design as its premium default.
 */
function initThemeToggle() {
  const btn = document.getElementById('themeToggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    showToast('Dark mode is the default premium theme ✨', 'info');
  });
}

/**
 * Initialize mobile navigation toggle behavior.
 * Opens/closes the nav-links list on hamburger button click.
 */
function initMobileNav() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// ═══════════════════════════════════════
// INITIALIZATION
// ═══════════════════════════════════════

/**
 * Initialize all ElectBot UI effects and interactions.
 * Called on DOMContentLoaded to ensure DOM is ready.
 */
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
