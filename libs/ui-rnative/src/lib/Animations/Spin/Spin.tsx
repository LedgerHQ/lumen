import { memo, useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { RuntimeConstants } from '../../utils';
import { SpinProps } from './types';

export const Spin = memo(({ children, duration = 1000 }: SpinProps) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: duration,
        easing: Easing.linear,
        useNativeDriver: RuntimeConstants.isNative,
      }),
    );
    animation.start();

    return () => animation.stop();
  }, [spinValue, duration]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View style={{ transform: [{ rotate: spin }] }}>
      {children}
    </Animated.View>
  );
});
Spin.displayName = 'Spin';
