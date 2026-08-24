class GpsSocketClient {
  constructor() {
    this.ws = null;
    this.listeners = new Set();
    this.url = import.meta.env.VITE_WS_URL || (
      typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? 'wss://keokeodam-api.onrender.com/ws/gps'
        : 'ws://localhost:5000/ws/gps'
    );
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log('📡 Connected to Locahome Live GPS WebSocket Server');
      };

      this.ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'GPS_UPDATE') {
            for (const listener of this.listeners) {
              listener(payload.data);
            }
          }
        } catch (err) {
          console.error('[WS Parse Error]:', err);
        }
      };

      this.ws.onclose = () => {
        this.reconnect();
      };

      this.ws.onerror = () => {
        this.ws.close();
      };
    } catch (err) {
      console.warn('[WS Connect Error]:', err);
      this.reconnect();
    }
  }

  reconnect() {
    if (this.reconnectTimeout) return;
    this.reconnectTimeout = setTimeout(() => {
      this.reconnectTimeout = null;
      this.connect();
    }, 3000);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    this.connect();
    return () => this.listeners.delete(callback);
  }
}

export const gpsSocket = new GpsSocketClient();
