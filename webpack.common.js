/**
 * This is the base configuration for webpack
 * It will be used in all enviornments
 */
'use strict';
const path                 = require('path');
const HtmlWebpackPlugin    = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin   = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js'
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash].css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ],
  output: {
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
    // Fix references to URLs: use absolute
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            // Handles image files inserted in HTML and CSS
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]',
              // Output these files in this directory
              outputPath: "images/"
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            // Handles the HTML output, particularly useful for inserted assets to be processed by other loaders
            loader: 'html-loader',
            options: {
              minimize: true
            }
          }
        ]
      }
    ]
  }
};