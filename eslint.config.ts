import eslintPluginAstro from "eslint-plugin-astro";
import { defineConfig } from "eslint/config";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default defineConfig([
  // add more generic rule sets here, such as:
  // js.configs.recommended,
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],
  {
    files: ["**/*.astro,**/*.ts,**/*.tsx"],
    ignores: ["./.astro/**/*"],
    processor: "astro/client-side-ts",
    languageOptions: {
      parser: "@typescript-eslint/parser",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        extraFileExtensions: [".astro"],
        project: "./tsconfig.eslint.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    // ...
  },
]);
