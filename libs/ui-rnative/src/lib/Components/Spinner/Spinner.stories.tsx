import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../Utility/Box';
import { Text } from '../Utility/Text';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Communication/Spinner',
  component: Spinner,
  parameters: {
    actions: { disable: true },
  },
  argTypes: {
    size: {
      control: 'select',
      options: [12, 16, 20, 24, 40, 48, 56],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Base: Story = {
  args: {
    size: 40,
  },
  render: (args) => <Spinner {...args} />,
};

export const Sizes: Story = {
  argTypes: {
    size: {
      control: false,
    },
  },
  render: () => (
    <Box
      lx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 's32',
      }}
    >
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={12} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          12
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={16} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          16
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={20} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          20
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={24} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          24
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={40} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          40
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={48} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          48
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={56} />
        <Text typography='body4' lx={{ color: 'muted' }}>
          56
        </Text>
      </Box>
    </Box>
  ),
};

export const Colors: Story = {
  argTypes: {
    size: {
      control: false,
    },
  },
  render: () => (
    <Box
      lx={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 's32',
      }}
    >
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={40} color='base' />
        <Text typography='body4' lx={{ color: 'muted' }}>
          base
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={40} color='muted' />
        <Text typography='body4' lx={{ color: 'muted' }}>
          muted
        </Text>
      </Box>
      <Box lx={{ alignItems: 'center', gap: 's4' }}>
        <Spinner size={40} color='interactive' />
        <Text typography='body4' lx={{ color: 'muted' }}>
          interactive
        </Text>
      </Box>
    </Box>
  ),
};
