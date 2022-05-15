import * as React from "react";
import { styled, Box, useTheme } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { MathGameState } from "../MathGame";
import { Canvas } from "../../Components/UI/Canvas";
import { MathMessageType } from "../../Definitions/Socket/MathGame";

interface Props {
    player: string;
}

interface Coordinate {
    x: number;
    y: number;
}

const CANVAS_SIZE = 1000;
const IMAGE_SIZE = 120;
const IMAGE_MARGIN = 60;

// Load images to draw
const BUTTERFLY_IMAGE = new Image();
BUTTERFLY_IMAGE.src = "/images/butterfly.png";

export const MathGameScreen = (props: Props) => {
    const socketContext = useSocketContext();
    const gameContext = socketContext.getGame(GameType.Math)
    const gameState = gameContext.state as MathGameState;
    const theme = useTheme();

    const [positions, setPositions] = React.useState<Coordinate[]>([]);
    const [velocities, setVelocities] = React.useState<Coordinate[]>([]);

    const { player } = props;
    const { localPlayer } = socketContext.baseState;

    const canvasScale = localPlayer?.id === props.player ? 1.0 : 0.5;
    const canvasSize = CANVAS_SIZE * canvasScale;
    const imageSize = IMAGE_SIZE * canvasScale;
    const imageBB = imageSize - IMAGE_MARGIN * canvasScale;
    const moveSpeed = 10 * canvasScale;
    const textSize = 40 * canvasScale;

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (!gameState.players.hasOwnProperty(player)) return;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < gameState.players[player].options.length; i++) {
            // Do not render selected creatures
            if (gameState.players[player].selections.find(s => s == i)) continue;

            if (i >= positions.length)
                positions.push({ x: Math.random() * canvasSize, y: Math.random() * canvasSize });
            const position = positions[i];
            ctx.drawImage(BUTTERFLY_IMAGE, position.x - imageSize * 0.5, position.y - imageSize * 0.5, imageSize, imageSize);

            const option = gameState.players[player].options[i];
            ctx.font = `${textSize}px ${theme.typography.fontFamily}`;
            ctx.textAlign = "center";
            ctx.fillStyle = "white";
            ctx.fillText(option, position.x, position.y);
        }
    }

    const submitSelection = (index: number) => {
        socketContext.sendMessage(MathMessageType.SubmitSelection, GameType.Math, index.toString());
    }

    const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (localPlayer?.id !== props.player) return;

        const target: Element = e.target as Element;
        const bound = target.getBoundingClientRect();
        
        // Get mouse x and y relative to element
        let x = e.pageX - bound.left;
        let y = e.pageY - bound.top;
        
        // Transform x and y to be in canvas space
        x = (x / bound.width) * canvasSize;
        y = (y / bound.height) * canvasSize;
        
        // Search from the back since that is the order it will appear on the screen
        let foundIndex = -1;
        for (let i = positions.length - 1; i >= 0; i--) {
            const pos = positions[i];

            // Outside bounds
            if (x < pos.x - imageBB || x > pos.x + imageBB) continue;
            if (y < pos.y - imageBB || y > pos.y + imageBB) continue;

            foundIndex = i;
            break;
        }

        if (foundIndex != -1) {
            submitSelection(foundIndex);
        }
    }

    // Update position of creatures
    React.useEffect(() => {
        const int = setInterval(() => {
            for (let i = 0; i < positions.length; i++) {
                if (i >= velocities.length)
                    velocities.push({ x: Math.random() * moveSpeed - moveSpeed * 0.5, y: Math.random() * moveSpeed - moveSpeed * 0.5 });
                const velocity = velocities[i];
                positions[i].x += velocity.x;
                positions[i].y += velocity.y;

                if (positions[i].x >= canvasSize || positions[i].x < 0)
                    velocities[i].x *= -1;
                if (positions[i].y >= canvasSize || positions[i].y < 0)
                    velocities[i].y *= -1;

                setPositions([...positions]);
                setVelocities([...velocities]);
            }
        }, 25);

        return () => clearInterval(int);
    }, [positions, velocities])

    return (
        <Box sx={{ width: "100%", height: "100%" }} onClick={onClick}>
            <Canvas draw={draw} width={canvasSize} height={canvasSize} />
        </Box>
    );
}