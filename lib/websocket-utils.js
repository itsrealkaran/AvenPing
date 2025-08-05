// WebSocket utility functions that don't start the server during import
// This file is safe to import during build time

let sendMessageToUser = null;

// Function to set the sendMessageToUser function (called by the WebSocket server)
function setSendMessageToUserFunction(fn) {
  sendMessageToUser = fn;
}

// Function to send message to user (safe to call from API routes)
function sendMessageToUserSafe(userId, message) {
  if (sendMessageToUser) {
    sendMessageToUser(userId, message);
  } else {
    console.warn('WebSocket server not initialized, message not sent:', message);
  }
}

module.exports = {
  setSendMessageToUserFunction,
  sendMessageToUserSafe
}; 