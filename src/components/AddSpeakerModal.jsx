import React, { useState } from 'react';
import { 
  X, 
  Speaker, 
  Plus, 
  DollarSign, 
  Battery, 
  Mic2, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';

export default function AddSpeakerModal({ isOpen, onClose, onAddSpeaker }) {
  const [speakerId, setSpeakerId] = useState('');
  const [name, setName] = useState('');
  const [type, setType] = useState('Bass 40 Đơn - 800W');
  const [hourlyRate, setHourlyRate] = useState(80000);
  const [battery, setBattery] = useState(100);
  const [mics, setMics] = useState(2);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!speakerId.trim() || !name.trim()) {
      alert('Vui lòng nhập mã loa và tên loa!');
      return;
    }

    const newSpeaker = {
      id: speakerId.trim().toUpperCase(),
      name: name.trim(),
      type: type.trim(),
      serial: `${speakerId.toUpperCase()}-${Date.now().toString().slice(-4)}`,
      status: 'available',
      statusLabel: 'Tại nhà / Sẵn sàng',
      battery: parseInt(battery) || 100,
      mics: parseInt(mics) || 2,
      hasCharger: true,
      hourlyRate: parseInt(hourlyRate) || 80000,
      currentRental: null,
      totalRentalsCount: 0,
      totalRevenue: 0,
      totalDistanceKm: 0
    };

    onAddSpeaker(newSpeaker);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div className="bg-surface-container border border-primary/40 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
              <Speaker className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-on-surface">Thêm Loa Kẹo Kéo Mới</h3>
              <p className="text-[11px] text-on-surface-variant font-mono">Bổ sung thiết bị vào kho nhà</p>
            </div>
          </div>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Speaker ID & Name */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1 font-semibold">
                Mã Loa *
              </label>
              <input
                type="text"
                required
                value={speakerId}
                onChange={(e) => setSpeakerId(e.target.value)}
                placeholder="VD: LKK-07"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] font-mono font-bold uppercase focus:outline-none focus:border-primary"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1 font-semibold">
                Tên Loa & Hãng Sản Xuất *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Loa Kéo Nanomax SK-15X5"
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Type & Rate */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1 font-semibold">
                Loại Cấu Hình
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] focus:outline-none focus:border-primary"
              >
                <option value="Bass 30 Đơn - 450W">Bass 30 Đơn - 450W</option>
                <option value="Bass 40 Đơn - 600W">Bass 40 Đơn - 600W</option>
                <option value="Bass 40 Đơn - 800W">Bass 40 Đơn - 800W</option>
                <option value="Bass 40 Đôi - 1000W">Bass 40 Đôi - 1000W</option>
                <option value="Bass 50 Đôi - 1200W">Bass 50 Đôi - 1200W</option>
                <option value="Loa Xách Tay Mini - 400W">Loa Xách Tay Mini - 400W</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1 font-semibold">
                Đơn Giá Thuê (đ / giờ)
              </label>
              <input
                type="number"
                step="5000"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-primary text-[13px] font-mono font-bold focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Battery & Mics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1 font-semibold">
                Mức Pin Hiện Tại (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-on-surface-variant uppercase mb-1 font-semibold">
                Số Micro Đi Kèm
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={mics}
                onChange={(e) => setMics(e.target.value)}
                className="w-full bg-surface-container-high border border-outline-variant/30 rounded-xl p-2.5 text-on-surface text-[13px] font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface text-[13px]"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-primary hover:bg-primary/90 text-surface-dim font-bold text-[13px] flex items-center gap-1.5 shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Loa Vào Kho</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
