import type { ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box, Text } from '../Utility';
import type {
  SectionHeaderAppearance,
  SectionHeaderLeadingProps,
  SectionHeaderProps,
  SectionHeaderTitleProps,
} from './types';

/**
 * Leading slot for the SectionHeader. Use for optional icons or other leading content.
 */
export const SectionHeaderLeading = ({
  children,
  lx,
  style,
  ...props
}: SectionHeaderLeadingProps) => {
  const styles = useStyleSheet(
    () => ({
      leading: StyleSheet.flatten([
        {
          flexShrink: 0,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]),
    }),
    [],
  );

  return (
    <Box lx={lx} style={[styles.leading, style]} {...props}>
      {children}
    </Box>
  );
};

/**
 * Title component for the SectionHeader. Displays the muted label text.
 */
export const SectionHeaderTitle = ({
  children,
  lx,
  style,
  ...props
}: SectionHeaderTitleProps) => {
  const styles = useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          flexShrink: 1,
          minWidth: 0,
          color: t.colors.text.muted,
        },
      ]),
    }),
    [],
  );

  return (
    <Text
      lx={lx}
      style={[styles.title, style]}
      numberOfLines={1}
      ellipsizeMode='tail'
      {...props}
    >
      {children}
    </Text>
  );
};

/**
 * A compact section label used to title grouped content areas.
 * Uses a composable API where you explicitly nest sub-components to define the layout.
 *
 * @example
 * <SectionHeader>
 *   <SectionHeaderTitle>Label</SectionHeaderTitle>
 * </SectionHeader>
 */
export const SectionHeader = ({
  appearance = 'no-background',
  lx,
  style,
  children,
  ...props
}: SectionHeaderProps) => {
  const styles = useStyleSheet(
    (t) => {
      const appearanceStyles = {
        'no-background': {},
        plain: {
          backgroundColor: t.colors.bg.surface,
          paddingHorizontal: t.spacings.s8,
          paddingVertical: t.spacings.s1,
          borderRadius: t.borderRadius.xs,
        },
      } satisfies Record<SectionHeaderAppearance, ViewStyle>;

      return {
        container: StyleSheet.flatten([
          {
            flexDirection: 'row',
            alignItems: 'center',
            gap: t.spacings.s4,
            minWidth: 0,
          },
          appearanceStyles[appearance],
        ]),
      };
    },
    [appearance],
  );

  return (
    <Box lx={lx} style={[styles.container, style]} {...props}>
      {children}
    </Box>
  );
};
