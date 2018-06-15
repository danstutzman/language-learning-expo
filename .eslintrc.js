module.exports = {
  env: {
    es6: true,
    jest: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  globals: {
    __DEV__: false,
    fetch: false,
    IntervalID: false
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      modules: true,
      experimentalObjectRestSpread: true
    }
  },
  plugins: [
    'react'
  ],
  rules: {
    indent: ['error', 2],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    'no-trailing-spaces': ['error'],
    quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    'react/display-name': 'off',
    semi: ['error', 'never']
  }
}
