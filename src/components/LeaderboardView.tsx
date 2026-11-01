import React from 'react';
import { Trophy, Medal, Award, Flame, Star, Sparkles } from 'lucide-react';
import { LeaderboardEntry, User } from '../types/quiz';

interface LeaderboardViewProps {
  entries: LeaderboardEntry[];
  currentUser: User | null;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ entries, currentUser }) => {
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-1.5 font-bold text-amber-400">
            <span className="text-xl">🥇</span>
            <span className="font-mono text-xs">1st</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center gap-1.5 font-bold text-slate-300">
            <span className="text-xl">🥈</span>
            <span className="font-mono text-xs">2nd</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center gap-1.5 font-bold text-amber-600">
            <span className="text-xl">🥉</span>
            <span className="font-mono text-xs">3rd</span>
          </div>
        );
      default:
        return (
          <span className="font-mono font-bold text-slate-400 text-xs px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
            #{rank}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <Trophy className="w-4 h-4 text-amber-400" />
          Global Leaderboard
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Cyber Defense Standings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Top platform performers ranked by cumulative quiz points and average assessment accuracy.
        </p>
      </div>

      {/* Top 3 Podium Highlights if we have at least 3 */}
      {entries.length >= 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {/* 2nd place */}
          <div className="order-2 sm:order-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-3xl">🥈</span>
              <div className="text-sm font-bold text-white mt-1">{entries[1].name}</div>
              <div className="text-xs text-slate-400">{entries[1].quizzes} quizzes completed</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xl font-black font-mono text-slate-200">
                {entries[1].totalScore} pts
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                {entries[1].averagePercent}% average
              </div>
            </div>
          </div>

          {/* 1st place */}
          <div className="order-1 sm:order-2 bg-gradient-to-b from-amber-500/10 via-slate-900 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-6 text-center flex flex-col justify-between shadow-2xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 font-black text-[10px] uppercase font-mono tracking-wider">
              Champion
            </div>
            <div>
              <span className="text-4xl">🥇</span>
              <div className="text-base font-extrabold text-white mt-2">{entries[0].name}</div>
              <div className="text-xs text-amber-300/80">{entries[0].quizzes} quizzes completed</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-2xl font-black font-mono text-amber-400">
                {entries[0].totalScore} pts
              </div>
              <div className="text-xs font-mono text-emerald-400 font-bold">
                {entries[0].averagePercent}% average
              </div>
            </div>
          </div>

          {/* 3rd place */}
          <div className="order-3 bg-slate-900 border border-slate-800 rounded-2xl p-5 text-center flex flex-col justify-between shadow-lg">
            <div>
              <span className="text-3xl">🥉</span>
              <div className="text-sm font-bold text-white mt-1">{entries[2].name}</div>
              <div className="text-xs text-slate-400">{entries[2].quizzes} quizzes completed</div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800">
              <div className="text-xl font-black font-mono text-amber-600">
                {entries[2].totalScore} pts
              </div>
              <div className="text-[11px] font-mono text-cyan-400">
                {entries[2].averagePercent}% average
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Specialist Name</th>
                <th className="px-6 py-4">Quizzes Taken</th>
                <th className="px-6 py-4">Total Points</th>
                <th className="px-6 py-4 text-right">Average Accuracy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {entries.map((entry, idx) => {
                const isMe = currentUser?.id === entry.userId;

                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      isMe
                        ? 'bg-cyan-950/40 hover:bg-cyan-950/60 font-semibold'
                        : 'hover:bg-slate-850/60'
                    }`}
                  >
                    <td className="px-6 py-4">{getRankBadge(idx + 1)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{entry.name}</span>
                        {isMe && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500 text-slate-950 font-black">
                            YOU
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {entry.quizzes}
                    </td>
                    <td className="px-6 py-4 font-mono font-bold text-amber-400 text-sm">
                      {entry.totalScore}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="px-2.5 py-1 rounded-full font-mono text-xs font-bold bg-slate-950 border border-slate-800 text-cyan-300">
                        {entry.averagePercent}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
