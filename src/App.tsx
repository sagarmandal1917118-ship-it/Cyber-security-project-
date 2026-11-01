import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DashboardView } from './components/DashboardView';
import { QuizView } from './components/QuizView';
import { ResultView } from './components/ResultView';
import { LearnView } from './components/LearnView';
import { AnalyticsView } from './components/AnalyticsView';
import { HistoryView } from './components/HistoryView';
import { LeaderboardView } from './components/LeaderboardView';
import { ProfileView } from './components/ProfileView';
import { SecurityToolsView } from './components/SecurityToolsView';
import { AdminView } from './components/AdminView';
import { CertificateModal } from './components/CertificateModal';
import { AuthModal } from './components/AuthModal';

import {
  initializeStorage,
  getCurrentUser,
  setCurrentUser,
  getCategories,
  getUserResults,
  getQuizQuestions,
  saveQuizResult,
  getLeaderboard,
  loginUser,
} from './utils/storage';
import { Category, Question, QuizResult, User, Difficulty } from './types/quiz';
import { QUIZ_CONFIG, evaluateQuizSubmission, calculatePercentage, isPassed } from './utils/rules';

export default function App() {
  const [currentUser, setCurrentUserState] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<string>('home');
  const [categories, setCategories] = useState<Category[]>([]);
  const [userResults, setUserResults] = useState<QuizResult[]>([]);

  // Active Quiz State
  const [activeQuiz, setActiveQuiz] = useState<{
    category: Category;
    difficulty: Difficulty;
    questions: Question[];
    timeSeconds: number;
  } | null>(null);

  // Result state
  const [latestResult, setLatestResult] = useState<QuizResult | null>(null);

  // Certificate modal
  const [certificateResult, setCertificateResult] = useState<QuizResult | null>(null);

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Toast banner
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Initialize storage & user state
  useEffect(() => {
    initializeStorage();
    const user = getCurrentUser();
    setCurrentUserState(user);
    const cats = getCategories();
    setCategories(cats);

    if (user) {
      setUserResults(getUserResults(user.id));
      setCurrentView('dashboard');
    } else {
      setCurrentView('home');
    }
  }, []);

  const refreshUserData = (user: User | null = currentUser) => {
    if (user) {
      setUserResults(getUserResults(user.id));
    } else {
      setUserResults([]);
    }
  };

  // Handle Starting a Quiz
  const handleStartQuiz = (categoryId: number, difficulty: Difficulty) => {
    const cat = categories.find(c => c.id === categoryId) || categories[0];
    const config = QUIZ_CONFIG[difficulty];
    const questions = getQuizQuestions(cat.id, difficulty, config.questionsCount);

    if (questions.length === 0) {
      showToast('No questions available in this category yet.', 'warning');
      return;
    }

    setActiveQuiz({
      category: cat,
      difficulty,
      questions,
      timeSeconds: config.timeSeconds,
    });
    setCurrentView('quiz');
  };

  // Handle Submitting Quiz
  const handleSubmitQuiz = (selectedAnswers: Record<number, number>, timedOut: boolean) => {
    if (!activeQuiz) return;

    const { score, review } = evaluateQuizSubmission(activeQuiz.questions, selectedAnswers, timedOut);
    const total = activeQuiz.questions.length;
    const percentage = calculatePercentage(score, total);
    const passed = isPassed(percentage);

    const activeUser = currentUser || {
      id: 999,
      name: 'Guest Specialist',
      email: 'guest@cyberquiz.local',
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const saved = saveQuizResult({
      userId: activeUser.id,
      userName: activeUser.name,
      categoryId: activeQuiz.category.id,
      categoryName: activeQuiz.category.name,
      difficulty: activeQuiz.difficulty,
      score,
      totalQuestions: total,
      percentage,
      passed,
      attemptDate: new Date().toISOString(),
      timedOut,
      review,
    });

    setLatestResult(saved);
    refreshUserData(currentUser);
    setCurrentView('result');
    showToast(passed ? `🎉 Passed with ${percentage}%!` : `Completed quiz (${percentage}%). Review feedback below.`);
  };

  // Quick Switch Persona between Student and Admin
  const handleSwitchUser = (role: 'user' | 'admin') => {
    const targetEmail = role === 'admin' ? 'admin@cyberquiz.com' : 'user@cyberquiz.com';
    const res = loginUser(targetEmail);
    if (res.user) {
      setCurrentUserState(res.user);
      refreshUserData(res.user);
      if (role === 'admin') {
        setCurrentView('admin');
        showToast('Switched to Administrator Account (admin@cyberquiz.com)', 'success');
      } else {
        setCurrentView('dashboard');
        showToast('Switched to Student Account (Alex Morgan)', 'success');
      }
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setUserResults([]);
    setCurrentView('home');
    showToast('You have been logged out safely.', 'info');
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUserState(user);
    refreshUserData(user);
    setCurrentView(user.role === 'admin' ? 'admin' : 'dashboard');
    showToast(`Welcome back, ${user.name}!`, 'success');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                : toastMessage.type === 'warning'
                ? 'bg-amber-950 text-amber-300 border-amber-500/50'
                : 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        currentUser={currentUser}
        currentView={currentView}
        onNavigate={view => {
          if (view === 'quiz' && !activeQuiz) {
            setCurrentView('dashboard');
          } else {
            setCurrentView(view);
          }
        }}
        onOpenAuth={mode => {
          setAuthMode(mode);
          setAuthOpen(true);
        }}
        onLogout={handleLogout}
        onSwitchUser={handleSwitchUser}
      />

      {/* Main Content View Switcher */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {currentView === 'home' && (
          <HomeView
            categories={categories}
            currentUser={currentUser}
            onStartQuiz={(catId, diff) => {
              if (!currentUser) {
                setAuthMode('login');
                setAuthOpen(true);
                showToast('Please log in or pick a demo account to start the quiz.', 'info');
              } else {
                handleStartQuiz(catId, diff);
              }
            }}
            onNavigate={setCurrentView}
            onOpenAuth={mode => {
              setAuthMode(mode);
              setAuthOpen(true);
            }}
          />
        )}

        {currentView === 'dashboard' && currentUser && (
          <DashboardView
            currentUser={currentUser}
            categories={categories}
            userResults={userResults}
            onStartQuiz={handleStartQuiz}
            onNavigate={setCurrentView}
            onViewCertificate={res => setCertificateResult(res)}
          />
        )}

        {currentView === 'quiz' && activeQuiz && (
          <QuizView
            category={activeQuiz.category}
            difficulty={activeQuiz.difficulty}
            questions={activeQuiz.questions}
            timeLimitSeconds={activeQuiz.timeSeconds}
            onSubmit={handleSubmitQuiz}
            onCancel={() => setCurrentView('dashboard')}
          />
        )}

        {currentView === 'result' && latestResult && (
          <ResultView
            result={latestResult}
            onRetake={() => {
              if (activeQuiz) {
                handleStartQuiz(activeQuiz.category.id, activeQuiz.difficulty);
              } else {
                setCurrentView('dashboard');
              }
            }}
            onNavigate={setCurrentView}
            onViewCertificate={res => setCertificateResult(res)}
          />
        )}

        {currentView === 'learn' && (
          <LearnView
            onStartQuizFromTopic={catName => {
              const found = categories.find(c => c.name.toLowerCase().includes(catName.toLowerCase()));
              if (found) handleStartQuiz(found.id, 'easy');
            }}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView categories={categories} userResults={userResults} />
        )}

        {currentView === 'history' && (
          <HistoryView
            userResults={userResults}
            onViewCertificate={res => setCertificateResult(res)}
            onNavigate={setCurrentView}
          />
        )}

        {currentView === 'leaderboard' && (
          <LeaderboardView entries={getLeaderboard()} currentUser={currentUser} />
        )}

        {currentView === 'tools' && <SecurityToolsView />}

        {currentView === 'profile' && currentUser && (
          <ProfileView
            currentUser={currentUser}
            userResults={userResults}
            onUserUpdated={u => {
              setCurrentUserState(u);
              showToast('Profile updated!', 'success');
            }}
          />
        )}

        {currentView === 'admin' && currentUser?.role === 'admin' && (
          <AdminView
            categories={categories}
            currentUser={currentUser}
            onRefreshData={() => {
              setCategories(getCategories());
              refreshUserData(currentUser);
            }}
          />
        )}
      </main>

      {/* Global Certificate Preview Modal */}
      <CertificateModal
        result={certificateResult}
        onClose={() => setCertificateResult(null)}
      />

      {/* Global Authentication Modal */}
      <AuthModal
        isOpen={authOpen}
        initialMode={authMode}
        onClose={() => setAuthOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}
