import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { generateHotspotsAround } from './DashboardMiniMap';
import { api } from '../services/api.js';
import { formatVND } from '../utils/format';

// Detailed profile configuration for each zone (Clean Monochrome Slate Style)
const ZONE_PROFILE_CONFIG = {
  'hs-1': {
    rankBadge: 'Top 1 Vùng Nóng Nhất',
    description: 'Tập trung nhiều trung tâm tiệc cưới, nhà hàng lớn và trung tâm hội nghị. Khách thường thuê dàn loa công suất lớn phục vụ liên hoan, tân gia, đám cưới vào chiều tối cuối tuần.',
    avgPrice: '550.000 ₫ - 850.000 ₫ / ca',
    deliveryTime: '8 - 14 phút',
    speakerPreferences: [
      { name: 'Loa Đôi Bass 50 Khủng (1500W)', percent: 65, count: '12 ca' },
      { name: 'Loa Kéo Bass 40 (800W)', percent: 25, count: '4 ca' },
      { name: 'Dàn Karaoke Di Động Cao Cấp', percent: 10, count: '2 ca' },
    ],
    recentOrders: [
      {
        id: 'ord-101',
        customer: 'Nhà Hàng Tiệc Cưới Hương Cau',
        phone: '0918.882.112',
        address: '142 Đường Số 8, Phường 1',
        speaker: 'Loa Đôi Bass 50 (1500W)',
        time: '18:00 - 22:30 • Hôm nay',
        amount: '850.000 ₫',
        status: 'Đang phục vụ',
      },
      {
        id: 'ord-102',
        customer: 'Anh Minh Trí (Tiệc Tân Gia)',
        phone: '0903.123.456',
        address: 'Hẻm 45 Lý Thường Kiệt',
        speaker: 'Loa Đôi Bass 50 (1500W)',
        time: '17:30 - 21:30 • Hôm qua',
        amount: '750.000 ₫',
        status: 'Đã hoàn thành',
      },
      {
        id: 'ord-103',
        customer: 'Quán Nhậu Lẩu Cua 88',
        phone: '0977.654.321',
        address: '88 Bờ Kè Sông',
        speaker: 'Loa Kéo Bass 40 (800W)',
        time: '19:00 - 23:00 • 2 ngày trước',
        amount: '500.000 ₫',
        status: 'Đã hoàn thành',
      },
    ],
    growthRate: '+24%',
    recommendation: 'Nên ưu tiên chuẩn bị sẵn 2 dàn Loa Đôi Bass 50 sạc đầy pin vào khung 17h00 các ngày Thứ 6, Thứ 7 và Chủ Nhật.',
  },
  'hs-2': {
    rankBadge: 'Top 2 Điểm Hẹn Ẩm Thực',
    description: 'Khu dân cư đông đúc kết hợp chuỗi quán ăn, quán ốc, lẩu nướng vỉa hè. Nhu cầu thuê loa hát giao lưu buổi tối đều đặn các ngày trong tuần.',
    avgPrice: '400.000 ₫ - 550.000 ₫ / ca',
    deliveryTime: '12 - 18 phút',
    speakerPreferences: [
      { name: 'Loa Kéo Bass 40 (800W)', percent: 70, count: '8 ca' },
      { name: 'Loa Kéo Mini Xách Tay', percent: 20, count: '3 ca' },
      { name: 'Loa Đôi Bass 50', percent: 10, count: '1 ca' },
    ],
    recentOrders: [
      {
        id: 'ord-201',
        customer: 'Quán Ốc Đêm 77',
        phone: '0938.999.888',
        address: '23 Phố Ẩm Thực Đêm',
        speaker: 'Loa Kéo Bass 40 (800W)',
        time: '19:30 - 23:30 • Hôm nay',
        amount: '450.000 ₫',
        status: 'Đang thuê',
      },
      {
        id: 'ord-202',
        customer: 'Chị Lan (Họp Lớp Cấp 3)',
        phone: '0912.445.667',
        address: '56 Đường Ẩm Thực',
        speaker: 'Loa Kéo Bass 40 (800W)',
        time: '18:00 - 21:00 • Hôm qua',
        amount: '450.000 ₫',
        status: 'Đã hoàn thành',
      },
    ],
    growthRate: '+15%',
    recommendation: 'Khu vực này ưu tiên loa kéo Bass 40 gọn nhẹ, dễ di chuyển luồn lách qua các hẻm phố ẩm thực.',
  },
  'hs-3': {
    rankBadge: 'Top 3 Sân Vườn Thoáng Mát',
    description: 'Các quán ăn gia đình, quán nhậu sân vườn có không gian mở. Khách chuộng âm thanh trong trẻo, tiếng mic ấm để hát acoustic và nhạc trữ tình.',
    avgPrice: '450.000 ₫ - 600.000 ₫ / ca',
    deliveryTime: '10 - 15 phút',
    speakerPreferences: [
      { name: 'Loa Kéo Bass 40 Chống Hú Tốt', percent: 60, count: '5 ca' },
      { name: 'Loa Đôi Bass 50 Khủng', percent: 30, count: '3 ca' },
      { name: 'Loa Xách Tay Gỗ', percent: 10, count: '1 ca' },
    ],
    recentOrders: [
      {
        id: 'ord-301',
        customer: 'Ẩm Thực Sân Vườn Gió Chiều',
        phone: '0988.334.556',
        address: '102 Đường Ven Hồ',
        speaker: 'Loa Kéo Bass 40',
        time: '17:00 - 21:00 • Hôm nay',
        amount: '500.000 ₫',
        status: 'Đã đặt trước',
      },
      {
        id: 'ord-302',
        customer: 'Quán Nhậu Lộc Vừng',
        phone: '0909.112.233',
        address: '15 Ven Sông',
        speaker: 'Loa Kéo Bass 40',
        time: '18:30 - 22:30 • 3 ngày trước',
        amount: '500.000 ₫',
        status: 'Đã hoàn thành',
      },
    ],
    growthRate: '+10%',
    recommendation: 'Cần kiểm tra kỹ pin micro và chống hú do không gian sân vườn dễ bị dội âm gió.',
  },
  'hs-4': {
    rankBadge: 'Top 4 Tiệc Biệt Thự VIP',
    description: 'Khu dân cư cao cấp, biệt thự sân vườn riêng biệt. Khách hàng sẵn sàng chi trả mức giá cao cho thiết bị đời mới, micro cao cấp và phục vụ tận tâm.',
    avgPrice: '600.000 ₫ - 1.000.000 ₫ / ca',
    deliveryTime: '15 - 22 phút',
    speakerPreferences: [
      { name: 'Loa Đôi Bass 50 VIP + 4 Mic', percent: 75, count: '5 ca' },
      { name: 'Dàn Karaoke Di Động Pro', percent: 25, count: '2 ca' },
    ],
    recentOrders: [
      {
        id: 'ord-401',
        customer: 'Biệt Thự Vườn B2-14 (Tiệc BBQ)',
        phone: '0933.777.999',
        address: 'Lô B2-14 Khu Biệt Thự Đồi',
        speaker: 'Loa Đôi Bass 50 VIP',
        time: '16:00 - 21:00 • Cuối tuần',
        amount: '900.000 ₫',
        status: 'Đã hoàn thành',
      },
    ],
    growthRate: '+8%',
    recommendation: 'Khách hàng phân khúc này yêu cầu ngoại hình loa sạch đẹp, bóng bẩy và micro đầu bọc mới.',
  },
};

