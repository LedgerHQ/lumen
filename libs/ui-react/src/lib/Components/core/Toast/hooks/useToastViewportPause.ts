import { useRef, useState, type FocusEvent } from 'react';

type ToastViewportPauseProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onFocus: () => void;
  onBlur: (event: FocusEvent<HTMLDivElement>) => void;
};

type UseToastViewportPauseReturn = {
  paused: boolean;
  viewportProps: ToastViewportPauseProps;
};

/**
 * Pauses toast timers while the pointer rests on the viewport, or while
 * keyboard focus is inside it. A pointer press does not count as focus, so
 * clicking an action does not keep the toast open after the pointer leaves.
 *
 * @internal
 */
export const useToastViewportPause = (): UseToastViewportPauseReturn => {
  const [hovered, setHovered] = useState(false);
  const [focusWithin, setFocusWithin] = useState(false);
  const pointerDownRef = useRef(false);

  const releasePointer = (): void => {
    pointerDownRef.current = false;
  };

  return {
    paused: hovered || focusWithin,
    viewportProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onPointerDown: () => {
        pointerDownRef.current = true;
        setFocusWithin(false);
      },
      onPointerUp: releasePointer,
      onPointerCancel: releasePointer,
      onFocus: () => {
        if (pointerDownRef.current) return;
        setFocusWithin(true);
      },
      onBlur: (event) => {
        if (event.currentTarget.contains(event.relatedTarget)) return;
        setFocusWithin(false);
      },
    },
  };
};
