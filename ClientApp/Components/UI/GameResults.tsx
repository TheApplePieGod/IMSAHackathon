import * as React from "react";
import { styled, Box, Typography, Modal } from "@mui/material";
import { useSocketContext } from "../../Game/SocketContext";
import { gameInfoMap } from "../../Definitions/GameInfo";

interface Props {
    timeRemaining: string;
}

const OutlinedBox = styled("div")(
    ({ theme }) => `
        border: 3px solid #AFA87A;
        border-radius: 12px;
        padding: 2rem 3rem;
        background-color: #D0C790;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    `
);

const TextBox = styled("div")(
    ({ theme }) => `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `
);

export const GameResults = (props: Props) => {
    const socketContext = useSocketContext();
    const { lobbyOpen, gameRotation, rotationIndex, playerList } = socketContext.baseState;
    const currentGame = gameRotation[rotationIndex];
    
    return (
        <Modal
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}
            open={true}
        >
            <Box sx={{ height: "80%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "4rem" }}>
                <OutlinedBox sx={{ padding: "2rem 3rem" }}>
                    <Typography variant="h3">GAME OVER</Typography>
                    <TextBox>
                        <Typography variant="subtitle1">Next up:</Typography>
                        <Typography variant="h5" sx={{ fontFamily: "'Manteiga Gorda'" }}>
                            {gameInfoMap[gameRotation[(rotationIndex + 1) % gameRotation.length]].name}
                        </Typography>
                    </TextBox>
                    <TextBox>
                        <Typography variant="subtitle1">Starting in:</Typography>
                        <Typography variant="h5" color="textSecondary">{props.timeRemaining}</Typography>
                    </TextBox>
                </OutlinedBox>
                <Box sx={{ display: "flex", gap: "4rem" }}>
                    <OutlinedBox sx={{  }}>
                        <Typography variant="h4" sx={{ fontFamily: "'Manteiga Gorda'" }}>
                            {gameInfoMap[currentGame].name}
                        </Typography>
                    </OutlinedBox>
                    <OutlinedBox>
                        <Typography variant="h4">Total Rankings</Typography>
                        {
                            playerList.map((p, i) => {
                                return (
                                    <TextBox key={p.id} sx={{ justifyContent: "space-between" }}>
                                        <Typography variant="body1">{p.name}</Typography>
                                        <Typography variant="body1" color="textSecondary">{p.score} pts</Typography>
                                    </TextBox>
                                );
                            })
                        }
                    </OutlinedBox>
                </Box>
            </Box>
        </Modal>
    );
}