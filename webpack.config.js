'use strict'
let htmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');
let webpack = require('webpack');

module.exports = {
    entry: [
        './src/app.ts',
    ],
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist',
        publicPath: 'http://localhost:8080/'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: ['babel-loader', 'awesome-typescript-loader']
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        inline: true
    },
    plugins: [
        new webpack.SourceMapDevToolPlugin(),
        new htmlWebpackPlugin({
            template: __dirname + '/index.html'
        })
    ]
}