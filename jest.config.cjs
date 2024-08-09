// jest.config.js
module.exports = {
    preset: 'ts-jest/presets/default-esm',
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      '^.+\\.svelte$': 'svelte-jester',
      '^.+\\.[tj]s$': 'babel-jest',
    },
    moduleFileExtensions: ['js', 'ts', 'svelte'],
    setupFilesAfterEnv: ['@testing-library/jest-dom'],
    extensionsToTreatAsEsm: ['.ts', '.svelte'],
    moduleNameMapper: {
      '^\\$lib/(.*)$': '<rootDir>/src/lib/$1', // Adjust this based on your project structure
    },
  };

