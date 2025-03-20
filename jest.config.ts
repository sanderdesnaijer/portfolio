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
    "!app/test-utils/**/*.{js,ts}",
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/app/studio/\\[\\[\\.\\.\\.tool\\]\\]/",
  ],
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/sanity/(.*)$": "<rootDir>/sanity/$1",
    "\\.svg": "<rootDir>/app/__mocks__/svg.ts",
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
};

const jestConfigWithOverrides = async () => {
  const configFn = createJestConfig(config);
  const res = await configFn();

  res.moduleNameMapper = {
    // We cannot depend on the exact key used by Next.js
    // so we inject an SVG key higher up on the mapping tree
    "\\.svg": "<rootDir>/src/__mocks__/svg.ts",
    ...res.moduleNameMapper,
  };

  return res;
};

export default jestConfigWithOverrides;
