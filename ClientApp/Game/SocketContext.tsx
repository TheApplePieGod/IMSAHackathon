import { Typography } from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Message } from "../Definitions/Socket/Message";
import { GameType } from "../Definitions/Socket/GameType";
import { UnspecifiedMessageType } from "../Definitions/Socket/UnspecifiedGame";
import { Player } from "../Definitions/Socket/Player";
import { ConfirmDialog } from "../Components/UI/ConfirmDialog";
import { useUnspecifiedGame } from "./UnspecifiedGame";
import { useMathGame } from "./MathGame";

export interface BaseState {
    hostRoomId: string;
    playerList: Player[];
    localPlayer: Player | undefined;
    rotationIndex: number;
    gameRotation: GameType[];
    timerTimestamp: number;
    timerDuration: number;
    lobbyOpen: boolean;
    gameEnded: boolean;
    matchEnded: boolean;
}

const TEST_PLAYER_LIST: Player[] = [
    { name: "Player1", id: "player1", isHost: true, isCurrent: true, ready: false, score: 100 },
    { name: "Player2", id: "player2", isHost: false, isCurrent: false, ready: true, score: 100 },
    { name: "Player3", id: "player3", isHost: false, isCurrent: false, ready: false, score: 100 },
];

const DEFAULT_STATE: BaseState = {
    hostRoomId: "",
    playerList: TEST_PLAYER_LIST,
    localPlayer: undefined,
    rotationIndex: 0,
    gameRotation: [ GameType.Unspecified ],
    timerTimestamp: 0,
    timerDuration: 0,
    lobbyOpen: true,
    gameEnded: false,
    matchEnded: false,
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
    handleMessage: (msgType: number, data: string) => void;
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

    const getHost = () => {
        return "localhost:3000"
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

        const msg: Message = JSON.parse(jsonString);
        getGame(msg.gameType).handleMessage(msg.messageType, msg.data);
    }, []);

    const {
        sendMessage,
        readyState,
        getWebSocket
    } = useWebSocket(`${getProtocol()}://${getHost()}?room=${roomIdString}&name=${name}`, {
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
        shouldReconnect: () => false,
        onMessage: processMessage
    });

    const sendMessageType = (messageType: number, gameType: GameType, data: string) => {
        const str = JSON.stringify({ messageType, gameType, data });
        const blob = new Blob([str], {
            type: "application/json"
        });
        sendMessage(blob);
    }

    const [baseState, setBaseState] = React.useState(DEFAULT_STATE);

    const games: Record<GameType, GameContext> = {
        [GameType.Unspecified]: useUnspecifiedGame({ sendMessage: sendMessageType, baseState, setBaseState }),
        [GameType.Scales]: {} as GameContext,
        [GameType.PaperFolding]: {} as GameContext,
        [GameType.Math]: useMathGame({ sendMessage: sendMessageType, baseState, setBaseState }),
    };

    const getGame = (type: GameType) => {
        return games[type];
    }

    React.useEffect(() => {
        // send heartbeat in order to keep websocket connection alive
        const interval = setInterval(() => {
            sendMessageType(UnspecifiedMessageType.Heartbeat, GameType.Unspecified, "");
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