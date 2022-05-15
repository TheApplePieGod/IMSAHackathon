import * as React from "react";
import { GameType } from "../Definitions/Socket/GameType";
import { BaseState } from "./SocketContext";
import { MathMessageType } from "../Definitions/Socket/MathGame";

interface PlayerState {
    options: string[];
    score: number;
}

export interface MathGameState {
    players: Record<string, PlayerState>;
}

const TEST_PLAYER_STATE = {
    "player1": {
        options: ["17/8", "2", "15/6", "2.80", "3/2", "2.35", "3", "3/1.2"],
        score: 200
    }
};

const DEFAULT_STATE: MathGameState = {
    players: TEST_PLAYER_STATE
};

interface Props {
    sendMessage: (msgType: number, gameType: GameType, data: string) => void;
    baseState: BaseState;
    setBaseState: React.Dispatch<React.SetStateAction<BaseState>>;
}

export const useMathGame = (props: Props) => {
    const [state, setState] = React.useState<MathGameState>(DEFAULT_STATE);

    const handleMessage = (msgType: number, data: string) => {
        switch (msgType) {
            default:
            { } break;
            case MathMessageType.GameStarted: {
                
            } break;
            case MathMessageType.NewOptions: {
                const parsed = JSON.parse(data);
                setState(p => {
                    p.players[parsed.id] = {
                        options: parsed.options,
                        score: parsed.points
                    };

                    return {
                        ...p,
                        players: { ...p.players }
                    };
                });
            } break;
        }
    }

    return {
        state,
        setState,
        handleMessage,
    }
}