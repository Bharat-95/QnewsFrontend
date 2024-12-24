'use client';
import React, { useState } from 'react';
import axios from 'axios';
import emailjs from 'emailjs-com';
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
  const [sentOtp, setSentOtp] = useState(null); // Store the sent OTP
  const [isSendingOtp, setIsSendingOtp] = useState(false); // To disable button while sending OTP
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false); // To disable button while verifying OTP

  // Handle sending OTP using EmailJS
  const sendOtp = async () => {
    try {
        setMessage('');
        setError('');
        setIsSendingOtp(true); // Disable button during OTP sending

        // Generate a random OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

        setSentOtp(otpCode);

        const templateParams = {
            to_email: email,   // This remains the same as the recipient email
            otp: otpCode,
        };

        const response = await emailjs.send(
            'service_zemecne', // Replace with your service ID
            'template_40yjuqe', // Replace with your template ID
            templateParams,
            'y7xRvo7Xp8BAipO4x' // Replace with your user ID
        );

        if (response.status === 200) {
            setMessage('OTP sent to your email.');
            setStep(2);
        } else {
            setError('Failed to send OTP. Please try again.');
        }
    } catch (err) {
        setError('Error sending OTP. Please check the email address and try again.');
    } finally {
        setIsSendingOtp(false);
    }
};


  const verifyOtp = () => {
    try {
      setMessage('');
      setError('');
      setIsVerifyingOtp(true);

      if (otp === sentOtp?.toString()) {
        setMessage('OTP verified successfully.');
        setStep(3);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      setError('Error verifying OTP. Please try again.');
    } finally {
      setIsVerifyingOtp(false); 
    }
  };


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
        router.push('/Login');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError('Error resetting password. Please try again.');
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
