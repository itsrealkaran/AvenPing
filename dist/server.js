"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = require("next");
const ws_1 = require("ws");
const dev = process.env.NODE_ENV !== 'production';
const app = (0, next_1.default)({ dev });
const handle = app.getRequestHandler();
// Store connected WebSocket clients
const clients = new Map();
app.prepare().then(() => {
    const server = (0, http_1.createServer)(async (req, res) => {
        try {
            const parsedUrl = (0, url_1.parse)(req.url, true);
            await handle(req, res, parsedUrl);
        }
        catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });
    // Make the sendMessageToUser function available globally
    global.sendMessageToUser = (userId, message) => {
        const client = clients.get(userId);
        if (client && client.readyState === 1) { // 1 = WebSocket.OPEN
            client.send(JSON.stringify({ type: 'new_message', ...message }));
        }
    };
    const port = process.env.PORT || 3000;
    const wsPort = process.env.WS_PORT || 3001;
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    // Start HTTP server
    server.listen(port, host, () => {
        console.log(`> Ready on http://${host}:${port}`);
    });
    // Create separate WebSocket server
    const wsServer = (0, http_1.createServer)();
    const wss = new ws_1.WebSocketServer({ server: wsServer });
    wss.on('connection', (ws) => {
        console.log('New WebSocket connection established');
        let userId = null;
        ws.on('message', (message) => {
            try {
                const data = JSON.parse(message.toString());
                console.log('Received WebSocket message:', data);
                if (data.type === 'register' && data.userId) {
                    userId = data.userId;
                    clients.set(data.userId, ws);
                    ws.send(JSON.stringify({ type: 'registered', userId: data.userId }));
                    console.log(`User ${data.userId} registered for real-time messaging`);
                }
            }
            catch (e) {
                console.error('Error parsing WebSocket message:', e);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
            }
        });
        ws.on('close', (code, reason) => {
            console.log('WebSocket connection closed:', code, reason?.toString());
            if (userId && typeof userId === 'string') {
                clients.delete(userId);
                console.log(`User ${userId} disconnected from real-time messaging`);
            }
        });
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
            if (userId && typeof userId === 'string') {
                clients.delete(userId);
            }
        });
    });
    wsServer.listen(wsPort, host, () => {
        console.log(`WebSocket server running on ws://${host}:${wsPort}`);
    });
});
