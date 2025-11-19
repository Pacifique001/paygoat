import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import PageWrapper from './PageWrapper';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userID');

      if (!token || !userID) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/user/profile/${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-400">Loading profile...</div>;
    }
    if (error) {
      return <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>;
    }
    if (user) {
      return (
        <div className="space-y-4 text-lg">
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">Username</span>
            <span className="font-semibold">{user.username}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">First Name</span>
            <span className="font-semibold">{user.firstname}</span>
          </div>
          <div className="flex justify-between items-center py-3 border-b border-white/10">
            <span className="text-gray-400">Last Name</span>
            <span className="font-semibold">{user.lastname}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="text-gray-400">Phone Number</span>
            <span className="font-semibold">{user.phoneNumber}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <PageWrapper title="User Profile">
      {renderContent()}
    </PageWrapper>
  );
};

export default UserProfile;