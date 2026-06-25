import figma from '@figma/code-connect';
import { ChevronRight, Placeholder, Settings } from '../../Symbols';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Spot } from '../Spot';
import { Switch } from '../Switch';
import { Tag } from '../Tag';
import {
  ListItem,
  ListItemContent,
  ListItemContentRow,
  ListItemDescription,
  ListItemLeading,
  ListItemTitle,
  ListItemTrailing,
} from './ListItem';

const commonProps = {
  titleArea: figma.boolean('show-title-tag', {
    true: (
      <ListItemContentRow>
        <ListItemTitle>Title</ListItemTitle>
        <Tag label='Label' size='sm' appearance='base' />
      </ListItemContentRow>
    ),
    false: <ListItemTitle>Title</ListItemTitle>,
  }),
  descriptionArea: figma.boolean('show-description-tag', {
    true: figma.boolean('show-description', {
      true: (
        <ListItemContentRow>
          <ListItemDescription>Description</ListItemDescription>
          <Tag label='Label' size='sm' appearance='gray' />
        </ListItemContentRow>
      ),
      false: <Tag label='Label' size='sm' appearance='gray' />,
    }),
    false: figma.boolean('show-description', {
      true: <ListItemDescription>Description</ListItemDescription>,
      false: undefined,
    }),
  }),
  leadingContent: figma.enum('leading-content', {
    'no-icon': undefined,
    spot: <Spot size={48} appearance='icon' icon={Settings} />,
    'interface-icon': <Placeholder size={24} />,
  }),
  checkbox: figma.boolean('show-checkbox', {
    true: <Checkbox checked={false} onCheckedChange={() => {}} />,
    false: undefined,
  }),
  disabled: figma.enum('state', {
    disabled: true,
  }),
  density: figma.enum('density', {
    compact: 'compact',
    expanded: 'expanded',
  }),
};

// —— trailing-content: none ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'none' },
    props: {
      ...commonProps,
      chevron: figma.boolean('show-chevron', {
        true: (
          <ListItemTrailing>
            <ChevronRight size={24} />
          </ListItemTrailing>
        ),
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        {props.chevron}
      </ListItem>
    ),
  },
);

// —— trailing-content: value (without subvalue) ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'value', 'show-subvalue': false },
    props: {
      ...commonProps,
      value: figma.string('value'),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemTitle>{props.value}</ListItemTitle>
          {props.chevron}
        </ListItemTrailing>
      </ListItem>
    ),
  },
);

// —— trailing-content: value (with subvalue) ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'value', 'show-subvalue': true },
    props: {
      ...commonProps,
      value: figma.string('value'),
      subvalue: figma.string('subvalue'),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <ListItemContent>
            <ListItemTitle>{props.value}</ListItemTitle>
            <ListItemDescription>{props.subvalue}</ListItemDescription>
          </ListItemContent>
          {props.chevron}
        </ListItemTrailing>
      </ListItem>
    ),
  },
);

// —— trailing-content: icon ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'icon' },
    props: {
      ...commonProps,
      trailingIcon: figma.instance('trailing-icon'),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          {props.trailingIcon}
          {props.chevron}
        </ListItemTrailing>
      </ListItem>
    ),
  },
);

// —— trailing-content: tag ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'tag' },
    props: {
      ...commonProps,
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Tag label='Label' appearance='accent' />
          {props.chevron}
        </ListItemTrailing>
      </ListItem>
    ),
  },
);

// —— trailing-content: toggle ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
      "import { Switch } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'toggle' },
    props: commonProps,
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch checked={false} onCheckedChange={() => {}} />
        </ListItemTrailing>
      </ListItem>
    ),
  },
);

// —— trailing-content: button ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot } from '@ledgerhq/lumen-ui-rnative'",
      "import { Settings, Placeholder } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-rnative'",
      "import { Tag } from '@ledgerhq/lumen-ui-rnative'",
      "import { Button } from '@ledgerhq/lumen-ui-rnative'",
    ],
    variant: { 'trailing-content': 'button' },
    props: commonProps,
    example: (props) => (
      <ListItem disabled={props.disabled} density={props.density}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Button size='sm' appearance='gray' onPress={() => {}}>
            Label
          </Button>
        </ListItemTrailing>
      </ListItem>
    ),
  },
);
