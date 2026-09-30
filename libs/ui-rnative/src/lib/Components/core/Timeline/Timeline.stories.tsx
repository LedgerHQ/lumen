import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Text } from '../../primitives';
import { ChevronDown, ChevronUp } from '../../symbols';
import { IconButton } from '../IconButton';
import { Tag } from '../Tag';
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

const meta = {
  component: TimelineItem,
  id: 'rnative-timeline',
  title: 'Core/Timeline',
  subcomponents: {
    Timeline,
    TimelineItemHeader,
    TimelineItemLeading,
    TimelineItemLeadingRow,
    TimelineItemCaption,
    TimelineItemTitle,
    TimelineItemDescription,
    TimelineItemTrailing,
    TimelineItemBody,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'dynamic',
      },
    },
  },
} satisfies Meta<typeof TimelineItem>;

export default meta;
type Story = StoryObj<typeof TimelineItem>;

export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: (args) => (
    <Timeline lx={{ width: 's320' }}>
      <TimelineItem status={args.status}>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemCaption>12 Mar 2024</TimelineItemCaption>
            <TimelineItemLeadingRow>
              <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
              <Tag appearance='success' label='Confirmed' size='sm' />
            </TimelineItemLeadingRow>
            <TimelineItemDescription>
              Confirmed on device
            </TimelineItemDescription>
          </TimelineItemLeading>
          <TimelineItemTrailing>
            <Text typography='body2SemiBold'>0.42 ETH</Text>
          </TimelineItemTrailing>
        </TimelineItemHeader>
        <TimelineItemBody>
          <Text typography='body3' lx={{ color: 'muted' }}>
            Viewed in Ledger Live.
          </Text>
        </TimelineItemBody>
      </TimelineItem>
      <TimelineItem>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemTitle>Funds available</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
    </Timeline>
  ),
};

export const WithInformative: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <Timeline lx={{ width: 's320' }}>
      <TimelineItem>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemCaption>12 Mar 2024</TimelineItemCaption>
            <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
      <TimelineItem>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemCaption>13 Mar 2024</TimelineItemCaption>
            <TimelineItemTitle>Funds available</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
    </Timeline>
  ),
};

export const StatusShowcase: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <Timeline lx={{ width: 's320' }}>
      <TimelineItem status='success'>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
      <TimelineItem status='pending'>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemTitle>Broadcasting</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
        <TimelineItemBody>
          <Text typography='body3' lx={{ color: 'muted' }}>
            Waiting for the network.
          </Text>
        </TimelineItemBody>
      </TimelineItem>
      <TimelineItem status='error'>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemTitle>Rejected</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
      <TimelineItem status='loading'>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemTitle>Confirming</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
      <TimelineItem status='todo'>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemTitle>Settled</TimelineItemTitle>
          </TimelineItemLeading>
        </TimelineItemHeader>
      </TimelineItem>
    </Timeline>
  ),
};

export const WithCollapse: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: function WithCollapseStory() {
    const [open, setOpen] = useState(true);

    return (
      <Timeline lx={{ width: 's320' }}>
        <TimelineItem status='success'>
          <TimelineItemHeader>
            <TimelineItemLeading>
              <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
            </TimelineItemLeading>
            <TimelineItemTrailing>
              <IconButton
                accessibilityLabel={open ? 'Hide details' : 'Show details'}
                accessibilityState={{ expanded: open }}
                appearance='no-background'
                icon={open ? ChevronUp : ChevronDown}
                size='sm'
                onPress={() => {
                  setOpen((current) => !current);
                }}
              />
            </TimelineItemTrailing>
          </TimelineItemHeader>
          {open ? (
            <TimelineItemBody>
              <Text typography='body3' lx={{ color: 'muted' }}>
                Viewed in Ledger Live.
              </Text>
            </TimelineItemBody>
          ) : null}
        </TimelineItem>
        <TimelineItem status='pending'>
          <TimelineItemHeader>
            <TimelineItemLeading>
              <TimelineItemTitle>Broadcasting</TimelineItemTitle>
            </TimelineItemLeading>
          </TimelineItemHeader>
        </TimelineItem>
      </Timeline>
    );
  },
};
