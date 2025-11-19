import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import getUserAccounts from '../../services/getUserAccounts';
import { Link } from 'react-router-dom';

const TransactionHistory = () => {
  const [accounts, setAccounts] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage] = useState(10);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await getUserAccounts();
        setAccounts(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Failed to load accounts.');
      }
    };

    fetchAccounts();
  }, []);

  const handleAccountChange = async (e) => {
    const account = e.target.value;
    setSelectedAccount(account);
    setCurrentPage(1);
    setTransactions([]);
    setError('');

    if (!account) return;

    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/bank/transactions/history?account=${encodeURIComponent(account)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(response.data.transactions || []);
    } catch (err) {
      console.error(err);
      setTransactions([]);
      setError(err.response?.data?.message || 'Error fetching transaction history.');
    }
  };

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.max(1, Math.ceil(transactions.length / transactionsPerPage));

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900 p-6 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="bg-white/6 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-white">Transaction History</h2>
            <Link to="/main" className="text-sm bg-white/6 px-3 py-2 rounded-lg hover:bg-white/8 text-white">
              Back to Home
            </Link>
          </div>

          {error && (
            <div className="mb-4 px-4 py-2 bg-red-600/10 border border-red-600/30 text-red-200 rounded">
              {error}
            </div>
          )}

          {!accounts && !error && (
            <div className="mb-4 text-white/70">Loading accounts...</div>
          )}

          {accounts && (
            <>
              <div className="grid md:grid-cols-3 gap-4 mb-6 items-end">
                <div className="md:col-span-2">
                  <label htmlFor="accountSelect" className="text-sm text-white/80 block mb-2">Select an account</label>
                  <select
                    id="accountSelect"
                    className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={selectedAccount}
                    onChange={handleAccountChange}
                  >
                    <option value="">-- Select an account --</option>
                    {accounts.accountUSD && <option value={accounts.accountUSD}>{accounts.accountUSD} (USD)</option>}
                    {accounts.accountEUR && <option value={accounts.accountEUR}>{accounts.accountEUR} (EUR)</option>}
                    {/* add more account options if available */}
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      if (selectedAccount) handleAccountChange({ target: { value: selectedAccount } });
                    }}
                    className="py-2 px-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow hover:scale-[1.01] transition disabled:opacity-60"
                    disabled={!selectedAccount}
                  >
                    Refresh
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAccount('');
                      setTransactions([]);
                      setError('');
                      setCurrentPage(1);
                    }}
                    className="py-2 px-4 bg-white/6 text-white rounded-lg hover:bg-white/8 transition"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="rounded-lg bg-white/4 border border-white/8 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-white/6">
                    <thead className="bg-white/6">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Sender</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Recipient</th>
                        <th className="px-4 py-3 text-right text-xs font-medium text-white/70">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Currency</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-white/70">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/6">
                      {currentTransactions.length > 0 ? (
                        currentTransactions.map((tx) => (
                          <tr key={tx.transactionID} className="hover:bg-white/5">
                            <td className="px-4 py-3 text-sm text-white/90">{tx.transactionID}</td>
                            <td className="px-4 py-3 text-sm text-white/80">{tx.senderAccount}</td>
                            <td className="px-4 py-3 text-sm text-white/80">{tx.recipientAccount}</td>
                            <td className="px-4 py-3 text-sm text-right text-white/90">
                              {Number(tx.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-4 py-3 text-sm text-white/80">{tx.currencyFrom} → {tx.currencyTo}</td>
                            <td className="px-4 py-3 text-sm text-white/70">{new Date(tx.timestamp).toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-4 py-6 text-center text-sm text-white/60">
                            {selectedAccount ? 'There are no transactions for this account.' : 'Please select an account to view transactions.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              {transactions.length > 0 && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-sm text-white/70">
                    Showing {indexOfFirstTransaction + 1}–{Math.min(indexOfLastTransaction, transactions.length)} of {transactions.length} transactions
                  </div>

                  <nav className="flex items-center space-x-2" aria-label="Pagination">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded-md bg-white/6 text-white/90 hover:bg-white/8 disabled:opacity-50"
                    >
                      Previous
                    </button>

                    {[...Array(totalPages).keys()].map((n) => {
                      const page = n + 1;
                      return (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-1 rounded-md ${currentPage === page ? 'bg-purple-500 text-white' : 'bg-white/6 text-white/90 hover:bg-white/8'}`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded-md bg-white/6 text-white/90 hover:bg-white/8 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
