import type { ViewProps } from 'react-native';
import { View } from 'react-native';

const LottieView = ({ style, testID }: ViewProps) => (
  <View style={style} testID={testID} />
);

export default LottieView;
