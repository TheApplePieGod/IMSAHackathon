import { GameType } from "./Socket/GameType";

export interface GameInfo {
    name: string;
    description: string;
    previewURL: string;
}

export const gameInfoMap: Record<GameType, GameInfo> = {
    [GameType.Unspecified]: {
        name: "Loading...",
        description: "Loading...",
        previewURL: ""
    },
    [GameType.Scales]: {
        name: "Creature Capture",
        description: "In Creature Capture, you will be given two scales showing how heavy animals are, and you must find which way the third scale will tilt! You can see your friends' progress on the side and everyone's number of correct solutions. After the time is up, you will be given points based on how many you got right.",
        previewURL: ""
    },
    [GameType.PaperFolding]: {
        name: "Bookworms",
        description: "Bookworms description",
        previewURL: ""
    },
    [GameType.Math]: {
        name: "Bug Hunt",
        description: "Bug hunt description",
        previewURL: ""
    }
}