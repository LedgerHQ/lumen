import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { LinearGradient, Pressable, Text } from '../Utility';
import { MediaCardProps, MediaCardTitleProps } from './types';

const CARD_HEIGHT = 164;

const useStyles = () =>
  useStyleSheet(
    (t) => ({
      root: {
        position: 'relative',
        width: t.sizes.full,
        minHeight: CARD_HEIGHT,
        borderRadius: t.borderRadius.md,
        overflow: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        backgroundColor: t.colors.bg.muted,
      },
      content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: t.spacings.s8,
        width: t.sizes.full,
        minWidth: 0,
        padding: t.spacings.s12,
      },
      title: {
        ...t.typographies.heading3SemiBold,
        color: t.colors.text.white,
      },
      closeButton: {
        position: 'absolute',
        top: t.spacings.s12,
        right: t.spacings.s12,
      },
      gradientOverlays: {
        color: t.colors.text.black,
      },
      pressedOverlay: {
        backgroundColor: t.colors.bg.mutedTransparentPressed,
      },
    }),
    [],
  );

/**
 * Title text for the card, styled with heading typography and white color.
 */
export const MediaCardTitle = ({
  children,
  lx = {},
  style,
  ref,
  ...props
}: MediaCardTitleProps) => {
  const styles = useStyles();

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.title, style])}
      numberOfLines={3}
      ellipsizeMode='tail'
      {...props}
    >
      {children}
    </Text>
  );
};

const GradientOverlays = () => {
  const styles = useStyles();

  return (
    <>
      <LinearGradient
        direction='to-top'
        stops={[
          { color: styles.gradientOverlays.color, opacity: 0.8, offset: 0 },
          { color: styles.gradientOverlays.color, opacity: 0, offset: 0.75 },
        ]}
        style={StyleSheet.absoluteFill}
        pointerEvents='none'
        accessible={false}
      />

      <LinearGradient
        direction={45}
        stops={[
          { color: styles.gradientOverlays.color, opacity: 0, offset: 0.6 },
          { color: styles.gradientOverlays.color, opacity: 0.8 },
        ]}
        style={StyleSheet.absoluteFill}
        pointerEvents='none'
        accessible={false}
      />
    </>
  );
};

/**
 * A media card component for displaying a full-bleed background image with
 * composable content and a close button, using gradient overlays to ensure
 * readability.
 *
 * @example
 * import { MediaCard, MediaCardTitle } from '@ledgerhq/lumen-ui-rnative';
 * import { Tag } from '@ledgerhq/lumen-ui-rnative';
 *
 * <MediaCard imageUrl="/image.jpg" onPress={() => {}} onClose={() => {}}>
 *   <Tag label="New" size="md" />
 *   <MediaCardTitle>Card title</MediaCardTitle>
 * </MediaCard>
 *
 * // Without close button
 * <MediaCard imageUrl="/image.jpg" onPress={() => {}}>
 *   <MediaCardTitle>Card title</MediaCardTitle>
 * </MediaCard>
 */
export const MediaCard = ({
  ref,
  children,
  imageUrl,
  onPress,
  onClose,
  closeAccessibilityLabel,
  lx = {},
  style,
  ...pressableProps
}: MediaCardProps) => {
  const { t } = useCommonTranslation();
  const [imageLoadError, setImageLoadError] = useState(false);
  const showImage = imageUrl && !imageLoadError;

  const styles = useStyles();

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      {...pressableProps}
    >
      {({ pressed }) => (
        <>
          {showImage && (
            <Image
              source={{ uri: imageUrl }}
              style={[
                StyleSheet.absoluteFill,
                imageLoadError && { opacity: 0 },
              ]}
              accessible={false}
              onError={() => setImageLoadError(true)}
              testID='media-card-image'
            />
          )}

          <GradientOverlays />

          <View style={styles.content}>{children}</View>

          {onClose && (
            <InteractiveIcon
              iconType='stroked'
              appearance='white'
              icon={Close}
              size={20}
              style={styles.closeButton}
              onPress={onClose}
              accessibilityLabel={
                closeAccessibilityLabel || t('common.closeAriaLabel')
              }
              testID='media-card-close-button'
            />
          )}

          {pressed && (
            <View
              style={[StyleSheet.absoluteFill, styles.pressedOverlay]}
              pointerEvents='none'
              accessible={false}
            />
          )}
        </>
      )}
    </Pressable>
  );
};
