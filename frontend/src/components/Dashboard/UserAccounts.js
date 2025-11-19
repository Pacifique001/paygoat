import React, { useEffect, useState } from 'react';
import getUserAccounts from '../../services/getUserAccounts';
import PageWrapper from './PageWrapper';

const UserAccounts = () => {
  const [accounts, setAccounts] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getUserAccounts();
        setAccounts(data);
      } catch (err) {
        setError(err.message || "Failed to load account details.");
      } finally {
        setLoading(false);
      }
    };
    fetchAccounts();
  }, []);

  if (loading) {
    return (
        <PageWrapper title="My Accounts">
            <div className="text-center text-gray-400">Loading Account Details...</div>
        </PageWrapper>
    );
  }

  return (
    <PageWrapper title="My Accounts">
        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>}
        
        {accounts && (
            <div className="space-y-6">
                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold text-purple-300">USD Account</h3>
                    <p className="text-2xl font-mono mt-2 tracking-wider">{accounts.accountUSD}</p>
                    <p className="text-gray-300 mt-4">Balance:</p>
                    <p className="text-3xl font-bold text-white">${parseFloat(accounts.balanceUSD).toFixed(2)}</p>
                </div>
                
                <div className="bg-white/5 p-5 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold text-pink-300">EUR Account</h3>
                    <p className="text-2xl font-mono mt-2 tracking-wider">{accounts.accountEUR}</p>
                    <p className="text-gray-300 mt-4">Balance:</p>
                    <p className="text-3xl font-bold text-white">€{parseFloat(accounts.balanceEUR).toFixed(2)}</p>
                </div>
            </div>
        )}
    </PageWrapper>
  );
};

export default UserAccounts;