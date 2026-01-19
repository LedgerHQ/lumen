import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Settings, MoreVertical } from '../../Symbols';
import {
  Tile,
  TileSpot,
  TileContent,
  TileTitle,
  TileDescription,
  TileSecondaryAction,
} from './Tile';

describe('Tile Component', () => {
  describe('Basic Rendering', () => {
    it('should render correctly with composite API', () => {
      render(
        <Tile>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeInTheDocument();
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render custom content', () => {
      render(
        <Tile>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
          <div data-testid='custom-content'>Custom Content</div>
        </Tile>,
      );
      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
    });

    it('should render secondary action when provided', () => {
      render(
        <Tile>
          <TileSecondaryAction icon={MoreVertical} aria-label='More actions' />
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );
      const secondaryAction = screen.getByLabelText(/more actions/i);
      expect(secondaryAction).toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('should call onClick handler when tile is clicked', () => {
      const handleClick = vi.fn();
      render(
        <Tile onClick={handleClick}>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const buttonElement = screen.getByRole('button');
      fireEvent.click(buttonElement);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should call secondary action onClick and stop propagation', () => {
      const handleTileClick = vi.fn();
      const handleSecondaryClick = vi.fn();

      render(
        <Tile onClick={handleTileClick} aria-label='Main tile'>
          <TileSecondaryAction
            icon={MoreVertical}
            onClick={handleSecondaryClick}
            aria-label='More actions'
          />
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const secondaryActionButton = screen.getByRole('button', {
        name: /more actions/i,
      });
      fireEvent.click(secondaryActionButton);

      expect(handleSecondaryClick).toHaveBeenCalledTimes(1);
      expect(handleTileClick).not.toHaveBeenCalled();
    });
  });

  describe('Button States', () => {
    it('should have correct base classes', () => {
      render(
        <Tile>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('bg-base-transparent');
    });

    it('should have card appearance classes when specified', () => {
      render(
        <Tile appearance='card'>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );
      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toHaveClass('bg-surface');
    });
  });

  describe('Context Propagation', () => {
    it('should propagate disabled state to TileSpot', () => {
      render(
        <Tile disabled>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });

    it('should propagate disabled state to TileTitle', () => {
      render(
        <Tile disabled>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const titleElement = screen.getByText('Test Title');
      expect(titleElement).toHaveClass('text-disabled');
    });

    it('should propagate disabled state to TileDescription', () => {
      render(
        <Tile disabled>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
            <TileDescription>Test Description</TileDescription>
          </TileContent>
        </Tile>,
      );

      const descriptionElement = screen.getByText('Test Description');
      expect(descriptionElement).toHaveClass('text-disabled');
    });

    it('should hide TileSecondaryAction when disabled', () => {
      render(
        <Tile disabled>
          <TileSecondaryAction icon={MoreVertical} aria-label='More actions' />
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const secondaryAction = screen.queryByLabelText(/more actions/i);
      expect(secondaryAction).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should use custom aria-label when provided', () => {
      const customAriaLabel = 'Custom label';
      render(
        <Tile aria-label={customAriaLabel}>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const buttonElement = screen.getByRole('button', {
        name: customAriaLabel,
      });
      expect(buttonElement).toHaveAttribute('aria-label', customAriaLabel);
    });

    it('should set disabled attribute on button when disabled', () => {
      render(
        <Tile disabled>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const buttonElement = screen.getByRole('button');
      expect(buttonElement).toBeDisabled();
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className to container', () => {
      const customClass = 'custom-test-class';
      render(
        <Tile className={customClass}>
          <TileSpot appearance='icon' icon={Settings} />
          <TileContent>
            <TileTitle>Test Title</TileTitle>
          </TileContent>
        </Tile>,
      );

      const buttonElement = screen.getByRole('button');
      const containerElement = buttonElement.parentElement;
      expect(containerElement).toHaveClass(customClass);
    });
  });
});
