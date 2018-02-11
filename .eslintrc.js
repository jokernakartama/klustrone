// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'typescript-eslint-parser',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: ['eslint:recommended', 'plugin:react/recommended', "standard-with-typescript"],
  plugins: [
    "typescript",
    "react"
  ],
  // add your custom rules here
  rules: {
    // allow paren-less arrow functions
    'no-console': ['error', {allow: ['log']}],
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  settings: {
    'import/resolver': {
      'node': true,
      'eslint-import-resolver-typescript': true
    }
  }
}
