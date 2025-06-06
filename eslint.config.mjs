import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

import noHardcodedAriaLabels from "./eslint-rules/no-hardcoded-aria-labels.js";

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
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
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx"],
    rules: {
      "react/jsx-no-literals": "off",
    },
  },
];

export default eslintConfig;
