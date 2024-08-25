const baseConfig = require('./jest.base.config');

module.exports = Object.assign(baseConfig, {
  testRegex: '.*\\.spec\\.ts$',
  setupFiles: ['<rootDir>/src/unit-tests/jest.unit-setup.ts'],
});
