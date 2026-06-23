const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const quizRoutes = require('./routes/quizRoutes');
const attemptRoutes = require('./routes/attemptRoutes');
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve local static file fallback (for Multer uploaded quiz images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/quizzes', quizRoutes);
app.use('/api/v1/attempts', attemptRoutes);
app.use('/api/v1/leaderboard', leaderboardRoutes);
app.use('/api/v1/analytics', analyticsRoutes);

// Base Route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to the Practice CAD API Server.'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.message);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
