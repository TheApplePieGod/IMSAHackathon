const { GameType } = require("./Games/Types");

// Define message types for this handler
const MessageType = {
    None: 0,
    Heartbeat: 1,
    PlayerJoin: 2,
    PlayerLeave: 3,
    RoomCreated: 4,
    KickPlayer: 5
};
Object.freeze(MessageType);

// The GenericHandler handles things like the lobby, etc.
exports.handleMessage = (sendMessage, messageType, data) => {
    switch (messageType) {
        default: break;

        // Heartbeat ensures the websocket connection stays alive
        case MessageType.Heartbeat: {
            sendMessage(MessageType.Heartbeat, GameType.None, "");
        } break;
    }
}