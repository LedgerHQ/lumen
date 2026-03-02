import React from 'react';
import {
  Card,
  CardHeader,
  CardLeading,
  CardContent,
  CardContentTitle,
  CardContentDescription,
  CardTrailing,
  CardFooter,
  CardFooterActions,
} from './Card';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import { Spot } from '../Spot/Spot';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { Wallet } from '../../Symbols';

import figma from '@figma/code-connect';

figma.connect(
  Card,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10541-743',
  {
    imports: [
      "import { Card, CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing } from '@ledgerhq/lumen-ui-react'",
      "import { Spot, Button, Tag } from '@ledgerhq/lumen-ui-react'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
      "// import { YourIconName } from '@ledgerhq/lumen-ui-react/Symbols'",
    ],
    props: {
      title: figma.string('title'),
      description: figma.boolean('show-description', {
        true: figma.string('description'),
        false: undefined,
      }),
      leading: figma.enum('leading', {
        spot: <Spot appearance='icon' icon={Wallet} />,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />,
        provider: <Spot appearance='icon' icon={Wallet} />,
        'interface-icon': <Wallet size={20} />,
        none: undefined,
      }),
      trailing: figma.enum('trailing', {
        value: figma.boolean('show-subvalue', {
          true: (
            <CardContent>
              <CardContentTitle>$43,210.00</CardContentTitle>
              <CardContentDescription>0.5 BTC</CardContentDescription>
            </CardContent>
          ),
          false: (
            <CardContent>
              <CardContentTitle>$43,210.00</CardContentTitle>
            </CardContent>
          ),
        }),
        button: (
          <Button appearance='base' size='sm'>
            Action
          </Button>
        ),
        tag: <Tag label='Label' appearance='accent' />,
        none: undefined,
      }),
      type: figma.enum('type', {
        interactive: 'interactive',
        expandable: 'expandable',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <Card type={props.type} disabled={props.disabled}>
        <CardHeader>
          <CardLeading>
            {props.leading}
            <CardContent>
              <CardContentTitle>{props.title}</CardContentTitle>
              <CardContentDescription>
                {props.description}
              </CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>{props.trailing}</CardTrailing>
        </CardHeader>
      </Card>
    ),
  },
);

figma.connect(
  CardFooter,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=14067-7402',
  {
    imports: [
      "import { CardFooter, CardFooterActions, CardContentDescription } from '@ledgerhq/lumen-ui-react'",
      "import { Button } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      actions: figma.enum('actions', {
        primary: (
          <CardFooterActions>
            <Button isFull appearance='base' size='sm'>
              Primary
            </Button>
          </CardFooterActions>
        ),
        'primary+secondary': (
          <CardFooterActions>
            <Button isFull appearance='transparent' size='sm'>
              Secondary
            </Button>
            <Button isFull appearance='base' size='sm'>
              Primary
            </Button>
          </CardFooterActions>
        ),
        none: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <CardFooter>
        <CardContentDescription>Footer content</CardContentDescription>
        {props.actions}
      </CardFooter>
    ),
  },
);

figma.connect(
  Card,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11025-33000',
  {
    imports: [
      "import { Card, CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing, CardFooter } from '@ledgerhq/lumen-ui-react'",
    ],
    props: {
      outlined: figma.boolean('is-selected', {
        true: true,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      footer: figma.boolean('show-footer', {
        true: (
          <CardFooter>
            <CardContentDescription>Footer content</CardContentDescription>
          </CardFooter>
        ),
        false: undefined,
      }),
    },
    example: (props) => (
      <Card outlined={props.outlined} disabled={props.disabled}>
        <CardHeader>
          <CardLeading>
            <CardContent>
              <CardContentTitle>Title</CardContentTitle>
              <CardContentDescription>Description</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>Value</CardContentTitle>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        {props.footer}
      </Card>
    ),
  },
);
