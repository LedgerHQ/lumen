import { Box, Switch, Text } from '@ledgerhq/lumen-ui-rnative';
import { useThemeControls } from '../../hooks/useThemeControls';

export default function ThemeProviderToggles() {
  const { locale, colorScheme, setLocale, setColorScheme } = useThemeControls();

  return (
    <Box lx={{ gap: 's12' }}>
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
      <Box lx={{ flexDirection: 'row', gap: 's8' }}>
        <Text typography='body3' lx={{ color: 'base' }}>
          FR
        </Text>
        <Switch
          checked={locale === 'en'}
          onCheckedChange={() => setLocale(locale === 'en' ? 'fr' : 'en')}
        />
        <Text typography='body3' lx={{ color: 'base' }}>
          EN
        </Text>
      </Box>
    </Box>
  );
}
