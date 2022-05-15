import * as React from "react";
import { styled, Box, Typography, Tooltip, IconButton, Button } from "@mui/material";
import { useSocketContext } from "../../Game/SocketContext";
import { gameInfoMap } from "../../Definitions/GameInfo";
import { GameType } from "../../Definitions/Socket/GameType";
import { useParams } from "react-router";
import FileCopyIcon from '@mui/icons-material/FileCopy';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';

interface Props {

}

const OutlinedBox = styled("div")(
    ({ theme }) => `
        border: 3px solid #AFA87A;
        border-radius: 12px;
        padding: 1rem;
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

const LobbyPage = (props: Props) => {
    const socketContext = useSocketContext();
    let { localPlayer, playerList, currentGame } = socketContext.baseState;
    currentGame = GameType.Scales;

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

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    width: "100%",
                    gap: "2rem"
                }}
            >
                <Box sx={{ height: "50%", flexGrow: 2, display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
                    <OutlinedBox
                        sx={{
                            height: "100%",
                            width: "100%",
                            ...(gameInfoMap[currentGame].previewURL == "" ? {
                                background: "#D0C790"
                            } : {
                                backgroudImage: `url(${gameInfoMap[currentGame].previewURL})`
                            })
                        }}
                    />
                    <Typography variant="h4" sx={{ fontFamily: "'Manteiga Gorda'", textAlign: "center" }}>
                        {gameInfoMap[currentGame].name}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexGrow: 1,
                        gap: "1rem",
                        height: "50%",
                        maxWidth: "500px"
                    }}
                >
                    <OutlinedBox sx={{ width: "100%", flexGrow: 2, textAlign: "center" }}>
                        <Typography variant="body1">{gameInfoMap[currentGame].description}</Typography>
                    </OutlinedBox>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            flexGrow: 1.5,
                            width: "100%",
                            gap: "1rem"
                        }}
                    >
                        <OutlinedBox sx={{ width: "100%", height: "100%", overflowY: "auto" }}>
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
                                        <Typography variant="body1">{elem.name}</Typography>
                                        {elem.isHost &&
                                            <Typography sx={{ fontSize: "8px" }} color="secondary">[HOST]</Typography>
                                        }
                                    </Box>
                                );
                            })
                        }
                        </OutlinedBox>
                        <Box
                            sx={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "1rem"
                            }}
                        >
                            <StyledButton variant="contained">
                                <Typography>Ready</Typography>
                            </StyledButton>
                            <StyledButton variant="contained">
                                <HomeIcon />
                            </StyledButton>
                            <StyledButton variant="contained">
                                <SettingsIcon />
                            </StyledButton>
                        </Box>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "left",
                            gap: "0.5rem",
                            marginTop: "1rem"
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
                </Box>
            </Box>
        </Box>
    );
}

export default LobbyPage;