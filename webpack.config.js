'use strict'
let htmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');

module.exports = {
    entry: [
        './src/app.ts',
    ],
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
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
    }
}