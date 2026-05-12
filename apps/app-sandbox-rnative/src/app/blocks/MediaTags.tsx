import CryptoIcon from '@ledgerhq/crypto-icons/native';
import type { MediaTagProps } from '@ledgerhq/lumen-ui-rnative';
import {
  Box,
  MediaImage,
  MediaTag,
  useStyleSheet,
} from '@ledgerhq/lumen-ui-rnative';

export const MediaTags = () => {
  const styles = useStyles();

  const icons = [
    <MediaImage
      src='https://crypto-icons.ledger.com/ETH.png'
      alt='Ethereum'
      size={16}
      shape='square'
    />,
    <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />,
  ];

  type Appearance = NonNullable<MediaTagProps['appearance']>;
  const appearances: Appearance[] = [
    'accent',
    'accent-subtle',
    'base',
    'gray',
    'success',
    'error',
    'warning',
  ];

  return (
    <Box style={styles.container}>
      <Box style={styles.block}>
        {appearances.map((app) => (
          <MediaTag key={app} appearance={app} label={app} icon={icons[0]} />
        ))}
        <MediaTag label='disabled' icon={icons[0]} disabled />
      </Box>
      <Box style={styles.block}>
        {appearances.map((app) => (
          <MediaTag key={app} appearance={app} label={app} icon={icons[1]} />
        ))}
        <MediaTag label='disabled' icon={icons[1]} disabled />
      </Box>
      <Box style={styles.block}>
        <MediaTag
          appearance='base'
          label='medium'
          size='md'
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={16} />}
        />
        <MediaTag
          appearance='base'
          label='small'
          size='sm'
          // Figma mock uses 12px size for CryptoIcon, but size is type-restricted
          // to sizes > 16. Chose to cast to 16 to make typecheck happy.
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={12 as 16} />}
        />
      </Box>
    </Box>
  );
};

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        gap: t.spacings.s32,
      },
      block: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: t.spacings.s8,
      },
    }),
    [],
  );
