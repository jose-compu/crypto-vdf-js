/** @type {import('jest').Config} */
const base = require('./jest.config.js');

module.exports = {
  ...base,
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/tests/manual/', '\\.slow\\.test\\.ts$'],
  testTimeout: 60000,
  testMatch: [
    '<rootDir>/tests/classgroup.test.ts',
    '<rootDir>/tests/golden-vectors.test.ts',
  ],
};
