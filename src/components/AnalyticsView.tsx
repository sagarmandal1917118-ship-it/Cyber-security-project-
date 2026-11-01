import React from 'react';
import {
  BarChart3,
  Award,
  Zap,
  Target,
  CheckCircle2,
  Lock,
  Eye,
  Key,
  Compass,
  Crown,
  TrendingUp,
} from 'lucide-react';
import { Category, QuizResult } from '../types/quiz';
import { computeBadges } from '../utils/rules';

interface AnalyticsViewProps {
  categories: Category[];
  userResults: QuizResult[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ categories, userResults }) => {
  const attempts = userResults.length;
  const bestScore = attempts > 0 ? Math.max(...userResults.map(r => r.percentage)) : 0;
  const averageScore =
    attempts > 0 ? Math.round(userResults.reduce((acc, r) => acc + r.percentage, 0) / attempts) : 0;
  const totalCorrect = userResults.reduce((acc, r) => acc + r.score, 0);

  const badges = computeBadges(userResults);

  // Category level aggregation
  const categoryStats = categories.map(cat => {
    const matching = userResults.filter(r => r.categoryId === cat.id);
    const catAttempts = matching.length;
    const catAvg =
      catAttempts > 0
        ? Math.round(matching.reduce((acc, r) => acc + r.percentage, 0) / catAttempts)
        : 0;
    const catBest = catAttempts > 0 ? Math.max(...matching.map(r => r.percentage)) : 0;

    return {
      id: cat.id,
      name: cat.name,
      attempts: catAttempts,
      average: catAvg,
      best: catBest,
    };
  });

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield':
        return <Award className="w-5 h-5 text-cyan-400" />;
      case 'Compass':
        return <Compass className="w-5 h-5 text-amber-400" />;
      case 'Award':
        return <Award className="w-5 h-5 text-emerald-400" />;
      case 'Zap':
        return <Zap className="w-5 h-5 text-indigo-400" />;
      case 'Eye':
        return <Eye className="w-5 h-5 text-amber-400" />;
      case 'Lock':
        return <Lock className="w-5 h-5 text-rose-400" />;
      case 'Key':
        return <Key className="w-5 h-5 text-cyan-400" />;
      case 'Crown':
      default:
        return <Crown className="w-5 h-5 text-yellow-400" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4" />
          Metrics & Progression
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          My Performance Analytics
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Monitor your domain strengths, test frequency, average accuracy, and unlocked achievements.
        </p>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Total Attempts</div>
          <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{attempts}</div>
          <div className="text-[11px] text-slate-500 mt-1">Completed quiz sessions</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Average Score</div>
          <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{averageScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Across all categories</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Best Score</div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-1">{bestScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">Peak assessment rating</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="text-xs font-mono uppercase text-slate-400">Correct Answers</div>
          <div className="text-3xl font-black text-indigo-400 font-mono mt-1">{totalCorrect}</div>
          <div className="text-[11px] text-slate-500 mt-1">Cumulative questions aced</div>
        </div>
      </div>

      {/* Visual Category Mastery Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Domain Accuracy Breakdown</h2>
          </div>
          <span className="text-xs font-mono text-slate-400">Average % per topic</span>
        </div>

        <div className="space-y-4 pt-2">
          {categoryStats.map(stat => (
            <div key={stat.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">{stat.name}</span>
                <span className="font-mono font-bold text-cyan-400">
                  {stat.average}% average{' '}
                  <span className="text-slate-500 font-normal">
                    ({stat.attempts} {stat.attempts === 1 ? 'attempt' : 'attempts'})
                  </span>
                </span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    stat.average >= 80
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                      : stat.average >= 60
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                      : stat.average > 0
                      ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                      : 'bg-slate-800'
                  }`}
                  style={{ width: `${Math.max(4, stat.average)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-400" />
          <h2 className="text-base font-bold text-white">Security Achievement Badges</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                b.unlocked
                  ? 'bg-slate-950 border-cyan-500/40 shadow-sm shadow-cyan-950/20'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-50'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                  b.unlocked
                    ? 'bg-cyan-500/10 border-cyan-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {getBadgeIcon(b.icon)}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">{b.title}</h3>
                  {b.unlocked && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                  {b.description}
                </p>
                <div className="text-[10px] font-mono mt-1 font-semibold">
                  {b.unlocked ? (
                    <span className="text-emerald-400">UNLOCKED</span>
                  ) : (
                    <span className="text-slate-500">LOCKED</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Detailed Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <h3 className="text-sm font-bold text-white">Category Performance Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Attempts</th>
                <th className="px-6 py-3">Average Accuracy</th>
                <th className="px-6 py-3">Best Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {categoryStats.map(stat => (
                <tr key={stat.id} className="hover:bg-slate-850 transition-colors">
                  <td className="px-6 py-3.5 font-semibold text-white">{stat.name}</td>
                  <td className="px-6 py-3.5 font-mono">{stat.attempts}</td>
                  <td className="px-6 py-3.5 font-mono">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        stat.average >= 60
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : stat.attempts > 0
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'text-slate-500'
                      }`}
                    >
                      {stat.average}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-mono font-bold text-cyan-400">
                    {stat.best}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
