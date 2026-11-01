import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Shield,
  Send,
} from 'lucide-react';
import { Category, Question, Difficulty } from '../types/quiz';
import { formatTimer } from '../utils/rules';

interface QuizViewProps {
  category: Category;
  difficulty: Difficulty;
  questions: Question[];
  timeLimitSeconds: number;
  onSubmit: (selectedAnswers: Record<number, number>, timedOut: boolean) => void;
  onCancel: () => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  category,
  difficulty,
  questions,
  timeLimitSeconds,
  onSubmit,
  onCancel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(timeLimitSeconds);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown Timer
  useEffect(() => {
    setRemainingSeconds(timeLimitSeconds);

    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          // Auto submit on timeout
          handleFinalSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timeLimitSeconds]);

  // Keyboard navigation (1-4 for options, arrows for prev/next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (showSubmitModal || showCancelModal) return;

      const currentQ = questions[currentIndex];
      if (!currentQ) return;

      if (['1', '2', '3', '4'].includes(e.key)) {
        const optIndex = parseInt(e.key, 10) - 1;
        if (currentQ.options[optIndex]) {
          handleSelectOption(currentQ.id, currentQ.options[optIndex].id);
        }
      } else if (e.key === 'ArrowRight' && currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, questions, showSubmitModal, showCancelModal]);

  const handleSelectOption = (questionId: number, optionId: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId,
    }));
  };

  const currentQ = questions[currentIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const isLowTime = remainingSeconds <= 60;

  const handleFinalSubmit = (timedOut: boolean = false) => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSubmit(selectedAnswers, timedOut);
  };

  if (!currentQ) {
    return (
      <div className="p-12 text-center text-slate-400">
        Loading quiz questions...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-xl font-bold text-white">
              {category.name} Quiz
            </h2>
            <span
              className={`text-xs font-mono uppercase px-2 py-0.5 rounded ${
                difficulty === 'easy'
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : difficulty === 'medium'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                  : 'bg-rose-950 text-rose-300 border border-rose-800'
              }`}
            >
              {difficulty} Level
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Question {currentIndex + 1} of {totalQuestions} &bull; {answeredCount} answered
          </div>
        </div>

        {/* Live Timer Badge */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm tracking-wider shadow-sm transition-all ${
            isLowTime
              ? 'bg-rose-950/80 text-rose-300 border-rose-600 animate-pulse'
              : 'bg-slate-950 text-cyan-300 border-cyan-500/30'
          }`}
          aria-label="Quiz countdown timer"
        >
          <Clock className={`w-4 h-4 ${isLowTime ? 'text-rose-400' : 'text-cyan-400'}`} />
          <span>{formatTimer(remainingSeconds)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Stepper Indicator Dots */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 px-1">
        {questions.map((q, idx) => {
          const isAnswered = selectedAnswers[q.id] !== undefined;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={q.id}
              onClick={() => setCurrentIndex(idx)}
              className={`min-w-8 h-8 rounded-lg text-xs font-mono font-medium flex items-center justify-center transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-cyan-500 text-slate-950 font-bold ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950'
                  : isAnswered
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/60'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:border-slate-700'
              }`}
              title={`Question ${idx + 1}: ${isAnswered ? 'Answered' : 'Unanswered'}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative">
        <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">
          Question {currentIndex + 1}
        </div>
        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed mb-6">
          {currentQ.questionText}
        </h3>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQ.id] === opt.id;

            return (
              <label
                key={opt.id}
                onClick={() => handleSelectOption(currentQ.id, opt.id)}
                className={`w-full p-4 rounded-xl border text-sm transition-all flex items-center gap-3.5 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-500 text-white shadow-md shadow-cyan-950/30 ring-1 ring-cyan-500'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-950'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 border ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'bg-slate-900 border-slate-700 text-slate-400'
                  }`}
                >
                  {['A', 'B', 'C', 'D'][idx] || idx + 1}
                </div>
                <span className="flex-grow">{opt.text}</span>
              </label>
            );
          })}
        </div>

        {/* Keyboard Helper text */}
        <div className="mt-4 text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5" />
          Pro-tip: Press keys 1-4 to select options &bull; Left/Right arrows to navigate
        </div>
      </div>

      {/* Bottom Actions Bar */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={() => setShowCancelModal(true)}
          className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
        >
          Exit Quiz
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {currentIndex < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(totalQuestions - 1, prev + 1))}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold shadow-md shadow-cyan-500/20 flex items-center gap-1 transition-colors cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                if (answeredCount < totalQuestions) {
                  setShowSubmitModal(true);
                } else {
                  handleFinalSubmit(false);
                }
              }}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-extrabold shadow-lg shadow-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Submit Quiz
            </button>
          )}
        </div>
      </div>

      {/* Unanswered Submit Confirmation Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Unanswered Questions</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              You have answered <span className="text-cyan-400 font-bold">{answeredCount}</span> of{' '}
              <span className="text-white font-bold">{totalQuestions}</span> questions. Any unanswered
              questions will be scored as incorrect.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Review Remaining
              </button>
              <button
                onClick={() => handleFinalSubmit(false)}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-400 text-slate-950"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Exit Quiz Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Exit this Quiz?</h3>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">
              Your ongoing progress for this session will be lost. Are you sure you want to return to the dashboard?
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800"
              >
                Continue Quiz
              </button>
              <button
                onClick={onCancel}
                className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-rose-900/60 text-rose-300 border border-slate-700 hover:border-rose-700"
              >
                Quit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
