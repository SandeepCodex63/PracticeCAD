import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { resetPassword, resendOtp } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { Lock, AlertCircle, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password');
    }
  }, [location, navigate]);

  // Resend cooldown timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || !newPassword || !confirmPassword) {
      return setError('Please fill in all fields.');
    }

    if (newPassword !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    if (newPassword.length < 6) {
      return setError('Password must be at least 6 characters.');
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = await resetPassword(email, otp, newPassword);
      if (data?.success) {
        setSuccess('Password updated successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Invalid OTP code.');
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccess('');
    try {
      const data = await resendOtp(email, 'reset');
      if (data?.success) {
        setSuccess('A new password reset code has been sent to your email.');
        setResendCooldown(30);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <AuthLayout title="Enter New Password" subtitle={`Set a new password for ${email}`}>
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
        {/* OTP Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            6-Digit OTP Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="block w-full py-3 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/80 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none text-center font-mono tracking-widest text-lg text-brand-600 dark:text-brand-400 placeholder-slate-350 dark:placeholder-gray-700 transition-colors"
            placeholder="000000"
            required
            disabled={submitting}
          />
        </div>

        {/* New Password Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            New Password
          </label>
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/80 rounded-xl transition-all duration-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 focus-within:bg-white dark:focus-within:bg-slate-900/60 group">
            <div className="pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="block w-full pl-3 pr-10 py-3 bg-transparent border-0 focus:outline-none text-sm text-slate-855 dark:text-gray-250 placeholder-slate-400 dark:placeholder-gray-650 focus:ring-0"
              placeholder="Min. 6 characters"
              required
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 dark:text-gray-500 hover:text-slate-650 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showNewPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2">
            Confirm New Password
          </label>
          <div className="relative flex items-center bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/80 rounded-xl transition-all duration-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/15 focus-within:bg-white dark:focus-within:bg-slate-900/60 group">
            <div className="pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-gray-500 group-focus-within:text-brand-500 transition-colors">
              <Lock className="w-4 h-4" />
            </div>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="block w-full pl-3 pr-10 py-3 bg-transparent border-0 focus:outline-none text-sm text-slate-855 dark:text-gray-250 placeholder-slate-400 dark:placeholder-gray-650 focus:ring-0"
              placeholder="••••••••"
              required
              disabled={submitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-450 dark:text-gray-500 hover:text-slate-650 dark:hover:text-gray-300 transition-colors cursor-pointer"
            >
              {showConfirmPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
            </button>
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
              <span>Saving Password...</span>
            </>
          ) : (
            <span>Update Password</span>
          )}
        </motion.button>
      </form>

      {/* Resend Cooldown triggers */}
      <div className="mt-6 flex flex-col items-center space-y-3">
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0}
          className={`text-xs font-bold transition-colors ${
            resendCooldown > 0
              ? 'text-gray-650 cursor-not-allowed'
              : 'text-brand-400 hover:text-brand-300 cursor-pointer'
          }`}
        >
          {resendCooldown > 0 ? `Resend Reset Code in ${resendCooldown}s` : 'Resend Reset Code'}
        </button>

        <Link
          to="/login"
          className="flex items-center space-x-1 text-xs text-gray-500 hover:text-gray-400 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Sign In</span>
        </Link>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