// Map Pin icons (Sleek Slate Monochrome)
const userLocationIcon = L.divIcon({
  className: 'custom-map-pin',
  html: `
    <div class="relative flex items-center justify-center">
      <div class="absolute w-12 h-12 rounded-full bg-cyan-400/25 animate-ping"></div>
      <div class="w-10 h-10 rounded-full bg-white/95 backdrop-blur-xs border-2 border-slate-900 shadow-[0_4px_14px_rgba(0,0,0,0.35)] flex items-center justify-center p-1">
        <img src="/motorcycle.png" alt="Shipper" class="w-full h-full object-contain drop-shadow-xs" />
      </div>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function createZonePin(hs, isSelected) {
  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center cursor-pointer transition-transform ${isSelected ? 'scale-105' : ''}">
        <div class="px-3 py-1 rounded-full text-white font-bold text-xs shadow-md flex items-center gap-1 border border-white whitespace-nowrap ${
          isSelected ? 'bg-slate-950 ring-2 ring-slate-900/30' : 'bg-slate-800 hover:bg-slate-900'
        }">
          <span class="material-symbols-outlined text-[13px] text-slate-300">near_me</span>
          <span>${hs.badgeText || `${hs.rentalCount} chuyến`}</span>
        </div>
      </div>
    `,
    iconSize: [85, 28],
    iconAnchor: [42, 14],
  });
}

function MapController({ selectedZone, userCoords, hotspots }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    if (selectedZone) {
      map.flyTo([selectedZone.lat, selectedZone.lng], 15.5, { duration: 0.8 });
    } else if (userCoords) {
      const allPoints = [
        [userCoords.lat, userCoords.lng],
        ...hotspots.map((p) => [p.lat, p.lng]),
      ];
      map.fitBounds(L.latLngBounds(allPoints), { padding: [50, 50], animate: false });
    }
  }, [map, selectedZone, userCoords, hotspots]);
  return null;
}

