import { GameType } from "./Games/GameType";
import { Player } from "./Player";
import { shuffle } from "./Util";
import { startGame as startScaleGame, endGame as endScaleGame } from "./Games/ScaleGame";
import { startGame as startMathGame, endGame as endMathGame } from "./Games/MathGame";
import { GenericMessageType } from "./GenericHandler";

export interface LobbyParams {
    gameLength: number; // seconds
    gameDelay: number; // seconds
    rotationCount: number;
}

export class Lobby {
    id: string;
    host: Player;
    clients: Player[];
    gameStarted: boolean;
    gameState: any;
    gameRotation: GameType[];
    rotationIndex: number;
    currentRotation: number;
    params: LobbyParams;

    constructor(id: string, host: Player) {
        this.id = id;
        this.host = host;
        this.clients = [];
        this.gameStarted = false;
        this.gameState = {};
        this.gameRotation = [];
        this.rotationIndex = 0;
        this.currentRotation = 0;
        this.params = {
            gameLength: 30,
            gameDelay: 10,
            rotationCount: 1
        };

        this.updateGameRotation();
    }

    // Updates the game rotation with three random games
    updateGameRotation = () => {
        this.gameRotation = [];
        Object.getOwnPropertyNames(GameType).forEach(p => this.gameRotation.push(parseInt(p)));
        shuffle(this.gameRotation);
    }

    // Returns a list of all players including the host
    // The return value should not be permanently stored
    getAllPlayers = () => {
        return [...this.clients, this.host];
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

    // Start the match
    startMatch = () => {
        if (this.gameStarted) return;

        this.gameStarted = true;
        this.rotationIndex = 0;
        this.currentRotation = 0;

        this.startNextGame();
    }

    endGame = () => {
        if (!this.gameStarted) return;

        const game = this.gameRotation[this.rotationIndex];
        switch (game) {
            default: break;
            case GameType.Scales: {
                endScaleGame(this);
            } break;
            case GameType.Math: {
                endMathGame(this);
            } break;
            case GameType.PaperFolding: {

            } break;
        }
        
        // Send the generic game end message to all players
        this.getAllPlayers().forEach(p => {
            p.sendMessage(GenericMessageType.GameEnded, GameType.None, JSON.stringify({
                timestamp: Date.now(),
                delay: this.params.gameDelay * 1000
            }));
        });

        // Start the countdown before the next game
        setTimeout(this.startNextGame, this.params.gameDelay * 1000);
    }

    // Starts the next game in the rotation
    startNextGame = () => {
        if (!this.gameStarted) return;

        const game = this.gameRotation[this.rotationIndex];
        switch (game) {
            default: break;
            case GameType.Scales: {
                startScaleGame(this);
            } break;
            case GameType.Math: {
                startMathGame(this);
            } break;
            case GameType.PaperFolding: {

            } break;
        }

        this.rotationIndex++;
        if (this.rotationIndex >= this.gameRotation.length) {
            this.currentRotation++;
            this.rotationIndex = 0;

            // TODO: max rotation
            if (this.currentRotation > this.params.rotationCount) {

            }
        }

        // Send the generic game start message to all players
        this.getAllPlayers().forEach(p => {
            p.sendMessage(GenericMessageType.GameStarted, GameType.None, JSON.stringify({
                timestamp: Date.now(),
                duration: this.params.gameLength * 1000
            }));
        });

        // Start the game timer
        setTimeout(this.endGame, this.params.gameLength);
    }
}

export var lobbies: Record<string, Lobby> = {};

export const doesLobbyExist = (roomId: string) => {
    return lobbies.hasOwnProperty(roomId);
}

export const removeLobby = (roomId: string) => {
    if (doesLobbyExist(roomId)) {
        lobbies[roomId].close();
        delete lobbies[roomId];
    }
}