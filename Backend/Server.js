const express = require('express');
const ws = require('ws');
const { handleMessage } = require("./MessageHandler");

const app = express();
const port = 3000;

const appName = "IMSA Hackathon App";

// Initialize the headless websocket server
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => handleMessage(message));
});

// Initialize the main listening HTTP server
const server = app.listen(port, () => {
    console.log(`${appName} listening on port ${port}`)
});

// Configure the HTTP server to handle websocket upgrade requests
server.on('upgrade', (request, socket, head) => {
    wsServer.handleUpgrade(request, socket, head, socket => {
        wsServer.emit('connection', socket, request);
    });
});
