import * as React from "react";

import Scale from "./Scale";
import Choice from "./Choice";

interface Props {
    left1: Map<string, number>;
    right1: Map<string, number>;
    left2: Map<string, number>;
    right2: Map<string, number>;
    left3: Map<string, number>;
    right3: Map<string, number>;
}

const Area = (props: Props) => {
    var calScale1 = <Scale left={props.left1} right={props.right1}/>;
    var calScale2 = <Scale left={props.left2} right={props.right2}/>;
    var unkScale = <Scale left={props.left3} right={props.right3}/>;

    var choice = <Choice left={props.left3} right={props.right3}/>;

    return (
        <div>
            {calScale1} <br/>
            {calScale2} <br/>
            {unkScale} <br/>
            {choice} <br/>
        </div>
    );
}

export default Area;