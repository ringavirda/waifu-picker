const { defineConfig } = require("eslint/config");

module.exports = defineConfig(
  require("@eslint/js").configs.recommended,
  require("typescript-eslint").configs.recommended,
  require("eslint-config-prettier/flat"),
  {
    ignores: ["node_modules/**", "dist/**", "./**/*js"],
  },
  {
    files: ["**/*.{ts,js}"],
    languageOptions: {
      parser: require("@typescript-eslint/parser"),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      // "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
      prettier: require("eslint-plugin-prettier"),
    },
    rules: {
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
    },
  },
);
