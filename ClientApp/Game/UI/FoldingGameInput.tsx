import * as React from "react";
import { styled, Box, useTheme, Typography, Grid, Button } from "@mui/material";
import { Canvas } from "../../Components/UI/Canvas";
import { useSocketContext } from "../SocketContext";

interface Props {
    dots: boolean[];
    setDots: (dots: boolean[]) => void;
    isLocalPlayer: boolean;
}

const CANVAS_SIZE = 500;

const FoldingGameInput = (props: Props) => {
    const { dots, setDots, isLocalPlayer } = props;

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
        if (!isLocalPlayer) return;

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
        
        let newDots = {...dots};
        newDots[4 * gridY + gridX] = !newDots[4 * gridY + gridX];

        setDots(newDots);
    }

    return (
        <React.Fragment>
            <Box sx={{ position: "relative", width: "100%", height: "100%", border: "2px solid black"}} onClick={onClick}>
                <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
            </Box>
        </React.Fragment>
    )
}

export default FoldingGameInput;