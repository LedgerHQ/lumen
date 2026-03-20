module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
    // Note: react-native-worklets/plugin must be listed LAST
    'react-native-worklets/plugin',
  ],
};
