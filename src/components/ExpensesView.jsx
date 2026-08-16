import React, { useState } from 'react';

export default function ExpensesView({ expenses, onOpenAddExpense }) {
  const [timeRange, setTimeRange] = useState('Month');

  return (
    <div className="flex flex-col w-full gap-xl">
      {/* ══════════ TOP HEADER & TIMEFRAME FILTER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-on-surface">Expense Management</h1>
          <p className="font-body-md text-on-surface-variant mt-1">
            Track and categorize your spending
          </p>
        </div>

        <div className="flex bg-surface-container-low rounded-lg p-1 self-start sm:self-auto">
          {['Day', 'Week', 'Month'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-md py-sm rounded-md transition-all font-label-sm ${
                timeRange === range
                  ? 'bg-surface text-on-surface shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* ══════════ 3 METRIC CARDS ══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
        {/* Total Spent */}
        <div className="bg-surface-container-low rounded-xl p-lg relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-lg opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-4xl text-primary">
              account_balance_wallet
            </span>
          </div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">
            Total Spent
          </p>
          <div className="mt-sm flex items-baseline gap-sm">
            <span className="font-display text-on-surface">$2,450.00</span>
          </div>
          <div className="mt-md flex items-center gap-xs text-secondary">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            <span className="font-body-md">+12% from last month</span>
          </div>
        </div>

        {/* Budget Remaining */}
        <div className="bg-surface-container-low rounded-xl p-lg relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-lg opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-4xl text-secondary">savings</span>
          </div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">
            Budget Remaining
          </p>
          <div className="mt-sm flex items-baseline gap-sm">
            <span className="font-display text-on-surface">$1,550.00</span>
          </div>
          <div className="mt-md w-full bg-surface-container-highest rounded-full h-2">
            <div className="bg-secondary h-2 rounded-full transition-all duration-700" style={{ width: '61%' }}></div>
          </div>
        </div>

        {/* Pending Claims */}
        <div className="bg-surface-container-low rounded-xl p-lg relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-0 right-0 p-lg opacity-20 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-4xl text-tertiary">receipt_long</span>
          </div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider">
            Pending Claims
          </p>
          <div className="mt-sm flex items-baseline gap-sm">
            <span className="font-display text-on-surface">3</span>
            <span className="font-body-md text-on-surface-variant">claims</span>
          </div>
          <div className="mt-md flex items-center gap-xs text-on-surface-variant">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span className="font-body-md">Awaiting approval</span>
          </div>
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TABLE & DONUT CHART ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column (2 Cols): Recent Expenses Table */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-lg border border-outline-variant/15 shadow-sm">
          <div className="flex items-center justify-between mb-lg">
            <h2 className="font-headline-md text-on-surface">Recent Expenses</h2>
            <button
              onClick={onOpenAddExpense}
              className="flex items-center gap-xs bg-primary text-on-primary px-md py-sm rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span className="font-label-sm">Add Expense</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-surface-container-highest text-on-surface-variant font-label-sm uppercase tracking-wider">
                  <th className="pb-sm font-medium">Date</th>
                  <th className="pb-sm font-medium">Description</th>
                  <th className="pb-sm font-medium">Category</th>
                  <th className="pb-sm font-medium text-right">Amount</th>
                  <th className="pb-sm font-medium text-center">Status</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-on-surface">
                <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-highest">
                  <td className="py-md pr-md whitespace-nowrap">Oct 24, 2023</td>
                  <td className="py-md pr-md font-medium">Client Dinner - Steakhouse</td>
                  <td className="py-md pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-xs px-2 py-1 rounded-md bg-tertiary/10 text-tertiary font-medium">
                      <span className="material-symbols-outlined text-sm">restaurant</span> Food
                    </span>
                  </td>
                  <td className="py-md pr-md text-right font-medium">$145.20</td>
                  <td className="py-md text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                      Approved
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-highest">
                  <td className="py-md pr-md whitespace-nowrap">Oct 22, 2023</td>
                  <td className="py-md pr-md font-medium">Airport Taxi</td>
                  <td className="py-md pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                      <span className="material-symbols-outlined text-sm">local_taxi</span> Travel
                    </span>
                  </td>
                  <td className="py-md pr-md text-right font-medium">$45.00</td>
                  <td className="py-md text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded-full bg-surface-variant/40 text-on-surface-variant text-xs font-medium">
                      Pending
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors group border-b border-surface-container-highest">
                  <td className="py-md pr-md whitespace-nowrap">Oct 20, 2023</td>
                  <td className="py-md pr-md font-medium">Hotel Accommodation</td>
                  <td className="py-md pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-xs px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">
                      <span className="material-symbols-outlined text-sm">hotel</span> Lodging
                    </span>
                  </td>
                  <td className="py-md pr-md text-right font-medium">$850.00</td>
                  <td className="py-md text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                      Approved
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-surface-container-low transition-colors group">
                  <td className="py-md pr-md whitespace-nowrap">Oct 18, 2023</td>
                  <td className="py-md pr-md font-medium">Office Supplies</td>
                  <td className="py-md pr-md whitespace-nowrap">
                    <span className="inline-flex items-center gap-xs px-2 py-1 rounded-md bg-tertiary-container/20 text-on-tertiary-container font-medium">
                      <span className="material-symbols-outlined text-sm">inventory_2</span> Supplies
                    </span>
                  </td>
                  <td className="py-md pr-md text-right font-medium">$32.50</td>
                  <td className="py-md text-center whitespace-nowrap">
                    <span className="inline-block px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                      Approved
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column (1 Col): Spending by Category Donut */}
        <div className="bg-surface-container-low rounded-xl p-lg flex flex-col border border-outline-variant/10 shadow-sm">
          <h2 className="font-headline-md text-on-surface mb-lg">Spending by Category</h2>
          
          <div className="flex-1 flex flex-col items-center justify-center relative min-h-[250px]">
            <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-surface-container-highest"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeWidth="20"
              ></circle>
              <circle
                className="text-primary"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="62.8"
                strokeWidth="20"
              ></circle>
              <circle
                className="text-secondary"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="188.4"
                strokeWidth="20"
                transform="rotate(270 50 50)"
              ></circle>
              <circle
                className="text-tertiary"
                cx="50"
                cy="50"
                fill="transparent"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset="213.52"
                strokeWidth="20"
                transform="rotate(330 50 50)"
              ></circle>
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="font-body-md text-on-surface-variant">Total</span>
              <span className="font-headline-md text-on-surface mt-1">$2,450</span>
            </div>
          </div>

          <div className="mt-lg space-y-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="font-body-md text-on-surface">Travel</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-medium">45%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-secondary"></div>
                <span className="font-body-md text-on-surface">Lodging</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-medium">35%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                <span className="font-body-md text-on-surface">Food &amp; Drink</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-medium">15%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <div className="w-3 h-3 rounded-full bg-surface-container-highest"></div>
                <span className="font-body-md text-on-surface">Other</span>
              </div>
              <span className="font-body-md text-on-surface-variant font-medium">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
