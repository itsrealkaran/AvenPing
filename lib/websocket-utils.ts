// WebSocket utility functions that don't start the server during import
// This file is safe to import during build time

let sendMessageToUser: ((userId: string, message: any) => void) | null = null;

// Function to set the sendMessageToUser function (called by the WebSocket server)
export function setSendMessageToUserFunction(fn: (userId: string, message: any) => void) {
  sendMessageToUser = fn;
}

// Function to send message to user (safe to call from API routes)
export function sendMessageToUserSafe(userId: string, message: any) {
  if (sendMessageToUser) {
    sendMessageToUser(userId, message);
  } else {
    console.warn('WebSocket server not initialized, message not sent:', message);
  }
} 