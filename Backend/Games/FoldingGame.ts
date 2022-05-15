import { Lobby } from "../Lobby";
import { Player } from "../Player";
import { GameType } from "./GameType";

enum FoldingMessageType {
    None = 0,
    GameStarted,
    SubmitSelection,
    NewOptions,
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
    holes: boolean[][]; // Holes the player has currently chosen as their answer
    sequence: Sequence; // Player's own unique sequence
    solution: boolean[][] // Solution to player's own unique sequence
    // Add point system
};

interface FoldingGameState {
    players: Record<string, PlayerState>;
};

const DEFAULT_STATE: FoldingGameState = {
    players: {}
};

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
        
        // Filter out all half-folds that are in the same dimension as the instruction selected
        intInstructions.filter((value) => {
            for (let i = 0; i < instructions.length; i++) {
                if (instructionSet[value][0] == 2) {
                    if (instructionSet[instruction][1] != 0 && instructionSet[value][1] != 0) return false;
                    if (instructionSet[instruction][2] != 0 && instructionSet[value][2] != 0) return false;    
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
    let holeSequence : boolean[][] = [];

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
                paperSequence.push(newPaper)
            break;
            
            case Instruction.HalfDown:
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (row >= 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper)
            break;

            case Instruction.HalfRight:
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (col < 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper)
            break;

            case Instruction.HalfLeft: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 0; row < 4; row++) {
                    for (let col = 0; col < 4; col++) {
                        if (col >= 2) newPaper.layers[row][col] *= 2
                        else newPaper.layers[row][col] = 0
                    }
                }
                paperSequence.push(newPaper)
            break;

            case Instruction.QuarterUp: 
                newPaper = JSON.parse(JSON.stringify(paperSequence[paperSequence.length - 1]));
                for (let row = 3; row > 0; row--) {
                    let changed = false;
                    
                    for (let col = 0; col < 4; col++) {
                        if (newPaper.layer[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layer[row - 1][col] = newPaper.layer[row - 1][col] + newPaper.layer[row][col];
                            newPaper.layer[row][col] = 0;
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
                        if (newPaper.layer[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layer[row + 1][col] = newPaper.layer[row + 1][col] + newPaper.layer[row][col];
                            newPaper.layer[row][col] = 0;
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
                        if (newPaper.layer[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layer[row][col - 1] = newPaper.layer[row][col - 1] + newPaper.layer[row][col];
                            newPaper.layer[row][col] = 0;
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
                        if (newPaper.layer[row][col] == 0) continue;
                        else {
                            changed = true;
                            newPaper.layer[row][col + 1] = newPaper.layer[row][col + 1] + newPaper.layer[row][col];
                            newPaper.layer[row][col] = 0;
                        }
                    }

                    if (changed) break;
                }
                paperSequence.push(newPaper);
            break;
            
            default: ;
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
        for (let j = 0; j < 4; i++) {
            if (finalPaper.layers[i][j] != 0) paperToUnfold[i].push(true);
            else paperToUnfold[i].push(false);
        }
    }

    // Get a deep copy the hole punches to assign "true" to where-ever the holes will end up when unfolding
    let solution: boolean[][] = JSON.parse(JSON.stringify(sequence.holes));

    for (let i = instructions.length - 1; i > -1; i++) {
        // Reverse engineer the instructions here to get the solution matrix
        instructions.length;
    }
    
    return solution;
}

export const handleMessage = (lobby: Lobby, player: Player, messageType: FoldingMessageType, data: string) => {
    
}

export const startGame = (lobby: Lobby) => {
    const state = DEFAULT_STATE;

    lobby.getAllPlayers().forEach(p => {
        let instructions: Instruction[] = generateInstructions();
        let sequence: Sequence = generateSequence(instructions);
        const playerState: PlayerState = {
            holes: [
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false],
                [false, false, false, false]
            ],
            sequence: sequence,
            solution: findSolution(instructions, sequence)
            // Add point system
        };
        
        // Send this player's sequence to all players
        lobby.getAllPlayers().forEach(p2 => {
            p2.sendMessage(FoldingMessageType.NewOptions, GameType.PaperFolding, JSON.stringify({
                player: p.id,
                sequence: playerState.sequence
                // Add point system
            }));
        });
    
        // Send this player the gamestarted message
        p.sendMessage(FoldingMessageType.GameStarted, GameType.PaperFolding, JSON.stringify({
        
        }));

        state.players[p.id] = playerState;
    });

    lobby.gameState = state;
}
