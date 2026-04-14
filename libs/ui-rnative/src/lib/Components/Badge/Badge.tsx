import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import { BadgeProps } from './types';

export function Badge({
  value,
  size,
  appearance = 'base',
  disabled: disabledProp = false,
  lx,
  style,
}: BadgeProps) {
  const disabled = useDisabledContext({
    consumerName: 'CardButton',
    mergeWith: { disabled: disabledProp },
  });

  const styles = useStyles({ size, appearance, disabled });

  return (
    <Box lx={lx} style={[styles.container, style]}>
      <Text>{value}</Text>
    </Box>
  );
}

const useStyles = ({
  size,
  appearance = 'base',
  disabled = false,
}: {
  size: BadgeProps['size'];
  appearance: BadgeProps['appearance'];
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeMap = {
        md: {
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s2,
        },
        sm: {
          paddingHorizontal: t.spacings.s4,
        },
        xs: {
          height: t.sizes.s8,
          aspectRatio: 1,
        },
      };

      const bgColorMap = {
        base: t.colors.bg.interactive,
        red: t.colors.bg.errorStrong,
      };

      return {
        container: {
          ...sizeMap[size],
          backgroundColor: disabled
            ? t.colors.bg.disabled
            : bgColorMap[appearance],
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: t.borderRadius.full,
        },
      };
    },
    [size, appearance],
  );
};
