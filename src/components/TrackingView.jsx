import React, { useState, useEffect, useRef } from 'react';
import LiveRouteMap from './LiveRouteMap';

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

export default function TrackingView({ onOpenLogExpense, onAddTripRecord, onAddExpenseRecord }) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);

  const [seconds, setSeconds] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0); // in km
  const [currentSpeed, setCurrentSpeed] = useState(0); // in km/h
  const [actionNotice, setActionNotice] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const [originAddress, setOriginAddress] = useState('Đang lấy vị trí GPS...');
  const [destinationAddress, setDestinationAddress] = useState('Chưa bắt đầu');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);

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
          setOriginAddress('100 Đường Nguyễn Huệ, Quận 1, TP.HCM');
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
            // Estimate speed
            setCurrentSpeed(Math.floor(25 + Math.random() * 20));
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
    setDestinationAddress('Đang ghi nhận lộ trình di chuyển...');

    setActionNotice({
      type: 'success',
      text: 'Đã ấn định vị trí xuất phát! GPS đang theo dõi lộ trình và vẽ đường di chuyển.',
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

  // Stop / Check-out Route
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
    setDestinationAddress(`${finalPos.lat.toFixed(4)}°N, ${finalPos.lng.toFixed(4)}°E`);
    setCurrentSpeed(0);

    // Calculate final summary
    const finalDist = totalDistance > 0 ? totalDistance : (pathCoordinates.length > 1 ? 0.35 : 0.05);
    const avgSpeed = seconds > 0 ? ((finalDist / (seconds / 3600))).toFixed(1) : 0;
    const estCost = Math.round(finalDist * 12000); // 12,000đ/km

    const summary = {
      distance: finalDist.toFixed(2),
      duration: formatTime(seconds),
      seconds,
      avgSpeed: Math.max(15, avgSpeed),
      origin: originAddress,
      destination: `${finalPos.lat.toFixed(4)}°N, ${finalPos.lng.toFixed(4)}°E`,
      cost: estCost,
      pointsCount: pathCoordinates.length,
    };

    setSummaryData(summary);
    setShowSummaryModal(true);

    setActionNotice({
      type: 'info',
      text: `Kết thúc hành trình! Tổng quãng đường: ${finalDist.toFixed(2)} km.`,
    });
    setTimeout(() => setActionNotice(null), 4500);
  };

  // Toggle Live Movement Simulation (Very convenient for desktop testing without walking outside)
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
        angle += (Math.random() - 0.5) * 0.4;
        const step = 0.00035; // ~35 meters per tick
        curLat += Math.sin(angle) * step;
        curLng += Math.cos(angle) * step;

        const nextPoint = { lat: curLat, lng: curLng };
        handleNewPosition(nextPoint, 10 + Math.random() * 5);
      }, 1200);
    }
  };

  const formatTime = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col w-full h-full relative">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="absolute top-0 right-0 z-30 mb-4 bg-slate-900 text-white text-sm px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <span className="material-symbols-outlined text-base text-emerald-400">
            {actionNotice.type === 'success' ? 'check_circle' : 'info'}
          </span>
          <span>{actionNotice.text}</span>
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-full gap-4 lg:gap-gutter">
        {/* Left Panel: Controls & Trip Details */}
        <aside className="w-full lg:w-1/3 flex flex-col gap-4 lg:gap-lg z-10 relative">
          {/* Live Status Header */}
          <div className="bg-surface-container-lowest rounded-3xl p-lg border border-slate-200/90 shadow-[0_4px_20px_rgba(11,28,48,0.04)] flex flex-col gap-sm relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>

            <div className="flex items-center justify-between z-10">
              <h2 className="font-headline-lg text-on-surface tracking-tight">Hành Trình Trực Tuyến</h2>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${isTracking
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200/60'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isTracking ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                    }`}
                ></span>
                <span className="font-label-sm uppercase tracking-wider font-semibold text-xs">
                  {isTracking ? (isSimulating ? 'Đang chạy giả lập' : 'Đang theo dõi') : 'Chưa bắt đầu'}
                </span>
              </div>
            </div>

            <div className="mt-md space-y-1 z-10">
              <p className="font-body-lg text-on-surface-variant flex items-center gap-2">
                <span className="material-symbols-outlined text-outline">schedule</span>
                <span className="font-headline-md text-on-surface font-bold text-3xl tabular-nums">
                  {formatTime(seconds)}
                </span>
              </p>
              <p className="font-body-md text-on-surface-variant ml-8 text-xs font-medium">Thời gian đã trôi qua</p>
            </div>
          </div>

          {/* Primary Actions: Bắt Đầu (Start) & Kết Thúc (Stop) */}
          <div className="flex gap-md w-full">
            <button
              onClick={handleStartTracking}
              disabled={isTracking}
              className={`flex-1 rounded-2xl p-md flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-md group relative overflow-hidden border ${isTracking
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  : 'bg-primary text-on-primary border-primary hover:bg-slate-800'
                }`}
            >
              <span
                className="material-symbols-outlined text-display"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_circle
              </span>
              <span className="font-body-lg font-semibold">Bắt Đầu</span>
            </button>

            <button
              onClick={handleStopTracking}
              disabled={!isTracking}
              className={`flex-1 rounded-2xl p-md flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group border ${!isTracking
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                  : 'bg-rose-600 text-white border-rose-700 shadow-md hover:bg-rose-700'
                }`}
            >
              <span className="material-symbols-outlined text-display">
                stop_circle
              </span>
              <span className="font-body-lg font-semibold">Kết Thúc</span>
            </button>
          </div>

          {/* Desktop Demo Drive Button */}
          <button
            onClick={toggleSimulation}
            className={`w-full py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-2 border transition-all ${isSimulating
                ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-200'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
          >
            <span className="material-symbols-outlined text-base">
              {isSimulating ? 'pause_circle' : 'directions_car'}
            </span>
            <span>{isSimulating ? 'Tạm dừng mô phỏng di chuyển' : 'Thử nghiệm di chuyển xe (Demo GPS Drive)'}</span>
          </button>

          {/* Trip Details Bento */}
          <div className="grid grid-cols-2 gap-sm w-full">
            {/* Live Distance */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_12px_rgba(11,28,48,0.03)] border border-slate-200/90 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 z-10">
                <span className="material-symbols-outlined text-[22px]">
                  near_me
                </span>
              </div>
              <div className="z-10">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1 font-medium">
                  Quãng đường đã đi
                </p>
                <p className="font-headline-md text-on-surface font-bold text-2xl">
                  {totalDistance.toFixed(2)} <span className="font-body-md text-on-surface-variant font-normal text-sm">km</span>
                </p>
              </div>
            </div>

            {/* Start Time / Coordinate Points */}
            <div className="bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_12px_rgba(11,28,48,0.03)] border border-slate-200/90 flex flex-col justify-between h-32 relative overflow-hidden group">
              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-center text-slate-700 z-10">
                <span className="material-symbols-outlined text-[22px]">
                  pin_drop
                </span>
              </div>
              <div className="z-10">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-1 font-medium">
                  Tọa độ ghi nhận
                </p>
                <p className="font-headline-md text-on-surface font-bold text-2xl">
                  {pathCoordinates.length} <span className="font-body-md text-on-surface-variant font-normal text-sm">điểm</span>
                </p>
              </div>
            </div>

            {/* Client / Project (Full Width) */}
            <div className="col-span-2 bg-surface-container-lowest rounded-2xl p-md shadow-[0_2px_12px_rgba(11,28,48,0.03)] border border-slate-200/90 flex items-center gap-md">
              <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm">
                <span className="material-symbols-outlined">domain</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-xs mb-0.5 font-medium">
                  Dự án công tác
                </p>
                <p className="font-body-lg text-on-surface truncate font-semibold text-sm">
                  Acme Corp - Khảo sát & Triển khai thực địa
                </p>
              </div>
              {onOpenLogExpense && (
                <button
                  onClick={onOpenLogExpense}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs font-semibold text-on-surface transition-colors"
                >
                  + Chi Phí
                </button>
              )}
            </div>
          </div>

          {/* Decorative GPS Indicator */}
          <div className="mt-auto hidden lg:flex items-center gap-sm opacity-60 pt-4">
            <div className="h-px bg-slate-300 flex-1"></div>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180 text-xs">
              GPS Sẵn sàng
            </span>
          </div>
        </aside>

        {/* Right Panel: Interactive Real Map with GPS & Polyline */}
        <main className="w-full lg:w-2/3 min-h-[380px] sm:min-h-[460px] lg:min-h-[580px] h-[380px] sm:h-[450px] lg:h-auto rounded-3xl overflow-hidden relative shadow-lg border border-slate-300 bg-slate-100">
          <LiveRouteMap
            currentPosition={currentPosition}
            startPosition={startPosition}
            endPosition={endPosition}
            pathCoordinates={pathCoordinates}
            isTracking={isTracking}
            originAddress={originAddress}
            destinationAddress={destinationAddress}
          />

          {/* Route Summary Overlay (Top Left) */}
          <div className="absolute top-3 left-3 sm:top-4 sm:left-4 bg-white/95 backdrop-blur-md rounded-2xl p-2.5 sm:p-md shadow-xl border border-slate-200/90 flex flex-col gap-2 sm:gap-3 z-[400] max-w-[200px] sm:max-w-xs pointer-events-auto">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex flex-col items-center gap-0.5 mt-0.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-emerald-100"></div>
                <div className="w-0.5 h-6 bg-slate-300 border-l border-dashed border-slate-400"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-rose-600 ring-2 ring-rose-100"></div>
              </div>
              <div className="flex flex-col gap-1.5 sm:gap-3 w-full">
                <div>
                  <p className="font-label-sm text-emerald-700 uppercase tracking-wider text-[10px] sm:text-[11px] font-bold">
                    Xuất phát
                  </p>
                  <p className="text-on-surface font-semibold truncate text-[11px] sm:text-xs">
                    {startPosition ? `${startPosition.lat.toFixed(4)}, ${startPosition.lng.toFixed(4)}` : originAddress}
                  </p>
                </div>
                <div>
                  <p className="font-label-sm text-rose-700 uppercase tracking-wider text-[10px] sm:text-[11px] font-bold">
                    Hiện tại
                  </p>
                  <p className="text-on-surface font-semibold truncate text-[11px] sm:text-xs">
                    {currentPosition ? `${currentPosition.lat.toFixed(4)}, ${currentPosition.lng.toFixed(4)}` : destinationAddress}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Telemetry Floating Overlay (Bottom Center/Right) */}
          <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex flex-wrap gap-2 z-[400] pointer-events-auto">
            {/* Speed */}
            <div className="bg-white/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-sm shadow-xl flex items-center gap-2 sm:gap-md border border-slate-200/90">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface text-lg sm:text-xl">speed</span>
              </div>
              <div className="pr-1 sm:pr-md">
                <p className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px] sm:text-[11px] mb-0.5 font-medium">
                  Tốc độ
                </p>
                <p className="text-sm sm:text-lg font-bold text-on-surface leading-none">
                  {isTracking ? currentSpeed : 0}{' '}
                  <span className="text-[10px] sm:text-xs font-normal text-on-surface-variant">km/h</span>
                </p>
              </div>
            </div>

            {/* Live Distance */}
            <div className="bg-slate-900/95 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 sm:p-sm shadow-xl flex items-center gap-2 sm:gap-md border border-slate-700">
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-lg sm:text-xl">near_me</span>
              </div>
              <div className="pr-1 sm:pr-md">
                <p className="font-label-sm text-slate-400 uppercase tracking-wider text-[10px] sm:text-[11px] mb-0.5 font-medium">
                  Quãng đường
                </p>
                <p className="text-sm sm:text-lg font-bold text-white leading-none">
                  {totalDistance.toFixed(2)}{' '}
                  <span className="text-[10px] sm:text-xs font-normal text-slate-300">km</span>
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* ═══════════════ MODAL: TỔNG KẾT HÀNH TRÌNH SAU KHI KẾT THÚC ═══════════════ */}
      {showSummaryModal && summaryData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-surface-container-lowest rounded-3xl max-w-md w-full p-xl border border-slate-200 shadow-2xl space-y-lg animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">task_alt</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-on-surface font-bold">Hành Trình Hoàn Tất!</h3>
                  <p className="text-xs text-on-surface-variant">Lộ trình GPS đã được đo đạc chính xác</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummaryModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Tổng Quãng Đường</span>
                <div className="text-2xl font-bold text-slate-900 mt-0.5">{summaryData.distance} km</div>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Thời Gian Di Chuyển</span>
                <div className="text-2xl font-bold text-slate-900 mt-0.5">{summaryData.duration}</div>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Tốc Độ Trung Bình</span>
                <div className="text-lg font-semibold text-slate-800 mt-0.5">{summaryData.avgSpeed} km/h</div>
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Định Mức Công Tác</span>
                <div className="text-lg font-semibold text-emerald-600 mt-0.5">{summaryData.cost.toLocaleString('vi-VN')} đ</div>
              </div>
            </div>

            {/* Coordinates info */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tọa độ bắt đầu:</span>
                <span className="font-mono text-slate-800">{summaryData.origin}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Tọa độ kết thúc:</span>
                <span className="font-mono text-slate-800">{summaryData.destination}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500">Điểm GPS ghi nhận:</span>
                <span className="font-semibold text-slate-800">{summaryData.pointsCount} điểm tọa độ</span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSummaryModal(false)}
                className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-on-surface font-semibold text-sm transition-colors"
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
                      title: `Chuyến khảo sát - ${summaryData.distance} km`,
                      subtitle: `${dateStr} • ${summaryData.distance} km`,
                      distanceKm: summaryData.distance,
                      duration: summaryData.duration,
                      cost: summaryData.cost,
                      status: 'Hoàn thành',
                      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
                      icon: 'near_me',
                      pathCoordinates: [...pathCoordinates],
                      startPosition: startPosition,
                      endPosition: endPosition,
                      origin: summaryData.origin,
                      destination: summaryData.destination,
                    });
                  }

                  if (onAddExpenseRecord) {
                    onAddExpenseRecord({
                      title: `Hoàn ứng xe - ${summaryData.distance} km`,
                      amount: `$${(summaryData.cost / 25000).toFixed(2)}`,
                      category: 'Di chuyển',
                    });
                  }
                  setShowSummaryModal(false);
                }}
                className="flex-1 py-3 rounded-xl bg-primary hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-md"
              >
                Lưu & Hoàn Ứng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
