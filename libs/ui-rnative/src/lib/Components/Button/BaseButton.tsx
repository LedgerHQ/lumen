import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { IconSize } from '../Icon';
import { Spinner } from '../Spinner';
import { Pressable } from '../Utility';
import { BaseButtonProps } from './types';

type Appearance = NonNullable<BaseButtonProps['appearance']>;
type Size = NonNullable<BaseButtonProps['size']>;

const iconSizeMap: Record<Size, IconSize> = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 24,
} as const;

const useRootStyles = ({ isFull }: { isFull: boolean }) => {
  return useStyleSheet(
    (t) => {
      return {
        root: {
          width: isFull ? t.sizes.full : 'auto',
        },
      };
    },
    [isFull],
  );
};

const useStyles = ({
  appearance,
  size,
  disabled,
  pressed,
  iconOnly,
  isFull,
}: {
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  pressed: boolean;
  iconOnly: boolean;
  isFull: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const bgColors: Record<Appearance, string> = {
        base: t.colors.bg.interactive,
        gray: t.colors.bg.muted,
        accent: t.colors.bg.accent,
        transparent: t.colors.bg.mutedTransparent,
        'no-background': 'transparent',
        red: t.colors.bg.error,
      };

      const pressedBgColors: Record<Appearance, string> = {
        base: t.colors.bg.interactivePressed,
        gray: t.colors.bg.mutedPressed,
        accent: t.colors.bg.accentPressed,
        transparent: t.colors.bg.mutedTransparentPressed,
        'no-background': t.colors.bg.baseTransparentPressed,
        red: t.colors.bg.errorPressed,
      };

      const textColors: Record<Appearance, string> = {
        base: t.colors.text.onInteractive,
        accent: t.colors.text.onAccent,
        red: t.colors.text.error,
        gray: t.colors.text.base,
        'no-background': t.colors.text.base,
        transparent: t.colors.text.base,
      };

      const sizeStyles: Record<Size, { paddingH: number; paddingV: number }> = {
        xs: { paddingH: t.spacings.s12, paddingV: t.spacings.s8 },
        sm: { paddingH: t.spacings.s16, paddingV: t.spacings.s10 },
        md: { paddingH: t.spacings.s16, paddingV: t.spacings.s12 },
        lg: { paddingH: t.spacings.s16, paddingV: t.spacings.s16 },
      };

      const iconOnlyPadding: Record<Size, number> = {
        xs: t.spacings.s8,
        sm: t.spacings.s10,
        md: t.spacings.s12,
        lg: t.spacings.s16,
      };

      const typography =
        size === 'xs' || size === 'sm'
          ? t.typographies.body2SemiBold
          : t.typographies.body1SemiBold;

      const currentSizeStyle = sizeStyles[size];

      return {
        container: StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: t.borderRadius.full,
            backgroundColor: bgColors[appearance],
          },
          iconOnly
            ? { padding: iconOnlyPadding[size] }
            : {
                paddingHorizontal: currentSizeStyle.paddingH,
                paddingVertical: currentSizeStyle.paddingV,
                gap: t.spacings.s8,
              },
          isFull && { width: t.sizes.full },
          pressed && { backgroundColor: pressedBgColors[appearance] },
          disabled && { backgroundColor: t.colors.bg.disabled },
          appearance === 'no-background' &&
            disabled && { backgroundColor: 'transparent' },
        ]),
        label: StyleSheet.flatten([
          typography,
          {
            color: disabled ? t.colors.text.disabled : textColors[appearance],
            textAlign: 'left',
          },
        ]),
        icon: {
          flexShrink: 0,
          color: disabled ? t.colors.text.disabled : textColors[appearance],
        },
      };
    },
    [appearance, size, disabled, pressed, iconOnly, isFull],
  );
};

/**
 * Base button component
 * @default appearance 'base'
 * @default size 'md'
 */
export const BaseButton = ({
  lx,
  style,
  children,
  appearance = 'base',
  size = 'md',
  isFull = false,
  loading = false,
  icon: IconProp,
  disabled = false,
  ref,
  ...props
}: BaseButtonProps) => {
  const rootStyles = useRootStyles({ isFull });

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([style, rootStyles.root])}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      {...props}
    >
      {({ pressed }) => (
        <BaseButtonContent
          appearance={appearance}
          size={size}
          disabled={disabled}
          pressed={pressed}
          isFull={isFull}
          loading={loading}
          IconProp={IconProp}
        >
          {children}
        </BaseButtonContent>
      )}
    </Pressable>
  );
};

type BaseButtonContentProps = PropsWithChildren<{
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  pressed: boolean;
  isFull: boolean;
  loading: boolean;
  IconProp?: BaseButtonProps['icon'];
}>;

const BaseButtonContent = ({
  appearance,
  size,
  disabled,
  pressed,
  isFull,
  loading,
  IconProp,
  children,
}: BaseButtonContentProps) => {
  const calculatedIconSize = iconSizeMap[size];
  const iconOnly = Boolean(IconProp && !children);
  const styles = useStyles({
    appearance,
    size,
    disabled,
    pressed,
    iconOnly,
    isFull,
  });

  return (
    <View style={styles.container} testID='base-button-content'>
      {loading && (
        <Spinner
          size={calculatedIconSize}
          style={{ color: styles.icon.color }}
        />
      )}
      {!loading && IconProp && (
        <IconProp size={calculatedIconSize} style={styles.icon} />
      )}
      {children && (
        <Text style={styles.label} numberOfLines={2}>
          {children}
        </Text>
      )}
    </View>
  );
};

BaseButton.displayName = 'BaseButton';
