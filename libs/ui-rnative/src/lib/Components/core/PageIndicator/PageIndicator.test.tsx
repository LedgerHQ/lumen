import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen } from '@testing-library/react-native';

import type { ComponentRef } from 'react';
import { createRef } from 'react';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import { PageIndicator } from './PageIndicator';

const renderWithProvider = (component: React.ReactElement) => {
  return render(
    <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
      {component}
    </ThemeProvider>,
  );
};

const wrapWithProvider = (component: React.ReactElement) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {component}
  </ThemeProvider>
);

describe('PageIndicator Component', () => {
  describe('Rendering', () => {
    it('should render with required props', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should have correct accessibility role', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator.props.accessibilityRole).toBe('none');
    });

    it('should render all dots when totalPages is less than max visible', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={3}
        />,
      );
      // Should render 3 dots (less than MAX_VISIBLE_DOTS which is 4)
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render max visible dots when totalPages exceeds max', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={10}
        />,
      );
      // Should render 10 dots but only 4 visible in viewport
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Page States', () => {
    it('should render with first page active', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with middle page active', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={3}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with last page active', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={5}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should render with single page', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={1}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with two pages', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={2}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with many pages', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={6}
          totalPages={20}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should accept lx prop for custom styling', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
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
          currentPage={1}
          totalPages={5}
          style={{ marginTop: 16 }}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Re-rendering', () => {
    // Regression: dot/strip styles must update when currentPage changes.
    // One bug has produced the same broken-on-update symptom:
    //   1. Wrapping in Animated.createAnimatedComponent(Box) — Box flattens
    //      style arrays via StyleSheet.flatten, which snapshots reanimated
    //      animated styles and stops updates.
    // Initial render looked correct in both cases — only re-render exposed
    // the issue, which is what the tests below exercise.
    it('updates the rendered tree when currentPage changes', () => {
      const { rerender } = renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      const treeBefore = JSON.stringify(screen.toJSON());

      rerender(
        wrapWithProvider(
          <PageIndicator
            testID='page-indicator'
            currentPage={3}
            totalPages={5}
          />,
        ),
      );
      const treeAfter = JSON.stringify(screen.toJSON());

      expect(treeAfter).not.toEqual(treeBefore);
    });

    it('updates the active dot style when currentPage changes', () => {
      type Node = {
        type: string;
        props: { style?: unknown };
        children: Node[] | null;
      };
      const getDotStyles = (): unknown[] => {
        const root = screen.toJSON() as Node | null;
        if (!root?.children) throw new Error('Expected container children');
        const viewport = root.children[0];
        if (!viewport?.children) throw new Error('Expected viewport children');
        const strip = viewport.children[0];
        if (!strip?.children) throw new Error('Expected strip children');
        return strip.children.map((dot) => dot.props.style);
      };

      const { rerender } = renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      const stylesBefore = JSON.stringify(getDotStyles());

      rerender(
        wrapWithProvider(
          <PageIndicator
            testID='page-indicator'
            currentPage={3}
            totalPages={5}
          />,
        ),
      );
      const stylesAfter = JSON.stringify(getDotStyles());

      expect(stylesAfter).not.toEqual(stylesBefore);
    });
  });

  describe('Props', () => {
    it('should accept ref prop', () => {
      const ref = createRef<ComponentRef<typeof PageIndicator>>();
      renderWithProvider(
        <PageIndicator
          ref={ref}
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should accept additional props', () => {
      renderWithProvider(
        <PageIndicator
          testID='page-indicator'
          currentPage={1}
          totalPages={5}
          accessibilityLabel='Page indicator'
        />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator.props.accessibilityLabel).toBe('Page indicator');
    });
  });
});
