import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import type { DotIndicatorProps } from './types';

export function DotIndicator({
  size = 'sm',
  appearance = 'base',
  disabled: disabledProp = false,
  lx = {},
  style,
  children,
  accessibilityLabel,
  ref,
  ...props
}: DotIndicatorProps) {
  const disabled = useDisabledContext({
    consumerName: 'DotIndicator',
    mergeWith: { disabled: disabledProp },
  });

  const styles = useStyles({
    size,
    appearance,
    disabled,
    pinned: !!children,
  });

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([
        children ? { position: 'relative' } : undefined,
        style,
      ])}
      {...props}
    >
      <Box
        style={styles.container}
        accessibilityRole='image'
        accessibilityLabel={accessibilityLabel}
        pointerEvents='none'
      />
      {children}
    </Box>
  );
}

const useStyles = ({
  size,
  appearance,
  disabled,
  pinned,
}: {
  size: NonNullable<DotIndicatorProps['size']>;
  appearance: NonNullable<DotIndicatorProps['appearance']>;
  disabled: boolean;
  pinned: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const sizeMap = {
        xs: t.sizes.s10,
        sm: t.sizes.s12,
        md: t.sizes.s16,
      };

      const bgColorMap = {
        base: { backgroundColor: t.colors.bg.interactive },
        negative: { backgroundColor: t.colors.bg.errorStrong },
      };

      return {
        container: {
          height: sizeMap[size],
          aspectRatio: 1,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: t.borderRadius.full,
          ...(pinned && {
            position: 'absolute',
            top: t.spacings.s0,
            right: t.spacings.s0,
            zIndex: 1,
          }),
          ...(disabled
            ? { backgroundColor: t.colors.bg.disabled }
            : { ...bgColorMap[appearance] }),
        },
      };
    },
    [size, appearance, disabled, pinned],
  );
};
