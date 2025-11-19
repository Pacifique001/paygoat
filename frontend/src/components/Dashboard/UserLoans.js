import React, { useEffect, useState } from 'react';
import api from '../../services/Api';
import PageWrapper from './PageWrapper';

const UserLoans = () => {
  const [loans, setLoans] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserLoans = async () => {
      const token = localStorage.getItem('token');
      const userID = localStorage.getItem('userID');

      if (!token || !userID) {
        setError('Authentication error. Please log in again.');
        setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/bank/loan/user?userID=${userID}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoans(response.data.loans || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching user loans.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserLoans();
  }, []);

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-400">Loading loans...</div>;
    }
    if (error) {
      return <div className="bg-red-500/20 text-red-300 p-3 rounded-lg text-center">{error}</div>;
    }
    if (loans.length === 0) {
      return <div className="bg-blue-500/10 text-blue-300 p-3 rounded-lg text-center">You do not have any active loans.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead className="border-b border-white/20">
            <tr>
              <th className="p-3">Loan ID</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loans.map((loan) => (
              <tr key={loan.loanID}>
                <td className="p-3 font-mono text-xs">{loan.loanID}</td>
                <td className="p-3">${loan.amount.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    loan.status === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                  }`}>
                    {loan.status === 'approved' ? 'Approved' : 'Pending'}
                  </span>
                </td>
                <td className="p-3 text-sm text-gray-300">{new Date(loan.timestamp).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <PageWrapper title="My Loans">
        {renderContent()}
    </PageWrapper>
  );
};

export default UserLoans;