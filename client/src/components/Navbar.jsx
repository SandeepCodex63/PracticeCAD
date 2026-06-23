import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Trophy, LogOut, Compass, Shield } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-250 dark:border-gray-800 bg-opacity-70 px-4 py-3 sm:px-6 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <motion.img
            whileHover={{ rotate: 5, scale: 1.05 }}
            src="/logo.png"
            alt="Practice CAD Logo"
            className="w-8 h-8 rounded-lg object-contain shadow-md shadow-brand-500/10 bg-slate-900/10 dark:bg-transparent"
          />
          <span className="hidden sm:inline text-xl font-black tracking-wider bg-gradient-to-r from-slate-900 via-brand-700 to-indigo-800 dark:from-white dark:via-brand-200 dark:to-brand-400 bg-clip-text text-transparent group-hover:from-brand-650 group-hover:to-indigo-950 dark:group-hover:from-brand-300 dark:group-hover:to-white transition-all duration-300">
            Practice CAD
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-1 sm:space-x-4">
          <Link to="/quizzes">
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/quizzes')
                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-gray-800/40'
                }`}
            >
              <Compass className="w-4 h-4" />
              <span className="hidden sm:inline">Quizzes</span>
            </motion.div>
          </Link>

          <Link to="/leaderboard">
            <motion.div
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/leaderboard')
                  ? 'bg-brand-500/15 text-brand-600 dark:text-brand-400 border border-brand-500/25'
                  : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-gray-800/40'
                }`}
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Leaderboard</span>
            </motion.div>
          </Link>

          {user.role === 'admin' && (
            <Link to="/admin">
              <motion.div
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${isActive('/admin')
                    ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25'
                    : 'text-slate-600 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-gray-800/40'
                  }`}
              >
                <Shield className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                <span className="hidden sm:inline">Admin</span>
              </motion.div>
            </Link>
          )}

          <div className="h-6 w-px bg-slate-250 dark:bg-gray-850 mx-1 sm:mx-2" />

          {/* Theme Toggle Button */}
          <ThemeToggle />

          <div className="h-6 w-px bg-slate-250 dark:bg-gray-850 mx-1 sm:mx-2" />

          {/* User Info & Logout */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{user.name}</span>
              <span className="text-[10px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider">{user.role}</span>
            </div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold shadow-md shadow-brand-500/20 border border-brand-400/25"
            >
              {user.name.charAt(0).toUpperCase()}
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.1, color: '#e11d48' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-400 hover:bg-slate-200/60 dark:hover:bg-gray-850 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </div>

        </div>

      </div>
    </nav>
  );
};

export default Navbar;
