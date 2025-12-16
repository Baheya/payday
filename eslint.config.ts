import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";
import compat from "eslint-plugin-compat";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  compat.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/recommended"],
  ...eslintPluginAstro.configs["flat/jsx-a11y-recommended"],
  {
    files: ["**/*.{astro,ts,tsx}"],
    processor: "astro/client-side-ts",
    languageOptions: {
      parserOptions: {
        parser: "@typescript-eslint/parser",
        projectService: "tsconfig.eslint.json",
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    ignores: [".astro/**"],
  },
]);
