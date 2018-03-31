var webpackConfig = require('./webpack.test')

module.exports = function(config) {
  config.set({
    files: [
      // use a polyfill for function.prototype.bind which is missing from PhantomJS
      'node_modules/phantomjs-polyfill/bind-polyfill.js',
      'node_modules/babel-polyfill/browser.js',
      'build/config/enzyme.init.js',
      // path pattern for specifications
      'src/**/*.spec.js'
    ],
    // frameworks to use in test files
    frameworks: ['mocha', 'chai-sinon'],
    basePath: '../../',
    preprocessors: {
      // application files
      'build/config/enzyme.init.js': ['webpack'],
      'src/**/*.js': ['webpack'],
      'src/**/*.tsx': ['webpack'],
      'src/**/*.ts': ['webpack'],
    },
    logLevel : config.LOG_DISABLE,
    reporters: ['mocha'],
    mochaReporter: {
      maxLogLines: -1,
      showDiff: true
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      logLevel: 'silent',
      stats: 'errors-only'
    },
    browsers: ['PhantomJS']
  })
}
