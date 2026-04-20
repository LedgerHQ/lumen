import { Box, IconButton, Text } from '@ledgerhq/lumen-ui-rnative';
import { ArrowLeft, Moon, Sun } from '@ledgerhq/lumen-ui-rnative/symbols';
import type { ColorSchemeName } from 'react-native';
import { useSandboxContext } from './SandboxContext';

export const SandboxTopBar = ({
  colorScheme,
  setColorScheme,
}: {
  colorScheme: ColorSchemeName;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
}) => {
  const { active, setIsActive } = useSandboxContext();

  return (
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
  );
};
