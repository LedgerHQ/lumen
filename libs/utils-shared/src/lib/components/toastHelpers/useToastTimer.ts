import { useEffect, useRef } from 'react';

/**
 * Runs a single toast's countdown. The timer starts when the item mounts
 * (i.e. becomes visible) and pauses/resumes from the remaining time on
 * `paused` toggles. A real `durationMs` change (e.g. loading -> success)
 * restarts from the full new duration. `exiting` stops tracking entirely —
 * the item's fate is already owned by the caller's exit-animation logic.
 */
export const useToastTimer = ({
  durationMs,
  paused,
  exiting,
  onExpire,
}: {
  durationMs: number;
  paused: boolean;
  exiting: boolean;
  onExpire: () => void;
}): void => {
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const remainingRef = useRef(durationMs);
  const prevDurationMsRef = useRef(durationMs);
  const startedAtRef = useRef<number | null>(null);

  useEffect(() => {
    if (exiting) return;

    if (durationMs !== prevDurationMsRef.current) {
      prevDurationMsRef.current = durationMs;
      remainingRef.current = durationMs;
    }

    if (paused || !Number.isFinite(remainingRef.current)) return;

    startedAtRef.current = Date.now();
    const timeoutId = setTimeout(
      () => onExpireRef.current(),
      remainingRef.current,
    );

    return () => {
      clearTimeout(timeoutId);
      if (startedAtRef.current !== null) {
        remainingRef.current -= Date.now() - startedAtRef.current;
        startedAtRef.current = null;
      }
    };
  }, [paused, exiting, durationMs]);
};
