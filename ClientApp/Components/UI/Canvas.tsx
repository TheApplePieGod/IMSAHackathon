import * as React from "react";
import { styled, Box } from "@mui/material";

interface Props {
    draw: (ctx: CanvasRenderingContext2D, frameCount: number) => void;
    width: number;
    height: number;
}

export const Canvas = (props: Props) => {
    const ref = React.useRef<HTMLCanvasElement>(null)

    React.useEffect(() => {
        const canvas = ref.current;
        if (!canvas) return;
        
        const context = canvas.getContext('2d');
        if (!context) return;

        let frameCount = 0;
        let animationFrameId = 0;

        const render = () => {
            frameCount++;
            props.draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        }
        render();

        return () => window.cancelAnimationFrame(animationFrameId);
    }, [props, ref]);

    return (
        <canvas
            ref={ref}
            width={props.width}
            height={props.height}
            style={{ width: "100%", height:"100%" }}
        />
    );
}