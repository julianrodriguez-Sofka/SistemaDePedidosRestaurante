// Servicio WebSocket para recibir actualizaciones en tiempo real

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 3000;
  private listeners: Map<string, Set<Function>> = new Map();

  connect(url: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log('[WS] Already connected');
      return;
    }

    console.log('[WS] Connecting to:', url);
    
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log('[WS] ✅ Connected successfully');
        this.reconnectAttempts = 0;
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          console.log('[WS] 📨 Received event:', message.type);
          this.notifyListeners(message.type, message.data);
        } catch (error) {
          console.error('[WS] Error parsing message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('[WS] ❌ Connection error:', error);
      };

      this.ws.onclose = () => {
        console.log('[WS] 🔌 Connection closed');
        this.reconnect(url);
      };
    } catch (error) {
      console.error('[WS] Failed to create connection:', error);
      this.reconnect(url);
    }
  }

  private reconnect(url: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('[WS] Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`[WS] Reconnecting... (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect(url);
    }, this.reconnectDelay);
  }

  on(eventType: string, callback: Function): void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(callback);
    console.log(`[WS] Subscribed to event: ${eventType}`);
  }

  off(eventType: string, callback: Function): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.delete(callback);
      if (listeners.size === 0) {
        this.listeners.delete(eventType);
      }
    }
  }

  private notifyListeners(eventType: string, data: any): void {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      listeners.forEach((callback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`[WS] Error in listener for ${eventType}:`, error);
        }
      });
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.listeners.clear();
    console.log('[WS] Disconnected');
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}

// Singleton instance
export const wsService = new WebSocketService();

// Auto-connect to admin-service WebSocket
const ADMIN_WS_URL = 'ws://localhost:4001/ws';
wsService.connect(ADMIN_WS_URL);

export default wsService;
