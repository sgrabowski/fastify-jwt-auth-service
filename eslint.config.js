const js = require("@eslint/js");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsparser = require("@typescript-eslint/parser");
const prettier = require("eslint-config-prettier");
const prettierPlugin = require("eslint-plugin-prettier");
const jestPlugin = require('eslint-plugin-jest');
const globals = require('globals');

module.exports = [
  js.configs.recommended, // Default ESLint rules
  {
    files: ["**/*.ts"], // Apply only to TypeScript files
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...jestPlugin.environments.globals.globals
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      prettier: prettierPlugin,
      jest: jestPlugin
    },
    rules: {
      "no-unused-vars": "off",
      semi: ["error", "always"], // Enforce semicolons
      quotes: ["error", "double"], // Enforce double quotes
      indent: ["error", 2], // Enforce indentation with 2 spaces
      "@typescript-eslint/no-unused-vars": ["warn"], // Warn about unused variables
      "prettier/prettier": "error", // Enforce Prettier rules
    },
  },
  prettier, // Disable conflicting rules with Prettier
];