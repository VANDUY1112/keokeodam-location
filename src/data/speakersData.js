export const HOME_LOCATION = {
  name: "Nhà & Kho Loa Chính",
  address: "Số 45 Đường Số 8, Linh Xuân, TP. Thủ Đức, TP. Hồ Chí Minh",
  lat: 10.8752,
  lng: 106.7725,
  coords: { x: 50, y: 50 } // Center of map
};

export const INITIAL_SPEAKERS = [
  {
    id: "LKK-01",
    name: "Loa Kéo Bass 40 Khủng (Nanomax Pro 800W)",
    type: "Bass 40 Đơn - 800W",
    serial: "NMX-800W-01",
    status: "renting", // 'available' | 'renting' | 'delivering' | 'returning' | 'charging'
    statusLabel: "Khách đang thuê",
    battery: 82, // %
    mics: 2, // 2 micro không dây
    hasCharger: true,
    hourlyRate: 80000, // 80,000 VNĐ / giờ
    currentRental: {
      customerName: "Anh Tuấn (Tiệc Sinh Nhật)",
      customerPhone: "0908 123 456",
      address: "128 Đường Số 5, Phường Linh Trung, Thủ Đức",
      coords: { x: 68, y: 35 },
      lat: 10.8654,
      lng: 106.7820,
      startTime: "11:30", // Giờ check-in giao loa
      startTimestamp: Date.now() - (3 * 3600 * 1000 + 25 * 60 * 1000), // Đã thuê 3h25m
      distanceKm: 3.8, // Quãng đường từ nhà đến khách
      shippingFee: 20000, // Phí ship
      deposit: 200000, // Tiền cọc (nếu có)
      notes: "Khách lấy thêm 4 viên pin tiểu micro dự phòng"
    },
    totalRentalsCount: 48,
    totalRevenue: 14850000,
    totalDistanceKm: 215.4
  },
  {
    id: "LKK-02",
    name: "Loa Kéo Bass 50 Đôi Khủng (AcNos Sân Vườn 1200W)",
    type: "Bass 50 Đôi - 1200W",
    serial: "ACN-1200W-02",
    status: "renting",
    statusLabel: "Khách đang thuê",
    battery: 65,
    mics: 2,
    hasCharger: true,
    hourlyRate: 100000, // 100,000 VNĐ / giờ
    currentRental: {
      customerName: "Chị Lan (Tiệc Tất Niên Công Ty)",
      customerPhone: "0912 345 678",
      address: "Quán Ăn Gia Đình, 79 Tô Ngọc Vân, Tam Phú, Thủ Đức",
      coords: { x: 32, y: 65 },
      lat: 10.8521,
      lng: 106.7530,
      startTime: "13:00",
      startTimestamp: Date.now() - (1 * 3600 * 1000 + 45 * 60 * 1000), // Đã thuê 1h45m
      distanceKm: 5.2,
      shippingFee: 30000,
      deposit: 500000,
      notes: "Cần micro hát nhẹ, đã test micro tốt"
    },
    totalRentalsCount: 62,
    totalRevenue: 22400000,
    totalDistanceKm: 310.8
  },
  {
    id: "LKK-03",
    name: "Loa Kẹo Kéo Xách Tay Mini (JBZ Cao Cấp 400W)",
    type: "Loa Xách Tay Gọn - 400W",
    serial: "JBZ-400W-03",
    status: "available",
    statusLabel: "Tại nhà / Sẵn sàng",
    battery: 100,
    mics: 2,
    hasCharger: true,
    hourlyRate: 60000, // 60,000 VNĐ / giờ
    currentRental: null,
    totalRentalsCount: 35,
    totalRevenue: 8900000,
    totalDistanceKm: 142.0
  },
  {
    id: "LKK-04",
    name: "Loa Kéo Bass 40 Đơn Có Đèn Led (Dalton 600W)",
    type: "Bass 40 Đơn - 600W",
    serial: "DLT-600W-04",
    status: "renting",
    statusLabel: "Khách đang thuê",
    battery: 55,
    mics: 2,
    hasCharger: true,
    hourlyRate: 70000,
    currentRental: {
      customerName: "Anh Dũng (Khai Trương Cửa Hàng)",
      customerPhone: "0933 888 999",
      address: "245 Kha Vạn Cân, Hiệp Bình Chánh, Thủ Đức",
      coords: { x: 25, y: 30 },
      lat: 10.8350,
      lng: 106.7280,
      startTime: "10:15",
      startTimestamp: Date.now() - (4 * 3600 * 1000 + 40 * 60 * 1000), // Đã thuê 4h40m (Cảnh báo quá 4h)
      distanceKm: 7.6,
      shippingFee: 40000,
      deposit: 300000,
      notes: "Thuê từ sáng, gọi hỏi gia hạn lúc 14:00"
    },
    totalRentalsCount: 54,
    totalRevenue: 16200000,
    totalDistanceKm: 280.5
  },
  {
    id: "LKK-05",
    name: "Loa Kéo Bass 30 Gọn Nhẹ (Best Sound 450W)",
    type: "Bass 30 Đơn - 450W",
    serial: "BST-450W-05",
    status: "available",
    statusLabel: "Tại nhà / Sẵn sàng",
    battery: 95,
    mics: 2,
    hasCharger: true,
    hourlyRate: 60000,
    currentRental: null,
    totalRentalsCount: 29,
    totalRevenue: 7100000,
    totalDistanceKm: 98.4
  },
  {
    id: "LKK-06",
    name: "Loa Kéo 4 Tấc Đôi Sân Khấu (Temeisheng 1000W)",
    type: "Bass 40 Đôi - 1000W",
    serial: "TMS-1000W-06",
    status: "returning",
    statusLabel: "Đang chở về nhà",
    battery: 40,
    mics: 2,
    hasCharger: true,
    hourlyRate: 90000,
    currentRental: {
      customerName: "Bác Hùng (Đám Giỗ Gia Đình)",
      customerPhone: "0977 654 321",
      address: "18 Đường 12, Phường Tăng Nhơn Phú B, Quận 9",
      coords: { x: 75, y: 70 },
      lat: 10.8420,
      lng: 106.7910,
      startTime: "09:00",
      startTimestamp: Date.now() - (5 * 3600 * 1000), // Đã hát xong 5 tiếng
      distanceKm: 6.4,
      shippingFee: 35000,
      deposit: 0,
      notes: "Khách đã trả tiền mặt, shipper đang chở loa về kho"
    },
    totalRentalsCount: 41,
    totalRevenue: 13500000,
    totalDistanceKm: 245.0
  }
];

