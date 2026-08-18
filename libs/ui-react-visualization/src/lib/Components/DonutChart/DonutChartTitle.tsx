import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartTitleProps, DonutSize, DonutTitleSize } from './types';
import { DONUT_GEOMETRY, getCenterMaxWidth } from './utils';

const TITLE_TYPOGRAPHY = {
  md: { md: 'heading-1-semi-bold', sm: 'heading-2-semi-bold' },
  sm: { md: 'heading-4-semi-bold', sm: 'body-2-semi-bold' },
} as const satisfies Record<DonutSize, Record<DonutTitleSize, string>>;

const titleVariants = cva('min-w-0 truncate text-base', {
  variants: {
    donutSize: {
      md: 'px-4',
      sm: 'px-2',
    },
  },
  defaultVariants: {
    donutSize: 'md',
  },
});

export const DonutChartTitle = ({
  ref,
  children,
  className,
  size = 'md',
  style,
  ...props
}: DonutChartTitleProps) => {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartTitle',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);

  return (
    <div
      ref={ref}
      style={{ maxWidth, ...style }}
      className={cn(
        titleVariants({ donutSize }),
        TITLE_TYPOGRAPHY[donutSize][size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
};
