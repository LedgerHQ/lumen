import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import type { DotIndicatorProps } from './types';

export function DotIndicator({
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
  appearance,
  disabled,
  pinned,
}: {
  appearance: NonNullable<DotIndicatorProps['appearance']>;
  disabled: boolean;
  pinned: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const bgColorMap = {
        base: { backgroundColor: t.colors.bg.interactive },
        negative: { backgroundColor: t.colors.bg.errorStrong },
      };

      return {
        container: {
          height: t.sizes.s8,
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
    [appearance, disabled, pinned],
  );
};
