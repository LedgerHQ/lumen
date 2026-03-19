import { Image, StyleSheet } from 'react-native';
import { useStyleSheet } from '../../../styles';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box, LinearGradient, Pressable, Text } from '../Utility';
import {
  MediaBannerDescriptionProps,
  MediaBannerProps,
  MediaBannerTitleProps,
} from './types';

export function MediaBanner({
  lx,
  style,
  imageUrl,
  onClose,
  children,
  ...props
}: MediaBannerProps) {
  const styles = useStyleSheet(
    (t) => ({
      container: {
        backgroundColor: t.colors.bg.surface,
        borderRadius: t.borderRadius.md,
        overflow: 'hidden',
        flexDirection: 'row',
        height: t.sizes.s72,
      },
      contentWrapper: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: t.spacings.s12,
        paddingVertical: t.spacings.s2,
      },
      contentContainer: {
        paddingVertical: t.spacings.s12,
        gap: 4,
      },
      closeButton: {
        position: 'absolute',
        top: 8.5,
        right: 8.5,
      },
    }),
    [],
  );

  return (
    <Pressable lx={lx} style={[styles.container, style]} {...props}>
      <Box style={styles.contentWrapper}>
        <Box style={styles.contentContainer}>{children}</Box>
      </Box>
      <Box style={{ width: 120 }}>
        <Image
          src={imageUrl}
          style={StyleSheet.absoluteFill}
          resizeMode='cover'
        />
        <LinearGradient
          direction={35}
          stops={[
            { color: '#000', opacity: 0, offset: 0.8 },
            { color: '#000', opacity: 0.5 },
          ]}
          style={StyleSheet.absoluteFill}
        />
      </Box>
      <Box style={styles.closeButton}>
        <InteractiveIcon iconType='stroked' onPress={onClose}>
          <Close size={16} />
        </InteractiveIcon>
      </Box>
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
