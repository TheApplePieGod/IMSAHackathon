import { IncomingMessage } from "http";
import * as ws from "ws";
import { GameType } from "./Games/GameType";
import { GenericMessageType } from "./GenericHandler";
import { doesLobbyExist, lobbies, Lobby, removeLobby } from "./Lobby";
import { handleMessage } from "./MessageHandler";
import { Player } from "./Player";
import { createRoomId, createUUID } from "./Util";

export const connectionHandler = (socket: ws.WebSocket, req: IncomingMessage) => {
    // We need a base url so that new URL() can parse
    const baseUrl = `http://${req.headers.host}`;
    
    // Parse url information
    let roomId: string | null = null;
    let name: string | null = null;
    try {
        const url = new URL(req.url || "", baseUrl);
        roomId = url.searchParams.get("room");
        name = url.searchParams.get("name");
    } catch {}

    // Ensure the roomid and player name were passed in the socket connection
    if (!roomId || !name) {
        socket.close();
        return;
    }

    // Create a new player
    // Roomid of zero signifies a new lobby should be created and this player should be the host
    const isHost = roomId == "0";
    const player = new Player(socket, name, createUUID(), isHost);
    
    let lobby: Lobby;
    if (isHost) {
        // Generate a new unique room id
        let newRoomId = "";
        while (newRoomId == "" || doesLobbyExist(newRoomId)) {
            newRoomId = createRoomId();
        }

        // Create a new lobby
        lobby = new Lobby(newRoomId, player);
        lobbies[newRoomId] = lobby;

        // Send room info to the host
        player.onRoomCreated(newRoomId);
    } else {
        // Search for an existing lobby to join and ensure it exists
        const exists = doesLobbyExist(roomId);
        if (!exists) {
            socket.close();
            return;
        }
        lobby = lobbies[roomId];

        // Join the lobby
        lobby.addNewPlayer(player);
    }

    // Send the player their own information
    // isCurrent is true because the player is themselves
    player.onPlayerJoin(player, true);

    // Send the lobby's game rotation
    player.sendMessage(GenericMessageType.GameRotation, GameType.None, JSON.stringify(lobby.gameRotation));

    socket.on('close', () => {
        // Remove the player from the lobby when the connection is closed
        // if they are the host, close the lobby
        if (player.isHost) {
            removeLobby(lobby.id);
        } else {
            lobby.removePlayer(player);
        }
    });

    socket.on('message', message => {
        // Delegate message to the handleMessage function
        handleMessage(lobby, player, message);
    });
}