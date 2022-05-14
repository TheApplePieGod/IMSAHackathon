const ws = require('ws');
const { handleMessage: scaleGame } = require("./Games/ScaleGame");

// Define game type enum for each unique game
const GameType = {
    None: 0,
    Scale: 1,
};
Object.freeze(GameType);

// Message format { messageType: number, gameType: number, data: string }
exports.handleMessage = (message) => {
    try {
        jsn = JSON.parse(message);
        const messageType = message.messageType;
        const gameType = message.gameType;
        const data = message.data;

        // Handoff the message to the related game type
        switch (gameType) {
            default: {
                console.error("Unknown game type");
            } break;
            case GameType.Scale: {
                scaleGame(messageType, data);
            } break;
        }
    } catch {
        console.error("Invalid message format");
    }
}