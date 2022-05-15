import * as React from "react";
import { styled, Box, Typography } from "@mui/material";
import { useSocketContext } from "../../Game/SocketContext";
import { GameType } from "../../Definitions/Socket/GameType";
import GameWrapper from "./GameWrapper";
import LobbyPage from "./LobbyPage";
import { MathGameScreen } from "../../Game/UI/MathGameScreen";
import { MathGameState } from "../../Game/MathGame";
import ScaleGameScreen from "../../Game/UI/ScaleGameScreen";
import { FoldingGameScreen } from "../../Game/UI/FoldingGameScreen";
import { ScaleGameState } from "../../Game/ScaleGame";

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
            case GameType.Scales: return <ScaleGameScreen player={player} />
            case GameType.PaperFolding: return <FoldingGameScreen player={player} />
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
            case GameType.Scales: {
                if (!(gameState as ScaleGameState).players.hasOwnProperty(player)) break;
                return (gameState as ScaleGameState).players[player].score;
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