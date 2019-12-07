const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const copyWebpackPlugin = require('copy-webpack-plugin');
// The path to the cesium source code
const cesiumSource = './node_modules/cesium/Build/Cesium/';

module.exports = [{
    context: __dirname,
    mode: 'development',
    entry: {
        'index': './index.js',
    },
    output: {
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                    options: {
                        publicPath: 'css/'
                    },
                },
                'css-loader'
            ]
        },{
            test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
            use: ['url-loader']
        }, {
            test: /.(png|woff|woff2|eot|ttf|svg)$/,
            use: ['url-loader?limit=100000']
        },{
            test: require.resolve('jquery'),
            use: [
                {
                    loader: 'expose-loader',
                    options: '$'
                },
                {
                    loader: 'expose-loader',
                    options: 'jQuery'
                }
            ]
        }
        ],
        unknownContextCritical : false,
    },
    plugins: [
        new webpack.DefinePlugin({
            CESIUM_BASE_URL:JSON.stringify('')
        }),
        new HtmlWebpackPlugin({
            template: './index.html',
            minify: {
                removeComments: true
            },
            publicPath:'/',
            hash: true
        }),
        
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery:"jquery",
            'window.jQuery': 'jquery',           
            'window.$': 'jquery',
            'Cesium':'cesium'
        }),
        new copyWebpackPlugin([{ from: 'res', to:'res' }]),
        // Copy Cesium Assets, Widgets, and Workers to a static directory
        new copyWebpackPlugin([{from: path.join(cesiumSource, 'Workers'), to: 'Workers'}]),
        new copyWebpackPlugin([{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]),
        new copyWebpackPlugin([{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]),
        // new copyWebpackPlugin([{ from: path.join(__dirname, './node_modules/cesium/Build/CesiumUnMinified'), to: './plugins/cesium' }]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].[hash].css',
        })
    ],
    devServer: {
        open: true,
        publicPath:'/'
    }

}];