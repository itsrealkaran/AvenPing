// WebSocket utility functions that don't start the server during import
// This file is safe to import during build time

import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

let sendMessageToUser: ((userId: string, message: any) => void) | null = null;

// Function to set the sendMessageToUser function (called by the WebSocket server)
export function setSendMessageToUserFunction(fn: (userId: string, message: any) => void) {
  sendMessageToUser = fn;
}

// Function to send message to user (safe to call from API routes)
export async function sendMessageToUserSafe(userId: string, message: any) {
  if (sendMessageToUser) {
    // Direct function call if WebSocket server is in same process
    sendMessageToUser(userId, message);
  } else {
    // Fallback to Redis pub/sub for inter-process communication
    try {
      await redis.publish('websocket-messages', JSON.stringify({
        userId,
        message,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.warn('Failed to send message via Redis:', error);
    }
  }
}

// Function to subscribe to Redis messages (used by WebSocket server)
export function subscribeToRedisMessages(callback: (userId: string, message: any) => void) {
  const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  
  subscriber.subscribe('websocket-messages', (err) => {
    if (err) {
      console.error('Failed to subscribe to Redis channel:', err);
      return;
    }
    console.log('Subscribed to websocket-messages channel');
  });

  subscriber.on('message', (channel, message) => {
    try {
      const data = JSON.parse(message);
      callback(data.userId, data.message);
    } catch (error) {
      console.error('Failed to parse Redis message:', error);
    }
  });

  return subscriber;
} 