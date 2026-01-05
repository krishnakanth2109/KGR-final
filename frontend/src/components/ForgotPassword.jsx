
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // <-- Use the new API helper

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState(''); // Added for new password confirmation
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(''); // Clear previous messages
    try {
      const res = await api.post('/auth/forgot-password', { email });
      setMessage(res.data.message || 'OTP sent to your email.');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(''); // Clear previous messages
    try {
      const res = await api.post('/auth/verify-otp', { email, otp });
      setMessage(res.data.message || 'OTP verified successfully. Please set your new password.');
      setStep(3); // Move to new password entry step
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP or email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage(''); // Clear previous messages
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (newPassword.length < 8) { // Example: enforce minimum password length
        setError("New password must be at least 8 characters long.");
        setLoading(false);
        return;
    }
    try {
      const res = await api.post('/auth/reset-password', { email, otp, newPassword });
      setMessage(res.data.message || 'Password reset successfully!');
      setStep(4); // Move to success step
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "Set New Password"}
            {step === 4 && "Password Reset Success!"}
          </h2>
        </div>

        {error && <div className="mb-4 text-red-600 text-sm font-medium text-center">{error}</div>}
        {message && !error && <div className="mb-4 text-green-600 text-sm font-medium text-center">{message}</div>}

        {/* Step 1: Enter Email */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <p className="text-center text-gray-600">Enter your email to receive a recovery OTP.</p>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@college.com"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Remember your password?{' '}
              <button
                type="button"
                onClick={() => navigate('/admin/login')}
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Log In
              </button>
            </p>
          </form>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <p className="text-center text-gray-600">Please enter the 6-digit OTP sent to <span className="font-semibold text-gray-800">{email}</span>.</p>
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">OTP</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                placeholder="Enter 6-digit OTP"
                maxLength="6"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600">
              Didn't receive the OTP?{' '}
              <button
                type="button"
                onClick={() => setStep(1)} // Go back to step 1 to re-send
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none"
              >
                Re-send OTP
              </button>
            </p>
          </form>
        )}

        {/* Step 3: Set New Password */}
        {step === 3 && (
          <form onSubmit={handleSetNewPassword} className="space-y-6">
            <p className="text-center text-gray-600">Enter and confirm your new password.</p>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="mt-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl transition hover:bg-blue-700 disabled:opacity-70"
            >
              {loading ? "Setting Password..." : "Set Password"}
            </button>
          </form>
        )}

        {/* Step 4: Success Message */}
        {step === 4 && (
          <div className="text-center">
            <p className="text-gray-600 mt-2">Your password has been reset successfully.</p>
            <button
              onClick={() => navigate('/admin/login')}
              className="mt-6 w-full bg-gray-600 text-white font-semibold py-3 rounded-xl transition hover:bg-gray-700"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;