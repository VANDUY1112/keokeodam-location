import bcrypt from 'bcryptjs';
import { db } from './db.js';

export async function seedDatabase() {
  // Check if users already exist
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
  if (userCount > 0) {
    return; // Already seeded
  }

  console.log('🌱 Seeding initial database records for Locahome...');

  const defaultAdminHash = await bcrypt.hash('Denyeubama1', 12);

  // 1. Seed Default Admin & Staff
  const insertUser = db.prepare(`
    INSERT OR REPLACE INTO users (id, email, password_hash, full_name, role, avatar_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertUser.run(
    'usr-admin-hotadam',
    'hotadam',
    defaultAdminHash,
    'Hồ Văn Duy',
    'admin',
    '/pink.png'
  );

  insertUser.run(
    'usr-admin-nguyenaidiep',
    'nguyenaidiep',
    defaultAdminHash,
    'Nguyễn Ái Diệp',
    'admin',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  );

  insertUser.run(
    'usr-staff-1',
    'shipper1@locahome.vn',
    defaultAdminHash,
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

  // 3. Seed Active Rentals & Orders (Empty - only real user orders)
  const insertRental = db.prepare(`
    INSERT INTO rentals (id, speaker_id, customer_name, customer_phone, address, dest_lat, dest_lng, start_time, duration_hours, rent_price, shipping_fee, total_amount, deposit_amount, deposit_status, status, note)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const rentalsData = [];

  for (const r of rentalsData) {
    insertRental.run(
      r.id, r.speaker_id, r.customer_name, r.customer_phone, r.address,
      r.dest_lat, r.dest_lng, r.start_time, r.duration_hours, r.rent_price,
      r.shipping_fee, r.total_amount, r.deposit_amount, r.deposit_status, r.status, r.note
    );
  }

  // 4. Seed Expenses (Empty - only real expenses)
  const insertExpense = db.prepare(`
    INSERT INTO expenses (id, title, amount, category, subtitle, icon, status)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const expensesData = [];

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
  // Empty - Starting fresh without mock reviews
}
