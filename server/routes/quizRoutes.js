const express = require('express');
const router = express.Router();
const {
  createQuiz,
  editQuiz,
  deleteQuiz,
  getQuizzes,
  getQuizById
} = require('../controllers/quizController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/', getQuizzes);
router.get('/:id', getQuizById);

// Admin-only routes
router.post('/', adminOnly, upload.any(), createQuiz);
router.put('/:id', adminOnly, upload.any(), editQuiz);
router.delete('/:id', adminOnly, deleteQuiz);

module.exports = router;
