import type { Meta, StoryObj } from '@storybook/react-vite';
import { Settings, Plus, User, Apps, Home, Bell, Cart } from '../../Symbols';
import { TileButton } from './TileButton';

const iconOptions = {
  Settings,
  Plus,
  User,
  Apps,
  Home,
  Bell,
  Cart,
};

const meta: Meta<typeof TileButton> = {
  component: TileButton,
  title: 'Action/TileButton',
  parameters: {
    layout: 'centered',
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
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: 'select' },
    },
    onClick: {
      action: 'clicked',
    },
  },
};

export default meta;
type Story = StoryObj<typeof TileButton>;

export const Base: Story = {
  args: {
    icon: Settings,
    children: 'Settings',
  },
  parameters: {
    docs: {
      source: {
        code: `<TileButton icon={Settings}>Settings</TileButton>`,
      },
    },
  },
};

export const DisabledShowcase: Story = {
  render: () => (
    <div className='flex gap-16'>
      <TileButton icon={Settings}>Enabled</TileButton>
      <TileButton icon={Settings} disabled>
        Disabled
      </TileButton>
    </div>
  ),
};

export const IconsShowcase: Story = {
  render: () => (
    <div className='flex gap-16'>
      <TileButton icon={Settings}>Settings</TileButton>
      <TileButton icon={User}>Profile</TileButton>
      <TileButton icon={Plus}>Add</TileButton>
      <TileButton icon={Apps}>Apps</TileButton>
    </div>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <div className='grid grid-cols-3 gap-8'>
      <TileButton icon={Plus}>Buy</TileButton>
      <TileButton icon={Settings}>Settings</TileButton>
      <TileButton icon={User}>Profile</TileButton>
      <TileButton icon={Apps}>Apps</TileButton>
    </div>
  ),
};

export const WidthShowcase: Story = {
  render: () => (
    <div className='flex w-320 flex-col items-start gap-8 rounded-md p-16'>
      <TileButton icon={Settings}>Default width</TileButton>
      <TileButton icon={Settings} isFull>
        Full width (isFull)
      </TileButton>
    </div>
  ),
};

export const TruncationShowcase: Story = {
  render: () => (
    <div className='flex gap-16'>
      <div className='w-80'>
        <TileButton icon={Settings} isFull>
          Very long label text
        </TileButton>
      </div>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => (
    <div className='flex gap-16'>
      <TileButton asChild icon={Settings}>
        <a href='#settings'>Settings</a>
      </TileButton>
      <TileButton asChild icon={User}>
        <a href='#profile'>Profile</a>
      </TileButton>
    </div>
  ),
  parameters: {
    docs: {
      source: {
        code: `
import { Link } from 'react-router-dom';

<TileButton asChild icon={Settings}>
  <Link to="/settings">Settings</Link>
</TileButton>
`,
      },
    },
  },
};
