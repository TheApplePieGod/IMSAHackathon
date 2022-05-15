import * as React from "react";
import { styled, Box, useTheme } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { FoldingGameState } from "../FoldingGame";
import { instructionSet } from "../../Definitions/Socket/FoldingGame";
import { Canvas } from "../../Components/UI/Canvas";

interface Props {
    player: string;
}

const CANVAS_SIZE = 500;
const IMAGE_SIZE = 60;

export const FoldingGameScreen = (props: Props) => {
    const socketContext = useSocketContext();
    const baseState = socketContext.baseState;
    const gameContext = socketContext.getGame(GameType.PaperFolding);
    const gameState = gameContext.state as FoldingGameState;
    const theme = useTheme();

    const { player } = props;

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        
    }

    return (
        <Box sx={{ width: 500, height: 500, border: "2px solid black" }}>
            <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        </Box>
    );
}