/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

const config: Config = {
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: [
    "app/**/*.{js,jsx,ts,tsx}", // Adjust this pattern to match your source files
    "!app/**/*.d.ts", // Exclude type definition files if you're using TypeScript
    "!app/**/index.{js,ts}", // Optionally exclude index files
  ],
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/app/studio/\\[\\[\\.\\.\\.tool\\]\\]/", // Exclude the app/studio/[[...tool]] folder
  ],
  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",
  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",
  // The test environment that will be used for testing
  testEnvironment: "jsdom",
  // testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ["<rootDir>/setupTests.ts"],

  moduleNameMapper: {
    "^@/components/(.*)$": "<rootDir>/app/components/$1",
    "^@/sanity/(.*)$": "<rootDir>/sanity/$1",
  },
};

export default createJestConfig(config);
