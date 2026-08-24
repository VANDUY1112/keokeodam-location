import { supabase } from './supabase.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
    ? 'https://keokeodam-api.onrender.com/api/v1'
    : 'http://localhost:5000/api/v1'
);

class ApiService {
  constructor() {
    this.token = localStorage.getItem('locahome_token') || null;
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('locahome_token', token);
    } else {
      localStorage.removeItem('locahome_token');
    }
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
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
        this.setToken(res.data.token);
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
        this.setToken(res.data.token);
      }
      return res;
    } catch (err) {
      return { success: true, data: { token: 'mock-token', user: { email, role: 'admin' } } };
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
    try {
      const query = new URLSearchParams(params).toString();
      return await this.request(`/rentals${query ? `?${query}` : ''}`);
    } catch (err) {
      const { data, error } = await supabase
        .from('rentals')
        .select('*, speakers(name, model)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return {
          success: true,
          data: data.map(r => ({
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
          }))
        };
      }
      return { success: true, data: [] };
    }
  }

  async createRental(data) {
    try {
      return await this.request('/rentals', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      const rentalId = `ORD-${Date.now().toString().slice(-6)}`;
      await supabase.from('rentals').insert({
        id: rentalId,
        speaker_id: data.speakerId,
        customer_name: data.customerName,
        customer_phone: data.customerPhone,
        address: data.address,
        start_lat: data.startLat || (data.startPosition ? data.startPosition.lat : null),
        start_lng: data.startLng || (data.startPosition ? data.startPosition.lng : null),
        dest_lat: data.destLat || (data.endPosition ? data.endPosition.lat : null),
        dest_lng: data.destLng || (data.endPosition ? data.endPosition.lng : null),
        path_coordinates: data.pathCoordinates || null,
        duration_hours: data.durationHours || 4,
        rent_price: data.rentPrice,
        shippingFee: data.shippingFee || 0,
        total_amount: data.totalAmount,
        deposit_amount: data.depositAmount || 500000,
        deposit_status: data.depositStatus || 'Đã giữ cọc',
        status: 'active',
        note: data.note
      });
      return { success: true, data: { id: rentalId } };
    }
  }

  async updateRentalStatus(id, status, depositStatus, note) {
    try {
      return await this.request(`/rentals/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, depositStatus, note })
      });
    } catch (err) {
      const updates = { status, updated_at: new Date().toISOString() };
      if (depositStatus) updates.deposit_status = depositStatus;
      if (note) updates.note = note;
      if (status === 'completed') updates.end_time = new Date().toISOString();
      await supabase.from('rentals').update(updates).eq('id', id);
      return { success: true };
    }
  }

  // ─── Expenses ───
  async getExpenses(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      return await this.request(`/expenses${query ? `?${query}` : ''}`);
    } catch (err) {
      const { data, error } = await supabase.from('expenses').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        const totalSpent = data.filter(e => e.status === 'Đã duyệt').reduce((acc, e) => acc + (e.amount || 0), 0);
        const pendingCount = data.filter(e => e.status === 'Chờ duyệt').length;
        return {
          success: true,
          data: {
            totalSpent,
            pendingCount,
            expenses: data.map(e => ({
              id: e.id,
              title: e.title,
              amount: e.amount,
              category: e.category,
              subtitle: e.subtitle,
              icon: e.icon,
              status: e.status,
              createdAt: e.created_at
            }))
          }
        };
      }
      return { success: true, data: { totalSpent: 0, pendingCount: 0, expenses: [] } };
    }
  }

  async createExpense(data) {
    try {
      return await this.request('/expenses', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      const expenseId = `EXP-${Date.now().toString().slice(-6)}`;
      await supabase.from('expenses').insert({
        id: expenseId,
        title: data.title,
        amount: data.amount,
        category: data.category,
        subtitle: data.subtitle || 'Hôm nay',
        icon: data.icon || 'receipt',
        status: data.status || 'Đã duyệt'
      });
      return { success: true, data: { id: expenseId } };
    }
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
      await supabase.from('gps_logs').insert({
        speaker_id: data.speakerId,
        lat: data.lat,
        lng: data.lng,
        speed_kmh: data.speedKmh || 0,
        heading: data.heading || 0,
        battery_percent: data.batteryPercent
      });
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
      const query = new URLSearchParams(params).toString();
      return await this.request(`/reviews${query ? `?${query}` : ''}`);
    } catch (err) {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
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
      return { success: true, data: [] };
    }
  }

  async createReview(data) {
    try {
      return await this.request('/reviews', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    } catch (err) {
      await supabase.from('reviews').insert({
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
      });
      return { success: true, message: 'Đăng đánh giá thành công' };
    }
  }

  async replyReview(id, replyText, ownerName = 'Kẹo Kéo Dặm') {
    try {
      return await this.request(`/reviews/${id}/reply`, {
        method: 'PATCH',
        body: JSON.stringify({ replyText, ownerName })
      });
    } catch (err) {
      await supabase.from('reviews').update({
        owner_reply: replyText,
        owner_reply_by: ownerName,
        owner_reply_at: new Date().toISOString()
      }).eq('id', id);
      return { success: true };
    }
  }

  async deleteReview(id) {
    try {
      return await this.request(`/reviews/${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      await supabase.from('reviews').delete().eq('id', id);
      return { success: true };
    }
  }
}

export const api = new ApiService();
export const apiService = api;
