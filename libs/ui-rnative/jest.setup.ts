/* eslint-disable @typescript-eslint/no-explicit-any */

// Fix for RN 0.79+ Animated API issues in test environment
// The Animated module tries to connect to native views which don't exist in Jest
import { Animated } from 'react-native';

const originalTiming = Animated.timing;
const originalSpring = Animated.spring;

// Override Animated.timing to force useNativeDriver: false in tests
(Animated as any).timing = (
  value: Animated.Value | Animated.ValueXY,
  config: Animated.TimingAnimationConfig,
): Animated.CompositeAnimation => {
  return originalTiming(value, { ...config, useNativeDriver: false });
};

// Override Animated.spring to force useNativeDriver: false in tests
Animated.spring = (
  value: Animated.Value | Animated.ValueXY,
  config: Animated.SpringAnimationConfig,
): Animated.CompositeAnimation => {
  return originalSpring(value, { ...config, useNativeDriver: false });
};

// Mock @gorhom/bottom-sheet with more detailed prop tracking
jest.mock('@gorhom/bottom-sheet', () => {
  const mockReact = jest.requireActual<typeof import('react')>('react');
  const mockRN =
    jest.requireActual<typeof import('react-native')>('react-native');

  const mockRef = {
    present: jest.fn(),
    dismiss: jest.fn(),
    expand: jest.fn(),
    collapse: jest.fn(),
    close: jest.fn(),
    snapToIndex: jest.fn(),
    snapToPosition: jest.fn(),
    forceClose: jest.fn(),
  };

  const MockBottomSheetModal = mockReact.forwardRef((props: any, ref: any) => {
    mockReact.useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') ref(mockRef);
        else ref.current = mockRef;
      }
    }, [ref]);

    return mockReact.createElement(mockRN.View, {
      testID: props.testID,
      'data-snap-points': JSON.stringify(props.snapPoints),
      'data-enable-dynamic-sizing': String(props.enableDynamicSizing),
      'data-enable-pan-down-to-close': String(props.enablePanDownToClose),
      'data-detached': String(props.detached),
      'data-enable-handle-panning-gesture': String(
        props.enableHandlePanningGesture,
      ),
      children: props.children,
    } as any);
  });

  return {
    __esModule: true,
    default: MockBottomSheetModal,
    BottomSheetModal: MockBottomSheetModal,
    BottomSheetModalProvider: ({ children }: any) =>
      mockReact.createElement(mockRN.View, { children }),
    BottomSheetBackdrop: () => null,
    BottomSheetScrollView: ({ children }: any) =>
      mockReact.createElement(mockRN.ScrollView, { children }),
    BottomSheetView: ({ children }: any) =>
      mockReact.createElement(mockRN.View, { children }),
    useBottomSheet: () => mockRef,
    SNAP_POINT_TYPE: { DYNAMIC: 0, PROVIDED: 1 },
  };
});

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const mockRN =
    jest.requireActual<typeof import('react-native')>('react-native');

  const AnimatedView = mockRN.View;
  const AnimatedText = mockRN.Text;
  const AnimatedImage = mockRN.Image;
  const AnimatedScrollView = mockRN.ScrollView;

  const Reanimated = {
    __esModule: true,
    default: {
      View: AnimatedView,
      Text: AnimatedText,
      Image: AnimatedImage,
      ScrollView: AnimatedScrollView,
      createAnimatedComponent: (component: any) => component,
    },
    View: AnimatedView,
    Text: AnimatedText,
    Image: AnimatedImage,
    ScrollView: AnimatedScrollView,
    createAnimatedComponent: (component: any) => component,
    useSharedValue: (value: any) => ({ value }),
    useAnimatedStyle: (_cb: any) => {
      return {};
    },
    withTiming: (value: any) => value,
    withSpring: (value: any) => value,
    withDecay: (value: any) => value,
    withDelay: (value: any) => value,
    withSequence: (...values: any[]) => values[0],
    withRepeat: (value: any) => value,
    useAnimatedGestureHandler: (handlers: any) => handlers,
    useAnimatedScrollHandler: () => () => {
      return;
    },
    useAnimatedReaction: () => {
      return;
    },
    runOnJS: (fn: any) => fn,
    runOnUI: (fn: any) => fn,
    Easing: {
      linear: (t: number) => t,
      ease: (t: number) => t,
      quad: (t: number) => t * t,
      cubic: (t: number) => t * t * t,
      bezier: () => (t: number) => t,
      in: (easing: any) => easing,
      out: (easing: any) => easing,
      inOut: (easing: any) => easing,
    },
  };

  return Reanimated;
});
