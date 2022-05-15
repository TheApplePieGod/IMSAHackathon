export enum ScaleMessageType {
    None = 0,
    GameStarted,
    GameEnded,
    SubmitAnswer,
    NewScales,
};

export interface Animal {
    name: string;
    count: number;
}

export interface Scale {
    leftSide: Animal[];
    rightSide: Animal[];
}

export interface ScaleGameResults {
    player: string;
    points: number;
    cycles: number;
}