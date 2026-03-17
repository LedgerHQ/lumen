import { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { Close } from '../../Symbols';
import {
  Box,
  LinearGradient,
  Pressable,
  RadialGradient,
  Text,
} from '../Utility';
import {
  MediaCardDescriptionProps,
  MediaCardLeadingContentProps,
  MediaCardProps,
  MediaCardTitleProps,
  MediaCardTrailingContentProps,
} from './types';

const CARD_HEIGHT = 164;
const WHITE = '#FFFFFF';

/**
 * Slot for secondary content displayed above the trailing content, such as tags or icons.
 */
export const MediaCardLeadingContent = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: MediaCardLeadingContentProps) => {
  return (
    <Box ref={ref} lx={lx} style={style} {...viewProps}>
      {children}
    </Box>
  );
};

MediaCardLeadingContent.displayName = 'MediaCardLeadingContent';

/**
 * Text content displayed at the bottom of the card.
 */
export const MediaCardTrailingContent = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: MediaCardTrailingContentProps) => {
  const styles = useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'column',
        gap: t.spacings.s4,
      },
    }),
    [],
  );

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

MediaCardTrailingContent.displayName = 'MediaCardTrailingContent';

/**
 * Title text for the card, rendered inside `MediaCardTrailingContent`.
 */
export const MediaCardTitle = ({
  children,
  lx = {},
  style,
  ref,
}: MediaCardTitleProps) => {
  const styles = useStyleSheet(
    (t) => ({
      title: StyleSheet.flatten([
        t.typographies.heading3SemiBold,
        { color: WHITE },
      ]),
    }),
    [],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.title, style])}
      numberOfLines={2}
      ellipsizeMode='tail'
    >
      {children}
    </Text>
  );
};

MediaCardTitle.displayName = 'MediaCardTitle';

/**
 * Description text displayed below the title.
 */
export const MediaCardDescription = ({
  children,
  lx = {},
  style,
  ref,
}: MediaCardDescriptionProps) => {
  const styles = useStyleSheet(
    (t) => ({
      description: StyleSheet.flatten([t.typographies.body3, { color: WHITE }]),
    }),
    [],
  );

  return (
    <Text
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.description, style])}
      numberOfLines={2}
      ellipsizeMode='tail'
    >
      {children}
    </Text>
  );
};

MediaCardDescription.displayName = 'MediaCardDescription';

/**
 * A media card component for displaying a full-bleed background image with
 * composable text content and a close button, using gradient overlays to
 * ensure readability.
 *
 * @example
 * import { MediaCard, MediaCardLeadingContent, MediaCardTrailingContent, MediaCardTitle, MediaCardDescription } from '@ledgerhq/lumen-ui-rnative';
 *
 * <MediaCard imageUrl="/image.jpg" onPress={() => {}} onClose={() => {}}>
 *   <MediaCardLeadingContent>
 *     <Tag label="New" size="md" />
 *   </MediaCardLeadingContent>
 *   <MediaCardTrailingContent>
 *     <MediaCardTitle>Card title</MediaCardTitle>
 *     <MediaCardDescription>Card description</MediaCardDescription>
 *   </MediaCardTrailingContent>
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

  const styles = useStyleSheet(
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
        padding: t.spacings.s12,
        backgroundColor: t.colors.bg.interactive,
      },
      image: {
        ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      },
      content: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: t.spacings.s8,
        width: t.sizes.full,
        minWidth: 0,
      },
      closeButton: {
        position: 'absolute',
        top: t.spacings.s12,
        right: t.spacings.s12,
      },
    }),
    [],
  );

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
        style={styles.image}
        accessible={false}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
        testID='media-card-image'
      />

      {imageLoaded && (
        <>
          <LinearGradient
            direction='to-top'
            stops={[
              { color: 'rgba(0, 0, 0, 0.80)', offset: 0 },
              { color: 'rgba(0, 0, 0, 0)', offset: 0.75 },
            ]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents='none'
            accessible={false}
          />

          <RadialGradient
            center={{ x: 1, y: 0 }}
            stops={[
              { color: 'rgba(0, 0, 0, 0.80)', offset: 0 },
              { color: 'transparent', offset: 1 },
            ]}
            style={StyleSheet.absoluteFillObject}
            pointerEvents='none'
            accessible={false}
          />
        </>
      )}

      <View style={styles.content}>{children}</View>

      <Pressable
        style={({ pressed }) => [
          styles.closeButton,
          pressed && { opacity: 0.6 },
        ]}
        onPress={onClose}
        accessibilityRole='button'
        accessibilityLabel={t('common.closeAriaLabel')}
        hitSlop={8}
        testID='media-card-close-button'
      >
        <Close size={20} style={{ color: WHITE }} />
      </Pressable>
    </Pressable>
  );
};

MediaCard.displayName = 'MediaCard';
