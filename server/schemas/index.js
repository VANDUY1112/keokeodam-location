import { z } from 'zod';

// ─── Authentication Schemas ───
export const loginSchema = z.object({
  email: z.string().min(3, 'Tài khoản phải từ 3 ký tự').max(100),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự').max(100)
});

export const registerUserSchema = z.object({
  email: z.string().email('Email không đúng định dạng').max(100),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự').max(100),
  fullName: z.string().min(2, 'Họ tên quá ngắn').max(100),
  role: z.enum(['admin', 'staff', 'driver']).default('staff'),
  avatarUrl: z.string().url().optional()
});

// ─── Speaker Schemas ───
export const createSpeakerSchema = z.object({
  id: z.string().min(2).max(20),
  name: z.string().min(3).max(150),
  model: z.string().max(100).optional(),
  powerWatts: z.number().int().positive().default(600),
  hourlyRate: z.number().int().positive().default(60000),
  depositAmount: z.number().int().nonnegative().default(500000),
  status: z.enum(['available', 'renting', 'maintenance']).default('available'),
  batteryPercent: z.number().int().min(0).max(100).default(100),
  lat: z.number().optional(),
  lng: z.number().optional(),
  address: z.string().max(255).optional(),
  serialNumber: z.string().max(100).optional(),
  imageUrl: z.string().url().optional()
});

export const updateSpeakerSchema = createSpeakerSchema.partial();

// ─── Rental & Order Schemas ───
export const createRentalSchema = z.object({
  speakerId: z.string().min(1),
  customerName: z.string().min(2).max(100),
  customerPhone: z.string().min(9).max(15),
  address: z.string().min(1).max(255),
  startLat: z.number().optional(),
  startLng: z.number().optional(),
  destLat: z.number().optional(),
  destLng: z.number().optional(),
  pathCoordinates: z.union([z.string(), z.array(z.any())]).optional(),
  durationHours: z.number().positive().default(4),
  rentPrice: z.number().int().nonnegative(),
  shippingFee: z.number().int().nonnegative().default(0),
  totalAmount: z.number().int().nonnegative(),
  depositAmount: z.number().int().nonnegative().default(500000),
  depositStatus: z.enum(['Đã giữ cọc', 'Đã hoàn cọc']).default('Đã giữ cọc'),
  note: z.string().max(500).optional()
});

export const updateRentalStatusSchema = z.object({
  status: z.enum(['active', 'completed', 'cancelled']),
  depositStatus: z.enum(['Đã giữ cọc', 'Đã hoàn cọc']).optional(),
  note: z.string().max(500).optional()
});

// ─── GPS Telemetry Schema ───
export const gpsPingSchema = z.object({
  speakerId: z.string().min(1),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  speedKmh: z.number().nonnegative().default(0),
  heading: z.number().min(0).max(360).default(0),
  batteryPercent: z.number().int().min(0).max(100).optional()
});

// ─── Expense Schema ───
export const createExpenseSchema = z.object({
  title: z.string().min(3).max(200),
  amount: z.number().int().positive(),
  category: z.string().min(2).max(100),
  subtitle: z.string().max(100).optional(),
  icon: z.string().max(50).default('receipt'),
  status: z.enum(['Đã duyệt', 'Chờ duyệt', 'Từ chối']).default('Đã duyệt'),
  receiptUrl: z.string().url().optional()
});
