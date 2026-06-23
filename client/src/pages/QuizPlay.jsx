import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getQuizById, submitAttempt } from '../services/quizService';
import { useTimer } from '../hooks/useTimer';
import ZoomImage from '../components/ZoomImage';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, HelpCircle, Send, AlertTriangle, Loader2, ArrowLeft, Trophy, CheckCircle2, XCircle, Zap, Award, Flame } from 'lucide-react';

const BADGE_ICONS = {
  first_place: Trophy,
  fast_solver: Zap,
  accuracy_master: Award,
  quiz_champion: Flame
};

const BADGE_NAMES = {
  first_place: 'First Place',
  fast_solver: 'Fast Solver',
  accuracy_master: 'Accuracy Master',
  quiz_champion: 'Quiz Champion'
};

const QuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answersList, setAnswersList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultData, setResultData] = useState(null);
  const [isReviewMode, setIsReviewMode] = useState(false);

  // Auto-starting timer
  const { elapsedTime, stop: stopTimer } = useTimer(true);

  useEffect(() => {
    const fetchQuizDetails = async () => {
      try {
        const data = await getQuizById(id);
        if (data?.success) {
          setQuiz(data.quiz);
          const questionsCount = data.quiz.questions && data.quiz.questions.length > 0
            ? data.quiz.questions.length
            : 1;

          if (data.quiz.attempted && data.quiz.attemptDetails?.correct) {
            setIsReviewMode(true);
            stopTimer(); // freeze timer
            const attemptDetails = data.quiz.attemptDetails;
            if (attemptDetails.answers && attemptDetails.answers.length > 0) {
              setAnswersList(attemptDetails.answers);
            } else if (attemptDetails.answer !== undefined && attemptDetails.answer !== null) {
              setAnswersList([attemptDetails.answer]);
            } else {
              setAnswersList(Array(questionsCount).fill(''));
            }
          } else {
            setAnswersList(Array(questionsCount).fill(''));
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load quiz details.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizDetails();
  }, [id, navigate, stopTimer]);

  const handleSubmit = async () => {
    // Check that all answers are provided
    const numericAnswers = answersList.map(val => {
      if (val === '' || val === undefined) return null;
      return Number(val);
    });

    if (numericAnswers.includes(null)) {
      return alert('Please answer all questions before submitting.');
    }

    setSubmitting(true);
    stopTimer(); // Freeze timer immediately on submit click

    try {
      const data = await submitAttempt(quiz._id, numericAnswers, elapsedTime);
      if (data?.success) {
        setResultData(data);
        setShowResultModal(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit quiz attempt.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-900 dark:text-gray-100 bg-mesh transition-colors">
        <Loader2 className="w-8 h-8 text-brand-500 dark:text-brand-400 animate-spin mb-4" />
        <p className="text-xs text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest">
          Loading Quiz Canvas...
        </p>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen bg-mesh flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full glass-panel p-6 rounded-2xl border border-rose-500/20 text-center">
          <AlertTriangle className="w-10 h-10 text-rose-500 dark:text-rose-400 mx-auto mb-3 animate-pulse" />
          <h4 className="text-slate-900 dark:text-gray-100 font-bold mb-2">Quiz Loading Failed</h4>
          <p className="text-slate-600 dark:text-gray-400 text-xs mb-6">{error || 'The requested quiz details could not be found.'}</p>
          <Link to="/quizzes" className="inline-flex items-center space-x-1 text-xs font-bold text-brand-600 dark:text-brand-450 hover:text-brand-500 dark:hover:text-brand-355 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Quizzes</span>
          </Link>
        </div>
      </div>
    );
  }

  const questions = quiz.questions && quiz.questions.length > 0
    ? quiz.questions
    : [{ imageUrl: quiz.imageUrl, _id: 'legacy', minAnswer: quiz.minAnswer, maxAnswer: quiz.maxAnswer }];

  const currentQuestion = questions[currentQuestionIndex];

  const handleNext = (e) => {
    e.preventDefault();
    if (isReviewMode) {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        navigate('/quizzes');
      }
      return;
    }

    const currentVal = answersList[currentQuestionIndex];
    if (currentVal === '' || currentVal === undefined) {
      return alert('Please enter an answer for this question.');
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleAnswerChange = (val) => {
    const newAnswersList = [...answersList];
    newAnswersList[currentQuestionIndex] = val;
    setAnswersList(newAnswersList);
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="min-h-screen bg-mesh text-slate-900 dark:text-gray-100 pb-16 relative transition-colors duration-300">
      
      {/* Top Banner Control Panel */}
      <div className="glass-panel border-b border-slate-200 dark:border-gray-800/80 px-4 py-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <button 
            onClick={() => navigate('/quizzes')}
            className="flex items-center space-x-1.5 text-xs text-slate-555 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isReviewMode ? 'Exit Review' : 'Abandon Attempt'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-650 dark:text-brand-400 border border-brand-500/20">
              {quiz.category}
            </span>
            <span className="text-xs uppercase font-extrabold tracking-widest px-2.5 py-0.5 rounded bg-slate-200 dark:bg-slate-900 border border-slate-250 dark:border-gray-750 text-slate-600 dark:text-gray-400">
              {quiz.difficulty}
            </span>
          </div>

          {/* Pulsing Timer Widget / Completed Indicator */}
          {isReviewMode ? (
            <div className="flex items-center space-x-2 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 shadow-inner text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-xs uppercase font-extrabold tracking-wider">
                Completed ({quiz.attemptDetails?.timeTaken}s)
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 bg-slate-200/50 dark:bg-slate-900 px-4 py-1.5 rounded-full border border-slate-250 dark:border-gray-750 shadow-inner">
              <Clock className={`w-4 h-4 ${elapsedTime > 60 ? 'text-rose-500 animate-pulse' : 'text-emerald-500 animate-spin-slow'}`} />
              <span className="font-mono text-sm font-bold text-slate-700 dark:text-gray-250 tracking-wider">
                {formatTimer(elapsedTime)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main gameplay quiz layout */}
      <main className="max-w-7xl w-full mx-auto px-4 py-8 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive image canvas */}
        <div className="lg:col-span-8 flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white line-clamp-1">
              {quiz.title}
            </h1>
            {questions.length > 1 && (
              <span className="text-xs font-black text-brand-600 dark:text-brand-400 px-3 py-1 bg-brand-500/10 rounded-full border border-brand-500/20">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            )}
          </div>
          
          <ZoomImage src={currentQuestion.imageUrl} alt={`${quiz.title} - Question ${currentQuestionIndex + 1}`} />
        </div>

        {/* Right Column: Game rules & answer submitting */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-gray-800/80 flex-grow">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-4 flex items-center space-x-2">
              <HelpCircle className="w-4.5 h-4.5 text-brand-500 dark:text-brand-400" />
              <span>{questions.length > 1 ? `Question #${currentQuestionIndex + 1} Objective` : 'Question Objective'}</span>
            </h3>
            
            <p className="text-slate-650 dark:text-gray-300 text-sm leading-relaxed mb-6">
              {currentQuestion.objective || quiz.description}
            </p>

             <div className="bg-slate-100 dark:bg-slate-955 dark:bg-slate-950/60 rounded-xl p-4 border border-slate-200 dark:border-gray-900/85 mb-8">
              <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-brand-650 dark:text-brand-400 flex items-center space-x-1.5 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-555 flex-shrink-0" />
                <span>{isReviewMode ? 'Quiz Review Canvas' : 'Quiz Submission Rules'}</span>
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-gray-555 leading-relaxed">
                {isReviewMode 
                  ? 'You are viewing this quiz in read-only Review Mode. You can navigate through all questions to review your answers and inspect the acceptable CAD drawing target ranges.'
                  : 'You can navigate between questions to review or revise your inputs. Once you lock in and submit the entire quiz, your answers are finalized and the timer stops.'}
              </p>
            </div>

            {/* Submitting Form */}
            <form onSubmit={handleNext} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-555 dark:text-gray-400 mb-2">
                  Your Answer for Question #{currentQuestionIndex + 1}
                </label>
                <input
                  type="number"
                  step="any"
                  value={answersList[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="block w-full px-4 py-3 bg-slate-100 dark:bg-slate-950/80 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-center text-lg font-bold text-slate-800 dark:text-gray-100 placeholder-slate-400 dark:placeholder-gray-700 transition-colors"
                  placeholder="Enter a number..."
                  required
                  disabled={submitting || isReviewMode}
                />
              </div>

              {isReviewMode && (
                <div className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-xl p-3 mt-2">
                  <span className="block text-[9px] uppercase font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
                    Acceptable Answer Range
                  </span>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-700 dark:text-gray-300">
                    <span>Min: {currentQuestion.minAnswer}</span>
                    <span>Max: {currentQuestion.maxAnswer}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                {currentQuestionIndex > 0 && (
                  <button
                    type="button"
                    onClick={handlePrev}
                    disabled={submitting}
                    className="flex-1 py-3 px-4 bg-slate-200 hover:bg-slate-355 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-250 dark:border-gray-855 text-slate-800 dark:text-gray-350 text-xs font-bold rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    Previous
                  </button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!isReviewMode && (submitting || (answersList[currentQuestionIndex] === '' || answersList[currentQuestionIndex] === undefined))}
                  className="flex-[2] py-3 bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/15 border border-brand-400/20 transition-all cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                >
                  {isReviewMode ? (
                    currentQuestionIndex < questions.length - 1 ? (
                      <span>Next Question</span>
                    ) : (
                      <span>Finish Review</span>
                    )
                  ) : submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Quiz...</span>
                    </>
                  ) : currentQuestionIndex < questions.length - 1 ? (
                    <span>Next Question</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Lock In & Submit</span>
                    </>
                  )}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Result celebration Modal Portal Overlay */}
      <AnimatePresence>
        {showResultModal && resultData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-md w-full glass-panel-heavy rounded-3xl p-6 sm:p-8 border border-slate-205 dark:border-gray-850 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Glow effects for Success/Failure */}
              {resultData.attempt?.correct ? (
                <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-emerald-500/10 blur-2xl -z-10 animate-pulse" />
              ) : (
                <div className="absolute -top-10 -left-10 w-44 h-44 rounded-full bg-rose-500/10 blur-2xl -z-10 animate-pulse" />
              )}

              {/* Status Icon */}
              <div className="flex justify-center mb-6">
                {resultData.attempt?.correct ? (
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 0.6 }}
                    className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-555"
                  >
                    <CheckCircle2 className="w-10 h-10" />
                  </motion.div>
                ) : (
                  <motion.div
                    animate={{ scale: [1, 0.9, 1.05, 1] }}
                    className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center text-rose-555"
                  >
                    <XCircle className="w-10 h-10" />
                  </motion.div>
                )}
              </div>

              {/* Title & Message */}
              <h2 className={`text-2xl font-black ${resultData.attempt?.correct ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-450'}`}>
                {resultData.attempt?.correct ? 'Correct Answer!' : 'Incorrect Answer'}
              </h2>
              <p className="text-slate-500 dark:text-gray-400 text-xs mt-2 leading-relaxed px-4">
                {resultData.message}
              </p>

              {/* Details Summary grid */}
              <div className="grid grid-cols-2 gap-4 mt-6 p-4 bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-gray-900 rounded-2xl max-w-sm mx-auto">
                <div className="text-center">
                  <span className="block text-slate-400 dark:text-gray-500 text-[9px] uppercase font-bold tracking-wider mb-1">Time Taken</span>
                  <span className="font-mono text-base font-bold text-slate-800 dark:text-gray-250">
                    {resultData.attempt?.timeTaken} seconds
                  </span>
                </div>
                <div className="text-center border-l border-slate-200 dark:border-gray-900">
                  <span className="block text-slate-400 dark:text-gray-555 text-[9px] uppercase font-bold tracking-wider mb-1">
                    {resultData.attempt?.answers && resultData.attempt.answers.length > 1 ? 'Answers Submitted' : 'Answer Lock'}
                  </span>
                  <span className="font-mono text-sm font-bold text-slate-800 dark:text-gray-250 block truncate max-w-[150px]" title={resultData.attempt?.answers?.join(', ') || resultData.attempt?.answer}>
                    {resultData.attempt?.answers && resultData.attempt.answers.length > 1
                      ? resultData.attempt.answers.join(', ')
                      : resultData.attempt?.answer}
                  </span>
                </div>
              </div>

              {/* Badges Earned Container (If Any) */}
              {resultData.badgesAwarded?.length > 0 && (
                <div className="mt-6">
                  <span className="block text-[10px] uppercase font-extrabold tracking-widest text-brand-500 dark:text-brand-400 mb-3">
                    🏆 New Achievements Earned!
                  </span>
                  
                  <div className="flex items-center justify-center gap-3">
                    {resultData.badgesAwarded.map((b) => {
                      const BadgeIcon = BADGE_ICONS[b] || Award;
                      return (
                        <motion.div
                          key={b}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', delay: 0.2 }}
                          className="flex flex-col items-center bg-brand-500/10 border border-brand-500/25 px-3.5 py-2 rounded-xl text-brand-600 dark:text-brand-400"
                        >
                          <BadgeIcon className="w-5 h-5 mb-1" />
                          <span className="text-[10px] font-extrabold">{BADGE_NAMES[b]}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
                {!resultData.attempt?.correct && (
                  <button
                    onClick={() => {
                      window.location.reload();
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl border border-emerald-500/20 transition-colors cursor-pointer shadow-lg shadow-emerald-500/15"
                  >
                    Try Again
                  </button>
                )}
                <button
                  onClick={() => navigate('/quizzes')}
                  className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-xs font-bold rounded-xl border border-slate-250 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:border-gray-850 dark:text-gray-300 transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
                {resultData.attempt?.correct && (
                  <button
                    onClick={() => navigate('/leaderboard', { state: { highlightQuizId: quiz._id } })}
                    className="px-5 py-2.5 bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white rounded-xl text-xs font-bold transition-all border border-brand-400/20 cursor-pointer shadow-lg shadow-brand-500/10"
                  >
                    Check Leaderboard
                  </button>
                )}
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPlay;
