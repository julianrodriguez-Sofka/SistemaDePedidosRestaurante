import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

let wss: WebSocketServer | null = null;

export function initializeWebSocket(server: http.Server): void {
  wss = new WebSocketServer({ server, path: '/ws' });
  
  console.log('🔌 WebSocket server initialized on /ws path');

  wss.on('connection', (ws: WebSocket) => {
    console.log('✅ New WebSocket client connected');
    
    ws.on('message', (message: string) => {
      console.log('📨 Received message from client:', message.toString());
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });
}

export function broadcastEvent(event: { type: string; data: any }): void {
  if (!wss) {
    console.warn('⚠️ WebSocket server not initialized');
    return;
  }

  const message = JSON.stringify(event);
  let sentCount = 0;

  wss.clients.forEach((client: WebSocket) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
      sentCount++;
    }
  });

  console.log(`📡 Broadcasted event "${event.type}" to ${sentCount} clients`);
}

export { wss };
