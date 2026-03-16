import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Settings, Star } from '../../Symbols';
import { Box } from '../Utility';
import { TriggerButton } from './TriggerButton';

const meta: Meta<typeof TriggerButton> = {
  component: TriggerButton,
  title: 'Action/TriggerButton',
  parameters: {
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
type Story = StoryObj<typeof TriggerButton>;

export const Base: Story = {
  args: {
    children: 'All accounts',
    appearance: 'gray',
  },
  render: (args) => <TriggerButton {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
<TriggerButton appearance="gray">
  All accounts
</TriggerButton>
`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <TriggerButton size='sm' icon={<Star size={20} />} iconType='flat'>
        Small
      </TriggerButton>
      <TriggerButton size='md' icon={<Star size={20} />} iconType='flat'>
        Medium
      </TriggerButton>
    </Box>
  ),
};

export const IconTypeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <TriggerButton
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
        >
          Flat icon (md)
        </TriggerButton>
        <TriggerButton
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
          iconType='rounded'
          appearance='gray'
        >
          Rounded icon (md)
        </TriggerButton>
        <TriggerButton appearance='gray'>No icon (md)</TriggerButton>
      </Box>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <TriggerButton
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
          size='sm'
        >
          Flat icon (sm)
        </TriggerButton>
        <TriggerButton
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
          iconType='rounded'
          appearance='gray'
          size='sm'
        >
          Rounded icon (sm)
        </TriggerButton>
        <TriggerButton appearance='gray' size='sm'>
          No icon (sm)
        </TriggerButton>
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
            <TriggerButton appearance={appearance}>{appearance}</TriggerButton>
            <TriggerButton
              appearance={appearance}
              icon={<Settings size={20} />}
              iconType='flat'
            >
              {appearance}
            </TriggerButton>
            <TriggerButton
              appearance={appearance}
              icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
              iconType='rounded'
            >
              {appearance}
            </TriggerButton>
          </Box>
        ))}
      </Box>
    );
  },
};
