import { HTMLAttributes } from 'react';

export type StepperProps = {
  /**
   * Current step number (1-based). Use 0 or negative to show minimal dot (before starting).
   */
  currentStep: number;
  /**
   * Total number of steps.
   */
  totalSteps: number;
  /**
   * Whether the stepper is disabled. Changes the progress arc to a muted style.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional custom label. Defaults to "{currentStep}/{totalSteps}".
   */
  label?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, 'children'>;
