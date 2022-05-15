import * as React from "react";
import { styled, Box } from "@mui/material";
import { useSocketContext } from "../../Game/SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import GameWrapper from "./GameWrapper";
import LobbyPage from "./LobbyPage";
import { MathGameScreen } from "../../Game/UI/MathGameScreen";
import { MathGameState } from "../../Game/MathGame";

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

    const getPoints = (player: string) => {
        const gameState = socketContext.getGame(currentGame).state;
        switch (currentGame) {
            default: break;
            case GameType.Math: {
                if (!(gameState as MathGameState).players.hasOwnProperty(player)) break;
                return (gameState as MathGameState).players[player].score;
            }
        }
        return 0;
    }

    return (
        <Box>
            {socketContext.baseState.lobbyOpen ?
                <LobbyPage />
                :
                <GameWrapper render={renderGame} getPoints={getPoints} />
            }
        </Box>
    );
}

export default GamePage;