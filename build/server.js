const path = require('path')
const express = require('express')
const webpack = require('webpack')
const proxyMiddleware = require('http-proxy-middleware')
const ora = require('ora')
const rootDir = path.join(__dirname, '../')
const config = require('./config/server.config')
const webpackConfig = require('./config/webpack.dev')

const spinner = ora({
  text: 'Starting dev server...'
})

const port = process.env.PORT || config.port
// https://github.com/chimurai/http-proxy-middleware
const proxy = config.proxy
const app = express()
const compiler = webpack(webpackConfig)

const devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  logLevel: 'silent'
})

const hotMiddleware = require('webpack-hot-middleware')(compiler, {
  log: () => {},
  heartbeat: 2000
})

// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    if (cb) cb()
  })
})

// proxy api requests
Object.keys(proxy).forEach(function (context) {
  const options = proxy[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(options.filter || context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

// serve pure static assets
const staticPath = path.posix.join(config.assetsPublicPath, config.assetsSubDirectory)
app.use(staticPath, express.static(path.join(rootDir, 'static')))

const uri = 'http://0.0.0.0:' + port

let _resolve
const readyPromise = new Promise(resolve => {
  _resolve = resolve
})

spinner.start()

devMiddleware.waitUntilValid(() => {
  spinner.stop()
  _resolve()
})

const server = app.listen(port, (error) => {
  if (error) {
    console.log('\n', error)
  }
})

module.exports = {
  ready: readyPromise,
  close: () => {
    server.close()
  }
}
