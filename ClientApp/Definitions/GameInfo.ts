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
        description: "In Creature Capture, you will be given two scales showing how heavy animals are, and you must find which way the third scale will tilt! After the time is up, you will be given points based on how many you got right.",
        previewURL: "/images/caterpillar.png"
    },
    [GameType.PaperFolding]: {
        name: "Bookworms",
        description: "In Bookworms, you will be shown a piece of paper that is folded three times. If a worm eats holes through the paper after it is folded, what will the paper look like when it is unfolded? After time is up, you will be given points based on how many questions you got right.",
        previewURL: "/images/butterfly.png"
    },
    [GameType.Math]: {
        name: "Bug Hunt",
        description: "In Bug Hunt, you will be shown a swarm of mathematical bugs. Every bug will show a fraction or decimal, and your job is to quickly find the largest values. You will get points based on the bugs you choose, with a large bonus for choosing the three largest bugs.",
        previewURL: "/images/fern.png"
    }
}