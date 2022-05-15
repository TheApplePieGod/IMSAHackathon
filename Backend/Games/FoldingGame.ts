import { Lobby } from "../Lobby";
import { Player } from "../Player";
import { GameType } from "./GameType";

enum FoldingMessageType {
    None = 0,
    GameStarted,
    GameEnded,
    SubmitSelection,
    NewSequence,
}

enum Instruction {
    HalfUp = 0,
    HalfDown = 1,
    HalfRight = 2,
    HalfLeft = 3,
    QuarterUp = 4,
    QuarterDown = 5,
    QuarterRight = 6,
    QuarterLeft = 7
}

interface Paper {
    layers: number[][];
}

interface Sequence {
    papers: Paper[];
    holes: boolean[][];
}

interface PlayerState {
    // holes: boolean[][]; // Holes the player has currently chosen as their answer
    instructions: Instruction[];
    sequence: Sequence; // Player's own unique sequence
    // solution: boolean[][] // Solution to player's own unique sequence
    points: number,
    cycles: number
    answered: boolean;
};

interface FoldingGameState {
    players: Record<string, PlayerState>;
    paperSize: number;
};

const DEFAULT_STATE: FoldingGameState = {
    players: {},
    paperSize: 4
};

// Results sent to the client when the game is finished
interface GameResults {
    player: string;
    points: number;
    cycles: number;
}

const instructionSet: Record<Instruction, number[]> = {
    [Instruction.HalfUp]: [2, 0, 1],        // Half-fold up
    [Instruction.HalfDown]: [2, 0 , -1],    // Half-fold down
    [Instruction.HalfRight]: [2, 1, 0],     // Half-fold right
    [Instruction.HalfLeft]: [2, -1 , 0],    // Half-fold left
    [Instruction.QuarterUp]:[4, 0, 1],      // Quarter-fold up
    [Instruction.QuarterDown]: [4, 0, -1],  // Quarter-fold down
    [Instruction.QuarterRight]:[4, 1, 0],   // Quarter-fold right
    [Instruction.QuarterLeft]: [4, -1 , 0]  // Quarter-fold left
};
    
const generateInstructions = () => {
    const steps = 3;

    const strInstructions: string[] = Object.getOwnPropertyNames(instructionSet);
    let intInstructions = [];
    for (let i = 0; i < strInstructions.length; i++) {
        intInstructions.push(parseInt(strInstructions[i]) as Instruction);
    }

    let instructions: Instruction[] = [];
    while (instructions.length < 3) {
        const index = Math.floor(Math.random() * intInstructions.length);
        let instruction = intInstructions[index];
        
        // Filter out:
        //  (a) All half-folds that are in the same dimension as the instruction selected
        //  (b) All quarter-folds that follow half-folds of the same dimension
        intInstructions = intInstructions.filter((value) => {
            if (instructionSet[value][0] == 2) { // Filter (a)
                if (instructionSet[instruction][1] != 0 && instructionSet[value][1] != 0) return false;
                if (instructionSet[instruction][2] != 0 && instructionSet[value][2] != 0) return false;
            } else { // Filter (b)
                if (instructions.length > 0) {
                    if (instructionSet[instructions[0]][0] == 2) { // Only the first instruction being a half-fold can cause problems
                        if (instructionSet[instructions[0]][1] != 0 && instructionSet[value][1] != 0) return false;
                        if (instructionSet[instructions[0]][2] != 0 && instructionSet[value][2] != 0) return false;    
                    }
                }
            }

            return true;
        });

        instructions.push(instruction);
    }

    return instructions;
}

