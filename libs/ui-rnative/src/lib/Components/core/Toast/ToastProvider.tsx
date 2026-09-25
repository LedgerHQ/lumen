import {
  createSafeContext,
  createToastController,
  useToastQueue,
  useToastTimer,
} from '@ledgerhq/lumen-utils-shared';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';
import { useStyleSheet, useTheme } from '../../../../styles';
import { useTimingConfig } from '../../animations/useTimingConfig';
import { Toast } from './Toast';
import type {
  ToastController,
  ToastInsets,
  ToastItem,
  ToastPosition,
  ToastProviderProps,
} from './types';

const EXIT_ANIMATION_MS = 300;
const SWIPE_DISMISS_THRESHOLD_PX = 80;

const [ToastContextProvider, useToastContext] =
  createSafeContext<ToastController>('ToastProvider');

export { useToastContext };

const useToastViewportStyles = ({
  position,
  safeAreaTop,
  safeAreaBottom,
  insets,
}: {
  position: ToastPosition;
  safeAreaTop: number;
  safeAreaBottom: number;
  insets: ToastInsets;
}) =>
  useStyleSheet(
    (t) => ({
      root: {
        position: 'absolute',
        left: insets.left ?? 0,
        right: insets.right ?? 0,
        zIndex: 50,
        alignItems: 'center',
        flexDirection: position === 'top' ? 'column' : 'column-reverse',
        top:
          position === 'top'
            ? safeAreaTop + (insets.top ?? 0) + t.spacings.s24
            : undefined,
        bottom:
          position === 'bottom'
            ? safeAreaBottom + (insets.bottom ?? 0) + t.spacings.s24
            : undefined,
      },
    }),
    [
      position,
      safeAreaTop,
      safeAreaBottom,
      insets.top,
      insets.bottom,
      insets.left,
      insets.right,
    ],
  );

const useToastLifecycle = ({
  durationMs,
  exiting,
  onDismiss,
}: {
  durationMs: number;
  exiting: boolean;
  onDismiss: () => void;
}): void => {
  useToastTimer({ durationMs, paused: false, exiting, onExpire: onDismiss });

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  useEffect(() => {
    if (!exiting) return;
    const timeoutId = setTimeout(
      () => onDismissRef.current(),
      EXIT_ANIMATION_MS,
    );
    return () => clearTimeout(timeoutId);
  }, [exiting]);
};

const useToastMotion = ({
  position,
  exiting,
  dismissible,
  onDismiss,
}: {
  position: ToastPosition;
  exiting: boolean;
  dismissible: boolean;
  onDismiss: () => void;
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const enterTiming = useTimingConfig({ duration: 200, easing: 'easeIn' });
  const exitTiming = useTimingConfig({ duration: 200, easing: 'easeOut' });
  const enterOffset = position === 'top' ? -10 : 10;

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(enterOffset);
  const translateX = useSharedValue(0);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;
  const dismissedViaSwipeRef = useRef(false);
  const handleSwipeDismissRef = useRef(() => {
    dismissedViaSwipeRef.current = true;
    onDismissRef.current();
  });

  useEffect(() => {
    translateY.value = withTiming(0, enterTiming);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    opacity.value = withTiming(
      exiting ? 0 : 1,
      exiting ? exitTiming : enterTiming,
    );
    if (exiting && !dismissedViaSwipeRef.current) {
      translateY.value = withTiming(enterOffset, exitTiming);
    }
  }, [exiting, enterTiming, exitTiming, enterOffset, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
      transform: [
        { translateY: translateY.value },
        { translateX: translateX.value },
      ],
    }),
    [opacity, translateY, translateX],
  );

  const pan = Gesture.Pan()
    .enabled(dismissible)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onUpdate((e) => {
      'worklet';
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      'worklet';
      if (Math.abs(e.translationX) > SWIPE_DISMISS_THRESHOLD_PX) {
        translateX.value = withTiming(
          e.translationX > 0 ? windowWidth : -windowWidth,
          { duration: 150 },
        );
        scheduleOnRN(handleSwipeDismissRef.current);
      } else {
        translateX.value = withTiming(0, { duration: 150 });
      }
    });

  return { animatedStyle, pan };
};

const useToastCollapse = ({
  position,
  exiting,
}: {
  position: ToastPosition;
  exiting: boolean;
}) => {
  const { theme } = useTheme();
  const [measuredHeight, setMeasuredHeight] = useState<number>();
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setMeasuredHeight(event.nativeEvent.layout.height);
  }, []);

  const collapseStyle = useMemo(() => {
    const fullHeight =
      measuredHeight === undefined
        ? undefined
        : measuredHeight + theme.spacings.s8;
    return {
      width: '100%',
      justifyContent: position === 'top' ? 'flex-start' : 'flex-end',
      height: exiting ? 0 : fullHeight,
      transitionProperty: 'height',
      transitionDuration: EXIT_ANIMATION_MS,
      transitionTimingFunction: 'ease-out',
    } as const;
  }, [exiting, measuredHeight, position, theme.spacings.s8]);

  return { collapseStyle, handleLayout };
};

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

  useToastLifecycle({ durationMs: item.durationMs, exiting, onDismiss });
  const { animatedStyle, pan } = useToastMotion({
    position,
    exiting,
    dismissible: item.dismissible,
    onDismiss,
  });
  const { collapseStyle, handleLayout } = useToastCollapse({
    position,
    exiting,
  });

  return (
    <Animated.View style={collapseStyle}>
      <GestureDetector gesture={pan}>
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
