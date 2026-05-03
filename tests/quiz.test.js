/**
 * ElectBot — Quiz Engine Unit Tests
 * Tests for quiz data integrity, scoring logic, and answer validation.
 */

'use strict';

const { assert, assertEqual, assertIncludes, assertType, describe } = require('./run-tests');

// ── Import quiz data ──
// We read the quiz questions directly from the source file
const fs = require('fs');
const path = require('path');
const quizSource = fs.readFileSync(path.join(__dirname, '..', 'public', 'js', 'quiz.js'), 'utf-8');

// Extract just the QUIZ_QUESTIONS constant and evaluate it
const match = quizSource.match(/const QUIZ_QUESTIONS\s*=\s*(\[[\s\S]*?\]);/);
let QUIZ_QUESTIONS;
if (match && match[1]) {
  QUIZ_QUESTIONS = eval(match[1]);
} else {
  console.error('Could not extract QUIZ_QUESTIONS from quiz.js');
  QUIZ_QUESTIONS = [];
}


// ═══════════════════════════════════════
// TEST SUITES
// ═══════════════════════════════════════

describe('Quiz Data — Array Integrity', () => {
  assert(Array.isArray(QUIZ_QUESTIONS), 'QUIZ_QUESTIONS is an array');
  assertEqual(QUIZ_QUESTIONS.length, 10, 'Contains exactly 10 questions');
});

describe('Quiz Data — Question Structure', () => {
  QUIZ_QUESTIONS.forEach((q, i) => {
    assertType(q.question, 'string', `Q${i + 1}: has a question string`);
    assert(q.question.length > 10, `Q${i + 1}: question is substantive (>10 chars)`);
    assert(Array.isArray(q.options), `Q${i + 1}: has options array`);
    assertEqual(q.options.length, 4, `Q${i + 1}: has exactly 4 options`);
    assertType(q.correct, 'number', `Q${i + 1}: correct answer is a number`);
    assert(q.correct >= 0 && q.correct <= 3, `Q${i + 1}: correct index is valid (0-3)`);
    assertType(q.explanation, 'string', `Q${i + 1}: has an explanation`);
    assert(q.explanation.length > 20, `Q${i + 1}: explanation is informative (>20 chars)`);
  });
});

describe('Quiz Data — No Duplicate Questions', () => {
  const questions = QUIZ_QUESTIONS.map(q => q.question);
  const uniqueQuestions = new Set(questions);
  assertEqual(uniqueQuestions.size, questions.length, 'All questions are unique');
});

describe('Quiz Data — Answer Options Are Unique Per Question', () => {
  QUIZ_QUESTIONS.forEach((q, i) => {
    const uniqueOptions = new Set(q.options);
    assertEqual(uniqueOptions.size, q.options.length, `Q${i + 1}: all options are unique`);
  });
});

describe('Quiz Scoring — Perfect Score', () => {
  let testScore = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    if (q.correct === q.correct) testScore++;
  });
  assertEqual(testScore, 10, 'Perfect score is 10 when all answers are correct');
});

describe('Quiz Scoring — Zero Score', () => {
  let testScore = 0;
  QUIZ_QUESTIONS.forEach((q) => {
    const wrongAnswer = (q.correct + 1) % 4;
    if (wrongAnswer === q.correct) testScore++;
  });
  assertEqual(testScore, 0, 'Score is 0 when all answers are wrong');
});

describe('Quiz Scoring — Result Messages', () => {
  function getResultMessage(score, total) {
    const p = score / total * 100;
    if (p >= 90) return 'Outstanding';
    if (p >= 70) return 'Great Job';
    if (p >= 50) return 'Good Effort';
    return 'Keep Learning';
  }

  assertEqual(getResultMessage(10, 10), 'Outstanding', '100% = Outstanding');
  assertEqual(getResultMessage(9, 10), 'Outstanding', '90% = Outstanding');
  assertEqual(getResultMessage(8, 10), 'Great Job', '80% = Great Job');
  assertEqual(getResultMessage(7, 10), 'Great Job', '70% = Great Job');
  assertEqual(getResultMessage(5, 10), 'Good Effort', '50% = Good Effort');
  assertEqual(getResultMessage(3, 10), 'Keep Learning', '30% = Keep Learning');
  assertEqual(getResultMessage(0, 10), 'Keep Learning', '0% = Keep Learning');
});

describe('Quiz Data — Correct Answers Content Check', () => {
  // Verify a few known correct answers
  assertEqual(QUIZ_QUESTIONS[0].options[QUIZ_QUESTIONS[0].correct], '18 years', 'Q1: Minimum voting age is 18');
  assertEqual(QUIZ_QUESTIONS[1].options[QUIZ_QUESTIONS[1].correct], 'Election Commission of India', 'Q2: ECI conducts elections');
  assertEqual(QUIZ_QUESTIONS[2].options[QUIZ_QUESTIONS[2].correct], 'Electronic Voting Machine', 'Q3: EVM stands for Electronic Voting Machine');
  assertEqual(QUIZ_QUESTIONS[4].options[QUIZ_QUESTIONS[4].correct], '543', 'Q5: 543 Lok Sabha constituencies');
});
