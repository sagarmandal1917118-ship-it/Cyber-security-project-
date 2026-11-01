import React from 'react';
import {
  Shield,
  Fish,
  Bug,
  KeyRound,
  ShieldCheck,
  Play,
  Clock,
  Award,
  BarChart3,
  BookOpen,
  Wrench,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Category, User, QuizResult } from '../types/quiz';

interface DashboardViewProps {
  currentUser: User;
  categories: Category[];
  userResults: QuizResult[];
  onStartQuiz: (categoryId: number, difficulty: 'easy' | 'medium' | 'hard') => void;
  onNavigate: (view: string) => void;
  onViewCertificate: (result: QuizResult) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  categories,
  userResults,
  onStartQuiz,
  onNavigate,
  onViewCertificate,
}) => {
  const firstName = currentUser.name.split(' ')[0] || 'Specialist';
  const takenCount = userResults.length;
  const bestScore = takenCount > 0 ? Math.max(...userResults.map(r => r.percentage)) : 0;
  const passedCount = userResults.filter(r => r.passed).length;
  const latestPassed = userResults.find(r => r.passed);

  const getCategoryIcon = (id: number) => {
    switch (id) {
      case 1:
        return <Fish className="w-5 h-5 text-amber-400" />;
      case 2:
        return <Bug className="w-5 h-5 text-rose-400" />;
      case 3:
        return <KeyRound className="w-5 h-5 text-cyan-400" />;
      case 4:
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Top Banner Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Hello, {firstName}
            </h1>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800">
              {currentUser.role.toUpperCase()}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Choose a cybersecurity domain and challenge tier below to test and hone your skills.
          </p>
        </div>

        {/* Stats Pill Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-500">Quizzes Taken</div>
            <div className="text-base font-bold text-cyan-400">{takenCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-500">Passed</div>
            <div className="text-base font-bold text-emerald-400">{passedCount}</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-mono text-slate-500">Best Score</div>
            <div className="text-base font-bold text-amber-400">{bestScore}%</div>
          </div>
        </div>
      </div>

      {/* Latest Certificate Callout (if available) */}
      {latestPassed && (
        <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Certificate Ready: {latestPassed.categoryName} Defense</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {latestPassed.percentage}%
                </span>
              </div>
              <div className="text-xs text-slate-400">
                You passed with {latestPassed.score}/{latestPassed.totalQuestions} questions correct on{' '}
                {new Date(latestPassed.attemptDate).toLocaleDateString()}.
              </div>
            </div>
          </div>
          <button
            onClick={() => onViewCertificate(latestPassed)}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md shadow-cyan-500/20"
          >
            <Award className="w-3.5 h-3.5" />
            View & Download Certificate
          </button>
        </div>
      )}

      {/* Categories Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              Select Topic & Challenge Level
            </h2>
            <p className="text-xs text-slate-400">
              Each quiz features randomized questions and options with server-accurate timed execution.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-3.5 mb-3">
                  <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">{cat.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {cat.description}
                    </p>
                    <div className="text-[11px] font-mono text-cyan-400 mt-2 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      15 Curated Questions in Question Bank
                    </div>
                  </div>
                </div>
              </div>

              {/* Difficulty Selection Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onStartQuiz(cat.id, 'easy')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="5 Questions · 5 Minutes"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Easy · 5 Qs
                </button>

                <button
                  onClick={() => onStartQuiz(cat.id, 'medium')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-800/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="10 Questions · 10 Minutes"
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  Medium · 10 Qs
                </button>

                <button
                  onClick={() => onStartQuiz(cat.id, 'hard')}
                  className="px-3 py-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/80 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="15 Questions · 15 Minutes"
                >
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  Hard · 15 Qs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <button
          onClick={() => onNavigate('learn')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-cyan-300">
              Learning Resources
            </div>
            <div className="text-[11px] text-slate-400">
              Review threat briefs and defense tips
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('analytics')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-300">
              Performance Analytics
            </div>
            <div className="text-[11px] text-slate-400">
              View charts, accuracy rates & badges
            </div>
          </div>
        </button>

        <button
          onClick={() => onNavigate('tools')}
          className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-colors flex items-center gap-3.5 group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-white group-hover:text-amber-300">
              Security Tools Lab
            </div>
            <div className="text-[11px] text-slate-400">
              Password tester & Phishing inspector
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};
