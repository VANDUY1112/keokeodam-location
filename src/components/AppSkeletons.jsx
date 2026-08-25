import React from 'react';

/**
 * 🌟 Dashboard Skeleton Loader
 * Mimics exact layout: 2-box row 1, 1-box row 2 on mobile, map canvas, and recent order items
 */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col w-full gap-6 lg:gap-8 animate-in fade-in duration-300">
      {/* ─── 1. TOP 3 STAT CARDS SKELETON ─── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-6 w-full">
        {/* Metric 1 */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px] sm:min-h-[135px] space-y-3">
          <div className="h-5 w-24 sm:w-32 rounded-lg skeleton-shimmer" />
          <div className="flex items-end justify-between gap-1.5 mt-3">
            <div className="h-7 sm:h-9 w-16 sm:w-24 rounded-xl skeleton-shimmer" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl skeleton-shimmer shrink-0" />
          </div>
        </div>

        {/* Metric 2 */}
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px] sm:min-h-[135px] space-y-3">
          <div className="h-5 w-24 sm:w-32 rounded-lg skeleton-shimmer" />
          <div className="flex items-end justify-between gap-1.5 mt-3">
            <div className="h-7 sm:h-9 w-16 sm:w-24 rounded-xl skeleton-shimmer" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl skeleton-shimmer shrink-0" />
          </div>
        </div>

        {/* Metric 3 */}
        <div className="col-span-2 md:col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[110px] sm:min-h-[135px] space-y-3">
          <div className="h-5 w-28 sm:w-36 rounded-lg skeleton-shimmer" />
          <div className="flex items-end justify-between gap-1.5 mt-3">
            <div className="h-7 sm:h-9 w-16 sm:w-24 rounded-xl skeleton-shimmer" />
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl skeleton-shimmer shrink-0" />
          </div>
        </div>
      </div>

      {/* ─── 2. MAP & CLUSTER BUTTONS SKELETON ─── */}
      <div className="w-full bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-100">
          <div className="space-y-1.5">
            <div className="h-5 w-48 sm:w-60 rounded-xl skeleton-shimmer" />
            <div className="h-3.5 w-64 sm:w-80 rounded-lg skeleton-shimmer" />
          </div>
          <div className="h-9 w-32 rounded-xl skeleton-shimmer shrink-0" />
        </div>

        {/* Shimmer Cluster Badges */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-10 rounded-xl skeleton-shimmer" />
          ))}
        </div>

        {/* Map Canvas Skeleton with Radar Pulse */}
        <div className="w-full h-[380px] sm:h-[450px] rounded-2xl skeleton-shimmer relative overflow-hidden flex flex-col items-center justify-center border border-slate-200/80">
          <div className="w-16 h-16 rounded-full bg-white/70 shadow-lg flex items-center justify-center animate-pulse">
            <span className="material-symbols-outlined text-slate-400 text-[28px]">map</span>
          </div>
          <div className="h-3.5 w-36 rounded-md bg-slate-300/60 mt-3 animate-pulse" />
        </div>
      </div>

      {/* ─── 3. RECENT ACTIVITY LIST SKELETON ─── */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-40 rounded-xl skeleton-shimmer" />
          <div className="h-4 w-20 rounded-lg skeleton-shimmer" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-3.5 sm:p-4 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 rounded-xl skeleton-shimmer shrink-0" />
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="h-4 w-32 sm:w-48 rounded-lg skeleton-shimmer" />
                  <div className="h-3 w-48 sm:w-64 rounded-md skeleton-shimmer" />
                </div>
              </div>
              <div className="h-6 w-20 rounded-xl skeleton-shimmer shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * 🌟 History & Logs View Skeleton Loader
 */
export function HistorySkeleton() {
  return (
    <div className="w-full space-y-5 animate-in fade-in duration-300">
      {/* 2 Top Stat Cards Skeleton */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:gap-6 w-full">
        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[105px] sm:min-h-[125px]">
          <div className="h-5 w-28 sm:w-36 rounded-lg skeleton-shimmer" />
          <div className="flex items-end justify-between gap-1.5 mt-3">
            <div className="h-7 sm:h-9 w-16 sm:w-20 rounded-xl skeleton-shimmer" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg skeleton-shimmer shrink-0" />
          </div>
        </div>

        <div className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 lg:p-6 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[105px] sm:min-h-[125px]">
          <div className="h-5 w-28 sm:w-36 rounded-lg skeleton-shimmer" />
          <div className="flex items-end justify-between gap-1.5 mt-3">
            <div className="h-7 sm:h-9 w-16 sm:w-20 rounded-xl skeleton-shimmer" />
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg skeleton-shimmer shrink-0" />
          </div>
        </div>
      </div>

      {/* Search and Action Header Skeleton */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="h-10 w-full sm:w-64 rounded-xl skeleton-shimmer" />
        <div className="h-10 w-28 rounded-xl skeleton-shimmer self-end sm:self-auto" />
      </div>

      {/* Trip Cards List Skeleton (UNIFIED CONNECTED MATRIX) */}
      <div className="bg-slate-200/80 rounded-2xl sm:rounded-3xl border border-slate-200/90 p-[1px] gap-[1px] grid grid-cols-2 overflow-hidden shadow-xs">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white p-3.5 sm:p-5 flex flex-col justify-between gap-2.5 sm:gap-3.5 relative overflow-hidden"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="h-4 w-1/2 rounded-md skeleton-shimmer" />
                <div className="h-4 w-14 sm:w-16 rounded-md skeleton-shimmer shrink-0" />
              </div>
              <div className="h-3 w-16 rounded-md skeleton-shimmer" />
            </div>
            <div className="pt-2 border-t border-slate-100">
              <div className="h-8 rounded-lg skeleton-shimmer" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 🌟 Tracking Cockpit Skeleton Loader
 */
export function TrackingSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full animate-in fade-in duration-300">
      <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between border border-slate-200 shadow-xs min-h-[105px] sm:min-h-[125px]">
            <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
            <div className="flex items-end justify-between gap-1.5 mt-3">
              <div className="h-7 w-20 rounded-xl skeleton-shimmer" />
              <div className="w-6 h-6 rounded-lg skeleton-shimmer shrink-0" />
            </div>
          </div>
          <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between border border-slate-200 shadow-xs min-h-[105px] sm:min-h-[125px]">
            <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
            <div className="flex items-end justify-between gap-1.5 mt-3">
              <div className="h-7 w-20 rounded-xl skeleton-shimmer" />
              <div className="w-6 h-6 rounded-lg skeleton-shimmer shrink-0" />
            </div>
          </div>
        </div>

        <div className="h-12 w-full rounded-2xl skeleton-shimmer" />

        <div className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 flex flex-col justify-between border border-slate-200 shadow-xs min-h-[105px] sm:min-h-[125px]">
          <div className="h-5 w-32 rounded-lg skeleton-shimmer" />
          <div className="flex items-end justify-between gap-1.5 mt-3">
            <div className="h-7 w-24 rounded-xl skeleton-shimmer" />
            <div className="w-6 h-6 rounded-lg skeleton-shimmer shrink-0" />
          </div>
        </div>
      </aside>

      <section className="flex-1 w-full min-h-[500px] lg:min-h-[700px] bg-white rounded-3xl p-4 lg:p-6 border border-slate-200 shadow-xs flex flex-col">
        <div className="h-6 w-48 rounded-xl skeleton-shimmer mb-4" />
        <div className="flex-1 w-full rounded-2xl skeleton-shimmer" />
      </section>
    </div>
  );
}

/**
 * 🌟 Reports & Analytics View Skeleton Loader
 */
export function ReportsSkeleton() {
  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 lg:gap-6 w-full">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="col-span-1 bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 flex flex-col justify-between border border-slate-200 shadow-xs min-h-[140px] sm:min-h-[160px]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="h-5 w-24 rounded-lg skeleton-shimmer" />
              <div className="w-6 h-6 rounded-md skeleton-shimmer shrink-0" />
            </div>
            <div className="h-8 w-28 rounded-xl skeleton-shimmer my-2" />
            <div className="h-4 w-20 rounded-md skeleton-shimmer" />
          </div>
        ))}
      </div>

      <div className="h-72 w-full bg-white rounded-3xl p-6 border border-slate-200 shadow-xs skeleton-shimmer" />
    </div>
  );
}
