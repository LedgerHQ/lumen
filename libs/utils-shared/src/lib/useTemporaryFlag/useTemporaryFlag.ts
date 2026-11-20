import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Returns a flag that turns on when triggered and turns off after `duration` ms.
 * Triggering again while active restarts the timer.
 *
 * @param duration - How long the flag stays active, in ms.
 */
export const useTemporaryFlag = (
  duration: number,
): [active: boolean, trigger: () => void] => {
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  const trigger = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setActive(true);
    timeoutRef.current = setTimeout(() => setActive(false), duration);
  }, [duration]);

  return [active, trigger];
};
