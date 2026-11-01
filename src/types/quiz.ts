export type Difficulty = 'easy' | 'medium' | 'hard';

export type UserRole = 'user' | 'admin';

export type UserStatus = 'active' | 'blocked';

export interface Category {
  id: number;
  name: string;
  shortLetter: string;
  description: string;
  iconName: string;
  accentColor: string;
}

export interface Option {
  id: number;
  text: string;
  isCorrect?: boolean; // sanitized during active quiz
}

export interface Question {
  id: number;
  categoryId: number;
  categoryName: string;
  questionText: string;
  explanation: string;
  difficulty: Difficulty;
  options: Option[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
}

export interface QuizAttemptReview {
  questionId: number;
  questionText: string;
  explanation: string;
  chosenOptionId: number | null;
  chosenOptionText: string | null;
  correctOptionId: number;
  correctOptionText: string;
  isCorrect: boolean;
}

export interface QuizResult {
  id: number;
  userId: number;
  userName: string;
  categoryId: number;
  categoryName: string;
  difficulty: Difficulty;
  score: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  attemptDate: string;
  timedOut: boolean;
  review: QuizAttemptReview[];
}

export interface LeaderboardEntry {
  userId: number;
  name: string;
  quizzes: number;
  totalScore: number;
  averagePercent: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  summary: string;
  keyPoints: string[];
  realWorldExample: string;
  quickDefenseTip: string;
}
