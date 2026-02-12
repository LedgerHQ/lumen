import { useRef, useEffect, memo } from 'react';
import { Animated, Easing } from 'react-native';
import { RuntimeConstants } from '../../../lib/utils';
import { PulseProps } from './types';

export const Pulse = memo(
  ({ children, duration = 2000, animate }: PulseProps) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);

    useEffect(() => {
      if (animate) {
        const animation = Animated.loop(
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 0,
              duration: duration / 2,
              easing: Easing.linear,
              useNativeDriver: RuntimeConstants.isNative,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: duration / 2,
              easing: Easing.linear,
              useNativeDriver: RuntimeConstants.isNative,
            }),
          ]),
        );

        animationRef.current = animation;
        animation.start();
      } else {
        animationRef.current?.stop();
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: RuntimeConstants.isNative,
        }).start();
      }

      return () => {
        animationRef.current?.stop();
      };
    }, [pulseAnim, duration, animate]);

    const pulse = pulseAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0.35', '1'],
    });

    return <Animated.View style={{ opacity: pulse }}>{children}</Animated.View>;
  },
);
Pulse.displayName = 'Pulse';
