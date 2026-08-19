import { cn, isTextChildren } from '@ledgerhq/lumen-utils-shared';
import { cva } from 'class-variance-authority';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartDescriptionProps } from './types';
import { getCenterContentInset, getCenterMaxWidth } from './utils';

const descriptionVariants = cva('min-w-0 text-muted', {
  variants: {
    donutSize: {
      md: 'body-3',
      sm: '-mt-4 body-4',
    },
    layout: {
      text: 'truncate',
      cluster: 'flex items-center gap-2',
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
  const inset = getCenterContentInset(donutSize);
  const layout = isTextChildren(children) ? 'text' : 'cluster';

  return (
    <div
      ref={ref}
      style={{
        maxWidth: getCenterMaxWidth(donutSize),
        paddingInline: inset,
        ...style,
      }}
      className={cn(descriptionVariants({ donutSize, layout }), className)}
      {...props}
    >
      {children}
    </div>
  );
};
