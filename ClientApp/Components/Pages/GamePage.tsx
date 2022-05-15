import * as React from "react";
import { styled, Box } from "@mui/material";
import { useSocketContext } from "../../Game/SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import GameWrapper from "./GameWrapper";
import LobbyPage from "./LobbyPage";
import { MathGameScreen } from "../../Game/UI/MathGameScreen";

interface Props {

}

const GamePage = (props: Props) => {
    const socketContext = useSocketContext();
    const { lobbyOpen, gameRotation, rotationIndex } = socketContext.baseState;
    const currentGame = gameRotation[rotationIndex];

    const renderGame = (player: string) => {
        switch (currentGame) {
            default: return <></>
            case GameType.Math: return <MathGameScreen player={player} />
        }
    }

    return (
        <Box>
            {socketContext.baseState.lobbyOpen ?
                <LobbyPage />
                :
                <GameWrapper render={renderGame} />
            }
        </Box>
    );
}

export default GamePage;