import { Box, Link, Text } from '@ledgerhq/lumen-ui-rnative';
import {
  Github,
  LedgerLogo,
  Screens,
} from '@ledgerhq/lumen-ui-rnative/symbols';
import { Alert } from 'react-native';

export function Links() {
  return (
    <Box lx={{ gap: 's8' }}>
      <Link href={'https://github.com/LedgerHQ/lumen'} icon={Github} isExternal>
        Set up Lumen in your project
      </Link>
      <Link
        appearance='accent'
        href={'https://www.ledger.com/'}
        isExternal
        underline={false}
        icon={LedgerLogo}
      >
        Open Ledger store
      </Link>
      <Link
        icon={Screens}
        size='sm'
        onPress={() =>
          Alert.alert(
            'Use your router here',
            'Our design system cannot assume a router (e.g., Expo Router, React Navigation).',
            [{ text: 'Okay' }],
          )
        }
      >
        Custom navigation
      </Link>
      <Box
        lx={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}
      >
        <Text typography='body3' lx={{ color: 'base' }}>
          If you require assistance, please contact us via our{' '}
        </Text>
        <Link size='sm' isExternal href='https://github.com/LedgerHQ/lumen'>
          support page
        </Link>
        <Text typography='body3' lx={{ color: 'base' }}>
          {' '}
          during business hours (9am-5pm).
        </Text>
      </Box>
    </Box>
  );
}
