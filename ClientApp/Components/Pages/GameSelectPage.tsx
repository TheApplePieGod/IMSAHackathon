import * as React from "react";
import { makeStyles, Typography, Card, CardContent, Box, Button, Tooltip, IconButton } from '@mui/material';
import { GameType } from '../../Definitions/Socket/GameType';
import { useParams } from "react-router";
import { useSocketContext } from "../../Game/SocketContext";
import FileCopyIcon from '@mui/icons-material/FileCopy';


const GameSelectPage = () => {
    const socketContext = useSocketContext();
    const { localPlayer, playerList } = socketContext.baseState;

    // If the roomid is zero, we know that the server will send us the new lobby id
    const { roomIdString } = useParams<{ roomIdString: string; }>();
    const roomId = roomIdString == "0" ? socketContext.baseState.hostRoomId : roomIdString;

    const getProtocol = () => {
        return "http";
    }

    const copyShareLink = () => {
        const link = `${getProtocol()}://${location.host}/join/${roomId}`;
        navigator.clipboard.writeText(link);
        // dispatch(openSnackbar(SnackbarStatus.Success, "Share link copied to clipboard", 2000))
    }

    const startGame = (type: GameType) => {
        
    }

    const kickPlayer = (id: string) => {

    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "left",
                    gap: "0.5rem"
                }}
            >
                <Typography variant="h4">Room Code:</Typography>
                <Typography variant="h4"><b>{roomId == "" ? "Loading..." : roomId}</b></Typography>
                {(roomId != "") &&
                    <Tooltip title={<Typography variant="body1">Copy join link</Typography>}>
                        <IconButton style={{ padding: "0.25rem" }} onClick={copyShareLink}>
                            <FileCopyIcon />
                        </IconButton>
                    </Tooltip>
                }
            </Box>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                '& .MuiCard-root': {
                    width: '300px',
                    height: '300px',
                    margin: "1rem",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                },
                '& .MuiCardContent-root':{
                    color: 'white',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between'
                },
                '& .MuiButton-root':{
                    margin: '1rem'
                }
            }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">Scales</Typography>
                    </CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => startGame(GameType.Scales)} variant="contained">Play</Button>
                    </Box>
                </Card>
            
                <Card>
                    <CardContent>
                        <Typography variant="h4">Paper Folding</Typography>
                    </CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => startGame(GameType.PaperFolding)} variant="contained">Play</Button>
                    </Box>
                </Card>
                
                <Card>
                    <CardContent>
                        <Typography variant="h4">Math</Typography>
                    </CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => startGame(GameType.Math)} variant="contained">Play</Button>
                    </Box>
                </Card>
            </Box>
            <Box>
                <Typography variant="h4">Players</Typography>
                <Box sx={{ maxHeight: "200px", overflowY: "auto" }}>
                    {
                        playerList.map((elem, i) => {
                            return (
                                <Box
                                    key={i}
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "left",
                                        gap: "0.25rem"
                                    }}
                                >
                                    {(localPlayer?.isHost && playerList.length > 1) &&
                                        <Button
                                            variant="outlined"
                                            style={{ visibility: localPlayer.id == elem.id ? "hidden" : "visible" }}
                                            sx={{
                                                padding: 0,
                                                minWidth: 50,
                                                maxWidth: 50,
                                                maxHeight: 22
                                            }}
                                            color="secondary"
                                            onClick={() => kickPlayer(elem.id)}
                                        >
                                            Kick
                                        </Button>
                                    }
                                    <Typography variant="body1">{elem.name}</Typography>
                                    {(elem.id == localPlayer?.id) &&
                                        <Typography variant="body1" color="primary">(YOU)</Typography>
                                    }
                                    {elem.isHost &&
                                        <Typography variant="body1" color="secondary">[HOST]</Typography>
                                    }
                                </Box>
                            );
                        })
                    }
                </Box>
            </Box>
        </Box>
    )
}

export default GameSelectPage