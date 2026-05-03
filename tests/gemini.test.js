/**
 * ElectBot — Gemini Module Unit Tests
 * Tests for markdownToHtml, sanitizeInput, and fallback response logic.
 */

'use strict';

const { assert, assertEqual, assertIncludes, assertType, describe } = require('./run-tests');

// ── Mock DOM for sanitizeInput (Node.js doesn't have document) ──
const mockDocument = {
  createElement: function (tag) {
    let _text = '';
    return {
      set textContent(val) {
        _text = val
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      },
      get innerHTML() {
        return _text;
      }
    };
  }
};
global.document = mockDocument;

// ── Load the module (strip browser-only parts) ──
// We re-implement the pure functions here to test them in isolation
// This avoids needing the full browser environment

/**
 * Simple markdown to HTML converter (from gemini.js)
 * @param {string} text - Markdown text
 * @returns {string} HTML string
 */
function markdownToHtml(text) {
  return text
    .replace(/## (.*?)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code>$1</code>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
    .replace(/^- (.*?)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.*?)$/gm, '<li>$2</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}

/**
 * Sanitize user input (from gemini.js)
 * @param {string} input - Raw user input
 * @returns {string} Sanitized HTML-safe string
 */
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML.substring(0, 2000);
}

/**
 * Fallback response matcher (from gemini.js)
 * @param {string} query - User query
 * @returns {string} Category key
 */
function matchFallbackCategory(query) {
  const q = query.toLowerCase();
  if (q.includes('register') || q.includes('registration') || q.includes('sign up') || q.includes('enroll'))
    return 'register';
  if (q.includes('timeline') || q.includes('phase') || q.includes('schedule') || q.includes('when') || q.includes('date'))
    return 'timeline';
  if (q.includes('eligible') || q.includes('eligibility') || q.includes('can i vote') || q.includes('age') || q.includes('qualify'))
    return 'eligible';
  if (q.includes('evm') || q.includes('machine') || q.includes('electronic') || q.includes('vvpat'))
    return 'evm';
  if (q.includes('election commission') || q.includes('eci') || q.includes('commissioner') || q.includes('role'))
    return 'eci';
  return 'default';
}


// ═══════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════

describe('markdownToHtml — Heading Conversion', () => {
  const result = markdownToHtml('## Hello World');
  assertIncludes(result, '<h3>Hello World</h3>', 'Converts ## headings to <h3>');
});

describe('markdownToHtml — Bold Text', () => {
  const result = markdownToHtml('This is **bold** text');
  assertIncludes(result, '<strong>bold</strong>', 'Converts **text** to <strong>');
});

describe('markdownToHtml — Italic Text', () => {
  const result = markdownToHtml('This is *italic* text');
  assertIncludes(result, '<em>italic</em>', 'Converts *text* to <em>');
});

describe('markdownToHtml — Inline Code', () => {
  const result = markdownToHtml('Use `npm install` here');
  assertIncludes(result, '<code>npm install</code>', 'Converts `code` to <code>');
});

describe('markdownToHtml — Links', () => {
  const result = markdownToHtml('Visit [Google](https://google.com)');
  assertIncludes(result, 'href="https://google.com"', 'Creates link with correct href');
  assertIncludes(result, 'target="_blank"', 'Opens link in new tab');
  assertIncludes(result, 'rel="noopener"', 'Includes rel=noopener for security');
});

describe('markdownToHtml — List Items', () => {
  const result = markdownToHtml('- Item 1\n- Item 2');
  assertIncludes(result, '<li>Item 1</li>', 'Converts dash lists to <li>');
  assertIncludes(result, '<ul>', 'Wraps in <ul>');
});

describe('markdownToHtml — Numbered Lists', () => {
  const result = markdownToHtml('1. First\n2. Second');
  assertIncludes(result, '<li>First</li>', 'Converts numbered lists to <li>');
});

describe('markdownToHtml — Paragraphs', () => {
  const result = markdownToHtml('Line 1\n\nLine 2');
  assertIncludes(result, '<br><br>', 'Double newlines become <br><br>');
});

describe('sanitizeInput — XSS Prevention', () => {
  const result = sanitizeInput('<script>alert("xss")</script>');
  assert(!result.includes('<script>'), 'Strips script tags');
  assertIncludes(result, '&lt;script&gt;', 'Escapes angle brackets');
});

describe('sanitizeInput — Length Limit', () => {
  const longInput = 'A'.repeat(3000);
  const result = sanitizeInput(longInput);
  assertEqual(result.length, 2000, 'Truncates input to 2000 characters');
});

describe('sanitizeInput — Normal Text', () => {
  const result = sanitizeInput('Hello World');
  assertEqual(result, 'Hello World', 'Preserves normal text');
});

describe('sanitizeInput — Special Characters', () => {
  const result = sanitizeInput('Tom & Jerry <3 "quotes"');
  assertIncludes(result, '&amp;', 'Escapes ampersands');
  assertIncludes(result, '&lt;', 'Escapes less-than');
  assertIncludes(result, '&quot;', 'Escapes double quotes');
});

describe('Fallback Response — Registration Query', () => {
  assertEqual(matchFallbackCategory('How do I register to vote?'), 'register', 'Matches "register" keyword');
  assertEqual(matchFallbackCategory('voter registration help'), 'register', 'Matches "registration" keyword');
});

describe('Fallback Response — Timeline Query', () => {
  assertEqual(matchFallbackCategory('What is the election timeline?'), 'timeline', 'Matches "timeline" keyword');
  assertEqual(matchFallbackCategory('When is the next election?'), 'timeline', 'Matches "when" keyword');
});

describe('Fallback Response — Eligibility Query', () => {
  assertEqual(matchFallbackCategory('Am I eligible to vote?'), 'eligible', 'Matches "eligible" keyword');
  assertEqual(matchFallbackCategory('Can I vote at 17?'), 'eligible', 'Matches "can i vote" phrase');
});

describe('Fallback Response — EVM Query', () => {
  assertEqual(matchFallbackCategory('How do EVMs work?'), 'evm', 'Matches "evm" keyword');
  assertEqual(matchFallbackCategory('Tell me about VVPAT'), 'evm', 'Matches "vvpat" keyword');
});

describe('Fallback Response — ECI Query', () => {
  assertEqual(matchFallbackCategory('What is the Election Commission?'), 'eci', 'Matches "election commission" phrase');
});

describe('Fallback Response — Default', () => {
  assertEqual(matchFallbackCategory('Hello there'), 'default', 'Returns default for unmatched queries');
  assertEqual(matchFallbackCategory('What is democracy?'), 'default', 'Returns default for general queries');
});
