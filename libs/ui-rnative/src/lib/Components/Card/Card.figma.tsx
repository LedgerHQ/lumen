import figma from '@figma/code-connect';
import { CryptoIcon } from '@ledgerhq/crypto-icons';
import { Wallet } from '../../Symbols';
import { Button } from '../Button';
import { Spot } from '../Spot';
import { Tag } from '../Tag';
import {
  Card,
  CardContent,
  CardContentDescription,
  CardContentTitle,
  CardFooter,
  CardFooterActions,
  CardHeader,
  CardLeading,
  CardTrailing,
} from './Card';

// —— Card root ——
figma.connect(
  Card,
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=11025-33000',
  {
    imports: [
      "import { Card, CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing, CardFooter, CardFooterActions } from '@ledgerhq/lumen-ui-rnative'",
      "import { Button } from '@ledgerhq/lumen-ui-rnative'",
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
            <CardFooterActions>
              <Button size='sm' appearance='gray' onPress={() => {}}>
                Cancel
              </Button>
              <Button size='sm' appearance='base' onPress={() => {}}>
                Confirm
              </Button>
            </CardFooterActions>
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
              <CardContentTitle>$43,210.00</CardContentTitle>
            </CardContent>
          </CardTrailing>
        </CardHeader>
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
      "import { CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing, Spot, Button, Tag } from '@ledgerhq/lumen-ui-rnative'",
      "import { Wallet } from '@ledgerhq/lumen-ui-rnative/symbols'",
      "import { CryptoIcon } from '@ledgerhq/crypto-icons'",
    ],
    props: {
      title: figma.string('title'),
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
      disabled: figma.enum('state', {
        disabled: true,
      }),
    },
    example: (props) => (
      <CardHeader>
        <CardLeading>
          {props.leading}
          <CardContent>
            <CardContentTitle>{props.title}</CardContentTitle>
            <CardContentDescription>Description</CardContentDescription>
          </CardContent>
        </CardLeading>
        <CardTrailing>{props.trailing}</CardTrailing>
      </CardHeader>
    ),
  },
);

// —— Card (expandable/info variant with footer) ——
figma.connect(
  'https://www.figma.com/design/JxaLVMTWirCpU0rsbZ30k7?node-id=14481-33979',
  {
    imports: [
      "import { Card, CardHeader, CardLeading, CardContent, CardContentTitle, CardContentDescription, CardTrailing } from '@ledgerhq/lumen-ui-rnative'",
      "import { Wallet } from '@ledgerhq/lumen-ui-rnative/symbols'",
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
            <Wallet size={20} />
          </CardTrailing>
        </CardHeader>
      </Card>
    ),
  },
);
