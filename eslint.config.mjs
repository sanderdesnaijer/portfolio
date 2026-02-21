import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import { dirname } from "path";
import { fileURLToPath } from "url";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import noHardcodedAriaLabels from "./eslint-rules/no-hardcoded-aria-labels.js";

const eslintConfig = [
  ...nextCoreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    plugins: {
      "custom-rules": {
        rules: {
          "no-hardcoded-aria-labels": noHardcodedAriaLabels,
        },
      },
    },
    rules: {
      "no-console": "error",
      "react/jsx-no-literals": "error",
      "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "object-shorthand": ["error", "always"],
      "prefer-destructuring": [
        "error",
        {
          object: true,
          array: false,
        },
      ],
      "custom-rules/no-hardcoded-aria-labels": "error",
    },
  },
  // Typed linting for TypeScript files only (required for no-deprecated rule)
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      "@typescript-eslint/no-deprecated": "error",
    },
  },
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "react/jsx-no-literals": "off",
    },
  },
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "e2e/**",
      "playwright-report/**",
      "**/*.svg",
      "coverage/**",
      "public/mockServiceWorker.js",
    ],
  },
];

export default eslintConfig;
