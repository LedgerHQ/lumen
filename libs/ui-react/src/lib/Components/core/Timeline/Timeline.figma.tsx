import figma from '@figma/code-connect';
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

figma.connect(
  Timeline,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=22075-10608',
  {
    imports: [
      "import { Timeline, TimelineItem, TimelineItemHeader, TimelineItemLeading, TimelineItemCaption, TimelineItemLeadingRow, TimelineItemTitle, TimelineItemDescription, TimelineItemTrailing, TimelineItemBody } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {},
    example: () => (
      <Timeline>
        <TimelineItem>
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
            <TimelineItemTrailing>0.42 ETH</TimelineItemTrailing>
          </TimelineItemHeader>
          <TimelineItemBody>Viewed in Ledger Live.</TimelineItemBody>
        </TimelineItem>
      </Timeline>
    ),
  },
);

figma.connect(
  Timeline,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=21769-4774',
  {
    imports: [
      "import { Timeline, TimelineItem, TimelineItemHeader, TimelineItemLeading, TimelineItemTitle, TimelineItemBody } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {},
    example: () => (
      <Timeline>
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
          <TimelineItemBody>Waiting for the network.</TimelineItemBody>
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
  },
);
