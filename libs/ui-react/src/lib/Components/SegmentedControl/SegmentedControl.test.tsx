import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

import { DotCount } from '../DotCount';
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
});
