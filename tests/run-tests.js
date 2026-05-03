/**
 * ElectBot — Lightweight Test Runner
 * Executes all test suites and reports results.
 * No external dependencies required.
 */

'use strict';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

/**
 * Assert that a condition is true
 * @param {boolean} condition - The condition to test
 * @param {string} message - Description of the test
 */
function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.log(`  ❌ FAIL: ${message}`);
  }
}

/**
 * Assert strict equality between two values
 * @param {*} actual - The actual value
 * @param {*} expected - The expected value
 * @param {string} message - Description of the test
 */
function assertEqual(actual, expected, message) {
  totalTests++;
  if (actual === expected) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(`${message} (expected: "${expected}", got: "${actual}")`);
    console.log(`  ❌ FAIL: ${message}`);
    console.log(`     Expected: "${expected}"`);
    console.log(`     Actual:   "${actual}"`);
  }
}

/**
 * Assert that a value includes a substring
 * @param {string} actual - The actual string
 * @param {string} substring - The expected substring
 * @param {string} message - Description of the test
 */
function assertIncludes(actual, substring, message) {
  totalTests++;
  if (typeof actual === 'string' && actual.includes(substring)) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(`${message} (expected to include: "${substring}")`);
    console.log(`  ❌ FAIL: ${message}`);
    console.log(`     Expected to include: "${substring}"`);
    console.log(`     Actual: "${actual}"`);
  }
}

/**
 * Assert that a value is of the expected type
 * @param {*} value - The value to check
 * @param {string} expectedType - The expected typeof result
 * @param {string} message - Description of the test
 */
function assertType(value, expectedType, message) {
  totalTests++;
  if (typeof value === expectedType) {
    passedTests++;
    console.log(`  ✅ PASS: ${message}`);
  } else {
    failedTests++;
    failures.push(`${message} (expected type: ${expectedType}, got: ${typeof value})`);
    console.log(`  ❌ FAIL: ${message}`);
  }
}

/**
 * Describe a test suite
 * @param {string} name - Suite name
 * @param {Function} fn - Suite function
 */
function describe(name, fn) {
  console.log(`\n📦 ${name}`);
  console.log('─'.repeat(50));
  fn();
}

// Export utilities for test files
module.exports = { assert, assertEqual, assertIncludes, assertType, describe };

// ── Load and run all test suites ──
console.log('\n╔══════════════════════════════════════╗');
console.log('║   ElectBot — Test Runner v1.0        ║');
console.log('╚══════════════════════════════════════╝');

require('./gemini.test.js');
require('./quiz.test.js');
require('./config.test.js');

// ── Summary ──
console.log('\n══════════════════════════════════════');
console.log(`📊 Results: ${passedTests}/${totalTests} passed, ${failedTests} failed`);
if (failedTests > 0) {
  console.log('\n🔴 Failures:');
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('\n🟢 All tests passed!');
  process.exit(0);
}
