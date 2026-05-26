import { CryptoIcon } from '@ledgerhq/crypto-icons';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Settings, Star } from '../../Symbols';
import { MediaButton } from './MediaButton';
import type { MediaButtonProps } from './types';

type Size = NonNullable<MediaButtonProps['size']>;

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

const meta: Meta<typeof MediaButton> = {
  component: MediaButton,
  title: 'Action/MediaButton',
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
    leadingContent: {
      control: 'select',
      options: ['None', 'Settings (flat)', 'Bitcoin (rounded)'],
    },
    leadingContentShape: {
      control: 'select',
      options: ['flat', 'rounded'],
    },
    asChild: {
      control: false,
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
  render: ({ leadingContent, size, leadingContentShape, ...args }) => {
    const resolved = resolveIcon(leadingContent as string, size);
    return (
      <MediaButton
        {...args}
        size={size}
        leadingContent={resolved.node}
        leadingContentShape={resolved.type ?? leadingContentShape}
      >
        {args.children}
      </MediaButton>
    );
  },
};

export const SizeShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-16'>
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
    </div>
  ),
};

export const IconTypeShowcase: Story = {
  render: () => (
    <div className='flex flex-col gap-16'>
      <div className='flex items-center gap-16'>
        <MediaButton
          leadingContent={<Settings size={20} />}
          leadingContentShape='flat'
          appearance='gray'
        >
          Flat icon (md)
        </MediaButton>
        <MediaButton
          leadingContent={
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
          }
          leadingContentShape='rounded'
          appearance='gray'
        >
          Rounded icon (md)
        </MediaButton>
        <MediaButton appearance='gray'>No icon (md)</MediaButton>
      </div>
      <div className='flex items-center gap-16'>
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
            <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='24px' />
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
      </div>
    </div>
  ),
};

export const AllAppearancesWithIcons: Story = {
  render: () => {
    const appearances = ['gray', 'transparent', 'no-background'] as const;
    return (
      <div className='flex flex-col gap-16 p-16'>
        {appearances.map((appearance) => (
          <div key={appearance} className='flex items-center gap-16'>
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
                <CryptoIcon ledgerId='bitcoin' ticker='BTC' size='32px' />
              }
              leadingContentShape='rounded'
            >
              {appearance}
            </MediaButton>
          </div>
        ))}
      </div>
    );
  },
};
