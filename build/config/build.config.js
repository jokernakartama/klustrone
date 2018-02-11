var path = require('path')
const rootDir = path.join(__dirname, '../../')

module.exports = {
    env: {
      NODE_ENV: '"production"'
    },
    index: path.join(rootDir, 'dist/index.html'),
    assetsRoot: path.join(rootDir, 'dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
  }
