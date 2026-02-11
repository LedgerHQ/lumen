import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import { Stepper } from './Stepper';

describe('Stepper Component', () => {
  it('should render with default label currentStep/totalSteps', () => {
    const { container } = render(<Stepper currentStep={2} totalSteps={4} />);
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute('aria-label', '2/4');
    expect(stepper).toHaveAttribute('aria-valuenow', '2');
    expect(stepper).toHaveAttribute('aria-valuemin', '1');
    expect(stepper).toHaveAttribute('aria-valuemax', '4');
    expect(container.textContent).toContain('2/4');
  });

  it('should render with custom label', () => {
    const { container } = render(
      <Stepper currentStep={3} totalSteps={5} label='Step 3 of 5' />,
    );
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toHaveAttribute('aria-label', 'Step 3 of 5');
    expect(container.textContent).toContain('Step 3 of 5');
  });

  it('should render active stroke by default', () => {
    const { container } = render(<Stepper currentStep={1} totalSteps={4} />);
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle).toHaveClass('stroke-active');
  });

  it('should render disabled stroke when disabled', () => {
    const { container } = render(
      <Stepper currentStep={2} totalSteps={4} disabled />,
    );
    const progressCircle = container.querySelectorAll('circle')[1];
    expect(progressCircle).toHaveClass('stroke-muted-subtle-hover');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Stepper currentStep={2} totalSteps={4} className='bg-accent' />,
    );
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toHaveClass('bg-accent');
  });

  it('should handle currentStep <= 0 (minimal dot)', () => {
    const { container } = render(<Stepper currentStep={0} totalSteps={4} />);
    const progressCircle = container.querySelectorAll('circle')[1] as SVGElement;
    // When currentStep is 0, the offset should position a minimal visible dot
    const circumference = 2 * Math.PI * ((48 - 4) / 2);
    const trackArcLength = circumference * 0.75;
    const strokeDashoffset = parseFloat(progressCircle.style.strokeDashoffset);
    expect(strokeDashoffset).toBeCloseTo(trackArcLength - 2);
  });

  it('should clamp currentStep to totalSteps', () => {
    const { container } = render(<Stepper currentStep={10} totalSteps={4} />);
    expect(container.textContent).toContain('4/4');
  });

  it('should handle zero totalSteps gracefully', () => {
    const { container } = render(<Stepper currentStep={1} totalSteps={0} />);
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toBeInTheDocument();
  });
});
