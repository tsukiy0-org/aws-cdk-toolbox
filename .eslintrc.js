const path = require("path");

module.exports = {
  extends: ["@tsukiy0/eslint-config"],
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.json"),
  },
};
