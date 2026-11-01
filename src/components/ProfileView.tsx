import React, { useState } from 'react';
import { User as UserIcon, Mail, Calendar, Award, CheckCircle2, Shield } from 'lucide-react';
import { User, QuizResult } from '../types/quiz';
import { updateUserName } from '../utils/storage';

interface ProfileViewProps {
  currentUser: User;
  userResults: QuizResult[];
  onUserUpdated: (updatedUser: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  currentUser,
  userResults,
  onUserUpdated,
}) => {
  const [name, setName] = useState(currentUser.name);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const attempts = userResults.length;
  const bestScore = attempts > 0 ? Math.max(...userResults.map(r => r.percentage)) : 0;
  const passedCount = userResults.filter(r => r.passed).length;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    updateUserName(currentUser.id, name.trim());
    onUserUpdated({ ...currentUser, name: name.trim() });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <UserIcon className="w-4 h-4" />
          Account Credentials
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          My Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Update your student handle and review account achievements.
        </p>
      </div>

      {/* Main Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {savedSuccess && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Profile name updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Full Name (Displays on Certificates)
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white outline-none transition-colors"
              required
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Email Address (Fixed ID)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-slate-400 text-sm cursor-not-allowed select-none"
              />
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Primary authentication identifier cannot be changed.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Save Profile Changes
            </button>
          </div>
        </form>

        <hr className="border-slate-800" />

        {/* Account Details */}
        <div className="space-y-3 text-xs text-slate-300">
          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Member Since
            </span>
            <span className="font-mono text-white">
              {new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Access Role
            </span>
            <span className="font-mono uppercase font-bold text-cyan-300">
              {currentUser.role}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Quizzes Attempted
            </span>
            <span className="font-mono font-bold text-white">{attempts}</span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" /> Highest Recorded Score
            </span>
            <span className="font-mono font-bold text-emerald-400">{bestScore}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
