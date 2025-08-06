const { WebSocketServer } = require("ws");
const https = require("https");
const http = require("http");
const fs = require("fs");
const path = require("path");

// Load environment variables from .env file
require('dotenv').config({ path: path.join(__dirname, '.env') });

const clients = new Map(); // Use Map for better performance and cleaner code

let serverOptions;

const httpServer = http.createServer();

// Add HTTP endpoint for receiving broadcast messages
httpServer.on('request', (req, res) => {
  if (req.method === 'POST' && req.url === '/broadcast') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const { userId, message } = JSON.parse(body);
        console.log(`Received broadcast request for user ${userId}:`, message);
        
        const client = clients.get(userId);
        if (client && client.readyState === client.OPEN) {
          try {
            client.send(JSON.stringify(message));
            console.log(`Message sent to user ${userId}`);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true }));
          } catch (error) {
            console.error(`Error sending message to user ${userId}:`, error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: error.message }));
          }
        } else {
          console.log(`User ${userId} not connected`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, message: 'User not connected' }));
        }
      } catch (error) {
        console.error('Error parsing broadcast request:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
      }
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
  }
});

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
      console.log("Received message:", data);
      
      if (data.type === "register" && data.userId) {
        userId = data.userId;
        
        // Remove any existing connection for this user
        if (clients.has(userId)) {
          const existingWs = clients.get(userId);
          if (existingWs.readyState === existingWs.OPEN) {
            existingWs.close(1000, 'New connection from same user');
          }
        }
        
        clients.set(userId, ws);
        ws.send(JSON.stringify({ type: "registered", userId: data.userId }));
        console.log(`User ${data.userId} registered for real-time messaging`);
      }
    } catch (e) {
      console.error("Error parsing message:", e);
      ws.send(
        JSON.stringify({ type: "error", message: "Invalid message format" })
      );
    }
  });

  ws.on("close", () => {
    if (userId) {
      // Only remove if this is still the current connection for this user
      if (clients.get(userId) === ws) {
        clients.delete(userId);
        console.log(`User ${userId} disconnected from real-time messaging`);
      }
    }
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    if (userId) {
      if (clients.get(userId) === ws) {
        clients.delete(userId);
        console.log(`User ${userId} removed due to error`);
      }
    }
  });
});

console.log("WebSocket server running on ws://localhost:3002");
console.log("HTTP broadcast endpoint available at http://localhost:3002/broadcast");
console.log("Ready to broadcast messages to connected clients");