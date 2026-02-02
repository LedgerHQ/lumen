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

import figma from '@figma/code-connect';

figma.connect(
  Tile,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=5783-1328',
  {
    imports: [
      "import { Tile, TileSpot, TileContent, TileTitle, TileDescription, TileSecondaryAction } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'show-additionnal-content': false },
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      appearance: figma.enum('appearance', {
        'no-background': 'no-background',
        card: 'card',
      }),
      disabled: figma.enum('state', {
        disabled: true,
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
        <TileSpot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>{props.title}</TileTitle>
          <TileDescription>{props.description}</TileDescription>
        </TileContent>
      </Tile>
    ),
  },
);

figma.connect(
  Tile,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=5783-1328',
  {
    imports: [
      "import { Tile, TileSpot, TileContent, TileTitle, TileDescription, TileSecondaryAction } from '@ledgerhq/lumen-ui-react'",
    ],
    variant: { 'show-additionnal-content': true },
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      showTag: figma.boolean('show-tag'),
      showSecondaryAction: figma.enum('state', {
        hovered: figma.boolean('show-secondary-action'),
      }),
      appearance: figma.enum('appearance', {
        'no-background': 'no-background',
        card: 'card',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      tag: figma.boolean('show-tag', {
        true: <Tag label='Label' appearance='base' />,
        false: undefined
      }),
      subInfo: figma.boolean('show-sub-info', {
        true: <Tag icon={Settings} label='Label' appearance='base' />,
        false: undefined,
      }),
      trend: figma.boolean('show-trend', {
        true: <div className='body-2-semi-bold text-success'>+7.87%</div>,
        false: undefined,
      })
    },
    example: (props) => (
      <Tile
        appearance={props.appearance}
        disabled={props.disabled}
        onClick={() => {}}
        centered={true}
        aria-label='Tile aria'
      >
        <TileSpot appearance='icon' icon={Settings} />
        <TileContent>
          <TileTitle>{props.title}</TileTitle>
          <TileDescription>{props.description}</TileDescription>
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