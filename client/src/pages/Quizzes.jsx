import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getQuizzes } from '../services/quizService';
import DashboardLayout from '../layouts/DashboardLayout';
import BadgesShelf from '../components/BadgesShelf';
import { motion } from 'framer-motion';
import { Search, Calendar, Award, BookOpen, AlertCircle, Play, CheckCircle2, XCircle } from 'lucide-react';

const DIFFICULTY_COLORS = {
  easy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
  hard: 'bg-rose-500/10 text-rose-600 dark:text-rose-450 border-rose-500/20'
};

const Quizzes = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchQuizzesList = async () => {
    try {
      const data = await getQuizzes();
      if (data?.success) {
        setQuizzes(data.quizzes);
      }
    } catch (err) {
      setError('Failed to fetch quizzes. Please try reloading the page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzesList();
  }, []);

  // Compute Categories from quizzes list
  const categories = ['All', ...new Set(quizzes.map((q) => q.category))];

  // Filter quizzes based on category and search query
  const filteredQuizzes = quizzes.filter((quiz) => {
    const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          quiz.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || quiz.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate student statistics
  const attemptedQuizzes = quizzes.filter(q => q.attempted);
  const correctCount = attemptedQuizzes.filter(q => q.attemptDetails?.correct).length;
  const accuracyRate = attemptedQuizzes.length > 0 
    ? Math.round((correctCount / attemptedQuizzes.length) * 100) 
    : 0;

  const getQuizTimeStatus = (quiz) => {
    const now = new Date();
    const start = new Date(quiz.startDate);
    const end = new Date(quiz.endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'ended';
    return 'active';
  };

  const formatQuizDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <DashboardLayout>
      {/* Welcome & Stats Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-brand-650 to-indigo-600 dark:from-brand-400 dark:to-indigo-300 bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
            Browse active quizzes, check your badges, and challenge yourself.
          </p>
        </div>

        {/* Dynamic Mini Stats grid */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 bg-slate-100/60 dark:bg-slate-900/40 border border-slate-205 dark:border-gray-800/80 rounded-2xl p-4 max-w-md w-full transition-colors duration-300">
          <div className="text-center">
            <span className="block text-2xl font-black text-slate-800 dark:text-white">{attemptedQuizzes.length}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500 tracking-wider">Attempted</span>
          </div>
          <div className="text-center border-x border-slate-205 dark:border-gray-800">
            <span className="block text-2xl font-black text-brand-600 dark:text-brand-400">{user?.badges?.length || 0}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500 tracking-wider">Badges</span>
          </div>
          <div className="text-center">
            <span className="block text-2xl font-black text-emerald-600 dark:text-emerald-400">{accuracyRate}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-gray-500 tracking-wider">Accuracy</span>
          </div>
        </div>
      </div>

      {/* Badges Cabinet shelf */}
      <div className="mb-10">
        <h3 className="text-base font-extrabold tracking-wider text-slate-400 dark:text-gray-400 uppercase mb-4 flex items-center space-x-2">
          <Award className="w-4 h-4 text-brand-500 dark:text-brand-400" />
          <span>My Achievement Shelf</span>
        </h3>
        <BadgesShelf earnedBadges={user?.badges || []} />
      </div>

      <hr className="border-slate-200 dark:border-gray-900 my-8" />

      {/* Quiz Library Header, Search & Filter Tools */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-brand-500 dark:text-brand-400" />
            <span>Practice CAD Quizzes</span>
          </h3>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow sm:max-w-xs">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900/40 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-650 transition-colors"
              placeholder="Search quizzes by name..."
            />
          </div>

          {/* Category Dropdown/Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-500/15 text-brand-650 dark:text-brand-400 border-brand-500/30 shadow-md'
                    : 'bg-transparent text-slate-500 dark:text-gray-400 border-slate-200 dark:border-gray-900 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/40 dark:hover:bg-slate-900/35'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-650 dark:text-rose-450 text-sm font-semibold flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quizzes Grid layout */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="glass-panel h-80 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-16 bg-slate-100/40 dark:bg-slate-950/20 border border-slate-200 dark:border-gray-900 rounded-2xl">
          <BookOpen className="w-10 h-10 text-slate-350 dark:text-gray-700 mx-auto mb-3" />
          <h4 className="text-slate-500 dark:text-gray-400 font-bold">No quizzes found</h4>
          <p className="text-slate-400 dark:text-gray-650 text-xs mt-1">Try modifying your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const timeStatus = getQuizTimeStatus(quiz);
            const isAttempted = quiz.attempted;

            return (
              <motion.div
                key={quiz._id}
                whileHover={{ y: -5 }}
                className="glass-panel rounded-2xl overflow-hidden flex flex-col justify-between border border-slate-200 dark:border-gray-800/60 shadow-lg relative group h-full"
              >
                {/* Image block */}
                <div className="relative h-44 overflow-hidden bg-slate-200 dark:bg-slate-950">
                  <img
                    src={quiz.imageUrl}
                    alt={quiz.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Category overlay */}
                  <span className="absolute top-3 left-3 bg-slate-100/90 dark:bg-slate-950/80 backdrop-blur-md px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-widest text-brand-650 dark:text-brand-300 rounded-md border border-brand-500/20">
                    {quiz.category}
                  </span>

                  {/* Difficulty Tag */}
                  <span className={`absolute top-3 right-3 px-2 py-1 text-[9px] font-extrabold uppercase tracking-widest rounded-md border ${DIFFICULTY_COLORS[quiz.difficulty]}`}>
                    {quiz.difficulty}
                  </span>
                </div>

                {/* Info block */}
                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-gray-100 mb-2 group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors line-clamp-1">
                      {quiz.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {quiz.description}
                    </p>
                  </div>

                  <div>
                    {/* Time Schedule details */}
                    <div className="flex items-center space-x-2 text-[10px] text-slate-500 dark:text-gray-500 mb-4 bg-slate-100 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-200 dark:border-gray-900/40">
                      <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                      <div className="flex flex-col">
                        <span>Starts: {formatQuizDate(quiz.startDate)}</span>
                        <span>Ends:   {formatQuizDate(quiz.endDate)}</span>
                      </div>
                    </div>

                    {/* Action Block */}
                    {isAttempted && quiz.attemptDetails?.correct ? (
                      /* If successfully completed, show correct status with Review Quiz button */
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20">
                          <div className="flex items-center space-x-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-555 dark:text-emerald-400" />
                            <span className="text-[11px] font-bold text-emerald-650 dark:text-emerald-400">
                              Completed
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 dark:text-gray-500 font-mono">
                            Time: {quiz.attemptDetails?.timeTaken}s
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => navigate(`/quiz/${quiz._id}`)}
                          className="w-full py-2.5 bg-slate-200 hover:bg-slate-355 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-gray-300 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 border border-slate-250 dark:border-gray-800 cursor-pointer transition-colors"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Review Quiz</span>
                        </motion.button>
                      </div>
                    ) : (
                      /* Not attempted OR incorrect (which means they can play/re-attempt) */
                      <>
                        {timeStatus === 'active' && (
                          <div className="space-y-2">
                            {isAttempted && !quiz.attemptDetails?.correct && (
                              <div className="flex items-center justify-between p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                                <span className="text-[10px] font-bold text-rose-500 dark:text-rose-450 flex items-center gap-1">
                                  <XCircle className="w-3.5 h-3.5" /> Incorrect (Try again!)
                                </span>
                                <span className="text-[9px] text-slate-400 dark:text-gray-500 font-mono">
                                  Last Time: {quiz.attemptDetails?.timeTaken}s
                                </span>
                              </div>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate(`/quiz/${quiz._id}`)}
                              className="w-full py-2.5 bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1 shadow-md shadow-brand-500/10 border border-brand-400/10 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>{isAttempted ? 'Re-attempt Quiz' : 'Play Quiz'}</span>
                            </motion.button>
                          </div>
                        )}
                        {timeStatus === 'upcoming' && (
                          <button
                            disabled
                            className="w-full py-2.5 bg-slate-200 dark:bg-slate-950/60 border border-slate-250 dark:border-gray-900 text-slate-400 dark:text-gray-500 rounded-xl text-xs font-bold cursor-not-allowed"
                          >
                            Upcoming Quiz
                          </button>
                        )}
                        {timeStatus === 'ended' && (
                          <button
                            disabled
                            className="w-full py-2.5 bg-slate-200/60 dark:bg-slate-950/40 border border-slate-250 dark:border-gray-900 text-slate-400 dark:text-gray-650 rounded-xl text-xs font-bold cursor-not-allowed"
                          >
                            Ended (Closed)
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Quizzes;
