import { Typography } from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GameType } from "../Definitions/Socket/GameType";
import { GenericMessageType } from "../Definitions/Socket/GenericHandler";
import { ConfirmDialog } from "../Components/UI/ConfirmDialog";

export interface BaseState {

}

const DEFAULT_STATE: BaseState = {

}

export interface SocketContext {
    baseState: BaseState;
    updateBaseState: (value: React.SetStateAction<BaseState>) => void;
    getGame: (type: GameType) => GameContext;
    sendMessage: (msgType: number, gameType: GameType, data: string) => void;
}

export interface GameContext {
    state: any;
    setState: React.Dispatch<React.SetStateAction<any>>;
    handleMessage: (msgType: number, data: string, baseState: BaseState, setBaseState: React.Dispatch<React.SetStateAction<BaseState>>) => void;
} 

interface Props {
    children: React.ReactNode[] | React.ReactNode;
}

const SocketContext = React.createContext({} as SocketContext);
export const SocketContextProvider = (props: Props) => {
    const navigate = useNavigate();

    const { roomIdString, name } = useParams<{ roomIdString: string; name: string; }>();

    const cancel = () => {
        navigate("/");
    }

    const getProtocol = () => {
        return "ws";
        //return process.env.NEXT_PUBLIC_IS_PRODUCTION ? "wss" : "ws";
    }

    const {
        sendMessage,
        lastMessage,
        readyState,
        getWebSocket
    } = useWebSocket(`${getProtocol()}://${location.host}?room=${roomIdString}&name=${name}`, {
        onOpen: () => { console.log("Websocket connected"); },
        onClose: (e) => {
            console.log(`Websocket close: ${e.reason}`);
            navigate("/");
            if (e.reason != "") {
                // dispatch(openGlobalSnackbar({
                //     status: SnackbarStatus.Error,
                //     message: `Connection closed: ${e.reason}`,
                //     closeDelay: 3000
                // }));
            }
        },
        onError: (e) => {
            console.log(`Websocket error`);
            navigate("/");
            // dispatch(openGlobalSnackbar({
            //     status: SnackbarStatus.Error,
            //     message: "Your connection has been lost",
            //     closeDelay: 3000
            // }));
        },
        shouldReconnect: () => false
    });

    const sendMessageType = (msgType: number, gameType: GameType, data: string) => {
        const str = JSON.stringify({ msgType, gameType, data });
        const blob = new Blob([str], {
            type: "application/json"
        });
        sendMessage(blob);
    }

    const [baseState, setBaseState] = React.useState(DEFAULT_STATE);

    const games: Record<GameType, GameContext> = {
        [GameType.None]: {} as GameContext,
        [GameType.Scale]: {} as GameContext,
    };

    const getGame = (type: GameType) => {
        return games[type];
    }

    const processMessage = React.useCallback((event: MessageEvent) => {
        let jsonString = "";
        if (typeof (event.data) == "string")
            jsonString = event.data;
        else {
            let buffer: ArrayBuffer;
            if (event.data instanceof ArrayBuffer) {
                buffer = event.data;
            } else {
                return;
            }

            var enc = new TextDecoder("utf-8");
            jsonString = enc.decode(buffer);
        }

        const msg = JSON.parse(jsonString);
        const msgType = msg.messageType as number;
        const gameType = msg.gameType as GameType;
        const data = msg.Data;

        getGame(gameType).handleMessage(msgType, data, baseState, setBaseState);
    }, []);

    React.useEffect(() => {
        if (lastMessage) {
            processMessage(lastMessage);
        }
    }, [lastMessage, processMessage]);

    React.useEffect(() => {
        // send heartbeat in order to keep websocket connection alive
        const interval = setInterval(() => {
            sendMessageType(GenericMessageType.Heartbeat, GameType.None, "");
        }, 1000 * 85); // 85 seconds

        return () => clearInterval(interval);
    }, [sendMessageType]);

    // Set the socket datatype as arraybuffer so we can read it synchronously
    React.useEffect(() => {
        if (readyState == ReadyState.OPEN) {
            (getWebSocket() as any).binaryType = "arraybuffer";
        }
    }, [readyState])

    return (
        <SocketContext.Provider
            value={{
                baseState,
                updateBaseState: setBaseState,
                getGame,
                sendMessage: sendMessageType,
            }}
        >
            {readyState == ReadyState.OPEN ?
                props.children
                :
                <ConfirmDialog
                    simple={true}
                    open={true}
                    onConfirm={() => {}}
                    onCancel={cancel}
                    onClose={cancel}
                    title="Connecting"
                    cancelText="Cancel"
                >
                    <Typography variant="body1">
                        Logging in...
                    </Typography>
                </ConfirmDialog>
            }
        </SocketContext.Provider>
    );
}

export const useSocketContext = () => React.useContext(SocketContext);