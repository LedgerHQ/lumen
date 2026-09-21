import type { ComponentType } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useStyleSheet } from '../../../../styles';
import { Box } from '../../primitives';
import {
  CheckmarkCircleFill,
  DeleteCircleFill,
  WarningFill,
} from '../../symbols';
import type { IconProps } from '../../symbols/Icon';
import { Button } from '../Button';
import { Spinner } from '../Spinner';
import type { ToastAppearance, ToastProps } from './types';

type NonInfoAppearance = Exclude<ToastAppearance, 'info'>;

const TITLE_MAX_LINES = 5;

const iconsMap: Record<NonInfoAppearance, ComponentType<IconProps>> = {
  success: CheckmarkCircleFill,
  warning: WarningFill,
  error: DeleteCircleFill,
};

const iconColorMap: Record<
  NonInfoAppearance,
  'successOnInteractive' | 'warningOnInteractive' | 'errorOnInteractive'
> = {
  success: 'successOnInteractive',
  warning: 'warningOnInteractive',
  error: 'errorOnInteractive',
};

const useToastStyles = ({ hasLeading }: { hasLeading: boolean }) =>
  useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'flex-end',
        minHeight: t.sizes.s56,
        width: '100%',
        columnGap: t.spacings.s8,
        rowGap: t.spacings.s4,
        borderRadius: t.borderRadius.md,
        backgroundColor: t.colors.bg.interactive,
        paddingVertical: t.spacings.s8,
        paddingRight: t.spacings.s10,
        paddingLeft: hasLeading ? t.spacings.s12 : t.spacings.s16,
      },
      content: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: t.spacings.s8,
        minHeight: t.sizes.s40,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
      },
      iconWrapper: {
        flexShrink: 0,
      },
      title: StyleSheet.flatten([
        t.typographies.body2,
        { color: t.colors.text.onInteractive, flexShrink: 1 },
      ]),
    }),
    [hasLeading],
  );

/**
 * A single toast item: an inverted surface with a status icon or spinner, a
 * title that wraps up to five lines, and an optional action inline beside
 * the title. When the two cannot share a row, the action wraps onto its own
 * row, right-aligned. Dismissal is a swipe gesture, owned by `ToastProvider`
 * — this component never dismisses itself.
 *
 * This is the presentational piece. For the queue, timing and imperative API,
 * use `ToastProvider` + `useToast`.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-toast--docs Guidelines}
 *
 * @example
 * import { Toast } from '@ledgerhq/lumen-ui-rnative';
 *
 * <Toast appearance="success" title="Payment done" />
 *
 * @example
 * // Loading with an action
 * <Toast loading title="Uploading…" action={{ label: 'Cancel', onAction: () => {} }} />
 */
export const Toast = ({
  appearance = 'info',
  loading = false,
  title,
  action,
  lx = {},
  style,
  ref,
  ...props
}: ToastProps) => {
  const hasLeading = loading || appearance !== 'info';
  const styles = useToastStyles({ hasLeading });
  const IconComponent = appearance === 'info' ? null : iconsMap[appearance];

  return (
    <Box
      ref={ref}
      lx={lx}
      style={StyleSheet.flatten([styles.root, style])}
      accessibilityLiveRegion={
        appearance === 'warning' || appearance === 'error'
          ? 'assertive'
          : 'polite'
      }
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <View style={styles.iconWrapper}>
            <Spinner testID='toast-spinner' size={20} color='onInteractive' />
          </View>
        ) : (
          IconComponent && (
            <View testID='toast-icon' style={styles.iconWrapper}>
              <IconComponent
                size={20}
                lx={{ color: iconColorMap[appearance as NonInfoAppearance] }}
              />
            </View>
          )
        )}
        <Text style={styles.title} numberOfLines={TITLE_MAX_LINES}>
          {title}
        </Text>
      </View>
      {action && (
        <Button appearance='base' size='sm' onPress={action.onAction}>
          {action.label}
        </Button>
      )}
    </Box>
  );
};
