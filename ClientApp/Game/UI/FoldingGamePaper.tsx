import * as React from "react";
import { styled, Box, useTheme } from "@mui/material";
import { FoldingGameState } from "../FoldingGame";
import { Canvas } from "../../Components/UI/Canvas";
import { Instruction, Paper, Sequence, instructionSet } from "../../Definitions/Socket/FoldingGame"
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";

interface Props {
    player: string,
    index: number
}

const CANVAS_SIZE = 500;
const IMAGE_SIZE = 60;
const PAPER_SIZE = 460;

function canvas_arrow(context: CanvasRenderingContext2D, fromx: number, fromy: number, tox: number, toy: number) {
    var headLength = 10; // Length of the arrowhead in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headLength * Math.cos(angle - Math.PI / 6), toy - headLength * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headLength * Math.cos(angle + Math.PI / 6), toy - headLength * Math.sin(angle + Math.PI / 6));
}

export const FoldingGamePaper = (props: Props) => {
    const socketContext = useSocketContext();
    const baseState = socketContext.baseState;
    const gameContext = socketContext.getGame(GameType.PaperFolding);
    const gameState = gameContext.state as FoldingGameState;
    const theme = useTheme();

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (!gameState.players.hasOwnProperty(props.player)) return;

        const sequence = gameState.players[props.player].sequence;
        if (!sequence) return;

        var x = 0, y = 0;
        ctx.fillStyle = "#756551";
        switch (props.index) {
            case 0: 
                x = 20; 
                y = 20;
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                ctx.fillRect(20, 20, PAPER_SIZE, PAPER_SIZE);
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.rect(20, 20, PAPER_SIZE, PAPER_SIZE);
                ctx.stroke();
                break;
            case 1: 
                x = CANVAS_SIZE - PAPER_SIZE - 20;
                y = 20;
                ctx.fillRect(CANVAS_SIZE - PAPER_SIZE - 20, 20, PAPER_SIZE, PAPER_SIZE);
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.rect(CANVAS_SIZE - PAPER_SIZE - 20, 20, PAPER_SIZE, PAPER_SIZE);
                ctx.stroke();
                break;
            case 2: 
                x = 20; 
                y = CANVAS_SIZE - PAPER_SIZE - 20;
                ctx.fillRect(20, CANVAS_SIZE - PAPER_SIZE - 20, PAPER_SIZE, PAPER_SIZE);
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.rect(20, CANVAS_SIZE - PAPER_SIZE - 20, PAPER_SIZE, PAPER_SIZE);
                ctx.stroke();
                break;
            case 3: 
                x = CANVAS_SIZE - PAPER_SIZE - 20; 
                y = CANVAS_SIZE - PAPER_SIZE - 20;
                ctx.fillRect(CANVAS_SIZE - PAPER_SIZE - 20, CANVAS_SIZE - PAPER_SIZE - 20, PAPER_SIZE, PAPER_SIZE);
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.rect(CANVAS_SIZE - PAPER_SIZE - 20, CANVAS_SIZE - PAPER_SIZE - 20, PAPER_SIZE, PAPER_SIZE);
                ctx.stroke();
                break;
        }

        ctx.fillStyle = "rgb(195, 186, 131)";
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                if (sequence.papers[props.index].layers[row][col] == 0) {
                    ctx.fillRect(x + col * PAPER_SIZE / 4, 
                                 y + row * PAPER_SIZE / 4, 
                                 PAPER_SIZE / 4, PAPER_SIZE / 4);
                }
            }
        }

        if (props.index != sequence.papers.length - 1) {
            let xFold = instructionSet[gameState.players[props.player].instructions[props.index]][1];
            let yFold = instructionSet[gameState.players[props.player].instructions[props.index]][2];
            
            ctx.beginPath();
            ctx.strokeStyle = "#000000";
            ctx.lineWidth = 3;

            if (xFold == 1) {
                canvas_arrow(ctx, 420 + x, 20 + y, 20 + x, 20 + y);
            } else if (xFold == -1) {
                canvas_arrow(ctx, 20 + x, 20 + y, 420 + x, 20 + y);
            } else if (yFold == 1) {
                canvas_arrow(ctx, 20 + x, 420 + y, 20 + x, 20 + y);
            } else if (yFold == -1) {
                canvas_arrow(ctx, 20 + x, 20 + y, 20 + x, 420 + y);
            }

            ctx.stroke();
        } else {
            for (let row = 0; row < 4; row++) {
                for (let col = 0; col < 4; col++) {
                    if (sequence.holes[row][col]) {
                        ctx.beginPath();
                        ctx.fillStyle = "#000000";
                        ctx.arc(x + col * PAPER_SIZE / 4 + PAPER_SIZE / 8, 
                                y + row * PAPER_SIZE / 4 + PAPER_SIZE / 8, 
                                PAPER_SIZE / 8 - 10, 0, 2 * Math.PI);
                        ctx.fill();
                    }
                }
            }
        }

        ctx.font = `20px ${theme.typography.fontFamily}`;
        ctx.textAlign = "center";
        ctx.fillStyle = "black";
    }

    return (
        <Box sx={{ width: "100%", height: "auto" }}>
            <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        </Box>
    );
}