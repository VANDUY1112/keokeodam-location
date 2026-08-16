import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Clock, 
  Truck, 
  CheckCircle2, 
  DollarSign, 
  User, 
  Phone, 
  Radio, 
  Sparkles,
  ArrowRight,
  Navigation
} from 'lucide-react';

export default function CheckinModal({ 
  isOpen, 
  onClose, 
  mode, // 'delivery' | 'return'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-surface-container border border-primary/40 rounded-2xl shadow-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header with Mode Switcher */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_12px_rgba(75,226,119,0.3)]">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-on-surface">
                {activeMode === 'delivery' ? 'Check-in: Chở Giao Loa Đến Khách' : 'Check-in: Thu Hồi & Loa Đã Về Nhà'}
              </h2>
              <p className="text-[12px] text-on-surface-variant font-mono">Định vị vị trí thủ công & Tự động tính tiền theo giờ</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container-high p-1 rounded-xl border border-outline-variant/20">
          <button
            type="button"
            onClick={() => setActiveMode('delivery')}
            className={`py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
              activeMode === 'delivery'
                ? 'bg-primary text-surface-dim shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>1. Giao Loa Đến Khách Thuê</span>
          </button>
          
          <button
            type="button"
            onClick={() => setActiveMode('return')}
            className={`py-2.5 rounded-lg text-[13px] font-bold flex items-center justify-center gap-2 transition-all ${
              activeMode === 'return'
                ? 'bg-secondary-container text-on-secondary-container shadow-md'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>2. Loa Đã Về Nhà (Tính Tiền)</span>
          </button>
        </div>

        {/* MODE 1: DELIVERY FORM */}
        {activeMode === 'delivery' && (
          <form onSubmit={handleSubmitDelivery} className="space-y-4">
            
            {/* Choose Speaker */}
            <div>
              <label className="block text-[12px] font-mono text-on-surface-variant uppercase mb-1.5 font-semibold">
                Chọn Loa Sẵn Sàng Tại Nhà ({availableSpeakers.length} loa có sẵn)
              </label>
              {availableSpeakers.length === 0 ? (
                <div className="p-3 bg-error/15 border border-error/30 rounded-xl text-error text-[13px]">
                  Hiện tất cả loa đều đang cho khách thuê! Hãy chọn loa thu hồi trước khi giao mới.
                </div>
              ) : (
                <select
                  value={selectedSpeakerId}
                  onChange={(e) => {
                    setSelectedSpeakerId(e.target.value);
                    const spk = speakers.find(s => s.id === e.target.value);
                    if (spk) setHourlyRate(spk.hourlyRate);
                  }}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-3 text-on-surface font-semibold text-[14px] focus:outline-none focus:border-primary"
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
                <label className="block text-[12px] font-mono text-on-surface-variant uppercase mb-1">
                  Tên Khách Thuê / Mục Đích *
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="VD: Anh Tuấn (Sinh nhật), Chị Lan (Khai trương)"
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-mono text-on-surface-variant uppercase mb-1">
                  Số Điện Thoại Khách
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="VD: 0908 123 456"
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            {/* Customer Location Check-in */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-mono text-on-surface-variant uppercase font-semibold">
                  Địa Chỉ Điểm Thuê (Check-in Vị Trí) *
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCustomerAddress('128 Đường Số 5, Phường Linh Trung, Thủ Đức');
                    setDistanceKm(3.8);
                    setShippingFee(20000);
                  }}
                  className="text-[11px] text-primary hover:underline font-mono flex items-center gap-1"
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
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>

            {/* Pricing & Distance Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-surface-container-low/60 p-3.5 rounded-xl border border-outline-variant/20">
              <div>
                <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
                  Đơn Giá Thuê (VNĐ / Giờ)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-2 text-on-surface text-[13px] font-mono font-bold text-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
                  Khoảng Cách (km từ nhà)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={distanceKm}
                  onChange={(e) => {
                    const km = parseFloat(e.target.value) || 0;
                    setDistanceKm(km);
                    setShippingFee(km > 2 ? Math.round((km - 2) * 5000 + 15000) : 0);
                  }}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-2 text-on-surface text-[13px] font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1">
                  Phí Ship Vận Chuyển (VNĐ)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={shippingFee}
                  onChange={(e) => setShippingFee(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-lg p-2 text-on-surface text-[13px] font-mono text-secondary focus:outline-none"
                />
              </div>
            </div>

            {/* Note */}
            <div>
              <label className="block text-[12px] font-mono text-on-surface-variant uppercase mb-1">
                Ghi Chú Phụ Kiện Kèm Theo
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="VD: 2 micro không dây, dây sạc, pin tiểu dự phòng..."
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>

            {/* Submit Action */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px]"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={availableSpeakers.length === 0}
                className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-2 shadow-[0_0_15px_rgba(75,226,119,0.3)] disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Đã Giao Loa & Bắt Đầu Tính Giờ</span>
              </button>
            </div>

          </form>
        )}

        {/* MODE 2: RETURN & SETTLE BILL FORM */}
        {activeMode === 'return' && (
          <form onSubmit={handleSubmitReturn} className="space-y-4">
            
            {/* Choose Renting Speaker */}
            <div>
              <label className="block text-[12px] font-mono text-on-surface-variant uppercase mb-1.5 font-semibold">
                Chọn Loa Cần Thu Hồi & Về Nhà ({rentingSpeakers.length} loa đang ngoài khách)
              </label>
              {rentingSpeakers.length === 0 ? (
                <div className="p-3 bg-primary/15 border border-primary/30 rounded-xl text-primary text-[13px]">
                  Tất cả các loa đều đã ở nhà sẵn sàng! Không có loa nào đang cho thuê.
                </div>
              ) : (
                <select
                  value={returnSpeakerId}
                  onChange={(e) => setReturnSpeakerId(e.target.value)}
                  className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-3 text-on-surface font-semibold text-[14px] focus:outline-none focus:border-primary"
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
              <div className="bg-surface-container-high/80 border border-outline-variant/30 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                  <div>
                    <div className="text-[15px] font-bold text-on-surface">{currentSpeakerForReturn.name}</div>
                    <div className="text-[12px] text-on-surface-variant">Khách thuê: <strong>{currentSpeakerForReturn.currentRental.customerName}</strong> ({currentSpeakerForReturn.currentRental.customerPhone})</div>
                  </div>
                  <span className="text-[12px] font-mono bg-tertiary/20 text-tertiary px-2.5 py-1 rounded-full font-bold">
                    Giao lúc: {currentSpeakerForReturn.currentRental.startTime}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[12px] font-mono">
                  <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/10">
                    <div className="text-on-surface-variant">Thời gian thuê</div>
                    <div className="text-[16px] font-black text-primary mt-0.5">{elapsedHours} tiếng</div>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/10">
                    <div className="text-on-surface-variant">Đơn giá / giờ</div>
                    <div className="text-[15px] font-bold text-on-surface mt-0.5">{currentSpeakerForReturn.hourlyRate.toLocaleString('vi-VN')}đ</div>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/10">
                    <div className="text-on-surface-variant">Quãng đường</div>
                    <div className="text-[15px] font-bold text-secondary mt-0.5">{currentSpeakerForReturn.currentRental.distanceKm} km</div>
                  </div>
                  <div className="bg-surface-container p-2.5 rounded-xl border border-outline-variant/10">
                    <div className="text-on-surface-variant">Phí ship</div>
                    <div className="text-[15px] font-bold text-on-surface mt-0.5">{(currentSpeakerForReturn.currentRental.shippingFee || 0).toLocaleString('vi-VN')}đ</div>
                  </div>
                </div>

                {/* Total Cash to Collect */}
                <div className="bg-primary/10 border border-primary/30 p-3.5 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider font-semibold">
                      Tổng Tiền Cần Thu Của Khách:
                    </span>
                    <div className="text-[11px] text-on-surface-variant">
                      ({elapsedHours}h × {currentSpeakerForReturn.hourlyRate.toLocaleString('vi-VN')}đ) + Phí ship {(currentSpeakerForReturn.currentRental.shippingFee || 0).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div className="text-[24px] font-black text-primary font-mono">
                    {totalBill.toLocaleString('vi-VN')} đ
                  </div>
                </div>

              </div>
            )}

            {/* Submit Action */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px]"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={rentingSpeakers.length === 0}
                className="px-6 py-2.5 rounded-xl bg-secondary-container hover:bg-secondary-container/90 text-on-secondary-container font-bold text-[13px] flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Xác Nhận Đã Thu Tiền & Loa Đã Chở Về Kho</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
