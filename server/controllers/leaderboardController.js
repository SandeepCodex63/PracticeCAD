const Leaderboard = require('../models/Leaderboard');
const Attempt = require('../models/Attempt');
const mongoose = require('mongoose');

// @desc    Get Global Leaderboard
// @route   GET /api/v1/leaderboard/global
// @access  Private
const getGlobalLeaderboard = async (req, res) => {
  try {
    // Aggregate correct attempts to find users' total score and times
    const rankings = await Attempt.aggregate([
      { $match: { correct: true } },
      {
        $group: {
          _id: '$userId',
          score: { $sum: 1 },
          totalTime: { $sum: '$timeTaken' },
          avgTime: { $avg: '$timeTaken' },
          lastActive: { $max: '$submittedAt' }
        }
      },
      { $sort: { score: -1, totalTime: 1 } },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails'
        }
      },
      { $unwind: '$userDetails' },
      {
        $project: {
          _id: 0,
          userId: '$_id',
          name: '$userDetails.name',
          score: 1,
          avgTime: { $round: ['$avgTime', 2] },
          totalTime: { $round: ['$totalTime', 2] },
          date: '$lastActive'
        }
      }
    ]);

    // Format rankings to add Rank index
    const formattedRankings = rankings.map((user, index) => ({
      rank: index + 1,
      ...user
    }));

    return res.status(200).json({
      success: true,
      leaderboard: formattedRankings
    });
  } catch (error) {
    console.error('Global Leaderboard Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching global leaderboard.' });
  }
};

// @desc    Get Leaderboard for a Specific Quiz
// @route   GET /api/v1/leaderboard/quiz/:quizId
// @access  Private
const getQuizLeaderboard = async (req, res) => {
  const { quizId } = req.params;

  try {
    const entries = await Leaderboard.find({ quizId })
      .populate('userId', 'name')
      .sort({ bestTime: 1 })
      .lean();

    const leaderboard = entries.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId?._id,
      name: entry.userId?.name || 'Deleted User',
      timeTaken: entry.bestTime,
      score: 1, // Correct answer always grants 1 point for that quiz
      date: entry.submittedAt
    }));

    return res.status(200).json({
      success: true,
      leaderboard
    });
  } catch (error) {
    console.error('Quiz Leaderboard Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching quiz leaderboard.' });
  }
};

module.exports = {
  getGlobalLeaderboard,
  getQuizLeaderboard
};
