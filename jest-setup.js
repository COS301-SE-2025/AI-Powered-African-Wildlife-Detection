// Manual React Native environment setup without using the problematic preset
// import { configure } from '@testing-library/react-native';

// Configure testing library
// configure({
//   setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
// });

// Setup global environment
global.__DEV__ = true;
global.__TEST__ = true;

// Mock React Native modules manually with safer approach
jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

// Alternative mock for NativeAnimatedHelper
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({}), {
  virtual: true,
});

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  Version: '14.0',
  select: jest.fn((obj) => obj.ios || obj.default),
}), { virtual: true });

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 667 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}), { virtual: true });

// Mock Alert
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}), { virtual: true });

// Mock Linking
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(() => Promise.resolve()),
  canOpenURL: jest.fn(() => Promise.resolve(true)),
  getInitialURL: jest.fn(() => Promise.resolve(null)),
}), { virtual: true });

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
  getAllKeys: jest.fn(() => Promise.resolve([])),
  multiGet: jest.fn(() => Promise.resolve([])),
  multiSet: jest.fn(() => Promise.resolve()),
  multiRemove: jest.fn(() => Promise.resolve()),
}));

// Mock React Native Gesture Handler
jest.mock('react-native-gesture-handler', () => {
  const React = require('react');
  const View = require('react-native/Libraries/Components/View/View');
  
  return {
    Swipeable: View,
    DrawerLayout: View,
    State: {
      UNDETERMINED: 0,
      FAILED: 1,
      BEGAN: 2,
      CANCELLED: 3,
      ACTIVE: 4,
      END: 5,
    },
    ScrollView: View,
    Slider: View,
    Switch: View,
    TextInput: View,
    ToolbarAndroid: View,
    ViewPagerAndroid: View,
    DrawerLayoutAndroid: View,
    WebView: View,
    NativeViewGestureHandler: View,
    TapGestureHandler: View,
    FlingGestureHandler: View,
    ForceTouchGestureHandler: View,
    LongPressGestureHandler: View,
    PanGestureHandler: View,
    PinchGestureHandler: View,
    RotationGestureHandler: View,
    RawButton: View,
    BaseButton: View,
    RectButton: View,
    BorderlessButton: View,
    FlatList: View,
    gestureHandlerRootHOC: jest.fn((component) => component),
    Directions: {
      RIGHT: 1,
      LEFT: 2,
      UP: 4,
      DOWN: 8,
    },
  };
});

// Mock Expo modules
jest.mock('expo-modules-core', () => ({
  NativeModulesProxy: {},
  EventEmitter: jest.fn(),
  requireNativeViewManager: jest.fn(() => ({})),
}));

// Mock common React Native components
jest.mock('react-native/Libraries/Components/StatusBar/StatusBar', () => 'StatusBar');

// Suppress console warnings during tests
const originalConsoleWarn = console.warn;
const originalConsoleError = console.error;

console.warn = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    (args[0].includes('Animated: `useNativeDriver`') ||
     args[0].includes('VirtualizedLists should never be nested') ||
     args[0].includes('componentWillReceiveProps') ||
     args[0].includes('componentWillMount'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};

console.error = (...args) => {
  if (
    args[0] &&
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalConsoleError(...args);
};