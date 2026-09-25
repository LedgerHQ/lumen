import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture } from 'react-native-gesture-handler';
import { withTiming, type SharedValue } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

const SWIPE_DISMISS_THRESHOLD_PX = 80;

type UseToastGestureArgs = {
  dismissible: boolean;
  translateX: SharedValue<number>;
  onHoldChange: (held: boolean) => void;
  onSwipeDismiss: () => void;
};

type UseToastGestureReturn = {
  gesture: ReturnType<typeof Gesture.Simultaneous>;
};

export const useToastGesture = ({
  dismissible,
  translateX,
  onHoldChange,
  onSwipeDismiss,
}: UseToastGestureArgs): UseToastGestureReturn => {
  const { width: windowWidth } = useWindowDimensions();

  const onSwipeDismissRef = useRef(onSwipeDismiss);
  onSwipeDismissRef.current = onSwipeDismiss;
  const handleSwipeDismissRef = useRef(() => {
    onSwipeDismissRef.current();
  });

  const onHoldChangeRef = useRef(onHoldChange);
  onHoldChangeRef.current = onHoldChange;
  const activeGesturesRef = useRef(0);
  const handleHoldStartRef = useRef(() => {
    activeGesturesRef.current += 1;
    onHoldChangeRef.current(true);
  });
  const handleHoldEndRef = useRef(() => {
    activeGesturesRef.current = Math.max(0, activeGesturesRef.current - 1);
    if (activeGesturesRef.current === 0) onHoldChangeRef.current(false);
  });

  const pan = Gesture.Pan()
    .enabled(dismissible)
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .onBegin(() => {
      'worklet';
      scheduleOnRN(handleHoldStartRef.current);
    })
    .onFinalize(() => {
      'worklet';
      scheduleOnRN(handleHoldEndRef.current);
    })
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

  const hold = Gesture.LongPress()
    .minDuration(0)
    .cancelsTouchesInView(false)
    .onStart(() => {
      'worklet';
      scheduleOnRN(handleHoldStartRef.current);
    })
    .onFinalize(() => {
      'worklet';
      scheduleOnRN(handleHoldEndRef.current);
    });

  return { gesture: Gesture.Simultaneous(pan, hold) };
};
