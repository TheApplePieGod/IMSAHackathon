import * as React from "react";
import { styled, Box, useTheme, Button } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { MathGameState } from "../MathGame";
import { Canvas } from "../../Components/UI/Canvas";
import { MathMessageType } from "../../Definitions/Socket/MathGame";

const StyledButton = styled(Button)(
    ({ theme }) => `
        border: 2px solid #736F54;
        background-color: #A2845A;
        box-shadow: 5px 5px 6px #00000029;
        border-radius: 20px;
        padding: 1rem;
        position: absolute;
        &:hover {
            background-color: #A2845A;
            box-shadow: 5px 5px 6px #00000029;
        }
    `
);

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
const NET_IMAGE = new Image();
NET_IMAGE.src = "/images/net.png";

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
        const playerState = gameState.players[player];

        const remaining = gameState.maxChoices - playerState.selections.length;

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        ctx.font = `${textSize}px ${theme.typography.fontFamily}`;
        ctx.textAlign = "center";
        ctx.fillStyle = "white";

        // Render net with remaining count in the top left
        const netSize = imageSize * 0.75;
        ctx.drawImage(NET_IMAGE, 10, 10, netSize, netSize);
        ctx.fillText(`x${remaining}`, netSize + 10, netSize + 10);

        // Render creatures
        for (let i = 0; i < playerState.options.length; i++) {
            // Do not render selected creatures
            if (playerState.selections.find(s => s == i)) continue;

            while (i >= positions.length)
                positions.push({ x: Math.random() * canvasSize, y: Math.random() * canvasSize });
            const position = positions[i];
            ctx.drawImage(BUTTERFLY_IMAGE, position.x - imageSize * 0.5, position.y - imageSize * 0.5, imageSize, imageSize);

            const option = playerState.options[i];
            ctx.fillText(option, position.x, position.y);
        }
        
        if (remaining == 0) {
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "#000000AA";
            ctx.fill();
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

    // Move to next area
    const next = () => {
        setPositions([]);
        setVelocities([]);
        socketContext.sendMessage(MathMessageType.NewOptions, GameType.Math, "");
    }

    // Update position of creatures
    React.useEffect(() => {
        if (!gameState.players.hasOwnProperty(player)) return;
        const playerState = gameState.players[player];

        if (gameState.maxChoices - playerState.selections.length > 0) {
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
        }
    }, [gameState, positions, velocities])

    return (
        <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }} onClick={onClick}>
            {(gameState.players.hasOwnProperty(props.player) && gameState.maxChoices - gameState.players[props.player].selections.length == 0) &&
                <StyledButton variant="contained" onClick={next}>
                    Next Area
                </StyledButton>
            }
            <Canvas draw={draw} width={canvasSize} height={canvasSize} />
        </Box>
    );
}