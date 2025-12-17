import eslint from "@eslint/js";
import eslintPluginAstro from "eslint-plugin-astro";
import compat from "eslint-plugin-compat";
import perfectionist from "eslint-plugin-perfectionist";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

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
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      perfectionist,
    },
    rules: {
      "perfectionist/sort-imports": [
        "error",
        {
          fallbackSort: { type: "type-import-first", order: "asc" },
          tsconfig: {
            rootDir: ".",
          },
          groups: [
            "type-import",
            { newLineBetween: 1 },
            "value-import",
            { newLineBetween: 1 },
            "value-side-effect",
            { newLineBetween: 1 },
            "unknown",
          ],
        },
      ],
    },
  },
  {
    ignores: [".astro/**"],
  },
]);
