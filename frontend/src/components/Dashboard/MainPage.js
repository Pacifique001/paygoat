import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const handleLogout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('token');
  localStorage.removeItem('userID');
  window.location.href = '/login';
};

const StatCard = ({ title, value, delta, icon, color = 'purple' }) => (
  <div className="bg-gradient-to-br from-white/3 to-white/2 backdrop-blur-sm rounded-2xl p-5 border border-white/8 hover:shadow-lg transition-all">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-400`}>
          {icon}
        </div>
        <div>
          <div className="text-xs text-gray-300">{title}</div>
          <div className="text-2xl font-bold text-white -mt-1">{value}</div>
        </div>
      </div>
      {typeof delta !== 'undefined' && (
        <div className={`text-sm font-medium ${delta.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
          {delta}
        </div>
      )}
    </div>
  </div>
);

const MainPage = () => {
  const [showAccountsSubmenu, setShowAccountsSubmenu] = useState(false);
  const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false);
  const [showCreditsSubmenu, setShowCreditsSubmenu] = useState(false);
  const [showTransactionsSubmenu, setShowTransactionsSubmenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [query, setQuery] = useState('');
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    const uname = localStorage.getItem('username') || localStorage.getItem('userName') || 'User';
    setUserName(uname);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-72'} bg-black/40 backdrop-blur-xl border-r border-white/8 flex flex-col transition-all duration-300 relative`}>
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarCollapsed((s) => !s)}
          className="absolute -right-3 top-6 w-7 h-7 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform z-20 shadow"
          title={sidebarCollapsed ? 'Expand' : 'Collapse'}
        >
          <svg className={`w-4 h-4 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Logo */}
        <div className="p-6 border-b border-white/8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow">
              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" />
              </svg>
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-semibold">PayGoat</h2>
                <p className="text-xs text-gray-300">Banking Portal</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link
            to="/profile"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-200 hover:bg-white/6 hover:text-white transition group"
            title="View Profile"
          >
            <svg className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">View Profile</span>}
          </Link>

          <div>
            <button
              onClick={() => setShowAccountsSubmenu((s) => !s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-200 hover:bg-white/6 hover:text-white transition"
              title="My Accounts"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">My Accounts</span>}
              </div>
              {!sidebarCollapsed && (
                <svg className={`w-4 h-4 transition-transform ${showAccountsSubmenu ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {showAccountsSubmenu && !sidebarCollapsed && (
              <div className="ml-8 mt-2 space-y-1">
                <Link to="/account-details" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">Details</Link>
                <Link to="/account-history" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">History</Link>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setShowTransactionsSubmenu((s) => !s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-200 hover:bg-white/6 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Transactions</span>}
              </div>
              {!sidebarCollapsed && (
                <svg className={`w-4 h-4 transition-transform ${showTransactionsSubmenu ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {showTransactionsSubmenu && !sidebarCollapsed && (
              <div className="ml-8 mt-2 space-y-1">
                <Link to="/transactions" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">Transactions</Link>
                <Link to="/transactionsUUID" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">Transactions v2 <span className="text-xs text-purple-300 ml-1">(BETA)</span></Link>
              </div>
            )}
          </div>

          <Link to="/cards" className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-200 hover:bg-white/6 hover:text-white transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Credit Cards</span>}
          </Link>

          <div>
            <button
              onClick={() => setShowCreditsSubmenu((s) => !s)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-gray-200 hover:bg-white/6 hover:text-white transition"
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
                </svg>
                {!sidebarCollapsed && <span className="font-medium">Loans</span>}
              </div>
              {!sidebarCollapsed && (
                <svg className={`w-4 h-4 transition-transform ${showCreditsSubmenu ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>

            {showCreditsSubmenu && !sidebarCollapsed && (
              <div className="ml-8 mt-2 space-y-1">
                <Link to="/request-loans" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">Request Loan</Link>
                <Link to="/my-loans" className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5">My Loans</Link>
              </div>
            )}
          </div>

          <Link to="/tickets" className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-200 hover:bg-white/6 hover:text-white transition">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Support Tickets</span>}
          </Link>

          <div className="mt-4 border-t border-white/6 pt-4">
            {!sidebarCollapsed && <div className="text-xs text-gray-400 mb-2">Quick actions</div>}
            <div className="flex gap-2">
              <Link to="/transactions" className="flex-1 py-2 px-3 bg-white/5 rounded-lg text-sm text-center hover:bg-white/8">Send</Link>
              <Link to="/cards" className="flex-1 py-2 px-3 bg-white/5 rounded-lg text-sm text-center hover:bg-white/8">Cards</Link>
            </div>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/8">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 px-3 py-2 bg-red-600/10 text-red-300 rounded-xl hover:bg-red-600/20 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            {!sidebarCollapsed && <span className="font-semibold">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-black/30 backdrop-blur-sm border-b border-white/8 px-8 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Welcome back, <span className="text-purple-300">{userName}</span></h1>
            <p className="text-gray-300 mt-1">Manage your finances securely and effortlessly</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-72 pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/6 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                placeholder="Search transactions, cards or loans..."
                aria-label="Search"
              />
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>

            <button className="p-3 bg-white/5 rounded-xl hover:bg-white/8 transition">
              <svg className="w-6 h-6 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L3 17h5" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center gap-3 bg-white/5 p-2 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm font-semibold">U</div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{userName}</div>
                <div className="text-xs text-gray-300">Premium</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                title="Total Balance"
                value="$24,500.00"
                delta="+12.5%"
                color="blue"
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1" /></svg>}
              />
              <StatCard
                title="Transactions"
                value="142"
                delta="—"
                color="purple"
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4" /></svg>}
              />
              <StatCard
                title="Active Loans"
                value="2"
                delta="$8,500"
                color="pink"
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" /></svg>}
              />
            </div>

            {/* Hero / Logo */}
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-4xl rounded-3xl p-8 bg-gradient-to-br from-purple-600/10 to-pink-600/6 border border-white/6 shadow-inner flex items-center gap-10">
                <div className="flex-1">
                  <h2 className="text-4xl font-extrabold">PayGoat — Your Trusted Banking Partner</h2>
                  <p className="text-gray-300 mt-3 max-w-xl">Fast transfers, secure cards, and flexible loans — all in one place. Try the new Transactions v2 (Beta) for improved tracking.</p>

                  <div className="mt-6 flex gap-3">
                    <Link to="/transactions" className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold shadow hover:scale-[1.02] transition">
                      Send Money
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </Link>

                    <Link to="/cards" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 rounded-xl text-white font-medium hover:bg-white/8 transition">
                      My Cards
                    </Link>

                    <Link to="/request-loans" className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 rounded-xl text-white font-medium hover:bg-white/8 transition">
                      Get Loan
                    </Link>
                  </div>
                </div>

                <div className="w-44 h-44 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl">
                  <svg className="w-20 h-20 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Quick actions grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/transactions" className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition flex flex-col items-center">
                <svg className="w-8 h-8 mb-2 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4" /></svg>
                <div className="text-sm font-medium">Send Money</div>
              </Link>

              <Link to="/cards" className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition flex flex-col items-center">
                <svg className="w-8 h-8 mb-2 text-blue-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1" /></svg>
                <div className="text-sm font-medium">My Cards</div>
              </Link>

              <Link to="/request-loans" className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition flex flex-col items-center">
                <svg className="w-8 h-8 mb-2 text-pink-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2" /></svg>
                <div className="text-sm font-medium">Request Loan</div>
              </Link>

              <Link to="/tickets" className="p-4 rounded-xl bg-white/5 hover:bg-white/8 transition flex flex-col items-center">
                <svg className="w-8 h-8 mb-2 text-green-300" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536" /></svg>
                <div className="text-sm font-medium">Support</div>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        /* small helpers for dynamic color classes used above (Tailwind JIT will pick them up if configured) */
        .bg-blue-500\\/10 { background-color: rgba(59,130,246,0.08); }
        .text-blue-400 { color: #60a5fa; }
        .bg-purple-500\\/10 { background-color: rgba(168,85,247,0.08); }
        .text-purple-400 { color: #a78bfa; }
        .bg-pink-500\\/10 { background-color: rgba(236,72,153,0.08); }
        .text-pink-400 { color: #f472b6; }
      `}</style>
    </div>
  );
};

export default MainPage;