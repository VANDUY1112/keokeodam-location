-- ══════════════════════════════════════════════════════════════════════════════
-- 🚀 SUPABASE DATABASE SCHEMA CHO TIỆM THUÊ LOA KÉO KEOKEODAM / LOCAHOME
-- ══════════════════════════════════════════════════════════════════════════════

-- 1. BẢNG LOA KÉO & THIẾT BỊ (SPEAKERS)
CREATE TABLE IF NOT EXISTS public.speakers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT,
  power_watts INTEGER NOT NULL DEFAULT 600,
  hourly_rate INTEGER NOT NULL DEFAULT 60000,
  deposit_amount INTEGER NOT NULL DEFAULT 500000,
  status TEXT NOT NULL DEFAULT 'available', -- 'available', 'renting', 'maintenance'
  battery_percent INTEGER NOT NULL DEFAULT 100,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  address TEXT,
  serial_number TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BẢNG ĐƠN THUÊ LOA & LỊCH SỬ CHUYẾN GIAO (RENTALS)
CREATE TABLE IF NOT EXISTS public.rentals (
  id TEXT PRIMARY KEY,
  speaker_id TEXT REFERENCES public.speakers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  address TEXT NOT NULL,
  dest_lat DOUBLE PRECISION,
  dest_lng DOUBLE PRECISION,
  start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration_hours DOUBLE PRECISION NOT NULL DEFAULT 4,
  rent_price INTEGER NOT NULL DEFAULT 240000,
  shipping_fee INTEGER NOT NULL DEFAULT 40000,
  total_amount INTEGER NOT NULL DEFAULT 280000,
  deposit_amount INTEGER NOT NULL DEFAULT 500000,
  deposit_status TEXT NOT NULL DEFAULT 'Đã giữ cọc', -- 'Đã giữ cọc', 'Đã hoàn cọc'
  status TEXT NOT NULL DEFAULT 'active', -- 'active', 'completed', 'cancelled'
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. BẢNG THU CHI & HÓA ĐƠN (EXPENSES)
CREATE TABLE IF NOT EXISTS public.expenses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  amount INTEGER NOT NULL,
  category TEXT NOT NULL, -- 'Nhiên liệu & Xăng xe', 'Bảo trì thiết bị', 'Ăn uống & Tiếp khách', 'Phụ kiện', 'Khác'
  subtitle TEXT,
  icon TEXT DEFAULT 'receipt',
  status TEXT NOT NULL DEFAULT 'Đã duyệt', -- 'Đã duyệt', 'Chờ duyệt', 'Từ chối'
  approved_by TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. BẢNG CÀI ĐẶT HỆ THỐNG (SETTINGS)
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BẢNG ĐÁNH GIÁ CỦA KHÁCH & PHẢN HỒI (REVIEWS)
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'Khách hàng thân thiết',
  rating INTEGER NOT NULL DEFAULT 5,
  category TEXT DEFAULT 'karaoke',
  comment TEXT NOT NULL,
  avatar_url TEXT,
  avatar_letter TEXT,
  avatar_color TEXT DEFAULT 'pink',
  color_scheme TEXT DEFAULT 'pink',
  title TEXT,
  banner_image TEXT,
  verified BOOLEAN NOT NULL DEFAULT TRUE,
  post_time_formatted TEXT,
  owner_reply TEXT,
  owner_reply_at TIMESTAMPTZ,
  owner_reply_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. BẢNG TỌA ĐỘ GPS TELEMETRY (GPS_LOGS)
CREATE TABLE IF NOT EXISTS public.gps_logs (
  id BIGSERIAL PRIMARY KEY,
  speaker_id TEXT REFERENCES public.speakers(id) ON DELETE CASCADE,
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  speed_kmh DOUBLE PRECISION DEFAULT 0,
  heading DOUBLE PRECISION DEFAULT 0,
  battery_percent INTEGER,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- BẬT ROW LEVEL SECURITY (RLS) & POLICY CHO PHÉP ĐỌC/GHI CÔNG KHAI
-- ══════════════════════════════════════════════════════════════════════════════
ALTER TABLE public.speakers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gps_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on speakers" ON public.speakers FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on speakers" ON public.speakers FOR ALL USING (true);

CREATE POLICY "Allow public read on rentals" ON public.rentals FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on rentals" ON public.rentals FOR ALL USING (true);

CREATE POLICY "Allow public read on expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on expenses" ON public.expenses FOR ALL USING (true);

CREATE POLICY "Allow public read on settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on settings" ON public.settings FOR ALL USING (true);

CREATE POLICY "Allow public read on reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on reviews" ON public.reviews FOR ALL USING (true);

CREATE POLICY "Allow public read on gps_logs" ON public.gps_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update on gps_logs" ON public.gps_logs FOR ALL USING (true);

-- ══════════════════════════════════════════════════════════════════════════════
-- DỮ LIỆU MẪU BAN ĐẦU (SEED DATA CHO TUY HÒA, PHÚ YÊN)
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO public.speakers (id, name, model, power_watts, hourly_rate, deposit_amount, status, battery_percent, lat, lng, address, serial_number, image_url)
VALUES
  ('puffy-mini', 'Puffy Mini Xách Tay', 'JBZ Pro 400W', 400, 60000, 300000, 'available', 100, 13.0955, 109.3087, 'Kho Hùng Vương, P.7, TP. Tuy Hòa', 'JBZ-400-01', 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80'),
  ('puffy-bass-pro', 'Puffy Bass Pro 40', 'Nanomax Super Bass 800W', 800, 80000, 500000, 'renting', 85, 13.0880, 109.3120, 'Đường Trần Hưng Đạo, P.4, TP. Tuy Hòa', 'NANO-800-02', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80'),
  ('mega-puff-50', 'Mega Puff Đôi 50 Khủng', 'JBL PartyBox Max 1200W', 1200, 100000, 800000, 'available', 100, 13.0955, 109.3087, 'Kho Hùng Vương, P.7, TP. Tuy Hòa', 'JBL-1200-03', 'https://images.unsplash.com/photo-1520523839898-50712825e617?w=600&auto=format&fit=crop&q=80'),
  ('party-monster-disco', 'Party Monster Disco Led', 'AcNos Disco RGB 1500W', 1500, 120000, 1000000, 'available', 95, 13.0955, 109.3087, 'Kho Hùng Vương, P.7, TP. Tuy Hòa', 'ACN-1500-04', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.settings (key, value)
VALUES
  ('warehouse_location', '{"name": "Kho Loa Kẹo Kéo Dặm", "address": "Đường Hùng Vương, Phường 7, TP. Tuy Hòa, Tỉnh Phú Yên", "lat": 13.0955, "lng": 109.3087, "radiusKm": 25}'::jsonb),
  ('pricing_rules', '{"baseShippingFee": 20000, "perKmFee": 5000, "nightSurchargePercent": 20, "depositRequired": false}'::jsonb),
  ('store_info', '{"storeName": "Kẹo Kéo Dặm - Cho Thuê Loa Hỏa Tốc", "phone": "0368115592", "hotline": "0368.115.592"}'::jsonb)
ON CONFLICT (key) DO NOTHING;
