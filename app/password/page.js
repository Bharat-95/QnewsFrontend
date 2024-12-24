'use client';
import React, { useState } from 'react';
import axios from 'axios';

const Page = () => {
  const [step, setStep] = useState(1); // 1: Enter Email, 2: Enter OTP, 3: Reset Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Handle sending OTP
  const sendOtp = async () => {
    try {
      setMessage('');
      setError('');
      const response = await axios.post('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/forgot-password',{ email });
      if (response.data.success) {
        setMessage('OTP sent to your email.');
        setStep(2);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      setError('Error sending OTP. Please check the email address and try again.', err);
    }
  };

  // Handle verifying OTP
  const verifyOtp = async () => {
    try {
      setMessage('');
      setError('');
      const response = await axios.post('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/verify-otp', { email, otp });
      if (response.data.success) {
        setMessage('OTP verified successfully.');
        setStep(3);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
    }
  };

  // Handle resetting the password
  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    try {
      setMessage('');
      setError('');
      const response = await axios.post('https://3jvmmmwqx6.execute-api.ap-south-1.amazonaws.com/users/reset-password', { email, newPassword });
      if (response.data.success) {
        setMessage('Password reset successfully. You can now log in with your new password.');
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Error resetting password. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-md rounded-md">
      <h1 className="text-xl font-bold text-center mb-6">Reset Password</h1>

      {message && <p className="text-green-500 text-center mb-4">{message}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {step === 1 && (
        <div>
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
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Send OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
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
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Verify OTP
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
  );
};

export default Page;
