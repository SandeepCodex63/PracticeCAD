import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { verifyOtp, resendOtp } from '../services/authService';
import AuthLayout from '../layouts/AuthLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';

const OTPVerify = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);

  const { loginSuccess } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Populate email from router state
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    } else {
      // If user navigated directly here, redirect back to register
      navigate('/register');
    }
  }, [location, navigate]);

  // Cooldown countdown timer
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
    if (!otp || otp.length !== 6) {
      return setError('Please enter a valid 6-digit OTP.');
    }

    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      const data = await verifyOtp(email, otp);
      if (data?.success) {
        setSuccess('Email verified successfully! Entering quiz...');
        setTimeout(() => {
          loginSuccess(data.user, data.token);
          navigate('/quizzes');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Verification failed. Invalid OTP code.');
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccess('');
    try {
      const data = await resendOtp(email, 'verification');
      if (data?.success) {
        setSuccess('A new verification code has been sent to your email.');
        setResendCooldown(30);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.');
    }
  };

  return (
    <AuthLayout title="Verify Your Account" subtitle={`We sent a 6-digit verification code to ${email}`}>
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

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-start space-x-2"
        >
          <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* OTP Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-gray-400 mb-2 text-center">
            Enter 6-Digit OTP Code
          </label>
          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="block w-full py-3.5 bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-gray-800/80 rounded-xl focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 focus:outline-none text-2xl font-mono tracking-[0.5em] text-center text-brand-600 dark:text-brand-400 placeholder-slate-350 dark:placeholder-gray-700 transition-colors"
            placeholder="000000"
            required
            disabled={submitting}
          />
        </div>

        {/* Submit Verify */}
        <motion.button
          whileHover={{ scale: 1.01, boxShadow: '0 4px 15px -1px rgba(15, 122, 242, 0.3)' }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={submitting || otp.length !== 6}
          className="w-full py-3 bg-brand-500 hover:bg-brand-600 dark:bg-brand-600 dark:hover:bg-brand-500 text-white rounded-xl text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-brand-500/10 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed border border-brand-400/20"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <span>Verify & Login</span>
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
              ? 'text-slate-400 dark:text-gray-650 cursor-not-allowed'
              : 'text-brand-600 dark:text-brand-400 hover:text-brand-500 dark:hover:text-brand-300 cursor-pointer'
          }`}
        >
          {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP Code'}
        </button>

        <button
          onClick={() => navigate('/register')}
          className="flex items-center space-x-1 text-xs text-slate-400 dark:text-gray-500 hover:text-slate-650 dark:hover:text-gray-450 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Registration</span>
        </button>
      </div>
    </AuthLayout>
  );
};

export default OTPVerify;
