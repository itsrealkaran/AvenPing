const { WebSocketServer } = require("ws");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { setSendMessageToUserFunction, subscribeToRedisMessages } = require("./lib/websocket-utils.js");

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const clients = [];

let serverOptions;

const httpServer = http.createServer();

serverOptions = {
  server: httpServer
};

httpServer.listen(3002, '0.0.0.0', () => {
  console.log("HTTP server running on port 3002");
});

const wss = new WebSocketServer(serverOptions);

wss.on("connection", (ws) => {
  let userId = null;

  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log(data, "data");
      if (data.type === "register" && data.userId) {
        userId = data.userId;
        clients.push({ userId: data.userId, ws });
        ws.send(JSON.stringify({ type: "registered", userId: data.userId }));
        console.log(`User ${data.userId} registered for real-time messaging`);
      }
    } catch (e) {
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format" })
      );
    }
  });

  ws.on("close", () => {
    if (userId) {
      const idx = clients.findIndex((c) => c.userId === userId && c.ws === ws);
      if (idx !== -1) {
        clients.splice(idx, 1);
        console.log(`User ${userId} disconnected from real-time messaging`);
      }
    }
  });
});

function sendMessageToUser(userId, message) {
  clients.forEach((client) => {
    if (client.userId === userId) {
      console.log(client.ws, "client.ws");
      console.log(message, "message");
      client.ws.send(JSON.stringify({ type: "new_message", ...message }));
    }
  });
}

// Set the function for direct calls (same process)
setSendMessageToUserFunction(sendMessageToUser);

// Subscribe to Redis messages for inter-process communication
subscribeToRedisMessages(sendMessageToUser);

console.log("WebSocket server running on ws://localhost:3002");