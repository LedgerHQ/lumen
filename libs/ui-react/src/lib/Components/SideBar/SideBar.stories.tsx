import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  Home,
  HomeFill,
  Wallet,
  Settings,
  SettingsAlt,
  SettingsAlt2,
  User,
  Bell,
  BellFill,
  Compass,
  Star,
  StarFill,
  Exchange,
  ExchangeFill,
  CreditCard,
  CreditCardFill,
  CoinPercent,
} from '../../Symbols';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import {
  SideBar,
  SideBarLeading,
  SideBarTrailing,
  SideBarItem,
  SideBarCollapseToggle,
} from './SideBar';

const meta: Meta<typeof SideBar> = {
  component: SideBar,
  title: 'Navigation/SideBar',
  subcomponents: {
    SideBarLeading,
    SideBarTrailing,
    SideBarItem,
    SideBarCollapseToggle,
  },
  parameters: {
    layout: 'padded',

    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    collapsed: {
      control: 'boolean',
    },
    defaultCollapsed: {
      control: 'boolean',
    },
    onCollapsedChange: {
      action: 'collapsed changed',
    },
    active: {
      control: 'text',
    },
    defaultActive: {
      control: 'text',
    },
    onActiveChange: {
      action: 'active changed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SideBar>;

export const Base: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: (args) => {
    const [active, setActive] = useState('earn');

    return (
      <div>
        <SideBar
          className='h-560'
          {...args}
          active={active}
          onActiveChange={setActive}
        >
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
            <SideBarItem
              value='swap'
              icon={Exchange}
              activeIcon={ExchangeFill}
              label='Swap'
            />
            <SideBarItem
              value='earn'
              icon={CoinPercent}
              activeIcon={CoinPercent}
              label='Earn'
            />
            <SideBarItem
              value='card'
              icon={CreditCard}
              activeIcon={CreditCardFill}
              label='Card'
            />
          </SideBarLeading>
          <SideBarTrailing>
            <SideBarItem
              value='settings'
              icon={SettingsAlt}
              activeIcon={SettingsAlt2}
              label='Settings'
            />
            <SideBarCollapseToggle />
          </SideBarTrailing>
        </SideBar>
      </div>
    );
  },
};

export const CollapsedShowcase: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className='flex h-480 gap-32'>
      <div>
        <div className='mb-8 body-3 text-muted'>Expanded</div>
        <SideBar collapsed={false} active='home'>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
            <SideBarItem
              value='wallet'
              icon={Wallet}
              activeIcon={Wallet}
              label='Wallet'
            />
            <SideBarItem
              value='discover'
              icon={Compass}
              activeIcon={Compass}
              label='Discover'
            />
          </SideBarLeading>
          <SideBarTrailing>
            <SideBarItem
              value='settings'
              icon={SettingsAlt}
              activeIcon={SettingsAlt2}
              label='Settings'
            />
            <SideBarCollapseToggle />
          </SideBarTrailing>
        </SideBar>
      </div>

      <div>
        <div className='mb-8 body-3 text-muted'>Collapsed</div>
        <SideBar collapsed={true} active='home'>
          <SideBarLeading>
            <SideBarItem
              value='home'
              icon={Home}
              activeIcon={HomeFill}
              label='Home'
            />
            <SideBarItem
              value='wallet'
              icon={Wallet}
              activeIcon={Wallet}
              label='Wallet'
            />
            <SideBarItem
              value='discover'
              icon={Compass}
              activeIcon={Compass}
              label='Discover'
            />
          </SideBarLeading>
          <SideBarTrailing>
            <SideBarItem
              value='settings'
              icon={SettingsAlt}
              activeIcon={SettingsAlt2}
              label='Settings'
            />
            <SideBarCollapseToggle />
          </SideBarTrailing>
        </SideBar>
      </div>
    </div>
  ),
};

