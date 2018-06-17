const path = require('path')
const loaderOptions = require('./loaders.config')
const sourceMap = true

module.exports = function (list) {
  const loaders = []
  for (var i = 0; i < list.length; i++) {
    loaders.push({
      loader: list[i] + '-loader',
      options: Object.assign({}, loaderOptions[list[i]], { sourceMap: sourceMap })
    })
  }
  return loaders
}
