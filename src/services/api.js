const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

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
        credentials: 'include' // send HttpOnly cookies
      });

      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || `HTTP error ${response.status}`);
      }
      return json;
    } catch (err) {
      console.warn(`[API Request Error] ${endpoint}:`, err.message);
      throw err;
    }
  }

  // ─── Authentication ───
  async login(email, password) {
    const res = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (res.data?.token) {
      this.setToken(res.data.token);
    }
    return res;
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.setToken(null);
    }
  }

  async getMe() {
    return this.request('/auth/me');
  }

  // ─── Speakers ───
  async getSpeakers(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/speakers${query ? `?${query}` : ''}`);
  }

  async getSpeakerById(id) {
    return this.request(`/speakers/${id}`);
  }

  async createSpeaker(data) {
    return this.request('/speakers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateSpeaker(id, data) {
    return this.request(`/speakers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  // ─── Rentals ───
  async getRentals(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/rentals${query ? `?${query}` : ''}`);
  }

  async createRental(data) {
    return this.request('/rentals', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateRentalStatus(id, status, depositStatus, note) {
    return this.request(`/rentals/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, depositStatus, note })
    });
  }

  // ─── Expenses ───
  async getExpenses(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/expenses${query ? `?${query}` : ''}`);
  }

  async createExpense(data) {
    return this.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async approveExpense(id, status = 'Đã duyệt') {
    return this.request(`/expenses/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // ─── GPS Telemetry ───
  async pingGps(data) {
    return this.request('/gps/ping', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getGpsHistory(speakerId) {
    return this.request(`/gps/history/${speakerId}`);
  }

  // ─── Reports & Settings ───
  async getReportsSummary(range = '7d') {
    return this.request(`/reports/summary?range=${range}`);
  }

  async getSettings() {
    return this.request('/settings');
  }

  async updateSettings(settings) {
    return this.request('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  }

  // ─── Customer Reviews & Owner Replies ───
  async getReviews(params = {}) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/reviews${query ? `?${query}` : ''}`);
  }

  async createReview(data) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async replyReview(id, replyText, ownerName = 'Chủ quán Locahome (Hồ Văn Duy)') {
    return this.request(`/reviews/${id}/reply`, {
      method: 'PATCH',
      body: JSON.stringify({ replyText, ownerName })
    });
  }

  async deleteReview(id) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE'
    });
  }
}

export const api = new ApiService();
