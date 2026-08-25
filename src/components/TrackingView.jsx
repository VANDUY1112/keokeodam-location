import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Milestone } from 'lucide-react';
import LiveRouteMap, { MAP_LAYERS } from './LiveRouteMap';
import { formatVND } from '../utils/format';
import { api } from '../services/api.js';
import { GPSKalmanFilter, snapToNearestRoad } from '../utils/geoKalman';
import { generateRandomDestination, fetchOSRMRoute, KinematicRouteSimulator } from '../utils/routeSimulatorEngine';

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
    id: 'LKK-01',
    name: 'Loa Kéo Bass 40 (Công suất 800W)',
    price: 350000,
    icon: 'speaker',
    desc: 'Tiệc gia đình, sinh nhật, thôi nôi (20 - 40 người)',
  },
  {
    id: 'LKK-02',
    name: 'Loa Kéo Đôi Bass 50 Khủng (1500W)',
    price: 500000,
    icon: 'volume_up',
    desc: 'Tiệc cưới, sự kiện ngoài trời, âm thanh uy lực (50 - 100 người)',
  },
  {
    id: 'LKK-03',
    name: 'Loa Kéo Xách Tay Mini (400W)',
    price: 250000,
    icon: 'speaker_phone',
    desc: 'Gọn nhẹ, phòng khách, dã ngoại, hát acoustic',
  },
  {
    id: 'LKK-04',
    name: 'Combo Loa Kéo + Đèn Laser Sân Khấu',
    price: 600000,
    icon: 'surround_sound',
    desc: 'Trọn gói âm thanh ánh sáng tiệc tùng chuyên nghiệp',
  },
];

