import type { ReactNode } from 'react';
import { G } from 'react-native-svg';

import { useLayoutWidth } from './useLayoutWidth';

type PositionedLabelProps = {
  testID: string;
  placeX: (width: number) => number;
  y: number;
  children: ReactNode;
};

/**
 * Measures its content, then places it at the x returned by `placeX` for that
 * width. Shared by the beacon and line labels, which differ only in placement.
 */
export function PositionedLabel({
  testID,
  placeX,
  y,
  children,
}: Readonly<PositionedLabelProps>) {
  const [width, onLayout] = useLayoutWidth();
  const x = placeX(width);

  return (
    <G
      testID={testID}
      onLayout={onLayout}
      x={x}
      y={y}
      opacity={width === 0 ? 0 : 1}
      pointerEvents='none'
    >
      {children}
    </G>
  );
}
