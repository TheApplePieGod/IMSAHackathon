import express from "express";
import * as ws from "ws";
import { GameType } from "./Games/GameType";
import { handleMessage } from "./MessageHandler";

const app = express();
const port = 3000;

const appName = "IMSA Hackathon App";

// Initialize the headless websocket server
const wsServer = new ws.Server({ noServer: true });
wsServer.on('connection', socket => {
    socket.on('message', message => {
        // Create a message sending function for use in the message handler
        const sendMessage = (messageType: number, gameType: GameType, data: string) => {
            const message = JSON.stringify({
                messageType,
                gameType,
                data
            });
            socket.send(message);
        }

        // Delegate message to the handleMessage function
        handleMessage(sendMessage, message);
    });
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