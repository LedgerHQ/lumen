import React from 'react';
import {
  Tile,
  TileSpot,
  TileContent,
  TileTitle,
  TileDescription,
  TileSecondaryAction,
  TileTrailingContent,
} from './Tile';
import { Tag } from '../Tag';
import { Settings } from '../../Symbols';
import { CryptoIcon } from '@ledgerhq/crypto-icons';

import figma from '@figma/code-connect';
import { Placeholder } from '../../Symbols/Icons/Placeholder';

// —— no additional content ——
figma.connect(
  Tile,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=5783-1328',
  {
    imports: [
      "import { Tile, TileSpot, TileContent, TileTitle, TileDescription, TileSecondaryAction, TileTrailingContent } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    variant: { 'show-additionnal-content': false },
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: <TileDescription>Description</TileDescription>,
        false: undefined,
      }),
      appearance: figma.enum('appearance', {
        'no-background': 'no-background',
        card: 'card',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      leadingContent: figma.enum('leading-icon', {
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <TileSpot appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
    },
    example: (props) => (
      <Tile
        appearance={props.appearance}
        disabled={props.disabled}
        onClick={() => {}}
      >
        <TileSecondaryAction
          icon={Settings}
          onClick={() => {}}
        />
        {props.leadingContent}
        <TileContent>
          <TileTitle>{props.title}</TileTitle>
          {props.description}
        </TileContent>
      </Tile>
    ),
  },
);

// —— with additional content ——
figma.connect(
  Tile,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=5783-1328',
  {
    imports: [
      "import { Tile, TileSpot, TileContent, TileTitle, TileDescription, TileSecondaryAction, TileTrailingContent } from '@ledgerhq/lumen-ui-react'",
      "import { Tag } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "import { Placeholder } from '@ledgerhq/lumen-ui-react/symbols'",
    ],
    variant: { 'show-additionnal-content': true },
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: <TileDescription>Description</TileDescription>,
        false: undefined,
      }),
      appearance: figma.enum('appearance', {
        'no-background': 'no-background',
        card: 'card',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      leadingContent: figma.enum('leading-icon', {
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        spot: <TileSpot appearance='icon' icon={Settings} />,
        'interface-icon': <Placeholder size={24} />,
      }),
      tag: figma.boolean('show-tag', {
        true: <Tag label='Label' appearance='base' />,
        false: undefined,
      }),
      subInfo: figma.boolean('show-sub-info', {
        true: <Tag icon={Settings} label='Label' appearance='base' />,
        false: undefined,
      }),
      trend: figma.boolean('show-trend', {
        true: <div className='body-2-semi-bold text-success'>+7.87%</div>,
        false: undefined,
      }),
    },
    example: (props) => (
      <Tile
        appearance={props.appearance}
        disabled={props.disabled}
        onClick={() => {}}
      >
        <TileSecondaryAction
          icon={Settings}
          onClick={() => {}}
        />
        {props.leadingContent}
        <TileContent>
          <TileTitle>{props.title}</TileTitle>
          {props.description}
          <TileTrailingContent>
            {props.tag}
            {props.subInfo}
            {props.trend}
          </TileTrailingContent>
        </TileContent>
      </Tile>
    ),
  },
);
