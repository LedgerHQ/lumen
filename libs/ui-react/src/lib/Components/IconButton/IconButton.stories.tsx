import type { Meta, StoryObj } from '@storybook/react-vite';
import React from 'react';
import { ExternalLink, Home } from '../../Symbols';
import { Close } from '../../Symbols/Icons/Close';
import { Heart } from '../../Symbols/Icons/Heart';
import { Plus } from '../../Symbols/Icons/Plus';
import { Settings } from '../../Symbols/Icons/Settings';
import { Share } from '../../Symbols/Icons/Share';
import { IconButton } from './IconButton';

const iconMap = {
  Heart,
  Plus,
  Settings,
  Share,
  Close,
} as const;

const meta: Meta<typeof IconButton> = {
  title: 'Action/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    icon: {
      options: Object.keys(iconMap),
      mapping: iconMap,
      control: {
        type: 'select',
        labels: {
          Heart: '❤️ Heart',
          Plus: '➕ Plus',
          Settings: '⚙️ Settings',
          Share: '📤 Share',
          Close: '✖️ Close',
        },
      },
    },
    children: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Base: Story = {
  args: {
    'aria-label': 'Settings',
    icon: Settings,
    size: 'md',
    appearance: 'base',
  },
};

export const AppearanceShowcase: Story = {
  render: () => (
    <div className='flex gap-8'>
      <IconButton
        aria-label='Add'
        icon={Plus}
        appearance='accent'
        tooltip
        tooltipPlacement='left'
      />
      <IconButton
        aria-label='Add'
        icon={Plus}
        appearance='base'
        tooltip
        tooltipPlacement='top'
      />
      <IconButton
        aria-label='Add'
        icon={Plus}
        appearance='gray'
        tooltip
        tooltipPlacement='bottom'
      />
      <IconButton
        aria-label='Add'
        icon={Plus}
        appearance='transparent'
        tooltip
      />
      <IconButton
        aria-label='Add'
        icon={Plus}
        appearance='no-background'
        tooltip
        tooltipPlacement='bottom'
      />
      <IconButton
        aria-label='Add'
        icon={Plus}
        appearance='red'
        tooltip
        tooltipPlacement='right'
      />
    </div>
  ),
};

export const SizesShowcase: Story = {
  render: () => (
    <div className='flex items-center gap-8'>
      <IconButton
        aria-label='Add to favorites'
        icon={Heart}
        size='xs'
        tooltip
      />
      <IconButton
        aria-label='Add to favorites'
        icon={Heart}
        size='sm'
        tooltip
      />
      <IconButton
        aria-label='Add to favorites'
        icon={Heart}
        size='md'
        tooltip
      />
      <IconButton
        aria-label='Add to favorites'
        icon={Heart}
        size='lg'
        tooltip
      />
    </div>
  ),
};

export const StatesShowcase: Story = {
  args: {
    appearance: 'base',
  },
  render: ({ appearance }) => (
    <div className='flex items-center gap-8'>
      <IconButton
        aria-label='Settings'
        appearance={appearance}
        icon={Settings}
        disabled
      />
      <IconButton
        aria-label='Settings'
        appearance={appearance}
        icon={Settings}
        loading
      />
    </div>
  ),
};

export const TooltipTextVariations: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <div className='flex gap-8'>
        <IconButton
          aria-label='Settings'
          icon={Settings}
          tooltip
          tooltipText='Configure application preferences and settings'
        />
        <IconButton
          aria-label='Share'
          icon={Share}
          tooltip
          tooltipText='Share this content with others'
        />
      </div>
      <div className='flex gap-8'>
        <IconButton
          aria-label='Add to favorites'
          icon={Heart}
          tooltip
          tooltipPlacement='left'
        />
        <IconButton
          aria-label='Close dialog'
          icon={Close}
          tooltip
          tooltipPlacement='bottom'
        />
      </div>
    </div>
  ),
};

export const AsChild: Story = {
  render: () => {
    const CustomLink = ({
      ref,
      to,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      to: string;
      ref?: React.Ref<HTMLAnchorElement>;
    }) => (
      <a ref={ref} href={to} {...props} />
    );
    CustomLink.displayName = 'CustomLink';

    return (
      <div className='flex gap-8'>
        <IconButton
          asChild
          aria-label='Go to home'
          icon={Home}
          appearance='accent'
          tooltip
        >
          <CustomLink to='/' />
        </IconButton>

        <IconButton
          asChild
          aria-label='Go to Ledger Shop'
          icon={ExternalLink}
          appearance='base'
          tooltip
        >
          <CustomLink
            to='https://shop.ledger.com'
            target='_blank'
            rel='noopener noreferrer'
          />
        </IconButton>
      </div>
    );
  },
  parameters: {
    docs: {
      source: {
        code: `
        <IconButton
          asChild
          aria-label='Go to home'
          icon={Home}
          appearance='accent'
          tooltip
        >
          <CustomLink to='/' />
        </IconButton>

        <IconButton
          asChild
          aria-label='Go to Ledger Shop'
          icon={ExternalLink}
          appearance='base'
          tooltip
        >
          <CustomLink to='https://shop.ledger.com' />
        </IconButton>

        `,
      },
    },
  },
};
