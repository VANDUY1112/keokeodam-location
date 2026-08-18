import { WebSocketServer, WebSocket } from 'ws';

let wss = null;
const clients = new Set();

export function initWebSocketServer(server) {
  wss = new WebSocketServer({ server, path: '/ws/gps' });

  wss.on('connection', (ws, req) => {
    clients.add(ws);
    // Send welcome ping
    ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Connected to Locahome Live GPS Stream' }));

    ws.on('close', () => {
      clients.delete(ws);
    });

    ws.on('error', () => {
      clients.delete(ws);
    });
  });

  console.log('📡 WebSocket Live GPS server initialized at /ws/gps');
}

export function broadcastGpsUpdate(data) {
  if (!wss || clients.size === 0) return;

  const payload = JSON.stringify({
    type: 'GPS_UPDATE',
    data
  });

  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}
