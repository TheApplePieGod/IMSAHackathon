import * as ws from "ws";
import { Messsage } from "./Message";
import { GameType } from "./Games/GameType";
import { handleMessage as genericHandler } from "./GenericHandler";
import { handleMessage as scaleHandler } from "./Games/ScaleGame";

export const handleMessage = (sendMessage: any, message: ws.RawData) => {
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
                genericHandler(sendMessage, messageType, data);
            } break;

            case GameType.Scale: {
                scaleHandler(sendMessage, messageType, data);
            } break;
        }
    } catch(e) {
        console.error(`Failed to process message: ${e}`);
    }
}