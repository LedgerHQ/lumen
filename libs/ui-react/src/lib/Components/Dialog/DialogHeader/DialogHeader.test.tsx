import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { Dialog } from '..';
import { DialogHeader } from './DialogHeader';

describe('DialogHeader', () => {
  it('renders compact appearance with title and description', () => {
    render(
      <Dialog open>
        <DialogHeader
          appearance='compact'
          title='Test Title'
          description='Test Desc'
          onClose={() => {
            console.log('close');
          }}
        />
      </Dialog>,
    );
    const titles = screen.getAllByText('Test Title');
    expect(titles.length).toBeGreaterThanOrEqual(1);
    const descriptions = screen.getAllByText('Test Desc');
    expect(descriptions.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onClose when close button is clicked in compact appearance', () => {
    const onClose = vi.fn();
    render(
      <Dialog open>
        <DialogHeader appearance='compact' onClose={onClose} />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders back button and calls onBack when clicked in compact appearance', () => {
    const onBack = vi.fn();
    const onClose = vi.fn();
    render(
      <Dialog open>
        <DialogHeader appearance='compact' onClose={onClose} onBack={onBack} />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[0]);
    expect(onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(buttons[1]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders extended appearance with title and description', () => {
    render(
      <Dialog open>
        <DialogHeader
          appearance='extended'
          title='Test Title'
          description='Test Desc'
          onClose={() => {
            console.log('close');
          }}
        />
      </Dialog>,
    );
    const titles = screen.getAllByText('Test Title');
    expect(titles.length).toBeGreaterThanOrEqual(1);
    const descriptions = screen.getAllByText('Test Desc');
    expect(descriptions.length).toBeGreaterThanOrEqual(1);
  });

  it('calls onClose when close button is clicked in extended appearance', () => {
    const onClose = vi.fn();
    render(
      <Dialog open>
        <DialogHeader appearance='extended' onClose={onClose} />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders back button and calls onBack when clicked in extended appearance', () => {
    const onBack = vi.fn();
    const onClose = vi.fn();
    render(
      <Dialog open>
        <DialogHeader appearance='extended' onClose={onClose} onBack={onBack} />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(2);
    fireEvent.click(buttons[0]);
    expect(onBack).toHaveBeenCalledTimes(1);
    fireEvent.click(buttons[1]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('renders close button without onClose prop', () => {
    render(
      <Dialog open>
        <DialogHeader appearance='compact' title='Test Title' />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('renders close button in extended appearance without onClose prop', () => {
    render(
      <Dialog open>
        <DialogHeader appearance='extended' title='Test Title' />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(1);
  });

  it('calls onClose callback when provided and close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Dialog open>
        <DialogHeader
          appearance='compact'
          title='Test Title'
          onClose={onClose}
        />
      </Dialog>,
    );
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
