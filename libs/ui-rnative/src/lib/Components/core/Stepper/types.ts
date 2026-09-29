import type { StyledViewProps } from '../../../../styles';

export type StepperProps = {
  /**
   * The visual style of the stepper's segments.
   * @default accent
   */
  appearance?: 'accent' | 'success';
  /**
   * Current step number (1-based).
   */
  currentStep: number;
  /**
   * Total number of steps.
   */
  totalSteps: number;
  /**
   * Whether the stepper is disabled. Changes the progress to a muted style.
   * @default false
   */
  disabled?: boolean;
  /**
   * Optional custom label. Defaults to "{currentStep}/{totalSteps}".
   */
  label?: string;
} & Omit<StyledViewProps, 'children'>;
