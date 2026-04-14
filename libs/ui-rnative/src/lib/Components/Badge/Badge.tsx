import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import { BadgeProps } from './types';

export function Badge({
  value,
  size,
  max = 99,
  appearance = 'base',
  disabled: disabledProp = false,
  lx,
  style,
}: BadgeProps) {
  const disabled = useDisabledContext({
    consumerName: 'Badge',
    mergeWith: { disabled: disabledProp },
  });

  const styles = useStyles({
    size,
    appearance,
    disabled,
  });

  const cappedMax = Math.min(max ?? 0, 99);

  return (
    <Box lx={lx} style={[styles.container, style]}>
      {size !== 'xs' && (
        <Text style={styles.text} allowFontScaling={false}>
          {value <= cappedMax ? value : `${cappedMax}+`}
        </Text>
      )}
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
          minWidth: t.sizes.s24,
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s2,
        },
        sm: {
          minWidth: t.sizes.s16,
          paddingHorizontal: t.spacings.s4,
        },
        xs: {
          height: t.sizes.s8,
          aspectRatio: 1,
        },
      };

      const bgColorMap = {
        base: { backgroundColor: t.colors.bg.interactive },
        red: { backgroundColor: t.colors.bg.errorStrong },
      };

      const textMap = {
        md: { ...t.typographies.body2SemiBold },
        sm: { ...t.typographies.body4SemiBold },
        xs: {},
      };

      const textColorMap = {
        base: { color: t.colors.text.onInteractive },
        red: { color: t.colors.text.onErrorStrong },
      };

      return {
        container: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: t.borderRadius.full,
          ...sizeMap[size],
          ...(disabled
            ? { backgroundColor: t.colors.bg.disabled }
            : { ...bgColorMap[appearance] }),
        },
        text: {
          ...textMap[size],
          ...(disabled
            ? { color: t.colors.text.disabled }
            : { ...textColorMap[appearance] }),
        },
      };
    },
    [size, appearance],
  );
};
