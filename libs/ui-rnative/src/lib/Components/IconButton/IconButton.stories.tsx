import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Close, Heart, Plus, Settings, Share } from '../../Symbols';
import { Box } from '../Utility';
import { IconButton } from './IconButton';

const iconMap = {
  Heart,
  Plus,
  Settings,
  Share,
  Close,
} as const;

const meta: Meta<typeof IconButton> = {
  title: 'Core/IconButton',
  component: IconButton,
  argTypes: {
    icon: {
      options: Object.keys(iconMap),
      mapping: iconMap,
      control: {
        type: 'select',
        labels: {
          Heart: 'Heart',
          Plus: 'Plus',
          Settings: 'Settings',
          Share: 'Share',
          Close: 'Close',
        },
      },
    },
    accessibilityLabel: {
      control: 'text',
      description: 'Accessibility label for screen readers',
    },
    appearance: {
      control: 'select',
      options: [
        'base',
        'gray',
        'accent',
        'transparent',
        'no-background',
        'red',
      ],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Base: Story = {
  args: {
    accessibilityLabel: 'Settings',
    icon: Settings,
    size: 'md',
    appearance: 'base',
  },
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', gap: 's8' }}>
      <IconButton accessibilityLabel='Add' icon={Plus} appearance='accent' />
      <IconButton accessibilityLabel='Add' icon={Plus} appearance='base' />
      <IconButton accessibilityLabel='Add' icon={Plus} appearance='gray' />
      <IconButton
        accessibilityLabel='Add'
        icon={Plus}
        appearance='transparent'
      />
      <IconButton
        accessibilityLabel='Add'
        icon={Plus}
        appearance='no-background'
      />
      <IconButton accessibilityLabel='Add' icon={Plus} appearance='red' />
    </Box>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's8' }}>
      <IconButton
        accessibilityLabel='Add to favorites'
        icon={Heart}
        size='xs'
      />
      <IconButton
        accessibilityLabel='Add to favorites'
        icon={Heart}
        size='sm'
      />
      <IconButton
        accessibilityLabel='Add to favorites'
        icon={Heart}
        size='md'
      />
      <IconButton
        accessibilityLabel='Add to favorites'
        icon={Heart}
        size='lg'
      />
    </Box>
  ),
};

export const StatesShowcase: Story = {
  args: {
    appearance: 'base',
  },
  render: ({ appearance }) => (
    <Box lx={{ flexDirection: 'row', alignItems: 'flex-start', gap: 's8' }}>
      <IconButton
        accessibilityLabel='Settings'
        appearance={appearance}
        icon={Settings}
        disabled
      />
      <IconButton
        accessibilityLabel='Settings'
        appearance={appearance}
        icon={Settings}
        loading
      />
    </Box>
  ),
};
