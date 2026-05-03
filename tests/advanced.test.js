/**
 * ElectBot — Performance, Code Quality & Advanced Security Tests
 * Tests for code standards, documentation, performance patterns, and security headers.
 */

'use strict';

const { assert, assertEqual, assertIncludes, assertType, describe } = require('./run-tests');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');
const jsDir = path.join(publicDir, 'js');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

// ═══════════════════════════════════════
// CODE QUALITY — 'use strict' in all JS
// ═══════════════════════════════════════

describe('Code Quality — All JS files use strict mode', () => {
  const jsFiles = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && f !== 'config.js');
  jsFiles.forEach(file => {
    const content = fs.readFileSync(path.join(jsDir, file), 'utf-8');
    assertIncludes(content, "'use strict'", `${file}: uses strict mode`);
  });
});

describe('Code Quality — All JS files have JSDoc module header', () => {
  const jsFiles = ['gemini.js', 'animations.js', 'quiz.js', 'stations-data.js'];
  jsFiles.forEach(file => {
    const content = fs.readFileSync(path.join(jsDir, file), 'utf-8');
    assertIncludes(content, '@module', `${file}: has @module JSDoc tag`);
  });
});

describe('Code Quality — inject-config.js uses strict mode', () => {
  const content = fs.readFileSync(path.join(__dirname, '..', 'inject-config.js'), 'utf-8');
  assertIncludes(content, "'use strict'", 'inject-config.js uses strict mode');
});

describe('Code Quality — Test files use strict mode', () => {
  const testFiles = fs.readdirSync(__dirname).filter(f => f.endsWith('.js'));
  testFiles.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
    assertIncludes(content, "'use strict'", `tests/${file}: uses strict mode`);
  });
});

// ═══════════════════════════════════════
// SEO — Meta descriptions on all pages
// ═══════════════════════════════════════

describe('SEO — All HTML files have meta description', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    assert(/meta name="description"/.test(content), `${file}: has meta description`);
  });
});

describe('SEO — All HTML files have single <h1>', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    const h1Count = (content.match(/<h1[\s>]/g) || []).length;
    assert(h1Count <= 1, `${file}: has at most one <h1> (found ${h1Count})`);
  });
});

// ═══════════════════════════════════════
// ACCESSIBILITY — Footer roles
// ═══════════════════════════════════════

describe('Accessibility — All footers have role=contentinfo', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('<footer')) {
      assertIncludes(content, 'role="contentinfo"', `${file}: footer has role="contentinfo"`);
    }
  });
});

describe('Accessibility — All HTML files have role=main on <main>', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('<main')) {
      assertIncludes(content, 'role="main"', `${file}: main has role="main"`);
    }
  });
});

describe('Accessibility — Search inputs have aria-label', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('placeholder="Search')) {
      assertIncludes(content, 'aria-label', `${file}: search input has aria-label`);
    }
  });
});

// ═══════════════════════════════════════
// SECURITY — Firebase hosting headers
// ═══════════════════════════════════════

describe('Security — Firebase config has security headers', () => {
  const fb = fs.readFileSync(path.join(__dirname, '..', 'firebase.json'), 'utf-8');
  assertIncludes(fb, 'X-Content-Type-Options', 'Firebase config has X-Content-Type-Options');
  assertIncludes(fb, 'X-Frame-Options', 'Firebase config has X-Frame-Options');
  assertIncludes(fb, 'X-XSS-Protection', 'Firebase config has X-XSS-Protection');
  assertIncludes(fb, 'Referrer-Policy', 'Firebase config has Referrer-Policy');
  assertIncludes(fb, 'Permissions-Policy', 'Firebase config has Permissions-Policy');
});

describe('Security — Firestore rules exist', () => {
  const rulesPath = path.join(__dirname, '..', 'firestore.rules');
  assert(fs.existsSync(rulesPath), 'firestore.rules exists');
  const content = fs.readFileSync(rulesPath, 'utf-8');
  assertIncludes(content, 'request.auth', 'Firestore rules check authentication');
  assertIncludes(content, 'request.auth.uid', 'Firestore rules validate user identity');
});

describe('Security — Gemini API has safety settings', () => {
  const gemini = fs.readFileSync(path.join(jsDir, 'gemini.js'), 'utf-8');
  assertIncludes(gemini, 'safetySettings', 'Gemini uses safety settings');
  assertIncludes(gemini, 'BLOCK_MEDIUM_AND_ABOVE', 'Safety threshold is BLOCK_MEDIUM_AND_ABOVE');
  assertIncludes(gemini, 'AbortController', 'Uses AbortController for request timeouts');
  assertIncludes(gemini, 'MAX_RETRIES', 'Has retry logic with MAX_RETRIES');
});

// ═══════════════════════════════════════
// PERFORMANCE — Code patterns
// ═══════════════════════════════════════

