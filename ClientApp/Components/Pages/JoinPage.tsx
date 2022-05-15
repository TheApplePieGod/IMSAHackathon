import { Button, Dialog, DialogTitle, TextField, Box} from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router";
import Trees from '../UI/Trees';

const JoinPage = () => {
    const navigate = useNavigate();

    const { roomIdString } = useParams<{ roomIdString: string }>();

    const [name, setName] = React.useState("");

    const confirm = () => {
        localStorage.setItem("playerName", name);

        if (roomIdString?.toLowerCase() == "new") { // new lobby
            navigate(`/play/0/${name}`);
        } else {
            navigate(`/play/${roomIdString}/${name}`);
        }
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key == "Enter" && name != "") {
            confirm();
        }
    }

    React.useEffect(() => {
        const foundName = localStorage.getItem("playerName");
        if (foundName)
            setName(foundName);
    }, [])

    return (
        <React.Fragment>
            <Trees/>
            <Dialog open={true} fullWidth maxWidth={'sm'}>
                <DialogTitle>Enter your name</DialogTitle>
                <Box sx={{ display: "flex", alignItems: "center", padding: "10px", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
                    <TextField variant="filled" sx={{
                            width: "100%",
                            "& .Mui-focused": {
                                color: "text.primary"
                            }
                        }}
                        label={"Your name"}
                        value={name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)}
                        onKeyDown={onKeyDown}
                    />

                    <Box sx={{ display: "flex", gap: "1rem" }}>
                        <Button onClick={confirm} disabled={name == ""} variant="contained" color="primary">
                            Confirm
                        </Button>
                        <Button onClick={() => navigate("/")} variant="contained" color="secondary">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </React.Fragment>
        
    );
}

export default JoinPage;