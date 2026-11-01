import {
  Category,
  Question,
  User,
  QuizResult,
  LeaderboardEntry,
  Difficulty,
  UserRole,
  UserStatus,
} from '../types/quiz';
import {
  SEED_CATEGORIES,
  buildInitialQuestions,
  INITIAL_USERS,
  INITIAL_RESULTS,
} from '../data/seedData';

const STORAGE_KEYS = {
  CURRENT_USER: 'cyberquiz_current_user',
  USERS: 'cyberquiz_users',
  QUESTIONS: 'cyberquiz_questions',
  CATEGORIES: 'cyberquiz_categories',
  RESULTS: 'cyberquiz_results',
};

// Initialize persistent state if missing
export function initializeStorage(): void {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }

  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(SEED_CATEGORIES));
  }

  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    const questions = buildInitialQuestions();
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  }

  if (!localStorage.getItem(STORAGE_KEYS.RESULTS)) {
    localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(INITIAL_RESULTS));
  }

  // Set default logged in user if none selected (Alex Morgan as student user)
  if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
    const defaultUser = INITIAL_USERS[1]; // Alex Morgan
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(defaultUser));
  }
}

// Current User Session
export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return INITIAL_USERS[1];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  }
}

// Users management
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  } catch {
    return INITIAL_USERS;
  }
}

export function registerUser(name: string, email: string, role: UserRole = 'user'): { user?: User; error?: string } {
  const users = getUsers();
  const lower = email.trim().toLowerCase();

  if (users.some(u => u.email.toLowerCase() === lower)) {
    return { error: 'An account with this email address is already registered.' };
  }

  const newUser: User = {
    id: Date.now(),
    name: name.trim(),
    email: lower,
    role,
    status: 'active',
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  setCurrentUser(newUser);
  return { user: newUser };
}

export function loginUser(email: string): { user?: User; error?: string } {
  const users = getUsers();
  const lower = email.trim().toLowerCase();
  const found = users.find(u => u.email.toLowerCase() === lower);

  if (!found) {
    return { error: 'Account not found. Please check your email or register.' };
  }

  if (found.status === 'blocked') {
    return { error: 'This account has been suspended by an administrator.' };
  }

  setCurrentUser(found);
  return { user: found };
}

export function updateUserStatus(userId: number, status: UserStatus): void {
  const users = getUsers().map(u => (u.id === userId ? { ...u, status } : u));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const curr = getCurrentUser();
  if (curr && curr.id === userId) {
    setCurrentUser({ ...curr, status });
  }
}

export function deleteUser(userId: number): void {
  const users = getUsers().filter(u => u.id !== userId);
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const curr = getCurrentUser();
  if (curr && curr.id === userId) {
    setCurrentUser(null);
  }
}

export function updateUserName(userId: number, newName: string): void {
  const users = getUsers().map(u => (u.id === userId ? { ...u, name: newName } : u));
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

  const curr = getCurrentUser();
  if (curr && curr.id === userId) {
    setCurrentUser({ ...curr, name: newName });
  }
}

// Categories
export function getCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : SEED_CATEGORIES;
  } catch {
    return SEED_CATEGORIES;
  }
}

// Questions
export function getQuestions(): Question[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    return raw ? JSON.parse(raw) : buildInitialQuestions();
  } catch {
    return buildInitialQuestions();
  }
}

export function getQuizQuestions(categoryId: number, difficulty: Difficulty, count: number): Question[] {
  const all = getQuestions();
  const pool = all.filter(q => q.categoryId === categoryId && q.difficulty === difficulty);

  // If pool is smaller than count, fill with same category
  let combined = [...pool];
  if (combined.length < count) {
    const fallback = all.filter(q => q.categoryId === categoryId && q.difficulty !== difficulty);
    combined = combined.concat(fallback);
  }

  // Shuffle questions
  const shuffled = [...combined].sort(() => Math.random() - 0.5).slice(0, count);

  // Also randomize options for each question so answers aren't in predictable order
  return shuffled.map(q => ({
    ...q,
    options: [...q.options].sort(() => Math.random() - 0.5),
  }));
}

export function addQuestion(q: Omit<Question, 'id'>): Question {
  const questions = getQuestions();
  const newQuestion: Question = {
    ...q,
    id: Date.now(),
  };
  questions.unshift(newQuestion);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  return newQuestion;
}

export function updateQuestion(updated: Question): void {
  const questions = getQuestions().map(q => (q.id === updated.id ? updated : q));
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

export function deleteQuestion(questionId: number): void {
  const questions = getQuestions().filter(q => q.id !== questionId);
  localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
}

// Quiz Results
export function getResults(): QuizResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESULTS);
    return raw ? JSON.parse(raw) : INITIAL_RESULTS;
  } catch {
    return INITIAL_RESULTS;
  }
}

export function saveQuizResult(result: Omit<QuizResult, 'id'>): QuizResult {
  const results = getResults();
  const newResult: QuizResult = {
    ...result,
    id: Date.now(),
  };
  results.unshift(newResult);
  localStorage.setItem(STORAGE_KEYS.RESULTS, JSON.stringify(results));
  return newResult;
}

export function getUserResults(userId: number): QuizResult[] {
  return getResults().filter(r => r.userId === userId);
}

export function getResultById(resultId: number): QuizResult | undefined {
  return getResults().find(r => r.id === resultId);
}

// Leaderboard calculation
export function getLeaderboard(): LeaderboardEntry[] {
  const results = getResults();
  const users = getUsers().filter(u => u.role === 'user' && u.status === 'active');

  const statsMap: Record<number, { name: string; quizzes: number; totalScore: number; sumPercent: number }> = {};

  for (const u of users) {
    statsMap[u.id] = {
      name: u.name,
      quizzes: 0,
      totalScore: 0,
      sumPercent: 0,
    };
  }

  for (const r of results) {
    if (statsMap[r.userId]) {
      statsMap[r.userId].quizzes += 1;
      statsMap[r.userId].totalScore += r.score;
      statsMap[r.userId].sumPercent += r.percentage;
    }
  }

  const entries: LeaderboardEntry[] = Object.entries(statsMap)
    .filter(([_, data]) => data.quizzes > 0)
    .map(([userIdStr, data]) => ({
      userId: Number(userIdStr),
      name: data.name,
      quizzes: data.quizzes,
      totalScore: data.totalScore,
      averagePercent: Math.round(data.sumPercent / data.quizzes),
    }));

  // Sort by total score descending, then average percent descending, then quizzes
  return entries.sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.averagePercent !== a.averagePercent) return b.averagePercent - a.averagePercent;
    return b.quizzes - a.quizzes;
  });
}

// Reset data helper
export function resetPlatformData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.RESULTS);
  localStorage.removeItem(STORAGE_KEYS.USERS);
  initializeStorage();
}
