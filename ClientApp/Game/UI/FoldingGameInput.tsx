import * as React from "react";
import { styled, Box, useTheme, Typography, Grid } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { FoldingGameState } from "../FoldingGame";
import { instructionSet } from "../../Definitions/Socket/FoldingGame";
import { Canvas } from "../../Components/UI/Canvas";

const CANVAS_SIZE = 500;

const FoldingGameInput = () => {

    const [dots, setDots] = React.useState<boolean[]>(Array(16).fill(true));

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        for(let i = 0; i < 16; i++){
            if(dots[i]){
                const x = i % 4;
                const y = Math.floor(i / 4);
                ctx.beginPath();
                ctx.fillStyle = "black";
                ctx.arc(CANVAS_SIZE / 8 + CANVAS_SIZE / 4 * x, CANVAS_SIZE / 8 + CANVAS_SIZE / 4 * y, 40, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
    }

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {

        console.log("in onclick method");

        //if (localPlayer?.id !== props.player) return;

        const target: Element = e.target as Element;
        const bound = target.getBoundingClientRect();
        
        // Get mouse x and y relative to element
        let x = e.pageX - bound.left;
        let y = e.pageY - bound.top;
        
        // Transform x and y to be in canvas space
        x = (x / bound.width) * CANVAS_SIZE;
        y = (y / bound.height) * CANVAS_SIZE;
        
        let gridX = Math.floor(x / (CANVAS_SIZE / 4));
        let gridY = Math.floor(y / (CANVAS_SIZE / 4));
        
        console.log(gridX + ", " + gridY);

        let newDots = {...dots};
        newDots[4 * gridY + gridX] = !newDots[4 * gridY + gridX];

        console.log(newDots);

        setDots(newDots);
    }

    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%", border: "2px solid black"}} onClick={onClick}>
            <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        </Box>
    )
}

export default FoldingGameInput;