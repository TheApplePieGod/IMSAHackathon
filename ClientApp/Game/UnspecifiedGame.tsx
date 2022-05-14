import * as React from "react";
import { UnspecifiedMessageType } from "../Definitions/Socket/UnspecifiedGame";
import { GameType } from "../Definitions/Socket/GameType";
import { BaseState } from "./SocketContext";

export interface UnspecifiedGameState {

}

const DEFAULT_STATE: UnspecifiedGameState = {

}

interface Props {
    sendMessage: (msgType: number, gameType: GameType, data: string) => void;
    baseState: BaseState;
    setBaseState: React.Dispatch<React.SetStateAction<BaseState>>;
}

export const useUnspecifiedGame = (props: Props) => {
    const [state, setState] = React.useState<UnspecifiedGameState>(DEFAULT_STATE);

    const handleMessage = (msgType: number, data: string) => {
        switch (msgType) {
            default:
            { } break;
            case UnspecifiedMessageType.RoomCreated: {
                props.setBaseState((p) => {
                    return {
                        ...p,
                        hostRoomId: data
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