import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';

import type { RevealClipDefsProps } from './types';
import { useComputeDataFingerprint } from './utils';

const DEFAULT_DURATION_IN_SECONDS = 0.8;

/**
 * Cubic ease-out matches the perceived "spring without bounce" feel of
 * Reanimated's default `withTiming` curve.
 */
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/**
 * Wraps the chart's data layer with an animated reveal effect that wipes the
 * content in horizontally from left to right.
 *
 * Implementation note: this component uses a React Native `View` with
 * `overflow: 'hidden'` and a state-driven `width` rather than an SVG
 * `<ClipPath>` or a Reanimated shared value, for two reasons:
 *
 * 1. On Android, `react-native-svg` caches `<ClipPath>` geometry by id and
 *    does not re-evaluate the clip when its child `<Rect>` changes — so any
 *    form of animated SVG clip path silently fails to update.
 * 2. Reanimated shared-value updates are dispatched to the UI thread
 *    asynchronously, which races React's commit on data updates. The result
 *    on Android is a one-frame flash of the freshly-rendered data line at
 *    full width before the clip is reset to 0. Driving the width via React
 *    state guarantees the reset commits in the same paint as the new data,
 *    eliminating the flash.
 *
 * The animation itself is driven by `requestAnimationFrame` on the JS thread.
 * For an 800 ms width interpolation this is comfortably 60 fps and visually
 * indistinguishable from a UI-thread animation.
 */
export function RevealClipDefs({
  children,
  width,
  height,
  series,
  animate = true,
  transitions,
}: RevealClipDefsProps) {
  const isDisabled = !animate;
  const durationMs =
    (transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS) * 1000;

  const dataFingerprint = useComputeDataFingerprint({ series });
  const [clipWidth, setClipWidth] = useState(isDisabled ? width : 0);

  // Reset the clip width to 0 synchronously during render whenever the data
  // fingerprint changes. Calling `setState` during render is the React-idiomatic
  // way to "reset state when a prop changes" — React discards the in-flight
  // render and re-runs the component with `clipWidth = 0`, so the new content
  // is committed to the screen with width: 0 (clipped) in the same paint.
  const previousFingerprintRef = useRef(dataFingerprint);
  if (previousFingerprintRef.current !== dataFingerprint) {
    previousFingerprintRef.current = dataFingerprint;
    if (!isDisabled && clipWidth !== 0) {
      setClipWidth(0);
    }
  }

  useEffect(() => {
    if (isDisabled) {
      setClipWidth(width);
      return undefined;
    }

    let rafId: number | null = null;
    let cancelled = false;
    const startTime = performance.now();

    const tick = (): void => {
      if (cancelled) return;
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      setClipWidth(easeOutCubic(progress) * width);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [width, durationMs, dataFingerprint, isDisabled]);

  if (isDisabled) {
    return children;
  }

  return (
    <View style={{ width: clipWidth, height, overflow: 'hidden' }}>
      {children}
    </View>
  );
}
