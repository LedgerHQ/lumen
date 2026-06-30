import { Box, IconButton, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { ArrowLeft, Moon, Sun } from '@ledgerhq/lumen-ui-rnative/symbols';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSandboxContext } from '../../contexts/SandboxContext';
import { useThemeControls } from '../../hooks/useThemeControls';

export const SandboxHeader = () => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useThemeControls();
  const { active, setIsActive } = useSandboxContext();

  return (
    <View
      style={{
        paddingTop: insets.top,
        paddingHorizontal: theme.spacings.s16,
        backgroundColor: theme.colors.bg.canvas,
      }}
    >
      <Box
        lx={{
          width: 'full',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's8' }}>
          {active && (
            <IconButton
              appearance='no-background'
              accessibilityLabel='Back'
              icon={ArrowLeft}
              onPress={() => setIsActive('')}
            />
          )}
          <Text typography='heading4SemiBold' lx={{ color: 'base' }}>
            {active}
          </Text>
        </Box>
        <IconButton
          lx={{ flexGrow: 0 }}
          appearance='no-background'
          accessibilityLabel='Toggle theme color scheme'
          icon={colorScheme === 'dark' ? Sun : Moon}
          onPress={() => {
            setColorScheme(colorScheme === 'dark' ? 'light' : 'dark');
          }}
        />
      </Box>
    </View>
  );
};
