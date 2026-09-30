import {
  cn,
  getStepperCalculations,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useId } from 'react';
import type { StepperProps } from './types';

const SIZE = 48;
const STROKE_WIDTH = 4;

/**
 * A circular stepper component showing progress as current step out of total steps.
 * Renders a segmented track with progress and a center label.
 *
 * @see Figma – Stepper](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11977-94&m=dev)
 *
 * @example
 * <Stepper currentStep={1} totalSteps={4} />
 * <Stepper currentStep={0} totalSteps={8} disabled /> // Empty progress, disabled style
 */
export const Stepper = ({
  className,
  appearance = 'accent',
  currentStep,
  totalSteps,
  disabled: disabledProp = false,
  label,
  ref,
  ...props
}: StepperProps) => {
  const disabled = useDisabledContext({
    consumerName: 'Stepper',
    mergeWith: { disabled: disabledProp },
  });

  const maskId = useId();

  const {
    displayLabel,
    r,
    cx,
    cy,
    progressDashArray,
    progressMaskDashArray,
    progressDashOffset,
    dashPatternOffset,
  } = getStepperCalculations({
    currentStep,
    totalSteps,
    size: SIZE,
    label,
    strokeWidth: STROKE_WIDTH,
  });

  return (
    <div
      ref={ref}
      role='progressbar'
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={displayLabel}
      className={cn(
        'relative flex size-48 shrink-0 items-center justify-center rounded-full',
        className,
      )}
      {...props}
    >
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className='-rotate-90'
        aria-hidden
      >
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          className='bg-muted-transparent-hover'
          style={{
            strokeWidth: `${STROKE_WIDTH}px`,
            strokeDasharray: progressDashArray,
            strokeDashoffset: dashPatternOffset,
          }}
        />
        <mask
          id={maskId}
          maskUnits='userSpaceOnUse'
          x={0}
          y={0}
          width={SIZE}
          height={SIZE}
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill='none'
            stroke='white'
            className='transition-[stroke-dashoffset] duration-300 ease-in-out'
            style={{
              strokeWidth: `${STROKE_WIDTH}px`,
              strokeDasharray: progressMaskDashArray,
              strokeDashoffset: progressDashOffset,
            }}
          />
        </mask>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          mask={`url(#${maskId})`}
          className={cn(
            disabled
              ? 'stroke-muted-subtle-hover'
              : appearance === 'success'
                ? 'bg-success-strong'
                : 'bg-active',
            'transition-[stroke] duration-300 ease-in-out',
          )}
          style={{
            strokeWidth: `${STROKE_WIDTH}px`,
            strokeDasharray: progressDashArray,
            strokeDashoffset: dashPatternOffset,
          }}
        />
      </svg>
      <span className='absolute inset-0 m-4 flex items-center justify-center text-base'>
        {label ? (
          <span className='body-2-semi-bold'>{label}</span>
        ) : (
          <span>
            <span className='body-1-semi-bold'>
              {Math.min(Math.max(currentStep, 0), totalSteps)}
            </span>
            <span className='body-2-semi-bold text-muted'>/{totalSteps}</span>
          </span>
        )}
      </span>
    </div>
  );
};
