import { cva } from 'class-variance-authority';

import { useDonutSizeContext } from './donutSizeContext';
import type { DonutChartTitleProps } from './types';
import { getCenterContentInset, getCenterMaxWidth } from './utils';

const titleVariants = cva('min-w-0 truncate text-base', {
  variants: {
    donutSize: {
      md: '',
      sm: '',
    },
    size: {
      md: '',
      sm: '',
    },
  },
  compoundVariants: [
    { donutSize: 'md', size: 'md', class: 'heading-1-semi-bold' },
    { donutSize: 'md', size: 'sm', class: 'heading-2-semi-bold' },
    { donutSize: 'sm', size: 'md', class: 'heading-4-semi-bold' },
    { donutSize: 'sm', size: 'sm', class: 'body-2-semi-bold' },
  ],
  defaultVariants: {
    donutSize: 'md',
    size: 'md',
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
  const inset = getCenterContentInset(donutSize);

  return (
    <div
      ref={ref}
      style={{
        maxWidth: getCenterMaxWidth(donutSize),
        paddingInline: inset,
        ...style,
      }}
      className={titleVariants({ donutSize, size, className })}
      {...props}
    >
      {children}
    </div>
  );
};
