module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    sourceType: 'module'
  },
  globals: {
    App: true,
    jQuery: true,
    $: true,
    TweenMax: true,
    Expo: true,
    _: true,
    axios: true,
    moment: true,
    LazyLoad: true
  },
  env: {
    browser: true
  },
  extends: 'standard', // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  rules: { // add your custom rules here
    'prefer-const': 0,
    'no-multi-str': 0,
    'camelcase': 0,
    'no-new': 0,
    'arrow-parens': 0, // allow paren-less arrow functions
    'generator-star-spacing': 0, // allow async-await
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0 // allow debugger during development
  }
};