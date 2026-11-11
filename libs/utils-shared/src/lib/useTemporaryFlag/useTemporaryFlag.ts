import { useCallback, useEffect, useRef, useState } from 'react';

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
