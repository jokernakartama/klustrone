module.exports = {
  css: {
    importLoaders: 1
  },
  postcss: {
    plugins: [
      require('postcss-import')(),
      require('autoprefixer')({
        'browsers': [
          'last 3 version',
          'ie >= 9',
        ]
      }),
      require('cssnano')()
    ]
  }
}
