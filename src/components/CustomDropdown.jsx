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
        <label className="block font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider text-xs">
          {label}
        </label>
      )}

      {/* Dropdown Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-surface-container hover:bg-surface-container-high border transition-all text-left group ${
          isOpen
            ? 'border-primary ring-2 ring-primary/20 shadow-sm'
            : 'border-outline-variant/30 hover:border-outline-variant/60'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {(selectedOption?.icon || icon) && (
            <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
              {selectedOption?.icon || icon}
            </span>
          )}
          <div className="truncate">
            <div className="font-body-md font-medium text-on-surface truncate">
              {selectedOption ? selectedOption.label : placeholder}
            </div>
            {selectedOption?.subtitle && (
              <div className="text-[11px] text-on-surface-variant truncate">
                {selectedOption.subtitle}
              </div>
            )}
          </div>
        </div>

        <span
          className={`material-symbols-outlined text-on-surface-variant text-[20px] transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : 'group-hover:text-on-surface'
          }`}
        >
          expand_more
        </span>
      </button>

      {/* Animated Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-full min-w-[220px] bg-surface-container-lowest/95 backdrop-blur-xl border border-outline-variant/25 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="max-h-60 overflow-y-auto space-y-1">
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
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl transition-all text-left ${
                    isSelected
                      ? 'bg-primary-container text-on-primary-container font-medium'
                      : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {option.icon && (
                      <span
                        className={`material-symbols-outlined text-[18px] shrink-0 ${
                          isSelected ? 'text-on-primary-container' : 'text-on-surface-variant'
                        }`}
                      >
                        {option.icon}
                      </span>
                    )}
                    <div>
                      <div className="text-sm truncate">{option.label}</div>
                      {option.subtitle && (
                        <div
                          className={`text-[11px] truncate ${
                            isSelected ? 'text-on-primary-container/80' : 'text-on-surface-variant'
                          }`}
                        >
                          {option.subtitle}
                        </div>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-on-primary-container shrink-0">
                      check
                    </span>
                  )}
                  {option.badge && !isSelected && (
                    <span className="px-2 py-0.5 rounded-md bg-secondary/10 text-secondary text-[10px] font-semibold shrink-0">
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
