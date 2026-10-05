import { useEffect, useRef } from 'react';
import { useToastTimer } from './useToastTimer';

/**
 * How long a toast's exit animation runs before it is dropped. Views must
 * keep their exit animation within this window.
 */
export const EXIT_ANIMATION_MS = 300;

/**
 * Drives a mounted toast from auto-dismiss to removal: the countdown flags it
 * `exiting` through `onDismiss`, then, once the exit animation has had
 * `EXIT_ANIMATION_MS` to play, `onDismiss` runs again to drop it (the store's
 * two-phase dismiss).
 */
export const useToastLifecycle = ({
  durationMs,
  paused,
  exiting,
  onDismiss,
}: {
  durationMs: number;
  paused: boolean;
  exiting: boolean;
  onDismiss: () => void;
}): void => {
  useToastTimer({ durationMs, paused, exiting, onExpire: onDismiss });

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
