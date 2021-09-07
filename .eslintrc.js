module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    quotes: [1, "double"],
    "comma-dangle": "off",
    "global-require": "off",
    "operator-linebreak": "off",
    "no-await-in-loop": "off",
    "import/no-dynamic-require": "off",
  },
};
