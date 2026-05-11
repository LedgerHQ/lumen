import { useDisabledContext } from '@ledgerhq/lumen-utils-shared';
import type { ReactNode } from 'react';
import type { StyleProp, TextStyle } from 'react-native';
import { StyleSheet, Text } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box } from '../Utility';
import type { TagProps } from './types';

type Appearance = NonNullable<TagProps['appearance']>;
type Size = NonNullable<TagProps['size']>;
type Variant = 'tag' | 'media';

const useBaseTagStyles = ({
  appearance,
  size,
  disabled,
  variant,
}: {
  appearance: Appearance;
  size: Size;
  disabled: boolean;
  variant: Variant;
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

      const tagPadding = {
        md: {
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s4,
        },
        sm: {
          paddingHorizontal: t.spacings.s4,
          paddingVertical: t.spacings.s2,
        },
      } satisfies Record<Size, object>;

      const mediaPadding = {
        md: {
          paddingLeft: t.spacings.s4,
          paddingRight: t.spacings.s8,
          paddingVertical: t.spacings.s4,
        },
        sm: {
          paddingLeft: t.spacings.s4,
          paddingRight: t.spacings.s4,
          paddingVertical: t.spacings.s2,
        },
      } satisfies Record<Size, object>;

      const padding =
        variant === 'media' ? mediaPadding[size] : tagPadding[size];

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
            ...padding,
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
    [appearance, size, disabled, variant],
  );
};

export type BaseTagProps = Omit<TagProps, 'icon'> & {
  variant: Variant;
  consumerName: string;
  renderIcon?: (style: StyleProp<TextStyle>) => ReactNode;
};

export const BaseTag = ({
  appearance = 'accent',
  size = 'md',
  variant,
  consumerName,
  label,
  renderIcon,
  disabled: disabledProp = false,
  lx = {},
  style,
  ref,
  ...props
}: BaseTagProps) => {
  const disabled = useDisabledContext({
    consumerName,
    mergeWith: { disabled: disabledProp },
  });
  const styles = useBaseTagStyles({
    appearance,
    size,
    disabled: !!disabled,
    variant,
  });

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      {renderIcon?.(styles.icon)}
      <Text style={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </Box>
  );
};
