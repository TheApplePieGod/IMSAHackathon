import * as React from "react";
import { styled, Box, Typography } from "@mui/material";

interface Props {
    timeRemaining: string;
}

export const GameResults = (props: Props) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center"
            }}
        >
            <Typography variant="h3">GAME OVER</Typography>
            <Typography variant="subtitle1">Next Game: {props.timeRemaining}</Typography>
        </Box>
    );
}