import {
  Box,
  IconButton,
  Tag,
  Text,
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
} from '@ledgerhq/lumen-ui-rnative';
import { ChevronDown, ChevronUp } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

const SectionLabel = ({ children }: { children: string }) => (
  <Text
    typography='body3'
    lx={{ color: 'muted', marginTop: 's16', marginBottom: 's4' }}
  >
    {children}
  </Text>
);

const BaseExample = () => (
  <Timeline lx={{ width: 'sXs' }}>
    <TimelineItem status='idle'>
      <TimelineItemHeader>
        <TimelineItemLeading>
          <TimelineItemCaption>12 Mar 2024</TimelineItemCaption>
          <TimelineItemLeadingRow>
            <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
            <Tag appearance='success' size='sm' label='Confirmed' />
          </TimelineItemLeadingRow>
          <TimelineItemDescription>Confirmed on device</TimelineItemDescription>
        </TimelineItemLeading>
        <TimelineItemTrailing>
          <Text typography='body2SemiBold' lx={{ color: 'muted' }}>
            0.42 ETH
          </Text>
        </TimelineItemTrailing>
      </TimelineItemHeader>
      <TimelineItemBody>
        <Text typography='body3' lx={{ color: 'muted' }}>
          Viewed in Ledger Live.
        </Text>
      </TimelineItemBody>
    </TimelineItem>
    <TimelineItem status='idle'>
      <TimelineItemHeader>
        <TimelineItemLeading>
          <TimelineItemTitle>Funds available</TimelineItemTitle>
        </TimelineItemLeading>
      </TimelineItemHeader>
    </TimelineItem>
  </Timeline>
);

const StatusExample = () => (
  <Timeline lx={{ width: 'sXs' }}>
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
);

const CollapseExample = () => {
  const [open, setOpen] = useState(true);

  return (
    <Timeline lx={{ width: 'sXs' }}>
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
};

const TitleOnlyItem = ({
  status,
}: {
  status?: 'success' | 'loading' | 'idle';
}) => (
  <TimelineItem status={status}>
    <TimelineItemHeader>
      <TimelineItemLeading>
        <TimelineItemTitle>Payment confirmed</TimelineItemTitle>
      </TimelineItemLeading>
    </TimelineItemHeader>
  </TimelineItem>
);

const InfoExample = () => (
  <Timeline lx={{ width: 'sXs' }}>
    <TitleOnlyItem />
    <TitleOnlyItem />
    <TitleOnlyItem />
  </Timeline>
);

export default function Timelines() {
  return (
    <Box lx={{ width: 'full', gap: 's24' }}>
      <Box>
        <SectionLabel>Base</SectionLabel>
        <BaseExample />
      </Box>
      <Box>
        <SectionLabel>Status</SectionLabel>
        <StatusExample />
      </Box>
      <Box>
        <SectionLabel>Collapse</SectionLabel>
        <CollapseExample />
      </Box>
      <Box>
        <SectionLabel>Info</SectionLabel>
        <InfoExample />
      </Box>
    </Box>
  );
}
