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
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
              <Mail className="w-4 h-4" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 bg-slate-900/40 border border-gray-800 rounded-xl focus:border-brand-500 focus:ring-1 focus:ring-brand-500 focus:outline-none text-sm text-gray-200 placeholder-gray-650 transition-colors"
              placeholder="e.g. name@student.com"
              required
              disabled={submitting}
            />
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={submitting}
          className="w-full py-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-lg shadow-brand-500/20 border border-brand-400/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
