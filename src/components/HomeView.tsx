import React, { useState } from 'react';
import {
  Shield,
  ArrowRight,
  Fish,
  Bug,
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Award,
  Trophy,
  Zap,
  HelpCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Category, User } from '../types/quiz';

interface HomeViewProps {
  categories: Category[];
  currentUser: User | null;
  onStartQuiz: (categoryId: number, difficulty: 'easy' | 'medium' | 'hard') => void;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  categories,
  currentUser,
  onStartQuiz,
  onNavigate,
  onOpenAuth,
}) => {
  // Quick mini-teaser state
  const [teaserAnswer, setTeaserAnswer] = useState<number | null>(null);
  const [teaserSubmitted, setTeaserSubmitted] = useState(false);

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
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 p-8 sm:p-12 shadow-2xl">
        {/* Tech Grid Background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#0e9aa7_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Learn &bull; Practise &bull; Stay Safe
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Cybersecurity Awareness{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-400">
              Quiz & Training Platform
            </span>
          </h1>

          <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Test your knowledge of phishing, malware, password security and safe online habits.
            Get instant scores, verified certificates, deep explanations, and track your ranking on the global leaderboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  Start Training
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-6 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-white font-medium text-sm transition-all cursor-pointer"
                >
                  Register Account
                </button>
              </>
            )}

            <button
              onClick={() => onNavigate('learn')}
              className="px-4 py-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-medium text-sm transition-colors cursor-pointer"
            >
              Browse Lessons
            </button>
          </div>

          {/* Quick Metrics Strip */}
          <div className="mt-10 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-2xl font-black text-cyan-400 font-mono">60+</div>
              <div className="text-xs text-slate-400">Curated Questions</div>
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400 font-mono">4</div>
              <div className="text-xs text-slate-400">Threat Domains</div>
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400 font-mono">3 Tiers</div>
              <div className="text-xs text-slate-400">Easy / Med / Hard</div>
            </div>
            <div>
              <div className="text-2xl font-black text-indigo-400 font-mono">100%</div>
              <div className="text-xs text-slate-400">Instant PDF/PNG Certs</div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Core Security Domains */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-cyan-400" />
              Core Cybersecurity Categories
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Select a specialized domain to assess your awareness and defense skills.
            </p>
          </div>
          <button
            onClick={() => onNavigate(currentUser ? 'dashboard' : 'learn')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 mt-2 sm:mt-0 cursor-pointer"
          >
            Explore all topics <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <div
              key={cat.id}
              className="group relative bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between hover:shadow-xl hover:shadow-cyan-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCategoryIcon(cat.id)}
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                    15 Questions
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-cyan-300 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-cyan-400">
                  Easy · Med · Hard
                </span>
                <button
                  onClick={() => onStartQuiz(cat.id, 'easy')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Start Quiz
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Quick Security Check Mini-Lab */}
      <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Quick 60-Second Challenge
          </div>
          <h2 className="text-xl font-bold text-white">
            Spot The Threat: Can you identify this attack?
          </h2>
          <p className="text-xs text-slate-400 mt-1 mb-5">
            You receive an urgent SMS: "Bank Alert: Your debit card is temporarily suspended. Confirm your 4-digit PIN at http://bank-secure-auth.net to avoid cancellation."
          </p>

          <div className="space-y-2.5">
            {[
              { id: 1, text: 'Click the link immediately to prevent card cancellation', isCorrect: false },
              { id: 2, text: 'This is Smishing (SMS phishing) — banks never ask for your PIN over a message', isCorrect: true },
              { id: 3, text: 'Reply to the SMS asking for the agent’s name and badge number', isCorrect: false },
            ].map(opt => (
              <button
                key={opt.id}
                onClick={() => {
                  setTeaserAnswer(opt.id);
                  setTeaserSubmitted(true);
                }}
                disabled={teaserSubmitted}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between cursor-pointer ${
                  teaserSubmitted
                    ? opt.isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-300'
                      : teaserAnswer === opt.id
                      ? 'bg-rose-950/40 border-rose-500/60 text-rose-300'
                      : 'bg-slate-950/50 border-slate-800 text-slate-500 opacity-60'
                    : teaserAnswer === opt.id
                    ? 'bg-cyan-950/50 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                }`}
              >
                <span>{opt.text}</span>
                {teaserSubmitted && opt.isCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {teaserSubmitted && (
            <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-cyan-500/30 text-xs leading-relaxed text-slate-300 flex items-start gap-3">
              <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <span className="font-semibold text-white">Security Takeaway: </span>
                Attackers create false urgency to panic victims into submitting credentials on fake pages. Legitimate financial institutions will never request your PIN or OTP via unsolicited messages or direct links.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Why CyberQuiz Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Verified Certificates</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Pass any quiz with 60% or above to unlock and download a high-resolution, officially verifiable Certificate of Achievement.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <Trophy className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Global Ranking & Badges</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Compete on the live leaderboard. Unlock special achievement badges like Phishing Hunter, Malware Sentinel, and Iron Guardian.
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-base">Hands-on Security Tools</h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Test password entropy against brute-force attacks and inspect suspicious URLs with our real-time heuristic phishing analyzer.
          </p>
        </div>
      </section>
    </div>
  );
};
