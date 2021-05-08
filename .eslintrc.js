module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "prettier",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  ignorePatterns: [
    "**/*.d.ts"
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./packages/*/tsconfig.json"],
  },
  rules: {
    "prettier/prettier": [
      "error",
      {
        singleQuote: false,
        trailingComma: "all",
      },
    ],
    // "no-new": 0,
    // "import/prefer-default-export": 0,
    // "class-methods-use-this": 0,
    // "max-classes-per-file": 0,
    // "react/prop-types": 0,
    // "react/jsx-wrap-multilines": 0
    "@typescript-eslint/require-await": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-unsafe-assignment": "off",
  },
};
