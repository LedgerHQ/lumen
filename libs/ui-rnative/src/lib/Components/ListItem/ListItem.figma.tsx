import figma from '@figma/code-connect';
import CryptoIcon from '@ledgerhq/crypto-icons/native';
import { ChevronRight, Placeholder, Settings } from '../../Symbols';
import { Button } from '../Button';
import { Checkbox } from '../Checkbox';
import { Spot } from '../Spot';
import { Switch } from '../Switch/Switch';
import { Tag } from '../Tag';
import { Trend } from '../Trend';
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
  descriptionArea: figma.boolean('show-description', {
    true: figma.boolean('show-description-tag', {
      true: figma.boolean('show-description-network', {
        true: (
          <ListItemContentRow>
            <ListItemDescription>Description</ListItemDescription>
            <Tag label='Label' size='sm' appearance='gray' />
            <CryptoIcon ledgerId='ethereum' ticker='ETH' size={20} />
          </ListItemContentRow>
        ),
        false: (
          <ListItemContentRow>
            <ListItemDescription>Description</ListItemDescription>
            <Tag label='Label' size='sm' appearance='gray' />
          </ListItemContentRow>
        ),
      }),
      false: figma.boolean('show-description-network', {
        true: (
          <ListItemContentRow>
            <ListItemDescription>Description</ListItemDescription>
            <CryptoIcon ledgerId='ethereum' ticker='ETH' size={20} />
          </ListItemContentRow>
        ),
        false: <ListItemDescription>Description</ListItemDescription>,
      }),
    }),
    false: figma.boolean('show-description-tag', {
      true: figma.boolean('show-description-network', {
        true: (
          <ListItemContentRow>
            <Tag label='Label' size='sm' appearance='gray' />
            <CryptoIcon ledgerId='ethereum' ticker='ETH' size={20} />
          </ListItemContentRow>
        ),
        false: <Tag label='Label' size='sm' appearance='gray' />,
      }),
      false: figma.boolean('show-description-network', {
        true: <CryptoIcon ledgerId='ethereum' ticker='ETH' size={20} />,
        false: undefined,
      }),
    }),
  }),
  leadingContent: figma.enum('leading-content', {
    'no-icon': undefined,
    coin: figma.enum('density', {
      compact: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />,
      expanded: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={48} />,
    }),
    network: figma.enum('density', {
      compact: <CryptoIcon ledgerId='ethereum' ticker='ETH' size={24} />,
      expanded: <CryptoIcon ledgerId='ethereum' ticker='ETH' size={48} />,
    }),
    flag: figma.enum('density', {
      compact: <CryptoIcon ledgerId='united-states' ticker='USD' size={24} />,
      expanded: <CryptoIcon ledgerId='united-states' ticker='USD' size={48} />,
    }),
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
    ],
    variant: { 'trailing-content': 'icon' },
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
          <Placeholder size={24} />
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
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
          <Tag label='Label' appearance='base' size='sm' />
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
    ],
    variant: { 'trailing-content': 'toggle' },
    props: {
      ...commonProps,
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
          <Switch checked={false} onCheckedChange={() => {}} />
        </ListItemTrailing>
      </ListItem>
    ),
  },
);

// —— trailing-content: value+trend ——
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
    ],
    variant: { 'trailing-content': 'value+trend' },
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
          <ListItemContent
            style={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}
          >
            <ListItemTitle>{props.value}</ListItemTitle>
            <Trend value={5.25} size='sm' />
          </ListItemContent>
          {props.chevron}
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
      "import CryptoIcon from '@ledgerhq/crypto-icons/native'",
    ],
    variant: { 'trailing-content': 'button' },
    props: {
      ...commonProps,
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
          <Button appearance='transparent' size='sm' onPress={() => {}}>
            Label
          </Button>
        </ListItemTrailing>
      </ListItem>
    ),
  },
);
