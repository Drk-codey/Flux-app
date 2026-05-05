import type { EncryptedMessage } from '../crypto/types';

type WebSocketEvent =
  | { event: 'message.receive'; id: string; from_user_id: string; to_user_id: string; payload: EncryptedMessage; created_at: string }
  | { event: 'user.online'; user_id: string }
  | { event: 'user.offline'; user_id: string }
  | { event: 'error'; detail: string };

type MessageHandler = (message: WebSocketEvent) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private handlers: Set<MessageHandler> = new Set();
  private reconnectTimer: number | null = null;
  private accessToken: string | null = null;

  connect(accessToken: string) {
    this.accessToken = accessToken;
    this.createConnection();
  }

  private createConnection() {
    if (!this.accessToken) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws?token=${this.accessToken}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as WebSocketEvent;
        this.handlers.forEach((handler) => handler(data));
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket closed, reconnecting...');
      this.reconnect();
    };
  }

  private reconnect() {
    this.reconnectTimer = window.setTimeout(() => {
      this.createConnection();
    }, 3000);
  }

  sendMessage(to: string, payload: EncryptedMessage) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket not connected');
    }

    this.ws.send(
      JSON.stringify({
        event: 'message.send',
        to,
        payload,
      })
    );
  }

  onMessage(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.handlers.clear();
  }
}

export const wsClient = new WebSocketClient();