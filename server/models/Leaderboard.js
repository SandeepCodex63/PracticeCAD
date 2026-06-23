const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  bestTime: {
    type: Number,
    required: true // in seconds
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Composite index to ensure one record per user per quiz
leaderboardSchema.index({ userId: 1, quizId: 1 }, { unique: true });
leaderboardSchema.index({ quizId: 1, bestTime: 1 });

module.exports = mongoose.model('Leaderboard', leaderboardSchema);
