import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  getQuizzes, 
  createQuiz, 
  editQuiz, 
  deleteQuiz, 
  getDashboardAnalytics, 
  getExportData 
} from '../services/quizService';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit2, Trash2, Download, AlertTriangle, Users, BookOpen, 
  CheckCircle2, Clock, X, Upload, Award, HelpCircle, ShieldAlert,
  Loader2, Link
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();

  // Data states
  const [quizzes, setQuizzes] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal States
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null); // null for create, quiz object for edit

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [questionsList, setQuestionsList] = useState([
    { id: Date.now(), minAnswer: '', maxAnswer: '', objective: '', imageFile: null, imagePreview: '', imageUrl: '', imageSourceType: 'file' }
  ]);

  // Fetch all dashboard data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const qRes = await getQuizzes();
      if (qRes?.success) setQuizzes(qRes.quizzes);

      const aRes = await getDashboardAnalytics();
      if (aRes?.success) setAnalytics(aRes.analytics);

      const pRes = await getExportData();
      if (pRes?.success) setParticipants(pRes.data);
    } catch (err) {
      setError('Failed to load dashboard data. Verify backend connection.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Form Modal triggers
  const openCreateModal = () => {
    setEditingQuiz(null);
    setTitle('');
    setDescription('');
    setCategory('');
    setDifficulty('medium');
    setStartDate('');
    setEndDate('');
    setQuestionsList([
      { id: Date.now(), minAnswer: '', maxAnswer: '', objective: '', imageFile: null, imagePreview: '', imageUrl: '', imageSourceType: 'file' }
    ]);
    setShowFormModal(true);
  };

  const openEditModal = (quiz) => {
    setEditingQuiz(quiz);
    setTitle(quiz.title);
    setDescription(quiz.description);
    setCategory(quiz.category);
    setDifficulty(quiz.difficulty);
    
    // Format dates to fit HTML input format: YYYY-MM-DDTHH:MM
    const formatInputDate = (dString) => {
      const d = new Date(dString);
      d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
      return d.toISOString().slice(0, 16);
    };

    setStartDate(formatInputDate(quiz.startDate));
    setEndDate(formatInputDate(quiz.endDate));

    const populatedQuestions = quiz.questions && quiz.questions.length > 0
      ? quiz.questions.map(q => ({
          id: q._id,
          _id: q._id,
          imageUrl: q.imageUrl,
          minAnswer: q.minAnswer,
          maxAnswer: q.maxAnswer,
          objective: q.objective || '',
          imageFile: null,
          imagePreview: q.imageUrl,
          imageSourceType: q.imageUrl ? 'url' : 'file'
        }))
      : [{
          id: Date.now(),
          imageUrl: quiz.imageUrl,
          minAnswer: quiz.minAnswer,
          maxAnswer: quiz.maxAnswer,
          objective: quiz.description || '',
          imageFile: null,
          imagePreview: quiz.imageUrl,
          imageSourceType: quiz.imageUrl ? 'url' : 'file'
        }];

    setQuestionsList(populatedQuestions);
    setShowFormModal(true);
  };

  const addQuestion = () => {
    setQuestionsList([
      ...questionsList,
      { id: Date.now(), minAnswer: '', maxAnswer: '', objective: '', imageFile: null, imagePreview: '', imageUrl: '', imageSourceType: 'file' }
    ]);
  };

  const removeQuestion = (id) => {
    if (questionsList.length === 1) {
      alert('A quiz must have at least one question.');
      return;
    }
    setQuestionsList(questionsList.filter(q => q.id !== id));
  };

  const updateQuestionField = (id, fieldOrUpdates, value) => {
    setQuestionsList(prevList => prevList.map(q => {
      if (q.id === id) {
        if (typeof fieldOrUpdates === 'object') {
          return { ...q, ...fieldOrUpdates };
        }
        return { ...q, [fieldOrUpdates]: value };
      }
      return q;
    }));
  };

  const handleQuestionImageChange = (id, e) => {
    const file = e.target.files[0];
    if (file) {
      setQuestionsList(questionsList.map(q => {
        if (q.id === id) {
          return {
            ...q,
            imageFile: file,
            imagePreview: URL.createObjectURL(file),
            imageUrl: ''
          };
        }
        return q;
      }));
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !category || !startDate || !endDate) {
      return alert('Please fill in all text fields.');
    }

    // Validate questions
    for (let i = 0; i < questionsList.length; i++) {
      const q = questionsList[i];
      if (!q.objective || q.objective.trim() === '') {
        return alert(`Please specify the Objective for Question #${i + 1}`);
      }
      if (q.minAnswer === '' || q.maxAnswer === '') {
        return alert(`Please specify min and max answer values for Question #${i + 1}`);
      }
      if (Number(q.minAnswer) > Number(q.maxAnswer)) {
        return alert(`Question #${i + 1}: Minimum answer range value cannot exceed maximum.`);
      }
      if (!q.imageUrl && !q.imageFile) {
        return alert(`Question #${i + 1}: Please select a reference CAD image.`);
      }
    }

    setActionLoading(true);
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', '');
    formData.append('category', category);
    formData.append('difficulty', difficulty);
    formData.append('startDate', new Date(startDate).toISOString());
    formData.append('endDate', new Date(endDate).toISOString());

    // Serialize questions data
    const questionsMeta = questionsList.map(q => ({
      _id: q._id,
      imageUrl: q.imageUrl || '',
      minAnswer: Number(q.minAnswer),
      maxAnswer: Number(q.maxAnswer),
      objective: q.objective || ''
    }));
    formData.append('questions', JSON.stringify(questionsMeta));

    // Append new files in order
    questionsList.forEach(q => {
      if (q.imageFile) {
        formData.append('images', q.imageFile);
      }
    });

    try {
      let res;
      if (editingQuiz) {
        res = await editQuiz(editingQuiz._id, formData);
      } else {
        res = await createQuiz(formData);
      }

      if (res?.success) {
        setShowFormModal(false);
        loadDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Action execution failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('WARNING: Are you sure you want to delete this quiz? All submissions history will be lost.')) return;
    try {
      const res = await deleteQuiz(quizId);
      if (res?.success) {
        loadDashboardData();
      }
    } catch (err) {
      alert('Delete failed.');
    }
  };

  // CSV Exporter Utility
  const handleExportCSV = () => {
    if (participants.length === 0) return alert('No users list available to export.');

    // Define CSV row headers
    const headers = ['Name', 'Email', 'Earned Badges', 'Total Attempts', 'Correct Attempts', 'Success Rate (%)'];
    
    const rows = participants.map(p => {
      const rate = p.totalAttempts > 0 ? Math.round((p.correctAttempts / p.totalAttempts) * 100) : 0;
      return [
        `"${p.name.replace(/"/g, '""')}"`,
        `"${p.email}"`,
        `"${p.badges.join(', ')}"`,
        p.totalAttempts,
        p.correctAttempts,
        rate
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `Quiz_System_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      {/* Page header controls */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-rose-500" />
            <span>Admin Center</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage quizzes, analyze database metrics, and review student grades.
          </p>
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-xs font-bold rounded-xl border border-gray-800 text-gray-300 flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-gray-400" />
            <span>Export CSV</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={openCreateModal}
            className="px-4 py-2.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1 shadow-lg shadow-brand-500/10 border border-brand-400/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Quiz</span>
          </motion.button>
        </div>
      </div>

      {/* Analytics grids */}
      {analytics && (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-6 mb-10">
          
          <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Users className="w-4 h-4 text-brand-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Users</span>
            </div>
            <span className="text-xl font-black text-white">{analytics.totalUsers}</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Quizzes</span>
            </div>
            <span className="text-xl font-black text-white">{analytics.totalQuizzes}</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Plus className="w-4 h-4 text-indigo-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Attempts</span>
            </div>
            <span className="text-xl font-black text-white">{analytics.totalAttempts}</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Accuracy</span>
            </div>
            <span className="text-xl font-black text-emerald-400">{analytics.correctPercentage}%</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-gray-800/80">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <Clock className="w-4 h-4 text-purple-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Avg Time</span>
            </div>
            <span className="text-xl font-black text-white">{analytics.averageTime}s</span>
          </div>

          <div className="glass-panel p-4 rounded-xl border border-gray-800/80 col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 text-gray-400 mb-1">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Difficult</span>
            </div>
            <span className="text-xs font-bold text-gray-250 truncate block" title={analytics.mostDifficultQuiz}>
              {analytics.mostDifficultQuiz}
            </span>
          </div>

        </div>
      )}

      {/* Main content tables grids */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mb-10">
        
        {/* Quizzes list table */}
        <div className="xl:col-span-7">
          <div className="glass-panel rounded-2xl border border-gray-800/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-950 flex justify-between items-center bg-slate-950/20">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active & Upcoming Quizzes
              </h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {quizzes.length} Hosted
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-gray-500 text-[9px] font-bold uppercase tracking-wider border-b border-gray-900">
                    <th className="py-3 px-5">Quiz Title</th>
                    <th className="py-3 px-5 text-center">Category</th>
                    <th className="py-3 px-5 text-center">Range</th>
                    <th className="py-3 px-5 text-center">Difficulty</th>
                    <th className="py-3 px-5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 text-[11px] font-medium text-gray-300">
                  {quizzes.map(q => (
                    <tr key={q._id} className="hover:bg-slate-900/20">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center space-x-3">
                          <img src={q.imageUrl} alt={q.title} className="w-8 h-8 rounded object-cover bg-slate-950 border border-gray-850" />
                          <span className="text-gray-200 font-bold block truncate max-w-[120px]" title={q.title}>
                            {q.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-center text-brand-350 font-semibold uppercase">{q.category}</td>
                      <td className="py-3.5 px-5 text-center font-mono text-gray-400">
                        {q.questions && q.questions.length > 0 
                          ? `${q.questions.length} Question${q.questions.length > 1 ? 's' : ''}` 
                          : `${q.minAnswer} - ${q.maxAnswer}`}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase border border-opacity-20 ${
                          q.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-450 border-emerald-500' :
                          q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-450 border-amber-500' :
                          'bg-rose-500/10 text-rose-455 border-rose-500'
                        }`}>
                          {q.difficulty}
                        </span>
                      </td>
                      <td className="py-3.5 px-5">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => openEditModal(q)}
                            className="p-1.5 text-gray-400 hover:text-brand-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => handleDeleteQuiz(q._id)}
                            className="p-1.5 text-gray-400 hover:text-rose-450 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {quizzes.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-gray-600 italic">
                        No quizzes currently hosted. Click "Create Quiz" to make one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Participant list summary table */}
        <div className="xl:col-span-5">
          <div className="glass-panel rounded-2xl border border-gray-800/80 overflow-hidden">
            <div className="px-5 py-4 border-b border-b-gray-950 bg-slate-950/20 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Participants Roster
              </h3>
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {participants.length} Active
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/40 text-gray-500 text-[9px] font-bold uppercase tracking-wider border-b border-gray-900">
                    <th className="py-3 px-5">Participant</th>
                    <th className="py-3 px-5 text-center">Attempts</th>
                    <th className="py-3 px-5 text-center">Score</th>
                    <th className="py-3 px-5 text-center">Badges</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-900/40 text-[11px] font-medium text-gray-300">
                  {participants.map(p => (
                    <tr key={p.id} className="hover:bg-slate-900/20">
                      <td className="py-3 px-5">
                        <div className="flex flex-col">
                          <span className="text-gray-250 font-bold">{p.name}</span>
                          <span className="text-[9px] text-gray-500">{p.email}</span>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-center font-mono text-gray-400">{p.totalAttempts}</td>
                      <td className="py-3 px-5 text-center font-bold text-emerald-400 font-mono">
                        {p.correctAttempts}
                      </td>
                      <td className="py-3 px-5">
                        <div className="flex justify-center -space-x-1 overflow-hidden">
                          {p.badges?.slice(0, 3).map((badge, idx) => (
                            <span 
                              key={idx} 
                              className="w-5 h-5 rounded-full bg-slate-900 border border-gray-850 flex items-center justify-center text-[10px]"
                              title={badge.replace('_', ' ')}
                            >
                              {badge === 'first_place' && '🏆'}
                              {badge === 'fast_solver' && '⚡'}
                              {badge === 'accuracy_master' && '🎯'}
                              {badge === 'quiz_champion' && '🔥'}
                            </span>
                          ))}
                          {p.badges?.length > 3 && (
                            <span className="w-5 h-5 rounded-full bg-slate-900 border border-gray-850 flex items-center justify-center text-[8px] text-gray-500 font-extrabold">
                              +{p.badges.length - 3}
                            </span>
                          )}
                          {p.badges?.length === 0 && (
                            <span className="text-[10px] text-gray-650 italic">None</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}

                  {participants.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-12 text-center text-gray-600 italic">
                        No student accounts registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* CRUD Quiz Create/Edit Modal Panel */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="max-w-5xl w-full bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-gray-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto text-slate-900 dark:text-white"
            >
              {/* Close Button */}
              <button 
                onClick={() => setShowFormModal(false)}
                className="absolute top-4 right-4 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-gray-400 hover:text-slate-850 dark:hover:text-white transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
                {editingQuiz ? 'Modify Quiz Details' : 'Create New Visual Quiz'}
              </h2>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  
                  {/* Left Column: General Configuration */}
                  <div className="lg:col-span-5 space-y-4">
                    <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-450 border-b border-slate-200 dark:border-gray-800 pb-1.5 mb-2">
                      General Settings
                    </h3>
                    
                    {/* Title */}
                    <div>
                      <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                        Quiz Title
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-colors"
                        placeholder="e.g. Structural Bracket Analysis"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Category */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                          Category
                        </label>
                        <input
                          type="text"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-colors"
                          placeholder="e.g. CAD Part"
                          required
                        />
                      </div>

                      {/* Difficulty */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                          Difficulty Level
                        </label>
                        <select
                          value={difficulty}
                          onChange={(e) => setDifficulty(e.target.value)}
                          className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white transition-colors"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Medium</option>
                          <option value="hard">Hard</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Start Date */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                          Start Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                          required
                        />
                      </div>

                      {/* End Date */}
                      <div>
                        <label className="block text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-1.5">
                          End Date & Time
                        </label>
                        <input
                          type="datetime-local"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="block w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-955 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white transition-colors [color-scheme:light] dark:[color-scheme:dark]"
                          required
                        />
                      </div>
                    </div>

                    {/* Tolerance Explanation Tooltip Helper */}
                    <div className="bg-slate-50 dark:bg-slate-955 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-gray-850/30 text-[10px] text-slate-500 dark:text-gray-400 flex items-start space-x-2">
                      <HelpCircle className="w-4 h-4 text-brand-500 dark:text-brand-400 flex-shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        <strong className="text-slate-700 dark:text-gray-300 font-bold block mb-0.5">Calculation Tolerance Guide:</strong> 
                        In CAD quizzes, volume, mass, or density calculations can differ slightly depending on the student's CAD software, model precision, or decimal settings. 
                        Setting a minimum and maximum range defines the accepted <strong>tolerance margin</strong>. For an exact match question, set both fields to the identical value.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Quiz Questions List */}
                  <div className="lg:col-span-7 space-y-4 flex flex-col">
                    <div className="flex justify-between items-center border-b border-slate-200 dark:border-gray-800 pb-2">
                      <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-455">
                        Quiz Questions ({questionsList.length})
                      </label>
                      <button
                        type="button"
                        onClick={addQuestion}
                        className="px-2.5 py-1 bg-brand-500/10 hover:bg-brand-500/20 border border-brand-500/30 rounded-lg text-[10px] font-bold text-brand-500 dark:text-brand-400 flex items-center space-x-1 cursor-pointer transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Question</span>
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                      {questionsList.map((q, index) => (
                        <div key={q.id} className="p-4 bg-slate-50/50 dark:bg-slate-955 dark:bg-slate-950/40 border border-slate-200 dark:border-gray-800 rounded-2xl relative space-y-3">
                          {/* Question Header & Remove Button */}
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-bold text-slate-500 dark:text-gray-400 uppercase font-mono">Question #{index + 1}</span>
                            {questionsList.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeQuestion(q.id)}
                                className="text-slate-400 hover:text-rose-500 dark:text-gray-500 dark:hover:text-rose-500 transition-colors p-1 cursor-pointer"
                                title="Remove Question"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          {/* Objective */}
                          <div>
                            <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-505 mb-1">
                              Question Objective / Instruction
                            </label>
                            <textarea
                              rows={2}
                              value={q.objective || ''}
                              onChange={(e) => updateQuestionField(q.id, 'objective', e.target.value)}
                              className="block w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-colors leading-relaxed"
                              placeholder="e.g. Find the total mass of the structural steel bracket (kg)."
                              required
                            />
                          </div>

                          {/* Inputs row */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-505 mb-1">
                                Min Accepted Answer
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={q.minAnswer}
                                onChange={(e) => updateQuestionField(q.id, 'minAnswer', e.target.value)}
                                className="block w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-colors"
                                placeholder="e.g. 99"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-505 mb-1">
                                Max Accepted Answer
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={q.maxAnswer}
                                onChange={(e) => updateQuestionField(q.id, 'maxAnswer', e.target.value)}
                                className="block w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-colors"
                                placeholder="e.g. 101"
                                required
                              />
                            </div>
                          </div>

                          {/* Image Source Type Toggle */}
                          <div className="space-y-2">
                            <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-405">
                              Image Source Option
                            </label>
                            <div className="flex space-x-2 p-1 bg-slate-100 dark:bg-slate-950 rounded-xl w-fit">
                              <button
                                type="button"
                                onClick={() => {
                                  updateQuestionField(q.id, {
                                    imageSourceType: 'file',
                                    imageUrl: '',
                                    imagePreview: q.imageFile ? URL.createObjectURL(q.imageFile) : ''
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                                  (q.imageSourceType || 'file') === 'file'
                                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/50 dark:border-gray-800/40'
                                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
                                }`}
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload File</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  updateQuestionField(q.id, {
                                    imageSourceType: 'url',
                                    imageFile: null,
                                    imagePreview: q.imageUrl || ''
                                  });
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                                  q.imageSourceType === 'url'
                                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/50 dark:border-gray-800/40'
                                    : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
                                }`}
                              >
                                <Link className="w-3.5 h-3.5" />
                                <span>Image URL</span>
                              </button>
                            </div>
                          </div>

                          {/* Image Input Selection based on Source Type */}
                          <div>
                            {(q.imageSourceType || 'file') === 'file' ? (
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-gray-405">
                                  CAD Reference Drawing Image
                                </label>
                                <div className="flex items-center space-x-3">
                                  <label className="flex items-center space-x-1 px-3 py-1.5 bg-slate-550/10 hover:bg-slate-550/20 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-250 dark:border-gray-800 rounded-xl cursor-pointer text-[10px] text-slate-700 dark:text-gray-300 transition-colors">
                                    <Upload className="w-3.5 h-3.5 text-slate-555 dark:text-gray-400" />
                                    <span>{q.imageFile ? 'Change Drawing' : 'Select Drawing'}</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleQuestionImageChange(q.id, e)}
                                      className="hidden"
                                    />
                                  </label>
                                  {q.imagePreview && (
                                    <img
                                      src={q.imagePreview}
                                      alt="Preview"
                                      className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-gray-855 bg-slate-50 dark:bg-slate-950"
                                    />
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1.5">
                                <label className="block text-[9px] font-extrabold uppercase tracking-wider text-slate-555 dark:text-gray-405">
                                  CAD Reference Image URL
                                </label>
                                <div className="flex items-center space-x-3">
                                  <input
                                    type="url"
                                    value={q.imageUrl || ''}
                                    onChange={(e) => {
                                      updateQuestionField(q.id, {
                                        imageUrl: e.target.value,
                                        imagePreview: e.target.value,
                                        imagePreviewError: false
                                      });
                                    }}
                                    className="block flex-grow px-3 py-1.5 bg-slate-550/5 dark:bg-slate-950 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-[12px] text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-gray-500 transition-colors"
                                    placeholder="https://example.com/drawing.png"
                                  />
                                  {q.imagePreview && !q.imagePreviewError ? (
                                    <img
                                      src={q.imagePreview}
                                      alt="Preview"
                                      className="w-12 h-12 rounded object-cover border border-slate-200 dark:border-gray-800 bg-slate-50 dark:bg-slate-950"
                                      onError={() => {
                                        updateQuestionField(q.id, 'imagePreviewError', true);
                                      }}
                                    />
                                  ) : q.imagePreview ? (
                                    <div className="w-12 h-12 rounded flex flex-col items-center justify-center border border-dashed border-rose-500/50 bg-rose-500/5 text-[8px] text-rose-450 font-bold text-center px-1">
                                      <span>Invalid</span>
                                      <span>URL</span>
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Action buttons */}
                <div className="mt-8 flex justify-end space-x-3 border-t border-slate-200 dark:border-gray-800 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 text-xs font-bold rounded-xl border border-slate-200 dark:border-gray-800 text-slate-700 dark:text-gray-400 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-brand-500/10 border border-brand-400/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>{editingQuiz ? 'Save Changes' : 'Publish Quiz'}</span>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default AdminDashboard;
