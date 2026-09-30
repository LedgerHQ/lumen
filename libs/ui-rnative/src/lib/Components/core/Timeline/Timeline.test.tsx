import { describe, expect, it } from '@jest/globals';
import { ledgerLiveThemes } from '@ledgerhq/lumen-design-core';
import { render, screen, waitFor } from '@testing-library/react-native';
import { createRef, type ReactNode } from 'react';
import { StyleSheet, type View } from 'react-native';
import { Text } from '../../primitives';
import { ThemeProvider } from '../ThemeProvider/ThemeProvider';
import {
  Timeline,
  TimelineItem,
  TimelineItemBody,
  TimelineItemCaption,
  TimelineItemDescription,
  TimelineItemHeader,
  TimelineItemLeading,
  TimelineItemLeadingRow,
  TimelineItemTitle,
  TimelineItemTrailing,
} from './Timeline';
import type { TimelineItemProps, TimelineItemStatus } from './types';

const { colors } = ledgerLiveThemes.dark;

const hidden = { includeHiddenElements: true };

const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider themes={ledgerLiveThemes} colorScheme='dark' locale='en'>
    {children}
  </ThemeProvider>
);

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
      <TimelineItemTrailing>
        <Text>0.42 ETH</Text>
      </TimelineItemTrailing>
    </TimelineItemHeader>
    <TimelineItemBody>
      <Text>Viewed in Ledger Live.</Text>
    </TimelineItemBody>
  </TimelineItem>
);

