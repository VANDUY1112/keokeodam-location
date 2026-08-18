import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight, 
  ChevronDown,
  Check 
} from 'lucide-react';

export function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalItems,
  pageSize = 5,
  pageSizeOptions = [5, 10, 20, 50],
  onPageChange,
  onPageSizeChange,
}) {
  const [isSizeOpen, setIsSizeOpen] = useState(false);
  const sizeDropdownRef = useRef(null);

  // Click outside to close size dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sizeDropdownRef.current && !sizeDropdownRef.current.contains(e.target)) {
        setIsSizeOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Smart page numbers calculation with ellipsis (...)
  const getPageNumbers = () => {
    const pages = [];
    const delta = 1; // Number of pages to display around current page

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const left = currentPage - delta;
      const right = currentPage + delta;
      const showLeftDots = left > 2;
      const showRightDots = right < totalPages - 1;

      pages.push(1);
      if (showLeftDots) {
        pages.push('...');
      } else {
        for (let i = 2; i < left; i++) pages.push(i);
      }

      for (let i = Math.max(2, left); i <= Math.min(totalPages - 1, right); i++) {
        pages.push(i);
      }

      if (showRightDots) {
        pages.push('...');
      } else {
        for (let i = right + 1; i < totalPages; i++) pages.push(i);
      }
      pages.push(totalPages);
    }
    return pages;
  };

  if (totalPages <= 0) return null;

  const visibleCount = totalItems ? Math.min(pageSize, Math.max(0, totalItems - (currentPage - 1) * pageSize)) : pageSize;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3.5 pb-1 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
      {/* Left side: Record Counter & Page Size Dropdown */}
      <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto">
        {totalItems !== undefined && (
          <span className="text-xs text-slate-500 font-medium">
            Hiển thị <strong className="font-bold text-slate-900">{visibleCount}/{totalItems}</strong> chi phí
          </span>
        )}

        {onPageSizeChange && (
          <div className="relative flex items-center gap-1.5" ref={sizeDropdownRef}>
            <span className="text-xs text-slate-400 font-medium">Dòng/trang:</span>
            
            {/* Custom Dropdown Trigger Button */}
            <button
              type="button"
              onClick={() => setIsSizeOpen(!isSizeOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border rounded-xl text-xs font-bold text-slate-900 transition-all shadow-2xs group ${
                isSizeOpen 
                  ? 'border-slate-900 ring-2 ring-slate-900/10 bg-white' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span>{pageSize}</span>
              <ChevronDown 
                className={`w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200 shrink-0 ${
                  isSizeOpen ? 'rotate-180 text-slate-900' : ''
                }`} 
              />
            </button>

            {/* Custom Animated Popup Menu (Displays DOWNWARDS below the button) */}
            {isSizeOpen && (
              <div className="absolute top-full right-0 sm:left-0 mt-1.5 bg-white border border-slate-200/90 rounded-xl shadow-xl z-50 p-1 min-w-[72px] space-y-0.5 animate-popup-open">
                {pageSizeOptions.map((opt) => {
                  const isSelected = opt === pageSize;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => {
                        onPageSizeChange(opt);
                        setIsSizeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold text-left transition-all ${
                        isSelected
                          ? 'bg-slate-900 text-white'
                          : 'hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {isSelected && <Check className="w-3 h-3 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right side: Pagination Navigation Buttons */}
      <div className="flex items-center justify-center gap-1 w-full sm:w-auto">
        {/* First Page */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          title="Trang đầu"
          className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-slate-700 flex items-center justify-center active:scale-95 shadow-2xs"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Trang trước"
          className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-slate-700 flex items-center justify-center active:scale-95 shadow-2xs"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="w-6 text-center text-slate-400 select-none text-xs font-bold">
                ...
              </span>
            );
          }
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(Number(page))}
              className={`w-8 h-8 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
                isCurrent
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100 border border-transparent active:scale-95'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Trang sau"
          className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-slate-700 flex items-center justify-center active:scale-95 shadow-2xs"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          title="Trang cuối"
          className="w-8 h-8 rounded-xl border border-slate-200 hover:bg-slate-100 disabled:opacity-25 disabled:cursor-not-allowed transition-all text-slate-700 flex items-center justify-center active:scale-95 shadow-2xs"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default Pagination;
