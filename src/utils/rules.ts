import { Difficulty, QuizAttemptReview, Question, AchievementBadge } from '../types/quiz';

export const PASS_PERCENT = 60;

export const QUIZ_CONFIG: Record<Difficulty, { questionsCount: number; timeSeconds: number }> = {
  easy: { questionsCount: 5, timeSeconds: 300 },
  medium: { questionsCount: 10, timeSeconds: 600 },
  hard: { questionsCount: 15, timeSeconds: 900 },
};

export const TOPIC_FEEDBACK_TEXT: Record<string, string> = {
  'Phishing': 'spotting phishing attempts and deceptive links',
  'Malware': 'defending against viruses, ransomware, and spyware',
  'Password Security': 'maintaining impenetrable credential hygiene',
  'Online Safety': 'safeguarding personal data and browsing securely',
};

/**
 * Calculates raw score and reviews from user selections
 */
export function evaluateQuizSubmission(
  questions: Question[],
  selectedOptionIds: Record<number, number>,
  timedOut: boolean = false
): { score: number; review: QuizAttemptReview[] } {
  let score = 0;
  const review: QuizAttemptReview[] = [];

  for (const q of questions) {
    const correctOpt = q.options.find(o => o.isCorrect);
    const chosenId = timedOut ? null : selectedOptionIds[q.id] ?? null;
    const chosenOpt = chosenId ? q.options.find(o => o.id === chosenId) : null;
    const isCorrect = Boolean(chosenOpt && chosenOpt.isCorrect);

    if (isCorrect) {
      score += 1;
    }

    review.push({
      questionId: q.id,
      questionText: q.questionText,
      explanation: q.explanation,
      chosenOptionId: chosenId,
      chosenOptionText: chosenOpt ? chosenOpt.text : null,
      correctOptionId: correctOpt ? correctOpt.id : 0,
      correctOptionText: correctOpt ? correctOpt.text : '',
      isCorrect,
    });
  }

  return { score, review };
}

/**
 * Calculates score percentage
 */
export function calculatePercentage(score: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((score * 100) / total);
}

/**
 * Determines whether the user passed
 */
export function isPassed(percentage: number, threshold: number = PASS_PERCENT): boolean {
  return percentage >= threshold;
}

/**
 * Generates encouragement message based on score & category
 */
export function getResultMessage(categoryName: string, percentage: number): string {
  const topic = TOPIC_FEEDBACK_TEXT[categoryName] || categoryName.toLowerCase();
  if (percentage >= 80) {
    return `Excellent work! You demonstrated mastery at ${topic}.`;
  }
  if (percentage >= PASS_PERCENT) {
    return `Well done! You passed and are getting stronger at ${topic}.`;
  }
  return `Keep practicing! Review the detailed security explanations below and attempt again.`;
}

/**
 * Formats seconds into MM:SS display
 */
