import * as ws from "ws";
import { GameType } from "./Games/GameType";
import { GenericMessageType } from "./GenericHandler";

export class Player {
    socket: ws.WebSocket;
    name: string;
    id: string;
    isHost: boolean;

    constructor(socket: ws.WebSocket, name: string, id: string, isHost: boolean) {
        this.socket = socket;
        this.name = name;
        this.id = id;
        this.isHost = isHost;
    }

    // Check if this player is valid and still connected
    isValid = () => {
        return this.socket.readyState === this.socket.OPEN;
    }

    // Send a correctly formatted message over the websocket connection
    sendMessage = (messageType: number, gameType: GameType, data: string) => {
        if (!this.isValid()) return;

        const message = JSON.stringify({
            messageType,
            gameType,
            data
        });

        this.socket.send(message);
    }

    // Close the connection with an optional message
    disconnect = (message?: string) => {
        const NORMAL_CLOSURE = 1000;
        this.socket.close(NORMAL_CLOSURE, message);
    }

    // Serialize the necessary information from this player
    serialize = () => {
        return {
            name: this.name,
            id: this.id,
            isHost: this.isHost
        };
    }

    // Event that is called when the host creates a room
    // and sends them the room code
    onRoomCreated = (roomId: string) => {
        this.sendMessage(GenericMessageType.RoomCreated, GameType.None, roomId);
    }

    // Event that is called when a player joins
    // isCurrent signifies to the client whether or not the player
    // information sent in this message is themselves
    onPlayerJoin = (player: Player, isCurrent: boolean = false) => {
        const serialized = player.serialize();
        serialized["isCurrent"] = isCurrent;
        this.sendMessage(GenericMessageType.PlayerJoin, GameType.None, JSON.stringify(serialized));
    }

    // Event that is called when a player leaves
    onPlayerLeave = (player: Player) => {
        const serialized = player.serialize();
        this.sendMessage(GenericMessageType.PlayerLeave, GameType.None, JSON.stringify(serialized));
    }
}