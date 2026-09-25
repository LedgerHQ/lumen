import {
  createToastController,
  useToastQueue,
} from '@ledgerhq/lumen-utils-shared';
import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastCollapse } from './hooks/useToastCollapse';
import { ToastContextProvider, useToastContext } from './hooks/useToastContext';
import { useToastGesture } from './hooks/useToastGesture';
import { useToastLifecycle } from './hooks/useToastLifecycle';
import { useToastMotion } from './hooks/useToastMotion';
import { useToastViewportStyles } from './hooks/useToastViewportStyles';
import { Toast } from './Toast';
import type { ToastItem, ToastPosition, ToastProviderProps } from './types';

export { useToastContext };

const ToastQueueItem = ({
  item,
  position,
  onDismiss,
}: {
  item: ToastItem;
  position: ToastPosition;
  onDismiss: () => void;
}) => {
  const exiting = item.exiting ?? false;
  const [held, setHeld] = useState(false);

  useToastLifecycle({
    durationMs: item.durationMs,
    paused: held,
    exiting,
    onDismiss,
  });
  const { animatedStyle, translateX, markDismissedViaSwipe } = useToastMotion({
    position,
    exiting,
  });
  const { gesture } = useToastGesture({
    dismissible: item.dismissible,
    translateX,
    onHoldChange: setHeld,
    onSwipeDismiss: () => {
      markDismissedViaSwipe();
      onDismiss();
    },
  });
  const { collapseStyle, handleLayout } = useToastCollapse({
    position,
    exiting,
  });

  return (
    <Animated.View style={collapseStyle}>
      <GestureDetector gesture={gesture}>
        <Animated.View
          testID='toast-entry'
          style={animatedStyle}
          onLayout={handleLayout}
        >
          <Toast
            appearance={item.appearance}
            loading={item.loading}
            title={item.title}
            action={item.action}
          />
        </Animated.View>
      </GestureDetector>
    </Animated.View>
  );
};

/**
 * Provides the imperative toast controller to `useToast` and renders the
 * queue viewport as an absolutely-positioned overlay. Mount once, near the
 * app root — there is no separate viewport component to mount.
 *
 * Toasts are dismissed by swiping left or right; there is no close icon.
 * Touching a toast — a hold or an in-progress swipe — pauses its auto-dismiss
 * timer until the finger is released.
 * Requires `react-native-gesture-handler`'s `GestureHandlerRootView` at the
 * app root.
 *
 * @see {@link https://ldls-react-native.vercel.app/?path=/docs/rnative-toast--docs Guidelines}
 *
 * @example
 * import { ToastProvider } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <ToastProvider position="bottom" maxItems={1}>
 *       <Screens />
 *     </ToastProvider>
 *   );
 * }
 */
export const ToastProvider = ({
  children,
  maxItems = 1,
  position = 'bottom',
  insets = {},
  durations,
}: ToastProviderProps) => {
  const { items, add, update, dismiss, dismissAll } = useToastQueue(
    maxItems,
    durations,
  );
  const safeAreaInsets = useSafeAreaInsets();
  const viewportStyles = useToastViewportStyles({
    position,
    safeAreaTop: safeAreaInsets.top,
    safeAreaBottom: safeAreaInsets.bottom,
    insets,
  });

  const controller = useMemo(
    () => createToastController({ add, update, dismiss, dismissAll }),
    [add, update, dismiss, dismissAll],
  );

  const visibleItems = items.slice(0, maxItems);

  return (
    <ToastContextProvider value={controller}>
      {children}
      <View
        testID='toast-viewport'
        pointerEvents='box-none'
        style={viewportStyles.root}
      >
        {visibleItems.map((item) => (
          <ToastQueueItem
            key={item.id}
            item={item}
            position={position}
            onDismiss={() => dismiss(item.id)}
          />
        ))}
      </View>
    </ToastContextProvider>
  );
};
