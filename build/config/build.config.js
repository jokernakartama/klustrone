var path = require('path')
const rootDir = path.join(__dirname, '../../')

module.exports = {
    index: path.join(rootDir, 'dist/index.html'),
    assetsRoot: path.join(rootDir, 'dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
  }