export const WithCustomLabel: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className='h-480'>
      <SideBar defaultActive='home'>
        <SideBarLeading>
          <SideBarItem
            value='home'
            icon={Home}
            activeIcon={HomeFill}
            label='Home'
          />
          <SideBarItem
            value='notifications'
            icon={Bell}
            activeIcon={BellFill}
            label={
              <span className='flex items-center gap-8'>
                <span>Notifications</span>
                <Tag size='sm' label='3' appearance='accent' />
              </span>
            }
            tooltipContent='Notifications (3 new)'
          />
          <SideBarItem
            value='wallet'
            icon={Wallet}
            activeIcon={Wallet}
            label={
              <span className='flex items-center gap-8'>
                <span>Wallet</span>
                <Tag size='sm' label='New' appearance='base' />
              </span>
            }
            tooltipContent='Wallet'
          />
        </SideBarLeading>
        <SideBarTrailing>
          <SideBarItem
            value='settings'
            icon={SettingsAlt}
            activeIcon={SettingsAlt2}
            label='Settings'
          />
          <SideBarCollapseToggle />
        </SideBarTrailing>
      </SideBar>
    </div>
  ),
};

export const WithDisabledItem: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className='h-480'>
      <SideBar defaultActive='home'>
        <SideBarLeading>
          <SideBarItem
            value='home'
            icon={Home}
            activeIcon={HomeFill}
            label='Home'
          />
          <SideBarItem
            value='wallet'
            icon={Wallet}
            activeIcon={Wallet}
            label='Wallet'
          />
          <SideBarItem
            value='discover'
            icon={Compass}
            activeIcon={Compass}
            label='Discover'
            disabled
          />
        </SideBarLeading>
        <SideBarTrailing>
          <SideBarItem
            value='settings'
            icon={SettingsAlt}
            activeIcon={SettingsAlt2}
            label='Settings'
          />
          <SideBarCollapseToggle />
        </SideBarTrailing>
      </SideBar>
    </div>
  ),
};

export const ControlledState: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => {
    const [collapsed, setCollapsed] = useState(false);
    const [active, setActive] = useState('home');

    return (
      <div className='flex w-208 flex-col gap-16'>
        <div className='flex items-center gap-8'>
          <span className='body-3 text-muted'>External control:</span>
          <Button
            appearance='base'
            size='sm'
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? 'Expand' : 'Collapse'}
          </Button>
        </div>
        <div className='h-400'>
          <SideBar
            collapsed={collapsed}
            onCollapsedChange={setCollapsed}
            active={active}
            onActiveChange={setActive}
          >
            <SideBarLeading>
              <SideBarItem
                value='home'
                icon={Home}
                activeIcon={HomeFill}
                label='Home'
              />
              <SideBarItem
                value='wallet'
                icon={Wallet}
                activeIcon={Wallet}
                label='Wallet'
              />
              <SideBarItem
                value='discover'
                icon={Compass}
                activeIcon={Compass}
                label='Discover'
              />
            </SideBarLeading>
            <SideBarTrailing>
              <SideBarItem
                value='settings'
                icon={SettingsAlt}
                activeIcon={SettingsAlt2}
                label='Settings'
              />
              <SideBarCollapseToggle />
            </SideBarTrailing>
          </SideBar>
        </div>
      </div>
    );
  },
};

export const ManyItems: Story = {
  parameters: {
    backgrounds: { default: 'light' },
  },
  render: () => (
    <div className='h-320'>
      <SideBar defaultActive='home'>
        <SideBarLeading>
          <SideBarItem
            value='home'
            icon={Home}
            activeIcon={HomeFill}
            label='Home'
          />
          <SideBarItem
            value='wallet'
            icon={Wallet}
            activeIcon={Wallet}
            label='Wallet'
          />
          <SideBarItem
            value='discover'
            icon={Compass}
            activeIcon={Compass}
            label='Discover'
          />
          <SideBarItem
            value='favorites'
            icon={Star}
            activeIcon={StarFill}
            label='Favorites'
          />
          <SideBarItem
            value='notifications'
            icon={Bell}
            activeIcon={BellFill}
            label='Notifications'
          />
        </SideBarLeading>
        <SideBarTrailing>
          <SideBarItem
            value='profile'
            icon={User}
            activeIcon={User}
            label='Profile'
          />
          <SideBarItem
            value='settings'
            icon={Settings}
            activeIcon={Settings}
            label='Settings'
          />
          <SideBarCollapseToggle />
        </SideBarTrailing>
      </SideBar>
    </div>
  ),
};
