import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import {
  MediaBanner,
  MediaBannerDescription,
  MediaBannerTitle,
} from './MediaBanner';

const IMAGE_URL =
  'https://images.unsplash.com/photo-1663741954108-d15d514529ef';

const meta: Meta<typeof MediaBanner> = {
  component: MediaBanner,
  title: 'Communication/MediaBanner',
  subcomponents: {
    MediaBannerTitle,
    MediaBannerDescription,
  },
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
    imageUrl: {
      control: 'text',
      description: 'URL of the background image',
    },
    onClose: {
      action: 'closed',
    },
  },
};

export default meta;
type Story = StoryObj<typeof MediaBanner>;

export const Base: Story = {
  args: {
    imageUrl: IMAGE_URL,
  },
  render: (args) => (
    <div className='w-400'>
      <MediaBanner {...args}>
        <MediaBannerTitle>Firmware Update</MediaBannerTitle>
        <MediaBannerDescription>Keep your Nano updated!</MediaBannerDescription>
      </MediaBanner>
    </div>
  ),
};

export const Truncation: Story = {
  render: () => (
    <div className='w-400'>
      <MediaBanner imageUrl={IMAGE_URL} onClose={() => console.log('close')}>
        <MediaBannerTitle>
          Earn Up to 12% APY With Staking Now And Much More Rewards Awaiting You
        </MediaBannerTitle>
        <MediaBannerDescription>
          Put your idle crypto to work. Start staking SOL, ETH, ATOM and more
          directly from Ledger Live. Maximize your returns with our secure
          staking solutions.
        </MediaBannerDescription>
      </MediaBanner>
    </div>
  ),
};

export const WithClose: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <Button
          appearance='transparent'
          size='sm'
          onClick={() => setVisible(true)}
        >
          Show banner again
        </Button>
      );
    }

    return (
      <div className='w-400'>
        <MediaBanner imageUrl={IMAGE_URL} onClose={() => setVisible(false)}>
          <MediaBannerTitle>
            Earn Up to 12% APY With Staking Now!
          </MediaBannerTitle>
          <MediaBannerDescription>
            Put your idle crypto to work. Start staking SOL, ETH, ATOM and more
            directly from Ledger Live
          </MediaBannerDescription>
        </MediaBanner>
      </div>
    );
  },
};
