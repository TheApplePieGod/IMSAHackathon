import * as React from "react";
import { styled, Box, useTheme } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { MathGameState } from "../MathGame";
import { Canvas } from "../../Components/UI/Canvas";

interface Props {
    player: string;
}

interface Coordinate {
    x: number;
    y: number;
}

const CANVAS_SIZE = 500;
const IMAGE_SIZE = 60;

// Load images to draw
const BUTTERFLY_IMAGE = new Image();
BUTTERFLY_IMAGE.src = "/images/butterfly.png";

export const MathGameScreen = (props: Props) => {
    const socketContext = useSocketContext();
    const baseState = socketContext.baseState;
    const gameContext = socketContext.getGame(GameType.Math)
    const gameState = gameContext.state as MathGameState;
    const theme = useTheme();

    const [positions, setPositions] = React.useState<Coordinate[]>([]);
    const [velocities, setVelocities] = React.useState<Coordinate[]>([]);

    const { player } = props;

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (!gameState.players.hasOwnProperty(player)) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < gameState.players[player].options.length; i++) {
            if (i >= positions.length)
                positions.push({ x: Math.random() * CANVAS_SIZE, y: Math.random() * CANVAS_SIZE });
            const position = positions[i];
            ctx.drawImage(BUTTERFLY_IMAGE, position.x - IMAGE_SIZE * 0.5, position.y - IMAGE_SIZE * 0.5, IMAGE_SIZE, IMAGE_SIZE);

            const option = gameState.players[player].options[i];
            ctx.font = `20px ${theme.typography.fontFamily}`;
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(option, position.x, position.y);
        }
    }

    // Update position of creatures
    React.useEffect(() => {
        const int = setInterval(() => {
            const scalar = 5;
            for (let i = 0; i < positions.length; i++) {
                if (i >= velocities.length)
                    velocities.push({ x: Math.random() * scalar - scalar * 0.5, y: Math.random() * scalar - scalar * 0.5 });
                const velocity = velocities[i];
                positions[i].x += velocity.x;
                positions[i].y += velocity.y;

                if (positions[i].x >= CANVAS_SIZE || positions[i].x < 0)
                    velocities[i].x *= -1;
                if (positions[i].y >= CANVAS_SIZE || positions[i].y < 0)
                    velocities[i].y *= -1;

                setPositions([...positions]);
                setVelocities([...velocities]);
            }
        }, 25);

        return () => clearInterval(int);
    }, [positions, velocities])

    return (
        <Box sx={{ width: 500, height: 500, border: "2px solid black" }}>
            <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        </Box>
    );
}