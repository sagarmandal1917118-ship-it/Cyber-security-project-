import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculatePercentage,
  isPassed,
  formatTimer,
  checkPasswordStrength,
  analyzePhishingUrl,
  evaluateQuizSubmission,
  computeBadges,
} from './rules';
import { Question } from '../types/quiz';

test('calculatePercentage calculates accurate rounded percentage', () => {
  assert.equal(calculatePercentage(9, 10), 90);
  assert.equal(calculatePercentage(1, 3), 33);
  assert.equal(calculatePercentage(2, 3), 67);
  assert.equal(calculatePercentage(0, 5), 0);
  assert.equal(calculatePercentage(5, 5), 100);
});

test('isPassed checks threshold properly with default 60%', () => {
  assert.equal(isPassed(60), true);
  assert.equal(isPassed(59), false);
  assert.equal(isPassed(100), true);
  assert.equal(isPassed(0), false);
});

test('formatTimer formats minutes and seconds cleanly', () => {
  assert.equal(formatTimer(300), '05:00');
  assert.equal(formatTimer(59), '00:59');
  assert.equal(formatTimer(0), '00:00');
  assert.equal(formatTimer(900), '15:00');
});

test('checkPasswordStrength identifies weak vs strong passwords', () => {
  const weak = checkPasswordStrength('password123');
  assert.ok(weak.score <= 1);
  assert.equal(weak.label, 'Very Weak');

  const strong = checkPasswordStrength('Tr!ee7$Moon#Bk9');
  assert.ok(strong.score >= 3);
  assert.ok(strong.label === 'Strong' || strong.label === 'Very Strong');
});

test('analyzePhishingUrl identifies suspicious patterns', () => {
  const spoofed = analyzePhishingUrl('http://support@paypa1-security.com/login');
  assert.equal(spoofed.isSuspicious, true);
  assert.ok(spoofed.riskScore > 40);

  const clean = analyzePhishingUrl('https://paypal.com/signin');
  assert.equal(clean.isSuspicious, false);
});

test('evaluateQuizSubmission computes correct score and review metadata', () => {
  const mockQuestions: Question[] = [
    {
      id: 1,
      categoryId: 1,
      categoryName: 'Phishing',
      questionText: 'Test Q1',
      explanation: 'Explanation 1',
      difficulty: 'easy',
      options: [
        { id: 101, text: 'Opt 1', isCorrect: false },
        { id: 102, text: 'Opt 2 (correct)', isCorrect: true },
      ],
    },
    {
      id: 2,
      categoryId: 1,
      categoryName: 'Phishing',
      questionText: 'Test Q2',
      explanation: 'Explanation 2',
      difficulty: 'easy',
      options: [
        { id: 201, text: 'Opt A (correct)', isCorrect: true },
        { id: 202, text: 'Opt B', isCorrect: false },
      ],
    },
  ];

  const result = evaluateQuizSubmission(mockQuestions, { 1: 102, 2: 202 }, false);
  assert.equal(result.score, 1);
  assert.equal(result.review.length, 2);
  assert.equal(result.review[0].isCorrect, true);
  assert.equal(result.review[1].isCorrect, false);
});

test('computeBadges unlocks expected badges based on results', () => {
  const results = [
    { score: 5, totalQuestions: 5, percentage: 100, categoryName: 'Phishing' },
    { score: 4, totalQuestions: 5, percentage: 80, categoryName: 'Malware' },
    { score: 3, totalQuestions: 5, percentage: 60, categoryName: 'Password Security' },
  ];
  const badges = computeBadges(results);
  const firstBadge = badges.find(b => b.id === 'first_quiz');
  assert.equal(firstBadge?.unlocked, true);

  const phishingHawk = badges.find(b => b.id === 'phishing_hawk');
  assert.equal(phishingHawk?.unlocked, true);

  const explorer = badges.find(b => b.id === 'quiz_explorer');
  assert.equal(explorer?.unlocked, false); // only 3 attempts
});
