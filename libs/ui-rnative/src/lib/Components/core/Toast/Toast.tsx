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
        alignItems: 'center',
        minHeight: t.sizes.s56,
        width: '100%',
        gap: t.spacings.s8,
        borderRadius: t.borderRadius.md,
        backgroundColor: t.colors.bg.interactive,
        paddingVertical: t.spacings.s8,
        paddingRight: t.spacings.s10,
        paddingLeft: hasLeading ? t.spacings.s12 : t.spacings.s16,
      },
      iconWrapper: {
        flexShrink: 0,
      },
      title: StyleSheet.flatten([
        t.typographies.body2,
        { color: t.colors.text.onInteractive, flex: 1 },
      ]),
    }),
    [hasLeading],
  );

/**
 * A single toast item: an inverted, compact surface with a status icon or
 * spinner, a one-line title and an optional trailing action. Dismissal is a
 * swipe gesture, owned by `ToastProvider` — this component never dismisses
 * itself.
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
      {loading ? (
        <View style={styles.iconWrapper}>
          <Spinner
            testID='toast-spinner'
            size={20}
            lx={{ color: 'onInteractive' }}
          />
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
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {action && (
        <Button appearance='base' size='sm' onPress={action.onAction}>
          {action.label}
        </Button>
      )}
    </Box>
  );
};
