import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { Box } from '../Utility';
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
      control: 'select',
      description: 'Close action callback',
      options: ['With Close', 'None'],
      mapping: {
        'With Close': () => {
          console.log('Close clicked');
        },
        None: undefined,
      },
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
    <Box lx={{ maxWidth: 's400' }}>
      <MediaBanner {...args}>
        <MediaBannerTitle>Firmware Update</MediaBannerTitle>
        <MediaBannerDescription>Keep your Nano updated!</MediaBannerDescription>
      </MediaBanner>
    </Box>
  ),
  parameters: {
    docs: {
      source: {
        code: `
<MediaBanner imageUrl="https://images.unsplash.com/photo-1663741954108-d15d514529ef">
  <MediaBannerTitle>Firmware Update</MediaBannerTitle>
  <MediaBannerDescription>
    Keep your Nano updated!
  </MediaBannerDescription>
</MediaBanner>
`,
      },
    },
  },
};

export const Truncation: Story = {
  render: () => (
    <Box lx={{ maxWidth: 's400' }}>
      <MediaBanner imageUrl={IMAGE_URL}>
        <MediaBannerTitle>
          Earn Up to 12% APY With Staking Now And Much More Rewards Awaiting You
        </MediaBannerTitle>
        <MediaBannerDescription>
          Put your idle crypto to work. Start staking SOL, ETH, ATOM and more
          directly from Ledger Live. Maximize your returns with our secure
          staking solutions.
        </MediaBannerDescription>
      </MediaBanner>
    </Box>
  ),
};

export const WithBrokenImage: Story = {
  render: () => (
    <Box lx={{ maxWidth: 's400' }}>
      <MediaBanner imageUrl='https://broken-url.invalid/image.jpg'>
        <MediaBannerTitle>Sorry!</MediaBannerTitle>
        <MediaBannerDescription>
          The image failed to load so the banner decided to gracefully hide it.
        </MediaBannerDescription>
      </MediaBanner>
    </Box>
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
          onPress={() => setVisible(true)}
        >
          Show banner
        </Button>
      );
    }

    return (
      <Box lx={{ maxWidth: 's400' }}>
        <MediaBanner imageUrl={IMAGE_URL} onClose={() => setVisible(false)}>
          <MediaBannerTitle>
            Earn Up to 12% APY With Staking Now!
          </MediaBannerTitle>
          <MediaBannerDescription>
            Put your idle crypto to work. Start staking SOL, ETH, ATOM and more
            directly from Ledger Live
          </MediaBannerDescription>
        </MediaBanner>
      </Box>
    );
  },
};
