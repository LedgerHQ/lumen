import { StyleSheet, Text } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { IconSize } from '../Icon';
import { Box } from '../Utility';
import { TagProps } from './types';

type Appearance = NonNullable<TagProps['appearance']>;
type Size = NonNullable<TagProps['size']>;

const useStyles = ({
  appearance,
  size,
  disabled,
}: {
  appearance: Appearance;
  size: Size;
  disabled: boolean;
}) => {
  return useStyleSheet(
    (t) => {
      const bgColors: Record<Appearance, string> = {
        base: t.colors.bg.mutedTransparent,
        gray: t.colors.bg.mutedTransparent,
        accent: t.colors.bg.accent,
        success: t.colors.bg.success,
        error: t.colors.bg.error,
        warning: t.colors.bg.warning,
      };

      const textColors: Record<Appearance, string> = {
        base: t.colors.text.base,
        gray: t.colors.text.muted,
        accent: t.colors.text.onAccent,
        success: t.colors.text.success,
        error: t.colors.text.error,
        warning: t.colors.text.warning,
      };

      const sizeStyles: Record<
        Size,
        { height: number; paddingHorizontal: number; paddingVertical: number }
      > = {
        md: {
          height: t.sizes.s24,
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s4,
        },
        sm: {
          height: t.sizes.s20,
          paddingHorizontal: t.spacings.s4,
          paddingVertical: t.spacings.s2,
        },
      };

      const textTypography =
        size === 'md' ? t.typographies.body3 : t.typographies.body4;

      return {
        root: StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: t.spacings.s4,
            borderRadius: t.borderRadius.xs,
            backgroundColor: bgColors[appearance],
            ...sizeStyles[size],
          },
          disabled && {
            backgroundColor: t.colors.bg.disabled,
          },
        ]),
        text: StyleSheet.flatten([
          textTypography,
          {
            color: textColors[appearance],
          },
          disabled && {
            color: t.colors.text.disabled,
          },
        ]),
        icon: StyleSheet.flatten([
          {
            flexShrink: 0,
            color: textColors[appearance],
          },
          disabled && {
            color: t.colors.text.disabled,
          },
        ]),
      };
    },
    [appearance, size, disabled],
  );
};

const iconSizeMap: Record<Size, IconSize> = {
  md: 16,
  sm: 12,
};

/**
 * A compact label used to categorize, classify, or highlight information with optional icon support.
 *
 * The appearance determines the color scheme used.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-tag-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-tag-implementation--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the tag's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * import { Tag } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic tag
 * <Tag label="Label" appearance="accent" />
 *
 * // Tag with icon
 * <Tag
 *   label="Success"
 *   appearance="success"
 *   icon={Check}
 * />
 *
 * // Small tag
 * <Tag label="Small" size="sm" />
 */
export const Tag = ({
  appearance = 'accent',
  size = 'md',
  icon,
  label,
  disabled = false,
  lx = {},
  style,
  ref,
  ...props
}: TagProps) => {
  const styles = useStyles({ appearance, size, disabled });

  const IconComponent = icon;
  const iconSize = iconSizeMap[size];

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      {IconComponent && <IconComponent size={iconSize} style={styles.icon} />}
      <Text style={styles.text}>{label}</Text>
    </Box>
  );
};

Tag.displayName = 'Tag';
