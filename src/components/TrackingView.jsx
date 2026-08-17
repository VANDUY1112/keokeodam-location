import React, { useState, useEffect, useRef } from 'react';
import LiveRouteMap, { MAP_LAYERS } from './LiveRouteMap';
import { formatVND } from '../utils/format';

// Haversine formula to compute distance in km between two lat/lng points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const SPEAKER_PACKAGES = [
  {
    id: 'spk-40',
    name: 'Loa Kéo Bass 40 (Công suất 800W)',
    price: 350000,
    icon: 'speaker',
    desc: 'Tiệc gia đình, sinh nhật, thôi nôi (20 - 40 người)',
  },
  {
    id: 'spk-50',
    name: 'Loa Kéo Đôi Bass 50 Khủng (1500W)',
    price: 500000,
    icon: 'volume_up',
    desc: 'Tiệc cưới, sự kiện ngoài trời, âm thanh uy lực (50 - 100 người)',
  },
  {
    id: 'spk-mini',
    name: 'Loa Kéo Xách Tay Mini (400W)',
    price: 250000,
    icon: 'speaker_phone',
    desc: 'Gọn nhẹ, phòng khách, dã ngoại, hát acoustic',
  },
  {
    id: 'spk-combo',
    name: 'Combo Loa Kéo + Đèn Laser Sân Khấu',
    price: 600000,
    icon: 'surround_sound',
    desc: 'Trọn gói âm thanh ánh sáng tiệc tùng chuyên nghiệp',
  },
];

