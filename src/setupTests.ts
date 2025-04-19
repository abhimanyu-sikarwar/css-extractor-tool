// src/setupTests.ts

// Add Jest extended matchers
import '@testing-library/jest-dom';

// Mock global objects that might not be available in the test environment
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

// Mock browser features
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Create a mock for the clipboard API
const mockClipboard = {
    writeText: jest.fn(() => Promise.resolve()),
};

// Assign the mock to navigator.clipboard
Object.defineProperty(global.navigator, 'clipboard', {
    writable: true,
    value: mockClipboard,
});

// Mock for fetch API
global.fetch = jest.fn();

// Mock console.error to catch rendering errors
// const originalError = console.error;
// console.error = (...args) => {
//     // Check if the error is coming from React
//     if (/Warning.*not wrapped in act/.test(args[0])) {
//         return;
//     }
//     originalError(...args);
// };

// Reset all mocks after each test
afterEach(() => {
    jest.clearAllMocks();
});