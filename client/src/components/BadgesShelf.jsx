import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Zap, Award, Flame, Lock } from 'lucide-react';

const BADGE_TEMPLATES = {
  first_place: {
    id: 'first_place',
    name: 'First Place',
    icon: Trophy,
    color: 'from-amber-400 to-yellow-600',
    borderColor: 'border-yellow-500/30',
    glowColor: 'shadow-yellow-500/20',
    textColor: 'text-amber-400',
    description: 'Finished rank #1 on a quiz leaderboard.'
  },
  fast_solver: {
    id: 'fast_solver',
    name: 'Fast Solver',
    icon: Zap,
    color: 'from-cyan-400 to-blue-600',
    borderColor: 'border-cyan-500/30',
    glowColor: 'shadow-cyan-500/20',
    textColor: 'text-cyan-400',
    description: 'Submitted a correct answer in under 30 seconds.'
  },
  accuracy_master: {
    id: 'accuracy_master',
    name: 'Accuracy Master',
    icon: Award,
    color: 'from-emerald-400 to-teal-600',
    borderColor: 'border-emerald-500/30',
    glowColor: 'shadow-emerald-500/20',
    textColor: 'text-emerald-400',
    description: 'Successfully answered a Hard difficulty quiz.'
  },
  quiz_champion: {
    id: 'quiz_champion',
    name: 'Quiz Champion',
    icon: Flame,
    color: 'from-rose-500 to-orange-600',
    borderColor: 'border-rose-500/30',
    glowColor: 'shadow-rose-500/20',
    textColor: 'text-rose-400',
    description: 'Correctly completed 5 or more quizzes.'
  }
};

const BadgesShelf = ({ earnedBadges = [] }) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.values(BADGE_TEMPLATES).map((badge) => {
          const isEarned = earnedBadges.includes(badge.id);
          const Icon = badge.icon;

          return (
            <motion.div
              key={badge.id}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative overflow-hidden flex flex-col items-center justify-center p-5 rounded-2xl transition-all duration-300 border text-center ${
                isEarned
                  ? `bg-slate-900/60 backdrop-blur-md ${badge.borderColor} shadow-lg ${badge.glowColor}`
                  : 'bg-slate-950/40 border-gray-900 opacity-40 grayscale'
              }`}
            >
              {/* Badge Icon Backdrop Glow */}
              {isEarned && (
                <div className={`absolute -inset-10 bg-gradient-to-tr ${badge.color} opacity-5 blur-2xl rounded-full`} />
              )}

              {/* Lock Indicator */}
              {!isEarned && (
                <div className="absolute top-2 right-2 p-1 bg-slate-900 rounded-full border border-gray-800">
                  <Lock className="w-3 h-3 text-gray-500" />
                </div>
              )}

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  isEarned
                    ? `bg-gradient-to-tr ${badge.color} text-white shadow-md`
                    : 'bg-slate-800 text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
              </div>

              {/* Title */}
              <h4 className={`text-sm font-bold tracking-wide ${isEarned ? 'text-gray-100' : 'text-gray-500'}`}>
                {badge.name}
              </h4>

              {/* Description */}
              <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed px-1">
                {badge.description}
              </p>

              {/* Status Ribbon */}
              {isEarned && (
                <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-3.5 px-2 py-0.5 rounded bg-brand-500/10 ${badge.textColor} border border-brand-500/20`}>
                  Earned
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default BadgesShelf;
