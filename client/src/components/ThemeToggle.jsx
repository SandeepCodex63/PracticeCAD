import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-slate-200/50 hover:bg-slate-300/50 border border-slate-300/80 dark:bg-slate-950/40 dark:hover:bg-slate-900/40 dark:border-gray-800/80 text-amber-500 dark:text-brand-300 transition-colors shadow-md relative overflow-hidden cursor-pointer flex items-center justify-center w-9 h-9"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <motion.div
          key="moon"
          initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <Moon className="w-4 h-4 fill-brand-400/20 text-brand-300" />
        </motion.div>
      ) : (
        <motion.div
          key="sun"
          initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
        >
          <Sun className="w-4 h-4 fill-amber-500/20 text-amber-500" />
        </motion.div>
      )}
    </motion.button>
  );
};

export default ThemeToggle;
