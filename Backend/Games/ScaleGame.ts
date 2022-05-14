import { Lobby } from "../Lobby";
import { Player } from "../Player";

// Define message types for this handler
enum ScaleMessageType {
    None = 0
}

// The ScaleGame handler handles messages relating to the ScaleGame
export const handleMessage = (lobby: Lobby, player: Player, messageType: ScaleMessageType, data: string) => {
    switch (messageType) {
        default: break;
        
    }
}