import React, { useState } from 'react';
import api from '../../services/Api';
import PageWrapper from './PageWrapper'; // Assuming you created the wrapper

const Transactions = () => {
  const [amount, setAmount] = useState('');
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [transactionType, setTransactionType] = useState('internal');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // These would typically be dynamic, but are kept as per original logic
  const currencyFrom = 'USD';
  const currencyTo = 'EUR';
  const rate = 1;

  const handleTransaction = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
  
    const transactionData = {
      senderAccountNumber: fromAccount,
      recipientAccountNumber: toAccount,
      amount: parseFloat(amount),
    };
  
    const endpoint = transactionType === 'internal' 
      ? '/payment/transfer' 
      : '/payment/transferthirdparties';

    if (transactionType === 'internal') {
        transactionData.currencyFrom = currencyFrom;
        transactionData.currencyTo = currencyTo;
        transactionData.rate = rate;
    }
  
    try {
      const response = await api.post(endpoint, transactionData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setMessage(response.data.message || 'Transaction successful!');
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    }
  }; 

  return (
    <PageWrapper title="Send Money">
      <form onSubmit={handleTransaction} className="space-y-4">
        {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center">{message}</div>}
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}

        <div>
          <label htmlFor="transactionType" className="block text-sm font-medium text-gray-300 mb-2">
            Transfer Type
          </label>
          <select
            id="transactionType"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="internal">Between My Accounts (USD to EUR)</option>
            <option value="external">To Another User (USD to USD)</option>
          </select>
        </div>

        <div>
          <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-300 mb-2">
            Source Account
          </label>
          <input
            type="text"
            id="fromAccount"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={fromAccount}
            onChange={(e) => setFromAccount(e.target.value)}
            placeholder="Enter source account number"
            required
          />
        </div>

        <div>
          <label htmlFor="toAccount" className="block text-sm font-medium text-gray-300 mb-2">
            Destination Account
          </label>
          <input
            type="text"
            id="toAccount"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            placeholder="Enter destination account number"
            required
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            required
          />
        </div>

        <button 
          type="submit" 
          className="w-full py-3 mt-4 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg shadow-md hover:scale-[1.02] transition-transform"
        >
          Send Transaction
        </button>
      </form>
    </PageWrapper>
  );
};

export default Transactions;