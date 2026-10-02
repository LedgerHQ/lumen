import { useEffect } from 'react';
import {
  AccessibilityInfo,
  Platform,
  type AccessibilityActionEvent,
  type AccessibilityActionInfo,
  type ViewProps,
} from 'react-native';
import { useCommonTranslation } from '../../../../../i18n';
import type { ToastItem } from '../types';

type UseToastAccessibilityArgs = {
  item: ToastItem;
  exiting: boolean;
  onDismiss: () => void;
};

type ToastAccessibilityProps = Pick<
  ViewProps,
  | 'accessible'
  | 'accessibilityLabel'
  | 'accessibilityState'
  | 'accessibilityActions'
  | 'onAccessibilityAction'
  | 'onAccessibilityEscape'
>;

const DISMISS_ACTION = 'dismiss';
const TOAST_ACTION = 'toastAction';

/**
 * Screen readers capture swipes for their own navigation, so the swipe-to-dismiss
 * gesture is unreachable for them. The toast is exposed as a single element
 * whose dismissal and inline action are custom accessibility actions instead
 * (VoiceOver rotor, TalkBack actions menu, iOS two-finger scrub to escape).
 */
export const useToastAccessibility = ({
  item,
  exiting,
  onDismiss,
}: UseToastAccessibilityArgs): ToastAccessibilityProps => {
  const { t } = useCommonTranslation();
  const { title, appearance, loading, dismissible, action } = item;

  useEffect(() => {
    if (Platform.OS !== 'ios' || exiting) return;
    AccessibilityInfo.announceForAccessibilityWithOptions(title, {
      queue: appearance !== 'warning' && appearance !== 'error',
    });
  }, [title, appearance, exiting]);

  const accessibilityActions: AccessibilityActionInfo[] = [];
  if (action) {
    accessibilityActions.push({ name: TOAST_ACTION, label: action.label });
  }
  if (dismissible) {
    accessibilityActions.push({
      name: DISMISS_ACTION,
      label: t('common.closeAriaLabel'),
    });
  }

  const handleAccessibilityAction = (event: AccessibilityActionEvent): void => {
    switch (event.nativeEvent.actionName) {
      case TOAST_ACTION:
        action?.onAction();
        break;
      case DISMISS_ACTION:
        onDismiss();
        break;
    }
  };

  return {
    accessible: true,
    accessibilityLabel: title,
    accessibilityState: { busy: loading },
    accessibilityActions,
    onAccessibilityAction: handleAccessibilityAction,
    onAccessibilityEscape: dismissible ? onDismiss : undefined,
  };
};
