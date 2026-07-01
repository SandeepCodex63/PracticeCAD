import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
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
        staggerChildren: 0.1
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

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  const stepContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' }
    }
  };

  return (
    <div className="min-h-screen text-slate-900 dark:text-gray-100 transition-colors duration-300 flex flex-col justify-between relative overflow-x-hidden bg-slate-50 dark:bg-[#0a0d14]">

      {/* First Viewport Section */}
      <section className="min-h-screen flex flex-col justify-between relative overflow-x-hidden lg:overflow-hidden w-full bg-slate-50 dark:bg-[#0a0d14]">

        {/* Decorative Blur Orbs */}
        <div className="absolute top-10 right-10 w-96 h-96 rounded-full bg-brand-500/5 blur-3xl -z-10 animate-pulse" />
        <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl -z-10" />

        {/* Navbar bar */}
        <header className="max-w-7xl w-full mx-auto px-4 py-5 sm:px-6 lg:px-8 flex justify-between items-center z-10">
          <div className="flex items-center space-x-3">
            <img
              src="/logo.png"
              alt="Practice CAD Logo"
              className="w-10 h-10 rounded-xl object-contain shadow-md shadow-brand-500/10 dark:bg-transparent"
            />
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white leading-none">
                PRACTICE CAD
              </span>
              <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 dark:text-gray-500 mt-1 uppercase">
                Learn • Practice • Excel
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            {user ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/quizzes')}
                className="px-5 py-2 rounded-full bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/10 cursor-pointer transition-all duration-200"
              >
                Dashboard
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/login')}
                  className="hidden md:block px-4 py-2 rounded-full border border-slate-250 dark:border-gray-800 text-slate-700 dark:text-gray-300 text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-900/60 cursor-pointer transition-all duration-200"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/register')}
                  className="hidden md:block px-4 py-2 rounded-full bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white text-sm font-bold shadow-md shadow-brand-500/10 cursor-pointer transition-all duration-200"
                >
                  Register
                </motion.button>
              </>
            )}
          </div>
        </header>

        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          src="/cad-blueprint-bg.png"
          alt="CAD Blueprint"
          className="absolute inset-0 w-full h-full object-cover object-[65%_center] md:object-center pointer-events-none select-none z-0 dark:invert-[0.9] dark:hue-rotate-[190deg] dark:brightness-[0.7] dark:contrast-[2.5] dark:mix-blend-screen"
        />

        {/* Hero Content */}
        <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex-grow flex flex-col justify-center py-6 sm:py-16 z-10">
          <motion.div
            variants={containerVariants} 
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-12  items-center gap-10 lg:gap-8 "
          >
            {/* Hero Left Column */}
            <div className="lg:col-span-6 flex flex-col space-y-6 text-left items-start">
              <motion.h1
                variants={itemVariants}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
              >
                Practice. <br />
                Improve. <br />
                Excel in <span className="text-brand-500 dark:text-brand-400">CAD.</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-slate-650 dark:text-gray-400 text-base sm:text-lg max-w-xl leading-relaxed"
              >
                Sharpen your CAD skills with real-world challenges. Compete, learn and climb the global leaderboard.
              </motion.p>

              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 4px 20px -2px rgba(15, 122, 242, 0.4)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="px-8 py-3.5 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white rounded-full font-bold flex items-center space-x-2.5 text-base shadow-lg shadow-brand-500/20 cursor-pointer transition-colors duration-200"
                >
                  <span>Start Practicing Now</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>

            {/* Hero Right Column (Layered Composition) */}
            <div className="lg:col-span-6 relative w-full max-w-[300px] min-[360px]:max-w-[330px] min-[400px]:max-w-[370px] sm:max-w-lg lg:max-w-xl aspect-[3/2] mx-auto select-none mt-6 lg:mt-0">
              {/* Layer 1: Blueprint Background */}
              {/* <motion.img
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                src="/cad-blueprint-bg.png"
                alt="CAD Blueprint"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none transition-all duration-300 dark:invert-[0.9] dark:hue-rotate-[190deg] dark:brightness-[0.7] dark:contrast-[1.2]"
              /> */}

              {/* Layer 2: CAD Mechanical Part */}
              <motion.img
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                src="/cad-part.png"
                alt="CAD Mechanical Part"
                className="absolute -top-10 sm:-top-20 right-0 w-full h-full z-10 pointer-events-none select-none drop-shadow-[0_25px_35px_rgba(15,23,42,0.2)] dark:drop-shadow-[0_30px_45px_rgba(0,0,0,0.65)] hover:scale-[1.02] transition-transform duration-500 object-contain"
              />

              {/* Layer 3: Pencil */}
              <motion.img
                initial={{ opacity: 0, rotate: 25, x: 30, y: 30 }}
                animate={{ opacity: 1, rotate: 12, x: 0, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
                src="/pencil.png"
                alt="Pencil"
                className="absolute -top-10  sm:bottom-[6%] right-[2%] sm:right-[1%] w-[30%] sm:w-[36%] z-20 pointer-events-none select-none drop-shadow-[4px_12px_8px_rgba(15,23,42,0.15)] dark:drop-shadow-[4px_12px_8px_rgba(0,0,0,0.45)]"
              />

              {/* Layer 4: Floating Challenge Card */} 
              <motion.div
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }} 
                className="absolute -bottom-[3%] sm:bottom-[8%] left-[2%] sm:left-[-25px] w-[70%] sm:w-[285px] rounded-2xl glass-panel-heavy shadow-2xl border border-slate-200 dark:border-gray-800/80 p-3 sm:p-5 flex gap-3 sm:gap-4 z-30 text-left"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-brand-500 shrink-0 shadow-sm border border-brand-100/50 dark:border-brand-900/20">
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <circle cx="12" cy="12" r="6" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-xs sm:text-base leading-snug">
                    Challenge Yourself
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 dark:text-gray-400 mt-0.5 sm:mt-1 leading-relaxed">
                    Solve CAD problems, enter your answer within the given range and beat the clock!
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Remaining Sections with Grid Background */}
      <div className="bg-mesh w-full border-t border-slate-100 dark:border-gray-900/60 relative overflow-hidden">

        {/* Main Content Area */}
        <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 z-10">

          {/* Features Grid Section (4 Cards) */}
          <motion.div
            variants={cardContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-20"
          >
            {/* Card 1 */}
            <motion.div
              variants={cardVariants}
              className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-gray-800/60 relative group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-300/40 dark:hover:border-brand-500/30 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center text-brand-500 dark:text-brand-400 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                {/* Target SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="6" />
                  <circle cx="12" cy="12" r="2" />
                  <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-gray-100 mb-2">Real CAD Challenges</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Solve practical CAD based questions designed to improve your skills.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={cardVariants}
              className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-gray-800/60 relative group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-300/40 dark:hover:border-brand-500/30 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center text-brand-500 dark:text-brand-400 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                {/* Stopwatch SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 2v4M12 12l4 4" />
                  <path d="M12 2a10 10 0 0 1 10 10" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-gray-100 mb-2">Beat the Clock</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Time starts when you start. Show your speed and climb the ranks.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={cardVariants}
              className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-gray-800/60 relative group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-300/40 dark:hover:border-brand-500/30 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center text-brand-500 dark:text-brand-400 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                {/* Trophy SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 22h16" />
                  <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
                  <path d="M12 2a6 6 0 0 1 6 6v7a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-gray-100 mb-2">Global Leaderboard</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Compete with CAD enthusiasts worldwide and become the best.
              </p>
            </motion.div>

            {/* Card 4 */}
            <motion.div
              variants={cardVariants}
              className="glass-panel p-6 rounded-xl border border-slate-200 dark:border-gray-800/60 relative group hover:-translate-y-1.5 transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-300/40 dark:hover:border-brand-500/30 text-left"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-100 dark:border-brand-900/30 flex items-center justify-center text-brand-500 dark:text-brand-400 mb-4 group-hover:bg-brand-500 group-hover:text-white transition-all duration-300">
                {/* Trend/Progress SVG */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18" />
                  <path d="m18.7 8-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-gray-100 mb-2">Track Your Progress</h3>
              <p className="text-slate-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed">
                Analyze your performance and keep improving every day.
              </p>
            </motion.div>
          </motion.div>

          {/* How It Works Flowchart Section */}
          <div className="mt-28 flex flex-col items-center">
            <motion.h2
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white text-center"
            >
              How It Works
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="w-10 h-1 bg-brand-500 rounded-full mt-3 mb-16 origin-center"
            />

            <motion.div
              variants={stepContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              className="relative w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-12 md:gap-4"
            >

              {/* Dashed Connecting Line for Desktop */}
              <div className="absolute top-[40px] left-[10%] right-[10%] h-[2px] border-t-2 border-dashed border-slate-200 dark:border-gray-800 hidden md:block -z-10" />

              {/* Step 1 */}
              <motion.div
                variants={stepVariants}
                className="flex flex-col items-center max-w-[200px] text-center relative"
              >
                {/* Dashed Connecting Line for Mobile */}
                <div className="absolute top-[80px] bottom-[-48px] w-[2px] border-l-2 border-dashed border-slate-200 dark:border-gray-800 block md:hidden -z-10" />

                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-900 flex items-center justify-center text-slate-650 dark:text-gray-300 shadow-inner border border-slate-200/50 dark:border-gray-800">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center -mt-3 shadow-md border-2 border-white dark:border-slate-950">
                  1
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-4">
                  Sign Up / Login
                </h4>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed">
                  Create your account and join the community.
                </p>
              </motion.div>

              {/* Step 2 */}
              <motion.div
                variants={stepVariants}
                className="flex flex-col items-center max-w-[200px] text-center relative"
              >
                <div className="absolute top-[80px] bottom-[-48px] w-[2px] border-l-2 border-dashed border-slate-200 dark:border-gray-800 block md:hidden -z-10" />

                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-900 flex items-center justify-center text-slate-650 dark:text-gray-300 shadow-inner border border-slate-200/50 dark:border-gray-800">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center -mt-3 shadow-md border-2 border-white dark:border-slate-950">
                  2
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-4">
                  Choose a Quiz
                </h4>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed">
                  Pick a CAD challenge and start the quiz.
                </p>
              </motion.div>

              {/* Step 3 */}
              <motion.div
                variants={stepVariants}
                className="flex flex-col items-center max-w-[200px] text-center relative"
              >
                <div className="absolute top-[80px] bottom-[-48px] w-[2px] border-l-2 border-dashed border-slate-200 dark:border-gray-800 block md:hidden -z-10" />

                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-900 flex items-center justify-center text-slate-650 dark:text-gray-300 shadow-inner border border-slate-200/50 dark:border-gray-800">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center -mt-3 shadow-md border-2 border-white dark:border-slate-950">
                  3
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-4">
                  Solve & Submit
                </h4>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed">
                  Enter your answer within the range before time runs out.
                </p>
              </motion.div>

              {/* Step 4 */}
              <motion.div
                variants={stepVariants}
                className="flex flex-col items-center max-w-[200px] text-center relative"
              >
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-gray-900 flex items-center justify-center text-slate-650 dark:text-gray-300 shadow-inner border border-slate-200/50 dark:border-gray-800">
                  <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="w-6 h-6 rounded-full bg-brand-500 text-white font-extrabold text-xs flex items-center justify-center -mt-3 shadow-md border-2 border-white dark:border-slate-950">
                  4
                </div>
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white mt-4">
                  See Your Rank
                </h4>
                <p className="text-slate-500 dark:text-gray-400 text-xs mt-1.5 leading-relaxed">
                  If correct, your time is recorded on the global leaderboard.
                </p>
              </motion.div>

            </motion.div>
          </div>

          {/* Curved Gradient CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-28 w-full"
          >
            <div className="w-full bg-gradient-to-r from-blue-50/70 to-brand-100/30 dark:from-slate-900/60 dark:to-brand-950/20 border border-blue-100/50 dark:border-gray-800/80 rounded-2xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 text-left">

              <div className="flex items-center space-x-6">
                {/* Trophy cup illustration */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 flex items-center justify-center text-brand-500">
                  <svg className="w-full h-full drop-shadow-md" viewBox="0 0 64 64" fill="none">
                    {/* Base */}
                    <rect x="22" y="52" width="20" height="4" rx="2" fill="currentColor" opacity="0.9" />
                    <path d="M28 44h8v8h-8z" fill="currentColor" opacity="0.6" />
                    {/* Stem */}
                    <path d="M24 44h16l-3-12H27l-3 12z" fill="currentColor" opacity="0.8" />
                    {/* Main Cup */}
                    <path d="M16 12h32v18c0 8.84-7.16 16-16 16s-16-7.16-16-16V12z" fill="currentColor" />
                    {/* Ears/Handles */}
                    <path d="M16 16H10v8c0 4.42 3.58 8 8 8h1M48 16h6v8c0 4.42-3.58 8-8 8h-1" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    {/* Star Emblem */}
                    <path d="M32 20l2.35 4.76 5.25.76-3.8 3.7 1 5.23L32 32l-4.7 2.47 1-5.23-3.8-3.7 5.25-.76L32 20z" fill="white" className="dark:fill-slate-900" />
                  </svg>
                </div>

                <div className="flex flex-col">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
                    Ready to become a CAD champion?
                  </h3>
                  <p className="text-slate-500 dark:text-gray-400 text-sm mt-2 max-w-xl leading-relaxed">
                    Join thousands of learners and professionals who are mastering CAD every day.
                  </p>
                </div>
              </div>

              <div className="shrink-0 w-full md:w-auto">
                <motion.button
                  whileHover={{ scale: 1.04, boxShadow: '0 4px 20px -2px rgba(15, 122, 242, 0.3)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStart}
                  className="w-full md:w-auto px-8 py-3.5 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white rounded-full font-bold flex items-center justify-center space-x-2.5 text-base shadow-md cursor-pointer transition-colors duration-200"
                >
                  <span>Start Practicing Now</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>

        </main>

        {/* Trusted By Partners Section */}
        <motion.footer
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8 border-t border-slate-100 dark:border-gray-900 flex flex-col items-center"
        >
          <span className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-slate-400 dark:text-gray-500 uppercase">
            TRUSTED BY CAD LEARNERS WORLDWIDE
          </span>

          {/* Partners Logos Grid */}
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 mt-8 opacity-50 dark:opacity-40">

            {/* Autodesk logo */}
            <div className="flex items-center text-slate-800 dark:text-gray-250 select-none" title="AUTODESK">
              <svg className="h-6 w-auto" viewBox="0 0 160 28" fill="currentColor">
                {/* Autodesk Icon representation */}
                <path d="M14 2L2 26h5l2.4-5.2h9.2l2.4 5.2h5L14 2zm-2 15.6L14 11.2l2 6.4h-4z" />
                {/* Simplified font Autodesk */}
                <text x="36" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17.5" letterSpacing="0.05em">AUTODESK</text>
              </svg>
            </div>

            {/* SolidWorks logo */}
            <div className="flex items-center text-slate-800 dark:text-gray-250 select-none" title="SOLIDWORKS">
              <svg className="h-6 w-auto" viewBox="0 0 180 28" fill="currentColor">
                {/* SolidWorks Box/Icon */}
                <path d="M4 4h12v12H4z" opacity="0.85" />
                <path d="M8 8h12v12H8z" />
                <text x="26" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="16" letterSpacing="0.02em">SOLIDWORKS</text>
              </svg>
            </div>

            {/* AutoCAD logo */}
            <div className="flex items-center text-slate-800 dark:text-gray-250 select-none" title="AUTOCAD">
              <svg className="h-6 w-auto" viewBox="0 0 140 28" fill="currentColor">
                <path d="M4 22L12 4h4l8 18h-4.2l-1.9-4.5H10.1L8.2 22H4zm8.2-7.8h3.6L14 10.3l-1.8 3.9z" />
                <text x="32" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="17" letterSpacing="0.05em">AUTOCAD</text>
              </svg>
            </div>

            {/* Siemens logo */}
            <div className="flex items-center text-slate-800 dark:text-gray-250 select-none" title="SIEMENS">
              <svg className="h-6.5 w-auto" viewBox="0 0 140 28" fill="currentColor">
                <text x="2" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="22" letterSpacing="0.08em">SIEMENS</text>
              </svg>
            </div>

            {/* Creo logo */}
            <div className="flex items-center text-slate-800 dark:text-gray-250 select-none" title="CREO">
              <svg className="h-6 w-auto" viewBox="0 0 100 28" fill="currentColor">
                {/* Circle represent ptc swoosh */}
                <circle cx="12" cy="14" r="8" stroke="currentColor" strokeWidth="2.5" fill="none" />
                <circle cx="12" cy="14" r="3" fill="currentColor" />
                <text x="28" y="21" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="900" fontSize="20" letterSpacing="-0.02em">creo</text>
              </svg>
            </div>

          </div>

          {/* Small copyright footer */}
          <span className="text-[10px] text-slate-400 dark:text-gray-600 mt-12">
            &copy; {new Date().getFullYear()} Practice CAD. All rights reserved.
          </span>
        </motion.footer>
      </div>
    </div>
  );
};

export default Landing;
