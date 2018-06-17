var webpackConfig = require('./webpack.test')

module.exports = function(config) {
  config.set({
    files: [
      { pattern: 'node_modules/babel-polyfill/browser.js', watched: false },
      { pattern: 'build/config/enzyme.init.js', watched: false },
      // path pattern for specifications
      'src/**/*.spec.js'
    ],
    // frameworks to use in test files
    frameworks: ['mocha', 'sinon-chai'],
    basePath: '../../',
    preprocessors: {
      'build/config/enzyme.init.js': ['webpack'],
      // application files     
      'src/**/*.js': ['webpack'],
      'src/**/*.tsx': ['webpack'],
      'src/**/*.ts': ['webpack'],
    },
    logLevel : config.LOG_ERROR,
    reporters: ['spec'],
    webpack: webpackConfig,
    webpackMiddleware: {
      logLevel: 'error',
      stats: 'errors-only'
    },
    browsers: ['ChromiumHeadless']
  })
}
