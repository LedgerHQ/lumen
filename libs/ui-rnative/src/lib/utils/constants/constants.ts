import { useEffect, useLayoutEffect } from 'react';
import { Dimensions, Platform } from 'react-native';

import {
  EdgeInsets,
  initialWindowMetrics,
} from 'react-native-safe-area-context';

const edgeInsets =
  initialWindowMetrics?.insets ??
  ({
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  } satisfies EdgeInsets);

export class RuntimeConstants {
  static get isServer(): boolean {
    return typeof process !== 'undefined' && process.release?.name === 'node';
  }

  static get isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof document !== 'undefined';
  }

  static get isAndroid(): boolean {
    return this.isNative && Platform.OS === 'android';
  }

  static get isIOS(): boolean {
    return this.isNative && Platform.OS === 'ios';
  }

  static get isNative(): boolean {
    return (
      !this.isBrowser &&
      typeof global?.navigator !== 'undefined' &&
      global.navigator.product === 'ReactNative'
    );
  }

  static get insetDimensions(): { height: number; width: number } {
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    return {
      height: windowHeight - edgeInsets.top - edgeInsets.bottom,
      width: windowWidth - edgeInsets.left - edgeInsets.right,
    };
  }
}

export const useIsomorphicLayoutEffect: typeof useEffect =
  RuntimeConstants.isServer ? useEffect : useLayoutEffect;
