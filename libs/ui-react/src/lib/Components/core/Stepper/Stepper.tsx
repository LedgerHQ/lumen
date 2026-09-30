import {
  cn,
  getStepperCalculations,
  useDisabledContext,
} from '@ledgerhq/lumen-utils-shared';
import { useId } from 'react';
import type { StepperProps } from './types';

const SIZES = {
  md: { px: 48, strokeWidth: 4, root: 'size-48', label: 'body-2' },
  lg: { px: 72, strokeWidth: 6, root: 'size-72', label: 'heading-4' },
} as const;

/**
 * A circular stepper component showing progress as current step out of total steps.
 * Renders a segmented track with progress and a center label.
 *
 * @see Figma – Stepper](https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7/2.-Components-Library?node-id=11977-94&m=dev)
 *
 * @example
 * <Stepper currentStep={1} totalSteps={4} />
 * <Stepper currentStep={0} totalSteps={8} disabled /> // Empty progress, disabled style
 * <Stepper currentStep={2} totalSteps={4} size="lg" />
 */
export const Stepper = ({
  className,
  appearance = 'accent',
  size = 'md',
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
    px: diameter,
    strokeWidth,
    root: rootSizeClass,
    label: labelClass,
  } = SIZES[size];

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
    size: diameter,
    label,
    strokeWidth,
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
        'relative flex shrink-0 items-center justify-center rounded-full',
        rootSizeClass,
        className,
      )}
      {...props}
    >
      <svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
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
          className='stroke-(--background-muted-transparent-hover)'
          style={{
            strokeWidth: `${strokeWidth}px`,
            strokeDasharray: progressDashArray,
            strokeDashoffset: dashPatternOffset,
          }}
        />
        <mask
          id={maskId}
          maskUnits='userSpaceOnUse'
          x={0}
          y={0}
          width={diameter}
          height={diameter}
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill='none'
            stroke='white'
            className='transition-[stroke-dashoffset] duration-300 ease-in-out'
            style={{
              strokeWidth: `${strokeWidth}px`,
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
              ? 'stroke-(--background-muted-transparent-disabled)'
              : appearance === 'success'
                ? 'stroke-(--background-success-strong)'
                : 'stroke-(--background-active)',
            'transition-[stroke] duration-300 ease-in-out',
          )}
          style={{
            strokeWidth: `${strokeWidth}px`,
            strokeDasharray: progressDashArray,
            strokeDashoffset: dashPatternOffset,
          }}
        />
      </svg>
      <span className='absolute inset-0 m-4 flex items-center justify-center text-base'>
        {label ? (
          <span className={cn(labelClass, disabled && 'text-disabled')}>
            {label}
          </span>
        ) : (
          <span>
            <span className={cn(labelClass, disabled && 'text-disabled')}>
              {Math.min(Math.max(currentStep, 0), totalSteps)}
            </span>
            <span
              className={cn(
                labelClass,
                disabled ? 'text-disabled' : 'text-muted',
              )}
            >
              /{totalSteps}
            </span>
          </span>
        )}
      </span>
    </div>
  );
};
