import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings } from '../../Symbols';
import { TileButton } from './TileButton';

describe('TileButton Component', () => {
  describe('Basic Rendering', () => {
    it('should render with icon and children', () => {
      render(<TileButton icon={Settings}>Settings</TileButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('should render the icon', () => {
      render(<TileButton icon={Settings}>Settings</TileButton>);

      const button = screen.getByRole('button');
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('should call onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(
        <TileButton icon={Settings} onClick={handleClick}>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', () => {
      const handleClick = vi.fn();
      render(
        <TileButton icon={Settings} onClick={handleClick} disabled>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Disabled State', () => {
    it('should have disabled attribute when disabled', () => {
      render(
        <TileButton icon={Settings} disabled>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('data-disabled');
    });

    it('should apply disabled styles', () => {
      render(
        <TileButton icon={Settings} disabled>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-disabled');
      expect(button).toHaveClass('text-disabled');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      const customClass = 'custom-test-class';
      render(
        <TileButton icon={Settings} className={customClass}>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass(customClass);
    });

    it('should apply full width when isFull is true', () => {
      render(
        <TileButton icon={Settings} isFull>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });
  });

  describe('Accessibility', () => {
    it('should use custom aria-label when provided', () => {
      const customAriaLabel = 'Open settings menu';
      render(
        <TileButton icon={Settings} aria-label={customAriaLabel}>
          Settings
        </TileButton>,
      );

      const button = screen.getByRole('button', { name: customAriaLabel });
      expect(button).toHaveAttribute('aria-label', customAriaLabel);
    });

    it('should have type="button" to prevent form submission', () => {
      render(<TileButton icon={Settings}>Settings</TileButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });
  });

  describe('Forwarded Ref', () => {
    it('should forward ref to button element', () => {
      const ref = vi.fn();
      render(
        <TileButton icon={Settings} ref={ref}>
          Settings
        </TileButton>,
      );

      expect(ref).toHaveBeenCalled();
      expect(ref.mock.calls[0][0]).toBeInstanceOf(HTMLButtonElement);
    });
  });

  describe('asChild Pattern', () => {
    it('should render as child element when asChild is true', () => {
      render(
        <TileButton asChild icon={Settings}>
          <a href='/settings'>Settings Link</a>
        </TileButton>,
      );

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/settings');
    });

    it('should apply TileButton styles to child element', () => {
      render(
        <TileButton asChild icon={Settings}>
          <a href='/settings'>Settings Link</a>
        </TileButton>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass('bg-muted');
      expect(link).toHaveClass('rounded-md');
    });

    it('should render icon when using asChild', () => {
      render(
        <TileButton asChild icon={Settings}>
          <a href='/settings'>Settings Link</a>
        </TileButton>,
      );

      const link = screen.getByRole('link');
      const svg = link.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('should apply custom className when using asChild', () => {
      const customClass = 'custom-link-class';
      render(
        <TileButton asChild icon={Settings} className={customClass}>
          <a href='/settings'>Settings Link</a>
        </TileButton>,
      );

      const link = screen.getByRole('link');
      expect(link).toHaveClass(customClass);
    });
  });
});
