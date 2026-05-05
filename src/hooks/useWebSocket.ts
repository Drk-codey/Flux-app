import { useEffect } from 'react';
import { wsClient } from '../lib/websocket/client';
import { useAuthStore } from '../store/authStore';

export function useWebSocket(onMessage: (event: any) => void) {
  const accessToken = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!accessToken) return;

    // Connect
    wsClient.connect(accessToken);

    // Subscribe to messages
    const unsubscribe = wsClient.onMessage(onMessage);

    // Cleanup
    return () => {
      unsubscribe();
      wsClient.disconnect();
    };
  }, [accessToken, onMessage]);
}