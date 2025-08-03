const { WebSocketServer } = require("ws");
const https = require("https");
const http = require("http");
const fs = require("fs");

const clients = [];

// Check if SSL certificates are available
const useSSL = process.env.USE_SSL === 'true' && 
               fs.existsSync(process.env.SSL_CERT_PATH || '') && 
               fs.existsSync(process.env.SSL_KEY_PATH || '');

let serverOptions;

if (useSSL) {
  // SSL configuration for production
  const httpsServer = https.createServer({
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
    key: fs.readFileSync(process.env.SSL_KEY_PATH)
  });
  
  serverOptions = {
    server: httpsServer,
    host: '0.0.0.0',
    port: 3002
  };
  
  httpsServer.listen(3002, '0.0.0.0', () => {
    console.log("HTTPS server running on port 3002");
  });
} else {
  // Non-SSL configuration for development/testing
  const httpServer = http.createServer();
  
  serverOptions = {
    server: httpServer,
    host: '0.0.0.0',
    port: 3002
  };
  
  httpServer.listen(3002, '0.0.0.0', () => {
    console.log("HTTP server running on port 3002");
  });
}

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

// Export the function for use in other parts of the application
module.exports = { sendMessageToUser };

console.log(`WebSocket server running on ${useSSL ? 'wss' : 'ws'}://0.0.0.0:3002`);
