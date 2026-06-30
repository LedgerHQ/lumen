import { Box } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Slot } from 'expo-router';
import { ScrollView } from 'react-native';

export default function BlocksLayout() {
  const { theme } = useTheme();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior='automatic'
      style={{
        height: '100%',
        backgroundColor: theme.colors.bg.canvas,
        paddingHorizontal: theme.spacings.s16,
      }}
    >
      <Box
        lx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 's12',
          paddingVertical: 's40',
        }}
      >
        <Slot />
      </Box>
    </ScrollView>
  );
}
