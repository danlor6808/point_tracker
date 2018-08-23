var path = require('path');
var webpack = require('webpack');
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: __dirname + '/dist/js',
        filename: 'bundle.js'
    },
    watch: true,
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', "react"]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.
                    extract({
                        fallback: 'style-loader',
                        use: 'css-loader!sass-loader'
                    })
            },
        ]
    },
    resolve: {
        extensions: [".js",".scss"]
    },
    plugins: [
        new ExtractTextPlugin('../css/style.css'),
        new BrowserSyncPlugin({
        host: 'localhost',
        port: 3000,
        files: [
            './dist/*.html', 
            './src/scss/*.scss', 
            './src/scss/*/*.scss',
            './src/js/*.js',
            './src/js/*/*.js'
        ],
        server: { baseDir: ['dist'] }
        })
  ]
};