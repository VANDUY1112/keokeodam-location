import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewView from './components/OverviewView';
import DeviceDetailsView from './components/DeviceDetailsView';
import AlertsView from './components/AlertsView';
import ReportsView from './components/ReportsView';
import { INITIAL_FLEET, INITIAL_ALERTS, FLEET_SUMMARY_STATS } from './data/fleetData';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'device-details' | 'alerts' | 'reports'
  const [fleet, setFleet] = useState(INITIAL_FLEET);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [stats, setStats] = useState(FLEET_SUMMARY_STATS);
  const [selectedUnitId, setSelectedUnitId] = useState('TRK-102');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSimulating, setIsSimulating] = useState(true);
  const [toast, setToast] = useState(null);

  // Live GPS & Telemetry Simulator ticker
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setFleet((prevFleet) =>
        prevFleet.map((vehicle) => {
          if (vehicle.status !== 'active') return vehicle;

          // Micro-fluctuate speed and coordinates
          const speedDelta = (Math.random() - 0.48) * 2;
          const newSpeed = Math.max(45, Math.min(75, Math.round(vehicle.speed + speedDelta)));
          
          // Subtle GPS drift along heading
          const deltaX = (Math.random() - 0.4) * 0.15;
          const deltaY = (Math.random() - 0.45) * 0.15;
          
          return {
            ...vehicle,
            speed: newSpeed,
            coords: {
              x: Math.max(10, Math.min(85, +(vehicle.coords.x + deltaX).toFixed(2))),
              y: Math.max(10, Math.min(85, +(vehicle.coords.y + deltaY).toFixed(2)))
            }
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Filtered fleet by search
  const searchedFleet = fleet.filter((v) => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return (
      v.id.toLowerCase().includes(query) ||
      v.name.toLowerCase().includes(query) ||
      v.driver.name.toLowerCase().includes(query) ||
      v.destination.toLowerCase().includes(query) ||
      v.vin.toLowerCase().includes(query)
    );
  });

  const unreadAlertsCount = alerts.filter(a => a.status === 'unacknowledged').length;

  const handleSelectUnit = (unitId) => {
    setSelectedUnitId(unitId);
  };

  // Toast Auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  return (
    <div className="min-h-screen bg-background font-body-md text-on-surface flex flex-col relative overflow-x-hidden">
      
      {/* Fixed Left Navigation Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        unreadAlertsCount={unreadAlertsCount}
        fleetCount={fleet.length}
      />

      {/* Main Content Area */}
      <div className="pl-[280px] min-h-screen flex flex-col">
        
        {/* Fixed Top Header */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isSimulating={isSimulating}
          setIsSimulating={setIsSimulating}
          unreadAlertsCount={unreadAlertsCount}
          alerts={alerts}
          onSelectUnit={(id) => {
            handleSelectUnit(id);
            setActiveTab('device-details');
          }}
          setActiveTab={setActiveTab}
        />

        {/* Dynamic View Router */}
        <main className="flex-1 pt-[64px] bg-background relative overflow-y-auto">
          {activeTab === 'overview' && (
            <OverviewView
              fleet={searchedFleet}
              stats={stats}
              onSelectUnit={handleSelectUnit}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              selectedUnit={fleet.find(v => v.id === selectedUnitId)}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'device-details' && (
            <DeviceDetailsView
              fleet={searchedFleet}
              selectedUnitId={selectedUnitId}
              onSelectUnit={handleSelectUnit}
              searchTerm={searchTerm}
              setToast={setToast}
            />
          )}

          {activeTab === 'alerts' && (
            <AlertsView
              alerts={alerts}
              setAlerts={setAlerts}
              onSelectUnit={handleSelectUnit}
              setActiveTab={setActiveTab}
              setToast={setToast}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              fleet={fleet}
              stats={stats}
              onSelectUnit={handleSelectUnit}
              setActiveTab={setActiveTab}
              setToast={setToast}
            />
          )}
        </main>
      </div>

      {/* Floating Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md bg-surface-container/95 backdrop-blur-2xl border border-primary/40 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.6)] p-4 flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
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
