/**
 * Utility functions for currency and measurement formatting
 */

export const formatVND = (value) => {
  if (value === null || value === undefined || value === '') return '0 ₫';
  
  if (typeof value === 'number') {
    return value.toLocaleString('vi-VN') + ' ₫';
  }

  const str = String(value).trim();

  // If already properly formatted with ₫ or VNĐ
  if (str.endsWith('₫') || str.endsWith('VNĐ') || str.endsWith('đ')) {
    return str;
  }

  // If it's a USD string like "$245.50" or "$0.30"
  if (str.startsWith('$')) {
    const raw = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
    // Map USD numbers realistically to VNĐ (approx 25,000 VND/USD)
    const converted = Math.round(raw * 25000);
    return converted.toLocaleString('vi-VN') + ' ₫';
  }

  // Extract all digits
  const cleanDigits = str.replace(/[^0-9]/g, '');
  if (!cleanDigits) return '0 ₫';

  const num = parseInt(cleanDigits, 10);
  return num.toLocaleString('vi-VN') + ' ₫';
};

export const parseVNDNumber = (val) => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const str = String(val);
  if (str.startsWith('$')) {
    const raw = parseFloat(str.replace(/[^0-9.]/g, '')) || 0;
    return Math.round(raw * 25000);
  }
  const cleanDigits = str.replace(/[^0-9]/g, '');
  return cleanDigits ? parseInt(cleanDigits, 10) : 0;
};

export const parseLocalDate = (dateStr) => {
  if (!dateStr) return new Date();
  if (dateStr instanceof Date) return dateStr;
  let str = String(dateStr).trim();
  // SQLite CURRENT_TIMESTAMP returns UTC "YYYY-MM-DD HH:mm:ss"
  if (!str.includes('Z') && !str.includes('+') && str.includes(' ')) {
    str = str.replace(' ', 'T') + 'Z';
  } else if (!str.includes('Z') && !str.includes('+') && str.includes('T')) {
    str = str + 'Z';
  }
  const d = new Date(str);
  return isNaN(d.getTime()) ? new Date() : d;
};
