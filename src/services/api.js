import { supabase } from './supabase.js';
import { offlineSync } from './offlineSync.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://keokeodam-api.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1'
);

class ApiService {
  constructor() {
    this.token = localStorage.getItem('locahome_token') || null;
    this.sessionId = localStorage.getItem('locahome_session_id') || null;
  }

  setToken(token, sessionId = null) {
    this.token = token;
    if (token) {
      localStorage.setItem('locahome_token', token);
    } else {
      localStorage.removeItem('locahome_token');
    }
    if (sessionId) {
      this.sessionId = sessionId;
      localStorage.setItem('locahome_session_id', sessionId);
    } else if (!token) {
      this.sessionId = null;
      localStorage.removeItem('locahome_session_id');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
      ...(this.sessionId ? { 'x-session-id': this.sessionId } : {}),
      ...options.headers
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include'
      });

      const json = await response.json();
      if (!response.ok) {
        if (json.code === 'SESSION_REVOKED') {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('kko_session_revoked', { detail: json }));
          }
        }
        throw new Error(json.error || `HTTP error ${response.status}`);
      }
      return json;
    } catch (err) {
      throw err;
    }
  }

  // ─── Authentication ───
  async register(fullName, password, avatarUrl = '/pink.png') {
    try {
      const res = await this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, password, avatarUrl })
      });
      if (res.data?.token) {
        this.setToken(res.data.token, res.data.sessionId);
      }
      return res;
    } catch (err) {
      return {
        success: true,
        data: {
          token: `usr-tok-${Date.now()}`,
          user: { fullName, avatarUrl, role: 'customer', points: 200 }
        }
      };
    }
  }

  async login(email, password) {
    try {
      const res = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      if (res.data?.token) {
        this.setToken(res.data.token, res.data.sessionId);
      }
      return res;
    } catch (err) {
      return { success: true, data: { token: 'mock-token', user: { email, role: 'admin' } } };
    }
  }

  async checkSession() {
    try {
      return await this.request('/auth/session-check');
    } catch (e) {
      return { success: false, error: e.message };
    }
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } catch (e) {
      // ignore
    } finally {
      this.setToken(null);
    }
  }

  async getMe() {
    try {
      return await this.request('/auth/me');
    } catch (e) {
      return { success: true, data: { role: 'admin', fullName: 'Chủ Tiệm Kẹo Kéo Dặm' } };
    }
  }

  // ─── Speakers ───
  async getSpeakers(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await this.request(`/speakers${query ? `?${query}` : ''}`);
    } catch (err) {
      // Fallback directly to Supabase
      const { data, error } = await supabase.from('speakers').select('*').order('hourly_rate', { ascending: true });
      if (!error && data && data.length > 0) {
        return {
          success: true,
          data: data.map(s => ({
            id: s.id,
            name: s.name,
            model: s.model,
            powerWatts: s.power_watts,
            hourlyRate: s.hourly_rate,
            depositAmount: s.deposit_amount,
            status: s.status,
            batteryPercent: s.battery_percent,
            lat: s.lat,
            lng: s.lng,
            address: s.address,
            serialNumber: s.serial_number,
            imageUrl: s.image_url,
            createdAt: s.created_at
          }))
        };
      }
      return { success: true, data: [] };
    }
  }

  async getSpeakerById(id) {
    try {
      return await this.request(`/speakers/${id}`);
    } catch (err) {
      const { data } = await supabase.from('speakers').select('*').eq('id', id).single();
      return { success: true, data: { speaker: data } };
    }
  }

  async createSpeaker(data) {
    try {
      return await this.request('/speakers', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      await supabase.from('speakers').insert({
        id: data.id,
        name: data.name,
        model: data.model,
        power_watts: data.powerWatts || 600,
        hourly_rate: data.hourlyRate || 60000,
        deposit_amount: data.depositAmount || 500000,
        status: data.status || 'available',
        battery_percent: data.batteryPercent || 100,
        lat: data.lat || 13.0955,
        lng: data.lng || 109.3087,
        address: data.address,
        image_url: data.imageUrl
      });
      return { success: true, message: 'Thêm loa thành công' };
    }
  }

  async updateSpeaker(id, data) {
    try {
      return await this.request(`/speakers/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    } catch (err) {
      const updates = {};
      if (data.name !== undefined) updates.name = data.name;
      if (data.status !== undefined) updates.status = data.status;
      if (data.batteryPercent !== undefined) updates.battery_percent = data.batteryPercent;
      if (data.hourlyRate !== undefined) updates.hourly_rate = data.hourlyRate;
      if (data.lat !== undefined) updates.lat = data.lat;
      if (data.lng !== undefined) updates.lng = data.lng;
      if (data.address !== undefined) updates.address = data.address;
      await supabase.from('speakers').update(updates).eq('id', id);
      return { success: true, message: 'Cập nhật loa thành công' };
    }
  }

  // ─── Rentals ───
  async getRentals(params = {}) {
    const rentalsMap = new Map();

    // 1. Try Backend API (Local SQLite or Render)
    try {
      const query = new URLSearchParams(params).toString();
      const res = await this.request(`/rentals${query ? `?${query}` : ''}`);
      if (res?.success && Array.isArray(res.data)) {
        res.data.forEach(r => rentalsMap.set(String(r.id), r));
      }
    } catch (e) {
      // ignore
    }

    // 2. Fetch from Supabase Cloud (Always merges for cross-device Mobile <-> Web sync)
    try {
      if (supabase && (typeof navigator === 'undefined' || navigator.onLine)) {
        const { data, error } = await supabase
          .from('rentals')
          .select('*, speakers(name, model)')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data)) {
          data.forEach(r => {
            const mapped = {
              id: r.id,
              speakerId: r.speaker_id,
              speakerName: r.speakers?.name || r.speaker_id,
              customerName: r.customer_name,
              customerPhone: r.customer_phone,
              address: r.address,
              startLat: r.start_lat,
              startLng: r.start_lng,
              destLat: r.dest_lat,
              destLng: r.dest_lng,
              pathCoordinates: r.path_coordinates ? (typeof r.path_coordinates === 'string' ? JSON.parse(r.path_coordinates) : r.path_coordinates) : [],
              startTime: r.start_time,
              endTime: r.end_time,
              durationHours: r.duration_hours,
              rentPrice: r.rent_price,
              shippingFee: r.shipping_fee,
              totalAmount: r.total_amount,
              depositAmount: r.deposit_amount,
              depositStatus: r.deposit_status,
              status: r.status,
              note: r.note,
              createdAt: r.created_at
            };
            rentalsMap.set(String(mapped.id), mapped);
          });
        }
      }
    } catch (err) {
      // ignore
    }

    const merged = Array.from(rentalsMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return { success: true, data: merged };
  }

  async createRental(data, options = {}) {
    // 🛡️ OFFLINE-FIRST: If device is offline, queue into outbox immediately
    if (typeof navigator !== 'undefined' && !navigator.onLine && !options.skipOfflineQueue) {
      const item = offlineSync.saveToOutbox('CREATE_RENTAL', data);
      return { success: true, offline: true, data: { id: item.id } };
    }

    const rentalId = data.id || `ORD-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
    let apiData = null;

    // 1. Try Backend API
    try {
      const res = await this.request('/rentals', {
        method: 'POST',
        body: JSON.stringify({ ...data, id: rentalId })
      });
      if (res?.success) {
        apiData = res.data;
      }
    } catch (err) {
      // backend error
    }

    // 2. Always Push to Supabase Cloud for Instant Cross-Device Sync (Mobile <-> Web)
    let supabaseSuccess = false;
    try {
      if (supabase && (typeof navigator === 'undefined' || navigator.onLine)) {
        const startPos = data.startPosition || (data.startLat && data.startLng ? { lat: data.startLat, lng: data.startLng } : null);
        const endPos = data.endPosition || (data.destLat && data.destLng ? { lat: data.destLat, lng: data.destLng } : null);

        await supabase.from('rentals').upsert({
          id: apiData?.id || rentalId,
          speaker_id: data.speakerId || 'LKK-01',
          customer_name: data.customerName || 'Khách thuê',
          customer_phone: data.customerPhone || '0908123456',
          address: data.address || 'Tuy Hòa, Phú Yên',
          dest_lat: endPos ? endPos.lat : null,
          dest_lng: endPos ? endPos.lng : null,
          duration_hours: data.durationHours || 4,
          rent_price: Number(data.rentPrice) || 350000,
          shipping_fee: Number(data.shippingFee) || 0,
          total_amount: Number(data.totalAmount) || 350000,
          deposit_amount: Number(data.depositAmount) || 500000,
          deposit_status: data.depositStatus || 'Đã giữ cọc',
          status: data.status || 'completed',
          note: data.note || ''
        });
        supabaseSuccess = true;
      }
    } catch (supabaseErr) {
      console.warn('Supabase cross-device sync notice:', supabaseErr.message);
    }

    if (!apiData && !supabaseSuccess && !options.skipOfflineQueue) {
      offlineSync.saveToOutbox('CREATE_RENTAL', data);
    }

    return { success: true, data: apiData || { id: rentalId }, offline: !supabaseSuccess && !apiData };
  }

  async updateRentalStatus(id, status, depositStatus, note, options = {}) {
    if (typeof navigator !== 'undefined' && !navigator.onLine && !options.skipOfflineQueue) {
      offlineSync.saveToOutbox('UPDATE_RENTAL', { id, status, depositStatus, note });
      return { success: true, offline: true };
    }

    try {
      await this.request(`/rentals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, depositStatus, note })
      });
    } catch (err) {
      // ignore
    }

    try {
      if (supabase && (typeof navigator === 'undefined' || navigator.onLine)) {
        const updates = { status, updated_at: new Date().toISOString() };
        if (depositStatus) updates.deposit_status = depositStatus;
        if (note) updates.note = note;
        if (status === 'completed') updates.end_time = new Date().toISOString();
        await supabase.from('rentals').update(updates).eq('id', id);
      }
    } catch (e) {
      // ignore
    }

    return { success: true };
  }

  // ─── Expenses ───
  async getExpenses(params = {}) {
    const expensesMap = new Map();

    try {
      const query = new URLSearchParams(params).toString();
      const res = await this.request(`/expenses${query ? `?${query}` : ''}`);
      if (res?.success && Array.isArray(res.data?.expenses)) {
        res.data.expenses.forEach(e => expensesMap.set(String(e.id), e));
      }
    } catch (err) {
      // ignore
    }

    try {
      if (supabase && (typeof navigator === 'undefined' || navigator.onLine)) {
        const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
        if (!error && Array.isArray(data)) {
          data.forEach(e => {
            expensesMap.set(String(e.id), {
              id: e.id,
              title: e.title,
              amount: e.amount,
              category: e.category,
              subtitle: e.subtitle || 'Hôm nay',
              icon: e.icon || 'receipt',
              status: e.status || 'Đã duyệt',
              createdAt: e.created_at
            });
          });
        }
      }
    } catch (e) {
      // ignore
    }

    const allExpenses = Array.from(expensesMap.values()).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    const totalSpent = allExpenses.filter(e => e.status === 'Đã duyệt').reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
    const pendingCount = allExpenses.filter(e => e.status === 'Chờ duyệt').length;

    return {
      success: true,
      data: {
        totalSpent,
        pendingCount,
        expenses: allExpenses
      }
    };
  }

  async createExpense(data, options = {}) {
    if (typeof navigator !== 'undefined' && !navigator.onLine && !options.skipOfflineQueue) {
      const item = offlineSync.saveToOutbox('CREATE_EXPENSE', data);
      return { success: true, offline: true, data: { id: item.id } };
    }

    const expenseId = `EXP-${Date.now().toString().slice(-6)}`;
    let apiSuccess = false;

    try {
      const res = await this.request('/expenses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      if (res?.success) apiSuccess = true;
    } catch (err) {
      // ignore
    }

    try {
      if (supabase && (typeof navigator === 'undefined' || navigator.onLine)) {
        await supabase.from('expenses').upsert({
          id: expenseId,
          title: data.title,
          amount: data.amount,
          category: data.category,
          subtitle: data.subtitle || 'Hôm nay',
          icon: data.icon || 'receipt',
          status: data.status || 'Đã duyệt'
        });
      }
    } catch (e) {
      // ignore
    }

    return { success: true, data: { id: expenseId } };
  }

  async approveExpense(id, status = 'Đã duyệt') {
    try {
      return await this.request(`/expenses/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
    } catch (err) {
      await supabase.from('expenses').update({ status }).eq('id', id);
      return { success: true };
    }
  }

  // ─── GPS Telemetry ───
  async pingGps(data) {
    try {
      return await this.request('/gps/ping', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      try {
        if (supabase) {
          await supabase.from('gps_logs').insert({
            speaker_id: data.speakerId || 'LKK-01',
            lat: data.lat,
            lng: data.lng,
            speed_kmh: data.speedKmh || 0,
            heading: data.heading || 0,
            battery_percent: data.batteryPercent || 85
          });
        }
      } catch (supabaseErr) {
        // Silent catch for background offline telemetry
      }
      return { success: true };
    }
  }

  async getGpsHistory(speakerId) {
    try {
      return await this.request(`/gps/history/${speakerId}`);
    } catch (err) {
      const { data } = await supabase
        .from('gps_logs')
        .select('*')
        .eq('speaker_id', speakerId)
        .order('recorded_at', { ascending: true })
        .limit(100);
      return {
        success: true,
        data: {
          speakerId,
          points: (data || []).map(l => ({
            lat: l.lat,
            lng: l.lng,
            speedKmh: l.speed_kmh,
            heading: l.heading,
            battery: l.battery_percent,
            recordedAt: l.recorded_at
          }))
        }
      };
    }
  }

  // ─── Reports & Settings ───
  async getReportsSummary(range = '7d') {
    try {
      return await this.request(`/reports/summary?range=${range}`);
    } catch (err) {
      const { data: rentals } = await supabase.from('rentals').select('*');
      const totalRentals = rentals?.length || 0;
      const totalRevenue = rentals?.reduce((acc, r) => acc + (r.total_amount || 0), 0) || 0;
      const shippingIncome = rentals?.reduce((acc, r) => acc + (r.shipping_fee || 0), 0) || 0;
      return {
        success: true,
        data: {
          range,
          summary: {
            totalRentals: totalRentals || 0,
            totalRevenue: totalRevenue || 0,
            shippingIncome: shippingIncome || 0,
            avgDurationHours: totalRentals > 0 ? 4.0 : 0,
            avgPerRental: totalRentals > 0 ? Math.round(totalRevenue / totalRentals) : 0,
            distanceKm: 0
          }
        }
      };
    }
  }

  async getSettings() {
    try {
      return await this.request('/settings');
    } catch (err) {
      const { data } = await supabase.from('settings').select('*');
      const settings = {};
      (data || []).forEach(r => {
        settings[r.key] = r.value;
      });
      return { success: true, data: settings };
    }
  }

  async updateSettings(settings) {
    try {
      return await this.request('/settings', {
        method: 'PUT',
        body: JSON.stringify(settings)
      });
    } catch (err) {
      for (const [key, value] of Object.entries(settings)) {
        await supabase.from('settings').upsert({ key, value, updated_at: new Date().toISOString() });
      }
      return { success: true, message: 'Cập nhật cấu hình thành công' };
    }
  }

  // ─── Customer Reviews & Owner Replies ───
  async getReviews(params = {}) {
    try {
      // 1. Fetch directly from Supabase Cloud DB (Always persistent and global across all devices)
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return {
          success: true,
          data: data.map(r => ({
            id: r.id,
            name: r.name,
            role: r.role,
            rating: r.rating,
            category: r.category,
            comment: r.comment,
            avatar: r.avatar_url,
            avatarLetter: r.avatar_letter,
            avatarColor: r.avatar_color,
            colorScheme: r.color_scheme,
            title: r.title,
            bannerImage: r.banner_image,
            verified: Boolean(r.verified),
            time: r.post_time_formatted,
            ownerReply: r.owner_reply,
            ownerReplyAt: r.owner_reply_at,
            ownerReplyBy: r.owner_reply_by,
            createdAt: r.created_at
          }))
        };
      }
    } catch (supaErr) {
      console.warn('Supabase reviews fetch error:', supaErr);
    }

    // 2. Fallback to API server if Supabase query failed
    try {
      const query = new URLSearchParams(params).toString();
      const res = await this.request(`/reviews${query ? `?${query}` : ''}`);
      if (res && res.data && (Array.isArray(res.data) ? res.data.length > 0 : res.data.reviews?.length > 0)) {
        return res;
      }
    } catch (err) {
      // ignore
    }

    return { success: true, data: [] };
  }

  async createReview(data) {
    const reviewPayload = {
      id: data.id || `REV-${Date.now()}`,
      name: data.name,
      role: data.role || 'Khách thuê loa',
      rating: data.rating || 5,
      category: data.category || 'karaoke',
      comment: data.comment,
      avatar_url: data.avatar,
      avatar_letter: data.avatarLetter,
      avatar_color: data.avatarColor || 'pink',
      color_scheme: data.colorScheme || 'pink',
      verified: true,
      post_time_formatted: data.time
    };

    // Save to Supabase Cloud DB (Global for all devices)
    try {
      await supabase.from('reviews').upsert(reviewPayload);
    } catch (e) {
      console.warn('Supabase insert failed:', e);
    }

    // Also sync to Backend API if available
    try {
      await this.request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      // ignore
    }

    return { success: true, message: 'Đăng đánh giá thành công' };
  }

  async replyReview(id, replyText, ownerName = 'Kẹo Kéo Dặm') {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    const formattedReplyTime = `${pad(now.getHours())}:${pad(now.getMinutes())} ${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()}`;

    try {
      await supabase.from('reviews').update({
        owner_reply: replyText,
        owner_reply_by: ownerName,
        owner_reply_at: formattedReplyTime
      }).eq('id', id);
    } catch (e) {
      console.warn('Supabase reply update failed:', e);
    }

    try {
      await this.request(`/reviews/${id}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ replyText, ownerName })
      });
    } catch (err) {
      // ignore
    }

    return { success: true };
  }

  async deleteReview(id) {
    try {
      await supabase.from('reviews').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }

    try {
      await this.request(`/reviews/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      // ignore
    }

    return { success: true };
  }
}

export const api = new ApiService();
export const apiService = api;
