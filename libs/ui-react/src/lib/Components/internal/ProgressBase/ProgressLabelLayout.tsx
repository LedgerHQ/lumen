import { cva } from 'class-variance-authority';
import type { ProgressLabelLayoutProps } from './types';

const layoutVariants = cva('flex w-full gap-8', {
  variants: {
    labelPosition: {
      'start-top': 'flex-col items-start',
      'start-bottom': 'flex-col-reverse items-start',
      'end-top': 'flex-col items-end',
      'end-bottom': 'flex-col-reverse items-end',
    },
  },
  defaultVariants: {
    labelPosition: 'start-bottom',
  },
});

const labelVariants = cva('body-4 text-muted', {
  variants: {
    labelPosition: {
      'start-top': '',
      'start-bottom': '',
      'end-top': 'text-end',
      'end-bottom': 'text-end',
    },
  },
});

/**
 * Places an optional label above or below a progress bar. Without a label it
 * renders the bar alone, so the DOM stays a single element.
 *
 * The label always comes first in the DOM, and the flex direction moves it
 * below the bar when needed.
 */
export const ProgressLabelLayout = ({
  label,
  labelPosition,
  labelId,
  children,
}: ProgressLabelLayoutProps) => {
  if (label == null || label === false) return children;

  return (
    <div className={layoutVariants({ labelPosition })}>
      <span id={labelId} className={labelVariants({ labelPosition })}>
        {label}
      </span>
      {children}
    </div>
  );
};
