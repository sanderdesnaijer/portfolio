import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const customConfig: Config = {
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

  testEnvironment: "jest-fixed-jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  // IMPORTANT: transpile ESM packages from node_modules
  transformIgnorePatterns: [
    "node_modules/(?!(@mswjs/interceptors|msw|until-async|next-sanity|@sanity)/)",
  ],

  // Ensure TS/JS go through babel-jest with Next’s preset
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          [
            "next/babel",
            {
              "preset-react": {
                runtime: "automatic",
              },
            },
          ],
        ],
      },
    ],
  },

  // Helps with ESM files shipped as .mjs
  // extensionsToTreatAsEsm: [".mjs"],

  testPathIgnorePatterns: ["<rootDir>/e2e/"],
};

// Let next/jest build its base, then force our overrides where needed
export default async () => {
  const cfg = await createJestConfig(customConfig)();
  return {
    ...cfg,
    transformIgnorePatterns: customConfig.transformIgnorePatterns,
    transform: customConfig.transform,
    extensionsToTreatAsEsm: customConfig.extensionsToTreatAsEsm,
  } as Config;
};
