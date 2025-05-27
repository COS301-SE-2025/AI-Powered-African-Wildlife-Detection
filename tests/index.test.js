// Ultra minimal test to verify Jest setup
//describe('Basic Jest Test', () => {
  //it('should perform basic arithmetic', () => {
    //expect(2 + 2).toBe(4);
  //});
  

  it('should have DEV environment', () => {
    expect(global.__DEV__).toBeTruthy();
  });


// Test React Native components only after basic setup works
describe('React Native Tests', () => {
  it('should import React Native components', () => {
    const { Text, View } = require('react-native');
    expect(Text).toBeDefined();
    expect(View).toBeDefined();
  });
});