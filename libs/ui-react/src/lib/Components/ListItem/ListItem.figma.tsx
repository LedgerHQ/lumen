import React from 'react';
import {
  ListItem,
  ListItemLeading,
  ListItemContent,
  ListItemTitle,
  ListItemDescription,
  ListItemTrailing,
  ListItemSpot,
  ListItemIcon,
} from './ListItem';
import { Tag } from '../Tag'
import { Switch } from '../Switch'
import { Checkbox } from '../Checkbox'
import { Settings } from '../../Symbols/Icons/Settings';

import figma from '@figma/code-connect';

figma.connect(
  ListItem,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=2255%3A4155',
  {
    imports: [
      "import { ListItem, ListItemLeading, ListItemContent, ListItemTitle, ListItemDescription, ListItemTrailing, ListItemSpot } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      leadingContent: figma.enum('leading-content', {
        none: undefined,
        'no-icon': undefined,
        coin: <ListItemSpot appearance='icon' icon={Settings} />,
        spot: <ListItemSpot appearance='icon' icon={Settings} />,
        'interface-icon': <ListItemIcon icon={Settings} />,
      }),
      descriptionTag: figma.boolean('show-description-tag', {
        true: figma.instance('description'),
        false: undefined,
      }),
      checkbox: figma.boolean('show-checkbox', {
        true: <Checkbox checked={false} />,
        false: undefined,
      }),
      trailingContent: figma.enum('trailing-content', {
        none: undefined,
        chevron: '{<ListItemIcon icon={ChevronRight} />}',
        value: figma.boolean('show-subvalue', {
          true: figma.enum('state', {
            disabled: (
              <ListItemContent >
                <ListItemTitle>42.00</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            ),
            default: (
              <ListItemContent >
                <ListItemTitle>42.00</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            ),
            hovered: (
              <ListItemContent >
                <ListItemTitle>42.00</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            ),
            pressed: (
              <ListItemContent >
                <ListItemTitle>42.00</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            ),
            focused: (
              <ListItemContent >
                <ListItemTitle>42.00</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            ),
            enabled: (
              <ListItemContent >
                <ListItemTitle>42.00</ListItemTitle>
                <ListItemDescription>USD</ListItemDescription>
              </ListItemContent>
            ),
          }),
          false: <ListItemTitle>42.00</ListItemTitle>,
        }),
        icon: figma.instance('trailing-icon'),
        tag: <Tag label="New" appearance="accent" />,
        toggle: <Switch selected={false} />,
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
            <ListItemTitle>{props.title}</ListItemTitle>
              <ListItemDescription>
                {props.description}
                {props.descriptionTag}
              </ListItemDescription>
          </ListItemContent>
        </ListItemLeading>
        <ListItemTrailing>{props.trailingContent}</ListItemTrailing>
      </ListItem>
    ),
  },
);
