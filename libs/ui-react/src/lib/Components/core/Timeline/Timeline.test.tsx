import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import '@testing-library/jest-dom';
import {
  Timeline,
  TimelineItem,
  TimelineItemCaption,
  TimelineItemBody,
  TimelineItemDescription,
  TimelineItemHeader,
  TimelineItemLeading,
  TimelineItemLeadingRow,
  TimelineItemTitle,
  TimelineItemTrailing,
} from './Timeline';
import type { TimelineItemProps, TimelineItemStatus } from './types';

const Item = ({
  title,
  ...props
}: Partial<TimelineItemProps> & { title: string }) => (
  <TimelineItem {...props}>
    <TimelineItemHeader>
      <TimelineItemLeading>
        <TimelineItemCaption>12 Mar 2024</TimelineItemCaption>
        <TimelineItemLeadingRow>
          <TimelineItemTitle>{title}</TimelineItemTitle>
        </TimelineItemLeadingRow>
        <TimelineItemDescription>Confirmed on device</TimelineItemDescription>
      </TimelineItemLeading>
      <TimelineItemTrailing>0.42 ETH</TimelineItemTrailing>
    </TimelineItemHeader>
    <TimelineItemBody>Viewed in Ledger Live.</TimelineItemBody>
  </TimelineItem>
);

describe('Timeline', () => {
  describe('Rendering', () => {
    it('should render the item parts', () => {
      render(
        <Timeline>
          <Item title='Payment confirmed' />
        </Timeline>,
      );

      expect(screen.getByText('12 Mar 2024')).toBeInTheDocument();
      expect(screen.getByText('Payment confirmed')).toBeInTheDocument();
      expect(screen.getByText('Confirmed on device')).toBeInTheDocument();
      expect(screen.getByText('0.42 ETH')).toBeInTheDocument();
      expect(screen.getByText('Viewed in Ledger Live.')).toBeInTheDocument();
    });

    it('should forward ref and className on the root', () => {
      const ref = { current: null as HTMLDivElement | null };

      render(
        <Timeline ref={ref} className='max-w-320'>
          <Item title='Payment confirmed' />
        </Timeline>,
      );

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(ref.current).toHaveClass('max-w-320');
    });
  });

  describe('Status', () => {
    it('should use a neutral indicator and a base title when status is omitted', () => {
      render(
        <Timeline>
          <Item title='Payment confirmed' />
        </Timeline>,
      );

      expect(screen.getByText('Payment confirmed')).toHaveClass('text-base');
      expect(
        screen.getByTestId('timeline-indicator-neutral'),
      ).toBeInTheDocument();
      expect(screen.getByTestId('timeline-item')).toBeInTheDocument();
    });

    it.each<[TimelineItemStatus, string]>([
      ['success', 'success'],
      ['error', 'error'],
      ['pending', 'pending'],
      ['loading', 'loading'],
      ['idle', 'idle'],
    ])('should render the %s indicator', (status, indicator) => {
      render(
        <Timeline>
          <Item title='Payment confirmed' status={status} />
        </Timeline>,
      );

      expect(
        screen.getByTestId(`timeline-indicator-${indicator}`),
      ).toBeInTheDocument();
    });

    it('should mute the title of an idle item', () => {
      render(
        <Timeline>
          <Item title='Waiting' status='idle' />
        </Timeline>,
      );

      expect(screen.getByText('Waiting')).toHaveClass('text-muted');
    });

    it('should keep the connector plain regardless of status', () => {
      render(
        <Timeline>
          <Item title='First' status='success' />
          <Item title='Second' status='error' />
        </Timeline>,
      );

      const first = screen
        .getByText('First')
        .closest('[data-testid="timeline-item"]');
      const second = screen
        .getByText('Second')
        .closest('[data-testid="timeline-item"]');
      expect(first?.querySelector('[data-line="out"]')).toHaveClass(
        'border-muted-subtle-hover',
      );
      expect(second?.querySelector('[data-line="in"]')).toHaveClass(
        'border-muted-subtle-hover',
      );
    });

    it('should hide the line above the first item and below the last', () => {
      render(
        <Timeline>
          <Item title='First' status='success' />
          <Item title='Last' status='idle' />
        </Timeline>,
      );

      const first = screen
        .getByText('First')
        .closest('[data-testid="timeline-item"]');
      const last = screen
        .getByText('Last')
        .closest('[data-testid="timeline-item"]');

      expect(first).toHaveClass('group/item');
      expect(first?.querySelector('[data-line="in"]')).toHaveClass(
        'group-first/item:invisible',
      );
      expect(last?.querySelector('[data-line="out"]')).toHaveClass(
        'group-last/item:hidden',
      );
    });
  });
});
