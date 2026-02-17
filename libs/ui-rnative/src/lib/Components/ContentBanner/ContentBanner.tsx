import { isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { StyleSheet, View } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import { Close } from '../../Symbols';
import { InteractiveIcon } from '../InteractiveIcon';
import { Box, Text } from '../Utility';
import {
  ContentBannerContentProps,
  ContentBannerDescriptionProps,
  ContentBannerProps,
  ContentBannerTitleProps,
} from './types';

/**
 * Container for the text content (title and description) within the content banner.
 */
export const ContentBannerContent = ({
  children,
  lx = {},
  style,
  ref,
  ...viewProps
}: ContentBannerContentProps) => {
  const styles = useStyleSheet(
    (t) => ({
      content: {
        flex: 1,
        minWidth: 0,
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
      style={StyleSheet.flatten([styles.content, style])}
      {...viewProps}
    >
      {children}
    </Box>
  );
};

ContentBannerContent.displayName = 'ContentBannerContent';

/**
 * The main title of the content banner.
 */
export const ContentBannerTitle = ({
  children,
  lx = {},
  style,
  ref,
  ...textProps
}: ContentBannerTitleProps) => {
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

  if (isTextChildren(children)) {
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
  }

  return (
    <Box lx={lx} style={StyleSheet.flatten([style])} {...textProps}>
      {children}
    </Box>
  );
};

ContentBannerTitle.displayName = 'ContentBannerTitle';

/**
 * Optional description text below the title.
 */
export const ContentBannerDescription = ({
  children,
  lx = {},
  style,
  ref,
  ...textProps
}: ContentBannerDescriptionProps) => {
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

  if (isTextChildren(children)) {
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
  }

  return (
    <Box lx={lx} style={StyleSheet.flatten([style])} {...textProps}>
      {children}
    </Box>
  );
};

ContentBannerDescription.displayName = 'ContentBannerDescription';

/**
 * A content banner component for displaying a composable banner with an optional
 * leading visual, title, description, and close button.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-contentbanner-overview--docs Storybook}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the banner's core appearance (colors, padding, etc).
 *
 * @example
 * import { ContentBanner, ContentBannerContent, ContentBannerTitle, ContentBannerDescription, Spot } from '@ledgerhq/lumen-ui-rnative';
 * import { Wallet } from '@ledgerhq/lumen-ui-rnative/symbols';
 *
 * <ContentBanner onClose={() => {}}>
 *   <Spot appearance="icon" icon={Wallet} size={48} />
 *   <ContentBannerContent>
 *     <ContentBannerTitle>Title</ContentBannerTitle>
 *     <ContentBannerDescription>Description text</ContentBannerDescription>
 *   </ContentBannerContent>
 * </ContentBanner>
 */
export const ContentBanner = ({
  children,
  lx = {},
  style,
  onClose,
  closeAriaLabel,
  ref,
  ...viewProps
}: ContentBannerProps) => {
  const { t } = useCommonTranslation();

  const styles = useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        width: t.sizes.full,
        alignItems: 'center',
        gap: t.spacings.s12,
        borderRadius: t.borderRadius.md,
        padding: t.spacings.s12,
        backgroundColor: t.colors.bg.surface,
      },
      closeButton: {
        position: 'absolute',
        top: t.spacings.s8,
        right: t.spacings.s8,
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
      {onClose && (
        <View style={styles.closeButton}>
          <InteractiveIcon
            iconType='stroked'
            testID='content-banner-close-button'
            onPress={() => onClose()}
            accessibilityLabel={
              closeAriaLabel || t('components.banner.closeAriaLabel')
            }
          >
            <Close size={16} />
          </InteractiveIcon>
        </View>
      )}
    </Box>
  );
};

ContentBanner.displayName = 'ContentBanner';
