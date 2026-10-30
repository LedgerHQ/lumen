import { cn } from '@ledgerhq/lumen-design-core/cn';
import { cva } from 'class-variance-authority';
import type { ProgressBarProps } from './types';

const labelLayoutVariants = cva('flex w-full gap-8', {
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

type ProgressTrackProps = Omit<ProgressBarProps, 'label' | 'labelPosition'>;

const ProgressTrack = ({
  value,
  appearance = 'base',
  className,
  ref,
  ...props
}: ProgressTrackProps) => (
  <div
    {...props}
    ref={ref}
    role='progressbar'
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={value}
    className={cn(progressTrackVariants(), className)}
  >
    <div
      className={progressFillVariants({ appearance })}
      style={{ width: `${value}%` }}
    />
  </div>
);

/**
 * A determinate progress bar showing how far along a task is. An optional label
 * can sit above or below the bar. `className` and `style` target the outermost
 * element: the label wrapper when there is a label, otherwise the bar.
 *
 * @example
 * <ProgressBar value={40} aria-label='Upload progress' />
 * <ProgressBar
 *   value={72}
 *   aria-label='Sync progress'
 *   label='Syncing accounts'
 *   labelPosition='start-top'
 * />
 */
export const ProgressBar = ({
  value,
  label,
  labelPosition,
  className,
  style,
  ...props
}: ProgressBarProps) => {
  const hasLabel = label != null && typeof label !== 'boolean';
  const clampedValue = Number.isNaN(value)
    ? 0
    : Math.min(100, Math.max(0, value));

  if (!hasLabel) {
    return (
      <ProgressTrack
        {...props}
        value={clampedValue}
        className={className}
        style={style}
      />
    );
  }

  // The label comes first in the DOM and flex direction moves it below the bar.
  return (
    <div
      className={cn(labelLayoutVariants({ labelPosition }), className)}
      style={style}
    >
      <span className={labelVariants({ labelPosition })}>{label}</span>
      <ProgressTrack {...props} value={clampedValue} />
    </div>
  );
};
