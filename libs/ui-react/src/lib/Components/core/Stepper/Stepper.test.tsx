import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';

import { ThemeProvider } from '../ThemeProvider';
import { Stepper } from './Stepper';

describe('Stepper Component', () => {
  it('announces the default label as a sentence while showing currentStep/totalSteps', () => {
    const { container } = render(
      <ThemeProvider>
        <Stepper currentStep={2} totalSteps={4} />
      </ThemeProvider>,
    );
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toHaveAttribute('aria-label', 'Step 2 of 4');
    expect(container.textContent).toContain('2/4');
  });

  it('should render with default label currentStep/totalSteps', () => {
    const { container } = render(<Stepper currentStep={2} totalSteps={4} />);
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toBeInTheDocument();
    expect(stepper).toHaveAttribute(
      'aria-label',
      'components.stepper.progressAriaLabel',
    );
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
    const progressCircle = container.querySelectorAll('circle')[2];
    expect(progressCircle).toHaveClass('stroke-active');
  });

  it('should render disabled stroke when disabled', () => {
    const { container } = render(
      <Stepper currentStep={2} totalSteps={4} disabled />,
    );
    const progressCircle = container.querySelectorAll('circle')[2];
    expect(progressCircle).toHaveClass('stroke-muted-subtle-hover');
  });

  it('should truncate long labels', () => {
    const { getByText } = render(
      <Stepper currentStep={1} totalSteps={4} label='A very long label' />,
    );
    expect(getByText('A very long label')).toHaveClass('truncate');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Stepper currentStep={2} totalSteps={4} className='bg-accent' />,
    );
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toHaveClass('bg-accent');
  });

  it('should render md size by default', () => {
    const { container } = render(<Stepper currentStep={2} totalSteps={4} />);
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toHaveClass('size-48');
    expect(container.querySelector('svg')).toHaveAttribute('width', '48');
  });

  it('should render lg size', () => {
    const { container } = render(
      <Stepper currentStep={2} totalSteps={4} size='lg' />,
    );
    const stepper = container.querySelector('[role="progressbar"]');
    expect(stepper).toHaveClass('size-72');
    expect(container.querySelector('svg')).toHaveAttribute('width', '72');
  });

  it('should fully hide progress when currentStep <= 0', () => {
    const { container } = render(<Stepper currentStep={0} totalSteps={4} />);
    const maskCircle = container.querySelectorAll('circle')[1] as SVGElement;
    const circumference = 2 * Math.PI * ((48 - 4) / 2);
    const strokeDashoffset = parseFloat(maskCircle.style.strokeDashoffset);
    expect(strokeDashoffset).toBeCloseTo(circumference);
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
