import { TabBar, TabBarItem } from '@ledgerhq/lumen-ui-rnative';
import {
  Home,
  HomeFill,
  CreditCard,
  CreditCardFill,
  Exchange,
  ExchangeFill,
  LifeRing,
  LifeRingFill,
} from '@ledgerhq/lumen-ui-rnative/symbols';
import { useState } from 'react';

export function ExampleTabBar() {
  const [active, setActive] = useState('home');

  return (
    <TabBar active={active} onTabPress={setActive}>
      <TabBarItem value='home' label='Home' icon={Home} activeIcon={HomeFill} />
      <TabBarItem
        value='swap'
        label='Swap'
        icon={Exchange}
        activeIcon={ExchangeFill}
      />
      <TabBarItem
        value='card'
        label='Card'
        icon={CreditCard}
        activeIcon={CreditCardFill}
      />
      <TabBarItem
        value='help'
        label='Help'
        icon={LifeRing}
        activeIcon={LifeRingFill}
      />
    </TabBar>
  );
}
