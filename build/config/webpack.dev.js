var path = require('path')
var webpackConfig = require('./webpack.common')
var loaders = require('./loaders')
var merge = require('webpack-merge')
var webpack = require('webpack')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
// paths 
var rootDir = path.join(__dirname, '../../')
var buildPath = path.join(rootDir, 'dist')
var sourcePath = path.join(rootDir, 'src')
var config = require('../config/server.config')
// add hot-reload related code to entry chunks
Object.keys(webpackConfig.entry).forEach(function (name) {
  webpackConfig.entry[name] = [path.join(__dirname, '../client.js')].concat(webpackConfig.entry[name])
})

var plugins = [
  // injects built files in html file
  new HtmlWebpackPlugin({
    template: path.join(sourcePath, 'index.html'),
    path: buildPath,
    filename: 'index.html',
    inject: true,
    minify: {
      removeComments: true
    }
  }),
  new webpack.LoaderOptionsPlugin({
      debug: true
  }),
  // shows module path names in hot module replacement info instead of numbers 
  new webpack.NamedModulesPlugin(),
  // shows neat logs in console, logs in webpack-dev-middleware and webpack-hot-middleware must be disabled
  new FriendlyErrorsPlugin({
    compilationSuccessInfo: {
      messages: ['Your application is running here http://0.0.0.0:' + config.port],
    }
  }),
  // reloads the page, when the changes in file has been saved
  new webpack.HotModuleReplacementPlugin()
]

var rules = [
  { test: /\.css$/, use: loaders(['style', 'css', 'postcss', 'import-glob']) },
  { test: /\.scss$/, use: loaders(['style', 'css', 'postcss', 'sass', 'import-glob']) },
  { test: /\.sass$/, use: loaders(['style', 'css', 'postcss', 'sass', 'import-glob']) },
  { test: /\.less$/, use: loaders(['style', 'css', 'postcss', 'less', 'sass', 'import-glob']) },
  { test: /\.styl$/, use: loaders(['style', 'css', 'postcss', 'stylus', 'import-glob']) }
]

module.exports =  merge(webpackConfig, {
  devtool: 'cheap-module-source-map',
  module: {
    rules
  },
  plugins
})
