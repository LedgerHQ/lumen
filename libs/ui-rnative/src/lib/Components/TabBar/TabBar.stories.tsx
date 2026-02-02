import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import {
  BasketPutIn,
  HomeFill,
  Settings,
  Placeholder,
  Chart1,
  Bell,
  CoinPercent,
  Home,
  LifeRing,
  LifeRingFill,
  Cart,
  CreditCard,
  CreditCardFill,
} from '../../Symbols';
import { TabBar, TabBarItem } from './TabBar';

const meta = {
  title: 'Navigation/TabBar',
  component: TabBar,
  subcomponents: {
    TabBarItem,
  },
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  argTypes: {
    active: {
      control: 'text',
      description: 'The currently active tab value',
      table: {
        type: { summary: 'string' },
      },
    },
    onTabPress: {
      action: 'tab pressed',
      description: 'Callback function when a tab is pressed',
      table: {
        type: { summary: '(active: string) => void' },
      },
    },
    children: {
      control: false,
      description: 'TabBarItem children',
      table: {
        type: { summary: 'TabBarChildren' },
      },
    },
  },
} satisfies Meta<typeof TabBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  args: {} as React.ComponentProps<typeof TabBar>,
  render: () => {
    const [active, setActive] = useState('home');
    return (
      <TabBar active={active} onTabPress={setActive} lx={{ width: 's320' }}>
        <TabBarItem
          value='home'
          label='Home'
          icon={Home}
          activeIcon={HomeFill}
        />
        <TabBarItem
          value='pay'
          label='Pay'
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
  },
};

export const Complex: Story = {
  args: {} as React.ComponentProps<typeof TabBar>,
  render: () => {
    const [active, setActive] = useState('portfolio');
    return (
      <TabBar active={active} onTabPress={setActive} lx={{ width: 's320' }}>
        <TabBarItem value='market' label='Market' icon={Chart1} />
        <TabBarItem
          value='portfolio'
          label='Portfolio'
          icon={CoinPercent}
          activeIcon={CoinPercent}
        />
        <TabBarItem value='shop' label='Shop' icon={BasketPutIn} />
        <TabBarItem value='notifications' label='Alerts' icon={Bell} />
        <TabBarItem value='settings' label='Settings' icon={Settings} />
      </TabBar>
    );
  },
};

export const MissingLabel: Story = {
  args: {} as React.ComponentProps<typeof TabBar>,
  render: () => {
    const [active, setActive] = useState('tab1');
    return (
      <TabBar active={active} onTabPress={setActive} lx={{ width: 's320' }}>
        <TabBarItem value='tab1' />
        <TabBarItem value='tab2' label='Tab' icon={Placeholder} />
        <TabBarItem value='tab3' icon={Cart} />
      </TabBar>
    );
  },
};
