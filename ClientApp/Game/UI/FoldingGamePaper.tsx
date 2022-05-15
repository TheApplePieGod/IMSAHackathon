import * as React from "react";
import { styled, Box, useTheme } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { FoldingGameState } from "../FoldingGame";
import { instructionSet } from "../../Definitions/Socket/FoldingGame";
import { Canvas } from "../../Components/UI/Canvas";

const socketContext = useSocketContext();
const baseState = socketContext.baseState;
const gameContext = socketContext.getGame(GameType.PaperFolding);
const gameState = gameContext.state as FoldingGameState;
const theme = useTheme();

const player = "joe";



export const drawPaper = (ctx: CanvasRenderingContext2D, frameCount: number) => {
    if (!gameState.players.hasOwnProperty(player)) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillRect(100, 100, 100, 100);

    for (let i = 0; i < gameState.players[player].sequence.papers.length; i++) {
        
        
        ctx.font = `20px ${theme.typography.fontFamily}`;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
    }
}