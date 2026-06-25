const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  minAnswer: {
    type: Number,
    required: true
  },
  maxAnswer: {
    type: Number,
    required: true
  },
  objective: {
    type: String,
    required: false
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false
  },
  imageUrl: {
    type: String,
    required: false
  },
  minAnswer: {
    type: Number,
    required: false
  },
  maxAnswer: {
    type: Number,
    required: false
  },
  questions: {
    type: [questionSchema],
    default: []
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

quizSchema.pre('save', function (next) {
  if ((!this.questions || this.questions.length === 0) && this.imageUrl && this.minAnswer !== undefined && this.maxAnswer !== undefined) {
    this.questions = [{
      imageUrl: this.imageUrl,
      minAnswer: this.minAnswer,
      maxAnswer: this.maxAnswer,
      objective: this.description
    }];
  }
  next();
});

module.exports = mongoose.model('Quiz', quizSchema);
