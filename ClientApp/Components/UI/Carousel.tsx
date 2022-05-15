import * as React from "react";
import { styled, Box, MobileStepper, Button } from "@mui/material";

interface Props {
    image: string;
    steps: number;
    currentStep: number;
    next: () => void;
    back: () => void;
}

const OutlinedBox = styled("div")(
    ({ theme }) => `
        border: 3px solid #AFA87A;
        border-radius: 12px;
        padding: 1rem;
    `
);

export const Carousel = (props: Props) => {
    return (
        <React.Fragment>
            <OutlinedBox
                sx={{
                    height: "100%",
                    width: "100%",
                    background: "#D0C790",
                    overflow: "hidden"
                }}
            >
                <img src={props.image} width={"100%"} height={"100%"} />
            </OutlinedBox>
            <MobileStepper
                variant="dots"
                steps={props.steps}
                sx={{
                    position: "relative",
                    "& .MuiMobileStepper-dot": {
                        width: 16,
                        height: 16
                    },
                    "& .MuiMobileStepper-dotActive": {
                        backgroundColor: "#454F25"
                    },
                    marginTop: "-1rem",
                    background: "transparent"
                }}
                activeStep={props.currentStep}
                nextButton={
                    <Button
                        size="small"
                        sx={{
                            backgroundImage: "url(/images/arrow.png)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: 120,
                            height: 80,
                            marginTop: "1rem",
                            opacity: "0.8",
                            mixBlendMode: "darken",
                            transform: "scaleY(-1)"
                        }}
                        onClick={props.next}
                    />
                }
                backButton={
                    <Button
                        size="small"
                        sx={{
                            backgroundImage: "url(/images/arrow.png)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: 120,
                            height: 80,
                            transform: "scaleX(-1) scaleY(-1)",
                            marginTop: "1rem",
                            opacity: "0.8",
                            mixBlendMode: "darken"
                        }}
                        onClick={props.back}
                    />
                }
            />
        </React.Fragment>
    );
}