import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  testEnvironment: "jsdom",

  rootDir: "./",

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },

  testMatch: ["<rootDir>/tests/**/*.test.{ts,tsx,js,jsx}"],

  collectCoverageFrom: [
    "app/**/*.{ts,tsx,js,jsx}",
    "components/**/*.{ts,tsx,js,jsx}",
    "features/**/*.{ts,tsx,js,jsx}",
    "lib/**/*.{ts,tsx,js,jsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],

  coveragePathIgnorePatterns: ["/node_modules/", "/.next/", "/coverage/"],
};

export default createJestConfig(config);
