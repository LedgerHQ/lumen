import { Box } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { Slot, useSegments } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FULL_SCREEN_BLOCKS = new Set(['TabBars']);

export default function BlocksLayout() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const segments = useSegments();
  const slug = segments[segments.length - 1] ?? '';

  if (FULL_SCREEN_BLOCKS.has(slug)) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.bg.canvas }}>
        <Slot />
      </View>
    );
  }

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
