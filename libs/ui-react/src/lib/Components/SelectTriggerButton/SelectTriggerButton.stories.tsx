import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Settings, Star } from '../../Symbols';
import { SelectTriggerButton } from './SelectTriggerButton';
import type { SelectTriggerButtonProps } from './types';

type Size = NonNullable<SelectTriggerButtonProps['size']>;

const cryptoIconSizes = {
  sm: '24px',
  md: '32px',
} as const;

const resolveIcon = (
  iconKey: string | undefined,
  size: Size = 'md',
): { node?: ReactNode; type?: 'flat' | 'rounded' } => {
  switch (iconKey) {
    case 'Settings (flat)':
      return { node: <Settings size={20} />, type: 'flat' };
    case 'Bitcoin (rounded)':
      return {
        node: (
          <CryptoIcon
            ledgerId='bitcoin'
            ticker='BTC'
            size={cryptoIconSizes[size]}
          />
        ),
        type: 'rounded',
      };
    default:
      return {};
  }
};

const meta: Meta<typeof SelectTriggerButton> = {
  component: SelectTriggerButton,
  title: 'Action/SelectTriggerButton',
  parameters: {
    layout: 'centered',
    backgrounds: { default: 'light' },
    docs: {
      source: {
        language: 'tsx',
        format: true,
        type: 'code',
      },
    },
  },
  argTypes: {
    icon: {
      control: 'select',
      options: ['None', 'Settings (flat)', 'Bitcoin (rounded)'],
    },
    iconType: {
      control: 'select',
      options: ['flat', 'rounded'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof SelectTriggerButton>;

export const Base: Story = {
  args: {
    children: 'All accounts',
    appearance: 'gray',
  },
  render: ({ icon, size, iconType, ...args }) => {
    const resolved = resolveIcon(icon as string, size);
    return (
      <SelectTriggerButton
        {...args}
        size={size}
        icon={resolved.node}
        iconType={resolved.type ?? iconType}
      >
        {args.children}
      </SelectTriggerButton>
    );
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-16'>
      <SelectTriggerButton size='sm' icon={<Star size={20} />} iconType='flat'>
        Small
      </SelectTriggerButton>
      <SelectTriggerButton size='md' icon={<Star size={20} />} iconType='flat'>
        Medium
      </SelectTriggerButton>
    </div>
  ),
};

export const IconTypeShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <div className='flex items-center gap-16'>
        <SelectTriggerButton
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
        >
          Flat icon (md)
        </SelectTriggerButton>
        <SelectTriggerButton
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
          iconType='rounded'
          appearance='gray'
        >
          Rounded icon (md)
        </SelectTriggerButton>
        <SelectTriggerButton appearance='gray'>
          No icon (md)
        </SelectTriggerButton>
      </div>
      <div className='flex items-center gap-16'>
        <SelectTriggerButton
          icon={<Settings size={20} />}
          iconType='flat'
          appearance='gray'
          size='sm'
        >
          Flat icon (sm)
        </SelectTriggerButton>
        <SelectTriggerButton
          icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />}
          iconType='rounded'
          appearance='gray'
          size='sm'
        >
          Rounded icon (sm)
        </SelectTriggerButton>
        <SelectTriggerButton appearance='gray' size='sm'>
          No icon (sm)
        </SelectTriggerButton>
      </div>
    </div>
  ),
};

export const AllAppearancesWithIcons: Story = {
  render: () => {
    const appearances = ['gray', 'transparent', 'no-background'] as const;
    return (
      <div
        className='flex flex-col gap-16 p-16'
        style={{
          backgroundImage:
            'linear-gradient(45deg, #f2f2f2 25%, transparent 25%), ' +
            'linear-gradient(-45deg, #f2f2f2 25%, transparent 25%), ' +
            'linear-gradient(45deg, transparent 75%, #f2f2f2 75%), ' +
            'linear-gradient(-45deg, transparent 75%, #f2f2f2 75%)',
          backgroundSize: '20px 20px',
        }}
      >
        {appearances.map((appearance) => (
          <div key={appearance} className='flex items-center gap-16'>
            <SelectTriggerButton appearance={appearance}>
              {appearance}
            </SelectTriggerButton>
            <SelectTriggerButton
              appearance={appearance}
              icon={<Settings size={20} />}
              iconType='flat'
            >
              {appearance}
            </SelectTriggerButton>
            <SelectTriggerButton
              appearance={appearance}
              icon={<CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />}
              iconType='rounded'
            >
              {appearance}
            </SelectTriggerButton>
          </div>
        ))}
      </div>
    );
  },
};
