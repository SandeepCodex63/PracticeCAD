const express = require('express');
const router = express.Router();
const { submitAttempt } = require('../controllers/attemptController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:quizId', protect, submitAttempt);

module.exports = router;