export default function TrackingView({
  onOpenLogExpense,
  onAddTripRecord,
  onAddExpenseRecord,
  onOpenVietQR,
  setToast,
  onTrackingStateChange
}) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [startPosition, setStartPosition] = useState(null);
  const [endPosition, setEndPosition] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);

  // Rental Order Configuration State
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedSpeaker, setSelectedSpeaker] = useState(SPEAKER_PACKAGES[0]);
  const [ratePerKm, setRatePerKm] = useState(15000); // 15,000đ/km ship cước

  const [seconds, setSeconds] = useState(0);
  const [totalDistance, setTotalDistance] = useState(0); // in km
  const [currentSpeed, setCurrentSpeed] = useState(0); // in km/h
  const [isSimulating, setIsSimulating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState(null); // in meters

  const [originAddress, setOriginAddress] = useState('Đang lấy vị trí GPS...');
  const [destinationAddress, setDestinationAddress] = useState('Chưa bắt đầu');
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [selectedLayer, setSelectedLayer] = useState('googleHybrid');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [isMapClosing, setIsMapClosing] = useState(false);

  const handleCloseFullscreenMap = () => {
    setIsMapClosing(true);
    setTimeout(() => {
      setIsMapExpanded(false);
      setIsMapClosing(false);
    }, 280);
  };

  // 🚀 Smart Route Simulator State
  const [simStatus, setSimStatus] = useState('idle'); // 'idle' | 'running' | 'completed'
  const [simMultiplier, setSimMultiplier] = useState(2); // 1x, 2x, 4x, 8x
  const [isSimPaused, setIsSimPaused] = useState(false);
  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [simStepInstruction, setSimStepInstruction] = useState('');
  const [simTelemetry, setSimTelemetry] = useState({
    speed: 0,
    bearing: 0,
    compass: 'Bắc',
    traveledMeters: 0,
    remainingMeters: 0,
    progressRatio: 0
  });

  const simulatorRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isMapExpanded && !isMapClosing) {
        handleCloseFullscreenMap();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMapExpanded, isMapClosing]);

  // Cleanup simulator on unmount
  useEffect(() => {
    return () => {
      if (simulatorRef.current) {
        simulatorRef.current.stop();
      }
    };
  }, []);

  // Backend speakers state
  const [apiSpeakers, setApiSpeakers] = useState([]);

  const watchIdRef = useRef(null);
  const simIntervalRef = useRef(null);
  const lastPosRef = useRef(null);
  const kalmanFilterRef = useRef(new GPSKalmanFilter(2.0, 3.5));
  const trackingStartTimeRef = useRef(null);

  // Fetch speakers from backend API on mount
  useEffect(() => {
    const fetchSpeakers = async () => {
      try {
        const res = await api.getSpeakers();
        if (res?.data && Array.isArray(res.data)) {
          setApiSpeakers(res.data);
        }
      } catch (err) {
        console.warn('Speakers API offline, using local data:', err.message);
      }
    };
    fetchSpeakers();
  }, []);

  // Initialize with browser GPS location on load (100% High Accuracy Satellite Query)
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const rawCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const smoothedCoords = kalmanFilterRef.current.filter(rawCoords.lat, rawCoords.lng, pos.coords.accuracy || 3);
          setCurrentPosition(smoothedCoords);
          setGpsAccuracy(Math.round(pos.coords.accuracy || 3));
          setOriginAddress(`${smoothedCoords.lat.toFixed(5)}°N, ${smoothedCoords.lng.toFixed(5)}°E`);
        },
        () => {
          // Fallback saved or default center
          const savedLat = localStorage.getItem('kko_warehouse_lat');
          const savedLng = localStorage.getItem('kko_warehouse_lng');
          const fallback = savedLat && savedLng
            ? { lat: parseFloat(savedLat), lng: parseFloat(savedLng) }
            : { lat: 10.7769, lng: 106.7009 };
          setCurrentPosition(fallback);
          setOriginAddress('Vị trí mặc định (Nhấp bản đồ để chỉnh)');
        },
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    }
  }, []);

  // Manual fine-tune point selection by clicking on the map
  const handleManualPositionSelect = (newCoords) => {
    if (!isTracking) {
      kalmanFilterRef.current.reset();
      setCurrentPosition(newCoords);
      setStartPosition(newCoords);
      localStorage.setItem('kko_warehouse_lat', String(newCoords.lat));
      localStorage.setItem('kko_warehouse_lng', String(newCoords.lng));
      setOriginAddress(`${newCoords.lat.toFixed(5)}°N, ${newCoords.lng.toFixed(5)}°E`);
      if (setToast) {
        setToast({
          title: 'Đã Chọn Vị Trí Chuẩn',
          desc: `Tọa độ: ${newCoords.lat.toFixed(5)}, ${newCoords.lng.toFixed(5)} (Chính xác từng mét).`,
          type: 'success'
        });
      }
    }
  };

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

  // Sync tracking state to Dynamic Island in parent App
  useEffect(() => {
    if (onTrackingStateChange) {
      onTrackingStateChange({
        isTracking,
        seconds,
        distanceKm: totalDistance,
        speedKmh: currentSpeed,
        customerName,
        speakerName: selectedSpeaker?.name || 'Loa Kéo'
      });
    }
  }, [isTracking, seconds, totalDistance, currentSpeed, customerName, selectedSpeaker, onTrackingStateChange]);

  // Real-time Average Speed (km/h) - accurately 0.0 when standing still
  const currentAvgSpeed =
    isTracking && seconds > 2 && totalDistance > 0.01
      ? ((totalDistance / (seconds / 3600))).toFixed(1)
      : isTracking && currentSpeed > 0
        ? Number(currentSpeed).toFixed(1)
        : '0.0';

  // Real-time Shipping fee (VNĐ)
  const currentShippingCost = Math.round((totalDistance > 0 ? totalDistance : 0) * ratePerKm);
  const currentTotalCollect = (selectedSpeaker?.price || 350000) + currentShippingCost;

  // Handler: Handle real GPS movement update with 2D Kalman Filter & Anti-drift
  const handleNewPosition = (rawCoords, speedFromGps = null, accuracy = 5) => {
    // 🧠 Apply 2D Kalman Filter to eliminate noise & reflection
    const newCoords = kalmanFilterRef.current.filter(rawCoords.lat, rawCoords.lng, accuracy, Date.now());
    setCurrentPosition(newCoords);

    setPathCoordinates((prev) => {
      if (prev.length === 0) {
        setStartPosition(newCoords);
        return [newCoords];
      }

      const last = prev[prev.length - 1];
      const distDelta = calculateDistance(last.lat, last.lng, newCoords.lat, newCoords.lng);

      // 🛡️ ANTI-TELEPORT FILTER: If distance jumps > 2.0 km in a single update (e.g. from default HCM fallback to real user GPS in Phú Yên/Hà Nội...)
      // This is an initial GPS fix jump -> Reset starting position to real location instead of adding 700+ km!
      if (distDelta > 2.0) {
        console.log(`[GPS Fix] Detected initial coordinate jump (${distDelta.toFixed(1)} km). Resetting start position to real GPS.`);
        setStartPosition(newCoords);
        setTotalDistance(0);
        setCurrentSpeed(0);
        setOriginAddress(`${newCoords.lat.toFixed(4)}°N, ${newCoords.lng.toFixed(4)}°E`);
        return [newCoords];
      }

      // Only count movement if displacement is > 10 meters (0.010 km) to eliminate GPS drift/jitter when standing still
      if (distDelta >= 0.010) {
        setTotalDistance((d) => +(d + distDelta).toFixed(3));

        if (speedFromGps && speedFromGps > 0.8 && speedFromGps < 35) {
          setCurrentSpeed(Math.round(speedFromGps * 3.6)); // m/s to km/h from real hardware GPS
        } else {
          // Speed calculated from real movement delta (km / h), capped at realistic motorbike speed (70 km/h)
          const estimatedKmh = Math.round(distDelta * 1200);
          setCurrentSpeed(Math.min(70, Math.max(0, estimatedKmh)));
        }
        return [...prev, newCoords];
      } else {
        // Standing still or minimal drift: Speed is strictly 0 km/h
        setCurrentSpeed(0);
        return prev;
      }
    });

    lastPosRef.current = newCoords;

    // Send GPS ping to backend (fire-and-forget)
    if (selectedSpeaker) {
      const speakerId = selectedSpeaker.id || (apiSpeakers.length > 0 ? apiSpeakers[0].id : 'LKK-01');
      api.pingGps({
        speakerId,
        lat: newCoords.lat,
        lng: newCoords.lng,
        speedKmh: currentSpeed,
        heading: 0,
        batteryPercent: 85
      }).catch(() => { });
    }
  };

  // Start / Check-in Route
  const handleStartTracking = () => {
    const startCoords = currentPosition || { lat: 10.7769, lng: 106.7009 };
    kalmanFilterRef.current.reset();
    trackingStartTimeRef.current = new Date();
    setStartPosition(startCoords);
    setEndPosition(null);
    setPathCoordinates([startCoords]);
    setTotalDistance(0);
    setSeconds(0);
    setCurrentSpeed(0);
    setIsTracking(true);
    setDestinationAddress(deliveryAddress ? `Đang di chuyển giao loa đến: ${deliveryAddress}` : 'Đang di chuyển giao loa...');

    if (setToast) {
      const targetName = customerName ? (customerName.split(' - ')[0] || customerName) : 'khách hàng';
      setToast({
        title: 'Đang bắt đầu',
        desc: `Bắt đầu ghi nhận lộ trình GPS giao loa cho ${targetName}.`,
        type: 'info'
      });
    }

    // Start real GPS watch if available (100% High Accuracy Satellite Lock)
    if (navigator.geolocation) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          const acc = Math.round(pos.coords.accuracy || 3);
          setGpsAccuracy(acc);
          handleNewPosition(coords, pos.coords.speed, acc);
        },
        (err) => console.log('GPS watch error:', err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
      );
    }
  };

  const [showLocationInputModal, setShowLocationInputModal] = useState(false);
  const [isClosingLocationModal, setIsClosingLocationModal] = useState(false);
  const [locationNote, setLocationNote] = useState('');
  const [pendingTripData, setPendingTripData] = useState(null);

  // Close modal with exit animation then save
  const handleCloseAndSave = (customLocation = '') => {
    setIsClosingLocationModal(true);
    setTimeout(() => {
      saveCompletedTrip(customLocation);
      setIsClosingLocationModal(false);
    }, 200);
  };

  // Stop / Check-out Route -> Prompt for location note
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

    // Calculate final summary from 100% real GPS tracking
    const finalDist = Number(totalDistance.toFixed(2));
    const calculatedAvgSpeed =
      seconds > 0 && finalDist > 0 ? (finalDist / (seconds / 3600)).toFixed(1) : '0';
    const finalAvgSpeed = parseFloat(calculatedAvgSpeed) || 0;
    const shippingFee = Math.round(finalDist * ratePerKm);
    const rentalFee = selectedSpeaker?.price || 350000;
    const totalCollectFromCustomer = rentalFee + shippingFee;

    // Record precise start and end times
    const now = new Date();
    const startTimeObj = trackingStartTimeRef.current || new Date(now.getTime() - (seconds || 60) * 1000);
    const startTimeStr = `${String(startTimeObj.getHours()).padStart(2, '0')}:${String(startTimeObj.getMinutes()).padStart(2, '0')}:${String(startTimeObj.getSeconds()).padStart(2, '0')}`;
    const endTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    setPendingTripData({
      finalDist,
      seconds,
      finalAvgSpeed,
      shippingFee,
      rentalFee,
      totalCollectFromCustomer,
      finalPos,
      pathCoordinates: [...pathCoordinates],
      startPosition,
      startTime: startTimeStr,
      endTime: endTimeStr,
    });

    setLocationNote('');
    setShowLocationInputModal(true);
  };

  // Save final completed trip with custom location note
  const saveCompletedTrip = (customLocation = '') => {
    const data = pendingTripData || {};
    const finalDist = data.finalDist || 0.85;
    const totalCollectFromCustomer = data.totalCollectFromCustomer || 350000;
    const finalPos = data.finalPos || { lat: 10.7769, lng: 106.7009 };
    const locationDisplay = customLocation ? customLocation : (deliveryAddress || 'Điểm giao khách hàng');

    // 🎯 Ưu tiên tên vị trí/quán do shipper vừa nhập làm tên hiển thị chính
    const primaryDisplayName = customLocation || customerName || 'Khách thuê';

    const now = new Date();
    const dateStr = `${now.getDate()} Th${now.getMonth() + 1}`;

    if (onAddTripRecord) {
      const tripTitle = customLocation
        ? `Vị trí: ${customLocation}`
        : customerName
          ? `Giao Loa: ${customerName}`
          : 'Chuyến giao loa';

      onAddTripRecord({
        id: Date.now(),
        title: tripTitle,
        subtitle: `${dateStr} • ${finalDist.toFixed(2)} km • ${selectedSpeaker?.name || 'Loa Kéo'}`,
        distanceKm: finalDist.toFixed(2),
        duration: formatTime(data.seconds > 0 ? data.seconds : 180),
        cost: totalCollectFromCustomer,
        speakerName: selectedSpeaker?.name || 'Loa Kéo',
        customerName: primaryDisplayName,
        status: 'Hoàn thành',
        statusBadge: 'bg-slate-900 text-white',
        icon: 'speaker',
        pathCoordinates: data.pathCoordinates || [...pathCoordinates],
        startPosition: data.startPosition || startPosition,
        endPosition: finalPos,
        origin: originAddress,
        destination: locationDisplay,
        startTime: data.startTime,
        endTime: data.endTime,
        avgSpeed: data.finalAvgSpeed > 0 ? `${data.finalAvgSpeed.toFixed(1)} km/h` : '32.0 km/h',
      });
    }

    // Save rental to backend API & Supabase
    const speakerId = selectedSpeaker?.id || (apiSpeakers.length > 0 ? apiSpeakers[0].id : 'LKK-01');
    const coordsToSave = data.pathCoordinates || [...pathCoordinates];
    const startPosToSave = data.startPosition || startPosition || (coordsToSave.length > 0 ? coordsToSave[0] : null);

    api.createRental({
      speakerId,
      customerName: primaryDisplayName,
      customerPhone: customerName && customerName.includes(' - ') ? (customerName.split(' - ')[1] || '0908123456') : '0908123456',
      address: locationDisplay || 'Tuy Hòa, Phú Yên',
      startLat: startPosToSave ? startPosToSave.lat : null,
      startLng: startPosToSave ? startPosToSave.lng : null,
      destLat: finalPos ? finalPos.lat : null,
      destLng: finalPos ? finalPos.lng : null,
      pathCoordinates: coordsToSave || [],
      durationHours: Math.max(1, Math.round((data.seconds || 0) / 3600)),
      rentPrice: Math.round(Number(data.rentalFee) || 350000),
      shippingFee: Math.round(Number(data.shippingFee) || 0),
      totalAmount: Math.round(Number(totalCollectFromCustomer) || 350000),
      depositAmount: 500000,
      depositStatus: 'Đã giữ cọc',
      status: 'completed',
      note: customLocation ? `Vị trí: ${customLocation}` : `GPS: ${finalDist.toFixed(2)}km`
    }).catch((err) => console.warn('Rental save to API:', err.message));

    setShowLocationInputModal(false);

    if (setToast) {
      setToast({
        title: 'Hoàn thành',
        desc: customLocation ? `Đã lưu đơn giao tại: ${customLocation}` : 'Đã hoàn tất chuyến giao và lưu đơn vào Lịch Sử.',
        type: 'success'
      });
    }
  };

  // 🚀 Start Real-Road High-FPS Kinematic Simulation
  const handleStartSmartSimulation = async () => {
    if (simulatorRef.current) {
      simulatorRef.current.stop();
      simulatorRef.current = null;
    }

    setIsRouteLoading(true);
    setSimStatus('running');

    // Get current GPS position (use currentPosition if already acquired)
    let origin = currentPosition && typeof currentPosition.lat === 'number'
      ? { lat: currentPosition.lat, lng: currentPosition.lng }
      : null;

    if (!origin) {
      try {
        const pos = await new Promise((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true, timeout: 10000 })
        );
        origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      } catch {
        // Fallback to Tuy Hoa center if GPS fails
        origin = { lat: 13.0882, lng: 109.3105 };
      }
    }

    // Always generate a random new destination 1km - 2km away from origin
    const destination = generateRandomDestination(origin);

    // Fetch Real Road Geometry from OSRM
    const routeData = await fetchOSRMRoute(origin, destination);
    setIsRouteLoading(false);

    if (!routeData?.coordinates || routeData.coordinates.length < 2) {
      setSimStatus('idle');
      if (setToast) {
        setToast({ title: 'Lỗi lộ trình', type: 'error' });
      }
      return;
    }

    // Reset tracking state
    setPathCoordinates([routeData.coordinates[0]]);
    setCurrentPosition(routeData.coordinates[0]);
    setStartPosition(routeData.coordinates[0]);
    setEndPosition(routeData.coordinates[routeData.coordinates.length - 1]);
    setOriginAddress('Vị trí hiện tại');
    setDestinationAddress('Điểm giao');
    setTotalDistance(0);
    setSeconds(0);
    setIsTracking(true);
    setIsSimulating(true);
    setIsSimPaused(false);
    setSimStepInstruction('Đang mô phỏng lộ trình từ vị trí hiện tại');

    // 2. Initialize Kinematic 60FPS Simulator
    const sim = new KinematicRouteSimulator({
      path: routeData.coordinates,
      speedMultiplier: 1,
      baseSpeedKmh: 40,
      onPositionUpdate: (telemetry) => {
        setCurrentPosition(telemetry.coords);
        setPathCoordinates((prev) => {
          const last = prev[prev.length - 1];
          if (!last || calculateDistance(last.lat, last.lng, telemetry.coords.lat, telemetry.coords.lng) > 0.002) {
            return [...prev, telemetry.coords];
          }
          return prev;
        });
        setTotalDistance(telemetry.traveledMeters / 1000);
        setCurrentSpeed(telemetry.speed);
        setSimTelemetry(telemetry);
      },
      onComplete: () => {
        setIsSimulating(false);
        setIsSimPaused(false);
        setSimStatus('completed');
        if (setToast) {
          setToast({
            title: '🎉 Đã đến điểm giao!',
            desc: 'Đã hoàn thành mô phỏng lộ trình.',
            type: 'success'
          });
        }
      }
    });

    simulatorRef.current = sim;
    sim.start();
  };

  const handleStopSimulation = () => {
    if (simulatorRef.current) {
      simulatorRef.current.stop();
      simulatorRef.current = null;
    }
    setIsSimulating(false);
    setIsSimPaused(false);
    setSimStatus('idle');
    setIsTracking(false);
    setCurrentSpeed(0);
    if (setToast) {
      setToast({
        title: 'Đã ngừng',
        desc: 'Đã dừng chuyến mô phỏng.',
        type: 'info'
      });
    }
  };

  const handleSimulationButtonClick = () => {
    if (simStatus === 'completed') {
      // Reset back to idle so user can run a new simulation anytime
      setSimStatus('idle');
      setIsTracking(false);
      setIsSimulating(false);
      return;
    }
    handleStartSmartSimulation();
  };

  const handlePauseResumeSimulation = () => {
    if (!simulatorRef.current) return;
    if (isSimPaused) {
      simulatorRef.current.resume();
      setIsSimPaused(false);
    } else {
      simulatorRef.current.pause();
      setIsSimPaused(true);
      setCurrentSpeed(0);
    }
  };

  const handleChangeSimSpeed = (multiplier) => {
    setSimMultiplier(multiplier);
    if (simulatorRef.current) {
      simulatorRef.current.setSpeedMultiplier(multiplier);
    }
  };

  const formatTime = (totalSec) => {
    const h = String(Math.floor(totalSec / 3600)).padStart(2, '0');
    const m = String(Math.floor((totalSec % 3600) / 60)).padStart(2, '0');
    const s = String(totalSec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 animate-fade-in pb-12">


      {/* ══════════ MAIN 2-COLUMN LAYOUT ══════════ */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ══════════ LEFT PANEL: CONTROL COCKPIT ══════════ */}
        <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-5">
          {/* Status & Live Timer Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] flex flex-col gap-4 relative overflow-hidden group">
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>

            <div className="flex items-center justify-between z-10">
              <h2 className="text-xl lg:text-2xl font-black text-on-surface tracking-tight">Giao loa trực tuyến</h2>
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
                  <span className="text-slate-900 font-bold text-sm lg:text-base">Tốc độ hiện tại</span>
                  <span className="material-symbols-outlined text-xl text-slate-500">speed</span>
                </div>
                <div className="mt-1.5 flex items-baseline gap-1">
                  <span className="text-2xl lg:text-3xl font-black text-slate-900 tabular-nums">
                    {isSimulating ? simTelemetry.speed : currentAvgSpeed}
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
              disabled={isTracking || isSimulating}
              className={`flex-1 rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-md group relative overflow-hidden border ${isTracking || isSimulating
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800'
                }`}
            >
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                play_circle
              </span>
              <span className="text-base lg:text-lg font-bold">Bắt đầu</span>
            </button>

            <button
              onClick={handleStopTracking}
              disabled={!isTracking || isSimulating}
              className={`flex-1 rounded-2xl p-4 lg:p-5 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group border ${!isTracking || isSimulating
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-60'
                : 'bg-rose-600 text-white border-rose-700 shadow-lg hover:bg-rose-700'
                }`}
            >
              <span className="material-symbols-outlined text-4xl">
                stop_circle
              </span>
              <span className="text-base lg:text-lg font-bold">Kết thúc</span>
            </button>
          </div>

          {/* ══════════ 🚀 SIMULATION BUTTON WITH DYNAMIC ROTATING / FINISHED STATES ══════════ */}
          {simStatus === 'running' || isRouteLoading || isSimulating ? (
            <div className="flex items-center gap-3 w-full">
              <button
                type="button"
                disabled
                className="flex-1 py-3.5 px-4 rounded-2xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md"
              >
                <span className="material-symbols-outlined text-[18px] animate-spin">
                  progress_activity
                </span>
                <span>Đang mô phỏng</span>
              </button>

              <button
                type="button"
                onClick={handleStopSimulation}
                className="py-3.5 px-5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">
                  stop_circle
                </span>
                <span>Ngừng</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={isRouteLoading}
              onClick={handleSimulationButtonClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-75"
            >
              <span className="material-symbols-outlined text-[18px]">
                {simStatus === 'completed' ? 'check_circle' : 'two_wheeler'}
              </span>
              <span>
                {simStatus === 'completed' ? 'Kết thúc' : 'Chạy mô phỏng lộ trình'}
              </span>
            </button>
          )}

          {/* Real-time Distance Box */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-slate-900 font-bold text-sm lg:text-base">Tổng quãng đường</span>
              <span className="material-symbols-outlined text-xl text-slate-500">route</span>
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-2xl lg:text-3xl font-black text-slate-900 tabular-nums">
                {totalDistance.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-500">km</span>
            </div>
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
                <span>Hoạt động</span>
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
                  className="flex items-center gap-2 h-9 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-all shrink-0 active:scale-95"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-700">satellite_alt</span>
                  <span>{MAP_LAYERS[selectedLayer]?.name || 'Vệ Tinh'}</span>
                  <span className={`material-symbols-outlined text-[16px] text-slate-500 transition-transform duration-200 ${showLayerMenu ? 'rotate-180 text-slate-900' : ''}`}>
                    expand_more
                  </span>
                </button>

                <div
                  className={`absolute right-0 top-full mt-1.5 w-48 sm:w-52 bg-white border border-slate-200 rounded-2xl shadow-2xl p-1.5 space-y-1 z-50 transition-all duration-200 ease-out origin-top-right ${showLayerMenu
                    ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto visible'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none invisible'
                    }`}
                >
                  {Object.values(MAP_LAYERS).map((layer) => {
                    const isSelected = layer.id === selectedLayer;
                    return (
                      <button
                        key={layer.id}
                        type="button"
                        onClick={() => {
                          setSelectedLayer(layer.id);
                          setTimeout(() => setShowLayerMenu(false), 120);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-left text-xs sm:text-sm transition-all duration-200 ease-out active:scale-95 group ${isSelected
                          ? 'bg-slate-900 text-white font-semibold shadow-xs translate-x-0.5'
                          : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100 hover:translate-x-1 font-medium'
                          }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${isSelected
                              ? 'bg-white scale-100'
                              : 'bg-slate-300 group-hover:bg-slate-600 scale-75 group-hover:scale-100'
                              }`}
                          ></span>
                          <span>{layer.name}</span>
                        </span>
                        <span
                          className={`material-symbols-outlined text-[16px] transition-all duration-200 ${isSelected
                            ? 'text-white scale-100 opacity-100'
                            : 'scale-0 opacity-0 text-transparent'
                            }`}
                        >
                          check
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Nút Mở Rộng Toàn Màn Hình */}
              <button
                type="button"
                onClick={() => setIsMapExpanded(true)}
                className="flex items-center gap-1.5 h-9 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs sm:text-sm font-semibold border border-slate-200 shadow-xs transition-all shrink-0 active:scale-95 cursor-pointer"
                title="Mở rộng bản đồ toàn màn hình"
              >
                <span className="material-symbols-outlined text-[18px] text-slate-700">
                  fullscreen
                </span>
                <span className="hidden sm:inline">Mở rộng</span>
              </button>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 w-full rounded-2xl overflow-hidden border border-slate-200 min-h-[440px] relative bg-slate-100">
            {/* ══════════ SKELETON MAP LOADER ══════════ */}
            {!currentPosition && (
              <div className="absolute inset-0 z-30 bg-slate-100 flex flex-col items-center justify-center p-6 select-none overflow-hidden animate-in fade-in duration-300">
                {/* Simulated Road Grid Pattern */}
                <div className="absolute inset-0 opacity-40 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                {/* Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full animate-shimmer" />

                {/* Simulated Roads Graphic */}
                <svg className="absolute inset-0 w-full h-full opacity-20 stroke-slate-400" fill="none">
                  <path d="M0,120 Q300,180 600,100 T1200,220" strokeWidth="12" strokeDasharray="8 8" />
                  <path d="M150,0 Q200,300 250,600" strokeWidth="8" />
                  <path d="M650,0 Q550,350 700,700" strokeWidth="10" />
                </svg>

                {/* Center Radar & Shipper Bike Indicator */}
                <div className="relative z-10 flex flex-col items-center gap-4 text-center">
                  <div className="relative flex items-center justify-center">
                    <div className="absolute w-28 h-28 rounded-full bg-cyan-400/20 animate-ping" />
                    <div className="absolute w-20 h-20 rounded-full bg-slate-300/60 animate-pulse" />
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xl flex items-center justify-center p-2.5 z-10">
                      <img src="/motorcycle.png" alt="Locating..." className="w-full h-full object-contain animate-bounce" />
                    </div>
                  </div>

                  <div className="space-y-1.5 z-10 max-w-xs">
                    <div className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                        Đang dò tìm vị trí GPS của bạn...
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                      Kết nối vệ tinh định vị để hiển thị bản đồ trực tiếp
                    </p>
                  </div>

                  {/* Shimmer placeholders */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="h-2 w-16 bg-slate-300/70 rounded-full animate-pulse" />
                    <div className="h-2 w-28 bg-slate-300/90 rounded-full animate-pulse" />
                    <div className="h-2 w-12 bg-slate-300/70 rounded-full animate-pulse" />
                  </div>
                </div>
              </div>
            )}

            <LiveRouteMap
              currentPosition={currentPosition}
              startPosition={startPosition}
              endPosition={endPosition}
              pathCoordinates={pathCoordinates}
              isTracking={isTracking}
              selectedLayer={selectedLayer}
              recenterTrigger={recenterTrigger}
              showInternalControls={false}
              gpsAccuracy={gpsAccuracy}
              onSelectPosition={handleManualPositionSelect}
            />
          </div>
        </section>
      </div>

      {/* ══════════ MODAL: NHẬP VỊ TRÍ ĐIỂM GIAO (PORTAL TO BODY) ══════════ */}
      {showLocationInputModal &&
        createPortal(
          <div
            className={`fixed inset-0 z-[99999] w-screen h-screen flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs transition-all ${isClosingLocationModal
              ? 'animate-backdrop-close pointer-events-none'
              : 'animate-in fade-in duration-200'
              }`}
          >
            <div
              className={`bg-white rounded-3xl p-6 sm:p-7 max-w-sm sm:max-w-md w-full border border-slate-200 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] space-y-4 relative z-10 ${isClosingLocationModal ? 'animate-modal-close' : 'animate-modal-pop'
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">pin_drop</span>
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    Giao ở đâu?
                  </h3>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleCloseAndSave(locationNote.trim());
                }}
                className="space-y-4 pt-1"
              >
                <div>
                  <input
                    type="text"
                    autoFocus
                    placeholder="Nhập vị trí"
                    value={locationNote}
                    onChange={(e) => setLocationNote(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-slate-900 shadow-inner"
                  />
                </div>

                <div className="flex items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCloseAndSave('')}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors cursor-pointer active:scale-95"
                  >
                    Bỏ qua
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    <span>Lưu</span>
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* ══════════ FULLSCREEN ROUTE MAP MODAL (PORTAL TO BODY) ══════════ */}
      {isMapExpanded &&
        createPortal(
          <div
            className={`fixed inset-0 z-[999999] bg-slate-950/95 backdrop-blur-md flex items-center justify-center transition-all duration-300 ${isMapClosing ? 'opacity-0' : 'opacity-100 animate-in fade-in'
              }`}
          >
            {/* Floating Close Button in Top Right */}
            <button
              type="button"
              onClick={handleCloseFullscreenMap}
              className={`absolute top-4 right-4 z-[99999] w-12 h-12 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white shadow-[0_8px_30px_rgba(0,0,0,0.5)] backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 active:scale-90 border border-white/20 hover:border-white/40 ${isMapClosing
                ? 'scale-75 opacity-0'
                : 'scale-100 opacity-100 animate-in zoom-in-75 slide-in-from-top-2 duration-300'
                }`}
              title="Đóng toàn màn hình (Esc)"
            >
              <span className="material-symbols-outlined text-[24px]">close</span>
            </button>

            {/* Edge-to-Edge Fullscreen Live Route Map */}
            <div
              className={`w-full h-full relative bg-slate-900 overflow-hidden transition-all duration-300 ease-out transform ${isMapClosing
                ? 'scale-90 opacity-0 rounded-[40px]'
                : 'scale-100 opacity-100 rounded-none animate-in zoom-in-95 duration-300'
                }`}
            >
              <LiveRouteMap
                currentPosition={currentPosition}
                startPosition={startPosition}
                endPosition={endPosition}
                pathCoordinates={pathCoordinates}
                isTracking={isTracking}
                selectedLayer={selectedLayer}
                recenterTrigger={recenterTrigger}
                showInternalControls={false}
                gpsAccuracy={gpsAccuracy}
                onSelectPosition={handleManualPositionSelect}
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
