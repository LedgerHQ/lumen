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

const useToastStyles = ({
  hasLeading,
  hasAction,
}: {
  hasLeading: boolean;
  hasAction: boolean;
}) =>
  useStyleSheet(
    (t) => ({
      root: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: t.spacings.s8,
        minHeight: t.sizes.s56,
        width: '100%',
        borderRadius: t.borderRadius.md,
        backgroundColor: t.colors.bg.interactive,
        paddingVertical: t.spacings.s8,
        paddingRight: t.spacings.s20,
        paddingLeft: hasLeading ? t.spacings.s12 : t.spacings.s16,
      },
      iconWrapper: {
        flexShrink: 0,
        paddingTop: t.spacings.s10,
      },
      textAction: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        columnGap: t.spacings.s8,
        rowGap: t.spacings.s4,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 'auto',
      },
      title: StyleSheet.flatten([
        t.typographies.body2,
        {
          color: t.colors.text.onInteractive,
          flexShrink: 0,
          flexGrow: 1,
          flexBasis: 'auto',
          paddingTop: t.spacings.s10,
          paddingBottom: hasAction ? undefined : t.spacings.s10,
          paddingRight: t.spacings.s16,
        },
      ]),
      actionButton: {
        marginLeft: hasLeading ? -t.spacings.s16 : undefined,
      },
    }),
    [hasLeading, hasAction],
  );

/**
 * A single toast item: an inverted surface with a status icon or spinner, a
 * title that wraps up to five lines, and an optional action inline beside
 * the title. When the two cannot share a row, the action wraps onto its own
 * row, under the title's left edge. Dismissal is a swipe gesture, owned by
 * `ToastProvider` — this component never dismisses itself.
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
  ...props
}: ToastProps) => {
  const hasLeading = loading || appearance !== 'info';
  const styles = useToastStyles({ hasLeading, hasAction: Boolean(action) });
  const IconComponent = appearance === 'info' ? null : iconsMap[appearance];

  return (
    <Box
      style={styles.root}
      accessibilityLiveRegion={
        appearance === 'warning' || appearance === 'error'
          ? 'assertive'
          : 'polite'
      }
      {...props}
    >
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
      <View testID='toast-text-action' style={styles.textAction}>
        <Text style={styles.title} numberOfLines={TITLE_MAX_LINES}>
          {title}
        </Text>
        {action && (
          <Button
            appearance='base'
            size='sm'
            onPress={action.onAction}
            style={styles.actionButton}
          >
            {action.label}
          </Button>
        )}
      </View>
    </Box>
  );
};
