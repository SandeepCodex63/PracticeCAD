const User = require('../models/User');
const Attempt = require('../models/Attempt');
const Leaderboard = require('../models/Leaderboard');

const checkAndAwardBadges = async (userId, newAttempt, quizDifficulty) => {
  try {
    const user = await User.findById(userId);
    if (!user) return [];

    const newlyAwarded = [];

    const addBadge = (badgeName) => {
      if (!user.badges.includes(badgeName)) {
        user.badges.push(badgeName);
        newlyAwarded.push(badgeName);
      }
    };

    // 1. Fast Solver: Completed quiz correctly in 30 seconds or less
    if (newAttempt.correct && newAttempt.timeTaken <= 30) {
      addBadge('fast_solver');
    }

    // 2. Accuracy Master: Correct answer on a "hard" difficulty quiz
    if (newAttempt.correct && quizDifficulty === 'hard') {
      addBadge('accuracy_master');
    }

    // 3. Quiz Champion: Has completed 5 or more quizzes correctly
    if (newAttempt.correct) {
      const correctCount = await Attempt.countDocuments({
        userId,
        correct: true
      });
      if (correctCount >= 5) {
        addBadge('quiz_champion');
      }
    }

    if (newlyAwarded.length > 0) {
      await user.save();
    }

    return newlyAwarded;
  } catch (error) {
    console.error('Error awarding badges:', error);
    return [];
  }
};

const checkFirstPlaceBadge = async (userId, quizId) => {
  try {
    const user = await User.findById(userId);
    if (!user) return false;

    // Check if the user is at the top of the leaderboard for this quiz
    const topLeaderboard = await Leaderboard.findOne({ quizId }).sort({ bestTime: 1 });
    if (topLeaderboard && topLeaderboard.userId.toString() === userId.toString()) {
      if (!user.badges.includes('first_place')) {
        user.badges.push('first_place');
        await user.save();
        return true;
      }
    }
    return false;
  } catch (error) {
    console.error('Error checking first place badge:', error);
    return false;
  }
};

module.exports = {
  checkAndAwardBadges,
  checkFirstPlaceBadge
};
