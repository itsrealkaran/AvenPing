// WebSocket utility functions for broadcasting messages to connected clients
// This file is safe to import during build time

// Function to send message to user via HTTP request to WebSocket server
export async function sendMessageToUserSafe(userId: string, message: any): Promise<boolean> {
  try {
    const wsServerUrl = process.env.WEBSOCKET_SERVER_URL || 'http://localhost:3002';
    const response = await fetch(`${wsServerUrl}/broadcast`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, message }),
    });

    if (!response.ok) {
      console.error(`Failed to send message to WebSocket server: ${response.status}`);
      return false;
    }

    const result = await response.json();
    if (!result.success) {
      console.error('WebSocket server returned error:', result.error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error sending message to WebSocket server:', error);
    return false;
  }
} 