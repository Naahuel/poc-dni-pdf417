/**
 * This is the PROD configuration for webpack
 * It will be used for production mode
 */
'use strict';
const merge  = require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  module: {
      rules: [{
          test: /\.scss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            { loader: "css-loader" },
            { loader: "postcss-loader" },
            { loader: "sass-loader", options: { outputStyle: 'compressed' }}
          ]
      }]
  }
});