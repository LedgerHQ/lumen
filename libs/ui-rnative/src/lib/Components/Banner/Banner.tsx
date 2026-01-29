import { isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useCommonTranslation } from '../../../i18n';
import { useStyleSheet } from '../../../styles';
import {
  InformationFill,
  CheckmarkCircleFill,
  WarningFill,
  DeleteCircleFill,
  Close,
} from '../../Symbols';
import { IconProps } from '../Icon';
import { IconButton } from '../IconButton';
import { Box } from '../Utility';
import { Wrap } from '../Wrap';
import { BannerProps } from './types';

type Appearance = NonNullable<BannerProps['appearance']>;

const iconColorMap: Record<
  Appearance,
  'base' | 'success' | 'warning' | 'error'
> = {
  info: 'base',
  success: 'success',
  warning: 'warning',
  error: 'error',
};

const useStyles = ({ appearance }: { appearance: Appearance }) => {
  return useStyleSheet(
    (t) => {
      const bgColors: Record<Appearance, string> = {
        info: t.colors.bg.surface,
        success: t.colors.bg.success,
        warning: t.colors.bg.warning,
        error: t.colors.bg.error,
      };

      return {
        root: {
          flexDirection: 'row',
          width: t.sizes.full,
          alignItems: 'flex-start',
          gap: t.spacings.s8,
          borderRadius: t.borderRadius.md,
          padding: t.spacings.s16,
          backgroundColor: bgColors[appearance],
        },
        iconWrapper: {
          flexShrink: 0,
          flexDirection: 'row',
          alignItems: 'flex-start',
          paddingVertical: t.spacings.s4,
        },
        contentWrapper: {
          marginRight: t.spacings.s8,
          flex: 1,
          flexDirection: 'column',
          gap: t.spacings.s8,
          paddingVertical: t.spacings.s4,
        },
        textWrapper: {
          flexDirection: 'column',
          gap: t.spacings.s4,
        },
        title: StyleSheet.flatten([
          t.typographies.body1SemiBold,
          {
            color: t.colors.text.base,
          },
        ]),
        description: StyleSheet.flatten([
          t.typographies.body2,
          {
            color: t.colors.text.base,
          },
        ]),
        actionsWrapper: {
          flexDirection: 'row',
          gap: t.spacings.s4,
        },
      };
    },
    [appearance],
  );
};

const iconsMap: Record<Appearance, ComponentType<IconProps>> = {
  info: InformationFill,
  success: CheckmarkCircleFill,
  warning: WarningFill,
  error: DeleteCircleFill,
};

/**
 * A banner component for displaying informational, success, warning, or error messages with optional description, action buttons, and close button.
 *
 * The appearance determines the color scheme and icon used.
 *
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-banner-overview--docs Storybook}
 * @see {@link https://ldls.vercel.app/?path=/docs/communication-banner-implementation--docs#dos-and-donts Guidelines}
 *
 * @warning The `lx` prop should only be used for layout adjustments like margins or positioning.
 * Do not use it to modify the banner's core appearance (colors, padding, etc). Use the `appearance` prop instead.
 *
 * @example
 * import { Banner } from '@ledgerhq/lumen-ui-rnative';
 *
 * // Basic info banner
 * <Banner title="Information" appearance="info" />
 *
 * // Banner with description and actions
 * <Banner
 *   title="Success"
 *   appearance="success"
 *   description="Your action was successful."
 *   primaryAction={<Button appearance="transparent" size="sm" onPress={() => {}}>Primary</Button>}
 *   secondaryAction={<Button appearance="no-background" size="sm" onPress={() => {}}>Secondary</Button>}
 * />
 *
 * // Error banner with close
 * <Banner
 *   title="Error"
 *   appearance="error"
 *   onClose={() => console.log('Close')}
 *   closeAriaLabel="Close banner"
 * />
 */
export const Banner = ({
  appearance = 'info',
  title,
  description,
  primaryAction,
  secondaryAction,
  lx = {},
  style,
  onClose,
  closeAriaLabel,
  ref,
  ...props
}: BannerProps) => {
  const { t } = useCommonTranslation();
  const styles = useStyles({ appearance });
  const IconComponent = iconsMap[appearance];
  const iconColor = iconColorMap[appearance];

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      {...props}
    >
      <View style={styles.iconWrapper}>
        <IconComponent lx={{ color: iconColor }} />
      </View>
      <View style={styles.contentWrapper}>
        <View style={styles.textWrapper}>
          {title && (
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
          )}
          {description && (
            <View>
              <Wrap
                if={isTextChildren(description)}
                with={(children) => (
                  <Text style={styles.description}>{children}</Text>
                )}
              >
                {description}
              </Wrap>
            </View>
          )}
        </View>
        {(primaryAction || secondaryAction) && (
          <View style={styles.actionsWrapper}>
            {primaryAction}
            {secondaryAction}
          </View>
        )}
      </View>
      {onClose && (
        <IconButton
          testID='banner-close-button'
          appearance='transparent'
          size='xs'
          icon={Close}
          onPress={() => onClose()}
          accessibilityLabel={
            closeAriaLabel || t('components.banner.closeAriaLabel')
          }
        />
      )}
    </Box>
  );
};

Banner.displayName = 'Banner';
