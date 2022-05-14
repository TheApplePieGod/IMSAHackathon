import { Button, Dialog, DialogTitle, TextField, Box} from "@mui/material";
import * as React from "react";
import { useNavigate, useParams } from "react-router";

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
        <Dialog open={true} fullWidth maxWidth={'sm'}>
            <DialogTitle>Enter your name</DialogTitle>
            <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
                <TextField
                    label={name == "" ? "Your Name" : ""}
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setName(e.target.value)}
                    onKeyDown={onKeyDown}
                />
                <div style={{ display: "flex", gap: "1rem" }}>
                    <Button onClick={confirm} disabled={name == ""} variant="contained" color="primary">
                        Confirm
                    </Button>
                    <Button onClick={() => navigate("/")} variant="contained" color="secondary">
                        Cancel
                    </Button>
                </div>
            </Box>
        </Dialog>
    );
}

export default JoinPage;