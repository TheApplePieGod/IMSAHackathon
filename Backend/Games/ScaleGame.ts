import { Lobby } from "../Lobby";
import { Player } from "../Player";
import { shuffle } from "../Util";
import { GameType } from "./GameType";

// Define message types for this handler
enum ScaleMessageType {
    None = 0,
    GameStarted,
    GameEnded,
    SubmitAnswer,
    NewScales,
}

interface Animal {
    name: string;
    count: number;
}

interface Scale {
    leftSide: Animal[];
    rightSide: Animal[];
}

// Individual player state for this game
interface PlayerState {
    answer: boolean; // Left: false, right: true
    answered: boolean;
    weight: number;
    score: number;
    cycles: number;
};

// Define the state for this game
interface ScaleGameState {
    players: Record<string, PlayerState>;
};

const DEFAULT_STATE: ScaleGameState = {
    players: {},
}

// Results sent to the client when the game is finished
interface GameResults {
    player: string;
    points: number;
    cycles: number;
}

const animalList: Record<string, number[]> = {
    "bug": [1, 3],
    "snake": [4, 6],
    "bird": [7, 10],
    "monkey": [10, 15],
    "jaguar": [15, 20],
    "lion": [20, 30],
    "elephant": [30, 40]
};

const generateScales = () => {
    const equalityCount = 2; // number of equality scales

    // Populate exactly equalityCount * 2 animals to use for this set of scales
    const animals: string[] = Object.getOwnPropertyNames(animalList);
    while (animals.length > equalityCount * 2) {
        const index = Math.floor(Math.random() * animals.length);
        if (index == animals.length - 1)
            animals.pop();
        else
            animals[index] = animals.pop() || "";
    }
    shuffle(animals);

    // Select random weight values for the animals based on their ranges
    const weights: Record<string, number> = {};
    animals.forEach(a => {
        const diff = animalList[a][1] - animalList[a][0];
        const weight = Math.random() * diff + animalList[a][0];
        weights[a] = weight;
    });

    // Populate equality scales
    const equalityScales: Scale[] = [];
    for (let i = 0; i < equalityCount; i++) {
        // Keep making random scales until the right side
        let scale: Scale = { leftSide: [], rightSide: [] };
        let weight = 0;
        let lastRemovedAnimal = "";
        while (scale.rightSide.length == 0) {
            // Add back the last removed animal in case of failure
            if (lastRemovedAnimal != "")
                animals.push(lastRemovedAnimal)

            // Select one random animal and count for the first side
            const animal1Index = Math.floor(Math.random() * animals.length);
            const animal1 = animals[animal1Index];
            const count1 = Math.floor(Math.random() * 4) + 2;
            const weight1 = weights[animal1] * count1;

            // Remove this animal so it is more likely to get unique combinations
            // in the next scales
            lastRemovedAnimal = animals.splice(animal1Index, 1)[0];

            // Populate the other side with animals by filling with values as close as we can get
            let remainingWeight = weight1;
            const balancingAnimals: Animal[] = [];
            animals.forEach(a => {
                if (a == animal1) return;
                const weight = weights[a];
                const maxCount = Math.floor(remainingWeight / weight);
                if (maxCount == 0) return;
                remainingWeight -= weight * maxCount;
                balancingAnimals.push({
                    name: a,
                    count: maxCount
                });
            });

            scale = {
                leftSide: [{ name: animal1, count: count1 }],
                rightSide: balancingAnimals
            };

            weight = remainingWeight;
        }

        equalityScales.push(scale);

        // console.log(`Remaining weight: ${weight}`, JSON.stringify(scale));
    }

    // Add back the removed animals so we can pick from them for the unknown scale
    equalityScales.forEach(s => animals.push(s.leftSide[0].name));

    // Generate a side of the unknown scale
    const genSide = () => {
        const side: Animal[] = [];
        let finalWeight = 0;

        // Amount of animal types on each side
        const types = Math.floor(Math.random() * 2) + 1;
        for (let i = 0; i < types; i++) {
            const animalIndex = Math.floor(Math.random() * animals.length);
            const animal = animals[animalIndex];
            const count = Math.floor(Math.random() * 4) + 2;
            finalWeight += count * weights[animal];
            side.push({ name: animal, count });
            animals.splice(animalIndex, 1); // Remove the animal so we don't get duplicates
        }
        return { side, weight: finalWeight };
    }

    const leftSide = genSide();
    const rightSide = genSide();
    const answer = rightSide.weight > leftSide.weight;
    const unknownScale: Scale = {
        leftSide: leftSide.side,
        rightSide: rightSide.side
    }

    // console.log(`Unknown: ${JSON.stringify(unknownScale)}`);
    // console.log(`Answer: ${answer}`);

    return {
        equalityScales,
        unknownScale,
        answer,
        weight: answer ? rightSide.weight : leftSide.weight
    };
}

