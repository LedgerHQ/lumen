import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, Text } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import type { MediaTagProps } from './types';

type Appearance = NonNullable<MediaTagProps['appearance']>;
type Size = NonNullable<MediaTagProps['size']>;

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
        'accent-subtle': t.colors.bg.activeSubtle,
        success: t.colors.bg.success,
        error: t.colors.bg.error,
        warning: t.colors.bg.warning,
      };

      const textColors: Record<Appearance, string> = {
        base: t.colors.text.base,
        gray: t.colors.text.muted,
        accent: t.colors.text.onAccent,
        'accent-subtle': t.colors.text.active,
        success: t.colors.text.success,
        error: t.colors.text.error,
        warning: t.colors.text.warning,
      };

      const sizeStyles: Record<
        Size,
        { paddingHorizontal: number; paddingVertical: number }
      > = {
        md: {
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s4,
        },
        sm: {
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

export const MediaTag = ({
  appearance = 'accent',
  size = 'md',
  icon,
  label,
  disabled: disabledProp = false,
  lx = {},
  style,
  ref,
  ...props
}: MediaTagProps) => {
  const disabled = useDisabledContext({
    consumerName: 'MediaTag',
    mergeWith: { disabled: disabledProp },
  });
  const styles = useStyles({ appearance, size, disabled: !!disabled });

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      {icon}
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </Box>
  );
};
