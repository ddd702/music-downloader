/* eslint-env node */

module.exports = {
  root: true,
  'extends': [
    // '@electron-internal',
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    "@vue/eslint-config-prettier"
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "vue/no-unused-vars":1,
    "vue/multi-word-component-names":0,
    "no-console": "off",
    "prettier/prettier":[1,{
      singleQuote: true,
    }],
    semi:[1],
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ]
  },
}
