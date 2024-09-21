const baseConfig = require('./jest.base.config');

module.exports = Object.assign(baseConfig, {
  testRegex: 'src/.*\\.e2e-spec\\.ts$',
  // setupFilesAfterEnv: [],
  setupFiles: ['<rootDir>/src/e2e-tests/jest.e2e-setup.ts'],
  globalSetup: '<rootDir>/src/containers/globalSetup.ts',
  globalTeardown: '<rootDir>/src/containers/teardown-containers.ts',
  testTimeout: 180000,
  watchPathIgnorePatterns: ['<rootDir>/node_modules/', '<rootDir>/coverage/'],
});

