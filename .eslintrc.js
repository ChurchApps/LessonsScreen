module.exports = {
  extends: ["eslint:recommended", "plugin:react/recommended"],
  plugins: [
    "react",
    "react-native"
  ],
  parser: "@babel/eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2023
  },
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@next/next/no-img-element": "off",
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
    "react/no-unescaped-entities": "off",
    "react-hooks/exhaustive-deps": "off",
    "comma-dangle": "off",
    "eol-last": ["warn", "always"],
    "quote-props": ["error", "as-needed"],
    "quotes": "off",
    "no-trailing-spaces": "warn",
    "no-var": "error",
    "operator-linebreak": ["warn", "before"],
    "multiline-ternary": ["warn", "always-multiline"],
    "indent": ["warn", 2, { "SwitchCase": 1 }],
    "arrow-body-style": ["warn", "as-needed"],
    "react/jsx-tag-spacing": ["warn", { "beforeSelfClosing": "always", "beforeClosing": "never" }],
    "no-multiple-empty-lines": "off",
    "jsx-quotes": ["warn", "prefer-double"],
    "no-undef": "off",
    "no-unused-vars": "off",
    "no-useless-catch": "off"
  }
};
