import CryptoIcon from '@ledgerhq/crypto-icons/native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { Settings, Star } from '../../Symbols';
import { Box } from '../Utility';
import { MediaButton } from './MediaButton';

const meta: Meta<typeof MediaButton> = {
  component: MediaButton,
  title: 'Core/MediaButton',
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
      <MediaButton
        size='sm'
        leadingContent={<Star size={20} />}
        leadingContentShape='flat'
      >
        Small
      </MediaButton>
      <MediaButton
        size='md'
        leadingContent={<Star size={20} />}
        leadingContentShape='flat'
      >
        Medium
      </MediaButton>
    </Box>
  ),
};

export const LeadingContentShapeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <MediaButton
          leadingContent={<Settings size={20} />}
          leadingContentShape='flat'
          appearance='gray'
        >
          Flat icon (md)
        </MediaButton>
        <MediaButton
          leadingContent={
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />
          }
          leadingContentShape='rounded'
          appearance='gray'
        >
          Rounded icon (md)
        </MediaButton>
        <MediaButton appearance='gray'>No icon (md)</MediaButton>
      </Box>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <MediaButton
          leadingContent={<Settings size={20} />}
          leadingContentShape='flat'
          appearance='gray'
          size='sm'
        >
          Flat icon (sm)
        </MediaButton>
        <MediaButton
          leadingContent={
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={24} />
          }
          leadingContentShape='rounded'
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
              leadingContent={<Settings size={20} />}
              leadingContentShape='flat'
            >
              {appearance}
            </MediaButton>
            <MediaButton
              appearance={appearance}
              leadingContent={
                <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />
              }
              leadingContentShape='rounded'
            >
              {appearance}
            </MediaButton>
          </Box>
        ))}
      </Box>
    );
  },
};
