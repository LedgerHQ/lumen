import { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Box } from '../Utility/Box';
import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Communication/Skeleton',
  component: Skeleton,
  parameters: {
    actions: { disable: true },
  },
  argTypes: {
    component: {
      control: 'select',
      options: [undefined, 'list-item', 'tile'],
      description: 'Pre-built skeleton component variant',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Base: Story = {
  args: {
    lx: {
      height: 's16',
      width: 's256',
    },
  },
  render: (args) => (
    <Box lx={{ padding: 's16', backgroundColor: 'canvas', borderRadius: 'md' }}>
      <Skeleton
        component={args.component}
        lx={args.component ? undefined : args.lx}
      />
    </Box>
  ),
};

export const WithListItem: Story = {
  render: () => (
    <Box lx={{ padding: 's16', backgroundColor: 'canvas', borderRadius: 'md' }}>
      <Skeleton component='list-item' lx={{ width: 's320' }} />
    </Box>
  ),
};

export const WithTile: Story = {
  render: () => (
    <Box lx={{ padding: 's16', backgroundColor: 'canvas', borderRadius: 'md' }}>
      <Skeleton component='tile' />
    </Box>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <Box
      lx={{
        padding: 's16',
        backgroundColor: 'canvas',
        borderRadius: 'md',
        gap: 's4',
      }}
    >
      <Skeleton lx={{ height: 's40', width: 's56' }} />
      <Skeleton lx={{ height: 's12', width: 's112' }} />
      <Skeleton lx={{ height: 's128', width: 's256' }} />
    </Box>
  ),
};

export const ShapeShowcase: Story = {
  render: () => (
    <Box
      lx={{
        padding: 's16',
        backgroundColor: 'canvas',
        borderRadius: 'md',
        gap: 's4',
      }}
    >
      <Skeleton lx={{ height: 's40', width: 's256', borderRadius: 'none' }} />
      <Skeleton lx={{ height: 's40', width: 's256', borderRadius: 'lg' }} />
      <Skeleton lx={{ width: 's48', height: 's48', borderRadius: 'full' }} />
      <Skeleton lx={{ width: 's48', height: 's48', borderRadius: 'md' }} />
    </Box>
  ),
};
