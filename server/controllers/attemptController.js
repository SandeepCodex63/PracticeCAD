const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');
const Leaderboard = require('../models/Leaderboard');
const { checkAndAwardBadges, checkFirstPlaceBadge } = require('../services/badgeService');

// @desc    Submit an answer attempt for a quiz
// @route   POST /api/v1/attempts/:quizId
// @access  Private
const submitAttempt = async (req, res) => {
  const { quizId } = req.params;
  const { answer, answers, timeTaken } = req.body;
  const userId = req.user.id;

  try {
    if (timeTaken === undefined || (answer === undefined && !answers)) {
      return res.status(400).json({ success: false, message: 'Please provide answers and timeTaken.' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // Check if quiz is currently active based on date range
    const now = new Date();
    if (now < quiz.startDate) {
      return res.status(400).json({ success: false, message: 'This quiz has not started yet.' });
    }
    if (now > quiz.endDate) {
      return res.status(400).json({ success: false, message: 'This quiz has ended and is closed for submissions.' });
    }

    // Single Attempt Restriction (Allow re-attempts if previous was incorrect)
    const existingAttempt = await Attempt.findOne({ userId, quizId });
    if (existingAttempt) {
      if (existingAttempt.correct) {
        return res.status(400).json({ success: false, message: 'You have already successfully completed this quiz. Only one correct attempt is permitted.' });
      }
      // Delete the previous incorrect attempt to allow a new attempt
      await Attempt.deleteOne({ _id: existingAttempt._id });
    }

    // Server-side answer validation
    let answersArray = [];
    if (Array.isArray(answers)) {
      answersArray = answers.map(Number);
    } else if (answer !== undefined) {
      answersArray = [Number(answer)];
    }

    const quizQuestions = (quiz.questions && quiz.questions.length > 0)
      ? quiz.questions
      : [{ imageUrl: quiz.imageUrl, minAnswer: quiz.minAnswer, maxAnswer: quiz.maxAnswer }];

    let correctCount = 0;
    quizQuestions.forEach((q, index) => {
      const userAnswer = Number(answersArray[index] !== undefined ? answersArray[index] : 0);
      const isCorrect = userAnswer >= q.minAnswer && userAnswer <= q.maxAnswer;
      if (isCorrect) {
        correctCount++;
      }
    });

    const correct = correctCount === quizQuestions.length;

    // Create the attempt record
    const attempt = await Attempt.create({
      userId,
      quizId,
      answer: answersArray[0] || 0,
      answers: answersArray,
      correct,
      timeTaken: Number(timeTaken)
    });

    let badgesAwarded = [];

    // If correct, update leaderboard and check badges
    if (correct) {
      // Create leaderboard entry
      await Leaderboard.create({
        userId,
        quizId,
        bestTime: Number(timeTaken)
      });

      // Check for standard badges (Fast Solver, Accuracy Master, Quiz Champion)
      badgesAwarded = await checkAndAwardBadges(userId, attempt, quiz.difficulty);

      // Check if user is Rank 1 to award First Place badge
      const gotFirstPlace = await checkFirstPlaceBadge(userId, quizId);
      if (gotFirstPlace) {
        badgesAwarded.push('first_place');
      }
    }

    return res.status(201).json({
      success: true,
      message: correct ? 'Congratulations! Correct answer.' : 'Incorrect answer. Better luck next time!',
      attempt: {
        id: attempt._id,
        correct: attempt.correct,
        timeTaken: attempt.timeTaken,
        answer: attempt.answer,
        answers: attempt.answers,
        submittedAt: attempt.submittedAt
      },
      badgesAwarded
    });
  } catch (error) {
    console.error('Submit Attempt Error:', error);
    // Handle double-submit race conditions gracefully
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You have already submitted an attempt for this quiz.' });
    }
    return res.status(500).json({ success: false, message: 'Server Error processing quiz submission.' });
  }
};

module.exports = {
  submitAttempt
};
