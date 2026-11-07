'use client';
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false); // To disable button while sending OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // To disable button while verifying OTP

  // The server creates and emails the code; the browser never sees it.
  const sendOtp = async () => {
    try {
      setMessage('');
      setError('');
      setIsSendingOtp(true);
      const response = await axios.post('/api/users/reset-password/request', {
        email: email.trim().toLowerCase(),
      });
      setMessage(response.data?.message || 'If an account exists, a code has been sent to your email.');
      setStep(2);
    } catch (err) {
      setError(err?.response?.data?.message || 'Error sending OTP. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // The code is checked by the server together with the new password.
  const verifyOtp = () => {
    setMessage('');
    setError('');
    if (!/^\d{6}$/.test(otp.trim())) {
      setError('Please enter the 6-digit code from your email.');
      return;
    }
    setStep(3);
  };


  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setMessage('');
      setError('');
      const response = await axios.post('/api/users/reset-password', {
        email: email.trim().toLowerCase(),
        code: otp.trim(),
        newPassword,
      });
      if (response.data.success) {
        setMessage('Password reset successfully. You can now log in with your new password.');
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        router.push('/Login');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      const msg = err?.response?.data?.message;
      setError(msg || 'Error resetting password. Please try again.');
      // Wrong or expired code: let the user fix it.
      if (msg && /code/i.test(msg)) setStep(2);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10">
      <div>
      <h1 className="text-xl font-bold text-center mb-6">Reset Password</h1>

      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {step === 1 && (
        <div className='min-h-screen '>
          <label className="block text-sm font-medium mb-2">Enter your email address:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter your email"
          />
          <button
            onClick={sendOtp}
            disabled={isSendingOtp}
            className="w-full p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            {isSendingOtp ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </div>
      )}

      {step === 2 && (
        <div className='min-h-screen'>
          <label className="block text-sm font-medium mb-2">Enter the OTP sent to your email:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Enter OTP"
          />
          <button
            onClick={verifyOtp}
            disabled={isVerifyingOtp}
            className="w-full p-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            {isVerifyingOtp ? 'Verifying OTP...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <label className="block text-sm font-medium mb-2">Enter your new password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="New Password"
          />
          <label className="block text-sm font-medium mb-2">Confirm your new password:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mb-4"
            placeholder="Confirm Password"
          />
          <button
            onClick={resetPassword}
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Reset Password
          </button>
        </div>
      )}
      </div>
    </div>
  );
};

export default Page;
