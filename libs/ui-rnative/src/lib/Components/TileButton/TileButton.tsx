import {
  isTextChildren,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import type { FC, PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import type { IconSize } from '../Icon';
import { Pressable, Text } from '../Utility';
import type { TileButtonProps } from './types';

const ICON_SIZE: IconSize = 20;

const useRootStyles = ({ isFull }: { isFull: boolean }) => {
  return useStyleSheet(
    (t) => ({
      root: {
        width: isFull ? t.sizes.full : 'auto',
      },
    }),
    [isFull],
  );
};

const useStyles = ({
  disabled,
  pressed,
  isFull,
  appearance,
}: {
  disabled: boolean;
  pressed: boolean;
  isFull: boolean;
  appearance: 'gray' | 'red';
}) => {
  return useStyleSheet(
    (t) => {
      const foregroundColors: Record<'gray' | 'red', string> = {
        gray: t.colors.text.base,
        red: t.colors.text.error,
      };
      const foregroundColor = disabled
        ? t.colors.text.disabled
        : foregroundColors[appearance];

      return {
        container: StyleSheet.flatten([
          {
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: t.spacings.s8,
            padding: t.spacings.s12,
            borderRadius: t.borderRadius.md,
            backgroundColor: t.colors.bg.surface,
          },
          isFull && { width: t.sizes.full },
          pressed &&
            !disabled && {
              backgroundColor: t.colors.bg.surfacePressed,
            },
          disabled && { backgroundColor: t.colors.bg.disabled },
        ]),
        label: StyleSheet.flatten([
          t.typographies.body2SemiBold,
          {
            textAlign: 'center',
            color: foregroundColor,
          },
        ]),
        icon: {
          flexShrink: 0,
          color: foregroundColor,
        },
      };
    },
    [disabled, pressed, isFull, appearance],
  );
};

/**
 * A compact button component displaying an icon above a label in a vertical layout.
 * Ideal for grids, toolbars, or quick action menus.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-tilebutton--docs Storybook}
 *
 * @example
 * import { TileButton } from '@ledgerhq/lumen-ui-rnative';
 * import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <TileButton icon={Settings} onPress={() => console.log('pressed')}>
 *   Settings
 * </TileButton>
 */
export const TileButton = ({
  lx,
  style,
  icon: IconProp,
  children,
  disabled: disabledProp = false,
  isFull = false,
  appearance = 'gray',
  numberOfLines = 2,
  ...props
}: TileButtonProps) => {
  const disabled = useDisabledContext({
    consumerName: 'TileButton',
    mergeWith: { disabled: disabledProp },
  });
  const rootStyles = useRootStyles({ isFull });

  return (
    <Pressable
      lx={lx}
      style={StyleSheet.flatten([style, rootStyles.root])}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      {...props}
    >
      {({ pressed }) => (
        <TileButtonContent
          disabled={disabled}
          pressed={pressed}
          isFull={isFull}
          appearance={appearance}
          IconProp={IconProp}
          numberOfLines={numberOfLines}
        >
          {children}
        </TileButtonContent>
      )}
    </Pressable>
  );
};

type TileButtonContentProps = PropsWithChildren<{
  disabled: boolean;
  pressed: boolean;
  isFull: boolean;
  appearance: 'gray' | 'red';
  IconProp: TileButtonProps['icon'];
  numberOfLines?: number;
}>;

const TileButtonContent: FC<TileButtonContentProps> = ({
  disabled,
  pressed,
  isFull,
  appearance,
  IconProp,
  numberOfLines,
  children,
}) => {
  const styles = useStyles({ disabled, pressed, isFull, appearance });

  return (
    <View style={styles.container} testID='tile-button-content'>
      <IconProp size={ICON_SIZE} style={styles.icon} />
      {isTextChildren(children) ? (
        <Text style={styles.label} numberOfLines={numberOfLines}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
};
