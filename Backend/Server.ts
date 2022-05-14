import express from "express";
import * as ws from "ws";
import { connectionHandler } from "./ConnectionHandler";

const app = express();
const port = 3000;

const appName = "IMSA Hackathon App";

// Initialize the headless websocket server
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', connectionHandler);

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