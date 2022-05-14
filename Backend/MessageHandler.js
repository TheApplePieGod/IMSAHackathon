const ws = require('ws');
const { GameType } = require("./Games/Types");
const { handleMessage: genericHandler } = require("./GenericHandler");
const { handleMessage: scaleGame } = require("./Games/ScaleGame");

// Message format: { messageType: number, gameType: number, data: string }
exports.handleMessage = (sendMessage, message) => {
    try {
        jsn = JSON.parse(message);
        const messageType = jsn.messageType;
        const gameType = jsn.gameType;
        const data = jsn.data;

        // Handoff the message to the related game type
        switch (gameType) {
            default: {
                console.error("Unknown game type");
            } break;

            // Messages unrelated to a game get sent to the generic handler
            case GameType.None: {
                genericHandler(sendMessage, messageType, data);
            } break;

            case GameType.Scale: {
                scaleGame(sendMessage, messageType, data);
            } break;
        }
    } catch(e) {
        console.error(`Failed to process message: ${e}`);
    }
}