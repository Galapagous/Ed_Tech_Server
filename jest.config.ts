// import type { Config } from "jest";

// const config: Config = {
//   preset: "ts-jest",
//   testEnvironment: "node",
//   roots: ["<rootDir>/_test_"],
//   moduleFileExtensions: ["ts", "js", "json"],
//   moduleNameMapper: {
//     "^src/(.*)$": "<rootDir>/src/$1",
//   },
//   setupFilesAfterEnv: ["<rootDir>/_test_/setup.ts"],
// };

// export default config;

// === v2 ===
const config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src", "<rootDir>/src/__test__"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/server.ts"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/src/__test__/setup.ts"],
  moduleNameMapper: {
    // Fixed: Changed from moduleNameMapping to moduleNameMapper
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transformIgnorePatterns: [
    // New: Exclude uuid from node_modules ignore list
    "node_modules/(?!(uuid)/)", // Transpile uuid and anything under uuid/
  ],
};

export default config;
