var path = require('path')
var webpack = require('webpack')
var webpackConfig = require('./webpack.common')
var loaders = require('./loaders')
var merge = require('webpack-merge')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var config = require('./build.config')
// paths
var rootDir = path.join(__dirname, '../../')
var buildPath = path.join(rootDir, 'dist')
var sourcePath = path.join(rootDir, 'src')

var rules = [
  {
    test: /\.styl$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders(['css', 'postcss', 'stylus', 'import-glob'])

    }),
  },
  {
    test: /\.scss$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders(['css', 'postcss', 'scss', 'import-glob'])
    }),
  },
  {
    test: /\.sass$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders(['css', 'postcss', 'sass', 'import-glob'])
    }),
  },
  {
    test: /\.css$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders(['css', 'postcss', 'import-glob'])
    }),
  },
  {
    test: /\.less$/,
    use: ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: loaders(['css', 'postcss', 'less', 'import-glob'])
    }),
  }
]


var plugins = [
  // split vendor js into its own file
  new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    minChunks: function (module, count) {
      // any required modules inside node_modules are extracted to vendor
      return (
        module.resource &&
        /\.js$/.test(module.resource) &&
        module.resource.indexOf(
          path.join(rootDir, 'node_modules')
        ) === 0
      )
    }
  }),
  // extract webpack runtime and module manifest to its own file in order to
  // prevent vendor hash from being updated whenever app bundle is updated
  new webpack.optimize.CommonsChunkPlugin({
    name: 'manifest',
    chunks: ['vendor']
  }),
  new webpack.optimize.UglifyJsPlugin({
    compress: {
      warnings: false,
      screw_ie8: true,
      conditionals: true,
      unused: true,
      comparisons: true,
      sequences: true,
      dead_code: true,
      evaluate: true,
      if_return: true,
      join_vars: true,
    },
    sourceMap: true,
    output: {
      comments: false,
    },
  }),
  new HtmlWebpackPlugin({
    template: path.join(sourcePath, 'index.html'),
    path: buildPath,
    filename: 'index.html',
    inject: true,
    minify: {
      removeComments: true,
      collapseWhitespace: false
    }
  }),
  // copy static files from source directory
  new CopyWebpackPlugin([
      {
        from: path.resolve(rootDir, 'static'),
        to: config.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
  new ExtractTextPlugin(path.posix.join(config.assetsSubDirectory, 'klustr/css/[name].[contenthash].css'), {allChunks: false})
];




module.exports =  merge(webpackConfig, {
  devtool: 'source-map',
  output: {
    path: config.assetsRoot,
    publicPath: '/',
    filename: path.posix.join(config.assetsSubDirectory, 'klustr/js/[name].[chunkhash].js'),
    chunkFilename: path.posix.join(config.assetsSubDirectory, 'klustr/js/[id].[chunkhash].js')
  },
  module: {
    rules
  },
  plugins,
})
