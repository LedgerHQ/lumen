import { Box, IconButton, Text } from '@ledgerhq/lumen-ui-rnative';
import { useTheme } from '@ledgerhq/lumen-ui-rnative/styles';
import { ArrowLeft, Moon, Sun } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useRouter } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeControls } from '../hooks/useThemeControls';

export const Header = ({ title }: { title?: string }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const { colorScheme, setColorScheme } = useThemeControls();
  const router = useRouter();

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
          {title ? (
            <>
              <IconButton
                appearance='no-background'
                accessibilityLabel='Back'
                icon={ArrowLeft}
                onPress={() => router.back()}
              />
              <Text typography='heading4SemiBold' lx={{ color: 'base' }}>
                {title}
              </Text>
            </>
          ) : null}
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
