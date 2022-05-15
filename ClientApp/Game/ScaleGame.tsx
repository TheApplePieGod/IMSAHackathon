import {Animal, Scale} from "../Definitions/Socket/ScaleGame";

interface PlayerState {
    scales: Scale[];
    score: number;
}

export interface ScaleGameState {
    players: Record<string, PlayerState>;
}