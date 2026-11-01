import React, { useState } from 'react';
import {
  BookOpen,
  Shield,
  Search,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Eye,
  Mail,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { SEED_LESSONS } from '../data/seedData';
import { Lesson } from '../types/quiz';

interface LearnViewProps {
  onStartQuizFromTopic?: (categoryName: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({ onStartQuizFromTopic }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedLessonId, setExpandedLessonId] = useState<string>(SEED_LESSONS[0].id);

  // Phishing Simulator State
  const [simVerdict, setSimVerdict] = useState<'phishing' | 'safe' | null>(null);
  const [showSimHeader, setShowSimHeader] = useState(false);
  const [linkHovered, setLinkHovered] = useState(false);

  const filteredLessons = SEED_LESSONS.filter(
    l =>
      l.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 pb-12">
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1">
          <BookOpen className="w-4 h-4" />
          Cyber Academy Defense Curriculum
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Learn Cybersecurity
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Master the core defense tactics, attack signatures, and operational protocols before taking the timed quizzes.
        </p>
      </div>

      {/* Interactive Hands-On Phishing Simulator Lab */}
      <section className="bg-slate-900 border border-cyan-500/30 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <h2 className="text-lg font-bold text-white">
              Interactive Lab: Phishing Email Inspector
            </h2>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
            PRACTICAL SIMULATION
          </span>
        </div>
        <p className="text-xs text-slate-300 mb-5 leading-relaxed">
          Examine this simulated workplace email. Inspect the sender domain, hover over the link to reveal the true URL destination, and determine whether it is a malicious phishing campaign or a safe message.
        </p>

        {/* Email Client Mockup */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-inner">
          {/* Email Toolbar */}
          <div className="px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-slate-200">INBOX &bull; Message #4092</span>
            </div>
            <button
              onClick={() => setShowSimHeader(!showSimHeader)}
              className="text-[11px] font-mono text-cyan-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              {showSimHeader ? 'Hide Raw Headers' : 'Inspect Headers'}
            </button>
          </div>

          {/* Email Header Details */}
          <div className="p-4 border-b border-slate-800/80 space-y-1.5 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <span className="w-16 font-mono text-slate-500 shrink-0">From:</span>
              <div>
                <span className="font-semibold text-white">PayPal Account Security</span>{' '}
                <span className="font-mono text-amber-400 text-[11px]">
                  &lt;support@paypa1-security.com&gt;
                </span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 font-mono text-slate-500 shrink-0">Subject:</span>
              <span className="font-bold text-rose-300">
                [URGENT] Account Access Restricted – Verify Identity Within 24 Hours
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-16 font-mono text-slate-500 shrink-0">Date:</span>
              <span className="text-slate-400">Today at 03:14 AM</span>
            </div>

            {/* Extended Headers Disclosure */}
            {showSimHeader && (
              <div className="mt-2 p-2.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-slate-400 space-y-1">
                <div>Authentication-Results: spf=fail smtp.mailfrom=paypa1-security.com; dkim=none</div>
                <div>Received-SPF: SoftFail (mail server not authorized for paypal.com)</div>
                <div>X-Reported-Threat: Suspicious typosquatting domain 'paypa1'</div>
              </div>
            )}
          </div>

          {/* Email Body */}
          <div className="p-5 text-xs sm:text-sm text-slate-200 space-y-4 leading-relaxed">
            <p>Dear customer,</p>
            <p>
              We detected unusual sign-in activity on your account from an unrecognized IP address in Bucharest, Romania. For your protection, your transactions have been temporarily placed on hold.
            </p>
            <p>
              To restore your full account privileges and avoid immediate termination, you must confirm your credentials using our secure portal:
            </p>

            {/* Deceptive Hyperlink */}
            <div className="py-2">
              <span
                onMouseEnter={() => setLinkHovered(true)}
                onMouseLeave={() => setLinkHovered(false)}
                className="inline-block px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                https://www.paypal.com/verify-identity-now
              </span>
            </div>

            {/* Link Preview Floating Inspection Tooltip */}
            <div
              className={`p-2.5 rounded-lg border text-xs font-mono transition-all ${
                linkHovered
                  ? 'bg-amber-950/60 border-amber-500/80 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
            >
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">
                Browser Address Bar Target Preview (Hover State):
              </div>
              <div className="font-bold">
                {linkHovered ? (
                  <span className="text-rose-400">
                    http://paypa1-security.com/login.php?token=x9388&redirect=steal
                  </span>
                ) : (
                  <span>[Hover over the blue button above to inspect destination URL]</span>
                )}
              </div>
            </div>

            <p className="text-slate-400 text-xs">
              Thank you for choosing PayPal Security Department.
            </p>
          </div>
        </div>

        {/* Verdict Decision Buttons */}
        <div className="mt-5 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="text-xs text-slate-300">
            <span className="font-semibold text-white">Your Assessment:</span> Is this communication genuine or a malicious phishing attack?
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSimVerdict('phishing')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                simVerdict === 'phishing'
                  ? 'bg-rose-500 text-slate-950 shadow-md shadow-rose-500/20'
                  : 'bg-slate-900 hover:bg-rose-950/40 text-rose-300 border border-slate-800 hover:border-rose-500/40'
              }`}
            >
              🚩 Flag as Phishing (Scam)
            </button>
            <button
              onClick={() => setSimVerdict('safe')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                simVerdict === 'safe'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-emerald-950/40 text-emerald-300 border border-slate-800 hover:border-emerald-500/40'
              }`}
            >
              🛡️ Safe Communication
            </button>
          </div>
        </div>

        {/* Verdict Feedback */}
        {simVerdict && (
          <div
            className={`mt-3 p-4 rounded-xl border text-xs leading-relaxed flex items-start gap-3 ${
              simVerdict === 'phishing'
                ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
            }`}
          >
            {simVerdict === 'phishing' ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Correct! This is a textbook phishing attack.</span>
                  <div className="mt-1 space-y-0.5 text-slate-300">
                    <div>&bull; <strong className="text-amber-300">Lookalike Domain:</strong> The sender address uses <code className="font-mono">paypa1-security.com</code> with the numeral '1' replacing the letter 'l'.</div>
                    <div>&bull; <strong className="text-amber-300">Deceptive Link:</strong> The anchor text claimed to point to paypal.com, but the hovered URL actually pointed to an unencrypted HTTP landing page.</div>
                    <div>&bull; <strong className="text-amber-300">Urgency Trap:</strong> Threatening account suspension within 24 hours to cause panic.</div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white">Danger! This is actually a hostile phishing attack.</span>
                  <p className="mt-1 text-slate-300">
                    Never trust links that claim to be a well-known brand while using altered spelling in the domain (<code className="font-mono">paypa1</code>). Always navigate directly by typing the official address into your browser.
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </section>

      {/* Curriculum Lessons Section */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Curriculum Modules ({filteredLessons.length})
          </h2>

          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search topics, malware, 2FA..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-cyan-500 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Lessons Accordion List */}
        <div className="space-y-3">
          {filteredLessons.map(lesson => {
            const isExpanded = expandedLessonId === lesson.id;

            return (
              <div
                key={lesson.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all shadow-md"
              >
                {/* Accordion Header */}
                <button
                  onClick={() => setExpandedLessonId(isExpanded ? '' : lesson.id)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 hover:bg-slate-850 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Shield className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-mono text-cyan-400 uppercase">
                        {lesson.category}
                      </div>
                      <h3 className="text-base font-bold text-white">{lesson.title}</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Accordion Body */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-slate-800/80 text-xs sm:text-sm text-slate-300 space-y-4">
                    <p className="text-slate-200 leading-relaxed font-medium">
                      {lesson.summary}
                    </p>

                    {/* Key Defense Points */}
                    <div>
                      <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-semibold">
                        Defense Checklist & Protocols:
                      </div>
                      <ul className="space-y-2">
                        {lesson.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Real World Case Study */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs leading-relaxed space-y-1">
                      <div className="font-semibold text-amber-300 flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Historical Incident Pattern:
                      </div>
                      <p className="text-slate-400">{lesson.realWorldExample}</p>
                    </div>

                    {/* Pro Defense Tip */}
                    <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs leading-relaxed text-cyan-200 flex items-start gap-2.5">
                      <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-white">Actionable Rule: </strong>
                        {lesson.quickDefenseTip}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
