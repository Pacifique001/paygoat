import React, { useState } from 'react';
import api from '../../services/Api';
import { Link } from 'react-router-dom';

const Register = () => {
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username,
        firstname,
        lastname,
        password,
      });

      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => (window.location.href = '/login'), 1500);
      }
    } catch (err) {
      console.error('Error during registration.', err);
      if (err.response?.data?.error) setError(err.response.data.error);
      else setError('Error during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md">
        <div className="relative bg-white/6 backdrop-blur-md rounded-3xl border border-white/10 p-8 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 10-8 0v4h8V7zM4 15v2a3 3 0 003 3h10a3 3 0 003-3v-2" />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-white text-center mb-1">Create account</h2>
          <p className="text-center text-sm text-white/70 mb-6">Enter your details to get started</p>

          {error && (
            <div className="mb-4 p-3 bg-red-600/10 border border-red-600/30 text-red-200 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-600/10 border border-green-600/30 text-green-200 rounded">
              Registration successful — redirecting to login...
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-sm text-white/80 mb-2 block">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-white/60">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7" />
                  </svg>
                </div>
                <input
                  aria-label="Username"
                  type="text"
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-white/80 mb-2 block">First name</label>
                <input
                  type="text"
                  aria-label="First name"
                  className="w-full pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="First name"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-sm text-white/80 mb-2 block">Last name</label>
                <input
                  type="text"
                  aria-label="Last name"
                  className="w-full pr-3 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Last name"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-white/80 mb-2 block">Password</label>
              <div className="relative">
                <input
                  type="password"
                  aria-label="Password"
                  className="w-full pl-4 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 right-3 flex items-center text-white/50 text-xs">min 8 chars</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:scale-[1.01] transition transform disabled:opacity-60"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-white/70">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-300 font-medium hover:text-white">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          25% { transform: translate(20px,-50px) scale(1.1); }
          50% { transform: translate(-20px,20px) scale(0.9); }
          75% { transform: translate(50px,50px) scale(1.05); }
        }
        .animate-blob { animation: blob 8s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>
    </div>
  );
};

export default Register;
