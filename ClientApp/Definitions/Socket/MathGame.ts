export enum MathMessageType {
    None = 0,
    GameStarted,
    GameEnded,
    SubmitSelection,
    NewOptions,
};

export interface MathGameResults {
    player: string;
    points: number;
    cycles: number;
}