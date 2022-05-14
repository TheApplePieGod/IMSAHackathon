import { makeStyles, Typography, Card, CardContent, Box, Button } from '@mui/material';
import * as React from "react";

enum GameType {
    Scales,
    Paper,
    Math
}

const GameSelectPage = () => {

    const startGame = (type: GameType) => {
        
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        }}>
            <Typography variant="h2" sx={{margin: "1rem"}}>3409843</Typography>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                '& .MuiCard-root': {
                    width: '300px',
                    height: '300px',
                    margin: "1rem",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                },
                '& .MuiCardContent-root':{
                    color: 'white',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between'
                },
                '& .MuiButton-root':{
                    margin: '1rem'
                }
            }}>
                <Card>
                    <CardContent>
                        <Typography variant="h4">Scales</Typography>
                    </CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => startGame(GameType.Scales)} variant="contained">Play</Button>
                    </Box>
                </Card>
            
                <Card>
                    <CardContent>
                        <Typography variant="h4">Paper Folding</Typography>
                    </CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => startGame(GameType.Paper)} variant="contained">Play</Button>
                    </Box>
                </Card>
                
                <Card>
                    <CardContent>
                        <Typography variant="h4">Math</Typography>
                    </CardContent>
                    <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={() => startGame(GameType.Math)} variant="contained">Play</Button>
                    </Box>
                </Card>
            </Box>
        </Box>
    )
}

export default GameSelectPage