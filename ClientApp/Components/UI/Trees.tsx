import * as React from "react";
import { Box } from "@mui/material";

const Decoration = () => {
    return (
        <Box>
            <Box sx={{
                position: "fixed",
                left: "0px",
                height: "80%",
                width: "40%",
                minWidth: "500px",
                backgroundSize: "80% 100%",
                backgroundRepeat: "no-repeat",
                backgroundImage: "url(/images/tree.png)",
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
                backgroundImage: "url(/images/tree.png)",
                backgroundPosition: "center",
                bottom: "0px",
                transform: "scaleX(-1)"
            }}/>
        </Box>
    )
}

export default Decoration;