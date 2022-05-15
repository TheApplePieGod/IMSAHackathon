import React, {useEffect, useState, useRef} from "react";
import { styled, Box, Divider, Typography, Button } from "@mui/material";
import HomeIcon from '@mui/icons-material/Home';
import { Player } from "../../Definitions/Socket/Player";
import { useSocketContext } from "../../Game/SocketContext";
import { useNavigate } from "react-router";
import { GameResults } from "../UI/GameResults";
import { render } from "react-dom";
 
const OutlinedBox = styled("div")(
    ({ theme }) => `
        border: 3px solid #AFA87A;
        border-radius: 12px;
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

interface Props {
    render: (player: string) => React.ReactNode;
    getPoints: (player: string) => number;
}

const GameWrapper = (props: Props) => {
    const navigate = useNavigate();
    const socketContext = useSocketContext();
    const { timerTimestamp, timerDuration, playerList, localPlayer, gameEnded } = socketContext.baseState;

    const [timerCounter, setTimerCounter] = useState(0);
    const [timeText, setTimeText] = useState("9:99");

    const getTimeRemaining = () => {
        const total = timerTimestamp + timerDuration - Date.now();
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            seconds, minutes
        };
    }

    const updateTimer = () => {
        const remaining = getTimeRemaining();
        const minutes = Math.max(remaining.minutes, 0);
        const seconds = Math.max(remaining.seconds, 0);
        setTimeText(
            minutes + ':'
            + (seconds > 9 ? seconds : '0' + seconds)
        )
    }

    useEffect(() => {
        const id = setTimeout(() => {
            updateTimer();
            setTimerCounter(timerCounter + 1);
        }, 250);
    }, [timerCounter]);

    return (
        <Box sx={{
            height: "100%",
            width: "100%",
            paddingTop: "50px"
        }}>
            {gameEnded ?
                <GameResults timeRemaining={timeText} />
                :
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
                                navigate("/");
                            }} sx={{
                                position: "absolute",
                                bottom: "0px",
                                right: "0px",
                                fontSize: "5rem"
                            }}/>
                            {localPlayer && props.render(localPlayer.id)}
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
                            }}>{localPlayer ? props.getPoints(localPlayer.id) : 0} pts</Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                    }}>
                        {
                            playerList.map((player, i) => {
                                if (player.id === localPlayer?.id) return;
                                return (
                                    <Box key={player.id}>
                                        <OutlinedBox sx={{
                                            height: "200px",
                                            width: "250px",
                                        }}>
                                            {props.render(player.id)}
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
                                                {props.getPoints(player.id)} pts
                                            </Typography>
                                        </Box>
                                        
                                    </Box>
                                )
                            })
                        }
                    </Box>
                </Box>
            }
        </Box>
    )
}

export default GameWrapper;