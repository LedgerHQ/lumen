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
        height: CARD_HEIGHT,
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

MediaCardTitle.displayName = 'MediaCardTitle';

const GradientOverlays = () => {
  return (
    <>
      <LinearGradient
        direction='to-top'
        stops={[
          { color: '#000', opacity: 0.8, offset: 0 },
          { color: '#000', opacity: 0, offset: 0.75 },
        ]}
        style={StyleSheet.absoluteFill}
        pointerEvents='none'
        accessible={false}
      />

      <LinearGradient
        direction={65}
        stops={[
          { color: '#000', opacity: 0, offset: 0.6 },
          { color: '#000', opacity: 0.8, offset: 1 },
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
 */
export const MediaCard = ({
  ref,
  children,
  imageUrl,
  onPress,
  onClose,
  lx = {},
  style,
  ...pressableProps
}: MediaCardProps) => {
  const { t } = useCommonTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  const styles = useStyles();

  return (
    <Pressable
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityRole='button'
      onPress={onPress}
      {...pressableProps}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[StyleSheet.absoluteFill, !imageLoaded && { opacity: 0 }]}
        accessible={false}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
        testID='media-card-image'
      />

      {imageLoaded && <GradientOverlays />}

      <View style={styles.content}>{children}</View>

      <InteractiveIcon
        iconType='stroked'
        appearance='white'
        style={styles.closeButton}
        onPress={onClose}
        accessibilityLabel={t('common.closeAriaLabel')}
        testID='media-card-close-button'
      >
        <Close size={20} />
      </InteractiveIcon>
    </Pressable>
  );
};

MediaCard.displayName = 'MediaCard';
