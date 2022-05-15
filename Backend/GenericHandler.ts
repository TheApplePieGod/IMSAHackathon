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
    KickPlayer,
    GameStart,
    GameEnd,
    ReadyState
}

// The GenericHandler handles things like the lobby, etc.
export const handleMessage = (lobby: Lobby, player: Player, messageType: GenericMessageType, data: string) => {
    switch (messageType) {
        default: break;

        // Heartbeat ensures the websocket connection stays alive
        case GenericMessageType.Heartbeat: {
            player.sendMessage(GenericMessageType.Heartbeat, GameType.None, "");
        } break;

        // Sets the ready state of the player
        case GenericMessageType.ReadyState: {
            const newState = JSON.parse(data).state;
            
            // Send new state to all players
            player.ready = newState;
            const allPlayers = lobby.getAllPlayers();
            allPlayers.forEach(p => {
                p.sendMessage(GenericMessageType.ReadyState, GameType.None, JSON.stringify({
                    player: player.id,
                    ready: newState
                }));
            });
            
            // Check if all players are ready and start the match
            let readyCount = 0;
            allPlayers.forEach(p => {
                if (p.ready) readyCount++;
            });
            if (readyCount == allPlayers.length) {
                lobby.startMatch();
            }
        } break;
    }
}