import React, { useState } from 'react';
import {
  Wrench,
  KeyRound,
  Globe,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Sparkles,
} from 'lucide-react';
import { checkPasswordStrength, analyzePhishingUrl } from '../utils/rules';

export const SecurityToolsView: React.FC = () => {
  // Password Tool State
  const [passwordInput, setPasswordInput] = useState('Tr!ee7$Moon#Bk9');
  const [copied, setCopied] = useState(false);

  // URL Tool State
  const [urlInput, setUrlInput] = useState('http://support@paypa1-security.com/login.php');

  const pwStrength = checkPasswordStrength(passwordInput);
  const urlAnalysis = analyzePhishingUrl(urlInput);

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(passwordInput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const generatePassphrase = () => {
    const wordList = [
      'Solar', 'Falcon', 'Cobalt', 'Nebula', 'Glacier', 'Timber', 'Vortex', 'Quartz',
      'Shield', 'Beacon', 'Cipher', 'Harbor', 'Summit', 'Ranger', 'Anchor', 'Matrix'
    ];
    const picked = [
      wordList[Math.floor(Math.random() * wordList.length)],
      wordList[Math.floor(Math.random() * wordList.length)],
      wordList[Math.floor(Math.random() * wordList.length)],
      Math.floor(Math.random() * 90 + 10).toString(),
      '!#$'[Math.floor(Math.random() * 3)],
    ];
    setPasswordInput(picked.join('-'));
  };

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <Wrench className="w-4 h-4" />
          Interactive Cyber Lab
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Security Utilities & Threat Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Interactive practical tools to test credential entropy and detect deceptive phishing URLs in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Tool 1: Password Strength & Entropy Analyzer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Password Entropy Tester</h3>
                  <div className="text-[11px] text-slate-400">Brute-force crack resistance</div>
                </div>
              </div>
              <button
                onClick={generatePassphrase}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono flex items-center gap-1 cursor-pointer"
                title="Generate high-entropy passphrase"
              >
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Generate
              </button>
            </div>

            <div className="relative mt-4">
              <input
                type="text"
                value={passwordInput}
                onChange={e => setPasswordInput(e.target.value)}
                placeholder="Type or test a password..."
                className="w-full pr-10 pl-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm text-white focus:border-cyan-500 outline-none"
              />
              <button
                onClick={handleCopyPassword}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
                title="Copy password"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength Bar */}
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Estimated Rating:</span>
                <span
                  className={`font-mono font-bold ${
                    pwStrength.score >= 3
                      ? 'text-emerald-400'
                      : pwStrength.score === 2
                      ? 'text-amber-400'
                      : 'text-rose-400'
                  }`}
                >
                  {pwStrength.label}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 h-2">
                {[0, 1, 2, 3].map(step => (
                  <div
                    key={step}
                    className={`rounded-full transition-all ${
                      step <= pwStrength.score
                        ? pwStrength.score >= 3
                          ? 'bg-emerald-400'
                          : pwStrength.score === 2
                          ? 'bg-amber-400'
                          : 'bg-rose-400'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Crack Time Metric */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Estimated Time to Crack:</span>
              <span className="font-mono font-bold text-white text-sm">
                {pwStrength.crackTimeEstimate}
              </span>
            </div>

            {/* Feedback items */}
            {pwStrength.feedback.length > 0 && (
              <div className="mt-3 space-y-1 text-[11px] text-slate-400">
                {pwStrength.feedback.map((f, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-amber-400">&bull;</span>
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tool 2: Phishing URL Heuristic Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">Phishing URL Inspector</h3>
                <div className="text-[11px] text-slate-400">Heuristic threat signature analysis</div>
              </div>
            </div>

            <div className="mt-4">
              <input
                type="text"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://example.com/login..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 font-mono text-xs text-white focus:border-cyan-500 outline-none"
              />
            </div>

            {/* Risk Score Gauge */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase text-slate-500">Threat Risk Score</div>
                <div
                  className={`text-xl font-mono font-black ${
                    urlAnalysis.riskScore >= 40
                      ? 'text-rose-400'
                      : urlAnalysis.riskScore > 0
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {urlAnalysis.riskScore} / 100
                </div>
              </div>

              <div
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase border ${
                  urlAnalysis.isSuspicious
                    ? 'bg-rose-950/80 text-rose-300 border-rose-700'
                    : 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                }`}
              >
                {urlAnalysis.isSuspicious ? 'High Threat' : 'Clean Signature'}
              </div>
            </div>

            {/* Flags Identified */}
            <div className="mt-3 space-y-1.5">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Detection Signals:</div>
              {urlAnalysis.flags.length > 0 ? (
                urlAnalysis.flags.map((flag, i) => (
                  <div key={i} className="text-xs text-rose-300 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                    <span>{flag}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>No obvious homoglyphs, IP hostnames, or executable double extensions.</span>
                </div>
              )}
            </div>

            {/* Advice Box */}
            <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-white">Advisory: </span>
              {urlAnalysis.safeAdvice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
