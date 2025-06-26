import { useEffect, useRef, useCallback } from 'react';
import { useUser } from '@/context/user-context';

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

interface UseWebSocketProps {
  onMessage: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export const useWebSocket = ({ onMessage, onConnect, onDisconnect, onError }: UseWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);
  const { userInfo } = useUser();
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const isConnectingRef = useRef(false);

  // Store callbacks in refs to prevent dependency changes
  const callbacksRef = useRef({
    onMessage,
    onConnect,
    onDisconnect,
    onError
  });

  // Update callbacks ref when they change
  useEffect(() => {
    callbacksRef.current = {
      onMessage,
      onConnect,
      onDisconnect,
      onError
    };
  }, [onMessage, onConnect, onDisconnect, onError]);

  const connect = useCallback(() => {
    if (!userInfo?.whatsappAccount?.id || isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    isConnectingRef.current = true;

    try {
      const ws = new WebSocket('ws://localhost:3002');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        
        // Register the user with the WebSocket server
        ws.send(JSON.stringify({
          type: 'register',
          userId: userInfo.whatsappAccount.id
        }));
        
        callbacksRef.current.onConnect?.();
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          callbacksRef.current.onMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        isConnectingRef.current = false;
        callbacksRef.current.onDisconnect?.();
        
        // Only attempt to reconnect if this wasn't a manual disconnect
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            connect();
          }, 1000 * Math.pow(2, reconnectAttemptsRef.current)); // Exponential backoff
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
        callbacksRef.current.onError?.(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      isConnectingRef.current = false;
    }
  }, [userInfo?.whatsappAccount?.id]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [userInfo?.whatsappAccount?.id, connect, disconnect]);

  return {
    sendMessage,
    isConnected: wsRef.current?.readyState === WebSocket.OPEN,
    disconnect
  };
}; 