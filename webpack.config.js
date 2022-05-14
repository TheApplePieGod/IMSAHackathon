const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

var config = (env, options) => {
    let isProduction;

    if (env && env.NODE_ENV && env.NODE_ENV !== 'development') {
        isProduction = true;
    } else if (options && options.mode === 'production') {
        isProduction = true;
    } else {
        isProduction = false;
    }

    return {
        target: "web",
        mode: isProduction ? 'production' : 'development',
        entry: './ClientApp/Main.tsx',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'bundle.js'
        },
        resolve: {
            extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    include: path.resolve(__dirname, "./ClientApp/"),
                    loader: "ts-loader",
                    options: {
                        transpileOnly: !isProduction
                    }
                },
                {
                    test: /\.(png|jpg|jpeg|gif|svg|ttf|otf|woff|woff2|eot)$/,
                    loader: 'url-loader',
                    options: {
                        limit: 4096
                    }
                }
            ]
        },

        devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",

        devServer: {
            https: false,
            client: {
                webSocketURL: 'ws://localhost:8080/ws',
            },
            webSocketServer: 'ws',
            historyApiFallback: true,
            compress: true,
            hot: true,
            port: 8080
        },

        plugins: [
            new HtmlWebpackPlugin({
                template: './html/index.html'
            })
        ],
    };
};
module.exports = config;
