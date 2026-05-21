// Minimal react-native mock for Jest unit tests that only need Dimensions
module.exports = {
  Dimensions: {
    get: () => ({ width: 390, height: 844 })
  },
  Platform: { OS: 'android', select: obj => obj.android || obj.default },
  // stub other commonly referenced APIs if needed
  StatusBar: { currentHeight: 0 }
};
