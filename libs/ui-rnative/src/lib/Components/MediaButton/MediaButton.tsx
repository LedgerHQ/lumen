import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { ChevronDown } from '../../Symbols';
import { Pressable } from '../Utility';
import type { MediaButtonProps } from './types';

type Appearance = NonNullable<MediaButtonProps['appearance']>;
type Size = NonNullable<MediaButtonProps['size']>;
type LeadingContentShape = 'flat' | 'rounded' | 'none';

const useStyles = ({
  appearance,
  size,
  disabled,
  pressed,
  leadingContentShape,
  hideChevron,
}: {
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  pressed: boolean;
  leadingContentShape: LeadingContentShape;
  hideChevron: boolean;
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
        paddingVertical: number;
        paddingLeft: number;
        paddingRight: number;
      };

      const paddingMap: Record<
        Size,
        Record<LeadingContentShape, Partial<PaddingStyle>>
      > = {
        md: {
          flat: {
            paddingVertical: hideChevron ? t.spacings.s12 : t.spacings.s14,
            paddingLeft: t.spacings.s16,
            paddingRight: hideChevron ? t.spacings.s16 : t.spacings.s12,
          },
          rounded: {
            paddingVertical: t.spacings.s8,
            paddingLeft: t.spacings.s8,
            paddingRight: hideChevron ? t.spacings.s16 : t.spacings.s12,
          },
          none: {
            paddingVertical: t.spacings.s14,
            paddingLeft: t.spacings.s16,
            paddingRight: hideChevron ? t.spacings.s16 : t.spacings.s12,
          },
        },
        sm: {
          flat: {
            paddingVertical: t.spacings.s10,
            paddingLeft: t.spacings.s12,
            paddingRight: hideChevron ? t.spacings.s12 : t.spacings.s8,
          },
          rounded: {
            paddingVertical: t.spacings.s8,
            paddingLeft: t.spacings.s8,
            paddingRight: hideChevron ? t.spacings.s10 : t.spacings.s8,
          },
          none: {
            paddingVertical: t.spacings.s10,
            paddingLeft: t.spacings.s12,
            paddingRight: hideChevron ? t.spacings.s12 : t.spacings.s8,
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
          paddingMap[size][leadingContentShape],
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
        leadingContent: {
          flexShrink: 0,
        },
        chevron: {
          flexShrink: 0,
          color: textColor,
        },
      };
    },
    [appearance, size, disabled, pressed, leadingContentShape, hideChevron],
  );
};

/**
 * Media button for option list/dropdown components. Displays a label with an optional
 * leading content and a trailing chevron indicator.
 *
 * This component is intended to be used exclusively as the trigger inside an OptionList or
 * dropdown pattern. It should not be used as a standalone action button — use `Button`
 * or `IconButton` instead.
 *
 * @see {@link https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=6389-45680 Figma}
 *
 * @example
 * import { MediaButton } from '@ledgerhq/lumen-ui-rnative';
 * import { Settings } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <MediaButton leadingContent={<Settings size={20} />} leadingContentShape="flat">
 *   Network
 * </MediaButton>
 *
 * <MediaButton>All accounts</MediaButton>
 */
export const MediaButton = ({
  lx,
  style,
  appearance = 'gray',
  size = 'md',
  disabled = false,
  leadingContent,
  leadingContentShape = 'flat',
  hideChevron = false,
  children: label,
  ref,
  ...props
}: MediaButtonProps) => {
  const effectiveLeadingContentShape: LeadingContentShape = leadingContent
    ? leadingContentShape
    : 'none';

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
        <MediaButtonContent
          appearance={appearance}
          size={size}
          disabled={disabled}
          pressed={pressed}
          leadingContent={leadingContent}
          leadingContentShape={effectiveLeadingContentShape}
          hideChevron={hideChevron}
        >
          {label}
        </MediaButtonContent>
      )}
    </Pressable>
  );
};

type MediaButtonContentProps = PropsWithChildren<{
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  pressed: boolean;
  leadingContent?: MediaButtonProps['leadingContent'];
  leadingContentShape: LeadingContentShape;
  hideChevron: boolean;
}>;

const MediaButtonContent = ({
  appearance,
  size,
  disabled,
  pressed,
  leadingContent,
  leadingContentShape,
  hideChevron,
  children,
}: MediaButtonContentProps) => {
  const styles = useStyles({
    appearance,
    size,
    disabled,
    pressed,
    leadingContentShape,
    hideChevron,
  });

  return (
    <View style={styles.container} testID='button-trigger-content'>
      {leadingContent && (
        <View style={styles.leadingContent}>{leadingContent}</View>
      )}
      <View style={styles.labelWrapper}>
        <Text style={styles.label} numberOfLines={1} ellipsizeMode='tail'>
          {children}
        </Text>
        {!hideChevron && (
          <ChevronDown
            size={20}
            style={styles.chevron}
            testID='button-trigger-chevron'
          />
        )}
      </View>
    </View>
  );
};
