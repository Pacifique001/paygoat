import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import PageWrapper from './PageWrapper';

const TransferSectionUUID = () => {
  const [recipients, setRecipients] = useState([]);
  const [alias, setAlias] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountUSD, setAccountUSD] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const userID = localStorage.getItem('userID');
  const token = localStorage.getItem('token');

  const fetchRecipients = async () => {
    try {
      const response = await api.get(`/payment/saved-recipients?userID=${userID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecipients(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch recipients.');
    }
  };
  
  useEffect(() => {
    fetchRecipients();
  }, []);

  const handleAddRecipient = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/payment/register-alias', { alias, accountNumber, userID }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Recipient added successfully.');
      setAlias('');
      setAccountNumber('');
      setShowAddForm(false);
      await fetchRecipients();
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding recipient.');
    }
  };
  
  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await api.post('/payment/transferFundsUuid', {
        accountUSD,
        recipientUUID: selectedRecipient,
        amount: parseFloat(amount),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('Transfer successful!');
      setAmount('');
      setAccountUSD('');
    } catch (err) {
      setError(err.response?.data?.error || 'Transfer failed.');
    }
  };

  const AddRecipientForm = () => (
    <div className="mt-4 text-left">
      <h3 className="text-xl font-semibold text-white mb-4">Add New Recipient</h3>
      <form onSubmit={handleAddRecipient} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Alias</label>
          <input
            type="text"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="e.g., John's Savings"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Account Number</label>
          <input
            type="text"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Recipient's account number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div className="flex gap-4 pt-2">
          <button type="submit" className="flex-1 py-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">Save Recipient</button>
          <button type="button" className="flex-1 py-2 font-medium bg-white/10 hover:bg-white/20 rounded-lg" onClick={() => setShowAddForm(false)}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

  const TransferForm = () => (
    <div className="mt-4 text-left">
      <h3 className="text-xl font-semibold text-white mb-4">Transfer to a saved recipient</h3>
      <form onSubmit={handleTransfer} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Recipient</label>
          <select
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={selectedRecipient}
            onChange={(e) => setSelectedRecipient(e.target.value)}
            required
          >
            <option value="">-- Select a recipient --</option>
            {recipients.map((rec) => (
              <option key={rec.uuid} value={rec.uuid}>
                {rec.alias} - {rec.accountNumber}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">My Source Account (USD)</label>
          <input
            type="text"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            placeholder="Your USD account number"
            value={accountUSD}
            onChange={(e) => setAccountUSD(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Amount</label>
          <input
            type="number"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="w-full py-3 mt-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          Complete Transfer
        </button>
      </form>
      <hr className="border-white/10 my-6" />
      <button className="w-full py-2 font-medium bg-white/10 hover:bg-white/20 rounded-lg" onClick={() => setShowAddForm(true)}>
        Add New Recipient
      </button>
    </div>
  );

  return (
    <PageWrapper title="Send to Recipient (Beta)">
      {message && <div className="bg-green-500/20 text-green-300 p-3 rounded-lg text-center mb-4">{message}</div>}
      {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center mb-4">{error}</div>}

      {showAddForm ? (
        <AddRecipientForm />
      ) : recipients.length > 0 ? (
        <TransferForm />
      ) : (
        <div className="text-center text-gray-300">
          <p>You have no saved recipients.</p>
          <button className="mt-4 px-5 py-2 font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg" onClick={() => setShowAddForm(true)}>
            Add a Recipient
          </button>
        </div>
      )}
    </PageWrapper>
  );
};

export default TransferSectionUUID;