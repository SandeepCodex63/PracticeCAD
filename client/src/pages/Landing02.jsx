import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { ArrowRight, Trophy, Zap, Image } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const Landing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleStart = () => {
    if (user) {
      navigate('/quizzes');
    } else {
      navigate('/login');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 dark:text-gray-100 transition-colors duration-300 flex flex-col justify-between relative overflow-hidden">

      {/* Decorative Orbs */}
      <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand-500/10 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-600/10 blur-3xl -z-10" />

      {/* Header bar */}
      <header className="max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <img
            src="/logo.png"
            alt="Practice CAD Logo"
            className="w-10 h-10 rounded-xl object-contain shadow-lg shadow-brand-500/20 bg-slate-900/10 dark:bg-transparent"
          />
          <span className="text-xl font-black tracking-wider text-slate-900 dark:text-white">
            Practice CAD
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            className="px-5 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300/80 text-slate-800 dark:bg-gray-900 dark:hover:bg-gray-800 text-sm font-semibold border border-slate-300 dark:border-gray-800 dark:text-gray-200 transition-colors shadow-md cursor-pointer"
          >
            {user ? 'Dashboard' : 'Sign In'}
          </motion.button>
        </div>
      </header>

      {/* Hero Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center py-12 sm:py-24">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center max-w-3xl mx-auto"
        >
          {/* Badge Label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Trophy className="w-3 h-3 text-brand-500 dark:text-brand-400" />
            <span>Competitive Quiz Environment</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white mb-6 leading-none"
          >
            Step Into <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-brand-800 dark:from-brand-400 dark:via-brand-300 dark:to-cyan-400 bg-clip-text text-transparent glow-purple">
              Practice CAD
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-slate-600 dark:text-gray-400 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Test your visual speed and observation skills. Analyze complex images, calculate answers, beat the countdown, and scale the global leaderboard.
          </motion.p>

          {/* Action CTA */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <motion.button
              whileHover={{ scale: 1.06, boxShadow: '0 0 20px 0 rgba(15, 122, 242, 0.4)' }}
              whileTap={{ scale: 0.98 }}
              onClick={handleStart}
              className="px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-800 text-white rounded-2xl font-bold flex items-center space-x-2 text-base shadow-lg shadow-brand-500/25 border border-brand-400/20 cursor-pointer"
            >
              <span>Start Practice</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-5xl mx-auto"
        >
          {/* Card 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-gray-800/60 relative group">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/25 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:bg-brand-500/20 transition-all duration-300">
              <Image className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-2">Image-Based Quizzes</h3>
            <p className="text-slate-650 dark:text-gray-400 text-sm leading-relaxed">
              Quizzes are centered around detailed visual images. Utilize high-resolution rendering with drag-to-pan and pinch-to-zoom support.
            </p>
          </div>

          {/* Card 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-gray-800/60 relative group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-600 dark:text-cyan-400 mb-4 group-hover:bg-cyan-500/20 transition-all duration-300">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-2">Speed & Accuracy Timers</h3>
            <p className="text-slate-650 dark:text-gray-400 text-sm leading-relaxed">
              Your submission time is recorded down to the millisecond. Ranks are determined by the fastest solvers with correct answers.
            </p>
          </div>

          {/* Card 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-gray-800/60 relative group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 group-hover:bg-emerald-500/20 transition-all duration-300">
              <Trophy className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-gray-100 mb-2">Global Leaderboards</h3>
            <p className="text-slate-650 dark:text-gray-400 text-sm leading-relaxed">
              Earn status badges like "Fast Solver" and "Quiz Champion". See how your score and times stack up against participants globally.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer footer */}
      <footer className="py-6 border-t border-slate-250 dark:border-gray-900 bg-slate-100/40 dark:bg-slate-950/40 text-center text-xs text-slate-400 dark:text-gray-650 transition-colors duration-300">
        &copy; {new Date().getFullYear()} Practice CAD. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
