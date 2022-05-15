import * as React from "react";
import { styled, Box, useTheme, Typography, Grid, Button } from "@mui/material";
import { useSocketContext } from "../SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import { FoldingGameState } from "../FoldingGame";
import { FoldingMessageType, instructionSet } from "../../Definitions/Socket/FoldingGame";
import { Canvas } from "../../Components/UI/Canvas";
import FoldingGameInput from "./FoldingGameInput";

interface Props {
    player: string;
}

const CANVAS_SIZE = 500;
const IMAGE_SIZE = 60;

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
 
export const FoldingGameScreen = (props: Props) => {
    const socketContext = useSocketContext();
    const baseState = socketContext.baseState;
    const gameContext = socketContext.getGame(GameType.PaperFolding);
    const gameState = gameContext.state as FoldingGameState;

    const isLocalPlayer = baseState.localPlayer?.id === props.player;

    const [dots, setDots] = React.useState<boolean[]>(Array(16).fill(true));

    const submitAnswer = () => {
        // Convert the boolean array to a 2d array of coordinates
        const answer: number[][] = [];
        for (let i = 0; i < dots.length; i++) {
            if (!dots[i]) continue;
            const x = i % 4;
            const y = Math.floor(i / 4);
            answer.push([ x, y ]); 
        }
        socketContext.sendMessage(FoldingMessageType.SubmitSelection, GameType.PaperFolding, JSON.stringify(answer));
    }

    const answerScreenVisible = () => {
        if (!gameState.players.hasOwnProperty(props.player)) return;
        const correct = gameState.players[props.player].correct;
        return correct !== undefined;
    }

    const next = () => {
        socketContext.sendMessage(FoldingMessageType.NewSequence, GameType.PaperFolding, "");
    }

    const renderNextButton = () => {
        if (!gameState.players.hasOwnProperty(props.player)) return;
        const correct = gameState.players[props.player].correct;
        if (correct === undefined) return undefined;
        const total = gameState.players[props.player].total;
        return (
            <Box sx={{ display: "flex", flexDirection: "column", position: "absolute", textAlign: "center", zIndex: 5 }}>
                <Typography color="textSecondary" sx={{ position: "relative" }}>You Got {correct}/{total}!</Typography>
                <StyledButton variant="contained" sx={{ position: "relative" }} onClick={next}>
                    Next Sequence
                </StyledButton>
            </Box>
        )
    }

    return (
        <Box sx={{
            display: "flex",
            width: "100%",
            height: "100%",
            position: "relative"
        }}>
            <Grid sx={{
                width: "50%",
                border: "3px solid #AFA87A"
            }} container>
                {[1, 2, 3, 4].map((item, index) => {
                    return (
                        <Grid sx={{
                            border: "2px solid #AFA87A",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            height: "50%"
                        }} item xs={6} key={index}>
                            {isLocalPlayer &&
                                <Typography sx={{
                                    margin: "1rem"
                                }} variant="h5">{`Step ${index + 1}`}</Typography>
                            }
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
                {isLocalPlayer &&
                    <Typography sx={{
                        textAlign: "center"
                    }} variant="h5">Click on where the holes on the paper will be!</Typography>
                }
                <Box sx={{
                    backgroundColor: "white",
                    width: "80%",
                    height: "50%",
                }}>
                    <FoldingGameInput isLocalPlayer={isLocalPlayer} dots={dots} setDots={setDots}/>
                </Box>
                {renderNextButton()}
                {isLocalPlayer  &&
                    <StyledButton variant="contained" sx={{ position: "relative" }} onClick={submitAnswer} disabled={answerScreenVisible()}>
                        Submit
                    </StyledButton>
                }
            </Box>
            {answerScreenVisible() &&
                <Box sx={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "black",
                    opacity: 0.7,
                    position: "absolute",
                    top: 0
                }} />
            }
        </Box>
    );
}