const express = require('express');
const router = express.Router();
const {
  registerUser,
  verifyOTP,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  resendOTP,
  getMe
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/verify-otp', verifyOTP);
router.post('/login', loginUser);
router.post('/google', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/resend-otp', resendOTP);
router.get('/me', protect, getMe);

module.exports = router;
