import React from 'react';
import { History, Award, CheckCircle2, XCircle, Clock, ArrowRight } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface HistoryViewProps {
  userResults: QuizResult[];
  onViewCertificate: (result: QuizResult) => void;
  onNavigate: (view: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  userResults,
  onViewCertificate,
  onNavigate,
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            Audit Log
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            My Quiz Attempt History
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review past scores, accuracy milestones, and download official certificates.
          </p>
        </div>

        <button
          onClick={() => onNavigate('dashboard')}
          className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          Take a New Quiz
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">#</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Difficulty</th>
                <th className="px-5 py-3.5">Score</th>
                <th className="px-5 py-3.5">Accuracy</th>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5 text-right">Certificate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {userResults.length > 0 ? (
                userResults.map((r, idx) => (
                  <tr key={r.id} className="hover:bg-slate-850/60 transition-colors">
                    <td className="px-5 py-4 font-mono text-slate-500">{idx + 1}</td>
                    <td className="px-5 py-4 font-bold text-white">{r.categoryName}</td>
                    <td className="px-5 py-4 font-mono text-slate-400 capitalize">
                      {r.difficulty}
                    </td>
                    <td className="px-5 py-4 font-mono">
                      {r.score} / {r.totalQuestions}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase border ${
                          r.passed
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700/80'
                            : 'bg-rose-950 text-rose-300 border-rose-700/80'
                        }`}
                      >
                        {r.percentage}% &bull; {r.passed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-400 font-mono">
                      {new Date(r.attemptDate).toLocaleDateString('en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {r.passed ? (
                        <button
                          onClick={() => onViewCertificate(r)}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Award className="w-3.5 h-3.5 text-amber-400" />
                          View Certificate
                        </button>
                      ) : (
                        <span className="text-slate-600 font-mono">&mdash;</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-semibold text-white">No attempts recorded yet</div>
                      <p className="text-xs text-slate-500">
                        Take your first quiz from the dashboard to track your cybersecurity progress and earn certificates.
                      </p>
                      <button
                        onClick={() => onNavigate('dashboard')}
                        className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        Start First Quiz
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
