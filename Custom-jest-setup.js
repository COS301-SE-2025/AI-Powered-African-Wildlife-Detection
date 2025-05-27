// Minimal setup for React Native testing
import '@testing-library/jest-native/extend-expect';

// Global test environment
global.__DEV__ = true;

// Suppress warnings
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && args[0].includes && args[0].includes('useNativeDriver')) {
    return;
  }
  originalWarn(...args);
};