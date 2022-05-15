import * as React from "react";
import { Route, Routes, useLocation } from "react-router";
import { createAppTheme } from "./Styles/AppTheme";
import { PageWrapper } from "./Components/UI/PageWrapper";
import { Box, CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";
import { SocketContextProvider } from "./Game/SocketContext";

const HomePage = React.lazy(() => import("./Components/Pages/HomePage"));
const AboutPage = React.lazy(() => import("./Components/Pages/AboutPage"));
const NotFoundPage = React.lazy(() => import("./Components/Pages/NotFoundPage"));
const JoinPage = React.lazy(() => import("./Components/Pages/JoinPage"));
const GameSelectPage = React.lazy(() => import("./Components/Pages/GameSelectPage"));
const LobbyPage = React.lazy(() => import("./Components/Pages/LobbyPage"));
const GameWrapper = React.lazy(() => import("./Components/Pages/GameWrapper"));

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <React.Suspense fallback={<CircularProgress />}>
                <ThemeProvider theme={createAppTheme()}>
                    <CssBaseline />
                    <PageWrapper>
                        <Box>
                            <Routes>
                                <Route path={'/'} element={<HomePage />} />
                                <Route path={'join/:roomIdString'} element={<JoinPage/>} />
                                <Route
                                    path={'play/:roomIdString/:name'}
                                    element={<SocketContextProvider><LobbyPage/></SocketContextProvider>}
                                />
                                <Route path={'/*'} element={<NotFoundPage />} />
                            </Routes>
                        </Box>
                    </PageWrapper>
                </ThemeProvider>
            </React.Suspense>
        </BrowserRouter>
    );
};