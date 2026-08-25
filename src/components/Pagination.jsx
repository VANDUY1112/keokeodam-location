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
  itemName = 'mục'
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

  const startIdx = totalItems ? (currentPage - 1) * pageSize + 1 : 1;
  const endIdx = totalItems ? Math.min(currentPage * pageSize, totalItems) : pageSize;

  return (
    <div className="flex items-center justify-center pt-4 pb-2 w-full">
      {/* Modern Segmented Pill Floating Bar */}
      <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100/90 border border-slate-200/90 backdrop-blur-md shadow-xs gap-1 select-none">
        {/* First Page Jump */}
        {totalPages > 4 && (
          <button
            type="button"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            title="Về trang đầu"
            className="w-8 h-8 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/80 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
        )}

        {/* Previous Page */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Trang trước"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers with modern active capsule */}
        {getPageNumbers().map((page, idx) => {
          if (page === '...') {
            return (
              <span key={`dots-${idx}`} className="w-6 text-center text-slate-400 select-none text-xs font-black">
                •••
              </span>
            );
          }
          const isCurrent = page === currentPage;
          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(Number(page))}
              className={`h-8 sm:h-9 min-w-[32px] sm:min-w-[36px] px-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center cursor-pointer active:scale-95 ${
                isCurrent
                  ? 'bg-slate-900 text-white font-black shadow-md shadow-slate-900/20'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/90'
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
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-2xs cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page Jump */}
        {totalPages > 4 && (
          <button
            type="button"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            title="Đến trang cuối"
            className="w-8 h-8 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-white/80 disabled:opacity-20 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer active:scale-95"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Pagination;
