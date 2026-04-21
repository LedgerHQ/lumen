import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import { DotCountProps } from './types';

export function DotCount({
  value,
  size,
  max = 99,
  appearance = 'base',
  disabled: disabledProp = false,
  lx,
  style,
  children,
  ref,
  ...props
}: DotCountProps) {
  const disabled = useDisabledContext({
    consumerName: 'DotCount',
    mergeWith: { disabled: disabledProp },
  });

  const styles = useStyles({
    size,
    appearance,
    disabled,
    pinned: !!children,
  });

  const cappedMax = Math.max(1, Math.min(max, 99));

  return (
    <Box ref={ref} lx={lx} style={style} {...props}>
      <Box style={styles.container}>
        {value > 0 && (
          <Text style={styles.text} allowFontScaling={false}>
            {value <= cappedMax ? value : `${cappedMax}+`}
          </Text>
        )}
      </Box>
      {children}
    </Box>
  );
}

const useStyles = ({
  size,
  appearance = 'base',
  disabled = false,
  pinned,
}: {
  size: DotCountProps['size'];
  appearance: DotCountProps['appearance'];
  disabled: boolean;
  pinned: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeMap = {
        md: {
          minWidth: t.sizes.s24,
          minHeight: t.sizes.s24,
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s2,
        },
        sm: {
          minHeight: t.sizes.s16,
          minWidth: t.sizes.s16,
          paddingHorizontal: t.spacings.s4,
        },
      };

      const bgColorMap = {
        base: { backgroundColor: t.colors.bg.interactive },
        red: { backgroundColor: t.colors.bg.errorStrong },
      };

      const textMap = {
        md: { ...t.typographies.body2SemiBold },
        sm: { ...t.typographies.body4SemiBold },
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
          ...(pinned && {
            position: 'absolute',
            top: t.spacings.s0,
            right: t.spacings.s0,
            zIndex: 1,
          }),
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
    [size, appearance, disabled, pinned],
  );
};
