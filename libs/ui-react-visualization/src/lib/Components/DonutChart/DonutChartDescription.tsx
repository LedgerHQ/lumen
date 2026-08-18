import { cn, isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps } from './types';
import { DONUT_GEOMETRY, getCenterMaxWidth } from './utils';

const descriptionVariants = cva('min-w-0 text-muted', {
  variants: {
    donutSize: {
      md: 'px-4 body-3',
      sm: '-mt-4 px-2 body-4',
    },
    layout: {
      text: 'truncate',
      cluster: 'flex min-w-0 items-center gap-2',
    },
  },
  defaultVariants: {
    donutSize: 'md',
    layout: 'text',
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
  const layout = isTextChildren(children) ? 'text' : 'cluster';

  return (
    <div
      ref={ref}
      style={{ maxWidth, ...style }}
      className={cn(descriptionVariants({ donutSize, layout }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