describe('Performance — Animations use requestAnimationFrame', () => {
  const content = fs.readFileSync(path.join(jsDir, 'animations.js'), 'utf-8');
  assertIncludes(content, 'requestAnimationFrame', 'Uses requestAnimationFrame for smooth rendering');
});

describe('Performance — Map uses Canvas renderer', () => {
  const content = fs.readFileSync(path.join(jsDir, 'stations-data.js'), 'utf-8');
  assertIncludes(content, 'L.canvas', 'Uses Canvas renderer for map performance');
  assertIncludes(content, 'interactive: false', 'Non-interactive markers for performance');
});

describe('Performance — Animations use IntersectionObserver', () => {
  const content = fs.readFileSync(path.join(jsDir, 'animations.js'), 'utf-8');
  assertIncludes(content, 'IntersectionObserver', 'Uses IntersectionObserver for lazy loading');
});

// ═══════════════════════════════════════
// GOOGLE SERVICES — Integration checks
// ═══════════════════════════════════════

describe('Google Services — GA4 integration on all pages', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    assertIncludes(content, 'googletagmanager.com/gtag', `${file}: has GA4 integration`);
  });
});

describe('Google Services — Gemini model is current', () => {
  const gemini = fs.readFileSync(path.join(jsDir, 'gemini.js'), 'utf-8');
  assertIncludes(gemini, 'gemini-2.0-flash', 'Uses gemini-2.0-flash model');
});

// ═══════════════════════════════════════
// ACCESSIBILITY — Skip links & navigation
// ═══════════════════════════════════════

describe('Accessibility — All pages have skip-to-content link', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    assertIncludes(content, 'skip-link', `${file}: has skip-to-content link`);
  });
});

describe('Accessibility — All navs have role=navigation', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('<nav')) {
      assertIncludes(content, 'role="navigation"', `${file}: nav has role="navigation"`);
    }
  });
});

describe('Accessibility — Active links have aria-current=page', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('class="active"')) {
      assertIncludes(content, 'aria-current="page"', `${file}: active link has aria-current="page"`);
    }
  });
});

describe('Accessibility — CSS has prefers-reduced-motion', () => {
  const css = fs.readFileSync(path.join(publicDir, 'css', 'main.css'), 'utf-8');
  assertIncludes(css, 'prefers-reduced-motion', 'CSS respects prefers-reduced-motion');
});

describe('Accessibility — CSS has focus-visible styles', () => {
  const css = fs.readFileSync(path.join(publicDir, 'css', 'main.css'), 'utf-8');
  assertIncludes(css, 'focus-visible', 'CSS has focus-visible outline styles');
});

describe('Accessibility — CSS has skip-link styles', () => {
  const css = fs.readFileSync(path.join(publicDir, 'css', 'main.css'), 'utf-8');
  assertIncludes(css, '.skip-link', 'CSS has skip-link styles');
});

// ═══════════════════════════════════════
// CODE QUALITY — Project tooling files
// ═══════════════════════════════════════

describe('Code Quality — Project has ESLint config', () => {
  const eslintPath = path.join(__dirname, '..', '.eslintrc.json');
  assert(fs.existsSync(eslintPath), '.eslintrc.json exists');
  const config = JSON.parse(fs.readFileSync(eslintPath, 'utf-8'));
  assertType(config.rules, 'object', 'ESLint config has rules');
  assert(config.rules['no-eval'] === 'error', 'ESLint bans eval()');
});

describe('Code Quality — Project has EditorConfig', () => {
  const editorPath = path.join(__dirname, '..', '.editorconfig');
  assert(fs.existsSync(editorPath), '.editorconfig exists');
});

describe('Code Quality — Project has LICENSE', () => {
  const licensePath = path.join(__dirname, '..', 'LICENSE');
  assert(fs.existsSync(licensePath), 'LICENSE file exists');
  const content = fs.readFileSync(licensePath, 'utf-8');
  assertIncludes(content, 'MIT License', 'License is MIT');
});

describe('Code Quality — Project has CONTRIBUTING.md', () => {
  const contribPath = path.join(__dirname, '..', 'CONTRIBUTING.md');
  assert(fs.existsSync(contribPath), 'CONTRIBUTING.md exists');
});

describe('Code Quality — Project has CHANGELOG.md', () => {
  const changelogPath = path.join(__dirname, '..', 'CHANGELOG.md');
  assert(fs.existsSync(changelogPath), 'CHANGELOG.md exists');
});

describe('Code Quality — All JS constants use UPPER_CASE', () => {
  const animations = fs.readFileSync(path.join(jsDir, 'animations.js'), 'utf-8');
  assertIncludes(animations, 'PARTICLE_COUNT_MOBILE', 'animations.js extracts constants');
  assertIncludes(animations, 'MOBILE_BREAKPOINT', 'animations.js has MOBILE_BREAKPOINT constant');
  const stations = fs.readFileSync(path.join(jsDir, 'stations-data.js'), 'utf-8');
  assertIncludes(stations, 'BOOTH_COUNT', 'stations-data.js extracts BOOTH_COUNT constant');
});
