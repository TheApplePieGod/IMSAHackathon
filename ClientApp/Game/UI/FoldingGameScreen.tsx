import * as React from "react";
import { styled, Box, useTheme, Typography, Grid } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { FoldingGameState } from "../FoldingGame";
import { instructionSet } from "../../Definitions/Socket/FoldingGame";
import { Canvas } from "../../Components/UI/Canvas";

interface Props {
    player: string;
}

const CANVAS_SIZE = 500;
const IMAGE_SIZE = 60;

const OutlinedBox = styled("div")(
    ({ theme }) => `
        border: 3px solid #AFA87A;
        border-radius: 12px;
        padding: 1rem;
    `
);
 
const FoldingGameScreen = () => {
    // const socketContext = useSocketContext();
    // const baseState = socketContext.baseState;
    // const gameContext = socketContext.getGame(GameType.PaperFolding);
    // const gameState = gameContext.state as FoldingGameState;
    // const theme = useTheme();

    // const draw = (ctx: CanvasRenderingContext2D, frameCount: number) => {
        
    // }

    const testList = [1, 2, 3, 4];

    return (
        <Box sx={{
            display: "flex",
            width: "100%",
            height: "80%"
        }}>
            <Grid sx={{
                width: "50%",
                border: "3px solid #AFA87A"
            }} container>
                {testList.map((item, index) => {
                    return (
                        <Grid sx={{
                            border: "5px solid #AFA87A",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        }} item xs={6}>
                            <Typography sx={{
                                margin: "1rem"
                            }} variant="h3">{`Step ${index + 1}`}</Typography>
                        </Grid>
                    )
                })}
            </Grid>

            <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
                height: "100%",
                gap: "1rem"
            }}>
                <Typography sx={{
                    textAlign: "center"
                }} variant="h3">Click on where the holes on the paper will be!</Typography>
                <Box sx={{
                    backgroundColor: "white",
                    width: "80%",
                    height: "50%",
                }}>

                </Box>
            </Box>
        </Box>
    );
}

export default FoldingGameScreen;