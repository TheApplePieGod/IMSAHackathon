import { Player } from "./Player";

export class Lobby {
    id: string;
    host: Player;
    clients: Player[];

    constructor(id:string, host: Player) {
        this.id = id;
        this.host = host;
    }

    removeClient = (player: Player) => {
        const index = this.clients.findIndex(c => c.id == player.id);
        if (index != -1)
            this.clients.splice(index, 1);
    }

    // Get a player object based on its id
    getPlayerFromId = (id: string) => {
        if (this.host.id == id) return this.host;
        for (let i = 0; i < this.clients.length; i++) {
            if (this.clients[i].id == id) return this.clients[i];
        }
        return undefined;
    }

    // Called when a new player joins the lobby
    addNewPlayer = (player: Player) => {
        this.host.onPlayerJoin(player);
        player.onPlayerJoin(this.host);
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].onPlayerJoin(player);
            player.onPlayerJoin(this.clients[i]);
        }

        this.clients.push(player);
    }

    // Called when a non-host player leaves the lobby
    removePlayer = (player: Player) => {
        this.host.onPlayerLeave(player);
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].onPlayerLeave(player);
        }

        this.removeClient(player);
    }

    // Close the lobby and disconnect all players
    close = () => {
        for (let i = 0; i < this.clients.length; i++) {
            this.clients[i].disconnect("Host has left the game lobby");
        }
    }
}

export const lobbies: Record<string, Lobby> = {};

export const doesLobbyExist = (roomId: string) => {
    return lobbies.hasOwnProperty(roomId);
}

export const removeLobby = (roomId: string) => {
    if (doesLobbyExist(roomId)) {
        lobbies[roomId].close();
        delete lobbies[roomId];
    }
}