const generateSequence = (instructions: Instruction[]) => {
    let paperSequence: Paper[] = [];
    let holeSequence : boolean[][] = [
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
        [false, false, false, false],
    ];

    let startPaper = {layers: [
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1],
        [1, 1, 1, 1]
    ]}
    paperSequence.push(startPaper)

    for (let i = 0; i < instructions.length; i++) {
        switch (instructions[i]) {
            case Instruction.HalfUp: 
                let newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (row < 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper);
            break;
            
            case Instruction.HalfDown:
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (row >= 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper);
            break;

            case Instruction.HalfRight:
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (col < 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper);
            break;

            case Instruction.HalfLeft: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (col >= 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper);
            break;

            case Instruction.QuarterUp: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 3; row > 0; row--) {
                    let changed = false;
                    
                    for (let col = 0; col < 4; col++) {
                        if (newPaper.layers[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layers[row - 1][col] = newPaper.layers[row - 1][col] + newPaper.layers[row][col];
                            newPaper.layers[row][col] = 0;
                        }
                    }

                    if (changed) break;
                }
                paperSequence.push(newPaper);
            break;
            
            case Instruction.QuarterDown: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 3; row++) {
                    let changed = false;
                
                    for (let col = 0; col < 4; col++) {
                        if (newPaper.layers[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layers[row + 1][col] = newPaper.layers[row + 1][col] + newPaper.layers[row][col];
                            newPaper.layers[row][col] = 0;
                        }
                    }

                    if (changed) break;
                }
                paperSequence.push(newPaper);
            break;

            case Instruction.QuarterRight: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let col = 3; col > 0; col--) {
                    let changed = false;
                    
                    for (let row = 0; row < 4; row++) {
                        if (newPaper.layers[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layers[row][col - 1] = newPaper.layers[row][col - 1] + newPaper.layers[row][col];
                            newPaper.layers[row][col] = 0;
                        }
                    }

                    if (changed) break;
                }
                paperSequence.push(newPaper);
            break;

            case Instruction.QuarterLeft: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let col = 0; col < 3; col++) {
                    let changed = false;
                
                    for (let row = 0; row < 4; row++) {
                        if (newPaper.layers[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layers[row][col + 1] = newPaper.layers[row][col + 1] + newPaper.layers[row][col];
                            newPaper.layers[row][col] = 0;
                        }
                    }

                    if (changed) break;
                }
                paperSequence.push(newPaper);
            break;
            
            default: break;
        }
    }

    let spots = [];
    let finalPaper = paperSequence[paperSequence.length - 1];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (finalPaper.layers[i][j] != 0) {
                spots.push([i, j]);
            }
        }
    }

    var count;
    if (spots.length <= 2) count = 1;
    else if (spots.length <= 4) count = 2;
    else count = 3;
    
    for (let i = 0; i < count; i++) {
        let index = Math.floor(Math.random() * spots.length);
        holeSequence[spots[index][0]][spots[index][1]] = true;
        spots.splice(index, 1);
    }

    return { papers: paperSequence, holes: holeSequence };
}

const findSolution = (instructions: Instruction[], sequence: Sequence) => {
    const finalPaper: Paper = sequence.papers[sequence.papers.length - 1];
    
    // Have a boolean matrix that only shows whether there is paper
    // Helpful for the reverse engineering process
    let paperToUnfold: boolean[][] = [];
    for (let i = 0; i < 4; i++) {
        paperToUnfold.push([])
        for (let j = 0; j < 4; j++) {
            if (finalPaper.layers[i][j] != 0) paperToUnfold[i].push(true);
            else paperToUnfold[i].push(false);
        }
    }

    // Get a deep copy the hole punches to assign "true" to where-ever the holes will end up when unfolding
    let solution: boolean[][] = JSON.parse(JSON.stringify(sequence.holes));

    for (let i = instructions.length - 1; i >= 0; i--) {
        // Reverse engineer the instructions to get the solution matrix
        switch (instructions[i]) {
            case Instruction.HalfUp: 
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (paperToUnfold[row][col]) {
                            paperToUnfold[3 - row][col] = true;
                            solution[3 - row][col] = solution[row][col];
                        }
                    }
                }
            break;
            
            case Instruction.HalfDown:
                for (let row = 3; row > 1; row--) {
                    for (let col = 0; col < 4; col++) {
                        if (paperToUnfold[row][col]) {
                            paperToUnfold[3 - row][col] = true;
                            solution[3 - row][col] = solution[row][col];
                        }
                    }
                }
            break;

            case Instruction.HalfRight:
                for (let col = 0; col < 2; col++) {
                    for (let row = 0; row < 4; row++) {
                        if (paperToUnfold[row][col]) {
                            paperToUnfold[row][3 - col] = true;
                            solution[row][3 - col] = solution[row][col];
                        }
                    }
                }
            break;

            case Instruction.HalfLeft: 
                for (let col = 3; col > 1; col--) {
                    for (let row = 0; row < 4; row++) {
                        if (paperToUnfold[row][col]) {
                            paperToUnfold[row][3 - col] = true;
                            solution[row][3 - col] = solution[row][col];
                        }
                    }
                }
            break;

            case Instruction.QuarterUp: 
                for (let row = 2; row > -1; row--) {
                    let changed = false;

                    for (let col = 0; col < 4; col++) {
                        if (paperToUnfold[row][col]) {
                            changed = true;
                            paperToUnfold[row + 1][col] = true;
                            solution[row + 1][col] = solution[row][col];
                        }
                    }

                    if (changed) break;
                }
            break;
            
            case Instruction.QuarterDown: 
                for (let row = 1; row < 4; row++) {
                    let changed = false;

                    for (let col = 0; col < 4; col++) {
                        if (paperToUnfold[row][col]) {
                            changed = true;
                            paperToUnfold[row - 1][col] = true;
                            solution[row - 1][col] = solution[row][col];
                        }
                    }

                    if (changed) break;
                }
            break;

            case Instruction.QuarterRight: 
                for (let col = 2; col > -1; col--) {
                    let changed = false;

                    for (let row = 0; row < 4; row++) {
                        if (paperToUnfold[row][col]) {
                            changed = true;
                            paperToUnfold[row][col + 1] = true;
                            solution[row][col + 1] = solution[row][col];
                        }
                    }

                    if (changed) break;
                }
            break;

            case Instruction.QuarterLeft: 
                for (let col = 1; col > 4; col++) {
                    let changed = false;

                    for (let row = 0; row < 4; row++) {
                        if (paperToUnfold[row][col]) {
                            changed = true;
                            paperToUnfold[row][col - 1] = true;
                            solution[row][col - 1] = solution[row][col];
                        }
                    }

                    if (changed) break;
                }
            break;
            
            default: break;
        }
    }
    
    return solution;
}

