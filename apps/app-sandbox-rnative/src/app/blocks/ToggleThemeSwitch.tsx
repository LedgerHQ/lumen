import { Box, Switch, Text } from '@ledgerhq/lumen-ui-rnative';
import type { ColorSchemeName } from 'react-native';

export const ToggleThemeSwitch = ({
  colorScheme,
  setColorScheme,
}: {
  colorScheme: ColorSchemeName;
  setColorScheme: (colorScheme: ColorSchemeName) => void;
}) => {
  return (
    <Box lx={{ flexDirection: 'row', gap: 's8' }}>
      <Text typography='body3' lx={{ color: 'base' }}>
        Dark mode
      </Text>
      <Switch
        checked={colorScheme === 'dark'}
        onCheckedChange={() =>
          setColorScheme(colorScheme === 'dark' ? 'light' : 'dark')
        }
      />
    </Box>
  );
};
