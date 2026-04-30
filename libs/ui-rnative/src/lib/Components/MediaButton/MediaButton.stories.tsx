import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings, Star } from '../../Symbols';
import { Box } from '../Utility';
import { MediaButton } from './MediaButton';

const meta: Meta<typeof MediaButton> = {
  component: MediaButton,
  title: 'Action/MediaButton',
  parameters: {
    layout: 'centered',
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaButton>;

export const Base: Story = {
  args: {
    children: 'All accounts',
    appearance: 'gray',
  },
  render: (args) => <MediaButton {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
<MediaButton appearance="gray">
  All accounts
</MediaButton>
`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <MediaButton size='sm' icon={<Star size={20} />} iconType='flat'>
        Small
      </MediaButton>
      <MediaButton size='md' icon={<Star size={20} />} iconType='flat'>
        Medium
      </MediaButton>
    </Box>
  ),
};

export const IconTypeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <MediaButton
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
        >
          Flat icon (md)
        </MediaButton>
        <MediaButton
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />}
          iconType='rounded'
          appearance='gray'
        >
          Rounded icon (md)
        </MediaButton>
        <MediaButton appearance='gray'>No icon (md)</MediaButton>
      </Box>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <MediaButton
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
          size='sm'
        >
          Flat icon (sm)
        </MediaButton>
        <MediaButton
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />}
          iconType='rounded'
          appearance='gray'
          size='sm'
        >
          Rounded icon (sm)
        </MediaButton>
        <MediaButton appearance='gray' size='sm'>
          No icon (sm)
        </MediaButton>
      </Box>
    </Box>
  ),
};

export const AppearanceShowcase: Story = {
  render: () => {
    const appearances = ['gray', 'transparent', 'no-background'] as const;
    return (
      <Box lx={{ flexDirection: 'column', gap: 's16', padding: 's16' }}>
        {appearances.map((appearance) => (
          <Box
            key={appearance}
            lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}
          >
            <MediaButton appearance={appearance}>{appearance}</MediaButton>
            <MediaButton
              appearance={appearance}
              icon={<Settings size={20} />}
              iconType='flat'
            >
              {appearance}
            </MediaButton>
            <MediaButton
              appearance={appearance}
              icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />}
              iconType='rounded'
            >
              {appearance}
            </MediaButton>
          </Box>
        ))}
      </Box>
    );
  },
};
