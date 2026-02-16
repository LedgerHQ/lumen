import { View, ViewProps } from 'react-native';

/**
 * Mock BlurView for web/storybook
 * @sbaiahmed1/react-native-blur doesn't work on web, so we use a simple View
 */
export const BlurView = (
  props: ViewProps & {
    blurAmount?: number;
    blurType?: string;
    overlayColor?: string;
  },
) => {
  const {
    blurAmount: _blurAmount,
    blurType: _blurType,
    overlayColor: _overlayColor,
    ...restProps
  } = props;
  return <View {...restProps} />;
};
