const webpack = require('webpack')
const webpackConfig = require('./webpack.common')
const loaders = require('./loaders')
const merge = require('webpack-merge')

delete webpackConfig.entry

const rules = [
  { test: /\.css$/, use: loaders(['style', 'css', 'postcss', 'import-glob']) },
  // { test: /\.scss$/, use: loaders(['style', 'css', 'postcss', 'sass', 'import-glob']) },
  // { test: /\.sass$/, use: loaders(['style', 'css', 'postcss', 'sass', 'import-glob']) },
  // { test: /\.less$/, use: loaders(['style', 'css', 'postcss', 'less', 'sass', 'import-glob']) },
  { test: /\.styl$/, use: loaders(['style', 'css', 'postcss', 'stylus', 'import-glob']) }
]

module.exports =  merge(webpackConfig, {
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"testing"',
        BABEL_ENV: '"testing"'
      }
    })
  ]
})
