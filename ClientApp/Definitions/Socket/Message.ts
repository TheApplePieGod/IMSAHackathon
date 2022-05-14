import { GameType } from "./GameType";

export interface Message {
    messageType: number;
    gameType: GameType;
    data: string;
}