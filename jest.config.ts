/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}",
    "!app/**/*.d.ts",
    "!app/**/index.{js,ts}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/app/studio/\\[\\[\\.\\.\\.tool\\]\\]/",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/sanity/(.*)$": "<rootDir>/sanity/$1",
  },
};

export default createJestConfig(config);
