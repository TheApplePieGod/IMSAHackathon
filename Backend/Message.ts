import { GameType } from "./Games/GameType";

export interface Messsage {
    messageType: number;
    gameType: GameType;
    data: string;
}