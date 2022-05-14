import { ForkLeft } from "@mui/icons-material";
import * as React from "react";

interface Props {
    left: Map<string, number>;
    right: Map<string, number>;
}

const Scale = (props: Props) => {
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
            {leftText} <br/>
            or <br/>
            {rightText} <br/>
        </div>
    );
}

export default Scale;