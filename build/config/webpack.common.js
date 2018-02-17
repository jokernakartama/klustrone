var webpack = require('webpack')
var path = require('path')
// Extracts all css files in one
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var nodeEnv = process.env.NODE_ENV || 'development'
var isProduction = nodeEnv === 'production'
// paths
var rootDir = path.join(__dirname, '../../')
var nodeModulesPath = path.join(rootDir, 'node_modules')
var buildPath = path.join(rootDir, 'dist')
var sourcePath = path.join(rootDir, 'src')


var rules = [
  {
    test: /\.(js|jsx)$/,
    include: sourcePath,
    exclude: /node_modules/,
    use: [
      'babel-loader',
      'eslint-loader',
    ],
  },
  {
    test: /\.(ts|tsx)$/,
    use: [
      'awesome-typescript-loader',
      'tslint-loader'
    ],
    exclude: /node_modules/
  }
]

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(nodeEnv),
    },
  }),
  new webpack.NoEmitOnErrorsPlugin() // prevents Webpack from outputting anything into a bundle on errors
]


module.exports = {
  devtool: false,
  context: sourcePath,
  entry: {
    app: path.join(sourcePath, 'index.tsx')
  },
  output: {
    path: buildPath,
    publicPath: '/',
    filename: 'app.js',
  },
  module: {
    rules
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.ts'],
    // set the same aliases in tsconfig.json
    alias: {
      '~': sourcePath
    },
    modules: [
      nodeModulesPath,
      rootDir
    ],
  },
  plugins
}
