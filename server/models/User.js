const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    // Optional for users registering/signing in solely via Google One-Tap
  },
  googleId: {
    type: String
  },
  role: {
    type: String,
    enum: ['participant', 'admin'],
    default: 'participant'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  badges: [{
    type: String,
    enum: ['first_place', 'fast_solver', 'accuracy_master', 'quiz_champion']
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically assign Admin role for default admin email
userSchema.pre('save', async function (next) {
  const adminEmail = process.env.ADMIN_EMAIL || 'kushwaha13579@gmail.com';
  if (this.email === adminEmail) {
    this.role = 'admin';
    this.isVerified = true; // Seed admin starts verified
  }

  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
