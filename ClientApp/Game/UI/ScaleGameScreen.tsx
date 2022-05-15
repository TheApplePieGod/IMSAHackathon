import * as React from "react";
import { Box, Paper, useTheme, IconButton, Button, styled, Typography } from "@mui/material";
import { GameType } from "../../Definitions/Socket/GameType";
import {Animal, Scale, ScaleMessageType} from "../../Definitions/Socket/ScaleGame";
import { useLocation, useNavigate } from "react-router";
import { useSocketContext } from "../SocketContext";
import {ScaleGameState} from "../ScaleGame";
import { Canvas } from "../../Components/UI/Canvas";
import { CastSharp, CheckBoxTwoTone } from "@mui/icons-material";

interface Props {
    player: string;
}

enum ImageAlign {
    START = 0,
    MID,
    END
}

const imageSizes: any = {
    bird: [50, 50],
    bug: [80, 50],
    snake: [80, 80],
    elephant: [80, 80],
    jaguar: [80, 50],
    lion: [80, 80],
    monkey: [50, 80],
}

const CANVAS_SIZE = 1000;
const CANVAS_MARGIN = 70;

const StyledButton = styled(Button)(
    ({ theme }) => `
        border: 2px solid #736F54;
        background-color: #A2845A;
        box-shadow: 5px 5px 6px #00000029;
        border-radius: 10px;
        &:hover {
            background-color: #A2845A;
            box-shadow: 5px 5px 6px #00000029;
        }
    `
);

const ScaleGameScreen = (props: Props) => {

    const theme = useTheme();

    const socketContext = useSocketContext();
    const baseState = socketContext.baseState;
    const gameContext = socketContext.getGame(GameType.Scales);
    const gameState = gameContext.state as ScaleGameState;
    const { player } = props;

    const canvasScale = baseState.localPlayer?.id === props.player ? 1.0 : 0.5;
    const canvasSize = CANVAS_SIZE * canvasScale;
    const canvasMargin = CANVAS_MARGIN * canvasScale;
    const textSize = 30 * canvasScale;


    const drawImage = (debug: Boolean, ctx: CanvasRenderingContext2D, image: HTMLImageElement, ax: ImageAlign, ay: ImageAlign, x: number, y: number, width: number, height: number) => {
        if(debug){
            ctx.beginPath();
            ctx.strokeStyle = "blue";
            ctx.lineWidth = 2;
            ctx.rect(x, y, x + width, y + height);
            ctx.stroke();
        }

        let finalX = 0;
        if(ax == ImageAlign.START) finalX = x;
        else if(ax == ImageAlign.MID) finalX = x - width * 0.5;
        else finalX = x - width;

        let finalY = 0;
        if(ay == ImageAlign.START) finalY = y;
        else if(ay == ImageAlign.MID) finalX = y - height * 0.5;
        else finalY = y - height;

        ctx.drawImage(image, finalX, finalY, width, height);
    }

    const drawAnimals = (ctx: CanvasRenderingContext2D, sideType: boolean, side: Animal[], baseline: number) => {
        let offset = sideType ? canvasSize - canvasMargin : canvasMargin;
        for(let j = 0; j < side.length; j++){
            const image = new Image();
            image.src = `/images/${side[j].name}.png`;
            let imageBounds = [...imageSizes[side[j].name]];
            imageBounds[0] *= canvasScale;
            imageBounds[1] *= canvasScale;
            drawImage(false, ctx, image, sideType ? ImageAlign.END : ImageAlign.START, ImageAlign.END, offset, baseline, imageBounds[0], imageBounds[1]);

            ctx.font = `${textSize}px ${theme.typography.fontFamily}`;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeText(side[j].count.toString(), offset + imageBounds[0] / 2 * (sideType ? -1 : 1), baseline - 20);

            ctx.font = `${textSize}px ${theme.typography.fontFamily}`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(side[j].count.toString(), offset + imageBounds[0] / 2 * (sideType ? -1 : 1), baseline - 20);

            offset += (sideType ? -1 : 1) * (imageBounds[0] + 20);
        }
    }
    
    const answerScreenVisible = () => {
        if (!gameState.players.hasOwnProperty(player)) return;
        const correct = gameState.players[player].correct;
        return correct !== undefined;
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (!gameState.players.hasOwnProperty(player)) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let scales = gameState.players[player].scales;
        for (let i = 0; i < scales.length; i++) {
            const scaleBaseline = ((ctx.canvas.height) / 5) * (i == scales.length - 1 ? 4 : i + 1);

            // Triangle
            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.moveTo(canvasSize / 2, scaleBaseline + 5);
            ctx.lineTo(canvasSize / 2 - 25, scaleBaseline + 25);
            ctx.lineTo(canvasSize / 2 + 25, scaleBaseline + 25);
            ctx.fill();

            // Seesaw
            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = "green";
            ctx.moveTo(canvasMargin, scaleBaseline);
            ctx.lineTo(canvasSize - canvasMargin, scaleBaseline);
            ctx.stroke();

            // Equals
            if (i != scales.length - 1) {
                ctx.font = `${textSize}px ${theme.typography.fontFamily}`;
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText("======", (canvasSize) * 0.5, scaleBaseline - 15);
            }

            drawAnimals(ctx, false, gameState.players[player].scales[i].leftSide, scaleBaseline);
            drawAnimals(ctx, true, gameState.players[player].scales[i].rightSide, scaleBaseline);
        }

        if (answerScreenVisible()) {
            ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.fillStyle = "#000000AA";
            ctx.fill();
        }
    }

    // Left: false, right: true
    const submitAnswer = (answer: boolean) => {
        socketContext.sendMessage(ScaleMessageType.SubmitAnswer, GameType.Scales, JSON.stringify({
            answer
        }));
    }

    const next = () => {
        socketContext.sendMessage(ScaleMessageType.NewScales, GameType.Scales, "");
    }

    const renderNextButton = () => {
        if (!gameState.players.hasOwnProperty(player)) return;
        const correct = gameState.players[player].correct;
        if (correct === undefined) return undefined;
        return (
            <Box sx={{ display: "flex", flexDirection: "column", position: "absolute", textAlign: "center" }}>
                <Typography color="textSecondary">{correct ? "Correct!" : "Incorrect..."}</Typography>
                <StyledButton variant="contained" onClick={next}>
                    Next Set
                </StyledButton>
            </Box>
        )
    }

    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Canvas draw={draw} width={canvasSize} height={canvasSize} />
            {renderNextButton()}
            {(baseState.localPlayer?.id === player && !answerScreenVisible()) &&
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    position: "absolute",
                    bottom: "0px",
                    left: "50%",
                    transform: "translateX(-50%)"
                }}>
                    <Typography>Which is Heavier?</Typography>
                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <StyledButton
                            variant="contained"
                            onClick={() => submitAnswer(false)}
                            sx={{
                                zIndex: "10",
                                left: "5px",
                                bottom: "5px"
                            }}
                        >
                            Left
                        </StyledButton>

                        <StyledButton
                            variant="contained"
                            onClick={() => submitAnswer(true)}
                            sx={{
                                zIndex: "10",
                                right: "5px",
                                bottom: "5px"
                            }}
                        >
                            Right
                        </StyledButton>
                    </Box>
                </Box>
            }
        </Box>
    );
}

export default ScaleGameScreen;
