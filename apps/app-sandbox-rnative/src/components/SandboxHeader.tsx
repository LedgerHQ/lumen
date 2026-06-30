import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SandboxTopBar } from './SandboxTopBar';
import { useThemeControls } from './ThemeControls';

/**
 * Custom header used by the expo-router Stack. It reuses the sandbox top bar
 * (active block title + back button + theme toggle) and adds the top safe-area
 * inset and the canvas background so it blends with the screen content.
 */
export const SandboxHeader = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useThemeControls();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingHorizontal: theme.spacings.s16,
        backgroundColor: theme.colors.bg.canvas,
      }}
    >
      <SandboxTopBar
        colorScheme={colorScheme}
        setColorScheme={setColorScheme}
      />
    </View>
  );
};
