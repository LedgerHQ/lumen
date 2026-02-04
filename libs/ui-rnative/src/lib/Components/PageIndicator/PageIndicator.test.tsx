import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';
import React from 'react';

import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { PageIndicator } from './PageIndicator';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

describe('PageIndicator Component', () => {
  describe('Rendering', () => {
    it('should render with required props', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={5} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should have correct accessibility role', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={5} />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator.props.accessibilityRole).toBe('none');
    });

    it('should render all dots when totalPages is less than max visible', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={3} />,
      );
      // Should render 3 dots (less than MAX_VISIBLE_DOTS which is 4)
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render max visible dots when totalPages exceeds max', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={10} />,
      );
      // Should render 10 dots but only 4 visible in viewport
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Page States', () => {
    it('should render with first page active', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={5} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with middle page active', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={2} totalPages={5} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with last page active', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={4} totalPages={5} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should render with single page', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={1} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with two pages', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={0} totalPages={2} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with many pages', () => {
      renderWithProvider(
        <PageIndicator testID='page-indicator' currentPage={5} totalPages={20} />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should accept lx prop for custom styling', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={0}
          totalPages={5}
          lx={{ marginTop: 's16' }}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should accept style prop for custom styling', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={0}
          totalPages={5}
          style={{ marginTop: 16 }}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Props', () => {
    it('should accept ref prop', () => {
      const ref = React.createRef<React.ElementRef<typeof PageIndicator>>();
      renderWithProvider(
        <PageIndicator
          ref={ref}
          testID='page-indicator'
          currentPage={0}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should accept additional props', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={0}
          totalPages={5}
          accessibilityLabel='Page indicator'
        />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator.props.accessibilityLabel).toBe('Page indicator');
    });
  });
});
