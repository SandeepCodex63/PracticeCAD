const mongoose = require('mongoose');

const attemptSchema = new mongoose.Schema({
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
  answer: {
    type: Number,
    required: false
  },
  answers: {
    type: [Number],
    default: []
  },
  correct: {
    type: Boolean,
    required: true
  },
  timeTaken: {
    type: Number,
    required: true // in seconds
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

// Composite index to restrict participants to a single attempt per quiz
attemptSchema.index({ userId: 1, quizId: 1 }, { unique: true });

module.exports = mongoose.model('Attempt', attemptSchema);
