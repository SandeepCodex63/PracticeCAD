import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getGlobalLeaderboard, getQuizLeaderboard, getQuizzes } from '../services/quizService';
import DashboardLayout from '../layouts/DashboardLayout';
import { motion } from 'framer-motion';
import { Trophy, Clock, BarChart2, Star } from 'lucide-react';

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState('global'); // 'global' | 'quiz'
  const [globalData, setGlobalData] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState('');
  const [quizLeaderboard, setQuizLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { user } = useAuth();
  const location = useLocation();

  // Load global rankings and quizzes list
  const initializeLeaderboard = async () => {
    setLoading(true);
    setError('');
    try {
      const globalRes = await getGlobalLeaderboard();
      if (globalRes?.success) {
        setGlobalData(globalRes.leaderboard);
      }

      const quizzesRes = await getQuizzes();
      if (quizzesRes?.success) {
        setQuizList(quizzesRes.quizzes);
        
        // Check if redirected from QuizPlay with a specific quiz ID to load
        const highlightId = location.state?.highlightQuizId;
        if (highlightId) {
          setSelectedQuizId(highlightId);
          setActiveTab('quiz');
        } else if (quizzesRes.quizzes.length > 0) {
          setSelectedQuizId(quizzesRes.quizzes[0]._id);
        }
      }
    } catch (err) {
      setError('Failed to fetch leaderboard records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeLeaderboard();
  }, [location]);

  // Load Quiz Specific Leaderboard when selected quiz changes
  useEffect(() => {
    const fetchQuizRankings = async () => {
      if (!selectedQuizId || activeTab !== 'quiz') return;
      try {
        const res = await getQuizLeaderboard(selectedQuizId);
        if (res?.success) {
          setQuizLeaderboard(res.leaderboard);
        }
      } catch (err) {
        console.error('Quiz Rankings Error:', err);
      }
    };
    fetchQuizRankings();
  }, [selectedQuizId, activeTab]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (seconds) => {
    if (seconds === undefined) return 'N/A';
    return `${seconds}s`;
  };

  const renderRankBadge = (rank) => {
    if (rank === 1) return <span className="text-yellow-500 font-bold flex items-center justify-center"><Trophy className="w-5 h-5 fill-current" /></span>;
    if (rank === 2) return <span className="text-slate-400 font-bold text-lg">🥈</span>;
    if (rank === 3) return <span className="text-amber-700 font-bold text-lg">🥉</span>;
    return <span className="text-slate-400 dark:text-gray-550 font-mono text-sm">{rank}</span>;
  };

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <Trophy className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
          <span>Hall of Fame</span>
        </h1>
        <p className="text-slate-500 dark:text-gray-400 text-sm mt-1">
          Review top scoring participants and fastest question solvers.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 p-1 bg-slate-100 dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-gray-900 max-w-xs transition-colors duration-300">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'global'
              ? 'bg-brand-500 text-white shadow-md'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Global Leaderboard
        </button>
        <button
          onClick={() => setActiveTab('quiz')}
          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'quiz'
              ? 'bg-brand-500 text-white shadow-md'
              : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Quiz Standings
        </button>
      </div>

      {/* Main rankings layout container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left pane: selector panel if Quiz tab is open */}
        {activeTab === 'quiz' && (
          <div className="lg:col-span-4 glass-panel p-5 rounded-2xl border border-slate-200 dark:border-gray-800/80 h-fit">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 dark:text-gray-400 mb-4 flex items-center space-x-1.5">
              <BarChart2 className="w-4 h-4 text-brand-500 dark:text-brand-400" />
              <span>Select Practice CAD</span>
            </h3>
            
            <label className="block text-[11px] font-extrabold uppercase text-slate-500 dark:text-gray-500 tracking-wider mb-2">
              Quiz Title
            </label>
            <select
              value={selectedQuizId}
              onChange={(e) => setSelectedQuizId(e.target.value)}
              className="block w-full px-3 py-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-xs text-slate-800 dark:text-gray-200 transition-colors"
            >
              {quizList.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title}
                </option>
              ))}
            </select>

            {quizList.length === 0 && (
              <p className="text-[10px] text-slate-450 dark:text-gray-650 mt-3 italic text-center">
                No quizzes available to review.
              </p>
            )}
          </div>
        )}

        {/* Right pane: list table */}
        <div className={activeTab === 'global' ? 'lg:col-span-12 w-full' : 'lg:col-span-8 w-full'}>
          <div className="glass-panel rounded-2xl border border-slate-205 dark:border-gray-800/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-950/65 text-slate-500 dark:text-gray-500 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-gray-850">
                    <th className="py-4 px-6 text-center w-16">Rank</th>
                    <th className="py-4 px-6">Name</th>
                    {activeTab === 'global' ? (
                      <>
                        <th className="py-4 px-6 text-center">Average Time</th>
                        <th className="py-4 px-6 text-center">Total Score</th>
                      </>
                    ) : (
                      <>
                        <th className="py-4 px-6 text-center">Time Taken</th>
                        <th className="py-4 px-6 text-center">Date Lock</th>
                      </>
                    )}
                    <th className="py-4 px-6 text-center">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-gray-900/60 text-xs font-medium text-slate-700 dark:text-gray-300">
                  
                  {/* Global Tab Loader */}
                  {loading && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-slate-400 dark:text-gray-500 font-bold uppercase tracking-widest animate-pulse">
                        Analyzing scoreboard rosters...
                      </td>
                    </tr>
                  )}

                  {/* Empty State */}
                  {!loading && (activeTab === 'global' ? globalData : quizLeaderboard).length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-16 text-center">
                        <Star className="w-8 h-8 text-slate-300 dark:text-gray-700 mx-auto mb-2" />
                        <h4 className="text-slate-400 dark:text-gray-500 font-bold">No Records Yet</h4>
                        <p className="text-slate-400 dark:text-gray-600 text-[10px] mt-0.5">Correct answer submissions will populate this board.</p>
                      </td>
                    </tr>
                  )}

                  {/* Render Data Rows */}
                  {!loading && (activeTab === 'global' ? globalData : quizLeaderboard).map((row) => {
                    const isSelf = row.userId === user?.id;

                    return (
                      <tr
                        key={row.userId + (row.rank || '')}
                        className={`transition-colors ${
                          isSelf 
                            ? 'bg-brand-500/10 hover:bg-brand-500/15 text-slate-900 dark:text-white font-bold border-l-2 border-l-brand-500 shadow-inner'
                            : 'hover:bg-slate-100/50 dark:hover:bg-slate-900/30'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-4 px-6 text-center font-bold">
                          {renderRankBadge(row.rank)}
                        </td>

                        {/* Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-2">
                            <span className={isSelf ? 'text-brand-600 dark:text-brand-300' : 'text-slate-800 dark:text-gray-200'}>
                              {row.name}
                            </span>
                            {isSelf && (
                              <span className="text-[9px] uppercase font-extrabold tracking-widest px-1.5 py-0.5 bg-brand-500/20 text-brand-600 dark:text-brand-300 rounded border border-brand-500/30">
                                You
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Middle dynamic cells */}
                        {activeTab === 'global' ? (
                          <>
                            <td className="py-4 px-6 text-center font-mono flex items-center justify-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-gray-650" />
                              <span>{formatTime(row.avgTime)}</span>
                            </td>
                            <td className="py-4 px-6 text-center font-extrabold text-sm text-slate-800 dark:text-gray-150">
                              {row.score}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-6 text-center font-mono flex items-center justify-center space-x-1">
                              <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-gray-650" />
                              <span>{formatTime(row.timeTaken)}</span>
                            </td>
                            <td className="py-4 px-6 text-center font-mono text-slate-500 dark:text-gray-400">
                              {formatTime(row.timeTaken)}
                            </td>
                          </>
                        )}

                        {/* Date cell */}
                        <td className="py-4 px-6 text-center font-mono text-slate-450 dark:text-gray-500">
                          {formatDate(row.date)}
                        </td>
                      </tr>
                    );
                  })}

                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default LeaderboardPage;
