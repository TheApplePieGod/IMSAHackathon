import * as React from "react";
import { Box, Paper, useTheme, IconButton } from "@mui/material";
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

const CANVAS_SIZE = 500;
const CANVAS_MARGIN = 50;

const ScaleGameScreen = () => {

    const imageSizes: any = {
        bird: [50, 50],
        bug: [80, 50],
        elephant: [80, 80]
    }

    // const socketContext = useSocketContext();
    // const baseState = socketContext.baseState;
    // const gameContext = socketContext.getGame(GameType.Scales);
    // const gameState = gameContext.state as ScaleGameState;
    // const {player} = props;

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

    const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        if (!gameState.players.hasOwnProperty(player)) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (let i = 0; i < gameState.players[player].scales.length; i++) {
            
            const scaleBaseline = (ctx.canvas.height - 100) / 3 * (i + 1);

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

            let offset = CANVAS_MARGIN;
            let leftSide = gameState.players[player].scales[i].leftSide;
            for(let j = 0; j < leftSide.length; j++){
                const image = new Image();
                image.src = `/images/${leftSide[j].name}.png`;
                let imageBounds = imageSizes[leftSide[j].name];
                drawImage(false,ctx, image, ImageAlign.START, ImageAlign.END, offset, scaleBaseline, imageBounds[0], imageBounds[1]);

                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(leftSide[j].count.toString(), offset + imageBounds[0] / 2, scaleBaseline - 20);

                ctx.font = "30px Comic Sans MS";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.strokeText(leftSide[j].count.toString(), offset + imageBounds[0] / 2, scaleBaseline - 20);

                offset += imageBounds[0] + 20;
            }

            offset = CANVAS_SIZE - CANVAS_MARGIN;
            let rightSide = gameState.players[player].scales[i].rightSide;
            for(let j = 0; j < rightSide.length; j++){
                const image = new Image();
                image.src = `/images/${rightSide[j].name}.png`;
                let imageBounds = imageSizes[rightSide[j].name];
                drawImage(false, ctx, image, ImageAlign.END, ImageAlign.END, offset, scaleBaseline, imageBounds[0], imageBounds[1]);

                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";
                ctx.fillText(rightSide[j].count.toString(), offset - imageBounds[0] / 2, scaleBaseline - 20);

                ctx.font = "30px Comic Sans MS";
                ctx.strokeStyle = "black";
                ctx.lineWidth = 1;
                ctx.strokeText(rightSide[j].count.toString(), offset - imageBounds[0] / 2, scaleBaseline - 20);

                offset -= imageBounds[0] + 20;
            }
        }
    }

    return (
        <Box sx={{ width: 500, height: 500, border: "2px solid black" }}>
            <Canvas draw={draw} width={CANVAS_SIZE} height={CANVAS_SIZE} />
        </Box>
    );
}

export default ScaleGameScreen;
