module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',
  
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/__tests__/**/*.test.js',
    '**/__tests__/**/*.spec.js',
    '**/__tests__/**/*.integration.test.js',
    '**/__tests__/**/*.e2e.test.js'
  ],
  
  // An array of regexp pattern strings that are matched against all test paths
  // matched tests are skipped
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  
  // Indicates whether each individual test should be reported during the run
  verbose: true,
  
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/',
    '/logs/'
  ],
  
  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],
  
  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',
  
  // A map from regular expressions to module names that allow to stub out resources
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1'
  },
  
  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>'
  ],
  
  // The test runner to use
  testRunner: 'jest-circus/runner',
  
  // A map from regular expressions to paths to transformers
  transform: {
    '^.+\\.js$': 'babel-jest'
  }
};
