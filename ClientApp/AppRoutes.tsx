import * as React from "react";
import { Route, Routes, useLocation } from "react-router";
import { createAppTheme } from "./Styles/AppTheme";
import { PageWrapper } from "./Components/UI/PageWrapper";
import { Box, CircularProgress, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter } from "react-router-dom";

const HomePage = React.lazy(() => import("./Components/Pages/HomePage"));
const AboutPage = React.lazy(() => import("./Components/Pages/AboutPage"));
const NotFoundPage = React.lazy(() => import("./Components/Pages/NotFoundPage"));

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
                                <Route path={'about'} element={<AboutPage />} />

                                <Route path={'account/signout'} element={<></>} />
                                <Route path={'account/authenticate'} element={<></>} />

                                <Route path={'/*'} element={<NotFoundPage />} />
                            </Routes>
                        </Box>
                    </PageWrapper>
                </ThemeProvider>
            </React.Suspense>
        </BrowserRouter>
    );
};