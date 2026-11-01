import React, { useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Award,
  Trophy,
  RotateCcw,
  LayoutDashboard,
  Clock,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizResult } from '../types/quiz';
import { getResultMessage } from '../utils/rules';

interface ResultViewProps {
  result: QuizResult;
  onRetake: () => void;
  onNavigate: (view: string) => void;
  onViewCertificate: (result: QuizResult) => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onRetake,
  onNavigate,
  onViewCertificate,
}) => {
  useEffect(() => {
    if (result.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#0e9aa7', '#34d399', '#f59e0b'],
        });
      } catch {
        // Safe fallback if canvas-confetti is not loaded
      }
    }
  }, [result.passed]);

  const feedbackMessage = getResultMessage(result.categoryName, result.percentage);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Time Out Alert Banner if applicable */}
      {result.timedOut && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Quiz time limit expired! Any remaining unanswered questions were marked incorrect.
          </span>
        </div>
      )}

      {/* Main Score Hero Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Glow accent */}
        <div
          className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-20 ${
            result.passed ? 'bg-emerald-500' : 'bg-rose-500'
          }`}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              {result.categoryName} Assessment
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Quiz Results
            </h2>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              {feedbackMessage}
            </p>

            {/* Score Progress Bar */}
            <div className="w-full max-w-sm bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
              <div
                className={`h-full transition-all duration-700 ease-out ${
                  result.passed
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                    : 'bg-gradient-to-r from-rose-500 to-amber-500'
                }`}
                style={{ width: `${result.percentage}%` }}
              />
            </div>
          </div>

          {/* Right Big Score & Pill */}
          <div className="text-left sm:text-right shrink-0">
            <div className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tight">
              {result.score}{' '}
              <span className="text-xl sm:text-2xl text-slate-500 font-normal">
                / {result.totalQuestions}
              </span>
            </div>

            <div className="mt-2 flex items-center sm:justify-end gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wider uppercase border ${
                  result.passed
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80'
                    : 'bg-rose-950/80 text-rose-300 border-rose-700/80'
                }`}
              >
                {result.percentage}% &bull; {result.passed ? 'PASSED' : 'FAILED'}
              </span>
            </div>

            {/* Certificate Button if passed */}
            {result.passed && (
              <button
                onClick={() => onViewCertificate(result)}
                className="mt-3 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Award className="w-4 h-4 text-slate-950" />
                View & Download Certificate
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Review & Explanations Header */}
      <div className="flex items-center justify-between pt-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Detailed Question Review & Security Explanations
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          {result.score} correct of {result.totalQuestions}
        </span>
      </div>

      {/* Questions Review List */}
      <div className="space-y-4">
        {result.review.map((item, idx) => (
          <div
            key={item.questionId}
            className={`bg-slate-900 border rounded-2xl p-5 transition-all ${
              item.isCorrect
                ? 'border-emerald-500/30 shadow-sm'
                : 'border-rose-500/30'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h4 className="text-sm sm:text-base font-semibold text-white leading-snug">
                {idx + 1}. {item.questionText}
              </h4>
              <span
                className={`shrink-0 px-2.5 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                  item.isCorrect
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'bg-rose-950 text-rose-300 border border-rose-800'
                }`}
              >
                {item.isCorrect ? 'Correct' : 'Incorrect'}
              </span>
            </div>

            {/* Answer Cards */}
            <div className="space-y-2 mt-3">
              {item.isCorrect ? (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="font-semibold">{item.correctOptionText}</span>
                    <span className="text-emerald-400/80 text-xs ml-2 font-mono">
                      (Your Answer &bull; Correct)
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs sm:text-sm flex items-center gap-2.5">
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <div>
                      <span className="font-semibold">
                        {item.chosenOptionText || 'No answer submitted'}
                      </span>
                      <span className="text-rose-400/80 text-xs ml-2 font-mono">
                        (Your Answer)
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <span className="font-semibold">{item.correctOptionText}</span>
                      <span className="text-emerald-400/80 text-xs ml-2 font-mono">
                        (Correct Answer)
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Educational Explanation */}
            {item.explanation && (
              <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-xs text-slate-400 leading-relaxed flex items-start gap-2">
                <span className="text-cyan-400 font-semibold font-mono shrink-0">
                  DEFENSE NOTE:
                </span>
                <span>{item.explanation}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Actions Bar */}
      <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
        <button
          onClick={onRetake}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          Retake Quiz
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('leaderboard')}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Leaderboard
          </button>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
