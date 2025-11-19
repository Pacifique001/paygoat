import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/Api';
import PageWrapper from './PageWrapper';

const LoanRequest = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const token = localStorage.getItem('token');
    const userID = localStorage.getItem('userID');

    if (!token || !userID) {
      setError('Authentication error. Please log in again.');
      setLoading(false);
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid loan amount.');
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        userID: parseInt(userID),
        amount: parseFloat(amount)
      };
      await api.post('/bank/loan/request', requestData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Loan requested successfully! Redirecting...');
      setTimeout(() => navigate('/main'), 2000);
    } catch (err) {
      const errorMessage = err.response?.data?.error 
        || (err.response?.status === 400 && 'Invalid data or amount out of range.')
        || (err.response?.status === 403 && 'You have reached the maximum number of allowed loans.')
        || 'An error occurred while requesting the loan.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper title="Request a Loan">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}
        {success && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">{success}</div>}

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Loan Amount (USD)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">$</span>
            <input
              type="number"
              className="w-full p-3 pl-7 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              id="amount"
              min="100"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500.00"
              required
              disabled={loading}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">Minimum: $100 USD, Maximum: $500 USD</p>
        </div>

        <div className="pt-2">
          <button 
            type="submit" 
            className="w-full py-3 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center disabled:opacity-50"
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : 'Request Loan'}
          </button>
        </div>
      </form>
    </PageWrapper>
  );
};

export default LoanRequest;