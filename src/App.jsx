import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import OverviewView from './components/OverviewView';
import MapView from './components/MapView';
import DeviceDetailsView from './components/DeviceDetailsView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import CheckinModal from './components/CheckinModal';
import ReceiptModal from './components/ReceiptModal';
import AddSpeakerModal from './components/AddSpeakerModal';
import { INITIAL_SPEAKERS, HOME_LOCATION } from './data/speakersData';

export default function App() {
  const [activeTab, setActiveTab] = useState('tong-quan');
  const [speakers, setSpeakers] = useState(() => {
    try {
      const saved = localStorage.getItem('keokeodam_speakers');
      return saved ? JSON.parse(saved) : INITIAL_SPEAKERS;
    } catch { return INITIAL_SPEAKERS; }
  });
  const [selectedSpeakerId, setSelectedSpeakerId] = useState('LKK-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [toast, setToast] = useState(null);

  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [checkinModalMode, setCheckinModalMode] = useState('delivery');
  const [preSelectedSpeakerId, setPreSelectedSpeakerId] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState(null);
  const [addSpeakerModalOpen, setAddSpeakerModalOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem('keokeodam_speakers', JSON.stringify(speakers)); } catch {}
  }, [speakers]);

  const openCheckin = (mode = 'delivery', id = null) => {
    setCheckinModalMode(mode);
    setPreSelectedSpeakerId(id);
    setCheckinModalOpen(true);
  };

  const openReceipt = (record) => {
    setSelectedReceiptRecord(record);
    setReceiptModalOpen(true);
  };

  const handleDelivery = (speakerId, rentalData, hourlyRate) => {
    setSpeakers(prev => prev.map(s => s.id !== speakerId ? s : {
      ...s, status: 'renting', statusLabel: 'Khách đang thuê',
      hourlyRate: hourlyRate || s.hourlyRate, currentRental: rentalData
    }));
    setSelectedSpeakerId(speakerId);
    showToast('success', `Giao loa ${speakerId} thành công!`, `Đã bàn giao cho ${rentalData.customerName}.`);
  };

  const handleReturn = (speakerId, returnData) => {
    const spk = speakers.find(s => s.id === speakerId);
    setSpeakers(prev => prev.map(s => s.id !== speakerId ? s : {
      ...s, status: 'available', statusLabel: 'Tại kho / Sẵn sàng',
      totalRentalsCount: s.totalRentalsCount + 1,
      totalRevenue: s.totalRevenue + returnData.totalAmount, currentRental: null
    }));
    if (spk?.currentRental) {
      openReceipt({
        id: 'HD-' + speakerId + '-' + Date.now().toString().slice(-4),
        customerName: spk.currentRental.customerName, customerPhone: spk.currentRental.customerPhone,
        address: spk.currentRental.address, speakerId, speakerName: spk.name,
        rentHours: returnData.rentHours, hourlyRate: spk.hourlyRate,
        distanceKm: spk.currentRental.distanceKm, shippingFee: spk.currentRental.shippingFee,
        totalAmount: returnData.totalAmount
      });
    }
    showToast('success', `Loa ${speakerId} đã về kho an toàn!`, `Đã thu ${returnData.totalAmount.toLocaleString('vi-VN')}đ.`);
  };

  const handleAddSpeaker = (newSpk) => {
    setSpeakers(prev => [newSpk, ...prev]);
    setSelectedSpeakerId(newSpk.id);
    showToast('success', `Thêm ${newSpk.id} thành công!`, `${newSpk.name} đã sẵn sàng trong kho.`);
  };

  const showToast = (type, title, desc) => setToast({ type, title, desc });
  useEffect(() => { 
    if (toast) { 
      const t = setTimeout(() => setToast(null), 4000); 
      return () => clearTimeout(t); 
    } 
  }, [toast]);

  return (
    <div className="bg-background font-body-md text-on-background min-h-screen">
      
      {/* ═══════════════ SIDEBAR NAVIGATION (W-72) ═══════════════ */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        speakers={speakers} 
        onOpenCheckinModal={openCheckin} 
      />

      {/* ═══════════════ MAIN CONTENT AREA (PL-72) ═══════════════ */}
      <div className="pl-0 lg:pl-72 transition-all duration-300 min-h-screen">
        
        {/* Main Content Router */}
        <main className="relative bg-surface min-h-screen">
          
          {/* TAB 1: TỔNG QUAN */}
          {activeTab === 'tong-quan' && (
            <OverviewView 
              speakers={speakers} 
              onSelectSpeaker={id => { setSelectedSpeakerId(id); setActiveTab('danh-sach-thiet-bi'); }}
              onOpenCheckinModal={openCheckin} 
              setActiveTab={setActiveTab} 
            />
          )}

          {/* TAB 2: BẢN ĐỒ TRỰC TUYẾN */}
          {activeTab === 'ban-do-truc-tuyen' && (
            <MapView 
              speakers={speakers}
              onSelectSpeaker={(id) => {
                setSelectedSpeakerId(id);
                setActiveTab('danh-sach-thiet-bi');
              }}
              onOpenCheckinModal={openCheckin}
            />
          )}

          {/* TAB 3: QUẢN LÝ DÀN LOA & HÀNH TRÌNH */}
          {activeTab === 'danh-sach-thiet-bi' && (
            <DeviceDetailsView 
              speakers={speakers} 
              selectedSpeakerId={selectedSpeakerId}
              onSelectSpeaker={setSelectedSpeakerId} 
              onOpenCheckinModal={openCheckin}
              onOpenAddSpeakerModal={() => setAddSpeakerModalOpen(true)}
              onOpenReceiptModal={openReceipt} 
              searchTerm={searchTerm} 
            />
          )}

          {/* TAB 4: QUẢN LÝ CẢNH BÁO */}
          {activeTab === 'canh-bao' && (
            <AlertsView 
              speakers={speakers} 
              onOpenCheckinModal={openCheckin}
              onSelectSpeaker={id => { setSelectedSpeakerId(id); setActiveTab('danh-sach-thiet-bi'); }}
              setActiveTab={setActiveTab} 
              setToast={setToast} 
            />
          )}

          {/* TAB 5: SỔ SÁCH & BÁO CÁO */}
          {activeTab === 'bao-cao' && (
            <ReportsView 
              speakers={speakers} 
              onSelectSpeaker={id => { setSelectedSpeakerId(id); setActiveTab('danh-sach-thiet-bi'); }}
              setActiveTab={setActiveTab} 
              setToast={setToast} 
            />
          )}

        </main>

      </div>

      {/* ═══════════════ MODALS ═══════════════ */}
      <CheckinModal 
        isOpen={checkinModalOpen} 
        onClose={() => setCheckinModalOpen(false)} 
        mode={checkinModalMode}
        speakers={speakers} 
        preSelectedSpeakerId={preSelectedSpeakerId}
        onCheckinDelivery={handleDelivery} 
        onCheckinReturn={handleReturn} 
        homeLocation={HOME_LOCATION} 
      />
      
      <ReceiptModal 
        isOpen={receiptModalOpen} 
        onClose={() => setReceiptModalOpen(false)} 
        rentalRecord={selectedReceiptRecord} 
        homeLocation={HOME_LOCATION} 
      />
      
      <AddSpeakerModal 
        isOpen={addSpeakerModalOpen} 
        onClose={() => setAddSpeakerModalOpen(false)} 
        onAddSpeaker={handleAddSpeaker} 
      />

      {/* ═══════════════ TOAST NOTIFICATION ═══════════════ */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-lg shadow-xl p-4 flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-sm text-on-surface truncate">{toast.title}</div>
              <div className="text-xs text-on-surface-variant mt-0.5 line-clamp-2">{toast.desc}</div>
            </div>
            <button onClick={() => setToast(null)} className="text-on-surface-variant hover:text-on-surface">
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
