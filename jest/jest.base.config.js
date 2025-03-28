module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '../',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)s$': '@swc/jest',
  },
  moduleNameMapper: {
    "@app/(.*)": "<rootDir>/src/$1",
    "@app": '<rootDir>/src',
    '@libs/common/(.*)': '<rootDir>/libs/common/src/$1',
    '@libs/common': '<rootDir>/libs/common/src',
    '@libs/ddd/(.*)': '<rootDir>/libs/ddd/src/$1',
    '@libs/ddd': '<rootDir>/libs/ddd/src',
    '@libs/cqrs/(.*)': '<rootDir>/libs/cqrs/src/$1',
    '@libs/cqrs': '<rootDir>/libs/cqrs/src',
    '@libs/testing/(.*)': '<rootDir>/libs/testing/src/$1',
    '@libs/testing': '<rootDir>/libs/testing/src'
  },
}