import { Box, Spin, Text } from '@ledgerhq/lumen-ui-rnative';
import { View } from 'react-native';

export const SpinBlock = () => {
  return (
    <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Spin timing={{ duration: 500, easing: 'linear' }}>
          <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
        </Spin>
        <Text typography='body4' lx={{ color: 'muted' }}>
          500ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Spin timing={{ duration: 1000, easing: 'linear' }}>
          <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
        </Spin>
        <Text typography='body4' lx={{ color: 'muted' }}>
          1000ms
        </Text>
      </View>
      <View style={{ alignItems: 'center', gap: 8 }}>
        <Spin timing={{ duration: 2000, easing: 'linear' }}>
          <Box lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }} />
        </Spin>
        <Text typography='body4' lx={{ color: 'muted' }}>
          2000ms
        </Text>
      </View>
    </View>
  );
};
