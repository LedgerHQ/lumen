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
  title: 'Core/MediaTag',
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
        'white',
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
  render: (args) => <MediaTag {...args} leadingContent={ETH_ICON} />,
};

export const AppearanceShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', flexWrap: 'wrap', gap: 's4' }}>
      <MediaTag appearance='base' label='Base' leadingContent={ETH_ICON} />
      <MediaTag appearance='gray' label='Gray' leadingContent={ETH_ICON} />
      <MediaTag appearance='accent' label='Accent' leadingContent={ETH_ICON} />
      <MediaTag
        appearance='accent-subtle'
        label='Accent subtle'
        leadingContent={ETH_ICON}
      />
      <MediaTag
        appearance='success'
        label='Success'
        leadingContent={ETH_ICON}
      />
      <MediaTag appearance='error' label='Error' leadingContent={ETH_ICON} />
      <MediaTag
        appearance='warning'
        label='Warning'
        leadingContent={ETH_ICON}
      />
      <MediaTag appearance='white' label='White' leadingContent={ETH_ICON} />
      <MediaTag label='Disabled' leadingContent={ETH_ICON} disabled />
    </Box>
  ),
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's4' }}>
      <MediaTag size='md' label='Medium' leadingContent={ETH_ICON} />
      <MediaTag
        size='sm'
        label='Small'
        leadingContent={
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
      <MediaTag
        label='Very long text that truncates'
        leadingContent={ETH_ICON}
      />
    </Box>
  ),
};
