import { Box, Pulse, Spin, Text } from '@ledgerhq/lumen-ui-rnative';
import { View } from 'react-native';

export const Animations = () => {
  return (
    <Box lx={{ gap: 's32' }}>
      <Box lx={{ gap: 's12' }}>
        <Text typography='body2SemiBold'>Spin</Text>
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          <Spin timing={{ duration: 2000, easing: 'linear' }}>
            <Box
              lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }}
            />
          </Spin>
        </View>
      </Box>
      <Box lx={{ gap: 's12' }}>
        <Text typography='body2SemiBold'>Pulse</Text>
        <View style={{ flexDirection: 'row', gap: 24, alignItems: 'center' }}>
          <Pulse animate timing={{ duration: 1000, easing: 'linear' }}>
            <Box
              lx={{ width: 's48', height: 's48', backgroundColor: 'accent' }}
            />
          </Pulse>
        </View>
      </Box>
    </Box>
  );
};
