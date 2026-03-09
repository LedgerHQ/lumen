import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React, { useState } from 'react';
import { Wallet } from '../../Symbols';
import { Button } from '../Button';
import { Spot } from '../Spot';
import { Tag } from '../Tag/Tag';
import { Box } from '../Utility';
import {
  Card,
  CardHeader,
  CardLeading,
  CardContent,
  CardContentRow,
  CardContentTitle,
  CardContentDescription,
  CardTrailing,
  CardFooter,
  CardFooterActions,
} from './Card';

const meta: Meta<typeof Card> = {
  component: Card,
  title: 'Containment/Card',
  subcomponents: {
    CardHeader,
    CardLeading,
    CardTrailing,
    CardContent,
    CardContentRow,
    CardContentTitle,
    CardContentDescription,
    CardFooter,
    CardFooterActions,
  },
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Whether the card is disabled',
    },
    outlined: {
      control: 'boolean',
      description: 'Whether the card shows a selection outline',
    },
    onPress: {
      action: 'pressed',
      description: 'The function to be called when the card is pressed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Base: Story = {
  args: {
    lx: { width: 's320' },
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardLeading>
          <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
          <CardContent>
            <CardContentTitle>Bitcoin</CardContentTitle>
            <CardContentDescription>BTC</CardContentDescription>
          </CardContent>
        </CardLeading>
        <CardTrailing>
          <CardContent>
            <CardContentTitle>$43,210.00</CardContentTitle>
            <CardContentDescription>0.5 BTC</CardContentDescription>
          </CardContent>
        </CardTrailing>
      </CardHeader>
      <CardFooter>
        <CardContentDescription>Balance desc</CardContentDescription>
      </CardFooter>
    </Card>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<Card onPress={handlePress}>
  <CardHeader>
    <CardLeading>
      <CryptoIcon ledgerId="bitcoin" ticker="BTC" size="48px" />
      <CardContent>
        <CardContentTitle>Bitcoin</CardContentTitle>
        <CardContentDescription>BTC</CardContentDescription>
      </CardContent>
    </CardLeading>
    <CardTrailing>
      <CardContent>
        <CardContentTitle>$43,210.00</CardContentTitle>
        <CardContentDescription>0.5 BTC</CardContentDescription>
      </CardContent>
    </CardTrailing>
  </CardHeader>
  <CardFooter>
    <CardContentDescription>Balance desc</CardContentDescription>
  </CardFooter>
</Card>
`,
      },
    },
  },
};

export const StatesShowcase: Story = {
  render: (args) => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Card {...args} lx={{ width: 's320' }}>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Interactive (default)</CardContentTitle>
              <CardContentDescription>
                Whole card is pressable
              </CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>BTC</CardContentTitle>
              <CardContentDescription>123.2 BTC</CardContentDescription>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>
            3 assets on 2 networks
          </CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 's320' }} outlined>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Outlined</CardContentTitle>
              <CardContentDescription>Selected state</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>BTC</CardContentTitle>
              <CardContentDescription>123.2 BTC</CardContentDescription>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>
            3 assets on 2 networks
          </CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 's320' }} type='info'>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Info</CardContentTitle>
              <CardContentDescription>Data display only</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>BTC</CardContentTitle>
              <CardContentDescription>123.2 BTC</CardContentDescription>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>
            3 assets on 2 networks
          </CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 's320' }} disabled>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Disabled</CardContentTitle>
              <CardContentDescription>Non-interactive</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>BTC</CardContentTitle>
              <CardContentDescription>123.2 BTC</CardContentDescription>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>
            3 assets on 2 networks
          </CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 's320' }} disabled>
        <CardHeader>
          <CardLeading>
            <Wallet size={20} />
            <CardContent>
              <CardContentTitle>Disabled</CardContentTitle>
              <CardContentDescription>Non-interactive</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>BTC</CardContentTitle>
              <CardContentDescription>123.2 BTC</CardContentDescription>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>
            3 assets on 2 networks
          </CardContentDescription>
        </CardFooter>
      </Card>
    </Box>
  ),
};

export const DisabledWithSpot: Story = {
  args: {
    lx: { width: 's320' },
    disabled: true,
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardLeading>
          <Spot appearance='icon' icon={Wallet} disabled />
          <CardContent>
            <CardContentTitle>My Wallet</CardContentTitle>
            <CardContentDescription>Ethereum</CardContentDescription>
          </CardContent>
        </CardLeading>
        <CardTrailing>
          <CardContent>
            <CardContentTitle>$43,210.00</CardContentTitle>
            <CardContentDescription>0.5 BTC</CardContentDescription>
          </CardContent>
        </CardTrailing>
      </CardHeader>
      <CardFooter>
        <CardContentDescription>2 assets on 1 network</CardContentDescription>
      </CardFooter>
    </Card>
  ),
};

export const ExpandableShowcase: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <Box lx={{ flexDirection: 'column', gap: 's16', width: 's320' }}>
        <Card
          type='expandable'
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>Expandable Card</CardContentTitle>
                <CardContentDescription>
                  Press header to toggle
                </CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentTitle>BTC</CardContentTitle>
                <CardContentDescription>+12.34%</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>Network: Ethereum</CardContentDescription>
            <CardContentDescription>Fee: 0.001 ETH</CardContentDescription>
            <CardFooterActions>
              <Button isFull appearance='red' size='sm'>
                Delete
              </Button>
              <Button isFull appearance='base' size='sm'>
                Stake
              </Button>
            </CardFooterActions>
          </CardFooter>
        </Card>
      </Box>
    );
  },
};

export const LayoutShowcase: Story = {
  render: (args) => (
    <Box
      lx={{
        flexDirection: 'column',
        gap: 's32',
        alignItems: 'flex-start',
        width: 'full',
      }}
    >
      <Card {...args}>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Defined width (320px)</CardContentTitle>
              <CardContentDescription>BTC</CardContentDescription>
            </CardContent>
          </CardLeading>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>Balance: 0.5 BTC</CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 's320' }}>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentRow>
                <CardContentTitle>With Tags</CardContentTitle>
                <Tag size='sm' label='NEW' />
              </CardContentRow>
              <CardContentRow>
                <CardContentDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </CardContentDescription>
                <Tag size='sm' label='BTC' appearance='base' />
              </CardContentRow>
            </CardContent>
          </CardLeading>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>Balance: 0.5 BTC</CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 's320' }}>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentRow>
                <CardContentTitle>Trailing values</CardContentTitle>
              </CardContentRow>
              <CardContentRow>
                <CardContentDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </CardContentDescription>
              </CardContentRow>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentRow>
                <CardContentTitle>$43,210</CardContentTitle>
                <Tag size='sm' label='NEW' />
              </CardContentRow>
              <CardContentRow>
                <CardContentDescription>Lorem ipsum</CardContentDescription>
                <Tag size='sm' label='BTC' appearance='base' />
              </CardContentRow>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>Balance: 0.5 BTC</CardContentDescription>
        </CardFooter>
      </Card>

      <Card {...args} lx={{ width: 'full' }}>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Full width (fills parent)</CardContentTitle>
              <CardContentDescription>BTC</CardContentDescription>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentTitle>$43,210.00</CardContentTitle>
              <CardContentDescription>0.5 BTC</CardContentDescription>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>Balance: 0.5 BTC</CardContentDescription>
        </CardFooter>
      </Card>
    </Box>
  ),
};

export const CompositionsShowcase: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <Box lx={{ flexDirection: 'column', gap: 's16', width: 's320' }}>
        <Card type='info'>
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>Account 1</CardContentTitle>
                <CardContentDescription>Ethereum</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <Button appearance='base' size='sm'>
                Buy
              </Button>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardLeading>
              <CardContentDescription>
                3 assets on 2 networks
              </CardContentDescription>
            </CardLeading>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>Bitcoin</CardContentTitle>
                <CardContentDescription>BTC</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentTitle>$43,210.00</CardContentTitle>
                <CardContentDescription>0.5 BTC</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>
              1 asset on 1 network
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardLeading>
              <Spot appearance='icon' icon={Wallet} />
              <CardContent>
                <CardContentTitle>Bitcoin</CardContentTitle>
                <CardContentDescription>BTC</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentTitle>$43,210.00</CardContentTitle>
                <CardContentDescription>0.5 BTC</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>
              1 asset on 1 network
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>My Wallet</CardContentTitle>
                <CardContentDescription>Ethereum</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <Tag label='Active' />
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>
              2 assets on 1 network
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentRow>
                  <CardContentTitle>Bitcoin</CardContentTitle>
                  <Tag size='sm' label='Staking' appearance='base' />
                </CardContentRow>
                <CardContentRow>
                  <CardContentDescription>BTC</CardContentDescription>
                  <Tag size='sm' label='5.2% APY' appearance='warning' />
                </CardContentRow>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentRow>
                  <CardContentTitle>$43,210.00</CardContentTitle>
                </CardContentRow>
                <CardContentDescription>0.5 BTC</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>
              1 asset on 1 network
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardLeading>
              <CardContent>
                <CardContentTitle>Total Balance</CardContentTitle>
                <CardContentDescription>All accounts</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentTitle>$43,210.00</CardContentTitle>
                <CardContentDescription>+2.4%</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>
              3 assets on 2 networks
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card type='info'>
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>Staking</CardContentTitle>
                <CardContentDescription>Earn rewards</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentTitle>5.2%</CardContentTitle>
                <CardContentDescription>APY</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardFooterActions>
              <Button isFull appearance='transparent' size='sm'>
                Sell
              </Button>
              <Button isFull appearance='base' size='sm'>
                Stake now
              </Button>
            </CardFooterActions>
          </CardFooter>
        </Card>

        <Card type='info'>
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>My Wallet</CardContentTitle>
                <CardContentDescription>Ethereum</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <Button appearance='base' size='sm'>
                Send
              </Button>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>
              2 assets on 1 network
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card
          type='expandable'
          expanded={expanded}
          onPress={() => setExpanded(!expanded)}
        >
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>Bitcoin</CardContentTitle>
                <CardContentDescription>BTC</CardContentDescription>
              </CardContent>
            </CardLeading>
            <CardTrailing>
              <CardContent>
                <CardContentTitle>$43,210.00</CardContentTitle>
                <CardContentDescription>0.5 BTC</CardContentDescription>
              </CardContent>
            </CardTrailing>
          </CardHeader>
          <CardFooter>
            <CardContentDescription>Fee: 0.001 ETH</CardContentDescription>
            <CardFooterActions>
              <Button isFull appearance='transparent' size='sm'>
                Cancel
              </Button>
              <Button isFull appearance='base' size='sm'>
                Confirm
              </Button>
            </CardFooterActions>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardLeading>
              <CardContent>
                <CardContentDescription>BTC</CardContentDescription>
                <CardContentTitle>Bitcoin</CardContentTitle>
              </CardContent>
            </CardLeading>
          </CardHeader>
        </Card>
      </Box>
    );
  },
};
