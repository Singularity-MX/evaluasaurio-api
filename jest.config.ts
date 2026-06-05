import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],

  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.strategy.ts',
    '!src/**/*.decorator.ts',
    '!src/**/*.dto.ts',
    '!src/**/*.entity.ts',
    '!src/**/*.interface.ts',
    '!src/**/*.enum.ts',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
  ],
  coverageReporters: [
    'text',
    'lcov',
    'html',
  ],
  testEnvironment: 'node',
};

export default config;