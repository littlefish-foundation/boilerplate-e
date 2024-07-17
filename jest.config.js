const path = require('path');

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
        '^littlefish-nft-auth-framework/backend$': path.join(__dirname, 'node_modules/littlefish-nft-auth-framework/dist/backend'),
      },
    moduleDirectories: ['node_modules', '<rootDir>'],

};