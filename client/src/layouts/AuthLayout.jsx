import React from 'react';
import { motion } from 'framer-motion';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-mesh text-slate-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-brand-500/10 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 rounded-full bg-indigo-500/10 blur-3xl -z-10" />
 
      {/* Main Glassmorphic Wrapper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-panel-heavy rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-gray-800/80 glow-purple"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <motion.img
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            src="/logo.png"
            alt="Practice CAD Logo"
            className="w-16 h-16 rounded-2xl object-contain shadow-lg shadow-brand-500/20 mb-4 bg-slate-900/10 dark:bg-transparent"
          />
          <h2 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:via-brand-100 dark:to-brand-300 bg-clip-text text-transparent">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-gray-400 mt-2 font-medium">
              {subtitle}
            </p>
          )}
        </div>
 
        {/* Dynamic Inner Form Page */}
        {children}
      </motion.div>
 
      {/* Footer copyright */}
      <p className="text-[10px] text-slate-400 dark:text-gray-600 mt-8 tracking-wider uppercase font-semibold">
        Practice CAD Security Gateway
      </p>
    </div>
  );
};

export default AuthLayout;
