const express = require('express');
const router = express.Router();
const { getDashboardAnalytics, exportResults } = require('../controllers/analyticsController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect);
router.use(adminOnly);

router.get('/dashboard', getDashboardAnalytics);
router.get('/export', exportResults);

module.exports = router;
