import React, {useEffect, useState, useRef} from "react";
import { styled, Box, Divider, Typography, Button, TextField, Dialog, Paper, DialogTitle } from "@mui/material";
import Trees from '../UI/Trees';
import { useNavigate } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
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
    const [startTime, setStartTime] = useState(0);
    const [timerCounter, setTimerCounter] = useState(0);
    const [timeText, setTimeText] = useState("9:99");
    const duration = 90 * 1000;

    const getTimeRemaining = () => {
        const total = startTime + duration - Date.now();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            seconds, minutes
        };
    }

    const updateTimer = () => {
        const remaining = getTimeRemaining();
        const minutes = remaining.minutes;
        const seconds = remaining.seconds;
        setTimeText(
            minutes + ':'
            + (seconds > 9 ? seconds : '0' + seconds)
        )
    }

    const refreshTimeout = () => {  
        const id = setTimeout(() => {
            updateTimer();
            setTimerCounter(timerCounter + 1);
        }, 1000);
    }

    useEffect(() => {
        refreshTimeout();
    }, [timerCounter]);

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
                        position: "relative"
                    }}>
                        <Typography variant="h3" sx={{
                            padding: "10px",
                            opacity: "0.6",
                            position: "absolute",
                            right: "0px",
                            top: "0px"
                        }}>
                            {timeText}
                        </Typography>
                        <HomeIcon onClick={() => {
                            setStartTime(Date.now());
                            refreshTimeout();
                        }} sx={{
                            position: "absolute",
                            bottom: "0px",
                            right: "0px",
                            fontSize: "5rem"
                        }}/>
                    </OutlinedBox>

                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        padding: "5px"
                    }}>
                        <Typography variant="h4" sx={{
                            marginRight: "30px"
                        }}>You</Typography>
                        <Typography variant="h5" sx={{
                            opacity: "0.6"
                        }}>0 pts</Typography>
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
                                        height: "200px",
                                        width: "250px",
                                    }}>

                                    </OutlinedBox>
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        padding: "5px"
                                    }}>
                                        <Typography variant="h5" sx={{
                                            alignSelf: "flex-start"
                                        }}>
                                            {player.name}
                                        </Typography>
                                        <Typography sx={{
                                            marginLeft: "auto",
                                            opacity: "0.6"
                                        }}>
                                            0 pts
                                        </Typography>
                                    </Box>
                                    
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