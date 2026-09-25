import { useStyleSheet } from '../../../../../styles';
import type { ToastInsets, ToastPosition } from '../types';

type UseToastViewportStylesArgs = {
  position: ToastPosition;
  safeAreaTop: number;
  safeAreaBottom: number;
  insets: ToastInsets;
};

export const useToastViewportStyles = ({
  position,
  safeAreaTop,
  safeAreaBottom,
  insets,
}: UseToastViewportStylesArgs) =>
  useStyleSheet(
    (t) => ({
      root: {
        position: 'absolute',
        left: insets.left ?? 0,
        right: insets.right ?? 0,
        zIndex: 50,
        alignItems: 'center',
        flexDirection: position === 'top' ? 'column' : 'column-reverse',
        top:
          position === 'top'
            ? safeAreaTop + (insets.top ?? 0) + t.spacings.s24
            : undefined,
        bottom:
          position === 'bottom'
            ? safeAreaBottom + (insets.bottom ?? 0) + t.spacings.s24
            : undefined,
      },
    }),
    [
      position,
      safeAreaTop,
      safeAreaBottom,
      insets.top,
      insets.bottom,
      insets.left,
      insets.right,
    ],
  );