// The ScaleGame handler handles messages relating to the ScaleGame
export const handleMessage = (lobby: Lobby, player: Player, messageType: ScaleMessageType, data: string) => {
    const state = lobby.gameState as ScaleGameState;

    switch (messageType) {
        default: break;
        case ScaleMessageType.SubmitAnswer: {
            // Ensure player has a state value
            if (!state.players.hasOwnProperty(player.id)) break;
            const playerState = state.players[player.id];

            if (playerState.answered) break;

            const parsed = JSON.parse(data);

            if (parsed.answer == playerState.answer) {
                playerState.score += Math.floor(playerState.weight * 10);
            }

            playerState.answered = true;

            // Send answer
            lobby.getAllPlayers().forEach(p => {
                p.sendMessage(ScaleMessageType.SubmitAnswer, GameType.Scales, JSON.stringify({
                    player: player.id,
                    correct: parsed.answer == playerState.answer
                }));
            });
        } break;
        case ScaleMessageType.NewScales: {
            // Ensure player has a state value
            if (!state.players.hasOwnProperty(player.id)) break;
            const playerState = state.players[player.id];

            if (!playerState.answered) break;

            const scales = generateScales();
            playerState.weight = scales.weight;
            playerState.answer = scales.answer;
            playerState.answered = false;
            playerState.cycles++;

            // Send new scales to all players
            lobby.getAllPlayers().forEach(p => {
                p.sendMessage(ScaleMessageType.NewScales, GameType.Scales, JSON.stringify({
                    player: player.id,
                    equalityScales: scales.equalityScales,
                    unknownScale: scales.unknownScale,
                    score: playerState.score,
                    cycles: playerState.cycles
                }));
            });
        } break;
    }
}

export const startGame = (lobby: Lobby) => {
    const state = DEFAULT_STATE;

    lobby.getAllPlayers().forEach(p => {
        const scales = generateScales();

        const playerState: PlayerState = {
            answer: scales.answer,
            answered: false,
            weight: scales.weight,
            score: 0,
            cycles: 0
        };

        // Send this player's scales to all players
        lobby.getAllPlayers().forEach(p2 => {
            p2.sendMessage(ScaleMessageType.NewScales, GameType.Scales, JSON.stringify({
                player: p.id,
                equalityScales: scales.equalityScales,
                unknownScale: scales.unknownScale,
                score: 0,
                cycles: 0
            }));
        });
        
        // // Send this player the gamestarted message
        // p.sendMessage(MathMessageType.GameStarted, GameType.Math, JSON.stringify({
            
        // }));

        state.players[p.id] = playerState;
    });

    lobby.gameState = state;
}

export const endGame = (lobby: Lobby) => {
    const state = lobby.gameState as ScaleGameState;

    const results: GameResults[] = [];
    lobby.getAllPlayers().forEach(p => {
        // Ensure player has a state value
        if (!state.players.hasOwnProperty(p.id)) return;
        const playerState = state.players[p.id];

        // Add this game's score to the player's total score
        p.score += playerState.score;

        results.push({
            player: p.id,
            points: playerState.score,
            cycles: playerState.cycles
        });
    });

    // Send results to all players
    lobby.getAllPlayers().forEach(p => {
        p.sendMessage(ScaleMessageType.GameEnded, GameType.Scales, JSON.stringify(results));
    });
}