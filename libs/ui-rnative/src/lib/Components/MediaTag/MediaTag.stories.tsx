import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { MediaImage } from '../MediaImage';
import { Box } from '../Utility/Box';
import { MediaTag } from './MediaTag';

const ETH_ICON = (
  <MediaImage
    src='https://crypto-icons.ledger.com/ETH.png'
    alt='Ethereum'
    size={16}
    shape='square'
  />
);

const meta: Meta<typeof MediaTag> = {
  component: MediaTag,
  title: 'Communication/MediaTag',
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
  },
};

export default meta;

type Story = StoryObj<typeof MediaTag>;

export const Base: Story = {
  args: {
    label: 'Ethereum',
    appearance: 'accent',
    size: 'md',
  },
  render: (args) => <MediaTag {...args} icon={ETH_ICON} />,
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's4' }}>
      <MediaTag appearance='base' label='Base' icon={ETH_ICON} />
      <MediaTag appearance='gray' label='Gray' icon={ETH_ICON} />
      <MediaTag appearance='accent' label='Accent' icon={ETH_ICON} />
      <MediaTag
        appearance='accent-subtle'
        label='Accent subtle'
        icon={ETH_ICON}
      />
      <MediaTag appearance='success' label='Success' icon={ETH_ICON} />
      <MediaTag appearance='error' label='Error' icon={ETH_ICON} />
      <MediaTag appearance='warning' label='Warning' icon={ETH_ICON} />
      <MediaTag label='Disabled' icon={ETH_ICON} disabled />
    </Box>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <MediaTag size='md' label='Medium' icon={ETH_ICON} />
      <MediaTag
        size='sm'
        label='Small'
        icon={
          <MediaImage
            src='https://crypto-icons.ledger.com/ETH.png'
            alt='Ethereum'
            size={12}
            shape='square'
          />
        }
      />
    </Box>
  ),
};

export const TruncateShowcase: Story = {
  render: () => (
    <Box lx={{ width: 's176' }}>
      <MediaTag label='Very long text that truncates' icon={ETH_ICON} />
    </Box>
  ),
};
