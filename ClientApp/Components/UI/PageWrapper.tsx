import * as React from "react";
import { Box, Paper, useTheme, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

export const PageWrapper: React.FunctionComponent = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    const theme = useTheme();

    // scroll to top upon navigation
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper
                square
                elevation={1}
                sx={{
                    height: "60px",
                    position: "sticky",
                    top: 0,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    paddingRight: "0.5rem"
                }}
            >
                <IconButton onClick={() => navigate("/")}>
                    <HomeIcon sx={{ color: "text.primary" }} />
                </IconButton>
                <IconButton onClick={() => navigate("/about")}>
                    <InfoIcon sx={{ color: "text.primary" }} />
                </IconButton>
            </Paper>
            {props.children}
        </Box>
    );
}