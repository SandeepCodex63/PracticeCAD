import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      return setError('Please enter your email address.');
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = await forgotPassword(email);
      if (data?.success) {
        setSuccess('Reset instructions sent! Redirecting...');
        setTimeout(() => {
          navigate('/reset-password', { state: { email } });
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset code. Email not registered.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout title="Reset Password" subtitle="Enter your email to receive a password reset OTP">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs font-semibold flex items-start space-x-2"
        >
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-semibold flex items-start space-x-2"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
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
              disabled={submitting}
            />
          </div>
        </div>

        {/* Submit */}
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
              <span>Sending OTP...</span>
            </>
          ) : (
            <span>Send Reset Code</span>
          )}
        </motion.button>
      </form>

      {/* Back to Login link */}
      <div className="mt-6 flex justify-center">
        <Link
          to="/login"
          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer font-semibold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
