import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/Api';

const DeleteAccountProfile = () => {
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    setError('');
    setMessage('');
    setIsDeleting(true);

    const token = localStorage.getItem('token');

    if (!token) {
      setError('User session not found. Please sign in.');
      setIsDeleting(false);
      return;
    }

    try {
      // corrected endpoint name to delete-account (adjust if backend differs)
      await api.delete('/user/delete-account', {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage('Account successfully deleted.');
      localStorage.removeItem('token');
      localStorage.removeItem('userID');

      // small delay so user sees success message (optional)
      setTimeout(() => navigate('/login'), 800);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while deleting the account. Please try again.');
      }
    } finally {
      setIsDeleting(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmDialog(false);
    setError('');
    setMessage('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl shadow-xl p-6">
          <h3 className="text-xl font-semibold text-white text-center mb-4">Delete Account</h3>

          {message && (
            <div className="mb-4 px-4 py-2 bg-green-600/10 border border-green-600/30 text-green-200 rounded">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-300 rounded">
              {error}
            </div>
          )}

          {!showConfirmDialog ? (
            <>
              <p className="text-sm text-white/80 mb-6 text-center">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>

              <button
                onClick={() => setShowConfirmDialog(true)}
                className="w-full mb-3 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition"
              >
                Delete Account
              </button>

              <Link
                to="/main"
                className="w-full inline-block text-center py-3 bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/8 transition"
              >
                Back to Home
              </Link>
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-white/80 text-center">
                Please confirm. This will permanently remove your account and data.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition disabled:opacity-60"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, delete account'}
                </button>

                <button
                  onClick={handleCancel}
                  disabled={isDeleting}
                  className="flex-1 py-3 bg-white/6 border border-white/10 text-white rounded-lg hover:bg-white/8 transition disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 text-center text-xs text-white/60">
          Please contact support if you need help recovering your account.
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountProfile;
