import { type ReactNode } from 'react';

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/consistent-type-imports */

// Fix for RN 0.79+ Animated API issues in test environment
// The Animated module tries to connect to native views which don't exist in Jest
/* eslint-disable-next-line no-restricted-imports */
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

jest.mock('react-native-svg', () => {
  const mockReact = jest.requireActual<typeof import('react')>('react');

  // Class components, not function components: react-test-renderer leaves refs
  // to bare host elements null, while the real react-native-svg exports resolve
  // to a component instance. A class instance reproduces that, so `ref.current`
  // is non-null while the rendered tree still carries the svg element names the
  // chart tests query by.
  const createMockComponent = (name: string) => {
    class Component extends mockReact.Component<Record<string, unknown>> {
      override render() {
        const { children, ...props } = this.props;
        return mockReact.createElement(name, props, children as ReactNode);
      }
    }
    Object.defineProperty(Component, 'displayName', { value: name });
    return Component;
  };

  return {
    __esModule: true,
    default: createMockComponent('Svg'),
    Svg: createMockComponent('Svg'),
    Circle: createMockComponent('Circle'),
    Rect: createMockComponent('Rect'),
    Path: createMockComponent('Path'),
    Line: createMockComponent('Line'),
    Polygon: createMockComponent('Polygon'),
    G: createMockComponent('G'),
    Text: createMockComponent('Text'),
    ClipPath: createMockComponent('ClipPath'),
    Defs: createMockComponent('Defs'),
    Mask: createMockComponent('Mask'),
    LinearGradient: createMockComponent('LinearGradient'),
    RadialGradient: createMockComponent('RadialGradient'),
    Stop: createMockComponent('Stop'),
  };
});

// Mock expo-haptics (uses native modules not available in Jest)
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: {
    Light: 'light',
    Medium: 'medium',
    Heavy: 'heavy',
  },
  NotificationFeedbackType: {
    Success: 'success',
    Warning: 'warning',
    Error: 'error',
  },
}));

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
      'data-on-dismiss': props.onDismiss ? 'true' : 'false',
      'data-has-background-component': props.backgroundComponent
        ? 'true'
        : 'false',
      'data-has-background-style': props.backgroundStyle ? 'true' : 'false',
      'data-has-handle-component': props.handleComponent ? 'true' : 'false',
      children: [
        props.backgroundComponent
          ? mockReact.createElement(props.backgroundComponent, {
              key: 'bg',
              style: {},
            })
          : null,
        props.handleComponent
          ? mockReact.createElement(props.handleComponent, { key: 'handle' })
          : null,
        props.children,
      ],
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
jest.mock('react-native-gesture-handler', () => {
  const mockReact = jest.requireActual<typeof import('react')>('react');
  const mockRN =
    jest.requireActual<typeof import('react-native')>('react-native');

  const makeGesture = () => {
    const handlers: Record<string, (...args: any[]) => any> = {};
    const gesture: Record<string, unknown> = { __handlers: handlers };
    const chainable = new Proxy(gesture, {
      get(target, prop) {
        if (prop in target) return target[prop as string];
        if (typeof prop === 'string' && prop.startsWith('on')) {
          return (callback: (...args: any[]) => any) => {
            handlers[prop] = callback;
            return chainable;
          };
        }
        return (..._args: any[]) => chainable;
      },
    });
    return chainable;
  };

  return {
    __esModule: true,
    GestureDetector: ({ children, gesture }: any) =>
      mockReact.cloneElement(children, gesture?.__handlers ?? {}),
    Gesture: {
      Pan: makeGesture,
      Tap: makeGesture,
      LongPress: makeGesture,
      Fling: makeGesture,
      Simultaneous: makeGesture,
      Exclusive: makeGesture,
      Race: makeGesture,
    },
    State: {},
    GestureHandlerRootView: ({ children }: any) =>
      mockReact.createElement(mockRN.View, {}, children),
    ScrollView: mockRN.ScrollView,
    FlatList: mockRN.FlatList,
  };
});

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
    // Evaluate the callback so consumers see real interpolated values during
    // render. Tests that need to assert on animated styles depend on this.
    useAnimatedStyle: (cb: any) => cb(),
    withTiming: (value: any) => value,
    withSpring: (value: any) => value,
    withDecay: (value: any) => value,
    withDelay: (value: any) => value,
    withSequence: (...values: any[]) => values[0],
    withRepeat: (value: any) => value,
    cancelAnimation: () => {
      return;
    },
    interpolate: (value: number, _input: number[], output: number[]) =>
      output[0] + (output[1] - output[0]) * value,
    interpolateColor: (
      value: number,
      _input: number[],
      output: string[],
    ): string => (value >= 0.5 ? output[1] : output[0]),
    useAnimatedProps: (_cb: any) => {
      return {};
    },
    useReducedMotion: () => false,
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
    ReduceMotion: {
      System: 'system',
      Always: 'always',
      Never: 'never',
    },
  };

  return Reanimated;
});

jest.mock('react-native-worklets', () => ({
  __esModule: true,
  scheduleOnRN: (fn: any, ...args: any[]) => fn(...args),
  scheduleOnUI: (fn: any, ...args: any[]) => fn(...args),
  scheduleOnRuntime: (fn: any, ...args: any[]) => fn(...args),
}));
