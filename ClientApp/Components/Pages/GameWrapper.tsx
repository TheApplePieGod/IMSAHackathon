import * as React from "react";
import { Box, Divider, Typography, Button, TextField, Dialog, Paper, DialogTitle } from "@mui/material";
import Trees from '../UI/Trees';
import { useNavigate } from "react-router-dom";
import {Player} from "../../Definitions/Socket/Player";

const GameWrapper = () => {

    const playerList: Player[] = [];
    playerList.push({name: "Joe", id: "", isHost: false, isCurrent: true});
    playerList.push({name: "Biden", id: "", isHost: false, isCurrent: false});
    playerList.push({name: "Bob", id: "", isHost: false, isCurrent: false});

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <Paper sx={{
                width: "75%",
                margin: "20px",
                padding: "10px"
            }}>
                <Box sx={{
                    display: "flex",
                    gap: "1rem"
                }}>
                    <Box sx={{
                        width: "75%",
                        borderRadius: "15px",
                        border: "3px solid #736F54",
                        backgroundColor: "#D0C790"
                    }}>
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
                                        <Box sx={{

                                            height: "300px",
                                            width: "300px",
                                            borderRadius: "15px",
                                            border: "3px solid #736F54",
                                            backgroundColor: "#D0C790"
                                        }}>

                                        </Box>
                                        <Typography>{player.name}</Typography>
                                    </Box>
                                    
                                )
                            })
                        }
                    </Box>
                </Box>
            </Paper>
        </Box>
    )
}

export default GameWrapper;