import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Check } from '../../Symbols/Icons/Check';
import { Box } from '../Utility/Box';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  component: Tag,
  title: 'Communication/Tag',
  argTypes: {
    appearance: {
      control: 'select',
      options: [
        'base',
        'gray',
        'accent',
        'accent-subtle',
        'success',
        'error',
        'warning',
      ],
    },
    size: {
      control: 'radio',
      options: ['sm', 'md'],
    },
    label: {
      control: 'text',
    },
    icon: {
      control: {
        type: 'boolean',
      },
      description: 'Show icon',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Tag>;

export const Base: Story = {
  args: {
    label: 'Label',
    appearance: 'accent',
    size: 'md',
  },
  render: (args) => <Tag {...args} icon={args.icon ? Check : undefined} />,
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', gap: 's4' }}>
        <Tag appearance='base' label='Base' />
        <Tag appearance='gray' label='Gray' />
        <Tag appearance='accent' label='Accent' />
        <Tag appearance='accent-subtle' label='Accent subtle' />
        <Tag appearance='success' label='Success' />
        <Tag appearance='error' label='Error' />
        <Tag appearance='warning' label='Warning' />
        <Tag label='Disabled' disabled />
      </Box>
      <Box lx={{ flexDirection: 'row', gap: 's4' }}>
        <Tag appearance='base' label='Base' icon={Check} />
        <Tag appearance='gray' label='Gray' icon={Check} />
        <Tag appearance='accent' label='Accent' icon={Check} />
        <Tag appearance='accent-subtle' label='Accent subtle' icon={Check} />
        <Tag appearance='success' label='Success' icon={Check} />
        <Tag appearance='error' label='Error' icon={Check} />
        <Tag appearance='warning' label='Warning' icon={Check} />
        <Tag label='Disabled' icon={Check} disabled />
      </Box>
    </Box>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <Tag size='md' label='Large Tag' />
      <Tag size='sm' label='Small Tag' />
    </Box>
  ),
};

export const ContentTypeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <Tag label='Label only' />
      <Tag icon={Check} label='Icon and Label' />
    </Box>
  ),
};

export const TruncateShowcase: Story = {
  render: () => (
    <Box lx={{ width: 's176' }}>
      <Tag label='Very long custom Tag text that should truncate' />
    </Box>
  ),
};
