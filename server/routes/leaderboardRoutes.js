const express = require('express');
const router = express.Router();
const { getGlobalLeaderboard, getQuizLeaderboard } = require('../controllers/leaderboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/global', getGlobalLeaderboard);
router.get('/quiz/:quizId', getQuizLeaderboard);

module.exports = router;
