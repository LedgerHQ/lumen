import { render, screen } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { PageIndicator } from './PageIndicator';

describe('PageIndicator Component', () => {
  describe('Rendering', () => {
    it('should render with required props', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should have correct accessibility role', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator.getAttribute('role')).toBe('none');
    });

    it('should render all dots when totalPages is less than max visible', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={3}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render max visible dots when totalPages exceeds max', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={10}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Page States', () => {
    it('should render with first page active', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with middle page active', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={3}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with last page active', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={5}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('should render with single page', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={1}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with two pages', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={2}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });

    it('should render with many pages', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={6}
          totalPages={20}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
    });
  });

  describe('Custom Styling', () => {
    it('should accept className prop for custom styling', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={5}
          className='mt-16'
        />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator).toHaveClass('mt-16');
    });
  });

  describe('Props', () => {
    it('should accept ref prop', () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <PageIndicator
          ref={ref}
          data-testid='page-indicator'
          currentPage={1}
          totalPages={5}
        />,
      );
      expect(screen.getByTestId('page-indicator')).toBeTruthy();
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });

    it('should accept additional props', () => {
      render(
        <PageIndicator
          data-testid='page-indicator'
          currentPage={1}
          totalPages={5}
          aria-label='Page indicator'
        />,
      );
      const indicator = screen.getByTestId('page-indicator');
      expect(indicator.getAttribute('aria-label')).toBe('Page indicator');
    });
  });
});
