import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings } from '../../symbols';
import { BaseButton } from './BaseButton';

describe('BaseButton', () => {
  describe('Rendering', () => {
    it('should render its children with the button role', () => {
      render(<BaseButton>Click me</BaseButton>);
      expect(
        screen.getByRole('button', { name: /click me/i }),
      ).toBeInTheDocument();
    });

    it('should render an icon alongside children', () => {
      render(<BaseButton icon={Settings}>Settings</BaseButton>);
      expect(
        screen.getByRole('button', { name: /settings/i }),
      ).toBeInTheDocument();
    });

    it('should render as an icon-only button when no children are provided', () => {
      render(<BaseButton aria-label='Settings' icon={Settings} />);
      expect(
        screen.getByRole('button', { name: /settings/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Appearances', () => {
    it.each([
      ['base', 'bg-interactive'],
      ['gray', 'bg-muted'],
      ['accent', 'bg-accent'],
      ['transparent', 'bg-muted-transparent'],
      ['no-background', 'bg-transparent'],
      ['red', 'bg-error'],
    ] as const)(
      'should apply the background class for the %s appearance',
      (appearance, expectedClass) => {
        render(<BaseButton appearance={appearance}>Label</BaseButton>);
        expect(screen.getByRole('button')).toHaveClass(expectedClass);
      },
    );
  });

  describe('Sizes', () => {
    it.each([
      ['xs', 'p-8'],
      ['sm', 'p-10'],
      ['md', 'p-12'],
      ['lg', 'p-16'],
    ] as const)(
      'should apply the padding class for the %s size',
      (size, expectedClass) => {
        render(<BaseButton size={size}>Label</BaseButton>);
        expect(screen.getByRole('button')).toHaveClass(expectedClass);
      },
    );
  });

  describe('States', () => {
    it('should be disabled when the disabled prop is true', () => {
      render(<BaseButton disabled>Disabled</BaseButton>);
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should show a loading spinner when loading is true', () => {
      render(<BaseButton loading>Loading</BaseButton>);
      expect(screen.getByLabelText(/loading/i)).toBeInTheDocument();
    });

    it('should apply the full-width class when isFull is true', () => {
      render(<BaseButton isFull>Full width</BaseButton>);
      expect(screen.getByRole('button')).toHaveClass('w-full');
    });
  });

  describe('Interactions', () => {
    it('should call onClick when clicked', () => {
      const handleClick = vi.fn();
      render(<BaseButton onClick={handleClick}>Clickable</BaseButton>);
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <BaseButton onClick={handleClick} disabled>
          Not clickable
        </BaseButton>,
      );
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Type attribute', () => {
    it('should default to type="button" so it does not submit a form', () => {
      render(<BaseButton>Default type</BaseButton>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
    });

    it('should let the caller override the type', () => {
      render(<BaseButton type='submit'>Submit</BaseButton>);
      expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
    });

    it('should not inject a type onto asChild (Slot) renders', () => {
      render(
        <BaseButton asChild>
          <a href='/home'>Link</a>
        </BaseButton>,
      );
      expect(screen.getByRole('link')).not.toHaveAttribute('type');
    });
  });
});
