import * as React from "react";
import { styled, Box, Typography } from "@mui/material";
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

    const getResult = (pid: string) => {
        const player = socketContext.baseState.playerList.find(p => p.id == pid);
        if (!player) return undefined;
        
        const gameState = socketContext.getGame(currentGame).state;
        switch (currentGame) {
            default: break;
            case GameType.Math: {
                if (!(gameState as MathGameState).players.hasOwnProperty(pid)) break;
                const state = (gameState as MathGameState).players[pid];
                return (
                    <React.Fragment>
                        <Typography variant="body1">{player.name}</Typography>
                        <Typography variant="body1" color="textSecondary">{state.score} pts</Typography>
                    </React.Fragment>
                );
            }
        }
        return undefined;
    }

    return (
        <Box>
            {socketContext.baseState.lobbyOpen ?
                <LobbyPage />
                :
                <GameWrapper render={renderGame} getPoints={getPoints} getResult={getResult} />
            }
        </Box>
    );
}

export default GamePage;