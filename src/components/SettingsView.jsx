import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  DollarSign, 
  Navigation, 
  Bell, 
  Database, 
  ShieldCheck, 
  Check, 
  RefreshCw, 
  Download, 
  Upload, 
  Trash2,
  Smartphone,
  Store,
  Sparkles
} from 'lucide-react';
import { HOME_LOCATION } from '../data/speakersData';
import { formatVND } from '../utils/format';
import { VIETNAM_BANKS, DEFAULT_BANK_CONFIG } from '../utils/vietqr';
import { CreditCard, QrCode } from 'lucide-react';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
];

export default function SettingsView({ 
  userAvatar, 
  setUserAvatar, 
  userName, 
  setUserName, 
  setToast,
  onResetAllData
}) {
  // Store info state
  const [storeName, setStoreName] = useState(() => localStorage.getItem('kko_store_name') || 'Dịch Vụ Cho Thuê Loa Kéo KeoKeoDam');
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('kko_store_phone') || '0908 123 456');
  const [warehouseAddress, setWarehouseAddress] = useState(() => localStorage.getItem('kko_warehouse_address') || HOME_LOCATION.address);
  const [warehouseLat, setWarehouseLat] = useState(() => localStorage.getItem('kko_warehouse_lat') || String(HOME_LOCATION.lat || 10.8752));
  const [warehouseLng, setWarehouseLng] = useState(() => localStorage.getItem('kko_warehouse_lng') || String(HOME_LOCATION.lng || 106.7725));

  // Bank Account VietQR state
  const [bankId, setBankId] = useState(() => {
    try {
      const saved = localStorage.getItem('locahome_bank_config');
      return saved ? JSON.parse(saved).bankId : DEFAULT_BANK_CONFIG.bankId;
    } catch {
      return DEFAULT_BANK_CONFIG.bankId;
    }
  });
  const [accountNo, setAccountNo] = useState(() => {
    try {
      const saved = localStorage.getItem('locahome_bank_config');
      return saved ? JSON.parse(saved).accountNo : DEFAULT_BANK_CONFIG.accountNo;
    } catch {
      return DEFAULT_BANK_CONFIG.accountNo;
    }
  });
  const [accountName, setAccountName] = useState(() => {
    try {
      const saved = localStorage.getItem('locahome_bank_config');
      return saved ? JSON.parse(saved).accountName : DEFAULT_BANK_CONFIG.accountName;
    } catch {
      return DEFAULT_BANK_CONFIG.accountName;
    }
  });

  // Pricing rules state
  const [baseHourlyRate, setBaseHourlyRate] = useState(() => localStorage.getItem('kko_base_hourly_rate') || '80000');
  const [baseShippingFee, setBaseShippingFee] = useState(() => localStorage.getItem('kko_base_shipping_fee') || '20000');
  const [feePerKm, setFeePerKm] = useState(() => localStorage.getItem('kko_fee_per_km') || '5000');
  const [minDeposit, setMinDeposit] = useState(() => localStorage.getItem('kko_min_deposit') || '200000');

  // GPS & Notification switches
  const [autoGPS, setAutoGPS] = useState(() => localStorage.getItem('kko_auto_gps') !== 'false');
  const [overtimeAlert, setOvertimeAlert] = useState(() => localStorage.getItem('kko_overtime_alert') !== 'false');
  const [lowBatteryAlert, setLowBatteryAlert] = useState(() => localStorage.getItem('kko_low_battery_alert') !== 'false');
  const [autoLateFee, setAutoLateFee] = useState(() => localStorage.getItem('kko_auto_late_fee') !== 'false');
  const [gpsInterval, setGpsInterval] = useState(() => localStorage.getItem('kko_gps_interval') || '1');

  // Save all settings handler
  const handleSaveSettings = (e) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem('expensely_user_name', userName);
      localStorage.setItem('kko_store_name', storeName);
      localStorage.setItem('kko_store_phone', storePhone);
      localStorage.setItem('kko_warehouse_address', warehouseAddress);
      localStorage.setItem('kko_warehouse_lat', warehouseLat);
      localStorage.setItem('kko_warehouse_lng', warehouseLng);
      localStorage.setItem('kko_base_hourly_rate', baseHourlyRate);
      localStorage.setItem('kko_base_shipping_fee', baseShippingFee);
      localStorage.setItem('kko_fee_per_km', feePerKm);
      localStorage.setItem('kko_min_deposit', minDeposit);
      localStorage.setItem('kko_auto_gps', String(autoGPS));
      localStorage.setItem('kko_overtime_alert', String(overtimeAlert));
      localStorage.setItem('kko_low_battery_alert', String(lowBatteryAlert));
      localStorage.setItem('kko_auto_late_fee', String(autoLateFee));
      localStorage.setItem('kko_gps_interval', gpsInterval);

      // Save Bank VietQR config
      localStorage.setItem('locahome_bank_config', JSON.stringify({
        bankId,
        accountNo,
        accountName: accountName.toUpperCase(),
        template: 'compact2'
      }));

      if (setToast) {
        setToast({
          title: 'Đã Lưu Cấu Hình Thành Công',
          desc: 'Cài đặt tài khoản VietQR, kho hàng và bảng giá đã được áp dụng.',
          type: 'success'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Get current device GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      if (setToast) setToast({ title: 'Lỗi GPS', desc: 'Trình duyệt không hỗ trợ Geolocation.', type: 'error' });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);
        setWarehouseLat(lat);
        setWarehouseLng(lng);
        if (setToast) {
          setToast({
            title: 'Đã Cập Nhật Tọa Độ GPS Kho',
            desc: `Vĩ độ: ${lat}, Kinh độ: ${lng}`,
            type: 'success'
          });
        }
      },
      (err) => {
        if (setToast) setToast({ title: 'Không thể lấy GPS', desc: err.message, type: 'error' });
      }
    );
  };

  // Export full backup JSON
  const handleExportBackup = () => {
    try {
      const data = {
        expenses: localStorage.getItem('expensely_expenses'),
        trips: localStorage.getItem('expensely_trips'),
        userName: localStorage.getItem('expensely_user_name'),
        settings: {
          storeName,
          storePhone,
          warehouseAddress,
          warehouseLat,
          warehouseLng,
          baseHourlyRate,
          baseShippingFee,
          feePerKm
        },
        exportedAt: new Date().toISOString()
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keokeodam_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);

      if (setToast) {
        setToast({
          title: 'Đã Tải Bản Sao Lưu JSON',
          desc: 'Tất cả nhật ký giao loa, chi phí và cấu hình đã được xuất an toàn.',
          type: 'success'
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col w-full gap-5 sm:gap-6 lg:gap-8 pb-28 lg:pb-12 max-w-5xl mx-auto">
      {/* ══════════ TOP HEADER ══════════ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Cài Đặt & Cấu Hình Hệ Thống
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm lg:text-base mt-0.5 sm:mt-1">
            Quản lý thông tin tài khoản, đơn giá cho thuê, vị trí kho nhà và thiết lập GPS
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-all shadow-xs active:scale-95 whitespace-nowrap self-start sm:self-auto"
        >
          <Check className="w-4 h-4" />
          <span>Lưu Cài Đặt</span>
        </button>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5 sm:space-y-6">
        {/* ══════════ SECTION 1: THÔNG TIN TÀI KHOẢN & HỒ SƠ ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-5">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Hồ Sơ & Ảnh Đại Diện
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
            <div className="relative group shrink-0">
              <img
                src={userAvatar}
                alt="Avatar"
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl sm:rounded-3xl object-cover border-2 border-slate-200 shadow-sm"
              />
            </div>

            <div className="flex-1 w-full space-y-3 text-center sm:text-left">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Chọn avatar có sẵn
              </span>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                {AVATAR_PRESETS.map((preset, idx) => (
                  <img
                    key={idx}
                    src={preset}
                    alt={`Preset ${idx + 1}`}
                    onClick={() => {
                      setUserAvatar(preset);
                      localStorage.setItem('expensely_user_avatar', preset);
                    }}
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover cursor-pointer transition-all hover:scale-105 ${
                      userAvatar === preset
                        ? 'ring-3 ring-slate-900 shadow-sm'
                        : 'border border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Tên Người Quản Trị
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                    placeholder="Nguyễn Văn Duy"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1">
                    Dán Link Avatar Khác
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    onBlur={(e) => {
                      if (e.target.value.trim()) {
                        setUserAvatar(e.target.value.trim());
                        localStorage.setItem('expensely_user_avatar', e.target.value.trim());
                      }
                    }}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ SECTION 2: KHO NHÀ & ĐỊA ĐIỂM GIAO NHẬN CHÍNH ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
                <Store className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Thông Tin Cửa Hàng & Kho Nhà Chính
                </h2>
                <p className="text-xs text-slate-500">
                  Điểm gốc để tính toán khoảng cách và cước phí vận chuyển tự động
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGetCurrentLocation}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0"
              title="Lấy GPS hiện tại"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-700" />
              <span className="hidden sm:inline">Lấy GPS Hiện Tại</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tên Dịch Vụ / Tiệm Loa
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Hotline Khách Đặt Thuê
              </label>
              <input
                type="text"
                value={storePhone}
                onChange={(e) => setStorePhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Địa Chỉ Kho Nhà Chính (Điểm Xuất Phát)
              </label>
              <input
                type="text"
                value={warehouseAddress}
                onChange={(e) => setWarehouseAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Vĩ Độ Kho (Latitude)
              </label>
              <input
                type="text"
                value={warehouseLat}
                onChange={(e) => setWarehouseLat(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Kinh Độ Kho (Longitude)
              </label>
              <input
                type="text"
                value={warehouseLng}
                onChange={(e) => setWarehouseLng(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* ══════════ SECTION 3: TÀI KHOẢN NGÂN HÀNG NHẬN TIỀN VIETQR ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tài Khoản Ngân Hàng Nhận Tiền VietQR
              </h2>
              <p className="text-xs text-slate-500">
                Cấu hình tài khoản nhận tiền chuyển khoản tự động chuẩn Napas 247
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ngân Hàng Thụ Hưởng
              </label>
              <select
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                {VIETNAM_BANKS.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.shortName} ({b.id})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Số Tài Khoản Nhận Tiền
              </label>
              <input
                type="text"
                value={accountNo}
                onChange={(e) => setAccountNo(e.target.value)}
                placeholder="Ví dụ: 0908123456..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Tên Chủ Tài Khoản (Không Dấu)
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                placeholder="Ví dụ: TRAN ANH TUAN..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {/* ══════════ SECTION 4: BẢNG GIÁ & ĐỊNH MỨC VẬN CHUYỂN ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Đơn Giá Thuê Mặc Định & Cước Phí Ship
              </h2>
              <p className="text-xs text-slate-500">
                Tự động áp dụng khi tạo đơn giao loa hoặc tính tiền check-out
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Giá Thuê Giờ Cơ Bản (VNĐ / Giờ)
              </label>
              <input
                type="number"
                value={baseHourlyRate}
                onChange={(e) => setBaseHourlyRate(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Hiện tại: {formatVND(Number(baseHourlyRate))} / giờ
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Phí Ship Cơ Sở (3 km đầu tiên)
              </label>
              <input
                type="number"
                value={baseShippingFee}
                onChange={(e) => setBaseShippingFee(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Hiện tại: {formatVND(Number(baseShippingFee))}
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Cước Mỗi Km Tiếp Theo (Từ km thứ 4)
              </label>
              <input
                type="number"
                value={feePerKm}
                onChange={(e) => setFeePerKm(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Hiện tại: {formatVND(Number(feePerKm))} / km
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Mức Đặt Cọc Khuyến Nghị
              </label>
              <input
                type="number"
                value={minDeposit}
                onChange={(e) => setMinDeposit(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Hiện tại: {formatVND(Number(minDeposit))}
              </span>
            </div>
          </div>
        </div>

        {/* ══════════ SECTION 4: CẤU HÌNH GPS & CẢNH BÁO THÔNG MINH ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <Navigation className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Cấu Hình Định Vị GPS & Cảnh Báo
              </h2>
              <p className="text-xs text-slate-500">
                Tối ưu việc theo dõi vị trí trực tiếp và kiểm soát tình trạng thiết bị
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Tự động kích hoạt ghi nhận GPS
                </div>
                <div className="text-xs text-slate-500">
                  Bắt đầu vẽ lộ trình di chuyển khi shipper nhận đơn giao loa
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoGPS}
                onChange={(e) => setAutoGPS(e.target.checked)}
                className="w-5 h-5 accent-slate-900 cursor-pointer rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Cảnh báo ca thuê quá giờ (&gt; 4 tiếng)
                </div>
                <div className="text-xs text-slate-500">
                  Nhắc nhở shipper gọi khách hàng để xác nhận gia hạn hoặc chuẩn bị thu loa
                </div>
              </div>
              <input
                type="checkbox"
                checked={overtimeAlert}
                onChange={(e) => setOvertimeAlert(e.target.checked)}
                className="w-5 h-5 accent-slate-900 cursor-pointer rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Cảnh báo pin loa yếu (&lt; 20%)
                </div>
                <div className="text-xs text-slate-500">
                  Thông báo khi loa đang thuê sắp hết pin cần cắm sạc dự phòng
                </div>
              </div>
              <input
                type="checkbox"
                checked={lowBatteryAlert}
                onChange={(e) => setLowBatteryAlert(e.target.checked)}
                className="w-5 h-5 accent-slate-900 cursor-pointer rounded"
              />
            </div>

            <div className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Tự động cộng tiền phụ thu khi quá giờ
                </div>
                <div className="text-xs text-slate-500">
                  Tự động làm tròn theo bước 30 phút khi khách hàng trả loa trễ
                </div>
              </div>
              <input
                type="checkbox"
                checked={autoLateFee}
                onChange={(e) => setAutoLateFee(e.target.checked)}
                className="w-5 h-5 accent-slate-900 cursor-pointer rounded"
              />
            </div>

            <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="text-xs sm:text-sm font-bold text-slate-900">
                  Tần suất cập nhật tọa độ GPS
                </div>
                <div className="text-xs text-slate-500">
                  Chu kỳ làm mới vị trí di chuyển trên bản đồ trực tiếp
                </div>
              </div>
              <select
                value={gpsInterval}
                onChange={(e) => setGpsInterval(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="1">Mỗi 1 giây (Mượt mà nhất)</option>
                <option value="3">Mỗi 3 giây (Khuyên dùng)</option>
                <option value="5">Mỗi 5 giây (Tiết kiệm pin)</option>
              </select>
            </div>
          </div>
        </div>

        {/* ══════════ SECTION 5: SAO LƯU & QUẢN LÝ DỮ LIỆU ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Sao Lưu & Quản Lý Dữ Liệu
              </h2>
              <p className="text-xs text-slate-500">
                Lưu trữ toàn bộ đơn thuê, chi phí và lịch sử GPS về máy an toàn
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-2 transition-colors shadow-xs"
            >
              <Download className="w-4 h-4 text-slate-700" />
              <span>Tải Bản Sao Lưu JSON</span>
            </button>

            {onResetAllData && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Bạn có chắc chắn muốn nạp lại dữ liệu mẫu gốc không?')) {
                    onResetAllData();
                    if (setToast) {
                      setToast({
                        title: 'Đã Đặt Lại Dữ Liệu Mẫu',
                        desc: 'Tất cả đơn hàng và chi phí đã được khôi phục về trạng thái ban đầu.',
                        type: 'success'
                      });
                    }
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-xs sm:text-sm font-bold text-rose-700 flex items-center gap-2 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Đặt Lại Dữ Liệu Mẫu</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Save Action */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Lưu Toàn Bộ Thay Đổi</span>
          </button>
        </div>
      </form>
    </div>
  );
}
