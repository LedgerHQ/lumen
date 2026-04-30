import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import type { TrendProps } from './types';

type TrendVariant = 'positive' | 'negative';

export function Trend({ value, size = 'md', lx = {}, ...props }: TrendProps) {
  // TODO: potentially handle neutral as well
  const variant = value > 0 ? 'positive' : 'negative';
  const styles = useStyles({ size, variant });

  return (
    <Box lx={lx} style={styles.container} {...props}>
      <Text>{value}</Text>
    </Box>
  );
}

const useStyles = ({
  variant,
}: {
  size: TrendProps['size'];
  variant: TrendVariant;
}) =>
  useStyleSheet((t) => {
    const color = {
      positive: t.colors.text.success,
      negative: t.colors.text.error,
    }[variant];

    return {
      container: {
        flexDirection: 'row',
      },
      text: {
        color,
      },
    };
  }, []);
