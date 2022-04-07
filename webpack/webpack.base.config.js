const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rootPath = path.resolve('.');

module.exports = {
    entry: {
        index: path.resolve(rootPath, "src/pages/index/index.tsx"),
    },
    output: {
        filename: "[name].[hash:10].js",
        path: path.resolve(rootPath, "dist"),
    },
    resolve: {
        alias: {
            '@': path.resolve(rootPath, 'src'),
        },
        extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    },
    devServer: {
        hot: true,
        port: 8083,
        open: true,
        publicPath: '/'
    },
    module: {
        rules: [
            {
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['mobx', '@babel/preset-env', '@babel/react'],
                        plugins: [
                            [
                                "@babel/plugin-proposal-decorators",
                                { "legacy": true },
                            ]
                        ]
                    },
                },

                exclude: /node_modules/,
            },
            {
                test: /\.tsx?$/,
                use: {
                    loader: "awesome-typescript-loader",
                },
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: {
                    loader: "source-map-loader",
                },
            },
            {
                test: /\.less$/,
                use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            {
                test: /\.(ts|tsx|js|jsx)$/,
                loader: "eslint-loader",
                enforce: "pre",
                include: [path.resolve(rootPath, "src")],
                options: {
                    formatter: require("eslint-friendly-formatter"),
                    emitWarning: true,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(rootPath, "src/pages/index/index.html"),
            filename: 'index.html',
            chunks: ['index'],
        }),
        new MiniCssExtractPlugin({
            filename: "[name].[contenthash:10].css",
        }),
    ],
};
