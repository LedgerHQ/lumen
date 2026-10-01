import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from '../../symbols';
import { IconButton } from '../IconButton';
import { Tag } from '../Tag';
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

const meta = {
  component: TimelineItem,
  id: 'react-timeline',
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
  args: {
    status: 'idle',
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: (args) => (
    <Timeline className='w-320'>
      <TimelineItem status={args.status}>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemCaption>12 Mar 2024</TimelineItemCaption>
            <TimelineItemLeadingRow>
              <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
              <Tag appearance='success' size='sm' label='Confirmed' />
            </TimelineItemLeadingRow>
            <TimelineItemDescription>
              Confirmed on device
            </TimelineItemDescription>
          </TimelineItemLeading>
          <TimelineItemTrailing className='body-2-semi-bold text-muted'>
            0.42 ETH
          </TimelineItemTrailing>
        </TimelineItemHeader>
        <TimelineItemBody>Viewed in Ledger Live.</TimelineItemBody>
      </TimelineItem>
      <TimelineItem status='idle'>
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
    <Timeline className='w-320'>
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
    <Timeline className='w-320'>
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
            <TimelineItemDescription>
              Waiting for the network.
            </TimelineItemDescription>
          </TimelineItemLeading>
        </TimelineItemHeader>
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
      <TimelineItem status='idle'>
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
      <Timeline className='w-320'>
        <TimelineItem status='success'>
          <TimelineItemHeader>
            <TimelineItemLeading>
              <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
            </TimelineItemLeading>
            <TimelineItemTrailing>
              <IconButton
                aria-expanded={open}
                aria-label={open ? 'Hide details' : 'Show details'}
                appearance='no-background'
                icon={open ? ChevronUp : ChevronDown}
                size='sm'
                onClick={() => {
                  setOpen((current) => !current);
                }}
              />
            </TimelineItemTrailing>
          </TimelineItemHeader>
          {open ? (
            <TimelineItemBody>Viewed in Ledger Live.</TimelineItemBody>
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

export const ResponsivenessShowcase: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <Timeline className='w-208'>
      <TimelineItem status='success'>
        <TimelineItemHeader>
          <TimelineItemLeading>
            <TimelineItemCaption>
              12 Mar 2024 · Confirmed on device
            </TimelineItemCaption>
            <TimelineItemLeadingRow>
              <TimelineItemTitle>
                Payment confirmed on the hardware wallet
              </TimelineItemTitle>
              <Tag appearance='success' size='sm' label='Confirmed' />
            </TimelineItemLeadingRow>
            <TimelineItemDescription>
              Confirmed on device after review
            </TimelineItemDescription>
          </TimelineItemLeading>
          <TimelineItemTrailing>0.42 ETH</TimelineItemTrailing>
        </TimelineItemHeader>
      </TimelineItem>
    </Timeline>
  ),
};
