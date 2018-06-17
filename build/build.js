const path = require('path')
const webpack = require('webpack')
const rm = require('rimraf')
const ora = require('ora')
const webpackConfig = require('./config/webpack.prod')
const config = require('./config/build.config')

const spinner = ora({
  text: 'Building for production...'
})
spinner.start()

// remove all files from build directory and compile new one
rm(path.join(config.assetsRoot, config.assetsSubDirectory), err => {
  if (err) throw err
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')
    console.log(' Build complete \n')
  })
})
 
