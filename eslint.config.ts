import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  eslint.configs.recommended,
  tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
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
