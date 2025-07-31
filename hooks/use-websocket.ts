import { useEffect, useRef, useCallback, useState } from 'react';
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
  const maxReconnectAttempts = 10; // Increased from 5 to 10
  const isConnectingRef = useRef(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'reconnecting'>('disconnected');

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
    setConnectionStatus('connecting');

    try {
      const ws = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3002');
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        setIsConnected(true);
        setConnectionStatus('connected');
        
        // Register the user with the WebSocket server
        ws.send(JSON.stringify({
          type: 'register',
          userId: userInfo?.whatsappAccount?.id
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

      ws.onclose = (event) => {
        console.log('WebSocket disconnected', event.code, event.reason);
        isConnectingRef.current = false;
        setIsConnected(false);
        setConnectionStatus('disconnected');
        callbacksRef.current.onDisconnect?.();
        
        // Only attempt to reconnect if this wasn't a manual disconnect and we haven't exceeded max attempts
        if (reconnectAttemptsRef.current < maxReconnectAttempts && event.code !== 1000) {
          setConnectionStatus('reconnecting');
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000); // Cap at 30 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
            connect();
          }, delay);
        } else if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
          console.log('Max reconnection attempts reached');
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        isConnectingRef.current = false;
        setIsConnected(false);
        setConnectionStatus('disconnected');
        callbacksRef.current.onError?.(error);
      };
    } catch (error) {
      console.error('Error creating WebSocket connection:', error);
      isConnectingRef.current = false;
      setIsConnected(false);
      setConnectionStatus('disconnected');
    }
  }, [userInfo?.whatsappAccount?.id]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    reconnectAttemptsRef.current = maxReconnectAttempts; // Prevent reconnection
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect'); // Use code 1000 for normal closure
      wsRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected');
    }
  }, []);

  // Auto-reconnect when user info becomes available
  useEffect(() => {
    if (userInfo?.whatsappAccount?.id) {
      connect();
    } else {
      disconnect();
    }

    return () => {
      disconnect();
    };
  }, [userInfo?.whatsappAccount?.id, connect, disconnect]);

  return {
    sendMessage,
    isConnected,
    connectionStatus,
    disconnect
  };
}; 