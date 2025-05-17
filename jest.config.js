export default {
  preset: "@shelf/jest-mongodb",
  testEnvironment: "node",
  globals: {
    __MONGO_DB_NAME__: "jest",
  },
  transform: {},

  moduleFileExtensions: ["js", "mjs", "json"],

  testMatch: ["<rootDir>/tests/**/*.test.js"],
};
