export enum ScaleMessageType {
    None = 0
};

export interface Animal {
    name: string;
    count: number;
}

export interface Scale {
    leftSide: Animal[];
    rightSide: Animal[];
}