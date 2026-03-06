import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import React from 'react';
import { Settings, Star } from '../../Symbols';
import { Box } from '../Utility';
import { ButtonTrigger } from './ButtonTrigger';

const meta: Meta<typeof ButtonTrigger> = {
  component: ButtonTrigger,
  title: 'Action/ButtonTrigger',
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
type Story = StoryObj<typeof ButtonTrigger>;

export const Base: Story = {
  args: {
    children: 'All accounts',
    appearance: 'gray',
  },
  render: (args) => <ButtonTrigger {...args} />,
  parameters: {
    docs: {
      source: {
        code: `
<ButtonTrigger appearance="gray">
  All accounts
</ButtonTrigger>
`,
      },
    },
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
      <ButtonTrigger size='sm' icon={<Star size={20} />} iconType='flat'>
        Small
      </ButtonTrigger>
      <ButtonTrigger size='md' icon={<Star size={20} />} iconType='flat'>
        Medium
      </ButtonTrigger>
    </Box>
  ),
};

export const IconTypeShowcase: Story = {
  render: () => (
    <Box lx={{ flexDirection: 'column', gap: 's16' }}>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <ButtonTrigger
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
        >
          Flat icon (md)
        </ButtonTrigger>
        <ButtonTrigger
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
          iconType='rounded'
          appearance='gray'
        >
          Rounded icon (md)
        </ButtonTrigger>
        <ButtonTrigger appearance='gray'>No icon (md)</ButtonTrigger>
      </Box>
      <Box lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}>
        <ButtonTrigger
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
          size='sm'
        >
          Flat icon (sm)
        </ButtonTrigger>
        <ButtonTrigger
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
          iconType='rounded'
          appearance='gray'
          size='sm'
        >
          Rounded icon (sm)
        </ButtonTrigger>
        <ButtonTrigger appearance='gray' size='sm'>
          No icon (sm)
        </ButtonTrigger>
      </Box>
    </Box>
  ),
};

export const AllAppearancesWithIcons: Story = {
  render: () => {
    const appearances = ['gray', 'transparent', 'no-background'] as const;
    return (
      <Box lx={{ flexDirection: 'column', gap: 's16', padding: 's16' }}>
        {appearances.map((appearance) => (
          <Box
            key={appearance}
            lx={{ flexDirection: 'row', alignItems: 'center', gap: 's16' }}
          >
            <ButtonTrigger appearance={appearance}>{appearance}</ButtonTrigger>
            <ButtonTrigger
              appearance={appearance}
              icon={<Settings size={20} />}
              iconType='flat'
            >
              {appearance}
            </ButtonTrigger>
            <ButtonTrigger
              appearance={appearance}
              icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
              iconType='rounded'
            >
              {appearance}
            </ButtonTrigger>
          </Box>
        ))}
      </Box>
    );
  },
};
