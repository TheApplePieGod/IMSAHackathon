import * as React from 'react';
import { createRoot } from 'react-dom/client'
import { AppRoutes } from "./AppRoutes";

const rootElem = document.getElementById('root');
if (rootElem) {
    const root = createRoot(rootElem);
    
    const render = () => {
        root.render(<AppRoutes />);
    }
    render();

    if (process.env.NODE_ENV !== 'production' && module.hot) {
        module.hot.accept('./AppRoutes', () => {
            render();
        });
    }
}