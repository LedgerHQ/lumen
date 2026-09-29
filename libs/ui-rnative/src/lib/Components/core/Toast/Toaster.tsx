import {
  resolveDurationMs,
  resolveMaxItems,
  toastStore,
  useToastBacklog,
  useToastLifecycle,
} from '@ledgerhq/lumen-utils-shared';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastCollapse } from './hooks/useToastCollapse';
import { useToastGesture } from './hooks/useToastGesture';
import { useToastMotion } from './hooks/useToastMotion';
import { useToastViewportStyles } from './hooks/useToastViewportStyles';
import { Toast } from './Toast';
import type { ToasterProps, ToastItem, ToastPosition } from './types';

const ToastQueueItem = ({
  item,
  durationMs,
  position,
  onDismiss,
}: {
  item: ToastItem;
  durationMs: number;
  position: ToastPosition;
  onDismiss: () => void;
}) => {
  const exiting = item.exiting ?? false;
  const [held, setHeld] = useState(false);

  useToastLifecycle({ durationMs, paused: held, exiting, onDismiss });
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
 * Subscribes to the module-level toast store and renders the queue viewport
 * as an absolutely-positioned overlay. Mount it once, near the app root — it
 * takes no children. `toast.*` from `@ledgerhq/lumen-utils-shared` works even
 * before this mounts, or from outside the React tree entirely.
 *
 * Mount exactly one `<Toaster />` for the whole app. Every instance renders
 * the full queue, so a second one duplicates every toast on screen — mounting
 * more than one logs a console warning in development.
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
 * import { Toaster } from '@ledgerhq/lumen-ui-rnative';
 *
 * function App() {
 *   return (
 *     <>
 *       <Toaster position="bottom" maxItems={1} />
 *       <Screens />
 *     </>
 *   );
 * }
 */
export const Toaster = ({
  maxItems = 1,
  position = 'bottom',
  insets = {},
  durations,
}: ToasterProps) => {
  const items = useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
  );
  const safeAreaInsets = useSafeAreaInsets();
  const viewportStyles = useToastViewportStyles({
    position,
    safeAreaTop: safeAreaInsets.top,
    safeAreaBottom: safeAreaInsets.bottom,
    insets,
  });

  useEffect(() => toastStore.registerRenderer(), []);

  const visibleSlots = resolveMaxItems(maxItems);
  const visibleItems = items.slice(0, visibleSlots);
  useToastBacklog(items, visibleSlots);

  return (
    <View
      testID='toast-viewport'
      pointerEvents='box-none'
      style={viewportStyles.root}
    >
      {visibleItems.map((item) => (
        <ToastQueueItem
          key={item.id}
          item={item}
          durationMs={resolveDurationMs(item, durations)}
          position={position}
          onDismiss={() => toastStore.dismiss(item.id)}
        />
      ))}
    </View>
  );
};
