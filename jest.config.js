const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^littlefish-nft-auth-framework/backend$': '<rootDir>/node_modules/littlefish-nft-auth-framework/dist/backend',
    '^littlefish-nft-auth-framework/frontend$': '<rootDir>/node_modules/littlefish-nft-auth-framework/dist/frontend',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
};

module.exports = createJestConfig(customJestConfig);