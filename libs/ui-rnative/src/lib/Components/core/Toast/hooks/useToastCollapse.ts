import { useCallback, useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { useTheme } from '../../../../../styles';
import type { ToastPosition } from '../types';
import { EXIT_ANIMATION_MS } from './useToastLifecycle';

type UseToastCollapseArgs = {
  position: ToastPosition;
  exiting: boolean;
};

export const useToastCollapse = ({
  position,
  exiting,
}: UseToastCollapseArgs) => {
  const { theme } = useTheme();
  const [measuredHeight, setMeasuredHeight] = useState<number>();
  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    setMeasuredHeight(event.nativeEvent.layout.height);
  }, []);

  const collapseStyle = useMemo(() => {
    const fullHeight =
      measuredHeight === undefined
        ? undefined
        : measuredHeight + theme.spacings.s8;
    return {
      width: '100%',
      justifyContent: position === 'top' ? 'flex-start' : 'flex-end',
      height: exiting ? 0 : fullHeight,
      transitionProperty: 'height',
      transitionDuration: EXIT_ANIMATION_MS,
      transitionTimingFunction: 'ease-out',
    } as const;
  }, [exiting, measuredHeight, position, theme.spacings.s8]);

  return { collapseStyle, handleLayout };
};
