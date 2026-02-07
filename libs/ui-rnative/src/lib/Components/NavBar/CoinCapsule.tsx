import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import { CoinCapsuleProps } from './types';

export function CoinCapsule({ ticker, icon }: CoinCapsuleProps) {
  const styles = useStyles();

  return (
    <Box style={styles.container}>
      {icon}
      <Text style={styles.text}>{ticker}</Text>
    </Box>
  );
}

CoinCapsule.displayName = 'CoinCapsule';

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      container: {
        flexDirection: 'row',
        gap: t.spacings.s8,
        padding: t.spacings.s8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: t.borderRadius.full,
        backgroundColor: t.colors.bg.mutedTransparent,
      },
      text: {
        ...t.typographies.body1,
        color: t.colors.text.base,
      },
    }),
    [],
  );
