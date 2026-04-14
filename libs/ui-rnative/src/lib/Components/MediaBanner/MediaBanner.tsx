import { useEffect, useState } from 'react';
import { Image, StyleSheet } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet, useTheme } from '../../../styles';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box, LinearGradient, Pressable, Text } from '../Utility';
import {
  MediaBannerDescriptionProps,
  MediaBannerProps,
  MediaBannerTitleProps,
} from './types';

/**
 * A promotional banner with a background image, title, description, and an optional close button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-mediabanner--docs Storybook}
 */
export function MediaBanner({
  lx,
  style,
  imageUrl,
  onClose,
  closeAccessibilityLabel,
  children,
  ...props
}: MediaBannerProps) {
  const { t: translate } = useCommonTranslation();
  const { theme: t } = useTheme();
  const [imageLoadError, setImageLoadError] = useState(false);

  useEffect(() => {
    setImageLoadError(false);
  }, [imageUrl]);

  const showImage = imageUrl && !imageLoadError;

  const styles = useStyleSheet(
    (t) => ({
      container: {
        backgroundColor: t.colors.bg.surface,
        borderRadius: t.borderRadius.md,
        overflow: 'hidden',
        flexDirection: 'row',
        minHeight: t.sizes.s72,
      },
      contentWrapper: {
        flex: 1,
        overflow: 'hidden',
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
        {showImage && (
          <Image
            source={{ uri: imageUrl }}
            style={StyleSheet.absoluteFill}
            resizeMode='cover'
            onError={() => setImageLoadError(true)}
            accessible={false}
          />
        )}
        <LinearGradient
          direction='to-topright'
          stops={[
            { color: t.colors.bg.black, opacity: 0, offset: 0.67 },
            { color: t.colors.bg.black, opacity: 0.8 },
          ]}
          style={StyleSheet.absoluteFill}
          accessible={false}
          pointerEvents='none'
        />
      </Box>
      {onClose && (
        <Box style={styles.closeButton}>
          <InteractiveIcon
            testID='media-banner-close-button'
            iconType='stroked'
            appearance='white'
            icon={Close}
            size={16}
            onPress={onClose}
            accessibilityLabel={
              closeAccessibilityLabel ||
              translate('components.banner.closeAriaLabel')
            }
          />
        </Box>
      )}
    </Pressable>
  );
}

/**
 * The title of the MediaBanner. Clamps at 1 line.
 */
export function MediaBannerTitle({
  lx,
  style,
  children,
  ...props
}: MediaBannerTitleProps) {
  const styles = useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.body2SemiBold,
        {
          color: t.colors.text.base,
        },
      ]),
    }),
    [],
  );

  return (
    <Text lx={lx} style={[styles.title, style]} numberOfLines={1} {...props}>
      {children}
    </Text>
  );
}

/**
 * The description of the MediaBanner. Clamps at 2 lines.
 */
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
