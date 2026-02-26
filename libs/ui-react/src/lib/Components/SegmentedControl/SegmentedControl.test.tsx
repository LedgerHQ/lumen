import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { SegmentedControl, SegmentedControlButton } from './SegmentedControl';

describe('SegmentedControl', () => {
  it('renders segments with labels', () => {
    render(
      <SegmentedControl
        selectedValue='send'
        onSelectedChange={() => {
          /* empty */
        }}
        aria-label='Transaction type'
      >
        <SegmentedControlButton value='send'>Send</SegmentedControlButton>
        <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
      </SegmentedControl>,
    );
    expect(screen.getByText('Send')).toBeTruthy();
    expect(screen.getByText('Receive')).toBeTruthy();
  });

  it('calls onSelectedChange with segment value when a segment is pressed', () => {
    const onSelectedChange = vi.fn();
    render(
      <SegmentedControl
        selectedValue='send'
        onSelectedChange={onSelectedChange}
        aria-label='Transaction type'
      >
        <SegmentedControlButton value='send'>Send</SegmentedControlButton>
        <SegmentedControlButton value='receive'>Receive</SegmentedControlButton>
      </SegmentedControl>,
    );

    fireEvent.click(screen.getByText('Receive'));

    expect(onSelectedChange).toHaveBeenCalledWith('receive');
  });
});
