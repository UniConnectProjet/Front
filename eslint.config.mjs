import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { ignores: ["build/**", "dist/**", "coverage/**", "node_modules/**", "public/**"] },
  { files: ["**/*.{js,mjs,cjs,jsx,tsx}"] },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // Détecte automatiquement la version de React
      },
    },
  },
];