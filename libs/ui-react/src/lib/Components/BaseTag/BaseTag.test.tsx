import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import { BaseTag } from './BaseTag';
import type { BaseTagProps } from './types';

const baseProps = {
  consumerName: 'BaseTagTest',
  variant: 'tag',
  label: 'Label',
} satisfies BaseTagProps;

const renderBaseTag = (overrides: Partial<BaseTagProps> = {}) =>
  render(<BaseTag {...baseProps} {...overrides} data-testid='base-tag' />);

describe('BaseTag', () => {
  describe('Rendering', () => {
    it('should render the label text', () => {
      renderBaseTag({ label: 'Bitcoin' });
      expect(screen.getByText('Bitcoin')).toBeInTheDocument();
    });

    it('should expose the root through data-testid', () => {
      renderBaseTag();
      expect(screen.getByTestId('base-tag')).toBeInTheDocument();
    });

    it('should not render any leading content when none is provided', () => {
      renderBaseTag();
      expect(screen.queryByTestId('leading')).not.toBeInTheDocument();
    });

    it('should render the provided leading content before the label', () => {
      renderBaseTag({
        leadingContent: <span data-testid='leading'>L</span>,
      });
      const root = screen.getByTestId('base-tag');
      const leading = screen.getByTestId('leading');
      expect(root).toContainElement(leading);
      expect(leading.compareDocumentPosition(screen.getByText('Label'))).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING,
      );
    });
  });

  describe('Appearances', () => {
    const cases: [NonNullable<BaseTagProps['appearance']>, string][] = [
      ['base', 'bg-muted-transparent'],
      ['gray', 'bg-muted-transparent'],
      ['accent', 'bg-accent'],
      ['accent-subtle', 'bg-active-subtle'],
      ['success', 'bg-success'],
      ['error', 'bg-error'],
      ['warning', 'bg-warning'],
    ];

    it.each(cases)(
      'should apply background class for %s appearance',
      (appearance, expectedClass) => {
        renderBaseTag({ appearance });
        expect(screen.getByTestId('base-tag')).toHaveClass(expectedClass);
      },
    );
  });

  describe('Sizes', () => {
    it.each(['sm', 'md'] as const)(
      'should render with %s size typography',
      (size) => {
        renderBaseTag({ size });
        expect(screen.getByTestId('base-tag')).toHaveClass(
          size === 'md' ? 'body-3' : 'body-4',
        );
      },
    );
  });

  describe('Variants', () => {
    it('should use symmetric horizontal padding for tag variant', () => {
      renderBaseTag({ variant: 'tag', size: 'md' });
      const root = screen.getByTestId('base-tag');
      expect(root).toHaveClass('px-8');
      expect(root).not.toHaveClass('pl-4');
    });

    it('should use asymmetric padding for media variant', () => {
      renderBaseTag({ variant: 'media', size: 'md' });
      const root = screen.getByTestId('base-tag');
      expect(root).toHaveClass('pl-4');
      expect(root).toHaveClass('pr-8');
      expect(root).not.toHaveClass('px-8');
    });
  });

  describe('Disabled', () => {
    it('should apply disabled background and text classes when disabled', () => {
      renderBaseTag({ disabled: true });
      const root = screen.getByTestId('base-tag');
      expect(root).toHaveClass('bg-disabled');
      expect(root).toHaveClass('text-disabled');
    });
  });

  describe('Styling', () => {
    it('should merge custom className with computed classes', () => {
      renderBaseTag({ className: 'mt-4' });
      expect(screen.getByTestId('base-tag')).toHaveClass('mt-4');
    });

    it('should forward extra div props (onClick) to the root', () => {
      const onClick = vi.fn();
      renderBaseTag({ onClick });
      screen.getByTestId('base-tag').click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });
});
