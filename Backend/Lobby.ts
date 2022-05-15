import { GameType } from "./Games/GameType";
import { Player } from "./Player";
import { shuffle } from "./Util";
import { startGame as startScaleGame, endGame as endScaleGame } from "./Games/ScaleGame";
import { startGame as startMathGame, endGame as endMathGame } from "./Games/MathGame";
import { startGame as startFoldingGame, endGame as endFoldingGame } from "./Games/FoldingGame";
import { GenericMessageType } from "./GenericHandler";

export interface LobbyParams {
    gameLength: number; // seconds
    gameDelay: number; // seconds
    rotationCount: number;
}

interface PlayerScore {
    player: string;
    score: number;
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
            gameLength: 45,
            gameDelay: 10,
            rotationCount: 1
        };

        this.updateGameRotation();
    }

    // Updates the game rotation with three random games
    updateGameRotation = () => {
        // this.gameRotation = [GameType.PaperFolding];
        this.gameRotation = [];
        Object.getOwnPropertyNames(GameType).forEach(p => {
            const num = Number(p);
            if (!isNaN(num) && num > 0) // Exclude 'None' game
                this.gameRotation.push(num)
        });
        shuffle(this.gameRotation);
    }

    // Returns a list of all players including the host
    // The return value should not be permanently stored
    getAllPlayers = () => {
        return [...this.clients, this.host];
    }

    // Returns a list of all player scores
    getAllScores = () => {
        const scores: PlayerScore[] = []
        this.getAllPlayers().forEach(p => {
            scores.push({
                player: p.id,
                score: p.score
            });
        })
        return scores;
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

    endMatch = () => {
        if (!this.gameStarted) return;

        this.gameStarted = false;
    }

    // Ends the current game and sends results
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
                endFoldingGame(this);
            } break;
        }
        
        this.rotationIndex++;
        if (this.rotationIndex >= this.gameRotation.length) {
            this.currentRotation++;
            this.rotationIndex = 0;
        }

        // Whether or not the game that ended was the last game
        const lastGame = this.currentRotation >= this.params.rotationCount;

        // Send the generic game end message to all players
        this.getAllPlayers().forEach(p => {
            p.sendMessage(GenericMessageType.GameEnd, GameType.None, JSON.stringify({
                timestamp: Date.now(),
                duration: this.params.gameDelay * 1000,
                scores: this.getAllScores(),
                lastGame
            }));
        });

        
        if (lastGame)
            this.endMatch();
        else
            // Start the countdown before the next game
            setTimeout(this.startNextGame.bind(this), this.params.gameDelay * 1000);
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
                startFoldingGame(this);
            } break;
        }

        // Send the generic game start message to all players
        this.getAllPlayers().forEach(p => {
            p.sendMessage(GenericMessageType.GameStart, GameType.None, JSON.stringify({
                timestamp: Date.now(),
                duration: this.params.gameLength * 1000,
                rotationIndex: this.rotationIndex
            }));
        });

        // Start the game timer
        setTimeout(this.endGame.bind(this), this.params.gameLength * 1000);
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