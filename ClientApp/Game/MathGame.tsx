import * as React from "react";
import { GameType } from "../Definitions/Socket/GameType";
import { BaseState } from "./SocketContext";
import { MathGameResults, MathMessageType } from "../Definitions/Socket/MathGame";

interface PlayerState {
    options: string[];
    score: number;
    selections: number[];
    cycles: number;
}

export interface MathGameState {
    players: Record<string, PlayerState>;
    results: MathGameResults[];
}

const TEST_PLAYER_STATE = {
    "player1": {
        options: ["17/8", "2", "15/6", "2.80", "3/2", "2.35", "3", "3/1.2"],
        score: 200,
        selections: []
    },
};

const DEFAULT_STATE: MathGameState = {
    players: TEST_PLAYER_STATE,
    results: []
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
            case MathMessageType.GameEnded: {
                const parsed = JSON.parse(data);
                setState(p => {
                    return {
                        ...p,
                        results: parsed
                    };
                });
            } break;
            case MathMessageType.NewOptions: {
                const parsed = JSON.parse(data);
                setState(p => {
                    p.players[parsed.player] = {
                        options: parsed.options,
                        score: parsed.points,
                        selections: [],
                        cycles: parsed.cycles
                    };

                    return {
                        ...p,
                        players: { ...p.players }
                    };
                });
            } break;
            case MathMessageType.SubmitSelection: {
                const parsed = JSON.parse(data);
                console.log(parsed)
                setState(p => {
                    p.players[parsed.player] = {
                        ...p.players[parsed.player],
                        selections: [ ...p.players[parsed.player].selections, parsed.selection ],
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