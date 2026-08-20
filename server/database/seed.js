import bcrypt from 'bcryptjs';
import { db } from './db.js';

export async function seedDatabase() {
  // Check if users already exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  console.log('🌱 Seeding initial database records for Locahome...');

  const passwordHash = await bcrypt.hash('admin123456', 12);

  // 1. Seed Default Admin & Staff
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr-admin-1',
    'admin@locahome.vn',
    passwordHash,
    'Trần Anh Tuấn',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  insertUser.run(
    'usr-staff-1',
    'shipper1@locahome.vn',
    passwordHash,
    'Nguyễn Văn Hùng',
    'driver',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
  );

  // 2. Seed Speakers
  const insertSpeaker = db.prepare(`
    INSERT INTO speakers (id, name, model, power_watts, hourly_rate, deposit_amount, status, battery_percent, lat, lng, address, serial_number, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const speakersData = [
    {
      id: 'LKK-01',
      name: 'Loa Bass 40 Nanomax (800W)',
      model: 'Nanomax SK-15X',
      power_watts: 800,
      hourly_rate: 60000,
      deposit_amount: 500000,
      status: 'renting',
      battery_percent: 85,
      lat: 10.8522,
      lng: 106.7725,
      address: '145 Kha Vạn Cân, P. Linh Trung, TP. Thủ Đức',
      serial_number: 'NANO-800-0192',
      image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'LKK-02',
      name: 'Loa Bass 50 Đôi Khủng (1200W)',
      model: 'JBL PartyBox Max 50',
      power_watts: 1200,
      hourly_rate: 90000,
      deposit_amount: 1000000,
      status: 'renting',
      battery_percent: 68,
      lat: 10.8499,
      lng: 106.7711,
      address: '78 Võ Văn Ngân, P. Bình Thọ, TP. Thủ Đức',
      serial_number: 'JBL-1200-8841',
      image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'LKK-03',
      name: 'Loa 4 Tấc Đôi Sân Khấu (1000W)',
      model: 'Acynos K-400 Pro',
      power_watts: 1000,
      hourly_rate: 75000,
      deposit_amount: 800000,
      status: 'available',
      battery_percent: 100,
      lat: 10.8505,
      lng: 106.7718,
      address: 'Kho Tổng Locahome - 10 Kha Vạn Cân, TP. Thủ Đức',
      serial_number: 'ACYNOS-1000-3329',
      image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'LKK-04',
      name: 'Loa Dalton 600W Xách Tay',
      model: 'Dalton TS-12G',
      power_watts: 600,
      hourly_rate: 50000,
      deposit_amount: 400000,
      status: 'renting',
      battery_percent: 52,
      lat: 10.8465,
      lng: 106.7689,
      address: '24 Đường số 6, P. Linh Chiểu, TP. Thủ Đức',
      serial_number: 'DALTON-600-9921',
      image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'LKK-05',
      name: 'Loa Kéo Koda Mini 350W',
      model: 'Koda KD-350',
      power_watts: 350,
      hourly_rate: 40000,
      deposit_amount: 300000,
      status: 'available',
      battery_percent: 95,
      lat: 10.8505,
      lng: 106.7718,
      address: 'Kho Tổng Locahome - 10 Kha Vạn Cân, TP. Thủ Đức',
      serial_number: 'KODA-350-1102',
      image_url: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=400&auto=format&fit=crop&q=80'
    },
  ];

  for (const s of speakersData) {
    insertSpeaker.run(
      s.id, s.name, s.model, s.power_watts, s.hourly_rate, s.deposit_amount,
      s.status, s.battery_percent, s.lat, s.lng, s.address, s.serial_number, s.image_url
    );
  }

  // 3. Seed Active Rentals & Orders
  const insertRental = db.prepare(`
    INSERT INTO rentals (id, speaker_id, customer_name, customer_phone, address, dest_lat, dest_lng, start_time, duration_hours, rent_price, shipping_fee, total_amount, deposit_amount, deposit_status, status, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const rentalsData = [
    {
      id: 'ORD-2026-001',
      speaker_id: 'LKK-01',
      customer_name: 'Anh Hoàng (Tiệc Sinh Nhật)',
      customer_phone: '0903123456',
      address: '145 Kha Vạn Cân, P. Linh Trung, TP. Thủ Đức',
      dest_lat: 10.8522,
      dest_lng: 106.7725,
      start_time: new Date(Date.now() - 3600000 * 3).toISOString(),
      duration_hours: 4,
      rent_price: 240000,
      shipping_fee: 40000,
      total_amount: 280000,
      deposit_amount: 500000,
      deposit_status: 'Đã giữ cọc',
      status: 'active',
      note: 'Giao kèm 2 mic sạc đầy pin và 1 dây nối jack 3.5mm'
    },
    {
      id: 'ORD-2026-002',
      speaker_id: 'LKK-02',
      customer_name: 'Quán Nhậu 79 (Khai Trương)',
      customer_phone: '0918776655',
      address: '78 Võ Văn Ngân, P. Bình Thọ, TP. Thủ Đức',
      dest_lat: 10.8499,
      dest_lng: 106.7711,
      start_time: new Date(Date.now() - 3600000 * 5).toISOString(),
      duration_hours: 6,
      rent_price: 540000,
      shipping_fee: 50000,
      total_amount: 590000,
      deposit_amount: 1000000,
      deposit_status: 'Đã giữ cọc',
      status: 'active',
      note: 'Thuê ca dài 6 tiếng đến 22h đêm'
    },
    {
      id: 'ORD-2026-003',
      speaker_id: 'LKK-04',
      customer_name: 'Chị Mai (Gia Đình Hát Karaoke)',
      customer_phone: '0938441122',
      address: '24 Đường số 6, P. Linh Chiểu, TP. Thủ Đức',
      dest_lat: 10.8465,
      dest_lng: 106.7689,
      start_time: new Date(Date.now() - 3600000 * 2).toISOString(),
      duration_hours: 3,
      rent_price: 150000,
      shipping_fee: 30000,
      total_amount: 180000,
      deposit_amount: 400000,
      deposit_status: 'Đã giữ cọc',
      status: 'active',
      note: 'Yêu cầu mic hút âm tốt'
    }
  ];

  for (const r of rentalsData) {
    insertRental.run(
      r.id, r.speaker_id, r.customer_name, r.customer_phone, r.address,
      r.dest_lat, r.dest_lng, r.start_time, r.duration_hours, r.rent_price,
      r.shipping_fee, r.total_amount, r.deposit_amount, r.deposit_status, r.status, r.note
    );
  }

  // 4. Seed Expenses
  const insertExpense = db.prepare(`
    INSERT INTO expenses (id, title, amount, category, subtitle, icon, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const expensesData = [
    {
      id: 'EXP-01',
      title: 'Bảo dưỡng định kỳ 2 micro UHF & thay pin sạc',
      amount: 550000,
      category: 'Bảo trì thiết bị',
      subtitle: '17:30 • Hôm nay',
      icon: 'mic',
      status: 'Đã duyệt'
    },
    {
      id: 'EXP-02',
      title: 'Ăn trưa tiếp đối tác thuê loa sự kiện',
      amount: 350000,
      category: 'Ăn uống & Tiếp khách',
      subtitle: '11:45 • Hôm nay',
      icon: 'restaurant',
      status: 'Đã duyệt'
    },
    {
      id: 'EXP-03',
      title: 'Đổ xăng xe máy giao loa 3 đơn Quận 1 & Thủ Đức',
      amount: 120000,
      category: 'Nhiên liệu & Xăng xe',
      subtitle: '08:15 • Hôm nay',
      icon: 'local_gas_station',
      status: 'Đã duyệt'
    },
    {
      id: 'EXP-04',
      title: 'Mua dây cáp tín hiệu âm thanh Canon & Jack 6.5mm',
      amount: 680000,
      category: 'Phụ kiện',
      subtitle: 'Hôm qua',
      icon: 'cable',
      status: 'Chờ duyệt'
    }
  ];

  for (const e of expensesData) {
    insertExpense.run(e.id, e.title, e.amount, e.category, e.subtitle, e.icon, e.status);
  }

  // 5. Seed System Settings
  const insertSetting = db.prepare(`
    INSERT INTO settings (key, value) VALUES (?, ?)
  `);

  insertSetting.run('warehouse_location', JSON.stringify({
    name: 'Kho Tổng Locahome',
    address: '10 Kha Vạn Cân, Linh Đông, TP. Thủ Đức, TP.HCM',
    lat: 10.8505,
    lng: 106.7718,
    radiusKm: 15
  }));

  insertSetting.run('pricing_rules', JSON.stringify({
    baseShippingFee: 30000,
    perKmFee: 5000,
    nightSurchargePercent: 20,
    depositRequired: true
  }));

  insertSetting.run('gps_alerts', JSON.stringify({
    lowBatteryThreshold: 20,
    outOfGeofenceAlert: true,
    overspeedThresholdKmH: 50
  }));

  // 6. Seed Customer Reviews & Owner Replies
  seedReviewsIfEmpty();

  console.log('✅ Seeding completed successfully.');
}

export function seedReviewsIfEmpty() {
  try {
    const reviewCount = db.prepare('SELECT COUNT(*) as count FROM reviews').get().count;
    if (reviewCount > 0) return;

    console.log('📝 Seeding initial reviews & owner replies...');
    const insertReview = db.prepare(`
      INSERT INTO reviews (
        id, name, role, rating, category, comment, avatar_url,
        avatar_letter, avatar_color, color_scheme, title, banner_image,
        verified, post_time_formatted, owner_reply, owner_reply_at, owner_reply_by, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const initialReviews = [
      {
        id: 'REV-1',
        name: 'Trần Văn Nam',
        role: 'Thuê Puffy Bass Pro',
        category: 'karaoke',
        rating: 5,
        comment: 'Âm bass đập cực chắc, pin trâu hát cả đêm không hết! Thật sự rất bất ngờ với ngoại hình nhỏ bé mà âm thanh khủng thế này.',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBG39jxglMBvLSQP8WYNkmznOolrZS8IKVbiCnb14ABWu84BCV_Awt5FmaZ7eOgs0aN_yEGHcKfRswVx7dgGKCjSneartsqRRlyiRwywkXlHZQ-R_ZqGyEndlrBfP_phDzuaQz5uTuO0sDyW8l84RRVYchvsTRJzK-OjUzwmR6Ww1OIM2Z8HuxK1pxu9xzgAS_Le50pPfL-LQcRhZl6fnBnixRKUfdomciUZBpiqHJyEV1b3BuVgyVF',
        avatar_letter: 'N',
        avatar_color: 'pink',
        color_scheme: 'pink',
        title: null,
        banner_image: null,
        verified: 1,
        post_time_formatted: '19:30 19/08/2026',
        owner_reply: 'Dạ cảm ơn anh Nam nhiều ạ! Dòng Bass Pro 40 bên em chuyên trị các dòng nhạc sôi động và bolero. Lần tới thuê alo em giảm giá ưu đãi khách quen nhé anh ❤️',
        owner_reply_at: '20:10 19/08/2026',
        owner_reply_by: 'Kẹo Kéo Dặm',
        created_at: '2026-08-19 19:30:00'
      },
      {
        id: 'REV-2',
        name: 'Lê Thị Mai',
        role: 'Cứu Hộ Tiệc Sinh Nhật',
        category: 'party',
        rating: 5,
        comment: 'Dịch vụ siêu nhanh! Mình gọi điện đặt gấp, 30 phút sau loa đã có mặt tại nhà. Các bạn nhân viên siêu dễ thương và nhiệt tình hướng dẫn.',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDViO73UAoF3-TwSek3tM-NwCVDgAkSME_ATkVbzHd6E7q49HiMURLPXkE7jOAn8wHCMUL9uy2nT6QiYtUMb6fSd9n84vxHtgA_9FOJqmfYLprQHuFSQpATZQeZJmP_O-ojrTIcaVktaRItYXqnOe6i6lR-cc2GKPEK027sOShe1xVVlOPztso3s6BqRuZqr9_3X5huU_xsjMnuP4rV14_Jdat8lx1d9cUlqZpv07P3erTfO5Fqcfql',
        avatar_letter: 'M',
        avatar_color: 'blue',
        color_scheme: 'blue',
        title: null,
        banner_image: null,
        verified: 1,
        post_time_formatted: '14:15 18/08/2026',
        owner_reply: 'Locahome luôn cam kết giao hỏa tốc 30 phút bất kể mưa nắng ạ. Chúc chị Mai có một sinh nhật thật nhiều niềm vui và hạnh phúc nhé!',
        owner_reply_at: '15:00 18/08/2026',
        owner_reply_by: 'Kẹo Kéo Dặm',
        created_at: '2026-08-18 14:15:00'
      },
      {
        id: 'REV-3',
        name: 'Nguyễn Tấn Đạt',
        role: 'Hát Bolero Cuối Tuần',
        category: 'karaoke',
        rating: 4,
        comment: 'Mic hát cực nhẹ, không bị hú dù đứng gần loa. Phù hợp cho những ai đam mê bolero như gia đình mình cuối tuần.',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxtDafNm7kkFj56vltInH7glM_OI-Pmpxu4t3jtCldR1E5Q01z9Sph6dej69uZcePS4qi0J__9t3HXYuREQEKWSXHdy8457eFHhdikvjNMfOlcQKd6Fv8I6RKFcKFXIj5JkJie2uIdg3-Nn35rkNI6fOtG9sMBDZoQSiTI_lRN5-zbifZqRZseAwFJMSD3giXDUV7_jHtDgBFInDv6FqMJHE0UgGaskeXZiqFf3dX1WI5Sm_RsA19f',
        avatar_letter: 'Đ',
        avatar_color: 'green',
        color_scheme: 'green',
        title: null,
        banner_image: null,
        verified: 1,
        post_time_formatted: '20:00 17/08/2026',
        owner_reply: null,
        owner_reply_at: null,
        owner_reply_by: null,
        created_at: '2026-08-17 20:00:00'
      },
      {
        id: 'REV-4',
        name: 'Sarah J.',
        role: 'Chủ Tiệc Birthday',
        category: 'party',
        rating: 5,
        comment: 'Mình thuê dàn Mega Puff cho tiệc sinh nhật. Âm thanh cực đỉnh, bass rung sàn mà loa lại nhìn quá đỗi đáng yêu, bạn bè chụp ảnh selfie check-in suốt buổi!',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBCQYPFv-WTIF8HKSwFaCz2WzJp51sU6xR2sN-3XNgWLJU3eFIGhqCNAArpwq11_FMzKP9qCCrxyCCMP0YIMakgjL68j47OJwcTKc3F5JZTOBiMlL4MiyqUYzlNlOi2gSDd953GAsD3ER5cmLfzZHNkVHItWwm_833unxG7xgMblN3Y2aWLsHbRYmx6eIw1Ten2jy6koYp9jo0J8yHdBazaGAzkxnAmKBKUgIcyMdQGKv8cqu9yyCrM',
        avatar_letter: 'S',
        avatar_color: 'pink',
        color_scheme: 'imageCard',
        title: 'Buổi Tiệc Tuyệt Vời Nhất',
        banner_image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAeMXmIMPw2bEqBuBSF_-hbAsvy7I3USk5EK0WSaanKsmvrbSSeI0DwWRKwHSuxAKBl-Sod5xC3RfKG24XO8QUbjMHjGOyRkEU70hOw8wLTB9sPEUV6-69lHd66kOj_SEwKAcTrHiCa2NFZA0N4DNcejMWpl4kut_QqFbg3CLXJITlP3SbrO0ETo3n2SdJjgNQkTuPQtJd0y2Q2KCCSaKZ3rcAWFxpgX7vmv6bzXF9zdyUZDQHQqQin',
        verified: 1,
        post_time_formatted: '21:30 16/08/2026',
        owner_reply: null,
        owner_reply_at: null,
        owner_reply_by: null,
        created_at: '2026-08-16 21:30:00'
      },
      {
        id: 'REV-5',
        name: 'Kimberly W.',
        role: 'Gia Đình Chung Cư',
        category: 'karaoke',
        rating: 5,
        comment: 'Loa nhỏ gọn xinh xắn để trong phòng khách rất sang. Âm thanh trong trẻo, mở phim nghe như rạp chiếu bóng!',
        avatar_url: null,
        avatar_letter: 'K',
        avatar_color: 'blue',
        color_scheme: 'whiteCard',
        title: null,
        banner_image: null,
        verified: 1,
        post_time_formatted: '11:20 15/08/2026',
        owner_reply: null,
        owner_reply_at: null,
        owner_reply_by: null,
        created_at: '2026-08-15 11:20:00'
      },
      {
        id: 'REV-6',
        name: 'Alex Chen',
        role: 'Quản Lý Nhân Sự (HR)',
        category: 'company',
        rating: 5,
        comment: 'Cả công ty thuê dàn đôi đi dã ngoại. Mọi người hát hò gắn kết vui vẻ từ chiều đến khuya, pin loa dùng mãi không hết.',
        avatar_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAf9RwyMAsqXVrzUYdyVkyDLsATlf0LhZRQU9sENL6o5dY1NrYaknEIVH4In5iuZv4FDmpBzniReRwWXg7YnyHufFMIaHwl9MTFpMMqOpIFsVG8K-8kDwyvi9agIomt3JUH4OBKkHRpA7FXzwqzu5GVBaSKL8uytdPb4BeSQDwMO3cA6nL-pcUBJjYprUBwtQx-eDqZtTqcDB8ok40gPO8zE1MLFikoGQNRM5t_NmM6qwtnl_iTd7UG',
        avatar_letter: 'A',
        avatar_color: 'purple',
        color_scheme: 'darkCard',
        title: null,
        banner_image: null,
        verified: 1,
        post_time_formatted: '09:45 13/08/2026',
        owner_reply: null,
        owner_reply_at: null,
        owner_reply_by: null,
        created_at: '2026-08-13 09:45:00'
      }
    ];

    for (const r of initialReviews) {
      insertReview.run(
        r.id, r.name, r.role, r.rating, r.category, r.comment,
        r.avatar_url, r.avatar_letter, r.avatar_color, r.color_scheme,
        r.title, r.banner_image, r.verified, r.post_time_formatted,
        r.owner_reply, r.owner_reply_at, r.owner_reply_by, r.created_at
      );
    }
  } catch (err) {
    console.warn('[Seed Reviews Warning]:', err.message);
  }
}
