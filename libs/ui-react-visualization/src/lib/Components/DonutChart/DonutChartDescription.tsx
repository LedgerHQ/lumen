import { cn } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps } from './types';
import { DONUT_GEOMETRY, getCenterMaxWidth } from './utils';

const descriptionVariants = cva('flex items-center gap-2 truncate text-muted', {
  variants: {
    donutSize: {
      md: 'body-3',
      sm: '-mt-4 body-4',
    },
  },
  defaultVariants: {
    donutSize: 'md',
  },
});

export const DonutChartDescription = ({
  ref,
  children,
  className,
  style,
  ...props
}: DonutChartDescriptionProps) => {
  const { size: donutSize = 'md' } = useDonutSizeContext({
    consumerName: 'DonutChartDescription',
    contextRequired: false,
  });
  const maxWidth = getCenterMaxWidth(DONUT_GEOMETRY[donutSize]);

  return (
    <div
      ref={ref}
      style={{ maxWidth, ...style }}
      className={cn(descriptionVariants({ donutSize }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
