import { useRef } from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, type PanGesture } from 'react-native-gesture-handler';
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
  gesture: PanGesture;
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
  const handleHoldStartRef = useRef(() => {
    onHoldChangeRef.current(true);
  });
  const handleHoldEndRef = useRef(() => {
    onHoldChangeRef.current(false);
  });

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-10, 10])
    .cancelsTouchesInView(false)
    .onTouchesDown(() => {
      'worklet';
      scheduleOnRN(handleHoldStartRef.current);
    })
    .onTouchesUp((e) => {
      'worklet';
      if (e.numberOfTouches === 0) scheduleOnRN(handleHoldEndRef.current);
    })
    .onTouchesCancelled(() => {
      'worklet';
      scheduleOnRN(handleHoldEndRef.current);
    })
    .onFinalize(() => {
      'worklet';
      scheduleOnRN(handleHoldEndRef.current);
    })
    .onUpdate((e) => {
      'worklet';
      if (!dismissible) return;
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      'worklet';
      if (!dismissible) return;
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

  return { gesture: pan };
};
