import React, { useState } from 'react';
import { X, LogIn, UserPlus, Shield, Sparkles, CheckCircle2 } from 'lucide-react';
import { loginUser, registerUser } from '../utils/storage';
import { User } from '../types/quiz';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please enter a valid email address.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const res = registerUser(name, email, 'user');
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.user) {
        onSuccess(res.user);
        onClose();
      }
    } else {
      if (!email.trim()) {
        setError('Please enter your email address.');
        return;
      }
      if (!password) {
        setError('Please enter your password.');
        return;
      }

      const res = loginUser(email);
      if (res.error) {
        setError(res.error);
        return;
      }
      if (res.user) {
        onSuccess(res.user);
        onClose();
      }
    }
  };

  const handleQuickLogin = (emailPreset: string) => {
    setError(null);
    const res = loginUser(emailPreset);
    if (res.user) {
      onSuccess(res.user);
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden p-6 text-slate-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md shadow-cyan-500/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </h2>
            <p className="text-xs text-slate-400">
              {mode === 'login'
                ? 'Sign in to access your quizzes and track certificates.'
                : 'Join the Cybersecurity Awareness Training Platform.'}
            </p>
          </div>
        </div>

        {/* Quick Demo Logins Section */}
        <div className="mb-5 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/20">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            1-Click Demo Accounts
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('user@cyberquiz.com')}
              className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/40 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-semibold text-cyan-300">Alex Morgan</div>
              <div className="text-[10px] text-slate-400">Student User</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@cyberquiz.com')}
              className="px-2.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 text-left transition-colors cursor-pointer"
            >
              <div className="text-xs font-semibold text-amber-300">Admin Control</div>
              <div className="text-[10px] text-slate-400">Administrator</div>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
            <div className="mt-0.5">&bull;</div>
            <div>{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Sarah Connor"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
              required
            />
            {mode === 'register' && (
              <span className="text-[11px] text-slate-500 mt-1 block">
                At least 8 characters
              </span>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 text-sm text-white placeholder-slate-500 outline-none transition-colors"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-2 py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" /> Create Account
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center text-xs text-slate-400">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('register');
                }}
                className="text-cyan-400 hover:underline font-medium cursor-pointer"
              >
                Register now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{' '}
              <button
                type="button"
                onClick={() => {
                  setError(null);
                  setMode('login');
                }}
                className="text-cyan-400 hover:underline font-medium cursor-pointer"
              >
                Log in here
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
