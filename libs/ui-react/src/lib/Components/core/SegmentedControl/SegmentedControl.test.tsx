import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import '@testing-library/jest-dom';

import { DotCount } from '../DotCount';
import {
  SegmentedControl,
  SegmentedControlButton,
  createSegmentedControl,
} from './SegmentedControl';

class MockResizeObserver {
  callback: ResizeObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
}

const originalResizeObserver = global.ResizeObserver;
beforeAll(() => {
  global.ResizeObserver = MockResizeObserver;
});
afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
});

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

  it('renders trailingContent inside segment buttons', () => {
    render(
      <SegmentedControl
        selectedValue='tokens'
        onSelectedChange={() => {
          /* empty */
        }}
        aria-label='Asset section'
      >
        <SegmentedControlButton
          value='tokens'
          trailingContent={<DotCount value={3} aria-label='3 tokens' />}
        >
          Tokens
        </SegmentedControlButton>
        <SegmentedControlButton value='nfts'>NFTs</SegmentedControlButton>
      </SegmentedControl>,
    );

    expect(screen.getByLabelText('3 tokens')).toBeTruthy();
  });

  describe('tabLayout fit', () => {
    function renderWithControls() {
      return render(
        <SegmentedControl
          tabLayout='fit'
          selectedValue='a'
          onSelectedChange={() => {
            /* empty */
          }}
          aria-label='Nav'
        >
          <SegmentedControlButton value='a'>A</SegmentedControlButton>
          <SegmentedControlButton value='b'>B</SegmentedControlButton>
          <SegmentedControlButton value='c'>C</SegmentedControlButton>
        </SegmentedControl>,
      );
    }

    it('renders segments', () => {
      renderWithControls();
      expect(screen.getByText('A')).toBeTruthy();
      expect(screen.getByText('B')).toBeTruthy();
    });

    it('renders scroll arrows that stay inert while nothing overflows', () => {
      renderWithControls();

      expect(screen.getByLabelText('Scroll left')).toBeDisabled();
      expect(screen.getByLabelText('Scroll right')).toBeDisabled();
    });
  });

  describe('createSegmentedControl', () => {
    it('returns typed components that render and select like the originals', () => {
      const {
        SegmentedControl: TypedControl,
        SegmentedControlButton: TypedButton,
      } = createSegmentedControl<'send' | 'receive'>();
      const onSelectedChange = vi.fn();

      render(
        <TypedControl
          selectedValue='send'
          onSelectedChange={onSelectedChange}
          aria-label='Transaction type'
        >
          <TypedButton value='send'>Send</TypedButton>
          <TypedButton value='receive'>Receive</TypedButton>
        </TypedControl>,
      );

      fireEvent.click(screen.getByText('Receive'));

      expect(onSelectedChange).toHaveBeenCalledWith('receive');
    });
  });
});
