export enum FoldingMessageType {
    None = 0,
    GameStarted,
    GameEnded,
    SubmitSelection,
    NewSequence,
};

export enum Instruction {
    HalfUp = 0,
    HalfDown = 1,
    HalfRight = 2,
    HalfLeft = 3,
    QuarterUp = 4,
    QuarterDown = 5,
    QuarterRight = 6,
    QuarterLeft = 7
};

export interface Paper {
    layers: number[][];
}

export interface Sequence {
    papers: Paper[];
    holes: boolean[][];
}

export interface PlayerState {
    instructions: Instruction[];
    sequence: Sequence | undefined; // Player's own unique sequence
    points: number;
    cycles: number;
    correct: number | undefined;
    total: number;
};

export const instructionSet: Record<Instruction, number[]> = {
    [Instruction.HalfUp]: [2, 0, 1],        // Half-fold up
    [Instruction.HalfDown]: [2, 0 , -1],    // Half-fold down
    [Instruction.HalfRight]: [2, 1, 0],     // Half-fold right
    [Instruction.HalfLeft]: [2, -1 , 0],    // Half-fold left
    [Instruction.QuarterUp]:[4, 0, 1],      // Quarter-fold up
    [Instruction.QuarterDown]: [4, 0, -1],  // Quarter-fold down
    [Instruction.QuarterRight]:[4, 1, 0],   // Quarter-fold right
    [Instruction.QuarterLeft]: [4, -1 , 0]  // Quarter-fold left
};