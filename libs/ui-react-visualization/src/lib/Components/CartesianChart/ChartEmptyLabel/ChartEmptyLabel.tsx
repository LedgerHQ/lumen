import type { PropsWithChildren } from 'react';

type ChartEmptyLabelProps = PropsWithChildren;

/**
 * Centred HTML overlay label shown when a chart has no data (and is not
 * loading). Rendered through the `overlay` slot of `CartesianChart` so it shares
 * the chart's positioned container and aligns with the chart footprint. Shared
 * across cartesian charts.
 */
export function ChartEmptyLabel({ children }: Readonly<ChartEmptyLabelProps>) {
  return (
    <div
      aria-hidden='true'
      className='pointer-events-none absolute inset-0 flex items-center justify-center'
    >
      <span
        data-testid='chart-empty-label'
        className='animate-fade-in rounded-xs bg-muted px-12 py-6 body-3 text-muted'
      >
        {children}
      </span>
    </div>
  );
}
