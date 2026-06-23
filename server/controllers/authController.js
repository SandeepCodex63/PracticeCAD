const User = require('../models/User');
const OTP = require('../models/OTP');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendOTPEmail } = require('../services/emailService');
const { OAuth2Client } = require('google-auth-library');

// Helper: Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Helper: Generate 6-Digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register a new user (Unverified)
// @route   POST /api/v1/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      if (userExists.isVerified) {
        return res.status(400).json({ success: false, message: 'User already exists and is verified.' });
      }
      
      // If user exists but is not verified, delete or overwrite their details
      await User.deleteOne({ _id: userExists._id });
    }

    // Create unverified user
    // The pre-save hook will hash the password and set role to admin if email matches
    const user = await User.create({
      name,
      email,
      password,
      isVerified: false
    });

    // Generate and save OTP
    const otpCode = generateOTP();
    await OTP.create({
      email,
      otp: otpCode,
      purpose: 'verification'
    });

    // Send OTP email
    await sendOTPEmail(email, otpCode, 'verification');

    return res.status(201).json({
      success: true,
      message: 'Registration initiated. Please check your email for the verification OTP.',
      email
    });
  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error during registration.' });
  }
};

// @desc    Verify OTP for registration
// @route   POST /api/v1/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP code.' });
    }

    const otpRecord = await OTP.findOne({ email, otp, purpose: 'verification' });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    // Find the user and verify
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User associated with this OTP not found.' });
    }

    user.isVerified = true;
    await user.save();

    // Delete OTP record after successful verification
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully! You can now log in.',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error during OTP verification.' });
  }
};

// @desc    User Login
// @route   POST /api/v1/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    if (!user.isVerified) {
      // If user registered but did not verify email, generate a new OTP
      const otpCode = generateOTP();
      await OTP.findOneAndUpdate(
        { email, purpose: 'verification' },
        { otp: otpCode, createdAt: new Date() },
        { upsert: true, new: true }
      );
      await sendOTPEmail(email, otpCode, 'verification');
      
      return res.status(403).json({
        success: false,
        isUnverified: true,
        message: 'Your email is not verified. A new verification OTP has been sent to your email.'
      });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error during login.' });
  }
};

// @desc    Google Sign-In / Sign-Up
// @route   POST /api/v1/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { credential } = req.body;

  if (!credential) {
    return res.status(400).json({ success: false, message: 'Google Credential Token is required.' });
  }

  try {
    let payload;

    // Handle offline/no-config testing or actual token validation
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.warn('WARNING: GOOGLE_CLIENT_ID not configured. Bypassing token validation for local development.');
      // Mock decoding (in case the client sent a mock token during development)
      try {
        const base64Url = credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        payload = JSON.parse(jsonPayload);
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Invalid Google token format for dev mode.' });
      }
    } else {
      const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID
      });
      payload = ticket.getPayload();
    }

    if (!payload || !payload.email) {
      return res.status(400).json({ success: false, message: 'Failed to verify Google Token.' });
    }

    const { email, name, sub: googleId } = payload;

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // If user exists but is not google-linked, link them
      if (!user.googleId) {
        user.googleId = googleId;
        user.isVerified = true; // Google verified email by definition
        await user.save();
      }
    } else {
      // Create new Google verified user
      // No password needed
      user = await User.create({
        name,
        email,
        googleId,
        isVerified: true
      });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Google Auth Error:', error);
    return res.status(500).json({ success: false, message: 'Google authentication failed on server.' });
  }
};

// @desc    Forgot Password - Requests OTP
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide email.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user registered with this email.' });
    }

    const otpCode = generateOTP();

    // Store/Update OTP for reset purpose
    await OTP.findOneAndUpdate(
      { email, purpose: 'reset' },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Send OTP
    await sendOTPEmail(email, otpCode, 'reset');

    return res.status(200).json({
      success: true,
      message: 'Password reset OTP has been sent to your email.'
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error during password reset request.' });
  }
};

// @desc    Reset Password with OTP
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP code, and new password.' });
    }

    const otpRecord = await OTP.findOne({ email, otp, purpose: 'reset' });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Update password
    user.password = newPassword;
    // Make sure they are verified
    user.isVerified = true;
    await user.save();

    // Delete OTP record
    await OTP.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.'
    });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error during password reset.' });
  }
};

// @desc    Resend OTP (either verification or reset)
// @route   POST /api/v1/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  const { email, purpose } = req.body; // purpose = 'verification' | 'reset'

  try {
    if (!email || !purpose) {
      return res.status(400).json({ success: false, message: 'Please provide email and purpose.' });
    }

    const user = await User.findOne({ email });
    if (purpose === 'reset' && !user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const otpCode = generateOTP();

    await OTP.findOneAndUpdate(
      { email, purpose },
      { otp: otpCode, createdAt: new Date() },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otpCode, purpose);

    return res.status(200).json({
      success: true,
      message: `A new OTP has been sent for ${purpose === 'verification' ? 'email verification' : 'password reset'}.`
    });
  } catch (error) {
    console.error('Resend OTP Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error during OTP resend.' });
  }
};

// @desc    Get Current User Profile
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        badges: user.badges
      }
    });
  } catch (error) {
    console.error('Get Profile Error:', error);
    return res.status(500).json({ success: false, message: 'Server Error fetching user profile.' });
  }
};

module.exports = {
  registerUser,
  verifyOTP,
  loginUser,
  googleLogin,
  forgotPassword,
  resetPassword,
  resendOTP,
  getMe
};
