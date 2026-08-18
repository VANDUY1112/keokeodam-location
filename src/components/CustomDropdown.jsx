import React, { useState, useRef, useEffect } from 'react';

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Chọn một mục...',
  icon = null,
  label = null,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-slate-600 mb-1.5 uppercase tracking-wider text-xs font-bold">
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-white hover:bg-slate-50 border transition-all text-left group shadow-xs ${
          isOpen
            ? 'border-slate-900 ring-2 ring-slate-900/10'
            : 'border-slate-200 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {(selectedOption?.icon || icon) && (
            <span className="material-symbols-outlined text-[20px] text-slate-700 shrink-0">
              {selectedOption?.icon || icon}
            </span>
          )}
          <div className="truncate">
            <div className="font-bold text-slate-900 text-sm sm:text-base truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </div>
            {selectedOption?.subtitle && (
              <div className="text-xs text-slate-500 truncate mt-0.5">
                {selectedOption.subtitle}
              </div>
            )}
          </div>
        </div>

        <span
          className={`material-symbols-outlined text-slate-400 text-[20px] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-slate-900' : 'group-hover:text-slate-700'
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 z-50 animate-popup-open">
          <div className="max-h-60 overflow-y-auto space-y-1 no-scrollbar">
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {option.icon && (
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 ${
                          isSelected ? 'text-white' : 'text-slate-400'
                        }`}
                      >
                        {option.icon}
                      </span>
                    )}
                    <div>
                      <div className="text-sm truncate font-semibold">{option.label}</div>
                      {option.subtitle && (
                        <div
                          className={`text-xs truncate ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          {option.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-white shrink-0">
                      check
                    </span>
                  )}
                  {option.badge && !isSelected && (
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200 shrink-0">
                      {option.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
