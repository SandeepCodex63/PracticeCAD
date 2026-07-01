import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login, googleLogin } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { loginSuccess } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return setError('Please fill in all fields.');
    }

    setError('');
    setSubmitting(true);

    try {
      const data = await login(email, password);
      if (data?.success) {
        loginSuccess(data.user, data.token);
        navigate('/quizzes');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      
      // If the email is registered but unverified, route to OTP verification
      if (err.response?.status === 403 && err.response?.data?.isUnverified) {
        navigate('/verify-otp', { state: { email } });
      } else {
        setError(errMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('');
    try {
      const data = await googleLogin(credentialResponse.credential);
      if (data?.success) {
        loginSuccess(data.user, data.token);
        navigate('/quizzes');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Google authentication failed.');
    }
  };

  const handleGoogleError = () => {
    setError('Google login initialization failed. Please try again.');
  };

  return (
    <AuthLayout title="Enter the Quiz" subtitle="Log in to participate in visual quizzes">
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
        {/* Email Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Email Address
          </label>
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/80 rounded-xl transition-all duration-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 focus-within:bg-white dark:focus-within:bg-slate-900/60 group">
            <div className="pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-3 pr-4 py-3 bg-transparent border-0 focus:outline-none text-sm text-slate-805 dark:text-gray-250 placeholder-slate-400 dark:placeholder-gray-650 focus:ring-0"
              placeholder="e.g. name@student.com"
              required
            />
          </div>
        </div>

        {/* Password Input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/80 rounded-xl transition-all duration-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 focus-within:bg-white dark:focus-within:bg-slate-900/60 group">
            <div className="pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full pl-3 pr-10 py-3 bg-transparent border-0 focus:outline-none text-sm text-slate-805 dark:text-gray-250 placeholder-slate-400 dark:placeholder-gray-650 focus:ring-0"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 dark:text-gray-500 hover:text-slate-650 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: '0 4px 15px -1px rgba(15, 122, 242, 0.3)' }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-brand-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-brand-400/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Authenticating...</span>
            </>
          ) : (
            <span>Log In</span>
          )}
        </motion.button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center justify-between">
        <span className="w-1/5 border-b border-slate-200 dark:border-gray-850" />
        <span className="text-[10px] font-bold text-slate-400 dark:text-gray-500 uppercase tracking-widest">
          or sign in with
        </span>
        <span className="w-1/5 border-b border-slate-200 dark:border-gray-850" />
      </div>

      {/* Google Login Container */}
      <div className="w-full flex justify-center overflow-hidden rounded-xl border border-slate-250 dark:border-gray-800 bg-slate-100/50 dark:bg-slate-950/40 p-1.5">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="dark"
          size="large"
          width="320px"
        />
      </div>

      {/* Switch to Register */}
      <p className="text-center text-xs text-slate-500 dark:text-gray-500 mt-8">
        Don't have an account?{' '}
        <Link
          to="/register"
          className="font-bold text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 transition-colors"
        >
          Sign Up
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Login;
