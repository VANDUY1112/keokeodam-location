import React, { useState } from 'react';
import { 
  X, 
  Speaker, 
  Plus
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-ocean-50 text-ocean-600 flex items-center justify-center font-bold">
              <Speaker className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-slate-800">Thêm Loa Kẹo Kéo Mới</h3>
              <p className="text-[11px] text-slate-500">Bổ sung thiết bị vào kho nhà</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          
          {/* Speaker ID & Name */}
          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                Mã Loa *
              </label>
              <input
                type="text"
                required
                value={speakerId}
                onChange={(e) => setSpeakerId(e.target.value)}
                placeholder="VD: LKK-07"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] font-mono font-bold uppercase focus:outline-none focus:border-ocean-600 focus:bg-white"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                Tên Loa *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Loa Kéo Nanomax SK-15X5"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] focus:outline-none focus:border-ocean-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Type & Rate */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                Loại Cấu Hình
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] focus:outline-none focus:border-ocean-600 focus:bg-white"
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
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                Đơn Giá Thuê (đ / h)
              </label>
              <input
                type="number"
                step="5000"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-ocean-700 text-[13px] font-mono font-bold focus:outline-none focus:border-ocean-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Battery & Mics */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                Pin Hiện Tại (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={battery}
                onChange={(e) => setBattery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] font-mono focus:outline-none focus:border-ocean-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase text-slate-500 mb-1 font-mono">
                Số Micro
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={mics}
                onChange={(e) => setMics(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 text-[13px] font-mono focus:outline-none focus:border-ocean-600 focus:bg-white"
              />
            </div>
          </div>

          {/* Submit */}
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
              className="px-4 py-2 rounded-xl bg-ocean-600 hover:bg-ocean-700 text-white font-bold text-[13px] flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Loa</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
