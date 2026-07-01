import React from 'react';
import { motion } from 'framer-motion';
import ThemeToggle from '../components/ThemeToggle';
import { useNavigate } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-mesh dark:bg-[#0a0d14] text-slate-900 dark:text-gray-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Glow Orbs */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-brand-500/5 dark:bg-brand-500/[0.03] blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/[0.03] blur-3xl -z-10 pointer-events-none" />
 
      {/* Theme Toggle Button positioned at Top Right */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Main Unified Responsive Container */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-md lg:max-w-4xl bg-white dark:bg-slate-950/70 rounded-3xl shadow-2xl border border-slate-200 dark:border-gray-900/60 overflow-hidden grid grid-cols-1 lg:grid-cols-2 relative p-6 sm:p-8 lg:p-0 min-h-fit lg:min-h-[620px]"
      >
        
        {/* Left Section: Unique CAD Preview Sidepanel (visible on lg+) */}
        <div className="hidden lg:flex flex-col justify-between p-10 bg-slate-950 dark:bg-[#06080d] relative overflow-hidden select-none border-r border-slate-200/10 dark:border-gray-900/40">
          
          {/* Blueprint Mesh & Accent Gradient Backgrounds */}
          <div className="absolute inset-0 bg-mesh opacity-20 dark:opacity-25 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-950/30 via-transparent to-indigo-950/20 pointer-events-none" />

          {/* Interactive Logo/Home Link */}
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center space-x-3 z-10 cursor-pointer group w-fit"
          >
            <img
              src="/logo.png"
              alt="Practice CAD Logo"
              className="w-9 h-9 rounded-xl object-contain shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform duration-200"
            />
            <div className="flex flex-col">
              <span className="text-sm font-black tracking-wider text-white leading-none">
                PRACTICE CAD
              </span>
              <span className="text-[8px] font-bold tracking-widest text-slate-400 mt-1 uppercase">
                Gateway
              </span>
            </div>
          </div>

          {/* Rotating Technical CAD Drafting Illustration */}
          <div className="my-auto space-y-8 z-10 flex flex-col items-center">
            <div className="relative w-72 h-72 flex items-center justify-center">
              
              {/* Rotating Compass Outer Dial */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-brand-500/20 rounded-full flex items-center justify-center"
              >
                <div className="w-[85%] h-[85%] border border-dashed border-indigo-500/20 rounded-full" />
              </motion.div>

              {/* Glowing technical crosshair lines */}
              <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-brand-500/15" />
              <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-brand-500/15" />
              
              {/* Concentric helper drafting circles */}
              <div className="absolute w-[60%] h-[60%] border border-brand-500/10 rounded-full" />
              <div className="absolute w-[40%] h-[40%] border border-indigo-500/10 rounded-full" />

              {/* Floating mechanical part */}
              <motion.img
                initial={{ y: -6 }}
                animate={{ y: 6 }}
                transition={{ duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                src="/cad-part.png"
                alt="CAD Part Graphic"
                className="absolute inset-0 w-[88%] h-[88%] m-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.55)]"
              />
            </div>

            <div className="text-center space-y-2 max-w-xs">
              <h3 className="text-lg font-black text-white tracking-tight">
                Master CAD Precision
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Unlock specialized quizzes, benchmark your design speeds, and compare scores on the global leaderboard.
              </p>
            </div>
          </div>

          {/* Sidepanel Footer */}
          <div className="z-10 text-[9px] text-slate-500 uppercase tracking-widest font-bold">
            Learn • Practice • Excel
          </div>
        </div>

        {/* Right Section: Form Wrapper */}
        <div className="flex flex-col justify-center p-0 lg:p-12 relative bg-transparent">
          
          {/* Mobile/Tablet Logo and Brand Header */}
          <div className="flex flex-col items-center lg:hidden mb-6 text-center select-none">
            <img
              src="/logo.png"
              alt="Practice CAD Logo"
              onClick={() => navigate('/')}
              className="w-12 h-12 rounded-xl object-contain shadow-md shadow-brand-500/20 mb-3 bg-slate-900/10 dark:bg-transparent cursor-pointer"
            />
            <h2 className="text-lg font-black tracking-wider text-slate-900 dark:text-white leading-none">
              PRACTICE CAD
            </h2>
            <span className="text-[8px] font-bold tracking-[0.2em] text-slate-400 dark:text-gray-500 mt-1.5 uppercase">
              Learn • Practice • Excel
            </span>
          </div>

          <div className="mb-6 lg:mb-8 text-center lg:text-left">
            <h1 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs lg:text-sm text-slate-500 dark:text-gray-400 mt-1.5 font-medium leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Form Content Area */}
          <div className="relative">
            {children}
          </div>

        </div>

      </motion.div>

      {/* Footer copyright */}
      <p className="text-[10px] text-slate-450 dark:text-gray-600 mt-8 tracking-wider uppercase font-semibold">
        Practice CAD Security Gateway
      </p>
    </div>
  );
};

export default AuthLayout;
