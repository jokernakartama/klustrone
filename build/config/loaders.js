var path = require('path')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var loaderOptions = require('./loaders.config')
var sourceMap = true

module.exports = function (list) {
  var loaders = []
  for (var i = 0; i < list.length; i++) {
    loaders.push({
      loader: list[i] + '-loader',
      options: Object.assign({}, loaderOptions[list[i]], { sourceMap: sourceMap })
    })
  }
  return loaders
}
