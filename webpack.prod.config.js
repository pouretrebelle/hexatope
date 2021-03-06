'use strict';

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
    path.join(__dirname, 'src/main.js'),
  ],
  output: {
    path: path.join(__dirname, '/docs/app/'),
    filename: '[name]-[hash].min.js',
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      inject: 'body',
      filename: 'index.html',
    }),
    new ExtractTextPlugin('[name]-[hash].min.css'),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
        screw_ie8: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json?$/,
        loader: 'json-loader',
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.s[ca]ss$/,
        loader: 'style-loader!css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss-loader!sass-loader',
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader?modules&localIdentName=[name]---[local]---[hash:base64:5]!postcss-loader'),
      },
      {
        test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
        loader: 'file-loader',
        options: {
          name(file) {
            if (/.+(favicon)|(opengraph)|(twittercard)\.(jpg)|(png)/.test(file)) {
              return '../assets/[name].[ext]';
            }
            return '[hash].[ext]';
          },
        },
      },
    ],
  },
  resolve: {
    modules: ['src', 'node_modules'],
    alias: {
      styles: path.resolve('src', 'styles'),
    },
  },
};
