module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    coverageReporters: ['json', 'html'],
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,
        },
    },
    testPathIgnorePatterns: ['\\.test-d\\.'],
    testMatch: ['<rootDir>/src/**/*.test.ts'],
};
