import { describe, it, expect } from 'vitest';
import { getStepperCalculations } from '../getStepperCalculations';

describe('getStepperCalculations', () => {
  const defaultInput = {
    currentStep: 2,
    totalSteps: 4,
    size: 48,
  };

  it('should compute display label as "currentStep/totalSteps"', () => {
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

  it('should compute progress as currentStep / totalSteps', () => {
    const result = getStepperCalculations(defaultInput);
    expect(result.progress).toBe(0.5);
  });

  it('should clamp progress and label when currentStep is out of bounds', () => {
    const negative = getStepperCalculations({
      ...defaultInput,
      currentStep: -3,
    });
    expect(negative.progress).toBe(0);
    expect(negative.displayLabel).toBe('0/4');

    const overflow = getStepperCalculations({
      ...defaultInput,
      currentStep: 10,
    });
    expect(overflow.progress).toBe(1);
    expect(overflow.displayLabel).toBe('4/4');
  });

  it('should handle zero totalSteps gracefully', () => {
    const result = getStepperCalculations({
      ...defaultInput,
      totalSteps: 0,
    });
    expect(result.progress).toBe(0);
  });

  it('should show minimal dot when currentStep <= 0', () => {
    const zero = getStepperCalculations({
      ...defaultInput,
      currentStep: 0,
    });
    expect(zero.showMinimalDot).toBe(true);

    const started = getStepperCalculations(defaultInput);
    expect(started.showMinimalDot).toBe(false);
  });
});
