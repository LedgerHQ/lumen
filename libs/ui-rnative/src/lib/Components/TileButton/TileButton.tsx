import { isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { FC, PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { IconSize } from '../Icon';
import { Pressable, Text } from '../Utility';
import { TileButtonProps } from './types';

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
}: {
  disabled: boolean;
  pressed: boolean;
  isFull: boolean;
}) => {
  return useStyleSheet(
    (t) => ({
      container: StyleSheet.flatten([
        {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: t.spacings.s8,
          padding: t.spacings.s12,
          borderRadius: t.borderRadius.md,
          backgroundColor: t.colors.bg.muted,
        },
        isFull && { width: t.sizes.full },
        pressed && !disabled && { backgroundColor: t.colors.bg.mutedPressed },
        disabled && { backgroundColor: t.colors.bg.disabled },
      ]),
      label: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          textAlign: 'center',
          color: disabled ? t.colors.text.disabled : t.colors.text.base,
        },
      ]),
      icon: {
        flexShrink: 0,
        color: disabled ? t.colors.text.disabled : t.colors.text.base,
      },
    }),
    [disabled, pressed, isFull],
  );
};

/**
 * A compact button component displaying an icon above a label in a vertical layout.
 * Ideal for grids, toolbars, or quick action menus.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/react-native_action-tilebutton--docs Storybook}
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
  disabled = false,
  isFull = false,
  numberOfLines = 2,
  ...props
}: TileButtonProps) => {
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
  IconProp: TileButtonProps['icon'];
  numberOfLines?: number;
}>;

const TileButtonContent: FC<TileButtonContentProps> = ({
  disabled,
  pressed,
  isFull,
  IconProp,
  numberOfLines,
  children,
}) => {
  const styles = useStyles({ disabled, pressed, isFull });

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

TileButton.displayName = 'TileButton';
