import { useEffect, useId, useMemo, useState } from 'react';
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ClipPath, Defs, Rect } from 'react-native-svg';

import { OVERFLOW_BUFFER } from '../utils';

import { RevealClipContext } from './context';
import type { RevealClipDefsProps } from './types';
import { useComputeDataFingerprint } from './utils';

const DEFAULT_DURATION_IN_SECONDS = 0.8;

/**
 * Drives a left-to-right reveal animation using an SVG `<ClipPath>` whose
 * inner `<Rect>` width grows from 0 to the chart's drawing area. The clip
 * reference is exposed via `RevealClipContext` so only opt-in elements
 * (`Line`, `Point`) are clipped — axes and grid stay fully visible.
 *
 * ANDROID CAVEAT — ClipPath id rotation
 * -------------------------------------
 * `react-native-svg` on Android caches a `<ClipPath>`'s resolved content
 * by `id`. Animating the inner `<Rect width>` of a fixed-id clip therefore
 * has no visible effect on Android. To force the native layer to
 * re-evaluate the clip every frame, we rotate the ClipPath `id` (and the
 * matching `url(#...)` reference) on each progress update, by appending a
 * frame counter derived from the animation progress.
 *
 * MEMORY CAVEAT
 * -------------
 * id rotation creates a new `<ClipPath>` element on every animation frame,
 * and the corresponding native cache entries may not be garbage-collected
 * by `react-native-svg`. We mitigate this by:
 *   1. Keeping the animation short (0.8s by default) so the total number
 *      of rotated ids is bounded.
 *   2. Stopping rotation once `progress` reaches 1 — the id stabilizes for
 *      the steady state, so no further entries accumulate after the reveal.
 */
export function RevealClipDefs({
  children,
  drawingArea,
  series,
  animate = true,
  transitions,
}: RevealClipDefsProps) {
  const isDisabled = !animate;
  const durationMs =
    (transitions?.enter?.duration ?? DEFAULT_DURATION_IN_SECONDS) * 1000;

  const dataFingerprint = useComputeDataFingerprint({ series });

  // React's useId() may emit colons (e.g. ":r3:") which Android's SVG
  // `url(#...)` parser rejects. Always sanitize.
  const baseId = useId().replace(/:/g, '_');

  const progressSv = useSharedValue(isDisabled ? 1 : 0);
  const [progress, setProgress] = useState(isDisabled ? 1 : 0);

  useEffect(() => {
    if (isDisabled) {
      progressSv.value = 1;
      setProgress(1);
      return;
    }
    progressSv.value = 0;
    setProgress(0);
    progressSv.value = withTiming(1, { duration: durationMs });
  }, [dataFingerprint, durationMs, isDisabled, progressSv]);

  useAnimatedReaction(
    () => progressSv.value,
    (val) => {
      runOnJS(setProgress)(val);
    },
    [],
  );

  // Frame counter forces a new ClipPath id (and matching url ref) every
  // tick so Android re-evaluates the clip. After progress reaches 1, the
  // counter stops changing and the id stabilizes.
  const clipId = `${baseId}-${Math.round(progress * 10000)}`;

  const contextValue = useMemo(
    () => ({
      clipPathAttr: isDisabled ? undefined : `url(#${clipId})`,
    }),
    [isDisabled, clipId],
  );

  if (isDisabled) {
    return (
      <RevealClipContext.Provider value={contextValue}>
        {children}
      </RevealClipContext.Provider>
    );
  }

  const clipX = drawingArea.x - OVERFLOW_BUFFER.left;
  const clipY = drawingArea.y - OVERFLOW_BUFFER.top;
  const clipWidth =
    progress *
    (drawingArea.width + OVERFLOW_BUFFER.left + OVERFLOW_BUFFER.right);
  const clipHeight =
    drawingArea.height + OVERFLOW_BUFFER.top + OVERFLOW_BUFFER.bottom;

  return (
    <RevealClipContext.Provider value={contextValue}>
      <Defs>
        <ClipPath id={clipId}>
          <Rect x={clipX} y={clipY} width={clipWidth} height={clipHeight} />
        </ClipPath>
      </Defs>
      {children}
    </RevealClipContext.Provider>
  );
}
