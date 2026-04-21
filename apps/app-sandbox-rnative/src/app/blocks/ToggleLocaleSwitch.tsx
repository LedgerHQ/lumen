import type { SupportedLocale } from '@ledgerhq/lumen-ui-rnative';
import { Box, Switch, Text } from '@ledgerhq/lumen-ui-rnative';

export const ToggleLocaleSwitch = ({
  locale,
  setLocale,
}: {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
}) => {
  return (
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
  );
};
