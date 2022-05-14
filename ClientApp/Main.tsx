import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { AppRoutes } from "./AppRoutes";

const render = () => {
    ReactDOM.render(
        <AppRoutes />,
        document.getElementById('root')
    );
};
render();

if (process.env.NODE_ENV !== 'production' && module.hot) {
    module.hot.accept('./AppRoutes', () => {
        render();
    });
}