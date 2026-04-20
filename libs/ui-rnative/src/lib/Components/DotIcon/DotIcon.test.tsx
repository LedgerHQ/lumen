import { describe, it, expect } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ArrowDown } from '../../Symbols';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { DotIcon } from './DotIcon';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

describe('DotIcon Component', () => {
  describe('Rendering', () => {
    it('should render children', () => {
      const { getByText } = render(
        <TestWrapper>
          <DotIcon testID='dot-icon' appearance='success' icon={ArrowDown}>
            <Text>Child</Text>
          </DotIcon>
        </TestWrapper>,
      );

      expect(getByText('Child')).toBeTruthy();
    });

    it('should render without children', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon testID='dot-icon' appearance='success' icon={ArrowDown} />
        </TestWrapper>,
      );

      expect(getByTestId('dot-icon')).toBeTruthy();
    });

    it('should have correct displayName', () => {
      expect(DotIcon.displayName).toBe('DotIcon');
    });
  });

  describe('Styling', () => {
    it('should apply custom styles', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='dot-icon'
            appearance='success'
            icon={ArrowDown}
            style={{ marginTop: 10 }}
          />
        </TestWrapper>,
      );

      const root = getByTestId('dot-icon');
      expect(root.props.style.marginTop).toBe(10);
    });

    it('should pass additional props', () => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='custom-dot'
            appearance='success'
            icon={ArrowDown}
          />
        </TestWrapper>,
      );

      expect(getByTestId('custom-dot')).toBeTruthy();
    });
  });

  describe('Appearances', () => {
    it.each([
      { appearance: 'success' as const },
      { appearance: 'muted' as const },
      { appearance: 'error' as const },
    ])('should render with $appearance appearance', ({ appearance }) => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='dot-icon'
            appearance={appearance}
            icon={ArrowDown}
          />
        </TestWrapper>,
      );

      expect(getByTestId('dot-icon')).toBeTruthy();
    });
  });

  describe('Sizes', () => {
    it.each([
      { size: 16 as const },
      { size: 20 as const },
      { size: 24 as const },
    ])('should render with size $size', ({ size }) => {
      const { getByTestId } = render(
        <TestWrapper>
          <DotIcon
            testID='dot-icon'
            appearance='success'
            icon={ArrowDown}
            size={size}
          />
        </TestWrapper>,
      );

      expect(getByTestId('dot-icon')).toBeTruthy();
    });
  });
});
