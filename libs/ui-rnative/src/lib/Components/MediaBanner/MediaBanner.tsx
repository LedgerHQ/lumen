import { StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Box, LinearGradient, Pressable, Text } from '../Utility';
import {
  MediaBannerDescriptionProps,
  MediaBannerProps,
  MediaBannerTitleProps,
} from './types';

export function MediaBanner({
  lx,
  style,
  children,
  ...props
}: MediaBannerProps) {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        backgroundColor: t.colors.bg.surface,
        borderRadius: t.borderRadius.md,
        minHeight: t.sizes.s72,
        justifyContent: 'center',
        overflow: 'hidden',
        alignSelf: 'stretch',
      },
      contentWrapper: {
        paddingHorizontal: t.spacings.s12,
        paddingVertical: t.spacings.s2,
      },
      contentContainer: {
        paddingVertical: t.spacings.s12,
        gap: 4,
      },
      gradient: {
        position: 'absolute',
        right: 0,
        height: '100%',
        width: t.sizes.s72,
      },
    }),
    [],
  );

  return (
    <Pressable lx={lx} style={[styles.container, style]} {...props}>
      <Box style={styles.contentWrapper}>
        <Box style={styles.contentContainer}>{children}</Box>
      </Box>
      <LinearGradient
        direction={45}
        stops={[
          { color: '#000', opacity: 0, offset: 0.6417 },
          { color: '#000', opacity: 0.8 },
        ]}
        style={styles.gradient}
      />
    </Pressable>
  );
}

export function MediaBannerTitle({
  lx,
  style,
  children,
  ...props
}: MediaBannerTitleProps) {
  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          color: t.colors.text.base,
        },
      ]),
    }),
    [],
  );

  return (
    <Text
      lx={lx}
      style={[styles.description, style]}
      numberOfLines={1}
      {...props}
    >
      {children}
    </Text>
  );
}

export function MediaBannerDescription({
  lx,
  style,
  children,
  ...props
}: MediaBannerDescriptionProps) {
  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([
        t.typographies.body3,
        {
          color: t.colors.text.muted,
        },
      ]),
    }),
    [],
  );

  return (
    <Text
      lx={lx}
      style={[styles.description, style]}
      numberOfLines={2}
      {...props}
    >
      {children}
    </Text>
  );
}
