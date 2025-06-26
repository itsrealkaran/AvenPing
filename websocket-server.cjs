const { WebSocketServer } = require("ws");

const clients = [];

const wss = new WebSocketServer({ port: 3002 });

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

console.log("WebSocket server running on ws://localhost:3002");
