const User = require('../models/User');
const Quiz = require('../models/Quiz');
const Attempt = require('../models/Attempt');

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/v1/analytics/dashboard
// @access  Private/Admin
const getDashboardAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'participant' });
    const totalQuizzes = await Quiz.countDocuments({});
    const totalAttempts = await Attempt.countDocuments({});

    // Correct Percentage
    const correctAttempts = await Attempt.countDocuments({ correct: true });
    const correctPercentage = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100) 
      : 0;

    // Average Time for Correct attempts
    const avgTimeRes = await Attempt.aggregate([
      { $match: { correct: true } },
      { $group: { _id: null, avgTime: { $avg: '$timeTaken' } } }
    ]);
    const averageTime = avgTimeRes.length > 0 
      ? Math.round(avgTimeRes[0].avgTime * 10) / 10 
      : 0;

    // Most Difficult Quiz: Lowest (Correct Attempts / Total Attempts) ratio
    const difficultQuizRes = await Attempt.aggregate([
      {
        $group: {
          _id: '$quizId',
          total: { $sum: 1 },
          correct: { $sum: { $cond: ['$correct', 1, 0] } }
        }
      },
      {
        $project: {
          correctRatio: { $divide: ['$correct', '$total'] }
        }
      },
      { $sort: { correctRatio: 1 } },
      { $limit: 1 },
      {
        $lookup: {
          from: 'quizzes',
          localField: '_id',
          foreignField: '_id',
          as: 'quiz'
        }
      },
      { $unwind: '$quiz' }
    ]);

    const mostDifficultQuiz = difficultQuizRes.length > 0 
      ? difficultQuizRes[0].quiz.title 
      : 'N/A';

    return res.status(200).json({
      success: true,
      analytics: {
        totalUsers,
        totalQuizzes,
        totalAttempts,
        correctPercentage,
        averageTime,
        mostDifficultQuiz
      }
    });
  } catch (error) {
    console.error('Analytics Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching dashboard analytics.' });
  }
};

// @desc    Export Results Data
// @route   GET /api/v1/analytics/export
// @access  Private/Admin
const exportResults = async (req, res) => {
  try {
    const participants = await User.find({ role: 'participant' }).select('-password').lean();
    const attempts = await Attempt.find({})
      .populate('quizId', 'title')
      .populate('userId', 'name email')
      .lean();

    // Group attempts by user to make analysis easier
    const formattedData = participants.map(user => {
      const userAttempts = attempts.filter(a => a.userId?._id.toString() === user._id.toString());
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        badges: user.badges || [],
        totalAttempts: userAttempts.length,
        correctAttempts: userAttempts.filter(a => a.correct).length,
        attempts: userAttempts.map(a => ({
          quizTitle: a.quizId?.title || 'Deleted Quiz',
          answer: a.answer,
          correct: a.correct,
          timeTaken: a.timeTaken,
          submittedAt: a.submittedAt
        }))
      };
    });

    return res.status(200).json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error('Export Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error exporting participant results.' });
  }
};

module.exports = {
  getDashboardAnalytics,
  exportResults
};
