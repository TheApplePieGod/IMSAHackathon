import * as React from "react";
import { Box, Divider, Typography } from "@mui/material";

const HomePage = () => {
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
                <Typography variant="h2">Welcome to our website</Typography>
            </Box>
        </React.Fragment>
    );
}

export default HomePage;