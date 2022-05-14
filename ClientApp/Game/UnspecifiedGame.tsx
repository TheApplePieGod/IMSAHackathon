import * as React from "react";
import { UnspecifiedMessageType } from "../Definitions/Socket/UnspecifiedGame";
import { GameType } from "../Definitions/Socket/GameType";
import { BaseState } from "./SocketContext";
import { Player } from "../Definitions/Socket/Player";

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
            case UnspecifiedMessageType.PlayerJoin: {
                const parsed: Player = JSON.parse(data);
                props.setBaseState((p) => {
                    return {
                        ...p,
                        playerList: [ ...p.playerList, parsed ],
                        localPlayer: parsed.isCurrent ? parsed : p.localPlayer
                    };
                })
            } break;
            case UnspecifiedMessageType.PlayerLeave: {
                const parsed: Player = JSON.parse(data);
                props.setBaseState((p) => {
                    const index = p.playerList.findIndex(e => e.id == parsed.id);
                    if (index != -1) {
                        p.playerList.splice(index, 1);
                    }

                    return {
                        ...p,
                        playerList: [ ...p.playerList ],
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