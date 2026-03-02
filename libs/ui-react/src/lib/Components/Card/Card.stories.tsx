import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Wallet } from '../../Symbols';
import { Button } from '../Button/Button';
import { Spot } from '../Spot/Spot';
import { Tag } from '../Tag/Tag';
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
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Base: Story = {
  args: {
    className: 'w-320',
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
};

export const StatesShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <Card className='w-320'>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Interactive (default)</CardContentTitle>
              <CardContentDescription>
                Whole card is clickable
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

      <Card className='w-320' outlined>
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

      <Card className='w-320' type='info'>
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

      <Card className='w-320' disabled>
        <CardHeader>
          <CardLeading>
            <div className='opacity-30'>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            </div>
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

      <Card className='w-320' disabled>
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
    </div>
  ),
};

export const DisabledWithIcon: Story = {
  args: {
    className: 'w-320',
    disabled: true,
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardLeading>
          <Wallet size={20} />
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

export const DisabledWithSpot: Story = {
  args: {
    className: 'w-320',
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
      <div className='flex flex-col gap-16'>
        <Card
          className='w-320'
          type='expandable'
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
        >
          <CardHeader>
            <CardLeading>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
              <CardContent>
                <CardContentTitle>Expandable Card</CardContentTitle>
                <CardContentDescription>Click to toggle</CardContentDescription>
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
      </div>
    );
  },
};

export const LayoutShowcase: Story = {
  render: () => (
    <div className='flex w-480 flex-col gap-32'>
      <Card className='w-fit'>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentTitle>Fit content</CardContentTitle>
              <CardContentDescription>BTC</CardContentDescription>
            </CardContent>
          </CardLeading>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>Balance: 0.5 BTC</CardContentDescription>
        </CardFooter>
      </Card>

      <Card className='w-320'>
        <CardHeader>
          <CardLeading>
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            <CardContent>
              <CardContentRow>
                <CardContentTitle>Defined width (320px)</CardContentTitle>
                <Tag size='sm' label='NEW' />
              </CardContentRow>
              <CardContentRow>
                <CardContentDescription>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quisquam, quos.
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

      <Card className='w-320'>
        <CardHeader>
          <CardLeading>
            <div className='shrink-0'>
              <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='48px' />
            </div>
            <CardContent>
              <CardContentRow>
                <CardContentTitle>Defined width (320px)</CardContentTitle>
              </CardContentRow>
              <CardContentRow>
                <CardContentDescription>
                  AAAA lorem ipsum dolor sit amet consectetur adipisicing elit.
                </CardContentDescription>
              </CardContentRow>
            </CardContent>
          </CardLeading>
          <CardTrailing>
            <CardContent>
              <CardContentRow>
                <CardContentTitle>Defined width (320px)</CardContentTitle>
                <Tag size='sm' label='NEW' />
              </CardContentRow>
              <CardContentRow>
                <CardContentDescription>
                  Lorem ipsum dolor
                </CardContentDescription>
                <Tag size='sm' label='BTC' appearance='base' />
              </CardContentRow>
            </CardContent>
          </CardTrailing>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>Balance: 0.5 BTC</CardContentDescription>
        </CardFooter>
      </Card>

      <Card>
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
    </div>
  ),
};

export const CompositionsShowcase: Story = {
  render: () => {
    const [expanded, setExpanded] = useState(false);

    return (
      <div className='flex flex-col gap-16'>
        <Card className='w-320' type='info'>
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

        <Card
          className='w-320'
          onClick={() => {
            // do stuff
          }}
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
            <CardContentDescription>
              1 asset on 1 network
            </CardContentDescription>
          </CardFooter>
        </Card>

        <Card className='w-320'>
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

        <Card className='w-320'>
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

        <Card className='w-320'>
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

        <Card className='w-320'>
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

        <Card className='w-320' type='info'>
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

        <Card className='w-320' type='info'>
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
          className='w-320'
          type='expandable'
          expanded={expanded}
          onClick={() => setExpanded(!expanded)}
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
      </div>
    );
  },
};
