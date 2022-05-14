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
            <Box
                sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: "1rem",
                    marginTop: "4rem"
                }}
            >
                <Typography variant="h2">Safari Squabble</Typography>
                
                <Box sx={{
                    display: "flex",
                    alignItems: "center"
                }}>
                    <TextField
                            label={"Room Code"}
                            value={roomId == 0 ? "" : roomId}
                            onChange={updateRoomId}
                        />
                    <Button onClick={joinRoom} variant = "contained" sx={{
                        margin: "1rem"
                    }}>Join Room</Button>
                </Box>

                <Button onClick={newRoom} variant="contained">Create Room</Button>
            </Box>
        </React.Fragment>
    );
}

export default HomePage;