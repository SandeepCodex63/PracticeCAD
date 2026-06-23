import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const DashboardLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-mesh text-slate-900 dark:text-gray-100 transition-colors duration-300">
      {/* Navigation Header */}
      <Navbar />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-200 dark:border-gray-900 bg-slate-100/40 dark:bg-slate-950/40 text-center transition-colors duration-300">
        <p className="text-xs text-slate-400 dark:text-gray-650">
          &copy; {new Date().getFullYear()} Practice CAD Platform. Built for excellence.
        </p>
      </footer>
    </div>
  );
};

export default DashboardLayout;
