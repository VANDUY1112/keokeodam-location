import React, { useState } from 'react';

export default function AlertsView({ 
  speakers = [], 
  onOpenCheckinModal, 
  onSelectSpeaker, 
  setActiveTab, 
  setToast 
}) {
  const [severityFilter, setSeverityFilter] = useState({
    emergency: true,
    warning: true,
    info: false
  });
  const [timeRange, setTimeRange] = useState('today'); // 'today' | 'yesterday' | '7days' | 'custom'
  const [eventType, setEventType] = useState('all');

  const alertItems = [
    {
      id: 'alt-01',
      severity: 'emergency',
      severityLabel: 'Khẩn cấp',
      time: '14:32:05 - Hôm nay',
      title: 'Tai nạn được báo cáo - Cảm biến va chạm kích hoạt',
      vehicle: 'Xe tải nặng 30F-123.45',
      driver: 'Nguyễn Văn A (Tài xế chính)',
      desc: 'Hệ thống ghi nhận lực G vượt ngưỡng tại cảm biến phía trước xe. Yêu cầu liên hệ khẩn cấp với tài xế.',
      locationText: 'Km 1824 QL1A',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGDVwCWt7MHPubnvjtByvd9kuS4vQOsKLg7Y18D9WFGrTF4z5dooXhY79DOuGTClI4sVKSmAc3iZ8kRZoLbxpDSdNAUEKowHfgrDwMbFJq3W4tZhhJGfNYAlaXC1yCA4sKNrZj0M057uoOi1R0ph6plg8CvSJEWIaiE6Y9AkzK0898vxYZ-qKFbgjnYvN5LIZrpq0jvO84ScV5YYKDy2rQVFB8nKAtsJzaWaIsmIuYayO3xSR9fDdE'
    },
    {
      id: 'alt-02',
      severity: 'warning',
      severityLabel: 'Cảnh báo',
      time: '13:15:22 - Hôm nay',
      title: 'Vượt quá tốc độ giới hạn (Cấp độ 2)',
      vehicle: 'Container 51C-888.99',
      speedDetail: '95 km/h (Giới hạn: 80)',
      mapImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAg9wO18n_rqXjRBBkSxNvajTsv38IqAE7v29KvAIaShZEQNnteyWr5CuDw1Fscv-n6ORvf3nnC19NT66S3PauC4LZHHYz4CiYRMufdxLXcyAMSa9BwTMPG0T9Ge99efwQU-yJ_9Ui6OB_DEobfiUZiX3RK0_3Vbn6-EY06ogF11zWfSThjEVg5DY3PraIc7GdeQRvqCaX-AOMH9IwXqQUhMZxz1ojcQWl6yN2-BnC9Efua-Uj8sQ7'
    },
    {
      id: 'alt-03',
      severity: 'warning',
      severityLabel: 'Cảnh báo',
      time: '11:45:00 - Hôm nay',
      title: 'Phương tiện rời khỏi khu vực làm việc',
      vehicle: 'Xe tải nhẹ 29D-456.78',
      geofenceDetail: 'Khu vực: Kho phân phối miền Nam'
    },
    {
      id: 'alt-04',
      severity: 'info',
      severityLabel: 'Thông tin',
      time: '09:10:15 - Hôm nay',
      title: 'Bắt đầu hành trình mới',
      vehicle: 'Đầu kéo 15C-112.22',
      routeDetail: 'Lộ trình: Cảng Hải Phòng -> KCN Yên Phong'
    }
  ];

  return (
    <div className="flex flex-col w-full h-full relative select-none">
      
      {/* Floating Ambient Blur Header */}
      <div className="absolute top-0 right-0 w-3/4 h-64 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl -z-10 pointer-events-none"></div>

      {/* Page Header */}
      <div className="px-container-margin py-stack-lg flex flex-col md:flex-row md:items-end justify-between gap-stack-lg mt-stack-md z-10">
        <div className="flex flex-col gap-unit">
          <div className="flex items-center gap-stack-sm text-primary">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              campaign
            </span>
            <span className="font-label-md uppercase tracking-wider text-primary font-bold">
              Hệ thống giám sát
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface mt-stack-xs tracking-tight">
            Cảnh báo &amp; Thông báo
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mt-stack-sm leading-relaxed">
            Quản lý và phản hồi các sự kiện bất thường từ hệ thống thiết bị trên toàn bộ đội xe. Cập nhật theo thời gian thực.
          </p>
        </div>

        {/* Quick Stats Bento */}
        <div className="flex items-center gap-stack-md">
          <div className="flex flex-col items-center justify-center p-stack-sm px-stack-md bg-error-container text-on-error-container rounded-xl shadow-sm min-w-[100px] transition-transform hover:-translate-y-1">
            <span className="font-headline-md text-headline-md font-semibold font-mono">12</span>
            <span className="font-label-md text-label-md opacity-80 uppercase tracking-widest mt-unit">Khẩn cấp</span>
          </div>
          <div className="flex flex-col items-center justify-center p-stack-sm px-stack-md bg-secondary-container text-on-secondary-container rounded-xl shadow-sm min-w-[100px] transition-transform hover:-translate-y-1">
            <span className="font-headline-md text-headline-md font-semibold font-mono">48</span>
            <span className="font-label-md text-label-md opacity-80 uppercase tracking-widest mt-unit">Cảnh báo</span>
          </div>
          <div className="flex flex-col items-center justify-center p-stack-sm px-stack-md bg-surface-container-high text-on-surface rounded-xl shadow-sm min-w-[100px] transition-transform hover:-translate-y-1">
            <span className="font-headline-md text-headline-md font-semibold font-mono">156</span>
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest mt-unit">Thông tin</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row flex-1 gap-stack-lg px-container-margin pb-container-margin h-[calc(100vh-200px)]">
        
        {/* Left Panel: Filters & Settings (Sticky) */}
        <div className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-stack-lg bg-surface-container-lowest p-stack-lg rounded-2xl shadow-sm h-fit sticky top-24 border border-outline-variant/20">
          <div className="flex items-center justify-between pb-stack-sm">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Bộ lọc</h2>
            <button 
              onClick={() => setSeverityFilter({ emergency: true, warning: true, info: true })}
              className="text-primary font-label-md hover:underline font-bold"
            >
              Xóa tất cả
            </button>
          </div>

          {/* Severity Filter */}
          <div className="flex flex-col gap-stack-sm">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">
              Mức độ nghiêm trọng
            </label>
            <div className="flex flex-col gap-stack-xs">
              <label className="flex items-center justify-between p-stack-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors group">
                <div className="flex items-center gap-stack-sm">
                  <input 
                    type="checkbox"
                    checked={severityFilter.emergency}
                    onChange={e => setSeverityFilter({ ...severityFilter, emergency: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary" 
                  />
                  <div className="w-2 h-2 rounded-full bg-error"></div>
                  <span className="font-body-md text-body-md text-on-surface">Khẩn cấp</span>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface-variant group-hover:text-on-surface">12</span>
              </label>

              <label className="flex items-center justify-between p-stack-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors group">
                <div className="flex items-center gap-stack-sm">
                  <input 
                    type="checkbox"
                    checked={severityFilter.warning}
                    onChange={e => setSeverityFilter({ ...severityFilter, warning: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary" 
                  />
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-body-md text-body-md text-on-surface">Cảnh báo</span>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface-variant group-hover:text-on-surface">48</span>
              </label>

              <label className="flex items-center justify-between p-stack-sm rounded-lg hover:bg-surface-container cursor-pointer transition-colors group">
                <div className="flex items-center gap-stack-sm">
                  <input 
                    type="checkbox"
                    checked={severityFilter.info}
                    onChange={e => setSeverityFilter({ ...severityFilter, info: e.target.checked })}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary accent-primary" 
                  />
                  <div className="w-2 h-2 rounded-full bg-primary-fixed-dim"></div>
                  <span className="font-body-md text-body-md text-on-surface">Thông tin</span>
                </div>
                <span className="font-mono-data text-mono-data text-on-surface-variant group-hover:text-on-surface">156</span>
              </label>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex flex-col gap-stack-sm mt-stack-md">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">
              Thời gian
            </label>
            <div className="grid grid-cols-2 gap-stack-xs">
              <button 
                onClick={() => setTimeRange('today')}
                className={`font-body-sm py-stack-xs px-stack-sm rounded-lg text-center transition-colors ${
                  timeRange === 'today' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                Hôm nay
              </button>
              <button 
                onClick={() => setTimeRange('yesterday')}
                className={`font-body-sm py-stack-xs px-stack-sm rounded-lg text-center transition-colors ${
                  timeRange === 'yesterday' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                Hôm qua
              </button>
              <button 
                onClick={() => setTimeRange('7days')}
                className={`font-body-sm py-stack-xs px-stack-sm rounded-lg text-center transition-colors ${
                  timeRange === '7days' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                7 ngày qua
              </button>
              <button 
                onClick={() => setTimeRange('custom')}
                className={`font-body-sm py-stack-xs px-stack-sm rounded-lg text-center transition-colors ${
                  timeRange === 'custom' ? 'bg-primary text-on-primary shadow-sm font-bold' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'
                }`}
              >
                Tùy chỉnh
              </button>
            </div>
          </div>

          {/* Event Type Filter */}
          <div className="flex flex-col gap-stack-sm mt-stack-md">
            <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest font-bold">
              Loại sự kiện
            </label>
            <select 
              value={eventType}
              onChange={e => setEventType(e.target.value)}
              className="w-full bg-surface-container text-on-surface font-body-md p-stack-sm rounded-lg border-none focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="all">Tất cả sự kiện</option>
              <option value="speed">Vượt quá tốc độ</option>
              <option value="geofence">Rời khỏi khu vực (Geofence)</option>
              <option value="gps">Mất tín hiệu GPS</option>
              <option value="fuel">Cảnh báo nhiên liệu</option>
            </select>
          </div>

          {/* Export Button */}
          <button 
            onClick={() => setToast && setToast({ type: 'success', title: 'Xuất báo cáo thành công!', desc: 'File danh sách cảnh báo đã được tải xuống.' })}
            className="mt-auto flex items-center justify-center gap-stack-sm w-full bg-surface-container-high text-on-surface font-label-md py-stack-sm rounded-lg hover:bg-surface-variant transition-colors shadow-sm font-bold"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Xuất báo cáo
          </button>
        </div>

        {/* Right Panel: Alert List */}
        <div className="flex-1 flex flex-col min-h-0 bg-surface-container-lowest rounded-2xl shadow-sm overflow-hidden border border-outline-variant/20">
          
          {/* List Header */}
          <div className="flex items-center justify-between p-stack-md bg-surface-container-low border-b border-outline-variant/20 shadow-sm z-10">
            <div className="flex items-center gap-stack-md">
              <span className="font-body-md text-body-md text-on-surface-variant">
                Đang hiển thị <strong className="text-on-surface">60</strong> cảnh báo
              </span>
            </div>
            <div className="flex items-center gap-stack-sm">
              <button className="p-unit text-on-surface-variant hover:text-primary transition-colors bg-surface-container rounded-lg">
                <span className="material-symbols-outlined">refresh</span>
              </button>
              <button className="p-unit text-on-surface-variant hover:text-primary transition-colors bg-surface-container rounded-lg">
                <span className="material-symbols-outlined">view_list</span>
              </button>
              <button className="p-unit text-outline hover:text-on-surface transition-colors rounded-lg">
                <span className="material-symbols-outlined">grid_view</span>
              </button>
            </div>
          </div>

          {/* Alert Items Scrollable Area */}
          <div className="flex-1 overflow-y-auto p-stack-md flex flex-col gap-stack-sm custom-scrollbar relative">
            
            {/* Emergency Item 1 */}
            <div className="group relative flex flex-col lg:flex-row gap-stack-md p-stack-md bg-surface rounded-xl shadow-sm border-l-4 border-error hover:bg-surface-container-low transition-colors cursor-pointer overflow-hidden">
              <div className="absolute inset-y-0 left-0 w-1 bg-error/20 blur-sm group-hover:bg-error/40 transition-all"></div>
              
              <div className="flex-1 flex flex-col gap-unit min-w-0">
                <div className="flex items-center gap-stack-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-error-container text-on-error-container font-label-md text-[10px] uppercase tracking-wider font-bold">
                    Khẩn cấp
                  </span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant flex items-center gap-unit">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 14:32:05 - Hôm nay
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate mt-stack-xs group-hover:text-primary transition-colors">
                  Tai nạn được báo cáo - Cảm biến va chạm kích hoạt
                </h3>

                <div className="flex items-center gap-stack-lg mt-stack-sm">
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                    <span className="font-body-md font-semibold text-on-surface">Xe tải nặng 30F-123.45</span>
                  </div>
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                    <span className="font-body-md">Nguyễn Văn A (Tài xế chính)</span>
                  </div>
                </div>

                <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-xs line-clamp-1">
                  Hệ thống ghi nhận lực G vượt ngưỡng tại cảm biến phía trước xe. Yêu cầu liên hệ khẩn cấp với tài xế.
                </p>
              </div>

              {/* Mini Map Snapshot */}
              <div className="w-full lg:w-48 h-32 lg:h-auto rounded-lg overflow-hidden flex-shrink-0 relative shadow-sm group-hover:shadow-md transition-shadow">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAGDVwCWt7MHPubnvjtByvd9kuS4vQOsKLg7Y18D9WFGrTF4z5dooXhY79DOuGTClI4sVKSmAc3iZ8kRZoLbxpDSdNAUEKowHfgrDwMbFJq3W4tZhhJGfNYAlaXC1yCA4sKNrZj0M057uoOi1R0ph6plg8CvSJEWIaiE6Y9AkzK0898vxYZ-qKFbgjnYvN5LIZrpq0jvO84ScV5YYKDy2rQVFB8nKAtsJzaWaIsmIuYayO3xSR9fDdE')" }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface/80 to-transparent flex items-end p-stack-sm">
                  <span className="font-label-md text-label-md text-on-surface flex items-center gap-unit bg-surface-container-lowest/90 px-stack-xs py-unit rounded font-bold">
                    <span className="material-symbols-outlined text-[14px] text-error">location_on</span> Km 1824 QL1A
                  </span>
                </div>
              </div>

              {/* Hover Action Overlay */}
              <div className="absolute right-stack-md top-stack-md opacity-0 group-hover:opacity-100 transition-opacity flex gap-stack-sm">
                <button className="bg-primary text-on-primary font-label-md px-stack-md py-stack-xs rounded shadow-md hover:brightness-110 font-bold">
                  Xử lý ngay
                </button>
              </div>
            </div>

            {/* Warning Item 1 */}
            <div className="group relative flex flex-col lg:flex-row gap-stack-md p-stack-md bg-surface rounded-xl shadow-sm border-l-4 border-secondary hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex-1 flex flex-col gap-unit min-w-0">
                <div className="flex items-center gap-stack-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-md text-[10px] uppercase tracking-wider font-bold">
                    Cảnh báo
                  </span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant flex items-center gap-unit">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 13:15:22 - Hôm nay
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate mt-stack-xs group-hover:text-primary transition-colors">
                  Vượt quá tốc độ giới hạn (Cấp độ 2)
                </h3>

                <div className="flex items-center gap-stack-lg mt-stack-sm">
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                    <span className="font-body-md font-semibold text-on-surface">Container 51C-888.99</span>
                  </div>
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">speed</span>
                    <span className="font-mono-data text-error font-bold">95 km/h</span> 
                    <span className="text-body-sm">(Giới hạn: 80)</span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-48 h-24 lg:h-auto rounded-lg overflow-hidden flex-shrink-0 relative shadow-sm">
                <div 
                  className="w-full h-full bg-cover bg-center" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBAg9wO18n_rqXjRBBkSxNvajTsv38IqAE7v29KvAIaShZEQNnteyWr5CuDw1Fscv-n6ORvf3nnC19NT66S3PauC4LZHHYz4CiYRMufdxLXcyAMSa9BwTMPG0T9Ge99efwQU-yJ_9Ui6OB_DEobfiUZiX3RK0_3Vbn6-EY06ogF11zWfSThjEVg5DY3PraIc7GdeQRvqCaX-AOMH9IwXqQUhMZxz1ojcQWl6yN2-BnC9Efua-Uj8sQ7')" }}
                ></div>
              </div>
            </div>

            {/* Warning Item 2 (Geofence) */}
            <div className="group relative flex flex-col lg:flex-row gap-stack-md p-stack-md bg-surface rounded-xl shadow-sm border-l-4 border-secondary hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex-1 flex flex-col gap-unit min-w-0">
                <div className="flex items-center gap-stack-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-secondary-container text-on-secondary-container font-label-md text-[10px] uppercase tracking-wider font-bold">
                    Cảnh báo
                  </span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant flex items-center gap-unit">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 11:45:00 - Hôm nay
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate mt-stack-xs group-hover:text-primary transition-colors">
                  Phương tiện rời khỏi khu vực làm việc
                </h3>

                <div className="flex items-center gap-stack-lg mt-stack-sm">
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                    <span className="font-body-md font-semibold text-on-surface">Xe tải nhẹ 29D-456.78</span>
                  </div>
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">share_location</span>
                    <span className="font-body-md">Khu vực: Kho phân phối miền Nam</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Item 1 */}
            <div className="group relative flex flex-col lg:flex-row gap-stack-md p-stack-md bg-surface rounded-xl shadow-sm border-l-4 border-primary-fixed-dim hover:bg-surface-container-low transition-colors cursor-pointer">
              <div className="flex-1 flex flex-col gap-unit min-w-0">
                <div className="flex items-center gap-stack-sm">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-surface-container-high text-on-surface font-label-md text-[10px] uppercase tracking-wider font-bold">
                    Thông tin
                  </span>
                  <span className="font-mono-data text-mono-data text-on-surface-variant flex items-center gap-unit">
                    <span className="material-symbols-outlined text-[14px]">schedule</span> 09:10:15 - Hôm nay
                  </span>
                </div>

                <h3 className="font-headline-sm text-headline-sm text-on-surface truncate mt-stack-xs group-hover:text-primary transition-colors">
                  Bắt đầu hành trình mới
                </h3>

                <div className="flex items-center gap-stack-lg mt-stack-sm">
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                    <span className="font-body-md font-semibold text-on-surface">Đầu kéo 15C-112.22</span>
                  </div>
                  <div className="flex items-center gap-stack-xs text-on-surface-variant">
                    <span className="material-symbols-outlined text-[16px]">route</span>
                    <span className="font-body-md">Lộ trình: Cảng Hải Phòng -&gt; KCN Yên Phong</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-stack-md p-stack-sm bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/20">
              <span className="font-body-sm text-on-surface-variant">Hiển thị 1 - 4 trên 60</span>
              <div className="flex gap-unit">
                <button className="p-unit rounded bg-surface hover:bg-surface-container text-outline shadow-sm disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-8 h-8 rounded bg-primary text-on-primary font-mono-data shadow-sm flex items-center justify-center font-bold">
                  1
                </button>
                <button className="w-8 h-8 rounded bg-surface hover:bg-surface-container text-on-surface font-mono-data shadow-sm flex items-center justify-center transition-colors">
                  2
                </button>
                <button className="w-8 h-8 rounded bg-surface hover:bg-surface-container text-on-surface font-mono-data shadow-sm flex items-center justify-center transition-colors">
                  3
                </button>
                <span className="w-8 h-8 flex items-center justify-center text-outline">...</span>
                <button className="p-unit rounded bg-surface hover:bg-surface-container text-on-surface shadow-sm transition-colors">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
