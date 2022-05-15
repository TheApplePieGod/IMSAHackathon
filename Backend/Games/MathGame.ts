import { Lobby } from "../Lobby";
import { Player } from "../Player";
import { GameType } from "./GameType";

// Define message types for this handler
enum MathMessageType {
    None = 0,
    GameStarted,
    GameEnded,
    SubmitSelection,
    NewOptions,
}

interface NumberOption {
    text: string;
    value: number;
};

// Individual player state for this game
interface PlayerState {
    options: NumberOption[]; // Options the player is currently choosing from
    points: number; // Player's current point count
    cycles: number; // Amount of times the player has submitted choices
};

// Define the state for this game
interface MathGameState {
    players: Record<string, PlayerState>;
    maxChoices: number;
    optionCount: number;
};

const DEFAULT_STATE: MathGameState = {
    players: {},
    maxChoices: 3,
    optionCount: 10
}

// Results sent to the client when the game is finished
interface GameResults {
    player: string;
    points: number;
    cycles: number;
}

// Generate a random number that is either an integer or a decimal
const generateNumber = () => {
    let text = "";
    let value = 0;

    const max = 20; // Max value of 20
    const pick = Math.random() * 3;
    if (pick < 1) { // Decimal
        value = (Math.random() * max) + 1;
        text = value.toFixed(1);
    } else {
        value = Math.ceil(Math.random() * max);
        text = value.toString();
    }

    return { text, value };
}

// Generate a fraction and return combined value and text
const generateFraction = () => {
    const top = generateNumber();
    const bottom = generateNumber();

    return {
        text: `${top.text}/${bottom.text}`,
        value: +(top.value / bottom.value).toFixed(2)
    }
}

// Generate a list of options for the player to choose from that can
// either be a whole number, decimal, or fraction
const generateOptions = (count: number, maxChoices: number) => {
    const options: NumberOption[] = [];
    for (let i = 0; i < count; i++) {
        const pick = Math.random();
        if (pick < 0.5) { // Non-fraction
            options.push(generateNumber())
        } else { // Fraction
            options.push(generateFraction());
        }
    }

    // Sort by value
    options.sort((a, b) => a.value - b.value);

    // Scale the values of the largest to be worth more points
    // based on the number of choices the player is allowed to make
    for (let i = options.length - maxChoices; i < options.length; i++) {
        options[i].value *= 3;
    }

    return options;
}

// The MathGame handler handles messages relating to the MathGame
export const handleMessage = (lobby: Lobby, player: Player, messageType: MathMessageType, data: string) => {
    const state = lobby.gameState as MathGameState;

    switch (messageType) {
        default: break;
        case MathMessageType.SubmitSelection: {
            // Ensure player has a state value
            if (!state.players.hasOwnProperty(player.id)) break;
            const playerState = state.players[player.id];

            // Data should contain an array of indexes pointing to the player's selection
            const selections: number[] = JSON.parse(data);

            // Verify submission length matches choices
            if (selections.length != state.maxChoices) break;

            // Add points for each selection
            selections.forEach(index => {
                if (index >= playerState.options.length) return;
                const selection = playerState.options[index];
                playerState.points += selection.value * 100; // Scale by 100 to prevent decimal points
            });

            playerState.cycles++;
            playerState.options = generateOptions(state.optionCount, state.maxChoices);

            // Send new options to all players
            lobby.getAllPlayers().forEach(p => {
                p.sendMessage(MathMessageType.NewOptions, GameType.Math, JSON.stringify({
                    player: player.id,
                    options: playerState.options,
                    points: playerState.points
                }));
            })
        }
    }
}

export const startGame = (lobby: Lobby) => {
    const state = DEFAULT_STATE;

    lobby.getAllPlayers().forEach(p => {
        const playerState: PlayerState = {
            options: generateOptions(state.optionCount, state.maxChoices),
            points: 0,
            cycles: 1
        };

        // Send this player's options to all players
        lobby.getAllPlayers().forEach(p2 => {
            p2.sendMessage(MathMessageType.NewOptions, GameType.Math, JSON.stringify({
                player: p.id,
                options: playerState.options,
                points: 0
            }));
        });
        
        // Send this player the gamestarted message
        p.sendMessage(MathMessageType.GameStarted, GameType.Math, JSON.stringify({
            
        }));

        state.players[p.id] = playerState;
    });

    lobby.gameState = state;
}

export const endGame = (lobby: Lobby) => {
    const state = lobby.gameState as MathGameState;

    const results: GameResults[] = [];
    lobby.getAllPlayers().forEach(p => {
        // Ensure player has a state value
        if (!state.players.hasOwnProperty(p.id)) return;
        const playerState = state.players[p.id];

        // Add this game's points to the player's total score
        p.score += playerState.points;

        results.push({
            player: p.id,
            points: playerState.points,
            cycles: playerState.cycles
        });
    });

    // Send results to all players
    lobby.getAllPlayers().forEach(p => {
        p.sendMessage(MathMessageType.GameEnded, GameType.Math, JSON.stringify(results));
    });
}