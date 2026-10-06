import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, Text } from 'react-native';
import { Box } from '../../primitives';
import type { SpotNumberProps } from './types';
import { useSpotStyles } from './useSpotStyles';

/**
 * A circular digit. Uses the same palette, fill, and size as `Spot`.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-spot--docs Storybook}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the circle's core appearance (colors, size, etc). Use the `appearance` and `fill` props instead.
 *
 * @example
 * import { SpotNumber } from '@ledgerhq/lumen-ui-rnative';
 *
 * <SpotNumber value={9} />
 */
export const SpotNumber = ({
  appearance = 'base',
  fill = 'transparent',
  value,
  disabled: disabledProp = false,
  size = 48,
  lx = {},
  style,
  ...rest
}: SpotNumberProps) => {
  const disabled = useDisabledContext({
    consumerName: 'SpotNumber',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useSpotStyles({ size, appearance, fill, disabled });

  return (
    <Box
      testID='spot-number'
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...rest}
    >
      <Text style={styles.numberText} allowFontScaling={false}>
        {value}
      </Text>
    </Box>
  );
};
