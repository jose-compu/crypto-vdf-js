/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  // CI and default `npm run test:unit` — only these three files (see package.json)
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/tests/manual/',
    '\\.slow\\.test\\.ts$',
    'golden-vectors\\.test\\.ts$',
    'classgroup\\.test\\.ts$',
  ],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts', '!src/**/index.ts'],
  testTimeout: 3000,
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: { target: 'ES2020' },
      },
    ],
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  maxWorkers: 1,
  // Avoid Jest waiting on open handles after fast tests
  forceExit: true,
  detectOpenHandles: false,
};