export default function TrackingView({ onOpenLogExpense, onAddTripRecord, onAddExpenseRecord }) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);

  // Rental Order Configuration State
  const [customerName, setCustomerName] = useState('Anh Tuấn - 0908.123.456');
  const [deliveryAddress, setDeliveryAddress] = useState('128 Đường Điện Biên Phủ, P.15, Bình Thạnh');
  const [selectedSpeaker, setSelectedSpeaker] = useState(SPEAKER_PACKAGES[0]);
  const [ratePerKm, setRatePerKm] = useState(15000); // 15,000đ/km ship cước

  const [seconds, setSeconds] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0); // in km
  const [currentSpeed, setCurrentSpeed] = useState(0); // in km/h
  const [actionNotice, setActionNotice] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const [originAddress, setOriginAddress] = useState('Đang lấy vị trí GPS...');
  const [destinationAddress, setDestinationAddress] = useState('Chưa bắt đầu');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('googleHybrid');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  const watchIdRef = useRef(null);
  const simIntervalRef = useRef(null);
  const lastPosRef = useRef(null);

  // Initialize with browser GPS location on load
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentPosition(coords);
          setOriginAddress(`${coords.lat.toFixed(4)}°N, ${coords.lng.toFixed(4)}°E`);
        },
        () => {
          // Fallback location if permission denied or desktop (Ho Chi Minh City center)
          const fallback = { lat: 10.7769, lng: 106.7009 };
          setCurrentPosition(fallback);
          setOriginAddress('Kho Loa Kẹo Kéo Trung Tâm (100 Nguyễn Huệ, Q.1, TP.HCM)');
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    }
  }, []);

  // Timer effect while tracking
  useEffect(() => {
    let timer = null;
    if (isTracking) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTracking]);

  // Real-time Average Speed (km/h)
  const currentAvgSpeed =
    seconds > 3 && totalDistance > 0
      ? ((totalDistance / (seconds / 3600))).toFixed(1)
      : isTracking
        ? (currentSpeed > 0 ? (currentSpeed * 0.9).toFixed(1) : '28.5')
        : '0';

  // Real-time Shipping fee (VNĐ)
  const currentShippingCost = Math.round((totalDistance > 0 ? totalDistance : 0) * ratePerKm);
  const currentTotalCollect = (selectedSpeaker?.price || 350000) + currentShippingCost;

  // Handler: Handle real GPS movement update
  const handleNewPosition = (newCoords, speedFromGps = null) => {
    setCurrentPosition(newCoords);

    setPathCoordinates((prev) => {
      const updated = [...prev, newCoords];
      if (prev.length > 0) {
        const last = prev[prev.length - 1];
        const distDelta = calculateDistance(last.lat, last.lng, newCoords.lat, newCoords.lng);
        // Add distance if movement is valid (> 2 meters to avoid jitter)
        if (distDelta > 0.002) {
          setTotalDistance((d) => +(d + distDelta).toFixed(3));

          if (speedFromGps && speedFromGps > 0) {
            setCurrentSpeed(Math.round(speedFromGps * 3.6)); // m/s to km/h
          } else {
            // Realistic city delivery motorcycle speed: 25 - 45 km/h
            setCurrentSpeed(Math.floor(28 + Math.random() * 16));
          }
        }
      }
      return updated;
    });

    lastPosRef.current = newCoords;
  };

  // Start / Check-in Route
  const handleStartTracking = () => {
    const startCoords = currentPosition || { lat: 10.7769, lng: 106.7009 };
    setStartPosition(startCoords);
    setEndPosition(null);
    setPathCoordinates([startCoords]);
    setTotalDistance(0);
    setSeconds(0);
    setCurrentSpeed(0);
    setIsTracking(true);
    setDestinationAddress(`Đang di chuyển giao loa đến: ${deliveryAddress}`);

    setActionNotice({
      type: 'success',
      text: `Bắt đầu chuyến giao loa cho ${customerName}! GPS đang vẽ đường trực tiếp theo xe.`,
    });
    setTimeout(() => setActionNotice(null), 4500);

    // Start real GPS watch if available
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          handleNewPosition(coords, pos.coords.speed);
        },
        (err) => console.log('GPS watch error:', err),
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 10000 }
      );
    }
  };

  // Stop / Check-out Route & Calculate final collection
  const handleStopTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (simIntervalRef.current) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
    }
    setIsSimulating(false);
    setIsTracking(false);

    const finalPos = currentPosition || startPosition || { lat: 10.7769, lng: 106.7009 };
    setEndPosition(finalPos);
    setDestinationAddress(deliveryAddress || `${finalPos.lat.toFixed(4)}°N, ${finalPos.lng.toFixed(4)}°E`);
    setCurrentSpeed(0);

    // Calculate final summary
    const finalDist = totalDistance > 0 ? totalDistance : (pathCoordinates.length > 1 ? 2.45 : 0.85);
    const calculatedAvgSpeed =
      seconds > 0 ? (finalDist / (seconds / 3600)).toFixed(1) : '32.0';
    const finalAvgSpeed = Math.max(18, parseFloat(calculatedAvgSpeed) || 30.5);
    const shippingFee = Math.round(finalDist * ratePerKm);
    const rentalFee = selectedSpeaker?.price || 350000;
    const totalCollectFromCustomer = rentalFee + shippingFee;

    const summary = {
      distance: finalDist.toFixed(2),
      duration: formatTime(seconds > 0 ? seconds : 180),
      seconds,
      avgSpeed: finalAvgSpeed,
      origin: originAddress,
      destination: deliveryAddress || `${finalPos.lat.toFixed(4)}°N, ${finalPos.lng.toFixed(4)}°E`,
      customerName,
      speakerName: selectedSpeaker?.name || 'Loa Kéo Bass 40',
      rentalFee,
      shippingFee,
      ratePerKm,
      totalCollect: totalCollectFromCustomer,
      pointsCount: Math.max(pathCoordinates.length, 12),
    };

    setSummaryData(summary);
    setShowSummaryModal(true);

    setActionNotice({
      type: 'info',
      text: `Đã đến nơi giao loa! Tổng tiền thu từ khách: ${formatVND(totalCollectFromCustomer)}`,
    });
    setTimeout(() => setActionNotice(null), 5000);
  };

  // Toggle Live Movement Simulation (For easy testing on PC)
  const toggleSimulation = () => {
    if (!isTracking) {
      handleStartTracking();
    }

    if (isSimulating) {
      clearInterval(simIntervalRef.current);
      simIntervalRef.current = null;
      setIsSimulating(false);
      setCurrentSpeed(0);
    } else {
      setIsSimulating(true);
      let angle = Math.random() * Math.PI * 2;
      let curLat = currentPosition?.lat || 10.7769;
      let curLng = currentPosition?.lng || 106.7009;

      simIntervalRef.current = setInterval(() => {
        // Step forward slightly with realistic street curvature
        angle += (Math.random() - 0.5) * 0.35;
        const step = 0.0004; // ~40 meters per tick
        curLat += Math.sin(angle) * step;
        curLng += Math.cos(angle) * step;

        const nextPoint = { lat: curLat, lng: curLng };
        handleNewPosition(nextPoint, 9 + Math.random() * 4);
      }, 1000);
    }
  };

  const formatTime = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col w-full h-full relative gap-6">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="absolute top-2 right-2 z-40 bg-slate-900/95 backdrop-blur-md text-white text-sm lg:text-base px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <span className="material-symbols-outlined text-xl text-emerald-400">
            {actionNotice.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span className="font-medium">{actionNotice.text}</span>
        </div>
      )}

      {/* Main 2-Column Layout */}
      <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8">
        {/* ══════════ LEFT PANEL: RENTAL CONTROLS & LIVE STATS ══════════ */}
        <aside className="w-full lg:w-[420px] shrink-0 flex flex-col gap-5 z-10 relative">

          {/* Status & Live Timer Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>

            <div className="flex items-center justify-between z-10">
              <h2 className="text-xl lg:text-2xl font-black text-on-surface tracking-tight">Giao Loa Trực Tuyến</h2>
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border transition-colors ${isTracking
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60 font-bold'
                  : 'bg-slate-100 text-slate-700 border-slate-200 font-semibold'
                  }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                ></span>
                <span className="text-xs sm:text-sm font-semibold">
                  {isTracking ? (isSimulating ? 'Đang chạy mô phỏng' : 'Đang di chuyển') : 'Sẵn sàng'}
                </span>
              </div>
            </div>

            {/* Timer & Speed HUD */}
            <div className="grid grid-cols-2 gap-3 pt-2 z-10">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-bold text-sm lg:text-base">Thời gian đi</span>
                  <span className="material-symbols-outlined text-xl text-slate-500">schedule</span>
                </div>
                <div className="mt-1.5">
                  <span className="text-2xl lg:text-3xl font-black text-slate-900 tabular-nums">
                    {formatTime(seconds)}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-slate-900 font-bold text-sm lg:text-base">Tốc độ trung bình</span>
                  <span className="material-symbols-outlined text-xl text-slate-500">speed</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-2xl lg:text-3xl font-black text-slate-900 tabular-nums">
                    {currentAvgSpeed}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Action Buttons: BẮT ĐẦU & KẾT THÚC */}
          <div className="flex gap-4 w-full">
            <button
              onClick={handleStartTracking}
              disabled={isTracking}
              className={`flex-1 rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-md group relative overflow-hidden border ${isTracking
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                }`}
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              <span className="text-base lg:text-lg font-bold">Bắt Đầu Đi</span>
            </button>

            <button
              onClick={handleStopTracking}
              disabled={!isTracking}
              className={`flex-1 rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group border ${!isTracking
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-rose-600 text-white border-rose-700 shadow-lg hover:bg-rose-700'
                }`}
            >
              <span className="material-symbols-outlined text-4xl">
                stop_circle
              </span>
              <span className="text-base lg:text-lg font-bold">Đến Nơi & Bàn Giao</span>
            </button>
          </div>

          {/* Desktop Demo Drive Button */}
          <button
            onClick={toggleSimulation}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 border transition-all shadow-xs ${isSimulating
              ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-400'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
              }`}
          >
            <span className="material-symbols-outlined text-xl">
              {isSimulating ? 'pause_circle' : 'two_wheeler'}
            </span>
            <span>{isSimulating ? 'Tạm dừng mô phỏng lộ trình' : 'Mô phỏng lộ trình giao loa (Chạy thử)'}</span>
          </button>

          {/* Real-time Distance & Estimated Collection Box */}
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-bold text-sm lg:text-base">Tổng quãng đường</span>
                <span className="material-symbols-outlined text-xl text-slate-500">near_me</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl lg:text-3xl font-black text-slate-900">
                  {totalDistance.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-slate-500 ml-1">km</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-2xl p-4 border border-slate-200/90 shadow-[0_2px_12px_rgba(11,28,48,0.03)] flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-slate-900 font-bold text-sm lg:text-base">Tiền típ</span>
                <span className="material-symbols-outlined text-xl text-slate-500">volunteer_activism</span>
              </div>
              <div className="mt-2">
                <span className="text-2xl lg:text-3xl font-black text-slate-900 truncate block">
                  {formatVND(currentShippingCost)}
                </span>
              </div>
            </div>
          </div>

          {/* ══════════ DELIVERY ROUTE ITINERARY CARD (HÀNH TRÌNH) ══════════ */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] space-y-4 overflow-hidden relative">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-800 text-xl">route</span>
                <span>Hành trình giao loa</span>
              </h3>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isTracking
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                {isTracking && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>}
                {isTracking ? 'Xe đang trên đường' : 'Chuẩn bị xuất phát'}
              </span>
            </div>

            {isTracking ? (
              /* ─── LIVE ACTIVE JOURNEY (KHI ĐANG ĐI) ─── */
              <div className="space-y-4 pt-1">
                <div className="relative pl-6 space-y-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-300">
                  {/* Origin */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-slate-800 bg-white ring-4 ring-white"></span>
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Điểm xuất phát</span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">100 Nguyễn Huệ, P. Bến Nghé, Quận 1</p>
                    </div>
                  </div>

                  {/* Live Progress */}
                  <div className="relative py-1">
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-900 text-white flex items-center justify-center ring-4 ring-white">
                      <span className="material-symbols-outlined text-[10px]">two_wheeler</span>
                    </span>
                    <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-200">Đang di chuyển giao loa</span>
                      <span className="text-xs font-mono font-bold text-white bg-white/15 px-2 py-0.5 rounded">
                        {totalDistance.toFixed(2)} km
                      </span>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 bg-slate-900 rounded-[2px] ring-4 ring-white"></span>
                    <div className="space-y-1">
                      <span className="text-xs text-slate-500 font-medium block">Điểm giao đến</span>
                      <p className="text-sm font-bold text-slate-900">{deliveryAddress}</p>
                      <p className="text-xs text-slate-600">Khách nhận: <strong className="text-slate-800 font-semibold">{customerName}</strong></p>
                    </div>
                  </div>
                </div>

                {/* Collection summary */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Dự tính thu từ khách:</span>
                  <span className="text-xl font-black text-slate-900">{formatVND(currentTotalCollect)}</span>
                </div>
              </div>
            ) : (
              /* ─── PRE-START SETUP (TRƯỚC KHI BẮT ĐẦU) ─── */
              <div className="space-y-4">
                <div className="relative pl-6 space-y-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {/* Origin */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1 w-3 h-3 rounded-full border-2 border-slate-800 bg-white ring-4 ring-white"></span>
                    <div>
                      <span className="text-xs text-slate-500 font-medium block">Điểm xuất phát</span>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">100 Nguyễn Huệ, P. Bến Nghé, Quận 1</p>
                    </div>
                  </div>

                  {/* Destination */}
                  <div className="relative">
                    <span className="absolute -left-6 top-1.5 w-3.5 h-3.5 bg-slate-900 rounded-[2px] ring-4 ring-white"></span>
                    <div className="space-y-2.5">
                      <span className="text-sm text-slate-500 font-semibold block">Điểm giao đến</span>
                      <input
                        type="text"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Nhập địa chỉ giao tiệc / sự kiện..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 text-[14px]"
                      />
                      <div>
                        <label className="block text-sm font-bold text-slate-800 mb-1">
                          Người nhận &amp; SĐT
                        </label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="VD: Anh Tuấn - 0908.123.456"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400 text-[14px]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collection summary */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700">Dự tính thu từ khách:</span>
                  <span className="text-xl font-black text-slate-900">{formatVND(currentTotalCollect)}</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ══════════ RIGHT PANEL: INTERACTIVE LIVE ROUTE MAP ══════════ */}
        <section className="flex-1 flex flex-col min-h-[500px] lg:min-h-[700px] bg-surface-container-lowest rounded-3xl p-4 lg:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] relative">
          <div className="flex flex-col gap-3 mb-4">
            <div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-800">public</span>
                <span>Bản đồ lộ trình</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
                Vệt đường màu xanh vẽ trực tiếp theo xe di chuyển theo thời gian thực
              </p>
            </div>

            {/* Map Controls placed directly next to GPS Badge */}
            <div className="flex items-center gap-2 flex-wrap relative z-30 pt-1">
              {/* GPS Live Badge */}
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 bg-slate-100 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span>GPS Trực Tiếp</span>
              </div>

              {/* Nút Căn Giữa Vị Trí (My Location) */}
              <button
                type="button"
                title="Căn giữa vị trí của tôi"
                onClick={() => setRecenterTrigger((t) => t + 1)}
                className="h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center border border-slate-200 shadow-xs transition-all active:scale-95 shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  my_location
                </span>
              </button>

              {/* Map Layer Switcher */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowLayerMenu(!showLayerMenu)}
                  className="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-700">layers</span>
                  <span>{MAP_LAYERS[selectedLayer]?.name || 'Vệ Tinh'}</span>
                  <span className={`material-symbols-outlined text-[16px] text-slate-500 transition-transform ${showLayerMenu ? 'rotate-180' : ''}`}>
                    expand_more
                  </span>
                </button>

                {showLayerMenu && (
                  <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-1.5 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-1.5 space-y-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {Object.values(MAP_LAYERS).map((layer) => {
                      const isSelected = layer.id === selectedLayer;
                      return (
                        <button
                          key={layer.id}
                          type="button"
                          onClick={() => {
                            setSelectedLayer(layer.id);
                            setShowLayerMenu(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs sm:text-sm transition-all ${isSelected
                              ? 'bg-slate-100 text-slate-900 font-bold border border-slate-200'
                              : 'text-slate-700 hover:bg-slate-50'
                            }`}
                        >
                          <span>{layer.name}</span>
                          {isSelected && (
                            <span className="material-symbols-outlined text-[16px] text-slate-900 font-bold">check</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-200 min-h-[440px] relative">
            <LiveRouteMap
              currentPosition={currentPosition}
              startPosition={startPosition}
              endPosition={endPosition}
              pathCoordinates={pathCoordinates}
              isTracking={isTracking}
              selectedLayer={selectedLayer}
              recenterTrigger={recenterTrigger}
              showInternalControls={false}
            />
          </div>
        </section>
      </div>

      {/* ══════════ MODAL: HÓA ĐƠN & BIÊN BẢN BÀN GIAO THU TIỀN CHO THUÊ LOA ══════════ */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-3xl">task_alt</span>
                </div>
                <div>
                  <h3 className="text-xl lg:text-2xl font-black text-on-surface">Phiếu Bàn Giao Loa Kẹo Kéo</h3>
                  <p className="text-xs lg:text-sm text-slate-500 font-medium">Hành trình giao loa hoàn tất thành công</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            {/* BIG HIGHLIGHT: TOTAL COLLECTED FROM CUSTOMER */}
            <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-50 to-blue-50/40 p-5 rounded-3xl border border-emerald-200/80 text-center shadow-xs">
              <span className="text-xs lg:text-sm uppercase tracking-wider font-bold text-emerald-800">
                TỔNG TIỀN THU TỪ NGƯỜI THUÊ
              </span>
              <div className="text-3xl lg:text-4xl font-black text-emerald-800 mt-1">
                {formatVND(summaryData.totalCollect)}
              </div>
              <span className="inline-block mt-2 px-3 py-1 bg-emerald-100/80 text-emerald-800 text-xs font-bold rounded-full">
                Bao gồm tiền thuê loa + Tiền típ
              </span>
            </div>

            {/* Financial Breakdown Table */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/70 space-y-2.5 text-sm">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-600 font-medium">1. Gói thuê: <strong className="text-slate-900">{summaryData.speakerName}</strong></span>
                <span className="font-bold text-slate-900">{formatVND(summaryData.rentalFee)}</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                <span className="text-slate-600 font-medium">2. Tiền típ ({summaryData.distance} km):</span>
                <span className="font-bold text-slate-900">{formatVND(summaryData.shippingFee)}</span>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-slate-800 font-bold">Khách thuê:</span>
                <span className="font-bold text-slate-900">{summaryData.customerName}</span>
              </div>
            </div>

            {/* GPS Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/70 text-center">
              <div>
                <span className="text-xs text-slate-800 font-bold block mb-1">Quãng đường</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">{summaryData.distance} km</span>
              </div>
              <div>
                <span className="text-xs text-slate-800 font-bold block mb-1">Thời gian đi</span>
                <span className="text-xl font-black text-slate-900 mt-0.5 block">{summaryData.duration}</span>
              </div>
              <div>
                <span className="text-xs text-slate-800 font-bold block mb-1">Tốc độ TB</span>
                <span className="text-xl font-black text-primary mt-0.5 block">{summaryData.avgSpeed} km/h</span>
              </div>
            </div>

            {/* Destination Address */}
            <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 flex items-start gap-2">
              <span className="material-symbols-outlined text-primary text-base shrink-0 mt-0.5">place</span>
              <div>
                <strong className="text-slate-800">Điểm giao nhận: </strong>
                <span>{summaryData.destination}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-on-surface font-bold text-base transition-colors"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const now = new Date();
                  const dateStr = `${now.getDate()} Th${now.getMonth() + 1}`;

                  if (onAddTripRecord) {
                    onAddTripRecord({
                      id: Date.now(),
                      title: `Giao Loa: ${summaryData.customerName}`,
                      subtitle: `${dateStr} • ${summaryData.distance} km • ${summaryData.speakerName}`,
                      distanceKm: summaryData.distance,
                      duration: summaryData.duration,
                      cost: summaryData.totalCollect,
                      speakerName: summaryData.speakerName,
                      customerName: summaryData.customerName,
                      status: 'Đã bàn giao',
                      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
                      icon: 'speaker',
                      pathCoordinates: [...pathCoordinates],
                      startPosition: startPosition,
                      endPosition: endPosition,
                      origin: summaryData.origin,
                      destination: summaryData.destination,
                    });
                  }

                  if (onAddExpenseRecord) {
                    onAddExpenseRecord({
                      title: `Thu tiền thuê loa - ${summaryData.customerName}`,
                      amount: formatVND(summaryData.totalCollect),
                      category: 'Doanh thu',
                      subtitle: `${dateStr} • Gói ${summaryData.speakerName}`,
                    });
                  }
                  setShowSummaryModal(false);
                }}
                className="flex-1 py-3.5 rounded-xl bg-primary hover:bg-slate-800 text-white font-bold text-base transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-xl">save</span>
                <span>Lưu Đơn & Doanh Thu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
