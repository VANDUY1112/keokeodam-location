import React from 'react';

export default function DashboardView({
  expenses,
  trips,
  onOpenLogExpense,
  onOpenItinerary,
  onNavigateToTab,
}) {
  return (
    <div className="flex flex-col w-full gap-xl">
      {/* ══════════ 4 TOP STAT CARDS ══════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg w-full">
        {/* Metric 1: Total Distance */}
        <div className="bg-surface-container rounded-2xl p-md flex flex-col gap-sm shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-xl group-hover:bg-primary/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">
              Total Distance
            </span>
            <span className="material-symbols-outlined text-primary text-[20px]">
              route
            </span>
          </div>
          <div className="flex items-end gap-xs z-10 mt-sm">
            <span className="font-display text-on-surface text-[32px] leading-none">
              1,245
            </span>
            <span className="font-body-md text-on-surface-variant mb-1">km</span>
          </div>
          <div className="flex items-center gap-xs z-10 mt-xs">
            <span className="material-symbols-outlined text-secondary text-[16px] p-0.5 bg-secondary/10 rounded-full">
              trending_up
            </span>
            <span className="font-label-sm text-secondary">+12% vs last month</span>
          </div>
        </div>

        {/* Metric 2: Avg Speed */}
        <div className="bg-surface-container rounded-2xl p-md flex flex-col gap-sm shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-tertiary/5 rounded-full blur-xl group-hover:bg-tertiary/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">
              Avg Speed
            </span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">
              speed
            </span>
          </div>
          <div className="flex items-end gap-xs z-10 mt-sm">
            <span className="font-display text-on-surface text-[32px] leading-none">
              68.4
            </span>
            <span className="font-body-md text-on-surface-variant mb-1">km/h</span>
          </div>
          <div className="flex items-center gap-xs z-10 mt-xs">
            <span className="material-symbols-outlined text-on-surface-variant text-[16px] p-0.5 bg-surface-container-high rounded-full">
              horizontal_rule
            </span>
            <span className="font-label-sm text-on-surface-variant">Stable average</span>
          </div>
        </div>

        {/* Metric 3: Monthly Expenses */}
        <div className="bg-surface-container rounded-2xl p-md flex flex-col gap-sm shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-error/5 rounded-full blur-xl group-hover:bg-error/10 transition-colors duration-500"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">
              Monthly Expenses
            </span>
            <span className="material-symbols-outlined text-error text-[20px]">
              receipt_long
            </span>
          </div>
          <div className="flex items-end gap-xs z-10 mt-sm">
            <span className="font-display text-on-surface text-[32px] leading-none">
              $4,320
            </span>
            <span className="font-body-md text-on-surface-variant mb-1">.00</span>
          </div>
          <div className="flex items-center gap-xs z-10 mt-xs">
            <span className="material-symbols-outlined text-error text-[16px] p-0.5 bg-error/10 rounded-full">
              trending_up
            </span>
            <span className="font-label-sm text-error">+5% vs budget</span>
          </div>
        </div>

        {/* Metric 4: Active Trip */}
        <div className="bg-primary-container rounded-2xl p-md flex flex-col gap-sm shadow-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3"></div>
          <div className="flex items-center justify-between z-10">
            <span className="font-label-sm text-on-primary-container uppercase tracking-widest">
              Active Trip
            </span>
            <div className="flex items-center gap-xs px-2 py-1 bg-secondary/20 rounded-full">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
              <span className="font-label-sm text-secondary font-medium tracking-wide">
                EN ROUTE
              </span>
            </div>
          </div>
          <div className="flex flex-col z-10 mt-sm">
            <span className="font-headline-lg text-on-primary-container leading-tight">
              Berlin
            </span>
            <span className="font-body-md text-on-primary-container/70 flex items-center gap-1 mt-1">
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              Munich
            </span>
          </div>
          <div className="flex flex-col gap-xs z-10 mt-auto">
            <div className="w-full bg-surface-container-low/20 h-1.5 rounded-full overflow-hidden">
              <div className="bg-secondary h-full rounded-full w-[65%] relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-on-secondary rounded-full shadow-[0_0_8px_rgba(0,108,73,0.8)]"></div>
              </div>
            </div>
            <div className="flex justify-between w-full">
              <span className="font-label-sm text-on-primary-container/70">340 km done</span>
              <span className="font-label-sm text-on-primary-container/70">180 km left</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ HERO ASSIGNMENT CARD ══════════ */}
      <div className="w-full bg-surface rounded-[32px] p-lg shadow-xl relative overflow-hidden flex flex-col lg:flex-row gap-lg min-h-[380px]">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-container-low/50 via-transparent to-surface-container/30 pointer-events-none"></div>

        <div className="flex-1 flex flex-col z-10 py-md pl-md">
          <div className="flex items-center gap-sm mb-lg">
            <span className="px-3 py-1 bg-primary/10 text-primary font-label-sm rounded-full tracking-widest uppercase">
              Current Assignment
            </span>
            <span className="font-body-md text-on-surface-variant flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span> Started 08:30 AM
            </span>
          </div>

          <h2 className="font-display text-on-surface text-[48px] leading-none tracking-tighter mb-2">
            Project Phoenix
          </h2>

          <p className="font-headline-md text-on-surface-variant font-normal mb-xl max-w-lg">
            Client on-site consultation and hardware deployment phase 2.
          </p>

          <div className="grid grid-cols-2 gap-y-lg gap-x-xl mt-auto">
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">Client</span>
              <span className="font-headline-md text-on-surface">Acme Corp Ltd.</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">Est. Duration</span>
              <span className="font-headline-md text-on-surface">3 Days</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">Allocated Budget</span>
              <span className="font-headline-md text-on-surface">$12,500.00</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-label-sm text-on-surface-variant uppercase tracking-widest">Current Spend</span>
              <span className="font-headline-md text-on-surface text-secondary">$3,420.50</span>
            </div>
          </div>

          <div className="mt-xl flex flex-wrap gap-md">
            <button
              onClick={onOpenLogExpense}
              className="bg-primary text-on-primary font-body-md font-medium px-xl py-3 rounded-xl hover:bg-primary/90 transition-colors shadow-md flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Log Expense
            </button>

            <button
              onClick={onOpenItinerary}
              className="bg-surface-container-high text-on-surface font-body-md font-medium px-xl py-3 rounded-xl hover:bg-surface-container-highest transition-colors flex items-center gap-2"
            >
              View Itinerary <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right Map Image Box */}
        <div
          onClick={() => onNavigateToTab('tracking')}
          className="w-full lg:w-[40%] rounded-2xl overflow-hidden relative shadow-md z-10 cursor-pointer min-h-[260px]"
        >
          <div
            className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105"
            data-location="Frankfurt, Germany"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwkmdpmyx4qqd78u2loh-z85VEvZ6j4dFmAQFnZ8kLmrCV4z62v2ApBCROnmEbkAyAajWgyVegqJQIC8OU3rQxpZvfb63EpepXP72bFCLjm4E35D-ArQroocYLGYfvfTxfP7AOcG5VYREJ7qdR583W4R4r2uwQ96c4cEgiulzZWx7i-WGqunr51qe2iIz5vHXZy-FauHbzVTcEnbG0T3z8ULO-Ps-dIk0yvZS4IGItT8ulRJrDheBu')`,
            }}
          ></div>

          <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md p-md rounded-xl flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined">navigation</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-md text-on-surface font-medium">Navigating to Site</span>
                <span className="font-label-sm text-on-surface-variant">ETA: 45 mins</span>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="font-headline-md text-on-surface">24 km</span>
              <span className="font-label-sm text-secondary">Traffic light</span>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ 2-COLUMN SECTION: TRIPS & EXPENSES ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl w-full">
        {/* Left Column: Recent Trips */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-headline-md text-on-surface">Recent Trips</h3>
            <button
              onClick={() => onNavigateToTab('history')}
              className="text-primary font-body-md font-medium hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-sm">
            {trips.map((trip) => (
              <div
                key={trip.id}
                onClick={() => onNavigateToTab('tracking')}
                className="bg-surface-container-lowest p-md rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group border border-outline-variant/10"
              >
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined">{trip.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-on-surface font-medium">{trip.title}</span>
                    <span className="font-label-sm text-on-surface-variant">{trip.subtitle}</span>
                  </div>
                </div>
                <div className="flex items-center gap-sm">
                  <span className={`px-2 py-1 font-label-sm rounded-md ${trip.statusBadge}`}>
                    {trip.status}
                  </span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px] opacity-0 group-hover:opacity-100 transition-opacity">
                    chevron_right
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent Expenses */}
        <div className="flex flex-col gap-md">
          <div className="flex items-center justify-between px-xs">
            <h3 className="font-headline-md text-on-surface">Recent Expenses</h3>
            <button
              onClick={() => onNavigateToTab('expenses')}
              className="text-primary font-body-md font-medium hover:text-primary/80 transition-colors"
            >
              View All
            </button>
          </div>

          <div className="flex flex-col gap-sm">
            {expenses.map((item) => (
              <div
                key={item.id}
                onClick={() => onNavigateToTab('expenses')}
                className="bg-surface-container-lowest p-md rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer group border border-outline-variant/10"
              >
                <div className="flex items-center gap-md">
                  <div
                    className={`w-12 h-12 bg-surface-container text-on-surface-variant rounded-full flex items-center justify-center transition-colors ${item.hoverColor}`}
                  >
                    <span className="material-symbols-outlined">{item.icon}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body-md text-on-surface font-medium">{item.title}</span>
                    <span className="font-label-sm text-on-surface-variant">{item.subtitle}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className="font-headline-md text-on-surface">{item.amount}</span>
                  <span className={`font-label-sm ${item.statusColor}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
