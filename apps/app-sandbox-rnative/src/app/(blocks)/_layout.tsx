import { Box } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Slot } from 'expo-router';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BlocksLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior='automatic'
      style={{
        flex: 1,
        backgroundColor: theme.colors.bg.canvas,
        paddingHorizontal: theme.spacings.s16,
      }}
      contentContainerStyle={{
        paddingTop: theme.spacings.s16,
        paddingBottom: insets.bottom + theme.spacings.s16,
      }}
    >
      <Box
        lx={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 's12',
        }}
      >
        <Slot />
      </Box>
    </ScrollView>
  );
}
