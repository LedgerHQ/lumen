import { cn } from '@ledgerhq/lumen-design-core/cn';
import { cva } from 'class-variance-authority';
import { useId } from 'react';
import {
  clampProgress,
  hasProgressLabel,
  ProgressLabelLayout,
} from '../../internal/ProgressBase';
import type { ProgressBarProps } from './types';

const progressTrackVariants = cva(
  'h-6 w-full overflow-hidden rounded-full bg-muted',
);

const progressFillVariants = cva(
  'h-full rounded-full transition-[width] duration-200 ease-out',
  {
    variants: {
      appearance: {
        base: 'bg-interactive',
        accent: 'bg-accent',
        success: 'bg-success-strong',
        error: 'bg-error-strong',
        warning: 'bg-warning-strong',
        'decorative-blue': 'bg-decorative-blue',
        'decorative-pink': 'bg-decorative-pink',
        'decorative-purple': 'bg-decorative-purple',
        'decorative-green': 'bg-decorative-green',
        'decorative-turquoise': 'bg-decorative-turquoise',
        'decorative-yellow': 'bg-decorative-yellow',
        'decorative-orange': 'bg-decorative-orange',
        'decorative-red': 'bg-decorative-red',
      },
    },
    defaultVariants: {
      appearance: 'base',
    },
  },
);

/**
 * A determinate progress bar showing how far along a task is. An optional label
 * can sit above or below the bar. `className` targets the outermost element:
 * the label wrapper when there is a label, otherwise the bar.
 *
 * @example
 * <ProgressBar value={40} aria-label='Upload progress' />
 * <ProgressBar value={72} label='Syncing accounts' labelPosition='start-top' />
 */
export const ProgressBar = ({
  value,
  appearance = 'base',
  label,
  labelPosition,
  className,
  ref,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: ProgressBarProps) => {
  const labelId = useId();
  const hasLabel = hasProgressLabel(label);
  const clampedValue = clampProgress(value);
  const labelledBy =
    ariaLabelledBy ?? (hasLabel && !ariaLabel ? labelId : undefined);

  return (
    <ProgressLabelLayout
      label={label}
      labelPosition={labelPosition}
      labelId={labelId}
      className={className}
    >
      <div
        {...props}
        ref={ref}
        role='progressbar'
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clampedValue}
        aria-label={ariaLabel}
        aria-labelledby={labelledBy}
        className={cn(progressTrackVariants(), !hasLabel && className)}
      >
        <div
          className={progressFillVariants({ appearance })}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </ProgressLabelLayout>
  );
};
