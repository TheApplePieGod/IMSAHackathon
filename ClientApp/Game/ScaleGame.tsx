import * as React from "react";
import { GameType } from "../Definitions/Socket/GameType";
import {Animal, Scale, ScaleMessageType} from "../Definitions/Socket/ScaleGame";
import { BaseState } from "./SocketContext";

interface PlayerState {
    scales: Scale[];
    score: number;
    cycles: number;
    correct: boolean | undefined;
}

export interface ScaleGameState {
    players: Record<string, PlayerState>;
}

const DEFAULT_STATE: ScaleGameState = {
    players: {}
}

interface Props {
    sendMessage: (msgType: number, gameType: GameType, data: string) => void;
    baseState: BaseState;
    setBaseState: React.Dispatch<React.SetStateAction<BaseState>>;
}

export const useScaleGame = (props: Props) => {
    const [state, setState] = React.useState<ScaleGameState>(DEFAULT_STATE);

    const handleMessage = (msgType: number, data: string) => {
        switch (msgType) {
            default:
            { } break;
            case ScaleMessageType.NewScales: {
                const parsed = JSON.parse(data);
                setState(p => {
                    p.players[parsed.player] = {
                        scales: [...parsed.equalityScales, parsed.unknownScale],
                        score: parsed.score,
                        cycles: parsed.cycles,
                        correct: undefined
                    };

                    return {
                        ...p,
                        players: { ...p.players }
                    };
                })
            } break;
            case ScaleMessageType.SubmitAnswer: {
                const parsed = JSON.parse(data);
                setState(p => {
                    p.players[parsed.player] = {
                        ...p.players[parsed.player],
                        correct: parsed.correct
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