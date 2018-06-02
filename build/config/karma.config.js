var webpackConfig = require('./webpack.test')

module.exports = function(config) {
  config.set({
    files: [
      // use a polyfill for function.prototype.bind which is missing from PhantomJS
      { pattern: 'node_modules/phantomjs-polyfill/bind-polyfill.js', watched: false},
      { pattern: 'node_modules/babel-polyfill/browser.js', watched: false},
      { pattern: 'build/config/enzyme.init.js', watched: false},
      // path pattern for specifications
      'src/**/*.spec.js',
    ],
    // frameworks to use in test files
    frameworks: ['mocha', 'chai-sinon'],
    basePath: '../../',
    preprocessors: {
      'build/config/enzyme.init.js': ['webpack'],
      // application files     
      'src/**/*.js': ['webpack'],
      'src/**/*.tsx': ['webpack'],
      'src/**/*.ts': ['webpack'],
    },
    logLevel : config.LOG_DISABLE,
    reporters: ['spec'],
    webpack: webpackConfig,
    browsers: ['PhantomJS']
  })
}
