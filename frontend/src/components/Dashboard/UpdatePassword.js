import React, { useState } from 'react';
import api from '../../services/Api';
import PageWrapper from './PageWrapper';

const UpdatePasswordProfile = () => {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    const userID = localStorage.getItem('userID');
    const token = localStorage.getItem('token');
    
    if (!token || !userID) {
      setError('Authentication error. Please log in again.');
      return;
    }
    
    try {
      await api.put(`/user/profile/${userID}/password`, 
        { password }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage('Password updated successfully.');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'An unknown error occurred while updating the password.');
    }
  };

  return (
    <PageWrapper title="Update Password">
        <form onSubmit={handleUpdate} className="space-y-4">
            {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">{message}</div>}
            {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}
            
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                </label>
                <input
                    type="password"
                    id="password"
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your new password"
                    required
                />
            </div>
            <button 
                type="submit" 
                className="w-full py-3 mt-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
            >
                Save Changes
            </button>
        </form>
    </PageWrapper>
  );
};

export default UpdatePasswordProfile;