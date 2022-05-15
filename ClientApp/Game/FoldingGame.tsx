import * as React from "react";
import { GameType } from "../Definitions/Socket/GameType";
import { BaseState } from "./SocketContext";
import { FoldingMessageType } from "../Definitions/Socket/FoldingGame";
import { PlayerState } from "../Definitions/Socket/FoldingGame";

export interface FoldingGameState {
    players: Record<string, PlayerState>;
    paperSize: number;
}

const DEFAULT_STATE: FoldingGameState = {
    players: {},
    paperSize: 4,
};

interface Props {
    sendMessage: (msgType: number, gameType: GameType, data: string) => void;
    baseState: BaseState;
    setBaseState: React.Dispatch<React.SetStateAction<BaseState>>;
}

export const useFoldingGame = (props: Props) => {
    const [state, setState] = React.useState<FoldingGameState>(DEFAULT_STATE);

    const handleMessage = (msgType: number, data: string) => {
        switch (msgType) {
            default:
            { } break;
            case FoldingMessageType.GameStarted: {
                
            } break;
            case FoldingMessageType.NewSequence: {
                const parsed = JSON.parse(data);
                setState(p => {
                    p.players[parsed.player] = {
                        instructions: parsed.instructions,
                        sequence: parsed.sequence,
                        points: parsed.points,
                        cycles: parsed.cycles,
                        correct: undefined,
                        total: 0
                    };

                    return {
                        ...p,
                        players: { ...p.players }
                    };
                });
            } break;
            case FoldingMessageType.SubmitSelection: {
                const parsed = JSON.parse(data);
                setState(p => {
                    p.players[parsed.player] = {
                        ...p.players[parsed.player],
                        correct: parsed.correct,
                        total: parsed.total
                    };

                    return {
                        ...p,
                        players: { ...p.players }
                    };
                })
            } break;
        }
    }

    return {
        state,
        setState,
        handleMessage,
    }
}