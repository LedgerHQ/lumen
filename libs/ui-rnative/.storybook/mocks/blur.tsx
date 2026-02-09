import { View, ViewProps } from 'react-native';

/**
 * Mock BlurView for web/storybook
 * @react-native-community/blur doesn't work on web, so we use a simple View
 */
export const BlurView = (props: ViewProps & { blurAmount?: number }) => {
  const { blurAmount: _blurAmount, ...restProps } = props;
  return <View {...restProps} />;
};