export const RECENT_RENTAL_LOGS = [
  {
    id: "LOG-1089",
    speakerId: "LKK-03",
    speakerName: "Loa Xách Tay Mini JBZ",
    customerName: "Chú Bảy (Hát Giao Lưu)",
    customerPhone: "0903 555 777",
    address: "Hẻm 48 Đường Linh Đông, Thủ Đức",
    rentHours: 3.5,
    hourlyRate: 60000,
    distanceKm: 3.2,
    shippingFee: 20000,
    totalAmount: 230000, // 3.5 * 60k + 20k
    checkinOutTime: "08:30 - 12:00 Hôm nay",
    status: "completed",
    statusLabel: "Đã hoàn thành & Đã về kho"
  },
  {
    id: "LOG-1088",
    speakerId: "LKK-05",
    speakerName: "Loa Bass 30 Best Sound",
    customerName: "Anh Hoàng (Tiệc Nướng BBQ)",
    customerPhone: "0918 222 333",
    address: "Chung cư Flora Novia, Phạm Văn Đồng",
    rentHours: 4.0,
    hourlyRate: 60000,
    distanceKm: 4.5,
    shippingFee: 25000,
    totalAmount: 265000, // 4 * 60k + 25k
    checkinOutTime: "Hôm qua 17:00 - 21:00",
    status: "completed",
    statusLabel: "Đã hoàn thành & Đã về kho"
  },
  {
    id: "LOG-1087",
    speakerId: "LKK-01",
    speakerName: "Loa Kéo Bass 40 Nanomax",
    customerName: "Chị Nga (Liên Hoan Xóm)",
    customerPhone: "0938 111 222",
    address: "Khu Phố 6, Phường Linh Trung",
    rentHours: 5.0,
    hourlyRate: 80000,
    distanceKm: 2.5,
    shippingFee: 15000,
    totalAmount: 415000, // 5 * 80k + 15k
    checkinOutTime: "Hôm qua 15:30 - 20:30",
    status: "completed",
    statusLabel: "Đã hoàn thành & Đã về kho"
  }
];

export const BUSINESS_SUMMARY = {
  totalSpeakers: 6,
  rentingCount: 3,
  availableCount: 2,
  returningCount: 1,
  todayRevenueEstimate: 1280000, // VNĐ
  todayDistanceKm: 34.6, // km
  completedOrdersToday: 2
};
