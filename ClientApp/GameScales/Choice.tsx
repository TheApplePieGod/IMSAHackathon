import * as React from "react";
import { Button } from "@mui/material";

interface Props {
    left: Map<string, number>;
    right: Map<string, number>;
}

const Choice = (props: Props) => {
    var leftText = "";
    props.left.forEach (function(value, key) {
        leftText += value + " " + key + "s"
        leftText += " and "
    })

    var rightText = "";
    props.right.forEach (function(value, key) {
        rightText += value + " " + key + "s"
        rightText += " and "
    })

    return (
        <div>
            <Button>{leftText}</Button>
            or
            <Button>{rightText}</Button>
        </div>
    );
}

export default Choice;