import React, { useState } from 'react';
import api from '../../services/Api';

const ForgotPassword = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/otp/send', { phoneNumber });
      setStep(2);
    } catch (error) {
      console.error('Error sending OTP', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error sending OTP. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/user/reset-password', { phoneNumber, otp, newPassword: newPassword });
      window.location.href = '/login';
    } catch (error) {
      console.error('Error resetting password', error);
      if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Error resetting the password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M3 12a9 9 0 1018 0 9 9 0 10-18 0z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 15s1-2 4-2 4 2 4 2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            <h2 className="text-center text-white text-2xl font-semibold mb-1">
              {step === 1 ? 'Recover Password' : 'Reset Password'}
            </h2>
            <p className="text-center text-sm text-white/70 mb-4">
              {step === 1
                ? 'Enter your phone number to receive an OTP'
                : 'Enter the OTP and choose a new secure password'}
            </p>

            {error && (
              <div className="mb-4 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-300 rounded">
                {error}
              </div>
            )}

            <form onSubmit={step === 1 ? handleSendOtp : handleResetPassword} className="space-y-4">
              {step === 1 ? (
                <>
                  <label className="block">
                    <span className="text-sm text-white/80 mb-1 block">Phone number</span>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-white/60">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                          <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2 8.5V6a2 2 0 012-2h2.5a1 1 0 01.8.4l1.7 2.4a1 1 0 01-.2 1.4L7.5 10.5" />
                        </svg>
                      </span>
                      <input
                        type="text"
                        className="w-full pl-11 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="+250 789 216 438"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        aria-label="Phone number"
                      />
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg shadow hover:scale-[1.01] transition disabled:opacity-60"
                  >
                    {loading ? 'Sending OTP...' : 'Send OTP'}
                  </button>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className="text-sm text-white/80 mb-1 block">OTP</span>
                    <input
                      type="text"
                      className="w-full pl-4 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      aria-label="OTP"
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm text-white/80 mb-1 block">New password</span>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="w-full pl-4 pr-10 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                        placeholder="Create a strong password"
                        value={newPassword}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        aria-label="New password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((s) => !s)}
                        className="absolute inset-y-0 right-2 flex items-center text-white/60 p-1 rounded"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-6 0-10-7-10-7a15.3 15.3 0 012.78-4.11M6.7 6.7A9.956 9.956 0 0112 5c6 0 10 7 10 7s-1.87 3.26-4.7 5.3M3 3l18 18" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M2.98 12.53A12.042 12.042 0 0112 7c6 0 10 7 10 7s-1.94 3.38-4.64 5.28M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </label>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-lg shadow hover:scale-[1.01] transition disabled:opacity-60"
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full mt-2 py-2 text-sm text-white/80 hover:text-white"
                  >
                    Back to send OTP
                  </button>
                </>
              )}
            </form>
          </div>

          <div className="px-6 py-4 border-t border-white/5 bg-gradient-to-t from-white/2 to-transparent">
            <div className="text-xs text-center text-white/60">
              Secure · SMS OTP · Privacy respected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
