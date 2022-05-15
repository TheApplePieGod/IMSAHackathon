import * as React from "react";
import { styled, Box, Typography, Modal, Button } from "@mui/material";
import { useSocketContext } from "../../Game/SocketContext";
import { gameInfoMap } from "../../Definitions/GameInfo";
import { useNavigate } from "react-router";

interface Props {
    timeRemaining: string;
    getResult: (player: string) => React.ReactElement | undefined;
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

const StyledButton = styled(Button)(
    ({ theme }) => `
        border: 2px solid #736F54;
        background-color: #A2845A;
        box-shadow: 5px 5px 6px #00000029;
        border-radius: 20px;
        padding: 1rem;
        &:hover {
            background-color: #A2845A;
            box-shadow: 5px 5px 6px #00000029;
        }
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
    const navigate = useNavigate();
    const socketContext = useSocketContext();
    const { lobbyOpen, gameRotation, rotationIndex, playerList, matchEnded } = socketContext.baseState;
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
                    <Typography variant="h3">{matchEnded ? "GAME" : "ROUND"} OVER</Typography>
                    {matchEnded ?
                        <StyledButton variant="contained" onClick={() => navigate("/")}>
                            <Typography>Return Home</Typography>
                        </StyledButton>
                        :
                        <React.Fragment>
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
                        </React.Fragment>
                    }
                </OutlinedBox>
                <Box sx={{ display: "flex", gap: "4rem" }}>
                    <OutlinedBox>
                        <Typography variant="h4" sx={{ fontFamily: "'Manteiga Gorda'" }}>
                            {gameInfoMap[currentGame].name}
                        </Typography>
                        {
                            playerList.map((p, i) => {
                                const res = props.getResult(p.id);
                                if (!res) return;
                                return (
                                    <TextBox key={p.id} sx={{ justifyContent: "space-between" }}>
                                        {res}
                                    </TextBox>
                                );
                            })
                        }
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