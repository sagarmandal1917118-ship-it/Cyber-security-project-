import React, { useState } from 'react';
import {
  ShieldAlert,
  Users,
  FolderTree,
  HelpCircle,
  BarChart,
  Plus,
  Trash2,
  Edit2,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Search,
  Filter,
  RotateCcw,
} from 'lucide-react';
import { Category, Question, User, QuizResult, Difficulty } from '../types/quiz';
import {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
  getUsers,
  updateUserStatus,
  deleteUser,
  getResults,
  resetPlatformData,
} from '../utils/storage';

interface AdminViewProps {
  categories: Category[];
  currentUser: User;
  onRefreshData: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ categories, currentUser, onRefreshData }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'questions' | 'users' | 'results'>('overview');

  // Questions State
  const [questionsList, setQuestionsList] = useState<Question[]>(() => getQuestions());
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [questionSearch, setQuestionSearch] = useState('');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State for Add / Edit Question
  const [formCatId, setFormCatId] = useState<number>(categories[0]?.id || 1);
  const [formDifficulty, setFormDifficulty] = useState<Difficulty>('easy');
  const [formText, setFormText] = useState('');
  const [formExplanation, setFormExplanation] = useState('');
  const [formOptions, setFormOptions] = useState<string[]>(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(0);
  const [formError, setFormError] = useState<string | null>(null);

  // Users State
  const [usersList, setUsersList] = useState<User[]>(() => getUsers());
  const [userSearch, setUserSearch] = useState('');

  // Results State
  const [resultsList, setResultsList] = useState<QuizResult[]>(() => getResults());

  const refreshAll = () => {
    setQuestionsList(getQuestions());
    setUsersList(getUsers());
    setResultsList(getResults());
    onRefreshData();
  };

  // Stats calculation
  const stats = {
    users: usersList.filter(u => u.role === 'user').length,
    categories: categories.length,
    questions: questionsList.length,
    attempts: resultsList.length,
  };

  // Open Add Question Modal
  const handleOpenAdd = () => {
    setEditingQuestion(null);
    setFormCatId(categories[0]?.id || 1);
    setFormDifficulty('easy');
    setFormText('');
    setFormExplanation('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Question Modal
  const handleOpenEdit = (q: Question) => {
    setEditingQuestion(q);
    setFormCatId(q.categoryId);
    setFormDifficulty(q.difficulty);
    setFormText(q.questionText);
    setFormExplanation(q.explanation);

    const opts = q.options.map(o => o.text);
    while (opts.length < 4) opts.push('');
    setFormOptions(opts);

    const correctIdx = q.options.findIndex(o => o.isCorrect);
    setFormCorrectIndex(correctIdx >= 0 ? correctIdx : 0);
    setFormError(null);
    setIsAddModalOpen(true);
  };

  // Save Question (Add or Update)
  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formText.trim()) {
      setFormError('Question text cannot be blank.');
      return;
    }
    if (formOptions.some(o => !o.trim())) {
      setFormError('All 4 options must be filled.');
      return;
    }
    const cat = categories.find(c => c.id === formCatId);
    if (!cat) {
      setFormError('Invalid category chosen.');
      return;
    }

    const builtOptions = formOptions.map((text, idx) => ({
      id: editingQuestion ? editingQuestion.options[idx]?.id || Date.now() + idx : Date.now() + idx,
      text: text.trim(),
      isCorrect: idx === formCorrectIndex,
    }));

    if (editingQuestion) {
      updateQuestion({
        ...editingQuestion,
        categoryId: formCatId,
        categoryName: cat.name,
        questionText: formText.trim(),
        explanation: formExplanation.trim(),
        difficulty: formDifficulty,
        options: builtOptions,
      });
    } else {
      addQuestion({
        categoryId: formCatId,
        categoryName: cat.name,
        questionText: formText.trim(),
        explanation: formExplanation.trim(),
        difficulty: formDifficulty,
        options: builtOptions,
      });
    }

    setIsAddModalOpen(false);
    refreshAll();
  };

  // Delete Question
  const handleDeleteQuestion = (id: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(id);
      refreshAll();
    }
  };

  // Block / Unblock User
  const handleToggleUserStatus = (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    updateUserStatus(userId, nextStatus);
    refreshAll();
  };

  // Delete User
  const handleDeleteUser = (userId: number) => {
    if (confirm('Delete this user account permanently?')) {
      deleteUser(userId);
      refreshAll();
    }
  };

  // Filtered Questions
  const filteredQuestions = questionsList.filter(q => {
    const matchesCat =
      selectedCategoryFilter === 'all' || q.categoryId.toString() === selectedCategoryFilter;
    const matchesSearch =
      q.questionText.toLowerCase().includes(questionSearch.toLowerCase()) ||
      q.explanation.toLowerCase().includes(questionSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Filtered Users
  const filteredUsers = usersList.filter(
    u =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-amber-500/30 p-6 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                Admin Command Suite
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800">
                Authorized
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Manage questions bank, monitor user access, audit test logs, and inspect platform analytics.
            </p>
          </div>
        </div>

        {/* Reset Platform Demo Data */}
        <button
          onClick={() => {
            if (confirm('Reset platform questions, categories, and test data back to starter defaults?')) {
              resetPlatformData();
              refreshAll();
            }
          }}
          className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
          title="Reset database to seed defaults"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Seed Data
        </button>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Overview & Metrics
        </button>
        <button
          onClick={() => setActiveTab('questions')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'questions'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Questions Bank ({questionsList.length})
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'users'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Users & Access ({usersList.length})
        </button>
        <button
          onClick={() => setActiveTab('results')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'results'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white hover:bg-slate-900'
          }`}
        >
          Audit Log / All Results ({resultsList.length})
        </button>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats 4-Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-mono uppercase text-slate-400">Registered Users</div>
              <div className="text-3xl font-black text-cyan-400 font-mono mt-1">{stats.users}</div>
              <div className="text-[11px] text-slate-500 mt-1">Student accounts</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-mono uppercase text-slate-400">Active Categories</div>
              <div className="text-3xl font-black text-amber-400 font-mono mt-1">{stats.categories}</div>
              <div className="text-[11px] text-slate-500 mt-1">Specialized domains</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-mono uppercase text-slate-400">Questions in Bank</div>
              <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{stats.questions}</div>
              <div className="text-[11px] text-slate-500 mt-1">Curated item pool</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
              <div className="text-xs font-mono uppercase text-slate-400">Quiz Attempts</div>
              <div className="text-3xl font-black text-indigo-400 font-mono mt-1">{stats.attempts}</div>
              <div className="text-[11px] text-slate-500 mt-1">Platform submissions</div>
            </div>
          </div>

          {/* Quick Actions & Distribution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="font-bold text-white text-base">Quick Operations</h3>
              <p className="text-xs text-slate-400">Directly jump to administrative tasks.</p>
              <div className="grid grid-cols-1 gap-2.5 pt-2">
                <button
                  onClick={handleOpenAdd}
                  className="w-full py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-cyan-500/20"
                >
                  <Plus className="w-4 h-4" /> Add New Question
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Users className="w-4 h-4 text-cyan-400" /> Manage Users & Status
                </button>
                <button
                  onClick={() => setActiveTab('results')}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BarChart className="w-4 h-4 text-emerald-400" /> View All Submission Records
                </button>
              </div>
            </div>

            {/* Attempts by Category */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-white text-base">Attempts by Category</h3>
              <div className="space-y-3 pt-1">
                {categories.map(c => {
                  const catAttempts = resultsList.filter(r => r.categoryId === c.id).length;
                  const percent =
                    resultsList.length > 0 ? Math.round((catAttempts * 100) / resultsList.length) : 0;

                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300 font-medium">{c.name}</span>
                        <span className="font-mono text-cyan-400 font-bold">
                          {catAttempts} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: QUESTIONS MANAGEMENT */}
      {activeTab === 'questions' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search and Category Filter */}
            <div className="flex flex-wrap items-center gap-2.5 flex-grow">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={questionSearch}
                  onChange={e => setQuestionSearch(e.target.value)}
                  placeholder="Search questions or explanations..."
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                />
              </div>

              <select
                value={selectedCategoryFilter}
                onChange={e => setSelectedCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="all">All Categories ({questionsList.length})</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id.toString()}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Question
            </button>
          </div>

          {/* Questions Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">#</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Difficulty</th>
                    <th className="px-5 py-3.5">Question Text</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredQuestions.map((q, idx) => (
                    <tr key={q.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500">{idx + 1}</td>
                      <td className="px-5 py-3.5 font-semibold text-cyan-300">{q.categoryName}</td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            q.difficulty === 'easy'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : q.difficulty === 'medium'
                              ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-md font-medium text-white truncate">
                        {q.questionText}
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(q)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit question"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-cyan-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(q.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete question"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: USERS & STATUS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Search user by name or email..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">ID</th>
                    <th className="px-5 py-3.5">Full Name</th>
                    <th className="px-5 py-3.5">Email</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500">#{u.id}</td>
                      <td className="px-5 py-3.5 font-bold text-white">{u.name}</td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">{u.email}</td>
                      <td className="px-5 py-3.5 font-mono uppercase">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            u.status === 'active'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {u.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right whitespace-nowrap space-x-1.5">
                        {u.role !== 'admin' && (
                          <>
                            <button
                              onClick={() => handleToggleUserStatus(u.id, u.status)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer ${
                                u.status === 'active'
                                  ? 'bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300'
                                  : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800'
                              }`}
                              title={u.status === 'active' ? 'Block user' : 'Unblock user'}
                            >
                              {u.status === 'active' ? (
                                <>
                                  <Lock className="w-3 h-3 text-rose-400" /> Block
                                </>
                              ) : (
                                <>
                                  <Unlock className="w-3 h-3 text-emerald-400" /> Unblock
                                </>
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete user"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LOG (ALL RESULTS) */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Attempt ID</th>
                    <th className="px-5 py-3.5">Specialist Name</th>
                    <th className="px-5 py-3.5">Category</th>
                    <th className="px-5 py-3.5">Score</th>
                    <th className="px-5 py-3.5">Accuracy</th>
                    <th className="px-5 py-3.5">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {resultsList.map(r => (
                    <tr key={r.id} className="hover:bg-slate-850/60 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-slate-500">#{r.id}</td>
                      <td className="px-5 py-3.5 font-bold text-white">{r.userName}</td>
                      <td className="px-5 py-3.5">{r.categoryName}</td>
                      <td className="px-5 py-3.5 font-mono">
                        {r.score} / {r.totalQuestions}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            r.passed
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {r.percentage}% &bull; {r.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-slate-400">
                        {new Date(r.attemptDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4 text-slate-100 my-8">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
              {editingQuestion ? 'Edit Question' : 'Add New Question to Bank'}
            </h3>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formCatId}
                    onChange={e => setFormCatId(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={e => setFormDifficulty(e.target.value as Difficulty)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                  >
                    <option value="easy">Easy (5 Qs set)</option>
                    <option value="medium">Medium (10 Qs set)</option>
                    <option value="hard">Hard (15 Qs set)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Question Text
                </label>
                <textarea
                  value={formText}
                  onChange={e => setFormText(e.target.value)}
                  rows={2}
                  placeholder="e.g. Which of these is a common indicator of a phishing email?"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 resize-none"
                  required
                />
              </div>

              {/* 4 Options with Radio marking which is correct */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Answer Options (Select the radio of the correct answer):
                </label>
                {formOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correctOptionRadio"
                      checked={formCorrectIndex === idx}
                      onChange={() => setFormCorrectIndex(idx)}
                      className="w-4 h-4 text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={e => {
                        const next = [...formOptions];
                        next[idx] = e.target.value;
                        setFormOptions(next);
                      }}
                      placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                      className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500"
                      required
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Security Defense Explanation
                </label>
                <textarea
                  value={formExplanation}
                  onChange={e => setFormExplanation(e.target.value)}
                  rows={2}
                  placeholder="Explain why the correct answer protects against the threat..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white outline-none focus:border-cyan-500 resize-none"
                  required
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  {editingQuestion ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