export default function ZoneDetailsView({
  initialZoneId = 'hs-1',
  onNavigateToTab,
  onOpenVietQR,
}) {
  const [selectedZoneId, setSelectedZoneId] = useState(initialZoneId);
  const [tileMode, setTileMode] = useState('street');

  // Load User GPS
  const [userCoords, setUserCoords] = useState(() => {
    const savedLat = localStorage.getItem('kko_warehouse_lat');
    const savedLng = localStorage.getItem('kko_warehouse_lng');
    return savedLat && savedLng
      ? { lat: parseFloat(savedLat), lng: parseFloat(savedLng) }
      : { lat: 10.7769, lng: 106.7009 };
  });

  const [realOrders, setRealOrders] = useState([]);

  useEffect(() => {
    api.getRentals().then(res => {
      if (res?.data && Array.isArray(res.data)) {
        setRealOrders(res.data.map(r => ({
          id: r.id,
          customer: r.customerName,
          phone: r.customerPhone,
          address: r.address,
          speaker: r.speakerName || 'Loa Kéo',
          time: r.startTime ? `${r.durationHours}h • ${new Date(r.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}` : 'Hôm nay',
          amount: formatVND(r.totalAmount),
          status: r.status === 'active' ? 'Đang phục vụ' : 'Đã hoàn thành'
        })));
      }
    }).catch(() => {});
  }, []);

  const hotspots = generateHotspotsAround(userCoords.lat, userCoords.lng);
  const selectedZone = hotspots.find((h) => h.id === selectedZoneId) || hotspots[0];
  const zoneDetail = {
    ...(ZONE_PROFILE_CONFIG[selectedZone.id] || ZONE_PROFILE_CONFIG['hs-1']),
    recentOrders: realOrders.length > 0 ? realOrders : (ZONE_PROFILE_CONFIG[selectedZone.id] || ZONE_PROFILE_CONFIG['hs-1']).recentOrders
  };

  const tileUrl =
    tileMode === 'satellite'
      ? 'https://mt1.google.com/vt/lyrs=y&hl=vi&gl=VN&x={x}&y={y}&z={z}'
      : 'https://mt1.google.com/vt/lyrs=m&hl=vi&gl=VN&x={x}&y={y}&z={z}';

  const totalRentals = hotspots.reduce((acc, h) => acc + h.rentalCount, 0);
  const totalRevenue = '20.900.000 ₫';

  return (
    <div className="flex flex-col gap-6 lg:gap-8 w-full max-w-[1600px] mx-auto">
      {/* ══════════ 1. HEADER SECTION (MINIMALIST) ══════════ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-lowest p-6 rounded-3xl border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="text-xs text-slate-600 font-bold bg-slate-100 px-2.5 py-1 rounded-xl border border-slate-200">
              📍 Tâm GPS: {userCoords.lat.toFixed(4)}, {userCoords.lng.toFixed(4)}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Chi Tiết Vùng Thuê Loa Trọng Điểm
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Theo dõi mật độ đơn hàng, doanh thu thực tế và dòng loa được chuộng theo từng cung đường quanh bạn
          </p>
        </div>

        {/* Quick Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateToTab && onNavigateToTab('dashboard')}
            className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">dashboard</span>
            <span>Về Tổng Quan</span>
          </button>

          <button
            onClick={() => onNavigateToTab && onNavigateToTab('tracking')}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">two_wheeler</span>
            <span>Giao Loa Ngay</span>
          </button>
        </div>
      </div>

      {/* ══════════ 2. TOP 4 METRIC STATS (CLEAN MONOCHROME) ══════════ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng Chuyến 4 Vùng</span>
            <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{totalRentals}</span>
            <span className="text-xs font-bold text-slate-400 ml-1.5">chuyến</span>
          </div>
          <span className="text-[11.5px] font-bold text-slate-600">
            +18% so với tuần trước
          </span>
        </div>

        {/* Metric 2 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Tổng Doanh Thu Vùng</span>
            <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{totalRevenue}</span>
          </div>
          <span className="text-[11.5px] font-bold text-slate-500">
            Trung bình 520k / chuyến
          </span>
        </div>

        {/* Metric 3 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Vùng Sôi Động Nhất</span>
            <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-base sm:text-lg font-black text-slate-900 truncate block">Nhà Hàng Tiệc Cưới</span>
            <span className="text-xs font-bold text-slate-500">18 chuyến • 8.200.000 ₫</span>
          </div>
          <span className="text-[11.5px] font-bold text-slate-600">
            Chiếm 39% tổng đơn toàn vùng
          </span>
        </div>

        {/* Metric 4 */}
        <div className="bg-surface-container-lowest p-5 rounded-3xl border border-slate-200/90 shadow-[0_2px_16px_rgba(11,28,48,0.03)] flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Loa Được Chuộng Nhất</span>
            <span className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
              <span className="material-symbols-outlined text-[18px]">speaker</span>
            </span>
          </div>
          <div className="my-2">
            <span className="text-base sm:text-lg font-black text-slate-900 truncate block">Loa Đôi Bass 50 Khủng</span>
            <span className="text-xs font-bold text-slate-400">Công suất 1500W</span>
          </div>
          <span className="text-[11.5px] font-bold text-slate-600">
            23/46 ca thuê sử dụng
          </span>
        </div>
      </div>

      {/* ══════════ 3. 4-ZONE SWITCHER BUTTONS (FULL LINE) ══════════ */}
      <div className="flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
          Chọn vùng để xem báo cáo chi tiết:
        </span>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 w-full">
          {hotspots.map((hs, idx) => {
            const isSelected = selectedZoneId === hs.id;
            return (
              <button
                key={hs.id}
                onClick={() => setSelectedZoneId(hs.id)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all text-left flex flex-col justify-between gap-2 active:scale-98 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-md scale-[1.01]'
                    : 'bg-surface-container-lowest text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                    }`}>
                      #{idx + 1}
                    </span>
                    <span className="font-bold text-xs sm:text-sm truncate">
                      {hs.shortName}
                    </span>
                  </div>
                  <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-lg ${isSelected ? 'bg-white/20 text-slate-200' : 'bg-slate-100 text-slate-600'}`}>
                    ~{hs.distance}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100/20">
                  <span className={`font-black ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                    {hs.rentalCount} chuyến
                  </span>
                  <span className={`font-bold ${isSelected ? 'text-slate-200' : 'text-slate-700'}`}>
                    {hs.revenue}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════ 4. MAIN 2-COLUMN SECTION: MAP & ZONE DEEP DIVE ══════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        {/* Left Column: Map (5 Columns) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">map</span>
              Vị Trí Vùng Trên Bản Đồ
            </span>

            <button
              onClick={() => setTileMode(tileMode === 'street' ? 'satellite' : 'street')}
              className="px-2.5 py-1 text-xs font-bold rounded-xl text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">
                {tileMode === 'street' ? 'satellite_alt' : 'map'}
              </span>
              <span>{tileMode === 'street' ? 'Vệ tinh' : 'Đường'}</span>
            </button>
          </div>

          <div className="w-full h-[360px] sm:h-[420px] rounded-2xl overflow-hidden shadow-inner border border-slate-200/90 relative">
            <MapContainer
              center={[selectedZone.lat, selectedZone.lng]}
              zoom={15}
              zoomControl={false}
              scrollWheelZoom={false}
              attributionControl={false}
              className="w-full h-full z-0"
              style={{ minHeight: '100%', height: '100%', background: '#e2e8f0' }}
            >
              <MapController selectedZone={selectedZone} userCoords={userCoords} hotspots={hotspots} />

              <TileLayer
                url={tileUrl}
                maxZoom={22}
                maxNativeZoom={20}
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
              />

              {/* Connecting line */}
              {userCoords && selectedZone && (
                <Polyline
                  positions={[
                    [userCoords.lat, userCoords.lng],
                    [selectedZone.lat, selectedZone.lng],
                  ]}
                  pathOptions={{
                    color: '#0f172a',
                    weight: 2.5,
                    opacity: 0.7,
                    dashArray: '5, 5',
                  }}
                />
              )}

              {/* User Marker */}
              {userCoords && (
                <Marker position={[userCoords.lat, userCoords.lng]} icon={userLocationIcon}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <p className="font-bold text-slate-900">Tâm GPS (Vị trí của bạn)</p>
                      <p className="text-slate-500 text-[10px]">Xuất phát chở loa</p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* All Zone Markers */}
              {hotspots.map((hs) => {
                const isSelected = selectedZoneId === hs.id;
                return (
                  <React.Fragment key={hs.id}>
                    <Circle
                      center={[hs.lat, hs.lng]}
                      radius={hs.radius}
                      pathOptions={{
                        color: '#334155',
                        fillColor: '#334155',
                        fillOpacity: isSelected ? 0.25 : 0.1,
                        weight: isSelected ? 2 : 1,
                        dashArray: '4, 4',
                      }}
                    />
                    <Marker
                      position={[hs.lat, hs.lng]}
                      icon={createZonePin(hs, isSelected)}
                      eventHandlers={{
                        click: () => setSelectedZoneId(hs.id),
                      }}
                    />
                  </React.Fragment>
                );
              })}
            </MapContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
            <span>Khoảng cách từ tâm: <strong className="text-slate-900">~{selectedZone.distance}</strong> ({selectedZone.direction})</span>
            <span className="text-slate-700 font-bold">Bán kính ~{selectedZone.radius}m</span>
          </div>
        </div>

        {/* Right Column: Zone Profile (7 Columns) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Main Zone Detail Card */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 lg:p-7 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] flex flex-col gap-5">
            {/* Top Zone Identity Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-sm shrink-0">
                  <span className="material-symbols-outlined text-[22px]">location_city</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200">
                      {zoneDetail.rankBadge}
                    </span>
                    <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200/60">
                      {selectedZone.direction}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                    {selectedZone.name}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => onOpenVietQR && onOpenVietQR(500000, `COC LOA - ${selectedZone.shortName.toUpperCase()}`)}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all active:scale-95 flex items-center gap-1.5"
                  title="Tạo mã QR thu tiền cho khu vực này"
                >
                  <span className="material-symbols-outlined text-[16px]">qr_code_2</span>
                  <span>Mã QR Cọc</span>
                </button>

                <button
                  onClick={() => onNavigateToTab && onNavigateToTab('tracking')}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95 flex items-center gap-1.5"
                  title="Mở giao diện theo dõi giao loa"
                >
                  <span className="material-symbols-outlined text-[16px]">two_wheeler</span>
                  <span>Giao Loa Tới Đây</span>
                </button>
              </div>
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed">
              {zoneDetail.description}
            </p>

            {/* 3 Key Operational Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 text-xs font-medium block">Giá thuê trung bình</span>
                <span className="text-slate-900 font-black text-sm mt-0.5 block">{zoneDetail.avgPrice}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 text-xs font-medium block">Thời gian giao từ kho</span>
                <span className="text-slate-900 font-black text-sm mt-0.5 block">{zoneDetail.deliveryTime}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-slate-400 text-xs font-medium block">Khung giờ cao điểm</span>
                <span className="text-slate-900 font-black text-sm mt-0.5 block">{selectedZone.peakHours}</span>
              </div>
            </div>

            {/* Speaker Type Breakdown */}
            <div className="flex flex-col gap-2.5 pt-1">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Dòng loa chuộng nhất tại vùng này:
              </span>
              <div className="space-y-2">
                {zoneDetail.speakerPreferences.map((sp, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-800">{sp.name}</span>
                      <span className="text-slate-500 font-mono">{sp.count} ({sp.percent}%)</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 bg-slate-800"
                        style={{ width: `${sp.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Business Recommendation */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <span className="material-symbols-outlined text-slate-700 text-[20px] shrink-0 mt-0.5">
                tips_and_updates
              </span>
              <div className="text-xs sm:text-sm text-slate-800 leading-snug">
                <strong>Gợi ý kinh doanh:</strong> {zoneDetail.recommendation}
              </div>
            </div>
          </div>

          {/* Recent Orders in This Zone */}
          <div className="bg-surface-container-lowest rounded-3xl p-6 border border-slate-200/90 shadow-[0_4px_24px_rgba(11,28,48,0.04)] flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">history</span>
                Đơn Thuê Gần Nhất Tại Vùng Này
              </h3>
              <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                {zoneDetail.recentOrders.length} đơn
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {zoneDetail.recentOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 font-bold shrink-0 shadow-xs">
                      <span className="material-symbols-outlined text-[18px]">speaker</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900 text-sm truncate">{ord.customer}</span>
                        <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-md border bg-white border-slate-200 text-slate-700">
                          {ord.status}
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 mt-0.5">
                        📞 {ord.phone} • 📍 {ord.address}
                      </span>
                      <span className="text-xs font-medium text-slate-600 mt-0.5">
                        {ord.speaker} • <span className="text-slate-400">{ord.time}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200/60 shrink-0">
                    <span className="text-sm font-bold text-slate-900 font-mono">{ord.amount}</span>
                    <button
                      onClick={() => onNavigateToTab && onNavigateToTab('tracking')}
                      className="text-xs text-slate-600 hover:text-slate-900 font-bold hover:underline flex items-center gap-0.5 mt-0.5"
                    >
                      <span>Xem lộ trình</span>
                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
