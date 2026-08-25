import React, { useState, useRef, useEffect } from 'react';
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
import { formatVND } from '../utils/format';
import { VIETNAM_BANKS, DEFAULT_BANK_CONFIG } from '../utils/vietqr';
import { CreditCard, QrCode } from 'lucide-react';
import { api } from '../services/api.js';

const DEFAULT_HOME_LOCATION = {
  name: 'Kho Tổng Locahome',
  address: '10 Kha Vạn Cân, P. Linh Trung, TP. Thủ Đức, TP. Hồ Chí Minh',
  lat: 10.8505,
  lng: 106.7718
};



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
  const [storePhone, setStorePhone] = useState(() => localStorage.getItem('kko_store_phone') || '0368 115 592');
  const [warehouseAddress, setWarehouseAddress] = useState(() => localStorage.getItem('kko_warehouse_address') || DEFAULT_HOME_LOCATION.address);
  const [warehouseLat, setWarehouseLat] = useState(() => localStorage.getItem('kko_warehouse_lat') || String(DEFAULT_HOME_LOCATION.lat));
  const [warehouseLng, setWarehouseLng] = useState(() => localStorage.getItem('kko_warehouse_lng') || String(DEFAULT_HOME_LOCATION.lng));

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

  const selectedBank = VIETNAM_BANKS[0];

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

  // Fetch settings from backend API & Supabase on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.getSettings();
        if (res?.data) {
          const s = res.data;
          // Apply Bank VietQR config
          if (s.bank_config) {
            const bc = typeof s.bank_config === 'string' ? JSON.parse(s.bank_config) : s.bank_config;
            if (bc.bankId) setBankId(bc.bankId);
            if (bc.accountNo) setAccountNo(bc.accountNo);
            if (bc.accountName) setAccountName(bc.accountName);
          }
          // Apply Store Profile
          if (s.store_profile) {
            const sp = typeof s.store_profile === 'string' ? JSON.parse(s.store_profile) : s.store_profile;
            if (sp.userName) setUserName(sp.userName);
            if (sp.storeName) setStoreName(sp.storeName);
            if (sp.storePhone) setStorePhone(sp.storePhone);
          }
          // Apply warehouse location
          if (s.warehouse_location) {
            const wh = typeof s.warehouse_location === 'string' ? JSON.parse(s.warehouse_location) : s.warehouse_location;
            if (wh.address) setWarehouseAddress(wh.address);
            if (wh.lat) setWarehouseLat(String(wh.lat));
            if (wh.lng) setWarehouseLng(String(wh.lng));
          }
          // Apply pricing rules
          if (s.pricing_rules) {
            const pr = typeof s.pricing_rules === 'string' ? JSON.parse(s.pricing_rules) : s.pricing_rules;
            if (pr.baseHourlyRate) setBaseHourlyRate(String(pr.baseHourlyRate));
            if (pr.baseShippingFee) setBaseShippingFee(String(pr.baseShippingFee));
            if (pr.perKmFee) setFeePerKm(String(pr.perKmFee));
            if (pr.minDeposit) setMinDeposit(String(pr.minDeposit));
          }
          // Apply GPS alerts
          if (s.gps_alerts) {
            const ga = typeof s.gps_alerts === 'string' ? JSON.parse(s.gps_alerts) : s.gps_alerts;
            if (typeof ga.autoGPS === 'boolean') setAutoGPS(ga.autoGPS);
            if (typeof ga.overtimeAlert === 'boolean') setOvertimeAlert(ga.overtimeAlert);
            if (typeof ga.lowBatteryAlert === 'boolean') setLowBatteryAlert(ga.lowBatteryAlert);
            if (typeof ga.autoLateFee === 'boolean') setAutoLateFee(ga.autoLateFee);
            if (ga.gpsInterval) setGpsInterval(String(ga.gpsInterval));
          }
        }
      } catch (err) {
        console.warn('Settings API offline, using localStorage:', err.message);
      }
    };
    fetchSettings();
  }, []);

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

      // Save Bank VietQR config to local storage
      const bankConfigObj = {
        bankId,
        accountNo,
        accountName: accountName.toUpperCase(),
        template: 'compact2'
      };
      localStorage.setItem('locahome_bank_config', JSON.stringify(bankConfigObj));

      // Sync ALL settings to Supabase and backend API
      api.updateSettings({
        bank_config: bankConfigObj,
        store_profile: {
          userName,
          storeName,
          storePhone
        },
        warehouse_location: {
          name: storeName || 'Kho Tổng Locahome',
          address: warehouseAddress,
          lat: parseFloat(warehouseLat) || 10.8505,
          lng: parseFloat(warehouseLng) || 106.7718,
          radiusKm: 15
        },
        pricing_rules: {
          baseHourlyRate: parseInt(baseHourlyRate) || 80000,
          baseShippingFee: parseInt(baseShippingFee) || 20000,
          perKmFee: parseInt(feePerKm) || 5000,
          minDeposit: parseInt(minDeposit) || 200000,
          depositRequired: true
        },
        gps_alerts: {
          autoGPS,
          overtimeAlert,
          lowBatteryAlert,
          autoLateFee,
          gpsInterval
        }
      }).catch(err => console.warn('Settings sync to API / Supabase failed:', err.message));

      if (setToast) {
        setToast({
          title: 'Đã Lưu Cấu Hình Thành Công',
          desc: 'Cài đặt tài khoản VietQR, kho hàng và bảng giá đã được đồng bộ lên hệ thống.',
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
            Cài đặt
          </h1>

        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-5 sm:space-y-6">



        {/* ══════════ SECTION 3: TÀI KHOẢN NGÂN HÀNG NHẬN TIỀN VIETQR ══════════ */}
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-[0_2px_12px_rgba(11,28,48,0.03)] space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Tài khoản ngân hàng nhận tiền VietQR
              </h2>
              <p className="text-xs text-slate-500">
                Cấu hình tài khoản nhận tiền chuyển khoản tự động chuẩn Napas 247
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {/* Row 1: Dedicated BIDV Bank Card */}
            <div className="w-full">
              <label className="block text-xs font-bold text-slate-600 mb-1">
                Ngân Hàng Thụ Hưởng
              </label>

              <div className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between shadow-2xs gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src="/bidv.png"
                    alt="BIDV"
                    className="w-14 sm:w-16 h-8 sm:h-9 object-contain shrink-0"
                  />
                  <div className="truncate">
                    <div className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                      BIDV
                    </div>
                    <div className="text-slate-500 text-[11px] sm:text-xs truncate">
                      Ngân hàng TMCP Đầu tư và Phát triển Việt Nam
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2: 2 Boxes 1 Line (Số TK & Tên Chủ TK) */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  placeholder="Ví dụ: 0908123456..."
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">
                  Tên chủ tài khoản
                </label>
                <input
                  type="text"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  placeholder="Ví dụ: HO VAN DUY..."
                  className="w-full px-3 py-2 sm:px-3.5 sm:py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-900 font-bold uppercase focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>
            </div>
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
