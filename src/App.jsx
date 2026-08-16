import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import DeviceDetailsView from './components/DeviceDetailsView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import CheckinModal from './components/CheckinModal';
import ReceiptModal from './components/ReceiptModal';
import AddSpeakerModal from './components/AddSpeakerModal';
import { INITIAL_SPEAKERS, HOME_LOCATION, RECENT_RENTAL_LOGS } from './data/speakersData';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'device-details' | 'alerts' | 'reports'
  
  // Load initial state with LocalStorage fallback
  const [speakers, setSpeakers] = useState(() => {
    try {
      const saved = localStorage.getItem('keokeodam_speakers');
      return saved ? JSON.parse(saved) : INITIAL_SPEAKERS;
    } catch (e) {
      return INITIAL_SPEAKERS;
    }
  });

  const [selectedSpeakerId, setSelectedSpeakerId] = useState('LKK-01');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  // Checkin Modal State
  const [checkinModalOpen, setCheckinModalOpen] = useState(false);
  const [checkinModalMode, setCheckinModalMode] = useState('delivery');
  const [preSelectedSpeakerId, setPreSelectedSpeakerId] = useState(null);

  // Receipt Modal State
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState(null);

  // Add Speaker Modal State
  const [addSpeakerModalOpen, setAddSpeakerModalOpen] = useState(false);

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem('keokeodam_speakers', JSON.stringify(speakers));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  }, [speakers]);

  const handleOpenCheckinModal = (mode = 'delivery', speakerId = null) => {
    setCheckinModalMode(mode);
    setPreSelectedSpeakerId(speakerId);
    setCheckinModalOpen(true);
  };

  const handleOpenReceiptModal = (record) => {
    setSelectedReceiptRecord(record);
    setReceiptModalOpen(true);
  };

  // Check-in Giao loa đến khách
  const handleCheckinDelivery = (speakerId, rentalData, hourlyRate) => {
    setSpeakers((prevSpeakers) =>
      prevSpeakers.map((spk) => {
        if (spk.id !== speakerId) return spk;
        return {
          ...spk,
          status: 'renting',
          statusLabel: 'Khách đang thuê',
          hourlyRate: hourlyRate || spk.hourlyRate,
          currentRental: rentalData
        };
      })
    );

    setSelectedSpeakerId(speakerId);
    setToast({
      title: `Check-in Giao Loa Thành Công (${speakerId})`,
      desc: `Đã giao tới: ${rentalData.customerName} (${rentalData.address}). Đồng hồ tính tiền đã bắt đầu chạy!`,
      type: 'success'
    });
  };

  // Check-in Đã chở loa về nhà
  const handleCheckinReturn = (speakerId, returnData) => {
    const speakerToReturn = speakers.find(s => s.id === speakerId);

    setSpeakers((prevSpeakers) =>
      prevSpeakers.map((spk) => {
        if (spk.id !== speakerId) return spk;
        return {
          ...spk,
          status: 'available',
          statusLabel: 'Tại nhà / Sẵn sàng',
          totalRentalsCount: spk.totalRentalsCount + 1,
          totalRevenue: spk.totalRevenue + returnData.totalAmount,
          currentRental: null
        };
      })
    );

    // Open receipt modal right away
    if (speakerToReturn && speakerToReturn.currentRental) {
      handleOpenReceiptModal({
        id: 'HD-' + speakerId + '-' + Date.now().toString().slice(-4),
        customerName: speakerToReturn.currentRental.customerName,
        customerPhone: speakerToReturn.currentRental.customerPhone,
        address: speakerToReturn.currentRental.address,
        speakerId: speakerId,
        speakerName: speakerToReturn.name,
        rentHours: returnData.rentHours,
        hourlyRate: speakerToReturn.hourlyRate,
        distanceKm: speakerToReturn.currentRental.distanceKm,
        shippingFee: speakerToReturn.currentRental.shippingFee,
        totalAmount: returnData.totalAmount
      });
    }

    setToast({
      title: `Loa Đã Về Nhà (${speakerId})`,
      desc: `Đã thu tiền khách: ${returnData.totalAmount.toLocaleString('vi-VN')} đ (Thời gian: ${returnData.rentHours} tiếng). Loa đã sẵn sàng cho ca thuê tiếp theo!`,
      type: 'success'
    });
  };

  // Thêm loa mới
  const handleAddSpeaker = (newSpeaker) => {
    setSpeakers(prev => [newSpeaker, ...prev]);
    setSelectedSpeakerId(newSpeaker.id);
    setToast({
      title: `Đã Thêm Loa Mới (${newSpeaker.id})`,
      desc: `${newSpeaker.name} (${newSpeaker.type}) đã được thêm vào kho nhà!`,
      type: 'success'
    });
  };

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col relative overflow-x-hidden">
      
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        speakers={speakers}
        onOpenCheckinModal={handleOpenCheckinModal}
      />

      {/* Main Content Area */}
      <div className="pl-[280px] min-h-screen flex flex-col">
        
        {/* Fixed Top Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          speakers={speakers}
          onOpenCheckinModal={handleOpenCheckinModal}
          setActiveTab={setActiveTab}
          onSelectSpeaker={(id) => {
            setSelectedSpeakerId(id);
            setActiveTab('device-details');
          }}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 pt-[64px] bg-background relative overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              speakers={speakers}
              onSelectSpeaker={(id) => {
                setSelectedSpeakerId(id);
                setActiveTab('device-details');
              }}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onOpenCheckinModal={handleOpenCheckinModal}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'device-details' && (
            <DeviceDetailsView
              speakers={speakers}
              selectedSpeakerId={selectedSpeakerId}
              onSelectSpeaker={setSelectedSpeakerId}
              onOpenCheckinModal={handleOpenCheckinModal}
              onOpenAddSpeakerModal={() => setAddSpeakerModalOpen(true)}
              onOpenReceiptModal={handleOpenReceiptModal}
              searchTerm={searchTerm}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              speakers={speakers}
              onOpenCheckinModal={handleOpenCheckinModal}
              onSelectSpeaker={(id) => {
                setSelectedSpeakerId(id);
                setActiveTab('device-details');
              }}
              setActiveTab={setActiveTab}
              setToast={setToast}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              speakers={speakers}
              onSelectSpeaker={(id) => {
                setSelectedSpeakerId(id);
                setActiveTab('device-details');
              }}
              setActiveTab={setActiveTab}
              setToast={setToast}
            />
          )}
        </main>
      </div>

      {/* Manual Check-in Modal */}
      <CheckinModal
        isOpen={checkinModalOpen}
        onClose={() => setCheckinModalOpen(false)}
        mode={checkinModalMode}
        speakers={speakers}
        preSelectedSpeakerId={preSelectedSpeakerId}
        onCheckinDelivery={handleCheckinDelivery}
        onCheckinReturn={handleCheckinReturn}
        homeLocation={HOME_LOCATION}
      />

      {/* Printable Receipt & VietQR Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        rentalRecord={selectedReceiptRecord}
        homeLocation={HOME_LOCATION}
      />

      {/* Add Speaker Modal */}
      <AddSpeakerModal
        isOpen={addSpeakerModalOpen}
        onClose={() => setAddSpeakerModalOpen(false)}
        onAddSpeaker={handleAddSpeaker}
      />

      {/* Floating Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-surface-container/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.7)] p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className={`p-2 rounded-xl shrink-0 ${
            toast.type === 'success' 
              ? 'bg-primary/20 text-primary' 
              : toast.type === 'error' 
              ? 'bg-error/20 text-error' 
              : 'bg-secondary/20 text-secondary'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : toast.type === 'error' ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>
          <div className="flex-1 pr-2">
            <div className="text-[14px] font-bold text-on-surface">{toast.title}</div>
            <div className="text-[12px] text-on-surface-variant mt-0.5">{toast.desc}</div>
          </div>
          <button 
            onClick={() => setToast(null)}
            className="text-on-surface-variant hover:text-on-surface p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
