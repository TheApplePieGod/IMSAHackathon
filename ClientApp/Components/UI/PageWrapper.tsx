import * as React from "react";
import { Box, Paper, useTheme, IconButton } from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';

interface Props {
    children: React.ReactNode | React.ReactNode[];
}

export const PageWrapper = (props: Props) => {
    const location = useLocation();
    const navigate = useNavigate();

    const theme = useTheme();

    // scroll to top upon navigation
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    return (
        <React.Fragment>
            {location.pathname == "/" && 
                <Box sx={{
                    position: "fixed",
                    width: "100%",
                    height: "200px",
                    backgroundRepeat: "repeat-x",
                    backgroundImage: "url(/images/vines.png)",
                    backgroundPosition: "top",
                    padding: "100px",
                    backgroundSize: "20%",
                    transform: "translateY(-20%)"
                }}/>
            }
            <Box sx={{ 
                width: "100%",
                height: "100%",
                minWidth: 500,
                maxWidth: 1400,
                padding: "0 50px 0 50px",
                margin: "auto"
            }}>
                {props.children}
            </Box>
            <Box sx={{
                width: "100%",
                position: "fixed",
                bottom: "0px",
                display: "flex",
                justifyContent: "center",
            }}>
                <Box sx={{
                    width: "75%",
                    height: "300px",
                    backgroundRepeat: "no-repeat",
                    backgroundImage: "url(/images/fern.png)",
                    backgroundPosition: "center",
                    backgroundSize: "100%",
                    transform: "translateY(50%)"
                }}/>
            </Box>
        </React.Fragment>
    );
}