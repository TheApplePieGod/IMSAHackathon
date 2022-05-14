import { GameType } from "./Games/GameType"

// Define message types for this handler
enum GenericMessageType {
    None = 0,
    Heartbeat,
    PlayerJoin,
    PlayerLeave,
    RoomCreated,
    KickPlayer
}

// The GenericHandler handles things like the lobby, etc.
export const handleMessage = (sendMessage: any, messageType: GenericMessageType, data: string) => {
    switch (messageType) {
        default: break;

        // Heartbeat ensures the websocket connection stays alive
        case GenericMessageType.Heartbeat: {
            sendMessage(GenericMessageType.Heartbeat, GameType.None, "");
        } break;
    }
}