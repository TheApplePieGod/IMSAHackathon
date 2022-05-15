import * as React from "react";
import { styled, Box, Divider, Typography, Button, TextField, Dialog, Paper, DialogTitle } from "@mui/material";
import Trees from '../UI/Trees';
import { useNavigate } from "react-router-dom";
import {Player} from "../../Definitions/Socket/Player";

const OutlinedBox = styled("div")(
    ({ theme }) => `
        border: 3px solid #AFA87A;
        border-radius: 12px;
        padding: 1rem;
        background-color: #D0C790;
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

const GameWrapper = () => {
    const playerList: Player[] = [];
    playerList.push({name: "Joe", id: "", isHost: false, isCurrent: true});
    playerList.push({name: "Biden", id: "", isHost: false, isCurrent: false});
    playerList.push({name: "Bob", id: "", isHost: false, isCurrent: false});

    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            paddingTop: "50px"
        }}>
            <Box sx={{
                width: "100%",
                height: "75%",
                display: "flex",
                gap: "1rem"
            }}>
                <Box sx={{
                    display: "flex",
                    width: "100%",
                    height: "100%",
                    flexDirection: "column"
                }}>
                    <OutlinedBox sx={{
                        width: "100%",
                        height: "100%",
                    }}>
                    </OutlinedBox>

                    <Box sx={{
                        display: "flex"
                    }}>
                        <Typography>You</Typography>
                        <Typography>0 pts</Typography>
                    </Box>
                </Box>
                
                <Box sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                }}>
                    {
                        playerList.map((player, i) => {
                            return (
                                <Box>
                                    <OutlinedBox sx={{
                                        height: "250px",
                                        width: "300px",
                                    }}>

                                    </OutlinedBox>
                                    <Typography>{player.name}</Typography>
                                </Box>
                            )
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default GameWrapper;