export function formatTimer(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Evaluates achievement badges from user history
 */
export function computeBadges(results: Array<{ score: number; totalQuestions: number; percentage: number; categoryName: string }>): AchievementBadge[] {
  const attempts = results.length;
  const bestScore = attempts > 0 ? Math.max(...results.map(r => r.percentage)) : 0;
  const avgScore = attempts > 0 ? Math.round(results.reduce((acc, r) => acc + r.percentage, 0) / attempts) : 0;

  const passedPhishing = results.some(r => r.categoryName === 'Phishing' && r.percentage === 100);
  const passedMalware = results.some(r => r.categoryName === 'Malware' && r.percentage === 100);
  const passedPassword = results.some(r => r.categoryName === 'Password Security' && r.percentage === 100);
  const passedSafety = results.some(r => r.categoryName === 'Online Safety' && r.percentage === 100);

  return [
    {
      id: 'first_quiz',
      title: 'First Step',
      description: 'Completed your first cybersecurity quiz',
      icon: 'Shield',
      unlocked: attempts >= 1,
    },
    {
      id: 'quiz_explorer',
      title: 'Quiz Explorer',
      description: 'Completed 5 or more quiz challenges',
      icon: 'Compass',
      unlocked: attempts >= 5,
    },
    {
      id: 'cyber_pro',
      title: 'Cybersecurity Pro',
      description: 'Scored 80% or higher on any quiz',
      icon: 'Award',
      unlocked: bestScore >= 80,
    },
    {
      id: 'consistent_learner',
      title: 'Consistent Learner',
      description: 'Maintained 60%+ average across 3+ attempts',
      icon: 'Zap',
      unlocked: avgScore >= 60 && attempts >= 3,
    },
    {
      id: 'phishing_hawk',
      title: 'Phishing Hunter',
      description: 'Achieved a perfect 100% on Phishing',
      icon: 'Eye',
      unlocked: passedPhishing,
    },
    {
      id: 'malware_shield',
      title: 'Malware Sentinel',
      description: 'Achieved a perfect 100% on Malware Defense',
      icon: 'Lock',
      unlocked: passedMalware,
    },
    {
      id: 'cipher_master',
      title: 'Cipher Master',
      description: 'Achieved a perfect 100% on Password Security',
      icon: 'Key',
      unlocked: passedPassword,
    },
    {
      id: 'iron_guardian',
      title: 'Iron Guardian',
      description: 'Aced all 4 security categories with 100%',
      icon: 'Crown',
      unlocked: passedPhishing && passedMalware && passedPassword && passedSafety,
    },
  ];
}

/**
 * Computes password security rating & entropy estimate
 */
export function checkPasswordStrength(password: string): {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
  crackTimeEstimate: string;
} {
  const feedback: string[] = [];
  if (!password) {
    return { score: 0, label: 'Very Weak', feedback: ['Password is empty'], crackTimeEstimate: 'Instant' };
  }

  let points = 0;
  if (password.length >= 8) points++;
  if (password.length >= 12) points++;
  if (password.length >= 16) points++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) points++;
  if (/[0-9]/.test(password)) points++;
  if (/[^A-Za-z0-9]/.test(password)) points++;

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (password.length < 8) feedback.push('Make it at least 8 characters long (12+ recommended).');
  if (!hasLower || !hasUpper) feedback.push('Mix both uppercase and lowercase letters.');
  if (!hasNumber) feedback.push('Include at least one numerical digit.');
  if (!hasSpecial) feedback.push('Add special symbols (e.g. !@#$%^&*).');

  // Common weak words check
  const lower = password.toLowerCase();
  const commonPatterns = ['password', '123456', 'qwerty', 'admin', 'welcome', 'login'];
  if (commonPatterns.some(p => lower.includes(p))) {
    feedback.push('Avoid common words or predictable dictionary terms.');
    points = Math.max(0, points - 2);
  }

  let score = 0;
  let label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong' = 'Very Weak';
  let crackTimeEstimate = 'Instantly';

  if (points <= 1) {
    score = 0;
    label = 'Very Weak';
    crackTimeEstimate = '< 1 second';
  } else if (points === 2) {
    score = 1;
    label = 'Weak';
    crackTimeEstimate = 'a few minutes';
  } else if (points === 3 || points === 4) {
    score = 2;
    label = 'Fair';
    crackTimeEstimate = 'several days to months';
  } else if (points === 5) {
    score = 3;
    label = 'Strong';
    crackTimeEstimate = 'centuries';
  } else {
    score = 4;
    label = 'Very Strong';
    crackTimeEstimate = 'millions of years';
  }

  return { score, label, feedback, crackTimeEstimate };
}

/**
 * Heuristic Phishing URL Analyzer
 */
export function analyzePhishingUrl(rawUrl: string): {
  isSuspicious: boolean;
  riskScore: number; // 0 to 100
  flags: string[];
  safeAdvice: string;
} {
  const flags: string[] = [];
  let risk = 0;
  const trimmed = rawUrl.trim();

  if (!trimmed) {
    return { isSuspicious: false, riskScore: 0, flags: [], safeAdvice: 'Enter a URL to analyze' };
  }

  // Check scheme
  if (trimmed.startsWith('http://')) {
    flags.push('Unencrypted connection (HTTP instead of HTTPS)');
    risk += 25;
  }

  // Check IP address in host
  const ipPattern = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i;
  if (ipPattern.test(trimmed)) {
    flags.push('Direct IP address used instead of legitimate domain name');
    risk += 40;
  }

  // Check homoglyphs / deceptive lookalikes
  const deceptivePatterns = [
    { pattern: /paypa[1l]-/i, brand: 'PayPal' },
    { pattern: /g00gle|gooogle/i, brand: 'Google' },
    { pattern: /micros0ft|micr0soft/i, brand: 'Microsoft' },
    { pattern: /appl[e3]-support/i, brand: 'Apple' },
    { pattern: /amaz0n|arnazon/i, brand: 'Amazon' },
    { pattern: /netf[li]ix-/i, brand: 'Netflix' },
  ];

  for (const { pattern, brand } of deceptivePatterns) {
    if (pattern.test(trimmed)) {
      flags.push(`Suspicious brand imitation detected (spoofing ${brand})`);
      risk += 45;
    }
  }

  // Double extensions (e.g., .pdf.exe)
  if (/\.(pdf|docx?|jpg|png|xlsx?)\.(exe|scr|bat|vbs|zip)/i.test(trimmed)) {
    flags.push('Deceptive double-extension executable file payload detected');
    risk += 50;
  }

  // Excessive subdomains
  try {
    const parsed = new URL(trimmed.startsWith('http') ? trimmed : `https://${trimmed}`);
    const hostParts = parsed.hostname.split('.');
    if (hostParts.length > 4) {
      flags.push('Excessive nested subdomains often used to obscure malicious origins');
      risk += 20;
    }
  } catch {
    flags.push('Malformed URL syntax');
    risk += 15;
  }

  const riskScore = Math.min(100, risk);
  const isSuspicious = riskScore >= 35;

  let safeAdvice = 'Always verify the primary domain name in your browser address bar.';
  if (riskScore >= 60) {
    safeAdvice = 'High threat! Do not click this link, download files, or enter credentials.';
  } else if (riskScore >= 30) {
    safeAdvice = 'Caution advised. Inspect the sender source before interacting.';
  }

  return { isSuspicious, riskScore, flags, safeAdvice };
}
