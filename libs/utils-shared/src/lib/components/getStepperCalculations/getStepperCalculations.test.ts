import { describe, it, expect } from 'vitest';
import { getStepperCalculations } from '../getStepperCalculations';

describe('getStepperCalculations', () => {
  const defaultInput = {
    currentStep: 2,
    totalSteps: 4,
    size: 48,
  };

  it('should compute display label from currentStep and totalSteps', () => {
    const result = getStepperCalculations(defaultInput);
    expect(result.displayLabel).toBe('2/4');
  });

  it('should use custom label when provided', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      label: 'Step 2 of 4',
    });
    expect(result.displayLabel).toBe('Step 2 of 4');
  });

  it('should clamp display label to totalSteps', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      currentStep: 10,
    });
    expect(result.displayLabel).toBe('4/4');
  });

  it('should compute progress as currentStep / totalSteps', () => {
    const result = getStepperCalculations(defaultInput);
    expect(result.progress).toBe(0.5);
  });

  it('should clamp progress between 0 and 1', () => {
    const negativeResult = getStepperCalculations({
      ...defaultInput,
      currentStep: -1,
    });
    expect(negativeResult.progress).toBe(0);

    const overflowResult = getStepperCalculations({
      ...defaultInput,
      currentStep: 10,
    });
    expect(overflowResult.progress).toBe(1);
  });

  it('should handle zero totalSteps gracefully', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      totalSteps: 0,
    });
    expect(result.progress).toBe(0);
  });

  it('should compute correct SVG geometry for default size', () => {
    const result = getStepperCalculations(defaultInput);
    expect(result.cx).toBe(24);
    expect(result.cy).toBe(24);
    expect(result.r).toBe(22); // (48 - 4) / 2
  });

  it('should respect custom strokeWidth', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      strokeWidth: 6,
    });
    expect(result.r).toBe(21); // (48 - 6) / 2
  });

  it('should compute trackArcLength as 75% of circumference by default', () => {
    const result = getStepperCalculations(defaultInput);
    const expectedCircumference = 2 * Math.PI * 22;
    expect(result.circumference).toBeCloseTo(expectedCircumference);
    expect(result.trackArcLength).toBeCloseTo(expectedCircumference * 0.75);
  });

  it('should respect custom arcPercentage', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      arcPercentage: 0.5,
    });
    const expectedCircumference = 2 * Math.PI * 22;
    expect(result.trackArcLength).toBeCloseTo(expectedCircumference * 0.5);
  });

  it('should show minimal dot when currentStep is 0', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      currentStep: 0,
    });
    expect(result.showMinimalDot).toBe(true);
    expect(result.progressDashOffset).toBeCloseTo(result.trackArcLength - 2);
  });

  it('should show minimal dot when currentStep is negative', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      currentStep: -1,
    });
    expect(result.showMinimalDot).toBe(true);
    expect(result.progressDashOffset).toBeCloseTo(result.trackArcLength - 2);
  });

  it('should show normal progress arc when currentStep > 0', () => {
    const result = getStepperCalculations(defaultInput);
    expect(result.showMinimalDot).toBe(false);
    expect(result.progressDashArray).toContain(String(result.trackArcLength));
  });

  it('should compute progressDashOffset as 0 when progress is 100%', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      currentStep: 4,
      totalSteps: 4,
    });
    expect(result.progressDashOffset).toBeCloseTo(0);
  });

  it('should compute progressDashOffset equal to trackArcLength when progress is 0%', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      currentStep: 0,
      totalSteps: 4,
    });
    // When showMinimalDot, offset = trackArcLength - 2
    expect(result.progressDashOffset).toBeCloseTo(result.trackArcLength - 2);
  });

  it('should compute trackDashArray consistently', () => {
    const result = getStepperCalculations(defaultInput);
    expect(result.trackDashArray).toBe(
      `${result.trackArcLength} ${result.circumference}`,
    );
  });

  describe('currentStep clamping', () => {
    it('should clamp negative currentStep to 0', () => {
      const result = getStepperCalculations({
        ...defaultInput,
        currentStep: -3,
      });
      expect(result.displayLabel).toBe('0/4');
      expect(result.progress).toBe(0);
      expect(result.showMinimalDot).toBe(true);
    });

    it('should clamp currentStep above totalSteps to totalSteps', () => {
      const result = getStepperCalculations({
        ...defaultInput,
        currentStep: 7,
        totalSteps: 4,
      });
      expect(result.displayLabel).toBe('4/4');
      expect(result.progress).toBe(1);
      expect(result.showMinimalDot).toBe(false);
    });

    it('should not affect currentStep within valid range', () => {
      const result = getStepperCalculations({
        ...defaultInput,
        currentStep: 2,
        totalSteps: 4,
      });
      expect(result.displayLabel).toBe('2/4');
      expect(result.progress).toBe(0.5);
      expect(result.showMinimalDot).toBe(false);
    });

    it('should allow currentStep equal to 0', () => {
      const result = getStepperCalculations({
        ...defaultInput,
        currentStep: 0,
      });
      expect(result.displayLabel).toBe('0/4');
      expect(result.progress).toBe(0);
      expect(result.showMinimalDot).toBe(true);
    });

    it('should allow currentStep equal to totalSteps', () => {
      const result = getStepperCalculations({
        ...defaultInput,
        currentStep: 4,
        totalSteps: 4,
      });
      expect(result.displayLabel).toBe('4/4');
      expect(result.progress).toBe(1);
      expect(result.showMinimalDot).toBe(false);
    });
  });
});
