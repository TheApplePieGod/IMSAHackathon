import * as React from "react";
import { Box, Divider, Typography, Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";



const HomePage = () => {

    const navigate = useNavigate();

    const [roomId, setRoomId] = React.useState(0);

    const [showNameDialog, setShowNameDialog] = React.useState(false);

    const newRoom = () => {
        navigate("/join/new");
    }

    const updateRoomId = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (e.target.value == "") {
            setRoomId(0);
            return;
        }

        const parsed = parseInt(e.target.value);
        if (!isNaN(parsed))
            setRoomId(parsed);
    }

    const joinRoom = () => {
        navigate(`/join/${roomId}`);
    }

    return (
        <React.Fragment>
            <Box sx={{
                position: "fixed",
                left: "0px",
                height: "80%",
                width: "40%",
                minWidth: "500px",
                backgroundSize: "80% 100%",
                backgroundRepeat: "no-repeat",
                backgroundImage: "url(tree.png)",
                backgroundPosition: "center",
                bottom: "0px",
            }}/>
            <Box sx={{
                position: "fixed",
                right: "0px",
                height: "80%",
                width: "40%",
                minWidth: "500px",
                backgroundSize: "80% 100%",
                backgroundRepeat: "no-repeat",
                backgroundImage: "url(tree.png)",
                backgroundPosition: "center",
                bottom: "0px",
                transform: "scaleX(-1)"
            }}/>
            <Box
                sx={{
                    width: "100%",
                    height: "80%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                }}
            >
                <Box sx={{
                    backgroundImage: "url(title.png)",
                    backgroundPosition: "center",
                    width: "600px",
                    height: "200px",
                    backgroundSize: "100%"
                }}>

                </Box>
                
                <Box sx={{
                    flexDirection: "column",
                    display: "flex",
                    width: "500px",
                    alignItems: "center"
                }}>
                    <TextField variant="filled" sx={{
                        width: "100%"
                    }}
                        label={"Your Nickname"}
                        value={roomId == 0 ? "" : roomId}
                        onChange={updateRoomId}
                    />
                    <Box sx={{
                        display: "flex",
                        width: "100%"
                    }}>
                        <Button sx={{
                            flexGrow: "1",
                            margin: "1rem",
                            border: "3px solid #736F54"
                        }} onClick={joinRoom} variant="contained">Join Room</Button>
                        <Button sx={{
                            flexGrow: "1",
                            margin: "1rem",
                            border: "3px solid #736F54"
                        }}onClick={newRoom} variant="contained">Create Room</Button>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    );
}

export default HomePage;