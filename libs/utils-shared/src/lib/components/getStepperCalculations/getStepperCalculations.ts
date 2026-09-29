export type StepperCalculationsInput = {
  /** Current step number (1-based). Use 0 or negative for empty progress. */
  currentStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Size of the circular stepper in pixels. */
  size: number;
  /** Optional custom label. Defaults to "{currentStep}/{totalSteps}". */
  label?: string;
  /** Stroke width in pixels. @default 4 */
  strokeWidth?: number;
};

export type StepperCalculationsOutput = {
  /** Label text displayed in the center. */
  displayLabel: string;
  /** Progress value between 0 and 1. */
  progress: number;
  /** Circle radius in pixels. */
  r: number;
  /** Center x coordinate. */
  cx: number;
  /** Center y coordinate. */
  cy: number;
  /** Full circle circumference. */
  circumference: number;
  /** dasharray for the gray track and progress circles. */
  progressDashArray: string;
  /** strokeDasharray for the mask circle that reveals the progress. */
  progressMaskDashArray: string;
  /** strokeDashoffset for the mask circle; animate it to sweep clockwise. */
  progressDashOffset: number;
  /** Rotation in degrees (around the center) to apply to the mask circle. */
  progressMaskRotation: number;
};

/**
 * Computes all SVG-related values needed to render a circular stepper.
 *
 * This is a pure utility shared between React (web) and React Native
 * implementations of the Stepper component.
 *
 * @example
 * ```ts
 * const calcs = getStepperCalculations({
 *   currentStep: 2,
 *   totalSteps: 4,
 *   size: 48,
 * });
 *
 * // calcs.displayLabel → '2/4'
 * // calcs.progress → 0.5
 * // calcs.progressDashOffset → offset for 50% fill
 * ```
 */
export const getStepperCalculations = ({
  currentStep,
  totalSteps,
  size,
  label,
  strokeWidth = 4,
}: StepperCalculationsInput): StepperCalculationsOutput => {
  const clampedCurrentStep = Math.min(Math.max(currentStep, 0), totalSteps);

  const displayLabel = label ?? `${clampedCurrentStep}/${totalSteps}`;
  const progress = totalSteps <= 0 ? 0 : clampedCurrentStep / totalSteps;

  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  const SEGMENT_GAP = 12;
  const segmentLength = circumference / totalSteps - SEGMENT_GAP;

  const progressDashArray = `${segmentLength} ${SEGMENT_GAP}`;
  const progressMaskDashArray = `${circumference} ${circumference}`;
  const progressDashOffset = circumference * (1 - progress);
  const progressMaskRotation = -((SEGMENT_GAP / 2 / r) * 180) / Math.PI;

  return {
    displayLabel,
    progress,
    r,
    cx,
    cy,
    circumference,
    progressDashArray,
    progressMaskDashArray,
    progressDashOffset,
    progressMaskRotation,
  };
};
