/**
 * ElectBot — Configuration & Security Tests
 * Validates config structure, security headers, and HTML accessibility compliance.
 */

'use strict';

const { assert, assertEqual, assertIncludes, assertType, describe } = require('./run-tests');
const fs = require('fs');
const path = require('path');

// ── Read project files ──
const publicDir = path.join(__dirname, '..', 'public');
const htmlFiles = fs.readdirSync(publicDir).filter(f => f.endsWith('.html'));

// ═══════════════════════════════════════
// CONFIG STRUCTURE TESTS
// ═══════════════════════════════════════

describe('Config — inject-config.js exists', () => {
  const injectPath = path.join(__dirname, '..', 'inject-config.js');
  assert(fs.existsSync(injectPath), 'inject-config.js exists in project root');
});

describe('Config — .gitignore protects config.js', () => {
  const gitignore = fs.readFileSync(path.join(__dirname, '..', '.gitignore'), 'utf-8');
  assertIncludes(gitignore, 'config.js', '.gitignore includes config.js to protect API keys');
});

describe('Config — .env.example exists', () => {
  const envExample = path.join(__dirname, '..', '.env.example');
  assert(fs.existsSync(envExample), '.env.example exists for developer setup');
});

// ═══════════════════════════════════════
// HTML ACCESSIBILITY TESTS
// ═══════════════════════════════════════

describe('Accessibility — All HTML files have lang attribute', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    assertIncludes(content, 'lang="en"', `${file}: has lang="en" on <html>`);
  });
});

describe('Accessibility — All HTML files have viewport meta', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    assertIncludes(content, 'viewport', `${file}: has viewport meta tag`);
  });
});

describe('Accessibility — All HTML files have a <title>', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    assert(/<title>.+<\/title>/.test(content), `${file}: has a non-empty <title>`);
  });
});

describe('Accessibility — Navigation toggle has aria-label', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('navToggle')) {
      assertIncludes(content, 'aria-label', `${file}: nav toggle has aria-label`);
    }
  });
});

describe('Accessibility — Theme toggle has aria-label', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    if (content.includes('themeToggle')) {
      assertIncludes(content, 'aria-label="Toggle theme"', `${file}: theme toggle has descriptive aria-label`);
    }
  });
});

// ═══════════════════════════════════════
// SECURITY TESTS
// ═══════════════════════════════════════

describe('Security — External links have rel=noopener', () => {
  htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(publicDir, file), 'utf-8');
    const externalLinks = content.match(/target="_blank"/g);
    if (externalLinks) {
      // Check that noopener appears at least as many times
      const noopenerCount = (content.match(/rel="noopener"/g) || []).length;
      assert(noopenerCount >= externalLinks.length,
        `${file}: all target="_blank" links have rel="noopener" (${noopenerCount}/${externalLinks.length})`);
    }
  });
});

describe('Security — Gemini.js has input sanitization', () => {
  const geminiSource = fs.readFileSync(path.join(publicDir, 'js', 'gemini.js'), 'utf-8');
  assertIncludes(geminiSource, 'sanitizeInput', 'gemini.js includes sanitizeInput function');
  assertIncludes(geminiSource, 'textContent', 'sanitizeInput uses textContent for XSS prevention');
});

// ═══════════════════════════════════════
// FILE STRUCTURE TESTS
// ═══════════════════════════════════════

describe('File Structure — Required files exist', () => {
  const requiredFiles = [
    'public/index.html',
    'public/chat.html',
    'public/map.html',
    'public/quiz.html',
    'public/timeline.html',
    'public/guide.html',
    'public/news.html',
    'public/plan.html',
    'public/js/gemini.js',
    'public/js/animations.js',
    'public/js/quiz.js',
    'public/css/main.css',
    'public/css/material.css',
    'README.md',
    'package.json',
    'firebase.json'
  ];

  requiredFiles.forEach(f => {
    const fullPath = path.join(__dirname, '..', f);
    assert(fs.existsSync(fullPath), `${f} exists`);
  });
});

describe('File Structure — Package.json has required fields', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8'));
  assertType(pkg.name, 'string', 'package.json has a name');
  assertType(pkg.version, 'string', 'package.json has a version');
  assertType(pkg.description, 'string', 'package.json has a description');
  assertType(pkg.scripts, 'object', 'package.json has scripts');
  assert(pkg.scripts.test !== undefined, 'package.json has a test script');
});
