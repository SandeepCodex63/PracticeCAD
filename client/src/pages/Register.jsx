import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { User, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields.');
    }

    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await register(name, email, password);
      if (data?.success) {
        // Navigate to verify-otp page with state
        navigate('/verify-otp', { state: { email, name } });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Join the Quiz" subtitle="Create your student account to get started">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-600 dark:text-rose-450 text-xs font-semibold flex items-start space-x-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <User className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-900/40 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 transition-colors"
              placeholder="e.g. Sandeep Kumar"
              required
            />
          </div>
        </div>

        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-900/40 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 transition-colors"
              placeholder="e.g. name@student.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-900/40 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 transition-colors"
              placeholder="Min. 6 characters"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-10 pr-10 py-3 bg-slate-100 dark:bg-slate-900/40 border border-slate-250 dark:border-gray-800 rounded-xl focus:border-brand-500 focus:outline-none text-sm text-slate-800 dark:text-gray-200 placeholder-slate-400 dark:placeholder-gray-600 transition-colors"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-brand-800 hover:from-brand-500 hover:to-brand-700 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 border border-brand-400/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Sending OTP Code...</span>
            </>
          ) : (
            <span>Sign Up</span>
          )}
        </motion.button>
      </form>

      {/* Switch to Login */}
      <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-8">
        Already have an account?{' '}
        <Link
          to="/login"
          className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
        >
          Log In
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
