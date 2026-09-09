import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../../primitives';
import { Settings, Trash, Unlink } from '../../symbols';
import { MenuList, MenuListItem } from './MenuList';

const iconMap = {
  None: undefined,
  Settings,
  Unlink,
  Trash,
} as const;

const meta = {
  id: 'rnative-menulist',
  title: 'Core/MenuList',
  component: MenuListItem,
  parameters: {
    docs: {
      source: { language: 'tsx', format: true, type: 'dynamic' },
    },
  },
  argTypes: {
    icon: {
      options: Object.keys(iconMap),
      mapping: iconMap,
      control: { type: 'select' },
    },
    onPress: { action: 'pressed' },
  },
} satisfies Meta<typeof MenuListItem>;

export default meta;
type Story = StoryObj<typeof MenuListItem>;

export const Base: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  args: {
    label: 'Unlink device',
    appearance: 'base',
    disabled: false,
    icon: Unlink,
  },
  render: (args) => (
    <Box lx={{ width: 's320' }}>
      <MenuList>
        <MenuListItem {...args} />
      </MenuList>
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <Box lx={{ width: 's320' }}>
      <MenuList>
        <MenuListItem label='Unlink device' icon={Unlink} onPress={() => {}} />
        <MenuListItem
          label='Remove device'
          icon={Trash}
          appearance='red'
          onPress={() => {}}
        />
      </MenuList>
    </Box>
  ),
};

export const DisabledShowcase: Story = {
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
  },
  render: () => (
    <Box lx={{ width: 's320' }}>
      <MenuList>
        <MenuListItem
          label='Unlink device'
          icon={Unlink}
          disabled
          onPress={() => {}}
        />
        <MenuListItem
          label='Remove device'
          icon={Trash}
          appearance='red'
          disabled
          onPress={() => {}}
        />
      </MenuList>
    </Box>
  ),
};