export const handleMessage = (lobby: Lobby, player: Player, messageType: FoldingMessageType, data: string) => {
    const state = lobby.gameState as FoldingGameState;

    switch (messageType) {
        default: break;

        case FoldingMessageType.SubmitSelection: {
            // Ensure player has a state value
            if (!state.players.hasOwnProperty(player.id)) break;
            const playerState = state.players[player.id];

            if (playerState.answered) break;

            const selections: number[][] = JSON.parse(data);
            if (selections.length != state.paperSize * state.paperSize) break;

            const solution = findSolution(playerState.instructions, playerState.sequence);
            let points = 0;
            let correct = 0;
            selections.forEach(position => {
                if (solution[position[0]][position[1]]) {
                    points += 50;
                    correct++;
                }
                else
                    points -= 50;
            });
            
            let totalHoles = 0;
            solution.forEach(r => r.forEach(c => totalHoles += Number(c)));

            playerState.points += Math.max(0, points);
            playerState.answered = true;

            // Send answer
            lobby.getAllPlayers().forEach(p => {
                p.sendMessage(FoldingMessageType.SubmitSelection, GameType.PaperFolding, JSON.stringify({
                    player: player.id,
                    correct,
                    total: totalHoles
                }));
            });
        } break;
        case FoldingMessageType.NewSequence: {
            // Ensure player has a state value
            if (!state.players.hasOwnProperty(player.id)) break;
            const playerState = state.players[player.id];

            if (!playerState.answered) break;

            playerState.cycles++;
            playerState.instructions = generateInstructions();
            playerState.sequence = generateSequence(playerState.instructions);
            playerState.answered = false;

            lobby.getAllPlayers().forEach(p => {
                p.sendMessage(FoldingMessageType.NewSequence, GameType.PaperFolding, JSON.stringify({
                    player: player.id,
                    instructions: playerState.instructions,
                    sequence: playerState.sequence,
                    points: playerState.points,
                    cycles: playerState.cycles
                }));
            })
        } break;
    }
}

export const startGame = (lobby: Lobby) => {
    const state = DEFAULT_STATE;

    lobby.getAllPlayers().forEach(p => {
        let instructions: Instruction[] = generateInstructions();
        let sequence: Sequence = generateSequence(instructions);
        const playerState: PlayerState = {
            instructions: instructions,
            sequence: sequence,
            points: 0,
            cycles: 0,
            answered: false
        };
        
        // Send this player's sequence to all players
        lobby.getAllPlayers().forEach(p2 => {
            p2.sendMessage(FoldingMessageType.NewSequence, GameType.PaperFolding, JSON.stringify({
                player: p.id,
                instructions: playerState.instructions,
                sequence: playerState.sequence,
                points: playerState.points,
                cycles: playerState.cycles
            }));
        });
    
        // Send this player the gamestarted message
        p.sendMessage(FoldingMessageType.GameStarted, GameType.PaperFolding, JSON.stringify({
        
        }));

        state.players[p.id] = playerState;
    });

    lobby.gameState = state;
}

export const endGame = (lobby: Lobby) => {
    const state = lobby.gameState as FoldingGameState;

    const results: GameResults[] = [];
    lobby.getAllPlayers().forEach(p => {
        // Ensure player has a state value
        if (!state.players.hasOwnProperty(p.id)) return;
        const playerState = state.players[p.id];

        // Add this game's score to the player's total score
        p.score += playerState.points;

        results.push({
            player: p.id,
            points: playerState.points,
            cycles: playerState.cycles
        });
    });

    // Send results to all players
    lobby.getAllPlayers().forEach(p => {
        p.sendMessage(FoldingMessageType.GameEnded, GameType.PaperFolding, JSON.stringify(results));
    });
}