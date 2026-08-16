import React, { useState } from 'react';
import DashboardView from './components/DashboardView';
import TrackingView from './components/TrackingView';
import ExpensesView from './components/ExpensesView';

export default function App() {
  const [activeTab, setActiveTab] = useState('expenses');
  const [showLogExpenseModal, setShowLogExpenseModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const [expenses, setExpenses] = useState([
    {
      id: 1,
      title: 'Client Dinner - Steakhouse',
      subtitle: 'Oct 26 • Project Phoenix',
      amount: '$245.50',
      status: 'Pending',
      statusColor: 'text-surface-tint',
      icon: 'local_dining',
      hoverColor: 'group-hover:bg-error/10 group-hover:text-error',
    },
    {
      id: 2,
      title: 'Fuel Refill - Shell',
      subtitle: 'Oct 24 • Hamburg Trip',
      amount: '$85.00',
      status: 'Approved',
      statusColor: 'text-secondary',
      icon: 'local_gas_station',
      hoverColor: 'group-hover:bg-tertiary/10 group-hover:text-tertiary',
    },
    {
      id: 3,
      title: 'Marriott Hotel - 2 Nights',
      subtitle: 'Oct 18 • London Tech Conf',
      amount: '$540.00',
      status: 'Approved',
      statusColor: 'text-secondary',
      icon: 'hotel',
      hoverColor: 'group-hover:bg-primary/10 group-hover:text-primary',
    },
  ]);

  const [trips, setTrips] = useState([
    {
      id: 1,
      title: 'Hamburg Office Visit',
      subtitle: 'Oct 24 • 280 km',
      status: 'Completed',
      statusBadge: 'bg-secondary/10 text-secondary',
      icon: 'directions_car',
    },
    {
      id: 2,
      title: 'London Tech Conf',
      subtitle: 'Oct 18-20 • 950 km',
      status: 'Reimbursed',
      statusBadge: 'bg-surface-container-high text-on-surface-variant',
      icon: 'flight',
    },
    {
      id: 3,
      title: 'Supplier Meeting - Cologne',
      subtitle: 'Oct 12 • 145 km',
      status: 'Completed',
      statusBadge: 'bg-secondary/10 text-secondary',
      icon: 'directions_car',
    },
  ]);

  const [newExpense, setNewExpense] = useState({
    title: '',
    project: 'Project Phoenix',
    amount: '',
    category: 'Dining',
  });

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    let icon = 'receipt_long';
    let hoverColor = 'group-hover:bg-primary/10 group-hover:text-primary';
    if (newExpense.category === 'Dining') {
      icon = 'local_dining';
      hoverColor = 'group-hover:bg-error/10 group-hover:text-error';
    } else if (newExpense.category === 'Transport' || newExpense.category === 'Fuel') {
      icon = 'local_gas_station';
      hoverColor = 'group-hover:bg-tertiary/10 group-hover:text-tertiary';
    } else if (newExpense.category === 'Lodging') {
      icon = 'hotel';
      hoverColor = 'group-hover:bg-primary/10 group-hover:text-primary';
    }

    const item = {
      id: Date.now(),
      title: newExpense.title,
      subtitle: `Today • ${newExpense.project}`,
      amount: `$${parseFloat(newExpense.amount).toFixed(2)}`,
      status: 'Pending',
      statusColor: 'text-surface-tint',
      icon,
      hoverColor,
    };

    setExpenses([item, ...expenses]);
    setNewExpense({ title: '', project: 'Project Phoenix', amount: '', category: 'Dining' });
    setShowLogExpenseModal(false);
  };

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      {/* ═══════════════ SIDEBAR NAVIGATION (W-72) ═══════════════ */}
      <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-low z-50 flex flex-col shadow-[1px_0_0_rgba(0,0,0,0.05)]">
        <div className="h-16 flex items-center px-lg mb-sm gap-sm">
          <img
            alt="Travel & Expense Tracker Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZEe91jxMChIOPJ3a-L96MEXUG-c7UsjTsrXMkxi1DBCJpqAJSz4mYT2omTyPr6xFzZHkMBbxOSAEe2MWd5pZ9EaEp7g1MxrUZes9pYY6rwCPvRKk1h0-pifo7Q5QXf-_Rkz0IwJxMqU9FIZG0Hk9swkKW_T-YXFx5q3cddoXIRLgbuhxogquJxzUXZYgSRCShRp3FTLrzPWvXtiT6B_zQiPwNl0uNirrxuUjCfhXcpfYgScQ71Iqh"
          />
          <span className="font-headline-md text-primary tracking-tight">Expensely</span>
        </div>

        <nav className="flex-1 flex flex-col gap-xs px-sm" data-active-classes="bg-primary-container text-on-primary-container shadow-sm">
          <button
            onClick={() => setActiveTab('dashboard')}
            aria-current={activeTab === 'dashboard' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'dashboard'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              dashboard
            </span>
            <span className="font-body-md font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            aria-current={activeTab === 'tracking' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'tracking'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              my_location
            </span>
            <span className="font-body-md font-medium">Tracking</span>
          </button>

          <button
            onClick={() => setActiveTab('expenses')}
            aria-current={activeTab === 'expenses' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'expenses'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              receipt_long
            </span>
            <span className="font-body-md font-medium">Expenses</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            aria-current={activeTab === 'history' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'history'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              history
            </span>
            <span className="font-body-md font-medium">History</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            aria-current={activeTab === 'reports' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'reports'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              assessment
            </span>
            <span className="font-body-md font-medium">Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            aria-current={activeTab === 'settings' ? 'page' : undefined}
            className={`w-full flex items-center gap-md px-md py-3 rounded-xl transition-all duration-200 group text-left ${
              activeTab === 'settings'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-md group-hover:scale-110 transition-transform">
              settings
            </span>
            <span className="font-body-md font-medium">Settings</span>
          </button>
        </nav>
      </aside>

      {/* ═══════════════ TOP HEADER & MAIN CONTENT AREA ═══════════════ */}
      <div className="pl-72">
        <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 px-xl flex items-center justify-end border-b border-outline-variant/30">
          <div className="flex items-center gap-lg">
            <button
              onClick={() => setShowNotificationsModal(!showNotificationsModal)}
              className="relative p-base text-on-surface-variant hover:text-on-surface transition-colors"
            >
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>

            <div className="flex items-center gap-md cursor-pointer hover:bg-surface-container-high p-xs pr-md rounded-full transition-all group">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-highest group-hover:ring-primary-fixed-dim"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPd2lm08x1AlkyTD2a7EAyfL0w3g6wLf-ks695bcDug3eBb3dY7M-IYqblxUBUJkM_1JLpS-oe2ETxX133ifwVSaKDBPAoUyTnh9m2K6JGZaAXpocLvkSW-pPgCzBOCNm7rypqZsPJjCJ7JkHe9e7WnEQhZ3jdjhuV30XXIgz2jC82hw8CKQ4KGLrargMZ6FzYKrKBFWjpHswjzqdRYHAue-PJetCwtSUpvGnzOmaRO_Dz82T-AYn-"
              />
              <span className="font-body-md font-medium text-on-surface">Alex Johnson</span>
            </div>
          </div>
        </header>

        <main className="w-full pt-16 min-h-screen">
          <div className="p-2xl">
            <div className="bg-surface-container-lowest rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-outline-variant/20 p-xl">
              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <DashboardView
                  expenses={expenses}
                  trips={trips}
                  onOpenLogExpense={() => setShowLogExpenseModal(true)}
                  onOpenItinerary={() => setShowItineraryModal(true)}
                  onNavigateToTab={setActiveTab}
                />
              )}

              {/* TAB 2: TRACKING */}
              {activeTab === 'tracking' && (
                <TrackingView onOpenLogExpense={() => setShowLogExpenseModal(true)} />
              )}

              {/* TAB 3: EXPENSES */}
              {activeTab === 'expenses' && (
                <ExpensesView
                  expenses={expenses}
                  onOpenAddExpense={() => setShowLogExpenseModal(true)}
                />
              )}

              {/* TAB 4: HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-on-surface">Trip History & Archives</h2>
                    <p className="text-on-surface-variant text-sm mt-1">
                      Comprehensive log of all completed and reimbursed business trips.
                    </p>
                  </div>
                  <div className="flex flex-col gap-sm">
                    {trips.map((trip) => (
                      <div
                        key={trip.id}
                        className="bg-surface-container-lowest p-lg rounded-2xl flex items-center justify-between border border-outline-variant/15 hover:bg-surface-container-low transition-colors"
                      >
                        <div className="flex items-center gap-md">
                          <div className="w-12 h-12 bg-surface-container text-primary rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined">{trip.icon}</span>
                          </div>
                          <div>
                            <div className="font-headline-md text-on-surface">{trip.title}</div>
                            <div className="font-body-md text-on-surface-variant">{trip.subtitle}</div>
                          </div>
                        </div>
                        <span className={`px-3 py-1 font-label-sm rounded-lg ${trip.statusBadge}`}>
                          {trip.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: REPORTS */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="font-headline-lg text-on-surface">Travel & Expense Reports</h2>
                    <p className="text-on-surface-variant text-sm mt-1">
                      Monthly summaries, mileage analytics and tax-ready PDF exports.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                    <div className="p-lg bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-48">
                      <div>
                        <span className="font-label-sm uppercase text-on-surface-variant">October 2026</span>
                        <h4 className="font-headline-lg text-on-surface mt-1">Monthly Travel Summary</h4>
                        <p className="text-sm text-on-surface-variant mt-1">Total 1,245 km • $4,320.00 spent</p>
                      </div>
                      <button className="self-start px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">download</span> Export PDF
                      </button>
                    </div>
                    <div className="p-lg bg-surface-container rounded-2xl border border-outline-variant/20 flex flex-col justify-between h-48">
                      <div>
                        <span className="font-label-sm uppercase text-on-surface-variant">Q3 2026</span>
                        <h4 className="font-headline-lg text-on-surface mt-1">Quarterly Audit Report</h4>
                        <p className="text-sm text-on-surface-variant mt-1">Total 3,840 km • $12,900.00 spent</p>
                      </div>
                      <button className="self-start px-4 py-2 rounded-xl bg-primary text-on-primary text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
                        <span className="material-symbols-outlined text-base">download</span> Export CSV
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h2 className="font-headline-lg text-on-surface">Preferences & Settings</h2>
                    <p className="text-on-surface-variant text-sm mt-1">
                      Configure your travel vehicle, reimbursement rates and account information.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-md bg-surface-container rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-medium text-on-surface">Automatic GPS Tracking</div>
                        <div className="text-xs text-on-surface-variant">Log telemetry whenever route is started</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                    </div>
                    <div className="p-md bg-surface-container rounded-xl flex items-center justify-between">
                      <div>
                        <div className="font-medium text-on-surface">Instant Expense Receipts</div>
                        <div className="text-xs text-on-surface-variant">Notify finance team immediately upon check-out</div>
                      </div>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════════ MODAL: LOG EXPENSE ═══════════════ */}
      {showLogExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-xl border border-outline-variant/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined">receipt_long</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface">Log New Expense</h3>
                  <p className="font-label-sm text-on-surface-variant">Project Phoenix</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogExpenseModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="flex flex-col gap-md">
              <div>
                <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                  Description / Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Lunch with Client, Fuel refill..."
                  value={newExpense.title}
                  onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                  className="w-full px-md py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Amount ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full px-md py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-md"
                  />
                </div>
                <div>
                  <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">
                    Category
                  </label>
                  <select
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-md py-2.5 rounded-xl bg-surface-container border border-outline-variant/40 focus:outline-none focus:ring-2 focus:ring-primary text-on-surface font-body-md"
                  >
                    <option value="Dining">Dining & Meals</option>
                    <option value="Fuel">Fuel & Gas</option>
                    <option value="Transport">Transport</option>
                    <option value="Lodging">Hotel & Stay</option>
                    <option value="Other">Other Expenses</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-sm mt-lg">
                <button
                  type="button"
                  onClick={() => setShowLogExpenseModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-on-primary font-medium transition-colors shadow-md"
                >
                  Submit Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ═══════════════ MODAL: VIEW ITINERARY ═══════════════ */}
      {showItineraryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-lg w-full p-xl border border-outline-variant/30 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-lg">
              <div className="flex items-center gap-sm">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined">map</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface">Project Phoenix Itinerary</h3>
                  <p className="font-label-sm text-on-surface-variant">Frankfurt • 3-Day Plan</p>
                </div>
              </div>
              <button
                onClick={() => setShowItineraryModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 py-2">
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold text-xs">
                  01
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md font-semibold text-on-surface">Day 1: Client On-Site Briefing</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Kickoff with Acme Corp management, system audit & rack setup.</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-secondary/10 text-secondary text-[11px] font-medium">Completed</span>
                </div>
              </div>

              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-bold text-xs">
                  02
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md font-semibold text-on-surface">Day 2: Hardware Deployment Phase 2</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Server configuration, high-speed telemetry link & site tests.</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-primary-container text-on-primary-container text-[11px] font-medium">In Progress (ETA 45m)</span>
                </div>
              </div>

              <div className="flex gap-4 items-start opacity-70">
                <div className="w-8 h-8 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center font-bold text-xs">
                  03
                </div>
                <div className="flex-1">
                  <h4 className="font-body-md font-semibold text-on-surface">Day 3: Staff Training & Sign-Off</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">Handover documentation, employee training session, return journey.</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-[11px] font-medium">Upcoming</span>
                </div>
              </div>
            </div>

            <div className="mt-xl flex justify-end">
              <button
                onClick={() => setShowItineraryModal(false)}
                className="px-xl py-2.5 rounded-xl bg-primary text-on-primary font-medium hover:bg-primary/90 transition-colors shadow-md"
              >
                Close Itinerary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ NOTIFICATIONS POPUP ═══════════════ */}
      {showNotificationsModal && (
        <div className="fixed top-16 right-10 z-50 w-80 bg-surface-container-lowest rounded-2xl p-md border border-outline-variant/30 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center justify-between pb-sm border-b border-outline-variant/20 mb-sm">
            <span className="font-body-md font-semibold text-on-surface">Notifications</span>
            <span className="font-label-sm text-secondary font-medium">2 new</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
              <div className="font-medium text-on-surface">Expense Approved</div>
              <div className="text-on-surface-variant mt-0.5">Fuel Refill ($85.00) has been reimbursed.</div>
            </div>
            <div className="p-2 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer">
              <div className="font-medium text-on-surface">Trip Alert</div>
              <div className="text-on-surface-variant mt-0.5">Traffic cleared on A3 Highway towards Frankfurt.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
