import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Radio, 
  Navigation
} from 'lucide-react';

export default function CheckinModal({ 
  isOpen, 
  onClose, 
  mode, 
  speakers, 
  preSelectedSpeakerId,
  onCheckinDelivery,
  onCheckinReturn,
  homeLocation
}) {
  const availableSpeakers = speakers.filter(s => s.status === 'available');
  const rentingSpeakers = speakers.filter(s => s.status === 'renting' || s.status === 'returning');

  const [activeMode, setActiveMode] = useState(mode || 'delivery');
  
  // Delivery Form State
  const [selectedSpeakerId, setSelectedSpeakerId] = useState(
    preSelectedSpeakerId || (availableSpeakers[0]?.id || '')
  );
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [hourlyRate, setHourlyRate] = useState(80000);
  const [distanceKm, setDistanceKm] = useState(3.5);
  const [shippingFee, setShippingFee] = useState(20000);
  const [deposit, setDeposit] = useState(0);
  const [notes, setNotes] = useState('');

  // Return Form State
  const [returnSpeakerId, setReturnSpeakerId] = useState(
    preSelectedSpeakerId || (rentingSpeakers[0]?.id || '')
  );

  if (!isOpen) return null;

  const currentSpeakerForDelivery = speakers.find(s => s.id === selectedSpeakerId);
  const currentSpeakerForReturn = speakers.find(s => s.id === returnSpeakerId);

  // Calculate rental elapsed time and bill for return
  let elapsedHours = 3.5;
  let rentSubtotal = 0;
  let totalBill = 0;

  if (currentSpeakerForReturn && currentSpeakerForReturn.currentRental) {
    const elapsedMs = Date.now() - currentSpeakerForReturn.currentRental.startTimestamp;
    elapsedHours = Math.max(1, +(elapsedMs / (3600 * 1000)).toFixed(1));
    rentSubtotal = Math.round(elapsedHours * currentSpeakerForReturn.hourlyRate);
    totalBill = rentSubtotal + (currentSpeakerForReturn.currentRental.shippingFee || 0);
  }

  const handleSubmitDelivery = (e) => {
    e.preventDefault();
    if (!selectedSpeakerId || !customerName.trim() || !customerAddress.trim()) {
      alert('Vui lòng điền đầy đủ tên khách và địa chỉ giao loa!');
      return;
    }

    const randomX = Math.floor(Math.random() * 60) + 20;
    const randomY = Math.floor(Math.random() * 60) + 20;

    const rentalData = {
      customerName,
      customerPhone: customerPhone || '09xx xxx xxx',
      address: customerAddress,
      coords: { x: randomX, y: randomY },
      lat: 10.8500 + (Math.random() - 0.5) * 0.04,
      lng: 106.7700 + (Math.random() - 0.5) * 0.04,
      startTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      startTimestamp: Date.now(),
      distanceKm: parseFloat(distanceKm) || 3.0,
      shippingFee: parseInt(shippingFee) || 0,
      deposit: parseInt(deposit) || 0,
      notes: notes || '2 micro không dây + dây sạc'
    };

    onCheckinDelivery(selectedSpeakerId, rentalData, parseInt(hourlyRate));
    onClose();
  };

  const handleSubmitReturn = (e) => {
    e.preventDefault();
    if (!returnSpeakerId || !currentSpeakerForReturn) return;

    onCheckinReturn(returnSpeakerId, {
      rentHours: elapsedHours,
      totalAmount: totalBill,
      returnTime: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ocean-50 border border-ocean-200 flex items-center justify-center text-ocean-600">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-[17px] font-bold text-slate-800">
                {activeMode === 'delivery' ? 'Check-in: Chở Giao Loa Đến Khách' : 'Check-in: Thu Hồi & Loa Đã Về Nhà'}
              </h2>
              <p className="text-[12px] text-slate-500">Định vị vị trí thủ công & Tự động tính tiền theo giờ</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveMode('delivery')}
            className={`py-2 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
              activeMode === 'delivery'
                ? 'bg-white text-ocean-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>1. Giao Loa Đến Khách Thuê</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMode('return')}
            className={`py-2 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
              activeMode === 'return'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>2. Loa Đã Về Nhà (Thu Tiền)</span>
          </button>
        </div>

        {/* MODE 1: DELIVERY FORM */}
        {activeMode === 'delivery' && (
          <form onSubmit={handleSubmitDelivery} className="space-y-4">
            
            {/* Choose Speaker */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 font-mono">
                Chọn Loa Sẵn Sàng Tại Nhà ({availableSpeakers.length} loa có sẵn)
              </label>
              {availableSpeakers.length === 0 ? (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-[13px]">
                  Hiện tất cả loa đều đang cho khách thuê!
                </div>
              ) : (
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => {
                    setSelectedSpeakerId(e.target.value);
                    const spk = speakers.find(s => s.id === e.target.value);
                    if (spk) setHourlyRate(spk.hourlyRate);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold text-[13px] focus:outline-none focus:border-ocean-600 focus:bg-white"
                >
                  {availableSpeakers.map((spk) => (
                    <option key={spk.id} value={spk.id}>
                      {spk.id} - {spk.name} ({spk.type}) - Đơn giá: {spk.hourlyRate.toLocaleString('vi-VN')}đ/h
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Customer Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Tên Khách Thuê / Mục Đích *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: Anh Tuấn (Sinh nhật)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] focus:outline-none focus:border-ocean-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                  Số Điện Thoại Khách
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="VD: 0908 123 456"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] font-mono focus:outline-none focus:border-ocean-600 focus:bg-white"
                />
              </div>
            </div>

            {/* Customer Location Check-in */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold uppercase text-slate-500 font-mono">
                  Địa Chỉ Điểm Thuê (Check-in Vị Trí) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerAddress('128 Đường Số 5, Phường Linh Trung, Thủ Đức');
                    setDistanceKm(3.8);
                    setShippingFee(20000);
                  }}
                  className="text-[11px] text-ocean-600 hover:underline font-bold flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" /> Lấy GPS hiện tại
                </button>
              </div>
              <input
                type="text"
                required
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Nhập địa chỉ nhà/quán ăn khách đang thuê..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] focus:outline-none focus:border-ocean-600 focus:bg-white"
              />
            </div>

            {/* Pricing & Distance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Đơn Giá Thuê (đ / h)</label>
                <input
                  type="number"
                  step="5000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-ocean-700 text-[13px] font-mono font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Khoảng Cách (km)</label>
                <input
                  type="number"
                  step="0.5"
                  value={distanceKm}
                  onChange={(e) => {
                    const km = parseFloat(e.target.value) || 0;
                    setDistanceKm(km);
                    setShippingFee(km > 2 ? Math.round((km - 2) * 5000 + 15000) : 0);
                  }}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-[13px] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-500 mb-1">Phí Ship (đ)</label>
                <input
                  type="number"
                  step="5000"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-[13px] font-mono focus:outline-none"
                />
              </div>
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={availableSpeakers.length === 0}
                className="px-5 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-[13px] flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Bắt Đầu Giao Loa & Tính Giờ</span>
              </button>
            </div>

          </form>
        )}

        {/* MODE 2: RETURN & SETTLE BILL FORM */}
        {activeMode === 'return' && (
          <form onSubmit={handleSubmitReturn} className="space-y-4">
            
            {/* Choose Renting Speaker */}
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1.5 font-mono">
                Chọn Loa Cần Thu Hồi & Về Nhà ({rentingSpeakers.length} loa đang ngoài khách)
              </label>
              {rentingSpeakers.length === 0 ? (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-[13px]">
                  Tất cả các loa đều đã ở nhà sẵn sàng!
                </div>
              ) : (
                <select
                  value={returnSpeakerId}
                  onChange={(e) => setReturnSpeakerId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-semibold text-[13px] focus:outline-none focus:border-ocean-600 focus:bg-white"
                >
                  {rentingSpeakers.map((spk) => (
                    <option key={spk.id} value={spk.id}>
                      {spk.id} - {spk.name} (Khách: {spk.currentRental?.customerName || 'N/A'}) - Giao lúc: {spk.currentRental?.startTime}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Bill Summary Card */}
            {currentSpeakerForReturn && currentSpeakerForReturn.currentRental && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <div className="text-[14px] font-bold text-slate-800">{currentSpeakerForReturn.name}</div>
                    <div className="text-[12px] text-slate-500">Khách thuê: <strong>{currentSpeakerForReturn.currentRental.customerName}</strong></div>
                  </div>
                  <span className="text-[11px] font-mono bg-amber-50 text-amber-700 px-2 py-0.5 rounded font-bold border border-amber-200">
                    Giao lúc: {currentSpeakerForReturn.currentRental.startTime}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[12px] font-mono">
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Thời gian</div>
                    <div className="text-[15px] font-bold text-ocean-700">{elapsedHours} tiếng</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Đơn giá</div>
                    <div className="text-[14px] font-bold text-slate-800">{currentSpeakerForReturn.hourlyRate.toLocaleString('vi-VN')}đ</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Quãng đường</div>
                    <div className="text-[14px] font-bold text-slate-800">{currentSpeakerForReturn.currentRental.distanceKm} km</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200">
                    <div className="text-slate-500 text-[11px]">Phí ship</div>
                    <div className="text-[14px] font-bold text-slate-800">{(currentSpeakerForReturn.currentRental.shippingFee || 0).toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>

                {/* Total Cash to Collect */}
                <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-xl flex items-center justify-between">
                  <span className="text-[12px] font-bold text-emerald-900 uppercase font-mono">
                    Tổng Tiền Cần Thu Của Khách:
                  </span>
                  <div className="text-[22px] font-black text-emerald-700 font-mono">
                    {totalBill.toLocaleString('vi-VN')} đ
                  </div>
                </div>

              </div>
            )}

            {/* Submit Action */}
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[13px] font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={rentingSpeakers.length === 0}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[13px] flex items-center gap-2 shadow-xs disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã Thu Tiền & Loa Đã Về Nhà</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
