import * as React from "react";
import { Box, Paper, useTheme, IconButton, Button, styled } from "@mui/material";
import { GameType } from "../../Definitions/Socket/GameType";
import {Animal, Scale} from "../../Definitions/Socket/ScaleGame";
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
    elephant: [80, 80],
    jaguar: [80, 50],
    lion: [80, 50],
    monkey: [50, 80],
}

const CANVAS_SIZE = 750;
const CANVAS_MARGIN = 50;

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

const ScaleGameScreen = () => {

    const theme = useTheme();

    // const socketContext = useSocketContext();
    // const baseState = socketContext.baseState;
    // const gameContext = socketContext.getGame(GameType.Scales);
    // const gameState = gameContext.state as ScaleGameState;
    // const {player} = props;

    //Example player and gameState
    const player = "joe";
    const gameState: ScaleGameState = {
        players: {
            "joe": {
                scales: [
                    {
                        leftSide: [
                            {
                                name: "bird",
                                count: 45
                            },
                            {
                                name: "elephant",
                                count: 45
                            }
                        ],
                        rightSide: [
                            {
                                name: "bug",
                                count: 3
                            },
                            {
                                name: "elephant",
                                count: 45
                            }
                        ]
                    },
                    {
                        leftSide: [
                            {
                                name: "bird",
                                count: 45
                            },
                            {
                                name: "elephant",
                                count: 45
                            }
                        ],
                        rightSide: [
                            {
                                name: "bug",
                                count: 3
                            },
                            {
                                name: "elephant",
                                count: 45
                            }
                        ]
                    },
                    {
                        leftSide: [
                            {
                                name: "bird",
                                count: 45
                            },
                            {
                                name: "elephant",
                                count: 45
                            }
                        ],
                        rightSide: [
                            {
                                name: "bug",
                                count: 3
                            },
                            {
                                name: "elephant",
                                count: 45
                            }
                        ]
                    }
                ],
                score: 5
            }
        }
    }

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
        let offset = sideType ? CANVAS_SIZE - CANVAS_MARGIN : CANVAS_MARGIN;
        for(let j = 0; j < side.length; j++){
            const image = new Image();
            image.src = `/images/${side[j].name}.png`;
            let imageBounds = imageSizes[side[j].name];
            drawImage(false, ctx, image, sideType ? ImageAlign.END : ImageAlign.START, ImageAlign.END, offset, baseline, imageBounds[0], imageBounds[1]);

            ctx.font = `30px ${theme.typography.fontFamily}`;
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(side[j].count.toString(), offset + imageBounds[0] / 2 * (sideType ? -1 : 1), baseline - 20);

            ctx.font = `30px ${theme.typography.fontFamily}`;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 1;
            ctx.strokeText(side[j].count.toString(), offset + imageBounds[0] / 2 * (sideType ? -1 : 1), baseline - 20);

            offset += (sideType ? -1 : 1) * (imageBounds[0] + 20);
        }
    }

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (!gameState.players.hasOwnProperty(player)) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        let scales = gameState.players[player].scales;
        for (let i = 0; i < scales.length; i++) {
            const scaleBaseline = ((ctx.canvas.height) / 5) * (i == scales.length - 1 ? 4 : i + 1);

            ctx.beginPath();
            ctx.fillStyle = "red";
            ctx.moveTo(CANVAS_SIZE / 2, scaleBaseline + 5);
            ctx.lineTo(CANVAS_SIZE / 2 - 25, scaleBaseline + 25);
            ctx.lineTo(CANVAS_SIZE / 2 + 25, scaleBaseline + 25);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 10;
            ctx.strokeStyle = "green";
            ctx.moveTo(CANVAS_MARGIN, scaleBaseline);
            ctx.lineTo(CANVAS_SIZE - CANVAS_MARGIN, scaleBaseline);
            ctx.stroke();

            drawAnimals(ctx, false, gameState.players[player].scales[i].leftSide, scaleBaseline);
            drawAnimals(ctx, true, gameState.players[player].scales[i].rightSide, scaleBaseline);
        }
    }

    return (
        <Box sx={{ position: "relative", width: CANVAS_SIZE, height: CANVAS_SIZE, border: "2px solid black" }}>
            <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
            <Box sx={{
                display: "flex",
                gap: "1rem",
                position: "absolute",
                bottom: "0px",
                left: "50%",
                transform: "translateX(-50%)"
            }}>
                <StyledButton variant="contained" sx={{
                    zIndex: "10",
                    left: "5px",
                    bottom: "5px"
                }}>
                    Left
                </StyledButton>

                <StyledButton variant="contained" sx={{
                    zIndex: "10",
                    right: "5px",
                    bottom: "5px"
                }}>
                    Right
                </StyledButton>
            </Box>
        </Box>
    );
}

export default ScaleGameScreen;
