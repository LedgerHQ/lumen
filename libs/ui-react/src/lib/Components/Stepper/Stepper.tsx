import { cn, getStepperCalculations } from '@ledgerhq/lumen-utils-shared';
import { forwardRef } from 'react';
import { StepperProps } from './types';

const SIZE = 48;
const STROKE_WIDTH = 4;

/**
 * A circular stepper component showing progress as current step out of total steps.
 * Renders a track arc with a progress arc and a center label.
 *
 * @see Figma – Stepper](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11977-94&m=dev)
 *
 * @example
 * <Stepper currentStep={1} totalSteps={4} />
 * <Stepper currentStep={0} totalSteps={9} disabled /> // Shows minimal dot, disabled style
 */
export const Stepper = forwardRef<HTMLDivElement, StepperProps>(
  (
    { className, currentStep, totalSteps, disabled = false, label, ...props },
    ref,
  ) => {
    const {
      displayLabel,
      r,
      cx,
      cy,
      trackDashArray,
      progressDashArray,
      progressDashOffset,
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
          className='rotate-135'
          aria-hidden
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            className='stroke-muted-subtle'
            style={{
              strokeWidth: `${STROKE_WIDTH}px`,
              strokeDasharray: trackDashArray,
              strokeDashoffset: 0,
            }}
          />
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill='none'
            stroke='currentColor'
            strokeLinecap='round'
            className={cn(
              disabled ? 'stroke-muted-subtle-hover' : 'stroke-active',
              'transition-[stroke-dashoffset,stroke] duration-300 ease-in-out',
            )}
            style={{
              strokeWidth: `${STROKE_WIDTH}px`,
              strokeDasharray: progressDashArray,
              strokeDashoffset: progressDashOffset,
            }}
          />
        </svg>
        <span className='absolute inset-0 flex items-center justify-center text-base'>
          {label ? (
            <span className='body-2-semi-bold'>{label}</span>
          ) : (
            <>
              <span className='body-1-semi-bold'>
                {Math.min(currentStep, totalSteps)}
              </span>
              <span className='body-2-semi-bold text-muted'>/{totalSteps}</span>
            </>
          )}
        </span>
      </div>
    );
  },
);

Stepper.displayName = 'Stepper';
