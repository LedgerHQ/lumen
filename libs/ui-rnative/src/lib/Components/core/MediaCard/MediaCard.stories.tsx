import CryptoIcon from '@ledgerhq/crypto-icons/native';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { Box, Text } from '../../primitives';
import { Button } from '../Button';
import { Tag } from '../Tag';
import { MediaCard, MediaCardTitle } from './MediaCard';

const meta = {
  component: MediaCard,
  subcomponents: { MediaCardTitle },
  id: 'rnative-mediacard',
  title: 'Core/MediaCard',
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
} satisfies Meta<typeof MediaCard>;

export default meta;
type Story = StoryObj<typeof MediaCard>;

const EXAMPLE_SRC =
  'https://ledger-wp-website-s3-prd.ledger.com/uploads/2026/03/hero_visual-1.webp';

const baseArgs = {
  imageUrl: EXAMPLE_SRC,
  children: null,
  onPress: () => ({}),
  onClose: () => ({}),
};

export const Base: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    imageUrl:
      'https://ledger-wp-website-s3-prd.ledger.com/uploads/2026/03/hero_visual-1.webp',
    children: null,
    onPress: () => ({}),
    onClose: () => ({}),
  },
  render: (args) => (
    <Box lx={{ width: 's320' }}>
      <MediaCard {...args}>
        <Tag label='Label' size='md' />
        <MediaCardTitle>
          Black Friday sale.
          <Text typography='heading3SemiBold' lx={{ color: 'active' }}>
            {' '}
            3 days with no fees{' '}
          </Text>
          on your transactions.
        </MediaCardTitle>
      </MediaCard>
    </Box>
  ),
};

export const LayoutShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    imageUrl: EXAMPLE_SRC,
    children: null,
  },
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        width: 's320',
        gap: 's16',
        padding: 's8',
      }}
    >
      <MediaCard {...baseArgs}>
        <Tag label='Label' size='md' />
        <MediaCardTitle>Full width card</MediaCardTitle>
      </MediaCard>
    </Box>
  ),
};

export const CompositionShowcase: Story = {
  parameters: { docs: { source: { type: 'dynamic' } } },
  args: {
    imageUrl: EXAMPLE_SRC,
    children: null,
  },
  render: () => (
    <Box
      lx={{
        flexDirection: 'column',
        width: 's320',
        gap: 's16',
        padding: 's8',
      }}
    >
      <MediaCard {...baseArgs}>
        <MediaCardTitle>Title only</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <Tag label='Promo' size='md' />
        <MediaCardTitle>With tag and title</MediaCardTitle>
      </MediaCard>

      <MediaCard {...baseArgs}>
        <CryptoIcon ledgerId='bitcoin' ticker='BTC' size={32} />
        <MediaCardTitle>With crypto icon</MediaCardTitle>
      </MediaCard>
    </Box>
  ),
};

export const WithClose: Story = {
  args: {
    imageUrl: EXAMPLE_SRC,
    children: null,
  },
  render: () => {
    const [visible, setVisible] = useState(true);

    if (!visible) {
      return (
        <Button
          appearance='transparent'
          size='sm'
          onPress={() => setVisible(true)}
        >
          Show card again
        </Button>
      );
    }

    return (
      <Box lx={{ width: 's320' }}>
        <MediaCard
          imageUrl={EXAMPLE_SRC}
          onPress={() => ({})}
          onClose={() => setVisible(false)}
        >
          <Tag label='Label' size='md' />
          <MediaCardTitle>
            Black Friday sale.
            <Text typography='heading3SemiBold' lx={{ color: 'active' }}>
              {' '}
              3 days with no fees{' '}
            </Text>
            on your transactions.
          </MediaCardTitle>
        </MediaCard>
      </Box>
    );
  },
};
