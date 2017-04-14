var eslintRules = require('./config/eslint');

module.exports = {
  root: true,
  parser: 'babel-eslint', // allows usage of async/await
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  extends: 'eslint:recommended',
  env: {
    browser: true
  },
  rules: eslintRules
};