describe('Timeline', () => {
  describe('Rendering', () => {
    it('should render the item parts', () => {
      render(
        <TestWrapper>
          <Timeline>
            <Item title='Payment confirmed' />
          </Timeline>
        </TestWrapper>,
      );

      expect(screen.getByText('12 Mar 2024')).toBeTruthy();
      expect(screen.getByText('Payment confirmed')).toBeTruthy();
      expect(screen.getByText('Confirmed on device')).toBeTruthy();
      expect(screen.getByText('0.42 ETH')).toBeTruthy();
      expect(screen.getByText('Viewed in Ledger Live.')).toBeTruthy();
    });

    it('should render string children in the trailing slot and the body', () => {
      render(
        <TestWrapper>
          <Timeline>
            <TimelineItem>
              <TimelineItemHeader>
                <TimelineItemLeading>
                  <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
                </TimelineItemLeading>
                <TimelineItemTrailing>0.42 ETH</TimelineItemTrailing>
              </TimelineItemHeader>
              <TimelineItemBody>Viewed in Ledger Live.</TimelineItemBody>
            </TimelineItem>
          </Timeline>
        </TestWrapper>,
      );

      expect(screen.getByText('0.42 ETH')).toBeTruthy();
      expect(screen.getByText('Viewed in Ledger Live.')).toBeTruthy();
    });

    it('should forward ref, testID, and style on the root', () => {
      const ref = createRef<View>();

      render(
        <TestWrapper>
          <Timeline
            ref={ref}
            style={{ backgroundColor: 'red' }}
            testID='timeline'
          >
            <Item title='Payment confirmed' />
          </Timeline>
        </TestWrapper>,
      );

      expect(ref.current).toBeTruthy();
      const root = screen.getByTestId('timeline');
      expect(StyleSheet.flatten(root.props.style)).toEqual(
        expect.objectContaining({
          width: '100%',
          backgroundColor: 'red',
        }),
      );
    });
  });

  describe('Status', () => {
    it('should use a neutral indicator and a base title when status is omitted', () => {
      render(
        <TestWrapper>
          <Timeline>
            <Item title='Payment confirmed' />
          </Timeline>
        </TestWrapper>,
      );

      expect(
        StyleSheet.flatten(screen.getByText('Payment confirmed').props.style),
      ).toEqual(expect.objectContaining({ color: colors.text.base }));
      expect(
        StyleSheet.flatten(
          screen.getByTestId('timeline-indicator-neutral', hidden).props.style,
        ),
      ).toEqual(
        expect.objectContaining({
          width: 12,
          height: 12,
          backgroundColor: colors.bg.mutedPressed,
        }),
      );
    });

    it.each<[TimelineItemStatus, string]>([
      ['success', 'timeline-indicator-success'],
      ['error', 'timeline-indicator-error'],
      ['pending', 'timeline-indicator-pending'],
      ['loading', 'timeline-indicator-loading'],
      ['todo', 'timeline-indicator-todo'],
    ])('should render the %s indicator', async (status, testID) => {
      render(
        <TestWrapper>
          <Timeline>
            <Item status={status} title='Payment confirmed' />
          </Timeline>
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByTestId(testID, hidden)).toBeTruthy();
      });
    });

    it('should expose the loading indicator to assistive tech', async () => {
      render(
        <TestWrapper>
          <Timeline>
            <Item status='loading' title='Confirming' />
          </Timeline>
        </TestWrapper>,
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Loading')).toBeTruthy();
      });
    });

    it('should mute the title of a todo item', () => {
      render(
        <TestWrapper>
          <Timeline>
            <Item status='todo' title='Waiting' />
          </Timeline>
        </TestWrapper>,
      );

      expect(
        StyleSheet.flatten(screen.getByText('Waiting').props.style),
      ).toEqual(expect.objectContaining({ color: colors.text.muted }));
      expect(
        StyleSheet.flatten(
          screen.getByTestId('timeline-indicator-todo', hidden).props.style,
        ),
      ).toEqual(
        expect.objectContaining({
          width: 20,
          height: 20,
          borderWidth: 2,
          borderColor: colors.border.mutedSubtleHover,
        }),
      );
    });

    it('should keep the connector plain regardless of status', () => {
      render(
        <TestWrapper>
          <Timeline>
            <Item status='success' title='First' />
            <Item status='error' title='Second' />
          </Timeline>
        </TestWrapper>,
      );

      const outgoing = screen.getByTestId('timeline-line-out', hidden);
      const incoming = screen.getAllByTestId('timeline-line-in', hidden)[1];

      expect(StyleSheet.flatten(outgoing.props.style).backgroundColor).toBe(
        colors.border.mutedSubtleHover,
      );
      expect(StyleSheet.flatten(incoming.props.style).backgroundColor).toBe(
        colors.border.mutedSubtleHover,
      );
    });

    it('should hide the line above the first item and below the last', () => {
      render(
        <TestWrapper>
          <Timeline>
            <Item status='success' title='First' />
            <Item status='todo' title='Last' />
          </Timeline>
        </TestWrapper>,
      );

      const [firstIn, lastIn] = screen.getAllByTestId(
        'timeline-line-in',
        hidden,
      );

      expect(StyleSheet.flatten(firstIn.props.style).opacity).toBe(0);
      expect(StyleSheet.flatten(lastIn.props.style).opacity).not.toBe(0);
      expect(screen.getAllByTestId('timeline-line-out', hidden)).toHaveLength(
        1,
      );
    });

    it('should position items grouped in a fragment as siblings', () => {
      render(
        <TestWrapper>
          <Timeline>
            <>
              <Item status='success' title='First' />
              <Item status='pending' title='Second' />
            </>
            <Item status='todo' title='Last' />
          </Timeline>
        </TestWrapper>,
      );

      const [firstIn, secondIn, lastIn] = screen.getAllByTestId(
        'timeline-line-in',
        hidden,
      );

      expect(StyleSheet.flatten(firstIn.props.style).opacity).toBe(0);
      expect(StyleSheet.flatten(secondIn.props.style).opacity).not.toBe(0);
      expect(StyleSheet.flatten(lastIn.props.style).opacity).not.toBe(0);
      expect(screen.getAllByTestId('timeline-line-out', hidden)).toHaveLength(
        2,
      );
    });
  });
});
