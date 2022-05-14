import { GameType } from "./Games/GameType"
import { Lobby } from "./Lobby";
import { Player } from "./Player";

// Define message types for this handler
export enum GenericMessageType {
    None = 0,
    Heartbeat,
    PlayerJoin,
    PlayerLeave,
    RoomCreated,
    KickPlayer
}

// The GenericHandler handles things like the lobby, etc.
export const handleMessage = (lobby: Lobby, player: Player, messageType: GenericMessageType, data: string) => {
    switch (messageType) {
        default: break;

        // Heartbeat ensures the websocket connection stays alive
        case GenericMessageType.Heartbeat: {
            player.sendMessage(GenericMessageType.Heartbeat, GameType.None, "");
        } break;
    }
}