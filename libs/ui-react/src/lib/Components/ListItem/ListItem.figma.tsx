import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import React from 'react';
import { Placeholder } from '../../Symbols/Icons/Placeholder';
import { Settings } from '../../Symbols/Icons/Settings';
import { Checkbox } from '../Checkbox';
import { Switch } from '../Switch';
import { Tag } from '../Tag';
import {
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemContentRow,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
} from './ListItem';
import { Button } from '../Button';
import { ChevronRight } from '../../Symbols';
import { Spot } from '../Spot';

// —— trailing-content: none ——
figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'none' },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
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
      <ListItem disabled={props.disabled}>
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
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'value', 'show-subvalue': false },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      value: figma.string('value'),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled}>
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
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'value', 'show-subvalue': true },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      value: figma.string('value'),
      subvalue: figma.string('subvalue'),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled}>
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
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'icon' },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      trailingIcon: figma.instance('trailing-icon'),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled}>
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
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder, ChevronRight } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'tag' },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      chevron: figma.boolean('show-chevron', {
        true: <ChevronRight size={24} />,
        false: undefined,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled}>
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
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
      "import { Switch } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'toggle' },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Switch selected={false} onChange={() => {}} />
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
      "import { ListItem, ListItemLeading, ListItemContent, ListItemContentRow, ListItemTitle, ListItemDescription, ListItemTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot } from '@ledgerhq/lumen-ui-react'",
      "import { Settings, Placeholder } from '@ledgerhq/lumen-ui-react/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Checkbox } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'trailing-content': 'button' },
    props: {
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
        false: figma.boolean('show-description-network', {
          true: figma.boolean('show-description', {
            true: (
              <ListItemContentRow>
                <ListItemDescription>Description</ListItemDescription>
                <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />
              </ListItemContentRow>
            ),
            false: <CryptoIcon ledgerId='ethereum' ticker='ETH' size='20px' />,
          }),
          false: figma.boolean('show-description', {
            true: <ListItemDescription>Description</ListItemDescription>,
            false: undefined,
          }),
        }),
      }),
      leadingContent: figma.enum('leading-content', {
        'no-icon': undefined,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <Spot size={48} appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <ListItem disabled={props.disabled}>
        <ListItemLeading>
          {props.checkbox}
          {props.leadingContent}
          <ListItemContent>
            {props.titleArea}
            {props.descriptionArea}
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>
          <Button size='sm' appearance='gray' onClick={() => {}}>
            Label
          </Button>
        </ListItemTrailing>
      </ListItem>
    ),
  },
);
