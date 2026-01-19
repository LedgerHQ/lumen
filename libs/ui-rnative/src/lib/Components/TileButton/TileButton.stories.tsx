import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
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
  argTypes: {
    icon: {
      options: Object.keys(iconOptions),
      mapping: iconOptions,
      control: { type: 'select' },
    },
    onPress: {
      action: 'pressed',
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
  render: (args) => <TileButton {...args} />,
  parameters: {
    docs: {
      source: {
        code: `<TileButton icon={Settings} onPress={() => {}}>Settings</TileButton>`,
      },
    },
  },
};

export const DisabledShowcase: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <TileButton icon={Settings} onPress={args.onPress}>
        Enabled
      </TileButton>
      <TileButton icon={Settings} onPress={args.onPress} disabled>
        Disabled
      </TileButton>
    </View>
  ),
};

export const IconsShowcase: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <TileButton icon={Settings} onPress={args.onPress}>
        Settings
      </TileButton>
      <TileButton icon={User} onPress={args.onPress}>
        Profile
      </TileButton>
      <TileButton icon={Plus} onPress={args.onPress}>
        Add
      </TileButton>
      <TileButton icon={Apps} onPress={args.onPress}>
        Apps
      </TileButton>
    </View>
  ),
};

export const GridLayout: Story = {
  render: (args) => (
    <View style={{ width: 343, gap: 8 }}>
      {/* 2-button row */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <TileButton icon={Plus} isFull onPress={args.onPress}>
            Buy
          </TileButton>
        </View>
        <View style={{ flex: 1 }}>
          <TileButton icon={Settings} isFull onPress={args.onPress}>
            Settings
          </TileButton>
        </View>
      </View>
      {/* 3-button row */}
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <View style={{ flex: 1 }}>
          <TileButton icon={User} isFull onPress={args.onPress}>
            Profile
          </TileButton>
        </View>
        <View style={{ flex: 1 }}>
          <TileButton icon={Apps} isFull onPress={args.onPress}>
            Apps
          </TileButton>
        </View>
        <View style={{ flex: 1 }}>
          <TileButton icon={Home} isFull onPress={args.onPress}>
            Home
          </TileButton>
        </View>
      </View>
    </View>
  ),
};

export const WidthShowcase: Story = {
  render: (args) => (
    <View
      style={{
        width: 320,
        gap: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
      }}
    >
      <TileButton icon={Settings} onPress={args.onPress}>
        Default width
      </TileButton>
      <TileButton icon={Settings} isFull onPress={args.onPress}>
        Full width (isFull)
      </TileButton>
    </View>
  ),
};

export const TruncationShowcase: Story = {
  render: (args) => (
    <View style={{ flexDirection: 'row', gap: 16 }}>
      <View style={{ width: 80 }}>
        <TileButton icon={Settings} isFull onPress={args.onPress}>
          Very long label text
        </TileButton>
      </View>
    </View>
  ),
};
