import React, { useState, useEffect } from 'react';
import { 
  Speaker, 
  Battery, 
  Mic2, 
  MapPin, 
  Clock, 
  Phone, 
  DollarSign, 
  CheckCircle2, 
  PlusCircle, 
  Route, 
  Calendar,
  AlertCircle,
  Truck,
  Plus,
  Printer,
  Calculator
} from 'lucide-react';

export default function DeviceDetailsView({ 
  speakers, 
  selectedSpeakerId, 
  onSelectSpeaker, 
  onOpenCheckinModal, 
  onOpenAddSpeakerModal,
  onOpenReceiptModal,
  searchTerm 
}) {
  const [now, setNow] = useState(Date.now());

  // Quick price calculator state
  const [calcHours, setCalcHours] = useState(4);
  const [calcDistance, setCalcDistance] = useState(5);

  // Ticker for live rental clock
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredSpeakers = speakers.filter(s => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return s.id.toLowerCase().includes(q) || s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q);
  });

  const selectedSpeaker = speakers.find(s => s.id === selectedSpeakerId) || speakers[0];

  // Calculate live rental timer
  let elapsedFormatted = "0h 00m 00s";
  let elapsedHoursDecimal = 0;
  let liveRentalAmount = 0;

  if (selectedSpeaker?.currentRental) {
    const elapsedMs = now - selectedSpeaker.currentRental.startTimestamp;
    const hrs = Math.floor(elapsedMs / (3600 * 1000));
    const mins = Math.floor((elapsedMs % (3600 * 1000)) / (60 * 1000));
    const secs = Math.floor((elapsedMs % (60 * 1000)) / 1000);
    elapsedFormatted = `${hrs}h ${mins < 10 ? '0' : ''}${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
    
    elapsedHoursDecimal = Math.max(1, +(elapsedMs / (3600 * 1000)).toFixed(2));
    liveRentalAmount = Math.round(elapsedHoursDecimal * selectedSpeaker.hourlyRate) + (selectedSpeaker.currentRental.shippingFee || 0);
  }

  // Quick estimate calculation
  const calcShipFee = calcDistance > 2 ? Math.round((calcDistance - 2) * 5000 + 15000) : 0;
  const calcTotalEstimate = Math.round(calcHours * (selectedSpeaker?.hourlyRate || 80000)) + calcShipFee;

  return (
    <div className="p-6 max-w-[1600px] mx-auto select-none space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-ocean-50 border border-ocean-200 flex items-center justify-center text-ocean-600 shadow-xs">
            <Speaker className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-[20px] font-bold text-slate-800 font-mono">{selectedSpeaker.id}</h1>
              <span className={`text-[11px] font-mono px-2.5 py-0.5 rounded-full font-bold ${
                selectedSpeaker.status === 'renting'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                  : selectedSpeaker.status === 'returning'
                  ? 'bg-slate-100 text-slate-700 border border-slate-200'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              }`}>
                {selectedSpeaker.statusLabel}
              </span>
            </div>
            <p className="text-[13px] text-slate-500 mt-0.5">{selectedSpeaker.name} • Loại: <span className="text-slate-800 font-semibold">{selectedSpeaker.type}</span></p>
          </div>
        </div>

        {/* Quick Check-in Actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={onOpenAddSpeakerModal}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold flex items-center gap-1.5 transition-all border border-slate-200"
          >
            <Plus className="w-4 h-4 text-ocean-600" />
            <span>+ Thêm Loa Mới</span>
          </button>

          {selectedSpeaker.status === 'available' ? (
            <button
              onClick={() => onOpenCheckinModal('delivery', selectedSpeaker.id)}
              className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-[13px] flex items-center gap-2 shadow-sm shadow-ocean-600/20 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Giao Loa Này Đến Khách</span>
            </button>
          ) : (
            <button
              onClick={() => onOpenCheckinModal('return', selectedSpeaker.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] flex items-center gap-2 shadow-sm transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Loa Đã Về Nhà (Thu Tiền)</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Left Speaker List / Right Deep Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Speaker Directory (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200 p-5 rounded-2xl shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h2 className="text-[14px] font-bold text-slate-800 uppercase tracking-wider font-mono">
              Danh Sách Loa ({speakers.length})
            </h2>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
              {speakers.filter(s => s.status === 'available').length} Có Sẵn
            </span>
          </div>

          <div className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
            {filteredSpeakers.map((spk) => {
              const isSelected = spk.id === selectedSpeaker.id;
              const isRenting = spk.status === 'renting';

              return (
                <div
                  key={spk.id}
                  onClick={() => onSelectSpeaker(spk.id)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-ocean-50/70 border-ocean-400 shadow-xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        isRenting ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'
                      }`} />
                      <div>
                        <span className="font-mono text-[14px] font-bold text-slate-800">{spk.id}</span>
                        <div className="text-[12px] text-slate-500 font-medium line-clamp-1">{spk.name}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[13px] font-bold text-ocean-700">{spk.hourlyRate.toLocaleString('vi-VN')}đ/h</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-slate-100 text-[11px]">
                    <div>
                      <span className="text-slate-500">Pin:</span>{' '}
                      <span className="text-slate-800 font-semibold">{spk.battery}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500">Micro:</span>{' '}
                      <span className="text-ocean-700 font-bold">{spk.mics} mic</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-semibold ${isRenting ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {isRenting ? 'Đang thuê' : 'Tại nhà'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep Telemetry & Live Clock (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Hardware Status Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            
            {/* Battery Level */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Ắc Quy / Pin</span>
                <Battery className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="my-2">
                <div className="text-[26px] font-black text-slate-800 font-mono">{selectedSpeaker.battery}%</div>
                <div className="text-[11px] text-slate-500">Hát liên tục ~6-8 tiếng</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full ${selectedSpeaker.battery < 30 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                  style={{ width: `${selectedSpeaker.battery}%` }}
                />
              </div>
            </div>

            {/* Micro kèm theo */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Phụ Kiện Kèm</span>
                <Mic2 className="w-4 h-4 text-ocean-600" />
              </div>
              <div className="my-2">
                <div className="text-[26px] font-black text-ocean-700 font-mono">{selectedSpeaker.mics} Micro</div>
                <div className="text-[11px] text-slate-500">Đầy đủ dây sạc nguồn</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-ocean-600 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Đơn giá thuê */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Đơn Giá Thuê</span>
                <DollarSign className="w-4 h-4 text-ocean-600" />
              </div>
              <div className="my-2">
                <div className="text-[24px] font-black text-ocean-700 font-mono">
                  {selectedSpeaker.hourlyRate.toLocaleString('vi-VN')}
                </div>
                <div className="text-[11px] text-slate-500">VNĐ / mỗi tiếng</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-ocean-600 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            {/* Tổng ca thuê */}
            <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-[11px] font-bold uppercase text-slate-400 font-mono">Tổng Ca Thuê</span>
                <Clock className="w-4 h-4 text-amber-600" />
              </div>
              <div className="my-2">
                <div className="text-[26px] font-black text-slate-800 font-mono">{selectedSpeaker.totalRentalsCount} ca</div>
                <div className="text-[11px] text-ocean-600 font-bold">{(selectedSpeaker.totalRevenue / 1000000).toFixed(1)} triệu đ</div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

          </div>

          {/* RENTAL ACTIVE DETAILS & LIVE CLOCK */}
          {selectedSpeaker.currentRental ? (
            <div className="bg-white border border-amber-300 rounded-2xl p-6 space-y-5 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                    <h3 className="text-[17px] font-bold text-slate-800">Ca Thuê Đang Hoạt Động (Trực Tiếp)</h3>
                  </div>
                  <p className="text-[12px] text-slate-500 mt-0.5">Khách đã nhận loa và đang tính tiền theo giờ</p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedSpeaker.currentRental.customerPhone}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[12px] font-bold flex items-center gap-1.5 transition-all border border-slate-200"
                  >
                    <Phone className="w-3.5 h-3.5 text-ocean-600" />
                    <span>Gọi Khách</span>
                  </a>

                  <button
                    onClick={() => {
                      onOpenReceiptModal({
                        id: 'HD-' + selectedSpeaker.id + '-' + Date.now().toString().slice(-4),
                        customerName: selectedSpeaker.currentRental.customerName,
                        customerPhone: selectedSpeaker.currentRental.customerPhone,
                        address: selectedSpeaker.currentRental.address,
                        speakerId: selectedSpeaker.id,
                        speakerName: selectedSpeaker.name,
                        rentHours: elapsedHoursDecimal,
                        hourlyRate: selectedSpeaker.hourlyRate,
                        distanceKm: selectedSpeaker.currentRental.distanceKm,
                        shippingFee: selectedSpeaker.currentRental.shippingFee,
                        totalAmount: liveRentalAmount
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-ocean-50 hover:bg-ocean-100 border border-ocean-200 text-ocean-700 text-[12px] font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>In Phiếu Thu</span>
                  </button>
                </div>
              </div>

              {/* Live Rental Stopwatch Display */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Timer Clock */}
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                    Thời Gian Khách Đã Thuê (Live Timer)
                  </span>
                  <div className="text-[32px] font-black text-ocean-700 font-mono my-1 tracking-wider">
                    {elapsedFormatted}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Check-in giao lúc: <strong className="text-slate-800">{selectedSpeaker.currentRental.startTime}</strong>
                  </div>
                </div>

                {/* Amount Accumulator */}
                <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-xl flex flex-col justify-center items-center text-center">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider font-mono">
                    Tiền Thuê Tạm Tính Hiện Tại
                  </span>
                  <div className="text-[32px] font-black text-amber-700 font-mono my-1 tracking-wider">
                    {liveRentalAmount.toLocaleString('vi-VN')} đ
                  </div>
                  <div className="text-[11px] text-slate-600">
                    ({elapsedHoursDecimal}h × {selectedSpeaker.hourlyRate.toLocaleString('vi-VN')}đ) + Ship {selectedSpeaker.currentRental.shippingFee.toLocaleString('vi-VN')}đ
                  </div>
                </div>

              </div>

              {/* Customer Dossier */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5 text-[13px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Khách thuê:</span>
                  <strong className="text-slate-800">{selectedSpeaker.currentRental.customerName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Địa chỉ giao loa:</span>
                  <span className="font-medium text-slate-700 text-right">{selectedSpeaker.currentRental.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quãng đường chở từ nhà:</span>
                  <span className="font-mono text-ocean-700 font-bold">{selectedSpeaker.currentRental.distanceKm} km</span>
                </div>
              </div>

              {/* Return Button */}
              <button
                onClick={() => onOpenCheckinModal('return', selectedSpeaker.id)}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-[14px] shadow-sm transition-all"
              >
                <CheckCircle2 className="w-5 h-5" />
                <span>Check-in: Khách Đã Trả & Đã Chở Loa Về Nhà (Chốt Tiền)</span>
              </button>

            </div>
          ) : (
            <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-ocean-50 border border-ocean-200 flex items-center justify-center text-ocean-600 mx-auto">
                <Speaker className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-[18px] font-bold text-slate-800">Loa Hiện Đang Ở Nhà Sẵn Sàng</h3>
                <p className="text-[13px] text-slate-500 max-w-md mx-auto mt-1">
                  Loa đã được sạc đầy pin ({selectedSpeaker.battery}%), đủ 2 micro không dây và củ sạc. Sẵn sàng chở đi giao khách bất cứ lúc nào!
                </p>
              </div>
              <button
                onClick={() => onOpenCheckinModal('delivery', selectedSpeaker.id)}
                className="px-6 py-2.5 bg-ocean-600 hover:bg-ocean-700 text-white font-bold rounded-xl inline-flex items-center gap-2 text-[13px] shadow-sm shadow-ocean-600/20 transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Check-in Chở Loa Này Đi Giao Khách</span>
              </button>
            </div>
          )}

          {/* Quick Price Calculator Widget */}
          <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-ocean-600" />
                <h3 className="text-[14px] font-bold text-slate-800">Công Cụ Báo Giá Nhanh Cho Khách Hỏi Thuê</h3>
              </div>
              <span className="text-[11px] text-slate-500">Áp dụng cho {selectedSpeaker.name}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Số giờ dự kiến thuê</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={calcHours}
                  onChange={(e) => setCalcHours(parseFloat(e.target.value) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] font-mono focus:outline-none focus:border-ocean-600"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Khoảng cách ship (km)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={calcDistance}
                  onChange={(e) => setCalcDistance(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] font-mono focus:outline-none focus:border-ocean-600"
                />
              </div>

              <div className="bg-ocean-50 border border-ocean-200 p-2 rounded-xl flex flex-col justify-center text-center">
                <span className="text-[10px] text-ocean-700 font-bold uppercase">Tổng tiền báo khách:</span>
                <span className="text-[18px] font-black text-ocean-800 font-mono">{calcTotalEstimate.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
