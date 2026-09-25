import { useToastTimer } from '@ledgerhq/lumen-utils-shared';
import { useEffect, useRef } from 'react';

export const EXIT_ANIMATION_MS = 300;

type UseToastLifecycleArgs = {
  durationMs: number;
  paused: boolean;
  exiting: boolean;
  onDismiss: () => void;
};

export const useToastLifecycle = ({
  durationMs,
  paused,
  exiting,
  onDismiss,
}: UseToastLifecycleArgs): void => {
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
