import * as React from 'react';
import { createRoot } from 'react-dom/client'
import { AppRoutes } from "./AppRoutes";

const render = () => {
    const rootElem = document.getElementById('root');
    if (!rootElem) return;

    const root = createRoot(rootElem);
    root.render(<AppRoutes />);
};
render();

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./AppRoutes', () => {
        render();
    });
}