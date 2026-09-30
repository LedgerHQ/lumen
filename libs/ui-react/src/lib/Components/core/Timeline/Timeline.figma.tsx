import figma from '@figma/code-connect';
import { ChevronDown } from '../../symbols';
import { IconButton } from '../IconButton';
import { Tag } from '../Tag';
import {
  Timeline,
  TimelineItem,
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
    imports: ["import { Timeline } from '@ledgerhq/lumen-ui-react'"],
    props: {
      items: figma.enum('type', {
        display: figma.children('.timeline-item-display'),
        progress: figma.children('.timeline-item-progress'),
      }),
    },
    example: (props) => <Timeline>{props.items}</Timeline>,
  },
);

figma.connect(
  TimelineItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=21673-43242',
  {
    imports: ["import { TimelineItem } from '@ledgerhq/lumen-ui-react'"],
    props: {
      status: figma.enum('state', {
        success: 'success',
        error: 'error',
        pending: 'pending',
        loading: 'loading',
        todo: 'todo',
      }),
      header: figma.children('.timeline-item-header'),
      body: figma.boolean('show-additionnal-content', {
        true: figma.children('additionnal-content'),
        false: undefined,
      }),
    },
    example: (props) => (
      <TimelineItem status={props.status}>
        {props.header}
        {props.body}
      </TimelineItem>
    ),
  },
);

figma.connect(
  TimelineItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=22075-9636',
  {
    imports: ["import { TimelineItem } from '@ledgerhq/lumen-ui-react'"],
    props: {
      header: figma.children('.timeline-item-header'),
      body: figma.boolean('show-additionnal-content', {
        true: figma.children('additionnal-content'),
        false: undefined,
      }),
    },
    example: (props) => (
      <TimelineItem>
        {props.header}
        {props.body}
      </TimelineItem>
    ),
  },
);

figma.connect(
  TimelineItemHeader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=21937-35804',
  {
    imports: [
      "import { TimelineItemHeader, TimelineItemLeading, TimelineItemCaption, TimelineItemLeadingRow, TimelineItemTitle, TimelineItemDescription, TimelineItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { IconButton, Tag } from '@ledgerhq/lumen-ui-react'",
      "import { ChevronDown } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    props: {
      date: figma.boolean('show-date', {
        true: figma.string('date'),
        false: undefined,
      }),
      title: figma.string('title'),
      titleTag: figma.boolean('show-title-tag', {
        true: <Tag label='Label' appearance='gray' size='sm' />,
        false: undefined,
      }),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      descriptionTag: figma.boolean('show-description-tag', {
        true: <Tag label='Label' appearance='gray' size='sm' />,
        false: undefined,
      }),
      trailing: figma.boolean('show-trailing-content', {
        true: figma.children('trailing-content'),
        false: undefined,
      }),
      expand: figma.enum('type', {
        display: undefined,
        expandable: (
          <IconButton
            aria-label='Show details'
            appearance='no-background'
            icon={ChevronDown}
            size='sm'
          />
        ),
      }),
    },
    example: (props) => (
      <TimelineItemHeader>
        <TimelineItemLeading>
          <TimelineItemCaption>{props.date}</TimelineItemCaption>
          <TimelineItemLeadingRow>
            <TimelineItemTitle>{props.title}</TimelineItemTitle>
            {props.titleTag}
          </TimelineItemLeadingRow>
          <TimelineItemLeadingRow>
            <TimelineItemDescription>
              {props.description}
            </TimelineItemDescription>
            {props.descriptionTag}
          </TimelineItemLeadingRow>
        </TimelineItemLeading>
        <TimelineItemTrailing>
          {props.trailing}
          {props.expand}
        </TimelineItemTrailing>
      </TimelineItemHeader>
    ),
  },
);
