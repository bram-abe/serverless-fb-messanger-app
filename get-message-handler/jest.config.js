module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/test-module/test-case.js"],
  transform:{
    "\\.[jt]sx?$": "babel-jest"
  }
};
