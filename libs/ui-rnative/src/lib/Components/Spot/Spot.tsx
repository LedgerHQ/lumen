import { useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import { LumenTypographyTokens, useStyleSheet } from '../../../styles';
import {
  BluetoothCircleFill,
  CheckmarkCircleFill,
  DeleteCircleFill,
  InformationFill,
  WarningFill,
} from '../../Symbols';
import { IconSize } from '../Icon/types';
import { Spinner, SpinnerProps } from '../Spinner';
import { Box } from '../Utility';
import { SpotAppearance, SpotProps, SpotSize } from './types';

const BLUETOOTH_COLOR = '#0082FC';

const iconSizeMap: Record<SpotSize, IconSize> = {
  32: 12,
  40: 16,
  48: 20,
  56: 24,
  72: 40,
};

const spotSizeMap: Record<SpotSize, number> = {
  32: 32,
  40: 40,
  48: 48,
  56: 56,
  72: 72,
};

const numberTypographyMap: Record<SpotSize, keyof LumenTypographyTokens> = {
  32: 'body2SemiBold',
  40: 'body1SemiBold',
  48: 'heading5',
  56: 'heading4',
  72: 'heading2',
};

const useStyles = ({
  size,
  appearance,
  disabled,
}: {
  size: SpotSize;
  appearance: SpotAppearance;
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const colorMap: Record<SpotAppearance, string> = {
        icon: t.colors.text.base,
        bluetooth: BLUETOOTH_COLOR,
        check: t.colors.text.success,
        error: t.colors.text.error,
        warning: t.colors.text.warning,
        info: t.colors.text.muted,
        loader: t.colors.text.base,
        number: t.colors.text.base,
      };

      const spotSize = spotSizeMap[size];
      const typography = t.typographies[numberTypographyMap[size]];
      const contentColor = disabled
        ? t.colors.text.disabled
        : colorMap[appearance];

      return {
        root: {
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: t.borderRadius.full,
          backgroundColor: t.colors.bg.mutedTransparent,
          width: spotSize,
          height: spotSize,
        },
        icon: {
          color: contentColor,
        },
        numberText: StyleSheet.flatten([
          typography,
          {
            color: contentColor,
          },
        ]),
      };
    },
    [size, appearance, disabled],
  );
};

/**
 * A circular status indicator component that displays different types of content based on appearance.
 *
 * Uses a discriminated union type system where the required props depend on the `appearance` value:
 * - `'icon'` appearance requires an `icon` prop
 * - `'number'` appearance requires a `number` prop
 * - All other appearances are self-contained
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_media-graphics-spot--docs Storybook}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the spot's core appearance (colors, size, etc). Use the `appearance` prop instead.
 *
 * @example
 * import { Spot } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Custom icon spot
 * import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <Spot appearance="icon" icon={Settings} />
 *
 * // Number spot
 * <Spot appearance="number" number={5} />
 *
 * // Status indicators (no additional props needed)
 * <Spot appearance="check" />
 * <Spot appearance="error" />
 * <Spot appearance="warning" />
 * <Spot appearance="loader" />
 *
 * // Bluetooth states
 * <Spot appearance="bluetooth" />
 * <Spot appearance="bluetooth" disabled />
 */
export const Spot = (props: SpotProps) => {
  const {
    appearance,
    disabled = false,
    size = 48,
    lx = {},
    style,
    ...rest
  } = props;
  const styles = useStyles({ size, appearance, disabled });
  const calculatedIconSize = iconSizeMap[size];

  const content = useMemo(() => {
    switch (props.appearance) {
      case 'icon': {
        const { icon: Icon } = props;
        return <Icon size={calculatedIconSize} style={styles.icon} />;
      }
      case 'number': {
        return <Text style={styles.numberText}>{props.number}</Text>;
      }
      case 'bluetooth':
        return (
          <BluetoothCircleFill size={calculatedIconSize} style={styles.icon} />
        );
      case 'check':
        return (
          <CheckmarkCircleFill size={calculatedIconSize} style={styles.icon} />
        );
      case 'error':
        return (
          <DeleteCircleFill size={calculatedIconSize} style={styles.icon} />
        );
      case 'warning':
        return <WarningFill size={calculatedIconSize} style={styles.icon} />;
      case 'info':
        return (
          <InformationFill size={calculatedIconSize} style={styles.icon} />
        );
      case 'loader':
        return (
          <Spinner
            size={calculatedIconSize}
            color={styles.icon.color as SpinnerProps['color']}
          />
        );
    }
  }, [props, calculatedIconSize, styles.icon, styles.numberText]);

  return (
    <Box
      testID='spot-container'
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...rest}
    >
      {content}
    </Box>
  );
};
