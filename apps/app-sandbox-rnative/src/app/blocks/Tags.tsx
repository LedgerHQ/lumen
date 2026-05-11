import type { TagProps } from '@ledgerhq/lumen-ui-rnative';
import { Box, Tag, useStyleSheet } from '@ledgerhq/lumen-ui-rnative';
import { ExternalLink } from '@ledgerhq/lumen-ui-rnative/symbols';

export const Tags = () => {
  const styles = useStyles();

  type Appearance = NonNullable<TagProps['appearance']>;
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
          <Tag appearance={app} label='Accent' icon={ExternalLink} />
        ))}
        <Tag label='Disabled' icon={ExternalLink} disabled />
      </Box>
      <Box style={styles.block}>
        <Tag appearance='base' label='Base' size='md' />
        <Tag appearance='base' label='Base' size='sm' />
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
