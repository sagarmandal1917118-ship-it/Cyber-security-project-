import React from 'react';
import { Shield, Lock, Terminal, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-semibold text-slate-200">
              CyberQuiz · Cybersecurity Awareness & Training Platform
            </div>
            <div className="text-[11px] text-slate-500">
              Structured awareness training covering Phishing, Malware, Credential Security & Online Safety.
            </div>
          </div>
        </div>

        {/* Center Live Threat Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-mono text-slate-300">
            SYSTEM STATUS: SECURE (100% OPERATIONAL)
          </span>
        </div>

        {/* Right Info */}
        <div className="flex items-center gap-4 text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400" /> Client-Side Sandbox
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> NIST-Aligned
          </span>
          <span>&copy; 2026 CyberQuiz</span>
        </div>
      </div>
    </footer>
  );
};
