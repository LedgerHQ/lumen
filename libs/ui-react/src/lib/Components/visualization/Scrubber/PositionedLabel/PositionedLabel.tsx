import type { ReactNode } from 'react';

import { useMeasuredWidth } from './useMeasuredWidth';

type PositionedLabelProps = {
  testId: string;
  measureKey: number;
  placeX: (width: number) => number;
  y: number;
  children: ReactNode;
};

/**
 * Measures its content, then places it at the x returned by `placeX` for that
 * width. Shared by the beacon and line labels, which differ only in placement.
 */
export function PositionedLabel({
  testId,
  measureKey,
  placeX,
  y,
  children,
}: Readonly<PositionedLabelProps>) {
  const [ref, width] = useMeasuredWidth([testId, measureKey]);
  const x = placeX(width);

  return (
    <g
      ref={ref}
      data-testid={testId}
      transform={`translate(${x} ${y})`}
      pointerEvents='none'
    >
      {children}
    </g>
  );
}
