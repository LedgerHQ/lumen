import {
  Box,
  Card,
  CardHeader,
  CardLeading,
  CardContent,
  CardContentTitle,
  CardContentDescription,
  CardTrailing,
  CardFooter,
  CardFooterActions,
  Button,
  Spot,
  Tag,
  CardContentRow,
} from '@ledgerhq/lumen-ui-rnative';
import { Wallet } from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

export const Cards = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Box lx={{ flexDirection: 'column', gap: 's16', maxWidth: 'full' }}>
      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
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
          <CardContentDescription>1 asset on 1 network</CardContentDescription>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        disabled
        onPress={() => {
          return;
        }}
      >
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
          <CardContentDescription>1 asset on 1 network</CardContentDescription>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
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
          <CardContentDescription>1 asset on 1 network</CardContentDescription>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
        <CardHeader>
          <CardLeading>
            <Spot appearance='icon' icon={Wallet} />
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
          <CardContentDescription>2 assets on 1 network</CardContentDescription>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
        <CardHeader>
          <CardLeading>
            <Spot appearance='icon' icon={Wallet} />
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
          <CardContentDescription>1 asset on 1 network</CardContentDescription>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
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

      <Card lx={{ maxWidth: 'full' }} type='info'>
        <CardHeader>
          <CardLeading>
            <Spot appearance='icon' icon={Wallet} />
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
            <Button lx={{ flex: 1 }} appearance='transparent' size='sm'>
              Sell
            </Button>
            <Button lx={{ flex: 1 }} appearance='base' size='sm'>
              Stake now
            </Button>
          </CardFooterActions>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        type='info'
        onPress={() => {
          return;
        }}
      >
        <CardHeader>
          <CardLeading>
            <Spot appearance='icon' icon={Wallet} />
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
          <CardContentDescription>2 assets on 1 network</CardContentDescription>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        type='expandable'
        expanded={expanded}
        onPress={() => setExpanded(!expanded)}
      >
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
          <CardContentDescription>Fee: 0.001 ETH</CardContentDescription>
          <CardFooterActions>
            <Button lx={{ flex: 1 }} appearance='transparent' size='sm'>
              Cancel
            </Button>
            <Button lx={{ flex: 1 }} appearance='base' size='sm'>
              Confirm
            </Button>
          </CardFooterActions>
        </CardFooter>
      </Card>

      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
        <CardHeader>
          <CardLeading>
            <CardContent>
              <CardContentDescription>BTC</CardContentDescription>
              <CardContentTitle>Bitcoin</CardContentTitle>
            </CardContent>
          </CardLeading>
        </CardHeader>
      </Card>
      <Card
        lx={{ maxWidth: 'full' }}
        onPress={() => {
          return;
        }}
      >
        <CardHeader>
          <CardLeading>
            <Spot appearance='icon' icon={Wallet} />
            <CardContent>
              <CardContentTitle>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardContentTitle>
              <CardContentDescription>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </CardContentDescription>
            </CardContent>
          </CardLeading>
        </CardHeader>
        <CardFooter>
          <CardContentDescription>
            1 asset on 1 Lorem ipsum dolor sit amet consectetur adipisicing
            elit.
          </CardContentDescription>
        </CardFooter>
      </Card>
    </Box>
  );
};
