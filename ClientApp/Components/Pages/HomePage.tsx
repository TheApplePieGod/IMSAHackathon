import * as React from "react";
import { Box, Divider, Typography, Button, TextField, Dialog, DialogTitle } from "@mui/material";
import Trees from '../UI/Trees';
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const navigate = useNavigate();

    const [name, setName] = React.useState("");
    const [roomId, setRoomId] = React.useState("");
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const [nameError, setNameError] = React.useState(false);

    const newRoom = () => {
        if(name === "") setNameError(true);
        else navigate(`/play/0/${name}`);
    }

    const joinRoom = () => {
        navigate(`/play/${roomId}/${name}`);
    }

    const openIdDialog = () => {
        if(name === "") setNameError(true);
        else setDialogOpen(true);
    }

    const updateName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if(e.target.value !== "") setNameError(false);
        setName(e.target.value);
    }

    return (
        <React.Fragment>
            <Trees/>
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
                }}/>
                
                <Box sx={{
                    flexDirection: "column",
                    display: "flex",
                    width: "500px",
                    alignItems: "center"
                }}>
                    <TextField variant="filled" sx={{
                        width: "100%"
                    }}
                        error={nameError}
                        helperText={nameError ? "Please enter a name" : ""}
                        label={"Your Nickname"}
                        value={name}
                        onChange={updateName}
                    />
                    <Box sx={{
                        display: "flex",
                        width: "100%"
                    }}>
                        <Button sx={{
                            flexGrow: "1",
                            margin: "1rem",
                            border: "3px solid #736F54"
                        }} onClick={openIdDialog} variant="contained">Join Room</Button>
                        <Button sx={{
                            flexGrow: "1",
                            margin: "1rem",
                            border: "3px solid #736F54"
                        }} onClick={newRoom} variant="contained">Create Room</Button>
                    </Box>
                </Box>
                <Dialog open={dialogOpen} fullWidth maxWidth={'sm'}>
                    <DialogTitle>Join a room</DialogTitle>
                    <Box sx={{ display: "flex", alignItems: "center", padding: "10px", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
                        <TextField variant="filled" sx={{
                                width: "100%",
                                "&. Mui-focused": {
                                    color: "#FF0000"
                                }
                            }}
                            label={"Room Code"}
                            value={roomId}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {setRoomId(e.target.value)}}
                        />
                        <Box sx={{ display: "flex", gap: "1rem" }}>
                            <Button onClick={(joinRoom)} disabled={roomId == ""} variant="contained" color="primary">
                                Join
                            </Button>
                            <Button onClick={() => setDialogOpen(false)} variant="contained" color="secondary">
                                Cancel
                            </Button>
                        </Box>
                    </Box>
                </Dialog>
            </Box>
        </React.Fragment>
    );
}

export default HomePage;