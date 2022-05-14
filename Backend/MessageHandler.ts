import * as ws from "ws";
import { Messsage } from "./Message";
import { GameType } from "./Games/GameType";
import { Lobby } from "./Lobby";
import { Player } from "./Player";
import { handleMessage as genericHandler } from "./GenericHandler";
import { handleMessage as scaleHandler } from "./Games/ScaleGame";

export const handleMessage = (lobby: Lobby, player: Player, message: ws.RawData) => {
    try {
        const jsn: Messsage = JSON.parse(message.toString());
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
                genericHandler(lobby, player, messageType, data);
            } break;

            case GameType.Scales: {
                scaleHandler(lobby, player, messageType, data);
            } break;
        }
    } catch(e) {
        console.error(`Failed to process message: ${e}`);
    }
}