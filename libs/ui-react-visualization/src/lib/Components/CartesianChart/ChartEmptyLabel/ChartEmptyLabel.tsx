import type { ReactNode } from 'react';

type ChartEmptyLabelProps = {
  children: ReactNode;
};

/**
 * Centred HTML overlay label shown when a chart has no data (and is not
 * loading). Rendered through the `overlay` slot of `CartesianChart` so it shares
 * the chart's positioned container and aligns with the chart footprint. Shared
 * across cartesian charts (LineChart, future BarChart).
 *
 * This is the lib's only HTML (non-SVG) element, so unlike the chart visuals
 * (which use `cssVar()` inline styles) it is styled with the design system's
 * Tailwind utilities, consistent with the HTML components in `ui-react`.
 */
export function ChartEmptyLabel({ children }: Readonly<ChartEmptyLabelProps>) {
  return (
    <div className='pointer-events-none absolute inset-0 flex items-center justify-center'>
      <span
        data-testid='chart-empty-label'
        className='animate-fade-in rounded-xs bg-muted px-12 py-6 body-3 text-muted'
      >
        {children}
      </span>
    </div>
  );
}
