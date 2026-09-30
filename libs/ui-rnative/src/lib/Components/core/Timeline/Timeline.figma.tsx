import figma from '@figma/code-connect';
import { Text } from '../../primitives';
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

figma.connect(
  Timeline,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=22075-10608',
  {
    imports: [
      "import { Timeline, TimelineItem, TimelineItemHeader, TimelineItemLeading, TimelineItemCaption, TimelineItemLeadingRow, TimelineItemTitle, TimelineItemDescription, TimelineItemTrailing, TimelineItemBody } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag, Text } from '@ledgerhq/lumen-ui-rnative'",
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
      </Timeline>
    ),
  },
);

figma.connect(
  Timeline,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=21769-4774',
  {
    imports: [
      "import { Text, Timeline, TimelineItem, TimelineItemHeader, TimelineItemLeading, TimelineItemTitle, TimelineItemBody } from '@ledgerhq/lumen-ui-rnative'",
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
          <TimelineItemBody>
            <Text typography='body3' lx={{ color: 'muted' }}>
              Waiting for the network.
            </Text>
          </TimelineItemBody>
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
