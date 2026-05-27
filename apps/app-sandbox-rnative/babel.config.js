module.exports = {
  presets: [['babel-preset-expo', { reanimated: false }]],
  plugins: [
    // Note: react-native-worklets/plugin must be listed LAST
    'react-native-worklets/plugin',
  ],
};
