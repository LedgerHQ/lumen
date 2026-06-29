import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { ChevronRight, Wallet } from '../../Symbols';
import { Button } from '../Button';
import { Spot } from '../Spot';
import { Tag } from '../Tag';
import {
  Card,
  CardContent,
  CardContentDescription,
  CardContentTitle,
  CardHeader,
  CardLeading,
  CardTrailing,
} from './Card';

// —— Card root ——
figma.connect(
  Card,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11025-33000',
  {
    imports: ["import { Card, CardFooter } from '@ledgerhq/lumen-ui-rnative'"],
    props: {
      outlined: figma.boolean('is-selected', {
        true: true,
        false: undefined,
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
      header: figma.children('.card-header'),
      footer: figma.boolean('show-footer', {
        true: figma.children('.card-footer'),
        false: undefined,
      }),
    },
    example: (props) => (
      <Card outlined={props.outlined} disabled={props.disabled}>
        {props.header}
        {props.footer}
      </Card>
    ),
  },
);

// —— CardHeader ——
figma.connect(
  CardHeader,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=10541-743',
  {
    imports: [
      "import { CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Spot, Button, Tag } from '@ledgerhq/lumen-ui-rnative'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
    ],
    props: {
      title: figma.string('title'),
      description: figma.string('description'),
      leading: figma.enum('leading', {
        spot: <Spot appearance='icon' icon={Wallet} />,
        coin: <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={48} />,
        provider: (
          <CryptoIcon
            ledgerId='ethereum'
            ticker='ETH'
            size={48}
            shape='square'
          />
        ),
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
          <Button appearance='base' size='sm' onPress={() => {}}>
            Action
          </Button>
        ),
        tag: <Tag label='Label' appearance='gray' />,
        'interface-icon': <Wallet size={20} />,
        none: undefined,
      }),
    },
    example: (props) => (
      <CardHeader>
        <CardLeading>
          {props.leading}
          <CardContent>
            <CardContentTitle>{props.title}</CardContentTitle>
            <CardContentDescription>{props.description}</CardContentDescription>
          </CardContent>
        </CardLeading>
        <CardTrailing>{props.trailing}</CardTrailing>
      </CardHeader>
    ),
  },
);

// —— Card (expandable/info variant) ——
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=14481-33979',
  {
    imports: [
      "import { Card, CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { ChevronRight } from '@ledgerhq/lumen-ui-rnative/symbols'",
    ],
    props: {
      title: figma.string('title'),
      description: figma.string('value'),
      type: figma.enum('type', {
        display: 'info',
        interactive: 'interactive',
      }),
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <Card type={props.type} disabled={props.disabled}>
        <CardHeader>
          <CardLeading>
            <CardContent>
              <CardContentDescription>
                {props.description}
              </CardContentDescription>
              <CardContentTitle>{props.title}</CardContentTitle>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <ChevronRight size={20} />
          </CardTrailing>
        </CardHeader>
      </Card>
    ),
  },
);
