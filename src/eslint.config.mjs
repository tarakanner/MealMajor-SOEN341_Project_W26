import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,jsx}"], plugins: { js }, extends: ["js/recommended"], languageOptions: { globals: globals.browser } },
  { files: ["backend/**/*.{js,mjs,cjs}"], languageOptions: { globals: globals.node } },
  { files: ["**/*.test.{js,jsx}", "**/tests/**/*.{js,jsx}", "**/__tests__/**/*.{js,jsx}"], languageOptions: { globals: globals.jest } },
  pluginReact.configs.flat.recommended,
]);
