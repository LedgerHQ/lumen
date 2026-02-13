import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import React from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { Stepper } from './Stepper';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('Stepper Component', () => {
  it('should render with i18n accessibility label', async () => {
    const { findByLabelText } = render(
      <TestWrapper>
        <Stepper currentStep={2} totalSteps={4} />
      </TestWrapper>,
    );
    const stepper = await findByLabelText('Step 2 of 4');
    expect(stepper).toBeTruthy();
    expect(stepper.props.accessibilityRole).toBe('progressbar');
    expect(stepper.props.accessibilityValue).toEqual(
      expect.objectContaining({
        now: 2,
        min: 1,
        max: 4,
        text: '2/4',
      }),
    );
  });

  it('should render with custom label', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <Stepper currentStep={3} totalSteps={5} label='Step 3 of 5' />
      </TestWrapper>,
    );
    const stepper = getByLabelText('Step 3 of 5');
    expect(stepper).toBeTruthy();
  });

  it('should render active border color by default', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Stepper currentStep={1} totalSteps={4} testID='stepper' />
      </TestWrapper>,
    );
    const stepper = getByTestId('stepper');
    expect(stepper).toBeTruthy();
  });

  it('should render disabled style when disabled', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Stepper currentStep={2} totalSteps={4} disabled testID='stepper' />
      </TestWrapper>,
    );
    const stepper = getByTestId('stepper');
    expect(stepper).toBeTruthy();
  });

  it('should clamp currentStep to totalSteps in display', () => {
    const { getByText } = render(
      <TestWrapper>
        <Stepper currentStep={10} totalSteps={4} />
      </TestWrapper>,
    );
    expect(getByText('4')).toBeTruthy();
    expect(getByText('/4')).toBeTruthy();
  });

  it('should handle zero totalSteps gracefully', async () => {
    const { findByLabelText } = render(
      <TestWrapper>
        <Stepper currentStep={1} totalSteps={0} />
      </TestWrapper>,
    );
    const stepper = await findByLabelText('Step 0 of 0');
    expect(stepper).toBeTruthy();
  });

  it('should handle currentStep <= 0 (minimal dot)', async () => {
    const { findByLabelText } = render(
      <TestWrapper>
        <Stepper currentStep={0} totalSteps={4} />
      </TestWrapper>,
    );
    const stepper = await findByLabelText('Step 0 of 4');
    expect(stepper).toBeTruthy();
  });

  it('should clamp negative currentStep to 0', async () => {
    const { findByLabelText, getByText } = render(
      <TestWrapper>
        <Stepper currentStep={-3} totalSteps={4} />
      </TestWrapper>,
    );
    const stepper = await findByLabelText('Step 0 of 4');
    expect(stepper).toBeTruthy();
    expect(stepper.props.accessibilityValue).toEqual(
      expect.objectContaining({
        now: -3,
        min: 1,
        max: 4,
        text: '0/4',
      }),
    );
    expect(getByText('0')).toBeTruthy();
    expect(getByText('/4')).toBeTruthy();
  });

  it('should apply custom lx props', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Stepper
          currentStep={2}
          totalSteps={4}
          testID='stepper'
          lx={{ marginTop: 's8' }}
        />
      </TestWrapper>,
    );
    const stepper = getByTestId('stepper');
    const style = stepper.props.style;
    const flatStyle = Array.isArray(style)
      ? Object.assign({}, ...style)
      : style;
    expect(flatStyle.marginTop).toBe(8);
  });
});
