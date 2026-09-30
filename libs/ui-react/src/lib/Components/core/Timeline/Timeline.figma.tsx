import figma from '@figma/code-connect';
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
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=21769-4775',
  {
    imports: [
      "import { Timeline, TimelineItem, TimelineItemHeader, TimelineItemLeading, TimelineItemCaption, TimelineItemLeadingRow, TimelineItemTitle, TimelineItemDescription, TimelineItemTrailing, TimelineItemBody } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      item: figma.enum('type', {
        display: (
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
        ),
        progress: (
          <TimelineItem status='todo'>
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
        ),
      }),
    },
    example: (props) => <Timeline>{props.item}</Timeline>,
  },
);
