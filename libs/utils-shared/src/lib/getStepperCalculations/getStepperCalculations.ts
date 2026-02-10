export type StepperCalculationsInput = {
  /** Current step number (1-based). Use 0 or negative for minimal dot. */
  currentStep: number;
  /** Total number of steps. */
  totalSteps: number;
  /** Size of the circular stepper in pixels. */
  size: number;
  /** Optional custom label. Defaults to "{currentStep}/{totalSteps}". */
  label?: string;
  /** Stroke width in pixels. @default 4 */
  strokeWidth?: number;
  /** Percentage of full circle to show as arc (0–1). @default 0.75 (270°) */
  arcPercentage?: number;
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
  /** Length of the visible arc (track). */
  trackArcLength: number;
  /** strokeDasharray for the gray track circle. */
  trackDashArray: string;
  /** strokeDasharray for the progress (purple) circle. */
  progressDashArray: string;
  /** strokeDashoffset for the progress (purple) circle. */
  progressDashOffset: number;
  /** Whether to show minimal dot instead of progress arc. */
  showMinimalDot: boolean;
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
 * // calcs.trackDashArray → '<trackArcLength> <circumference>'
 * // calcs.progressDashArray → '<trackArcLength> <circumference>'
 * // calcs.progressDashOffset → offset for 50% fill
 * ```
 */
export const getStepperCalculations = ({
  currentStep,
  totalSteps,
  size,
  label,
  strokeWidth = 4,
  arcPercentage = 0.75,
}: StepperCalculationsInput): StepperCalculationsOutput => {
  // Clamp currentStep: minimum 0, maximum totalSteps
  const clampedCurrentStep = Math.min(Math.max(currentStep, 0), totalSteps);

  const displayLabel = label ?? `${clampedCurrentStep}/${totalSteps}`;
  const progress = totalSteps <= 0 ? 0 : clampedCurrentStep / totalSteps;

  // SVG circle geometry
  const r = (size - strokeWidth) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // Arc calculations
  const trackArcLength = circumference * arcPercentage;
  const dashOffset = trackArcLength * (1 - progress);

  // Minimal dot handling (currentStep <= 0 means "not started")
  const showMinimalDot = clampedCurrentStep <= 0;
  const progressDashArray = `${trackArcLength} ${circumference}`;
  const progressDashOffset = showMinimalDot ? trackArcLength - 2 : dashOffset;

  return {
    displayLabel,
    progress,
    r,
    cx,
    cy,
    circumference,
    trackArcLength,
    trackDashArray: `${trackArcLength} ${circumference}`,
    progressDashArray,
    progressDashOffset,
    showMinimalDot,
  };
};
