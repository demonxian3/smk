const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

module.exports = merge(baseConfig, {
    mode: 'development',
    devServer: {
        contentBase: "./dist",
        historyApiFallback: true,
        inline: true,
    },
    devtool: "source-map",
    plugins: [
        new webpack.DefinePlugin({
            'process.env.INFO': {
                ENV: JSON.stringify('dev'),
            },
        }),
    ],
});
