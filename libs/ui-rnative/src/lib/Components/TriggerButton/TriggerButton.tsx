import { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ChevronDown } from '../../Symbols';
import { Pressable } from '../Utility';
import type { TriggerButtonProps } from './types';

type Appearance = NonNullable<TriggerButtonProps['appearance']>;
type Size = NonNullable<TriggerButtonProps['size']>;
type IconType = 'flat' | 'rounded' | 'none';

const useStyles = ({
  appearance,
  size,
  disabled,
  pressed,
  iconType,
}: {
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  pressed: boolean;
  iconType: IconType;
}) => {
  return useStyleSheet(
    (t) => {
      const bgColors: Record<Appearance, string> = {
        gray: t.colors.bg.muted,
        transparent: t.colors.bg.mutedTransparent,
        'no-background': 'transparent',
      };

      const pressedBgColors: Record<Appearance, string> = {
        gray: t.colors.bg.mutedPressed,
        transparent: t.colors.bg.mutedTransparentPressed,
        'no-background': t.colors.bg.baseTransparentPressed,
      };

      const textColor = disabled ? t.colors.text.disabled : t.colors.text.base;

      type PaddingStyle = {
        paddingTop: number;
        paddingBottom: number;
        paddingLeft: number;
        paddingRight: number;
      };

      const paddingMap: Record<Size, Record<IconType, PaddingStyle>> = {
        md: {
          flat: {
            paddingTop: t.spacings.s12,
            paddingBottom: t.spacings.s12,
            paddingLeft: t.spacings.s16,
            paddingRight: t.spacings.s16,
          },
          rounded: {
            paddingTop: t.spacings.s8,
            paddingBottom: t.spacings.s8,
            paddingLeft: t.spacings.s8,
            paddingRight: t.spacings.s16,
          },
          none: {
            paddingTop: t.spacings.s14,
            paddingBottom: t.spacings.s14,
            paddingLeft: t.spacings.s16,
            paddingRight: t.spacings.s16,
          },
        },
        sm: {
          flat: {
            paddingTop: t.spacings.s10,
            paddingBottom: t.spacings.s10,
            paddingLeft: t.spacings.s12,
            paddingRight: t.spacings.s12,
          },
          rounded: {
            paddingTop: t.spacings.s8,
            paddingBottom: t.spacings.s8,
            paddingLeft: t.spacings.s8,
            paddingRight: t.spacings.s10,
          },
          none: {
            paddingTop: t.spacings.s10,
            paddingBottom: t.spacings.s10,
            paddingLeft: t.spacings.s12,
            paddingRight: t.spacings.s12,
          },
        },
      };

      return {
        container: StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: t.borderRadius.full,
            backgroundColor: bgColors[appearance],
            gap: t.spacings.s8,
          },
          paddingMap[size][iconType],
          pressed && { backgroundColor: pressedBgColors[appearance] },
          disabled && { backgroundColor: t.colors.bg.disabled },
          appearance === 'no-background' &&
            disabled && { backgroundColor: 'transparent' },
        ]),
        label: StyleSheet.flatten([
          t.typographies.body2SemiBold,
          {
            color: textColor,
            textAlign: 'left',
          },
        ]),
        labelWrapper: {
          flexDirection: 'row',
          alignItems: 'center',
          gap: t.spacings.s2,
        },
        icon: {
          flexShrink: 0,
        },
        chevron: {
          flexShrink: 0,
          color: textColor,
        },
      };
    },
    [appearance, size, disabled, pressed, iconType],
  );
};

/**
 * Trigger button for select/dropdown components. Displays a label with an optional
 * leading icon and a trailing chevron indicator.
 *
 * This component is intended to be used exclusively as the trigger inside a Select or
 * dropdown pattern. It should not be used as a standalone action button — use `Button`
 * or `IconButton` instead.
 *
 * @see {@link https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=6389-45680 Figma}
 *
 * @example
 * import { TriggerButton } from '@ledgerhq/lumen-ui-rnative';
 * import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <TriggerButton icon={<Settings size={20} />} iconType="flat">
 *   Network
 * </TriggerButton>
 *
 * <TriggerButton>All accounts</TriggerButton>
 */
export const TriggerButton = ({
  lx,
  style,
  appearance = 'gray',
  size = 'md',
  disabled = false,
  icon,
  iconType = 'flat',
  children: label,
  ref,
  ...props
}: TriggerButtonProps) => {
  const effectiveIconType: IconType = icon ? iconType : 'none';

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={style}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityState={{ disabled }}
      {...props}
    >
      {({ pressed }) => (
        <TriggerButtonContent
          appearance={appearance}
          size={size}
          disabled={disabled}
          pressed={pressed}
          iconType={effectiveIconType}
          icon={icon}
        >
          {label}
        </TriggerButtonContent>
      )}
    </Pressable>
  );
};

type TriggerButtonContentProps = PropsWithChildren<{
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  pressed: boolean;
  iconType: IconType;
  icon?: TriggerButtonProps['icon'];
}>;

const TriggerButtonContent = ({
  appearance,
  size,
  disabled,
  pressed,
  iconType,
  icon,
  children,
}: TriggerButtonContentProps) => {
  const styles = useStyles({ appearance, size, disabled, pressed, iconType });

  return (
    <View style={styles.container} testID='button-trigger-content'>
      {icon && <View style={styles.icon}>{icon}</View>}
      <View style={styles.labelWrapper}>
        <Text style={styles.label} numberOfLines={1} ellipsizeMode='tail'>
          {children}
        </Text>
        <ChevronDown
          size={20}
          style={styles.chevron}
          testID='button-trigger-chevron'
        />
      </View>
    </View>
  );
};

TriggerButton.displayName = 'TriggerButton';
