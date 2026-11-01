import React, { useState } from 'react';
import {
  Shield,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  History,
  Trophy,
  Wrench,
  User as UserIcon,
  LogOut,
  LogIn,
  UserPlus,
  ShieldAlert,
  ChevronDown,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';
import { User } from '../types/quiz';

interface NavbarProps {
  currentUser: User | null;
  currentView: string;
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onLogout: () => void;
  onSwitchUser: (role: 'user' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView,
  onNavigate,
  onOpenAuth,
  onLogout,
  onSwitchUser,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [switchDropdownOpen, setSwitchDropdownOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const handleNav = (view: string) => {
    onNavigate(view);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav(currentUser ? 'dashboard' : 'home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
            aria-label="CyberQuiz Home"
          >
            <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-white">
                <span>Cyber</span>
                <span className="text-cyan-400">Quiz</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  v2.5
                </span>
              </div>
              <div className="text-[10px] font-mono text-slate-400 tracking-wider uppercase -mt-0.5">
                Defense Academy
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1">
            {currentUser ? (
              isAdmin ? (
                // Admin Navigation
                <>
                  <button
                    onClick={() => handleNav('admin')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'admin'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Admin Command
                  </button>
                  <button
                    onClick={() => handleNav('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'dashboard'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Student View
                  </button>
                  <button
                    onClick={() => handleNav('learn')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'learn'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Lessons
                  </button>
                  <button
                    onClick={() => handleNav('tools')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'tools'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Wrench className="w-4 h-4" />
                    Tools Lab
                  </button>
                </>
              ) : (
                // Student / User Navigation
                <>
                  <button
                    onClick={() => handleNav('dashboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'dashboard'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </button>
                  <button
                    onClick={() => handleNav('learn')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'learn'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BookOpen className="w-4 h-4" />
                    Learn
                  </button>
                  <button
                    onClick={() => handleNav('analytics')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'analytics'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <BarChart3 className="w-4 h-4" />
                    Analytics
                  </button>
                  <button
                    onClick={() => handleNav('history')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'history'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <History className="w-4 h-4" />
                    History
                  </button>
                  <button
                    onClick={() => handleNav('leaderboard')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'leaderboard'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-400" />
                    Leaderboard
                  </button>
                  <button
                    onClick={() => handleNav('tools')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                      currentView === 'tools'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Wrench className="w-4 h-4 text-cyan-400" />
                    Security Tools
                  </button>
                </>
              )
            ) : (
              // Public Navigation
              <>
                <button
                  onClick={() => handleNav('home')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    currentView === 'home'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => handleNav('learn')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  Lessons
                </button>
                <button
                  onClick={() => handleNav('tools')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/60"
                >
                  Security Lab
                </button>
              </>
            )}
          </div>

          {/* Right Action Area */}
          <div className="flex items-center gap-2.5">
            {/* Quick Demo Switcher */}
            <div className="relative">
              <button
                onClick={() => setSwitchDropdownOpen(!switchDropdownOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 transition-colors cursor-pointer"
                title="Switch demo persona (Student / Admin)"
                aria-label="Switch Persona"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">Demo Switch</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {switchDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setSwitchDropdownOpen(false)}
                >
                  <div className="px-2 py-1 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    Quick Role Switch
                  </div>
                  <button
                    onClick={() => onSwitchUser('user')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-cyan-300">Alex Morgan</div>
                      <div className="text-[10px] text-slate-400">Student User (user@cyberquiz.com)</div>
                    </div>
                    {!isAdmin && currentUser && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </button>
                  <button
                    onClick={() => onSwitchUser('admin')}
                    className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-amber-300">Administrator</div>
                      <div className="text-[10px] text-slate-400">Admin (admin@cyberquiz.com)</div>
                    </div>
                    {isAdmin && (
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                    )}
                  </button>
                </div>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNav('profile')}
                  className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-xs transition-colors cursor-pointer"
                  title="View Profile"
                >
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center font-bold text-[11px]">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-slate-200 hidden lg:inline max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isAdmin
                        ? 'bg-amber-950/80 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                    }`}
                  >
                    {isAdmin ? 'ADMIN' : 'USER'}
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                  title="Logout"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Register
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {currentUser ? (
            <>
              {isAdmin ? (
                <>
                  <button
                    onClick={() => handleNav('admin')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-amber-300 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <ShieldAlert className="w-4 h-4" /> Admin Command
                  </button>
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Student View
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleNav('dashboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Dashboard
                  </button>
                  <button
                    onClick={() => handleNav('analytics')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" /> Analytics
                  </button>
                  <button
                    onClick={() => handleNav('history')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <History className="w-4 h-4" /> Attempt History
                  </button>
                  <button
                    onClick={() => handleNav('leaderboard')}
                    className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-amber-400" /> Leaderboard
                  </button>
                </>
              )}
              <button
                onClick={() => handleNav('learn')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> Lessons Hub
              </button>
              <button
                onClick={() => handleNav('tools')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
              >
                <Wrench className="w-4 h-4" /> Security Tools
              </button>
              <button
                onClick={() => handleNav('profile')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800 flex items-center gap-2"
              >
                <UserIcon className="w-4 h-4" /> Profile & Stats
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleNav('home')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800"
              >
                Home Overview
              </button>
              <button
                onClick={() => handleNav('learn')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800"
              >
                Security Lessons
              </button>
              <button
                onClick={() => handleNav('tools')}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-800"
              >
                Password & URL Tools
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};
